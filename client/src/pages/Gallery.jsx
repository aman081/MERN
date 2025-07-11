import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await api.get('/photos');
        setPhotos(res.data.data || []);
      } catch (err) {
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

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
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Gallery; 