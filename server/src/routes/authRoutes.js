import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const tokenFor = user => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
const sendToken = (res, user) => res.json({ token: tokenFor(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });

router.post('/register', body('name').trim().isLength({ min: 2 }), body('email').isEmail().normalizeEmail(), body('password').isLength({ min: 8 }), asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const existing = await User.findOne({ email: req.body.email });
  if (existing) return res.status(409).json({ message: 'An account with this email already exists' });
  const user = await User.create({ name: req.body.name, email: req.body.email, password: req.body.password });
  sendToken(res, user);
}));

router.post('/login', body('email').isEmail().normalizeEmail(), body('password').notEmpty(), asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password))) return res.status(401).json({ message: 'Invalid email or password' });
  sendToken(res, user);
}));

router.get('/me', protect, asyncHandler(async (req, res) => res.json(req.user)));

export default router;
