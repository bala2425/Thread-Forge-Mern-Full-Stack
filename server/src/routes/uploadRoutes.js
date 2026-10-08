import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const uploadDirectory = path.resolve(currentDirectory, '../uploads');
fs.mkdirSync(uploadDirectory, { recursive: true });
const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (_req, file, callback) => {
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '-')}`;
    callback(null, safeName);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (_req, file, callback) => {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.mimetype)) return callback(new Error('Only PNG, JPEG and WebP images are supported'));
  callback(null, true);
} });

router.post('/', protect, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'An image file is required' });
  res.status(201).json({ url: `/uploads/${req.file.filename}`, name: req.file.originalname, size: req.file.size });
}));

export default router;
