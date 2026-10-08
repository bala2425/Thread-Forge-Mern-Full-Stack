import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { createPaymentSession } from '../services/paymentService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/create-session', protect,
  body('orderId').isString().notEmpty(),
  body('amount').isFloat({ min: 0 }),
  body('currency').matches(/^[a-z]{3}$/i),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const payment = await createPaymentSession({
      amount: Number(req.body.amount),
      currency: req.body.currency.toLowerCase(),
      email: req.user.email,
      orderId: req.body.orderId
    });
    res.status(201).json(payment);
  })
);

export default router;
