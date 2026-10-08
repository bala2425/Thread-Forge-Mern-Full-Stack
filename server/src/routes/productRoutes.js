import { Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import { adminOnly, protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const { category, color, size, minPrice, maxPrice, search, page = 1, limit = 12 } = req.query;
  const filter = { status: 'active' };
  if (category) filter.category = category;
  if (color) filter.colors = color;
  if (size) filter.sizes = size;
  if (minPrice || maxPrice) filter.price = { $gte: Number(minPrice) || 0, $lte: Number(maxPrice) || Infinity };
  if (search) filter.$text = { $search: search };
  const products = await Product.find(filter).sort({ featured: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit);
  const total = await Product.countDocuments(filter);
  res.json({ products, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } });
}));

router.get('/:id', param('id').isMongoId(), asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, status: 'active' });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}));

router.post('/', protect, adminOnly, body('name').trim().notEmpty(), body('category').trim().notEmpty(), body('price').isFloat({ min: 0 }), body('stock').isInt({ min: 0 }), asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
}));

router.put('/:id', protect, adminOnly, param('id').isMongoId(), asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}));

router.delete('/:id', protect, adminOnly, param('id').isMongoId(), asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).send();
}));

export default router;
