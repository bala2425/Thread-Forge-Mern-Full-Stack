import { useMemo, useState } from 'react';
import { CreditCard, LockKeyhole, PackageCheck } from 'lucide-react';
import { api } from '../api.js';

export default function CheckoutFlow({ cart, updateCart, user }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', line1: '', line2: '', city: '', state: '', postalCode: '', country: 'United Kingdom', card: '', expiry: '', cvc: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const placeOrder = async () => {
    if (!cart.length) return setMessage('Your cart is empty.');
    setLoading(true);
    try {
      const order = await api.placeOrder({ items: cart.map(item => ({ product: item.product, quantity: item.quantity, size: item.size, color: item.color, custom: item.custom })), deliveryAddress: { name: form.name, line1: form.line1, line2: form.line2, city: form.city, state: form.state, postalCode: form.postalCode, country: form.country }, paymentMethod: 'card' });
      const payment = await api.createPaymentSession({ orderId: order._id, amount: order.total, currency: 'gbp' });
      if (payment.provider === 'stripe') window.location.assign(payment.checkoutUrl);
      else setMessage(`${payment.message} Order ${order._id.slice(-6).toUpperCase()} created.`);
      updateCart([]); setStep(3);
    } catch (error) { setMessage(error.message); } finally { setLoading(false); }
  };

  if (step === 3) return <div className="confirmation-page"><PackageCheck size={56} /><span className="eyebrow">Order confirmed</span><h1>Thank you, {form.name}.</h1><p>{message || 'Your order is being prepared.'}</p><a className="button primary" href="/orders">View order history</a></div>;
  return <div className="checkout-page"><div className="page-title"><span className="eyebrow">Secure checkout</span><h1>{step === 1 ? 'Delivery details' : 'Payment'}</h1></div><div className="checkout-layout"><form className="checkout-form" onSubmit={event => { event.preventDefault(); setStep(step + 1); }}><div className="stepper"><span className={step >= 1 ? 'active' : ''}>1</span><i /><span className={step >= 2 ? 'active' : ''}>2</span></div>{step === 1 ? <><h2>Where should we send it?</h2><div className="form-grid"><label>Full name<input required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /></label><label>Email<input required type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} /></label><label className="full">Address<input required value={form.line1} onChange={event => setForm({ ...form, line1: event.target.value })} /></label><label className="full">Apartment, suite or unit<input value={form.line2} onChange={event => setForm({ ...form, line2: event.target.value })} /></label><label>City<input required value={form.city} onChange={event => setForm({ ...form, city: event.target.value })} /></label><label>County<input required value={form.state} onChange={event => setForm({ ...form, state: event.target.value })} /></label><label>Postcode<input required value={form.postalCode} onChange={event => setForm({ ...form, postalCode: event.target.value })} /></label><label>Country<input value={form.country} onChange={event => setForm({ ...form, country: event.target.value })} /></label></div><button type="submit" className="button primary">Continue to payment</button></> : <><h2>Payment</h2><div className="payment-option"><CreditCard /><div><strong>Credit or debit card</strong><p>Secure payment via configured provider.</p></div><LockKeyhole size={18} /></div><label className="full">Card number<input required inputMode="numeric" minLength="12" maxLength="19" placeholder="4242 4242 4242 4242" value={form.card} onChange={event => setForm({ ...form, card: event.target.value })} /></label><div className="form-grid"><label>Expiry<input required placeholder="MM / YY" value={form.expiry} onChange={event => setForm({ ...form, expiry: event.target.value })} /></label><label>CVC<input required inputMode="numeric" maxLength="4" placeholder="123" value={form.cvc} onChange={event => setForm({ ...form, cvc: event.target.value })} /></label></div>{message && <p className="form-error">{message}</p>}<button type="button" className="button primary full" disabled={loading} onClick={placeOrder}>{loading ? 'Creating payment…' : `Pay £${subtotal}`}</button></>}<button type="button" className="button secondary full" onClick={() => setStep(step - 1)}>Back</button></form><aside className="order-summary"><h3>Order summary</h3>{cart.map((item, index) => <div className="summary-item" key={`${item.product}-${index}`}><span>{item.name} × {item.quantity}</span><strong>£{item.price * item.quantity}</strong></div>)}<div><span>Subtotal</span><strong>£{subtotal}</strong></div><div><span>Shipping</span><strong>Free</strong></div><div className="summary-total"><span>Total</span><strong>£{subtotal}</strong></div></aside></div></div>;
}
