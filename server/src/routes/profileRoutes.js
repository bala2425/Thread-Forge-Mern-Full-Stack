import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(protect);
router.get('/', asyncHandler(async (req, res) => res.json(req.user)));
router.put('/profile', body('name').trim().isLength({ min: 2 }), asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const user = await User.findByIdAndUpdate(req.user._id, { name: req.body.name }, { new: true }).select('-password');
  res.json(user);
}));
router.put('/addresses', body('line1').trim().notEmpty(), body('city').trim().notEmpty(), body('postalCode').trim().notEmpty(), asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const user = await User.findById(req.user._id);
  const address = { label: req.body.label || 'Home', ...req.body };
  user.addresses.push(address);
  await user.save({ validateBeforeSave: false });
  res.json(user);
}));

export default router;
