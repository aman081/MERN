import { useEffect, useState, useRef, useEffect as useEffectReact } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const sportsOptions = [
  'Cricket', 'Football', 'Basketball', 'Volleyball', 'Badminton', 'TableTennis', 'Athletics', 'Hockey', 'Chess', 'LawnTennis', 'Marathon', 'Yoga', 'Parade'
];
const branchOptions = [
  'CSE', 'ECE', 'CE', 'ME', 'EE', 'MME', 'PIE+ECM'
];

const Gallery = () => {
  const { isAdmin } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    file: null,
    caption: '',
    sportsTag: '',
    branchTags: []
  });
  const [filter, setFilter] = useState({ sportsTag: '', branchTag: '' });
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const branchDropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffectReact(() => {
    function handleClickOutside(event) {
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target)) {
        setBranchDropdownOpen(false);
      }
    }
    if (branchDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [branchDropdownOpen]);

  const fetchPhotos = async (filter = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.sportsTag) params.append('sportsTag', filter.sportsTag);
      if (filter.branchTag) params.append('branchTag', filter.branchTag);
      const res = await api.get(`/photos?${params.toString()}`);
      setPhotos(res.data.data || []);
    } catch (err) {
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos(filter);
    // eslint-disable-next-line
  }, [filter]);

  const handleBranchTagsChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setUploadForm(f => ({ ...f, branchTags: selected }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file || !uploadForm.sportsTag) {
      toast.error('Image and sports tag are required');
      return;
    }
    setUploading(true);
    try {
      // 1. Upload to Cloudinary via backend
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      // Use backend endpoint for direct upload
      const cloudRes = await api.post('/photos/cloudinary-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (!cloudRes.data.success) throw new Error('Cloudinary upload failed');
      // 2. Save photo record
      await api.post('/photos', {
        url: cloudRes.data.url,
        caption: uploadForm.caption,
        sportsTag: uploadForm.sportsTag,
        branchTags: uploadForm.branchTags
      });
      toast.success('Photo uploaded!');
      setUploadForm({ file: null, caption: '', sportsTag: '', branchTags: [] });
      fetchPhotos(filter);
    } catch (err) {
      toast.error('Upload failed');
    }
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Photo Gallery</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Browse photos from past events
        </p>
      </motion.div>
      {/* Admin Upload UI */}
      {isAdmin && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700 mb-4">
          <h2 className="text-lg font-bold mb-2">Upload Photo</h2>
          <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 items-center">
            <input type="file" accept="image/*" onChange={e => setUploadForm(f => ({ ...f, file: e.target.files[0] }))} required className="input" />
            <input type="text" placeholder="Caption" value={uploadForm.caption} onChange={e => setUploadForm(f => ({ ...f, caption: e.target.value }))} className="input" />
            <select value={uploadForm.sportsTag} onChange={e => setUploadForm(f => ({ ...f, sportsTag: e.target.value }))} required className="input">
              <option value="">Select Sport</option>
              {sportsOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {/* Branch multi-select dropdown */}
            <div className="relative" ref={branchDropdownRef}>
              <button
                type="button"
                className="input flex items-center gap-2 min-w-[120px]"
                onClick={() => setBranchDropdownOpen((v) => !v)}
              >
                {uploadForm.branchTags.length === 0 ? 'Select Branches' : uploadForm.branchTags.join(', ')}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {branchDropdownOpen && (
                <div className="absolute z-10 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow p-2 w-48 max-h-56 overflow-y-auto">
                  {branchOptions.map(b => (
                    <label key={b} className="flex items-center gap-2 text-sm py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={uploadForm.branchTags.includes(b)}
                        onChange={e => {
                          if (e.target.checked) {
                            setUploadForm(f => ({ ...f, branchTags: [...f.branchTags, b] }));
                          } else {
                            setUploadForm(f => ({ ...f, branchTags: f.branchTags.filter(tag => tag !== b) }));
                          }
                        }}
                      />
                      {b}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-primary" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
          </form>
        </div>
      )}
      {/* Filter UI */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select value={filter.sportsTag} onChange={e => setFilter(f => ({ ...f, sportsTag: e.target.value }))} className="input">
          <option value="">All Sports</option>
          {sportsOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filter.branchTag} onChange={e => setFilter(f => ({ ...f, branchTag: e.target.value }))} className="input">
          <option value="">All Branches</option>
          {branchOptions.filter(b => b).map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <button className="btn btn-secondary" onClick={() => setFilter({ sportsTag: '', branchTag: '' })}>Clear Filters</button>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-8"
      >
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No photos found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {photos.map(photo => (
              <div key={photo._id} className="rounded-lg overflow-hidden shadow border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <img src={photo.url} alt={photo.caption} className="w-full h-48 object-cover" />
                <div className="p-3 text-sm text-gray-700 dark:text-gray-200 text-center">{photo.caption}</div>
                <div className="px-3 pb-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                  <span className="mr-2">{photo.sportsTag}</span>
                  {photo.branchTags && photo.branchTags.length > 0 && (
                    <span>| {photo.branchTags.join(', ')}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Gallery; 