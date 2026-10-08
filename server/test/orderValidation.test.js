import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateOrderTotals, validateCustomDesign } from '../src/utils/orderValidation.js';

test('calculates server-side totals from product prices', () => {
  const result = calculateOrderTotals([
    { price: 24, quantity: 2 },
    { price: 38, quantity: 1 }
  ]);

  assert.deepEqual(result, { subtotal: 86, shipping: 0, total: 86 });
});

test('rejects invalid custom design data', () => {
  assert.throws(() => validateCustomDesign({ text: '', x: 50, y: 50, scale: 1 }), /text/i);
  assert.throws(() => validateCustomDesign({ text: 'A', x: 101, y: 50, scale: 1 }), /position/i);
  assert.throws(() => validateCustomDesign({ text: 'A', x: 50, y: 50, scale: 5 }), /scale/i);
});
