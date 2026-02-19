/**
 * Upload Middleware for Express (Multer)
 * - Handles single & multiple file uploads
 * - Restricts file types and size for security
 * - Stores files in /storage/projects/
 * - Attaches file info to req.file or req.files
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure storage directory exists
const storageDir = path.resolve(__dirname, '..', 'storage', 'projects');
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

// Allowed file types
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, storageDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + ext);
  }
});

function fileFilter(req, file, cb) {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type! Only images are allowed.'));
  }
  cb(null, true);
}

const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 4 * 1024 * 1024, // 4MB max
  }
});

module.exports = uploadMiddleware;