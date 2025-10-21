const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { authenticateToken } = require('./auth');

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'cursos');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ok = /image\/(jpeg|png|webp|jpg)/.test(file.mimetype);
    cb(ok ? null : new Error('Formato no permitido (JPG/PNG/WEBP)'), ok);
  }
});

// POST /uploads/image -> { success, url, filename }
router.post('/image', authenticateToken, upload.single('image'), (req, res) => {
  const base = process.env.PUBLIC_BASE_URL || '';
  const url = `${base}/static/cursos/${req.file.filename}`;
  res.json({ success: true, url, filename: req.file.filename });
});

module.exports = router;
