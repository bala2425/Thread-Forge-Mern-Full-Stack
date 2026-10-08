export function calculateOrderTotals(items) {
  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.price);
    const quantity = Number(item.quantity);
    if (!Number.isFinite(price) || price < 0 || !Number.isInteger(quantity) || quantity < 1) {
      throw Object.assign(new Error('Invalid order item'), { status: 400 });
    }
    return sum + price * quantity;
  }, 0);

  return { subtotal, shipping: 0, total: subtotal };
}

export function validateCustomDesign(custom) {
  if (!custom || typeof custom !== 'object') return;
  const text = custom.text?.trim();
  if (text && text.length > 40) {
    throw Object.assign(new Error('Design text cannot exceed 40 characters'), { status: 400 });
  }
  if (text !== undefined && text.length === 0) {
    throw Object.assign(new Error('Design text cannot be empty'), { status: 400 });
  }
  if (custom.x !== undefined && (custom.x < 0 || custom.x > 100)) {
    throw Object.assign(new Error('Design position must be between 0 and 100'), { status: 400 });
  }
  if (custom.y !== undefined && (custom.y < 0 || custom.y > 100)) {
    throw Object.assign(new Error('Design position must be between 0 and 100'), { status: 400 });
  }
  if (custom.scale !== undefined && (custom.scale < 0.5 || custom.scale > 4)) {
    throw Object.assign(new Error('Design scale must be between 0.5 and 4'), { status: 400 });
  }
}
