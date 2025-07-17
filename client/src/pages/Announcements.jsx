import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/UI/Button';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({}); // { announcementId: [comments] }
  const [commentInputs, setCommentInputs] = useState({}); // { announcementId: { name, content } }
  const [commentLoading, setCommentLoading] = useState({}); // { announcementId: bool }
  // Removed annForm, annFormOpen, annFormLoading
  const { isAdmin, isPublicUser, user } = useAuth();

  // Fetch announcements
  useEffect(() => {
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
    fetchAnnouncements();
  }, []);

  // Fetch comments for an announcement
  const fetchComments = async (announcementId) => {
    try {
      const res = await api.get(`/comments?announcementId=${announcementId}`);
      setComments((prev) => ({ ...prev, [announcementId]: res.data.data || [] }));
    } catch (err) {
      setComments((prev) => ({ ...prev, [announcementId]: [] }));
    }
  };

  // On announcements load, fetch comments for each
  useEffect(() => {
    announcements.forEach((ann) => {
      fetchComments(ann._id);
    });
    // eslint-disable-next-line
  }, [announcements.length]);

  // Handle comment input change
  const handleCommentInput = (id, e) => {
    setCommentInputs((prev) => ({
      ...prev,
      [id]: { ...prev[id], [e.target.name]: e.target.value }
    }));
  };

  // Add comment
  const handleAddComment = async (announcementId) => {
    setCommentLoading((prev) => ({ ...prev, [announcementId]: true }));
    try {
      const input = commentInputs[announcementId] || {};
      await api.post('/comments', {
        announcementId,
        name: user?.name || input.name,
        content: input.content
      });
      setCommentInputs((prev) => ({ ...prev, [announcementId]: { name: '', content: '' } }));
      fetchComments(announcementId);
    } catch (err) {
      // error toast handled globally
    } finally {
      setCommentLoading((prev) => ({ ...prev, [announcementId]: false }));
    }
  };

  // Delete comment (admin)
  const handleDeleteComment = async (commentId, announcementId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      fetchComments(announcementId);
    } catch (err) {}
  };

  // Delete announcement (admin)
  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await api.delete(`/announcements/${id}`);
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {}
  };

  // Add announcement (admin)
  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    // setAnnFormLoading(true); // Removed
    try {
      const res = await api.post('/announcements', annForm);
      setAnnouncements((prev) => [res.data.data, ...prev]);
      setAnnForm({ title: '', body: '' });
      setAnnFormOpen(false);
    } catch (err) {
      // setAnnFormLoading(false); // Removed
    }
    // setAnnFormLoading(false); // Removed
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Announcements</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Stay updated with latest news and updates
        </p>
        {/* Removed add announcement button */}
      </motion.div>
      {/* Removed add announcement form and button */}
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
        ) : announcements.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No announcements found.
          </div>
        ) : (
          <div className="space-y-8">
            {announcements.map(ann => (
              <div key={ann._id} className="rounded-lg shadow border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">{ann.title}</span>
                  <span className="text-xs text-gray-400">{new Date(ann.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-gray-700 dark:text-gray-200 text-sm mb-2">{ann.body || ann.message}</div>
                {/* Comments Section */}
                <div className="mt-4">
                  <div className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Comments</div>
                  {comments[ann._id] && comments[ann._id].length > 0 ? (
                    <div className="space-y-2">
                      {comments[ann._id].map(comment => (
                        <div key={comment._id} className="flex items-start gap-2 bg-white dark:bg-gray-800 rounded p-2 border border-gray-100 dark:border-gray-700">
                          <div className="flex-1">
                            <div className="text-xs font-bold text-blue-700 dark:text-blue-300">{comment.name}</div>
                            <div className="text-sm text-gray-700 dark:text-gray-200">{comment.content}</div>
                            <div className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">No comments yet.</div>
                  )}
                  {/* Add Comment Form for public users only */}
                  {isPublicUser() && (
                    <form
                      className="mt-2 flex flex-col gap-2"
                      onSubmit={e => {
                        e.preventDefault();
                        handleAddComment(ann._id);
                      }}
                    >
                      {/* If user has a name, hide name input */}
                      {!user?.name && (
                        <input
                          className="input"
                          name="name"
                          placeholder="Your name"
                          value={commentInputs[ann._id]?.name || ''}
                          onChange={e => handleCommentInput(ann._id, e)}
                          required
                        />
                      )}
                      <textarea
                        className="input"
                        name="content"
                        placeholder="Add a comment..."
                        value={commentInputs[ann._id]?.content || ''}
                        onChange={e => handleCommentInput(ann._id, e)}
                        required
                        rows={2}
                      />
                      <Button
                        type="submit"
                        size="sm"
                        loading={commentLoading[ann._id]}
                        className="self-end"
                      >
                        Comment
                      </Button>
                    </form>
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

export default Announcements; 