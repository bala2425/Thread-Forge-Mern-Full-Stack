import { Router } from 'express';
import { body } from 'express-validator';
import CustomDesign from '../models/CustomDesign.js';
import { adminOnly, protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', protect, asyncHandler(async (req, res) => res.json(await CustomDesign.find().sort({ createdAt: -1 }))));
router.post('/', protect, body('name').trim().notEmpty(), body('type').isIn(['text', 'image', 'logo']), asyncHandler(async (req, res) => res.status(201).json(await CustomDesign.create(req.body))));
router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  await CustomDesign.findByIdAndDelete(req.params.id);
  res.status(204).send();
}));

export default router;
