import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function AdminPanel({ user }) {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') return;
    Promise.all([api.getProducts(), api.getAdminOrders(), api.getAdminCustomers(), api.getAdminInventory()])
      .then(([productResult, orderResult, customerResult, inventoryResult]) => {
        setProducts(productResult.products); setOrders(orderResult); setCustomers(customerResult); setInventory(inventoryResult);
      }).catch(error => setMessage(error.message));
  }, [user]);

  const updateOrder = async (id, status) => {
    try { const order = await api.updateOrderStatus(id, status); setOrders(current => current.map(item => item._id === id ? order : item)); }
    catch (error) { setMessage(error.message); }
  };

  if (!user || user.role !== 'admin') return <div className="empty-state"><h2>Admin access required</h2><p>Log in with an administrator account to manage the store.</p></div>;
  return <div className="admin-page"><div className="page-title"><span className="eyebrow">Administration</span><h1>Store dashboard</h1></div>{message && <p className="form-error">{message}</p>}<div className="admin-tabs">{['products', 'orders', 'customers', 'inventory'].map(item => <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item}</button>)}</div>{tab === 'products' && <section className="admin-panel"><h2>Products</h2><div className="table-wrap"><table><thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th></tr></thead><tbody>{products.map(product => <tr key={product._id}><td>{product.name}</td><td>{product.category}</td><td>£{product.price}</td><td>{product.stock}</td></tr>)}</tbody></table></div></section>}{tab === 'orders' && <section className="admin-panel"><h2>Orders</h2><div className="table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map(order => <tr key={order._id}><td>{order._id.slice(-6).toUpperCase()}</td><td>{order.user?.name || 'Customer'}</td><td>£{order.total}</td><td><select value={order.status} onChange={event => updateOrder(order._id, event.target.value)}><option value="placed">Placed</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></td></tr>)}</tbody></table></div></section>}{tab === 'customers' && <section className="admin-panel"><h2>Customers</h2><div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>{customers.map(customer => <tr key={customer._id}><td>{customer.name}</td><td>{customer.email}</td><td>{customer.role}</td></tr>)}</tbody></table></div></section>}{tab === 'inventory' && <section className="admin-panel"><h2>Inventory</h2><div className="table-wrap"><table><thead><tr><th>Product</th><th>Stock</th><th>Status</th></tr></thead><tbody>{inventory.map(item => <tr key={item._id}><td>{item.name}</td><td>{item.stock}</td><td>{item.status}</td></tr>)}</tbody></table></div></section>}</div>;
}
