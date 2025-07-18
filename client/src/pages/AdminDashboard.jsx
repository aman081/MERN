import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useEvents } from '../contexts/EventContext';
import { api } from '../services/api';
import Button from '../components/UI/Button';
import { Dialog } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';


const TABS = [
  { key: 'events', label: 'Events' },
  { key: 'announcements', label: 'Announcements' },
  { key: 'photos', label: 'Photos' },
];

const statusColors = {
  Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Concluded: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

const ALL_BRANCHES = ['CSE', 'ECE', 'CE', 'ME', 'EE', 'MME', 'PIE+ECM'];

const AdminDashboard = () => {
  const [tab, setTab] = useState('events');
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage events, announcements, photos, and comments
        </p>
        <div className="flex gap-2 mt-4">
          {TABS.map((t) => (
            <Button
              key={t.key}
              variant={tab === t.key ? 'primary' : 'secondary'}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </motion.div>
      {/* Leaderboard Modal */}
      {/* Remove all leaderboardModalOpen, leaderboardLoading, leaderboardError, leaderboardSuccess, manualPoints, manualLoading, manualError, manualSuccess, handleClearLeaderboard, handleManualPointsChange, handleManualPointsSubmit, and the Dialog/modal rendering. */}
      <div>
        {tab === 'events' && <EventsAdmin />}
        {tab === 'announcements' && <AnnouncementsAdmin />}
        {tab === 'photos' && <PhotosAdmin />}
      </div>
    </div>
  );
};

// --- Events Admin Tab ---
const EventsAdmin = () => {
  const { events, loading, createEvent, updateEvent, deleteEvent, updateEventStatus, addWinners, fetchEvents } = useEvents();
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', day: '', time: '', venue: '', branchTags: [], gameType: '', category: 'Boys', eventType: 'Individual', points: { first: 0, second: 0, third: 0 }, status: 'Upcoming', coverImage: ''
  });
  const [editId, setEditId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const navigate = useNavigate();

  const handleEdit = (event) => {
    setForm({ ...event, day: event.day?.slice(0, 10) });
    setEditId(event._id);
    setFormOpen(true);
    setImagePreview(event.coverImage || '');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    await deleteEvent(id);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    let coverImageUrl = form.coverImage;
    if (imageFile) {
      // Upload image to Cloudinary
      const data = new FormData();
      data.append('file', imageFile);
      try {
        const res = await api.post('/photos/cloudinary-upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        coverImageUrl = res.data.url;
      } catch (err) {
        alert('Image upload failed.');
        setFormLoading(false);
        return;
      }
    }
    const eventPayload = { ...form, coverImage: coverImageUrl };
    if (editId) {
      await updateEvent(editId, eventPayload);
    } else {
      await createEvent(eventPayload);
    }
    setForm({ name: '', description: '', day: '', time: '', venue: '', branchTags: [], gameType: '', category: 'Boys', eventType: 'Individual', points: { first: 0, second: 0, third: 0 }, status: 'Upcoming', coverImage: '' });
    setEditId(null);
    setFormOpen(false);
    setFormLoading(false);
    setImageFile(null);
    setImagePreview('');
  };

  // Status change handlers
  const handleStart = async (event) => {
    await updateEventStatus(event._id, 'Active');
  };
  const handleConclude = (event) => {
    navigate(`/admin/events/${event._id}/conclude`);
  };

  // Sort events: Active, Upcoming, Concluded
  const statusOrder = ['Active', 'Upcoming', 'Concluded'];
  const sortedEvents = [...events].sort((a, b) => {
    return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
  });

  const GAME_TYPES = [
    'Cricket', 'Football', 'Basketball', 'Volleyball', 'Badminton', 'TableTennis', 'Athletics', 'Hockey', 'Chess', 'LawnTennis', 'Marathon', 'Yoga', 'Parade', 'TOW', 'Field'
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Events</h2>
        <Button variant="primary" onClick={() => { setFormOpen((v) => !v); setEditId(null); }}>
          {formOpen ? 'Cancel' : 'Add Event'}
        </Button>
      </div>
      {formOpen && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-4 shadow space-y-4">
          {/* Event Image Upload - moved to top and styled */}
          <div className="mb-4 flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-xl p-4 bg-blue-50 dark:bg-blue-900/20">
            <label className="block text-base font-semibold text-blue-700 dark:text-blue-200 mb-2">Event Image (optional)</label>
            <span className="text-xs text-gray-500 mb-2">Upload a cover image for this event. If not provided, a default image will be shown.</span>
            <input type="file" accept="image/*" onChange={handleImageChange} className="mb-2" />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="rounded-lg max-h-40 border shadow" />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input className="input" placeholder="Event Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Venue</label>
              <input className="input" placeholder="Venue" value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input className="input" type="date" value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <input className="input" placeholder="Time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Game Type</label>
              <select className="input" value={form.gameType} onChange={e => setForm(f => ({ ...f, gameType: e.target.value }))} required>
                <option value="">Select Game</option>
                {GAME_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required>
                <option value="Boys">Boys</option>
                <option value="Girls">Girls</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Event Type</label>
              <select className="input" value={form.eventType} onChange={e => setForm(f => ({ ...f, eventType: e.target.value }))} required>
                <option value="Individual">Individual</option>
                <option value="Team">Team</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Branch Tags (comma separated)</label>
              <input className="input" placeholder="e.g. CSE, ECE" value={form.branchTags.join(', ')} onChange={e => setForm(f => ({ ...f, branchTags: e.target.value.split(',').map(s => s.trim()) }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <input className="input" value={form.status} readOnly />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">1st Points</label>
              <input className="input" type="number" placeholder="1st Points" value={form.points.first} onChange={e => setForm(f => ({ ...f, points: { ...f.points, first: Number(e.target.value) } }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">2nd Points</label>
              <input className="input" type="number" placeholder="2nd Points" value={form.points.second} onChange={e => setForm(f => ({ ...f, points: { ...f.points, second: Number(e.target.value) } }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">3rd Points</label>
              <input className="input" type="number" placeholder="3rd Points" value={form.points.third} onChange={e => setForm(f => ({ ...f, points: { ...f.points, third: Number(e.target.value) } }))} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea className="input" placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required rows={2} />
          </div>
          <Button type="submit" variant="primary" loading={formLoading}>{editId ? 'Update' : 'Add'} Event</Button>
        </form>
      )}
      {/* Responsive Table/Card Layout */}
      <div className="space-y-4">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto rounded-xl shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-500 dark:text-gray-300 uppercase">Name</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-500 dark:text-gray-300 uppercase">Date</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-500 dark:text-gray-300 uppercase">Status</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-center py-4">Loading...</td></tr>
              ) : sortedEvents.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-4">No events found.</td></tr>
              ) : sortedEvents.map(event => (
                <tr key={event._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">
                  <td className="px-4 py-2 font-semibold text-gray-900 dark:text-white">{event.name}</td>
                  <td className="px-4 py-2">{new Date(event.day).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <span className={`badge font-bold ${statusColors[event.status]}`}>{event.status}</span>
                  </td>
                  <td className="px-4 py-2 flex gap-2 flex-wrap">
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(event)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(event._id)}>Delete</Button>
                    {event.status === 'Upcoming' && (
                      <Button size="sm" variant="success" onClick={() => handleStart(event)}>Start</Button>
                    )}
                    {event.status === 'Active' && (
                      <Button size="sm" variant="primary" onClick={() => handleConclude(event)}>Conclude</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Card/List Layout */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : sortedEvents.length === 0 ? (
            <div className="text-center py-4">No events found.</div>
          ) : sortedEvents.map(event => (
            <div key={event._id} className="rounded-lg shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900 dark:text-white">{event.name}</span>
                <span className={`badge font-bold ${statusColors[event.status]}`}>{event.status}</span>
              </div>
              <div className="text-xs text-gray-500 mb-1">{new Date(event.day).toLocaleDateString()}</div>
              <div className="flex gap-2 flex-wrap mt-2">
                <Button size="sm" variant="secondary" onClick={() => handleEdit(event)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(event._id)}>Delete</Button>
                {event.status === 'Upcoming' && (
                  <Button size="sm" variant="success" onClick={() => handleStart(event)}>Start</Button>
                )}
                {event.status === 'Active' && (
                  <Button size="sm" variant="primary" onClick={() => handleConclude(event)}>Conclude</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Announcements Admin Tab ---
const AnnouncementsAdmin = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ title: '', body: '' });
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch announcements
  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await api.get('/announcements');
      setAnnouncements(res.data.data || []);
    } catch (err) {
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await api.post('/announcements', form);
      setForm({ title: '', body: '' });
      setFormOpen(false);
      fetchAnnouncements();
    } catch (err) {}
    setFormLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Announcements</h2>
        <Button variant="primary" onClick={() => setFormOpen(v => !v)}>
          {formOpen ? 'Cancel' : 'Add Announcement'}
        </Button>
      </div>
      {formOpen && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-4 shadow space-y-4">
          <input className="input" placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          <textarea className="input" placeholder="Body" value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} required rows={2} />
          <Button type="submit" variant="primary" loading={formLoading}>Add Announcement</Button>
        </form>
      )}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-4">No announcements found.</div>
        ) : announcements.map(ann => (
          <div key={ann._id} className="rounded-lg shadow border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">{ann.title}</span>
              <span className="text-xs text-gray-400">{new Date(ann.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="text-gray-700 dark:text-gray-200 text-sm mb-2">{ann.body || ann.message}</div>
            <div className="flex gap-2 mb-2">
              <Button size="sm" variant="secondary" onClick={() => navigate(`/admin/announcements/${ann._id}`)}>Edit</Button>
              <Button size="sm" variant="danger" onClick={() => navigate(`/admin/announcements/${ann._id}`)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Photos Admin Tab ---
const PhotosAdmin = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  // Remove formOpen, form, editId, formLoading, handleEdit, handleSubmit

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/photos');
      setPhotos(res.data.data || []);
    } catch (err) {
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    await api.delete(`/photos/${id}`);
    fetchPhotos();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Photos</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-4">Loading...</div>
        ) : photos.length === 0 ? (
          <div className="col-span-full text-center py-4">No photos found.</div>
        ) : photos.map(photo => (
          <div key={photo._id} className="rounded-lg overflow-hidden shadow border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <img src={photo.url} alt={photo.caption} className="w-full h-48 object-cover" />
            <div className="p-3 text-sm text-gray-700 dark:text-gray-200 text-center">{photo.caption}</div>
            <div className="flex gap-2 p-2">
              <Button size="sm" variant="danger" onClick={() => handleDelete(photo._id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard; 