import { Router } from 'express';
import { body, param } from 'express-validator';
import Banner from '../models/Banner.js';
import { adminOnly, protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.get('/', asyncHandler(async (_req, res) => res.json(await Banner.find({ active: true }).sort({ position: 1 }))));
router.post('/', protect, adminOnly, body('title').trim().notEmpty(), body('description').trim().notEmpty(), body('image').isURL(), asyncHandler(async (req, res) => res.status(201).json(await Banner.create(req.body))));
router.put('/:id', protect, adminOnly, param('id').isMongoId(), asyncHandler(async (req, res) => res.json(await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }))));
router.delete('/:id', protect, adminOnly, param('id').isMongoId(), asyncHandler(async (req, res) => { await Banner.findByIdAndDelete(req.params.id); res.status(204).send(); }));

export default router;
