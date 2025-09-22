// routes/uploads.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// configure multer (disk storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  }
});

function fileFilter(req, file, cb) {
  const allowed = /jpeg|jpg|png|gif/;
  if (allowed.test(file.mimetype)) cb(null, true);
  else cb(new Error('Only image files (jpeg, png, gif) are allowed'));
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter
});

// 1) Public upload — returns URL to stored file
// POST /api/uploads  (form-data: key "file")
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'File not provided' });
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(201).json({ url, filename: req.file.filename });
});

// 2) Upload & set as profile avatar (protected)
// POST /api/uploads/profile  (Authorization: Bearer <token>, form-data: key "file")
router.post('/profile', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File not provided' });
    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user.id, { avatarUrl: url }, { new: true }).select('-password');
    res.status(200).json({ message: 'Profile image uploaded', avatarUrl: url, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 3) Upload for posts (protected) -> return URL (frontend can then include imageUrl in POST /api/posts)
// POST /api/uploads/post (Authorization: Bearer <token>, form-data: key "file")
router.post('/post', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'File not provided' });
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(201).json({ url, filename: req.file.filename });
});

module.exports = router;
