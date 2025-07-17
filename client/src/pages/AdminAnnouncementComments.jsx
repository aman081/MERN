import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Button from '../components/UI/Button';

const AdminAnnouncementComments = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/comments?announcementId=${id}`);
        setComments(res.data.data || []);
      } catch (err) {
        setComments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [id]);

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments => comments.filter(c => c._id !== commentId));
    } catch (err) {}
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Manage Comments</h2>
      {comments.length === 0 ? (
        <div className="text-center text-gray-500">No comments found.</div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment._id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded p-3 border border-gray-200 dark:border-gray-700">
              <div>
                <div className="text-xs font-bold text-blue-700 dark:text-blue-300">{comment.name}</div>
                <div className="text-sm text-gray-700 dark:text-gray-200">{comment.content}</div>
                <div className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</div>
              </div>
              <Button variant="danger" size="sm" onClick={() => handleDelete(comment._id)}>Delete</Button>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={() => navigate(`/admin/announcements/${id}`)}>Back to Announcement</Button>
      </div>
    </div>
  );
};

export default AdminAnnouncementComments; 