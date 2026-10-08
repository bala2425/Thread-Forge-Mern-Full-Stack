import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { adminOnly, protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { calculateOrderTotals, validateCustomDesign } from '../utils/orderValidation.js';

const router = Router();

router.get('/', protect, asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
}));

router.post('/place', protect, body('items').isArray({ min: 1 }), body('deliveryAddress.line1').notEmpty(), asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const productIds = req.body.items.map(item => item.product);
  const products = await Product.find({ _id: { $in: productIds }, status: 'active' });
  const productMap = new Map(products.map(product => [String(product._id), product]));
  const items = req.body.items.map(item => {
    const product = productMap.get(String(item.product));
    if (!product) throw Object.assign(new Error('One or more products are unavailable'), { status: 400 });
    if (!product.sizes?.includes(item.size) || !product.colors?.includes(item.color)) {
      throw Object.assign(new Error('The selected size or colour is unavailable'), { status: 400 });
    }
    if (!Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1) throw Object.assign(new Error('Invalid quantity'), { status: 400 });
    if (Number(item.quantity) > product.stock) throw Object.assign(new Error(`${product.name} is out of stock`), { status: 409 });
    if (item.custom) {
      validateCustomDesign(item.custom);
    }
    return { ...item, name: product.name, price: product.price, product: product._id };
  });
  const totals = calculateOrderTotals(items);
  const order = await Order.create({
    user: req.user._id,
    items,
    ...totals,
    paymentMethod: req.body.paymentMethod,
    paymentStatus: 'pending',
    status: 'placed',
    deliveryAddress: req.body.deliveryAddress
  });
  await Promise.all(items.map(item => Product.updateOne({ _id: item.product, stock: { $gte: item.quantity } }, { $inc: { stock: -item.quantity } })));
  await User.updateOne({ _id: req.user._id }, { $set: { cart: [] } });
  res.status(201).json(order);
}));

router.get('/admin/all', protect, adminOnly, asyncHandler(async (req, res) => res.json(await Order.find().sort({ createdAt: -1 }))));
router.patch('/:id/status', protect, adminOnly, param('id').isMongoId(), asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
}));

export default router;
