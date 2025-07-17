const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const photoController = require('../controllers/photoController');
const { uploadImage } = require('../utils/cloudinary');
const multer = require('multer');
const upload = multer();

const router = express.Router();

// Public routes
router.get('/', photoController.getPhotos);
router.get('/:id', photoController.getPhoto);

// Admin routes (protected)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('url').isURL().withMessage('Valid image URL is required'),
  body('sportsTag').isString().notEmpty().withMessage('Sports tag is required'),
  body('branchTags').optional().isArray(),
  body('branchTags.*').optional().isString(),
  body('caption').optional().isString()
], photoController.uploadPhoto);

router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('url').optional().isURL().withMessage('Valid image URL is required'),
  body('sportsTag').optional().isString().notEmpty().withMessage('Sports tag is required'),
  body('branchTags').optional().isArray(),
  body('branchTags.*').optional().isString(),
  body('caption').optional().isString()
], photoController.updatePhoto);

router.delete('/:id', [
  authenticateToken,
  requireAdmin
], photoController.deletePhoto);

// Admin Cloudinary upload endpoint
router.post('/cloudinary-upload', authenticateToken, requireAdmin, upload.single('file'), async (req, res) => {
 
  if (!req.file) {
   
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  try {
    
    const result = await uploadImage(req.file.buffer);
   
    if (!result.success) {
      
      return res.status(500).json({ success: false, message: result.error });
    }
    res.json({ success: true, url: result.url, public_id: result.public_id });
  } catch (error) {
   
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router; 