const stripeBaseUrl = 'https://api.stripe.com/v1';

export async function createPaymentSession({ amount, currency, email, orderId }) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return {
      provider: 'demo',
      paymentId: `demo_${orderId}_${Date.now()}`,
      status: 'paid',
      amount,
      currency,
      message: 'Demo payment completed. Configure Stripe credentials for live payments.'
    };
  }

  const response = await fetch(`${stripeBaseUrl}/checkout/sessions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout?payment=cancelled`,
      'line_items[0][price_data][currency]': currency,
      'line_items[0][price_data][product_data][name]': 'ThreadForge order',
      'line_items[0][price_data][unit_amount]': String(Math.round(amount * 100)),
      'line_items[0][quantity]': '1',
      client_reference_id: orderId,
      customer_email: email
    })
  });

  const data = await response.json();
  if (!response.ok) throw Object.assign(new Error(data.error?.message || 'Payment gateway error'), { status: 502 });
  return { provider: 'stripe', paymentId: data.id, status: 'pending', amount, currency, checkoutUrl: data.url };
}
