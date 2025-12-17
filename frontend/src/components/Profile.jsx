import { useEffect, useState } from 'react';
import axios from 'axios';
import './css/Profile.css';

export default function ProfilePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('fitmate_token');
    if (!token) {
      setError('Not logged in');
      setLoading(false);
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/details/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setData(null);
          setError(null);
        } else {
          setError(err.response?.data?.message || 'Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-wrapper">
        <div className="profile-main">
          <div className="profile-card">
            <h2>Profile</h2>
            <p className="lead">Personal health & fitness details</p>

            {loading && <p className="muted">Loading...</p>}
            {!loading && error && <p className="muted">{error}</p>}

            {!loading && !error && data && (
              <div className="profile-grid">
                <Card label="Name" value={data.name} />
                <Card label="Email" value={data.email || '—'} />
                <Card label="Sex" value={data.gender} />
                <Card label="Current Weight" value={data.weight ? `${data.weight} kg` : '—'} />
                <Card label="Current Height" value={data.height ? `${data.height} cm` : '—'} />
                <Card label="Age" value={data.age ?? '—'} />
                <Card label="Weight Goal" value={data.targetWeight ? `${data.targetWeight} kg` : '—'} />
                <Card label="Activity Level" value={data.activityLevel || '—'} />
                <Card label="Medical Disabilities" value={data.medicalDisabilities || 'None'} />
                <div className="actions">
                  <button onClick={() => window.location.href = '/details'} className="primary-btn">Edit Details</button>
                </div>
              </div>
            )}

            {!loading && !error && !data && (
              <div style={{ textAlign: 'center', padding: 24 }}>
                <p className="muted">You haven't submitted your details yet.</p>
                <button onClick={() => window.location.href = '/details'} className="primary-btn" style={{ marginTop: 12 }}>Add Your Details</button>
              </div>
            )}
          </div>
        </div>
        <aside className="aside">
          <div className="aside-card">
            <h3>Quick Info</h3>
            <p className="muted">Manage your preferences, view recent activity and update profile information.</p>
            <div style={{ marginTop: 16 }}>
              <button onClick={() => window.location.href = '/dashboard'} className="primary-btn" style={{ width: '100%', padding: '10px 12px' }}>Back to Dashboard</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
function Card({ label, value }) {
  return (
    <div className="water-input">
      <p className="water-label">{label}</p>
      <p className="water-value">{value ?? '—'}</p>
    </div>
  );
}
