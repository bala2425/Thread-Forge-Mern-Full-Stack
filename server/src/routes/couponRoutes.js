import { Router } from 'express';
import { body, param } from 'express-validator';
import Coupon from '../models/Coupon.js';
import { adminOnly, protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.get('/', asyncHandler(async (_req, res) => res.json(await Coupon.find({ active: true, $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }] }))));
router.post('/', protect, adminOnly, body('code').trim().notEmpty().isLength({ max: 20 }), body('discountType').isIn(['percentage', 'fixed']), body('discountValue').isFloat({ min: 0 }), asyncHandler(async (req, res) => res.status(201).json(await Coupon.create(req.body))));
router.put('/:id', protect, adminOnly, param('id').isMongoId(), asyncHandler(async (req, res) => res.json(await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }))));
router.delete('/:id', protect, adminOnly, param('id').isMongoId(), asyncHandler(async (req, res) => { await Coupon.findByIdAndDelete(req.params.id); res.status(204).send(); }));

export default router;
