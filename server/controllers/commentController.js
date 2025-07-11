const Comment = require('../models/Comment');

// Create comment
const createComment = async (req, res) => {
  try {
    const { announcementId, name, content } = req.body;
    const userId = req.user._id;
    const comment = new Comment({ announcementId, userId, name, content });
    await comment.save();
    res.status(201).json({ success: true, data: comment, message: 'Comment created' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating comment', error: error.message });
  }
};

// Get all comments (optionally by announcement)
const getComments = async (req, res) => {
  try {
    const { announcementId } = req.query;
    const filter = announcementId ? { announcementId } : {};
    const comments = await Comment.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching comments', error: error.message });
  }
};

// Delete comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting comment', error: error.message });
  }
};

module.exports = {
  createComment,
  getComments,
  deleteComment
}; 