import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Profile({ user }) {
  const [profile, setProfile] = useState(user || {});
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.getProfile().then(setProfile).catch(() => {});
  }, []);

  const saveProfile = async event => {
    event.preventDefault();
    try {
      const result = await api.saveProfile({ name: profile.name });
      setProfile(result);
      setMessage('Profile updated.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const saveAddress = async event => {
    event.preventDefault();
    try {
      const result = await api.addAddress({ label: 'Home', ...JSON.parse(address) });
      setProfile({ ...profile, addresses: result.addresses });
      setAddress('');
      setMessage('Address saved.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return <div className="account-page">
    <div className="page-title"><span className="eyebrow">My account</span><h1>Profile & addresses</h1></div>
    <form className="form-panel" onSubmit={saveProfile}>
      <h2>Personal details</h2>
      <label>Name<input value={profile.name || ''} onChange={event => setProfile({ ...profile, name: event.target.value })} required /></label>
      <label>Email<input value={profile.email || ''} disabled /></label>
      <button className="button primary" type="submit">Save profile</button>
    </form>
    <form className="form-panel" onSubmit={saveAddress}>
      <h2>Add delivery address</h2>
      <textarea value={address} onChange={event => setAddress(event.target.value)} placeholder='{"line1":"1 Main Street","city":"London","state":"England","postalCode":"SW1A 1AA","country":"United Kingdom"}' required />
      <button className="button dark" type="submit">Save address</button>
    </form>
    {message && <p className="success-message">{message}</p>}
    <section className="admin-panel"><h2>Saved addresses</h2>{profile.addresses?.length ? <div>{profile.addresses.map((item, index) => <article key={`${item.line1}-${index}`}><strong>{item.label || 'Address'}</strong><p>{item.line1}, {item.city}, {item.state} {item.postalCode}</p></article>)}</div> : <p>No saved addresses yet.</p>}</section>
  </div>;
}
