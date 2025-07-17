import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Button from '../components/UI/Button';

const AdminAnnouncementDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ title: '', body: '' });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/announcements/${id}`);
        setAnnouncement(res.data.data);
        setForm({ title: res.data.data.title, body: res.data.data.body });
      } catch (err) {
        setAnnouncement(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [id]);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => setEditMode(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await api.put(`/announcements/${id}`, form);
      setAnnouncement(a => ({ ...a, ...form }));
      setEditMode(false);
    } catch (err) {}
    setFormLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await api.delete(`/announcements/${id}`);
      navigate('/admin');
    } catch (err) {}
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!announcement) return <div className="text-center py-12 text-gray-500">Announcement not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow mt-8">
      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input className="input" name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Body</label>
            <textarea className="input" name="body" value={form.body} onChange={handleChange} required rows={3} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="primary" loading={formLoading}>Save</Button>
            <Button type="button" variant="secondary" onClick={handleCancel}>Cancel</Button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{announcement.title}</h2>
            <span className="text-xs text-gray-400">{new Date(announcement.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="text-gray-700 dark:text-gray-200 mb-4">{announcement.body || announcement.message}</div>
          <div className="flex gap-2 mb-4">
            <Button variant="secondary" onClick={handleEdit}>Edit</Button>
            <Button variant="primary" onClick={() => navigate(`/admin/announcements/${id}/comments`)}>Manage Comments</Button>
            <Button variant="outline" onClick={() => navigate('/admin')}>Back</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAnnouncementDetail; 