import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { adminOnly, protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(protect, adminOnly);
router.get('/customers', asyncHandler(async (_req, res) => {
  const customers = await User.find({}, { password: 0, cart: 0 }).select('name email role createdAt').sort({ createdAt: -1 });
  res.json(customers);
}));
router.patch('/customers/:id/role', param('id').isMongoId(), body('role').isIn(['customer', 'admin']), asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'Customer not found' });
  res.json(user);
}));
router.get('/orders', asyncHandler(async (_req, res) => res.json(await Order.find().sort({ createdAt: -1 }).populate('user', 'name email'))));
router.patch('/orders/:id/status', param('id').isMongoId(), body('status').isIn(['placed', 'processing', 'shipped', 'delivered', 'cancelled']), asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
}));
router.get('/inventory', asyncHandler(async (_req, res) => res.json(await Product.find({}, { name: 1, stock: 1, status: 1 }).sort({ createdAt: -1 }))));
router.get('/dashboard', asyncHandler(async (_req, res) => {
  const [recentOrders, products, customers] = await Promise.all([
    Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
    Product.find().countDocuments(),
    User.find().countDocuments()
  ]);
  const revenue = await Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]);
  res.json({
    revenue: revenue[0]?.total || 0,
    orders: await Order.countDocuments(),
    products,
    customers,
    recentOrders
  });
}));

export default router;
