// import { useEffect, useState } from 'react';
// import axios from 'axios';

// export default function ProfilePage() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('fitmate_token');
//     if (!token) {
//       setError('Not logged in');
//       setLoading(false);
//       return;
//     }
//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/details/profile', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setData(res.data);
//       } catch (err) {
//         if (err.response?.status === 404) {
//           // No details yet for this user
//           setData(null);
//           setError(null); // treat as empty state
//         } else {
//           setError(err.response?.data?.message || 'Failed to load profile');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
//       <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-semibold text-gray-800">User Profile</h1>
//           <p className="text-gray-500 text-sm">Personal health & fitness details</p>
//         </div>
//         {loading && <p className="text-center text-gray-500">Loading...</p>}
//         {!loading && error && <p className="text-center text-red-600">{error}</p>}
//         {!loading && !error && data && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             <Detail label="Name" value={data.name} />
//             <Detail label="Sex" value={data.gender} />
//             <Detail label="Current Weight" value={`${data.weight} kg`} />
//             <Detail label="Current Height" value={`${data.height} cm`} />
//             <Detail label="Age" value={data.age} />
//             <Detail label="Weight Goal" value={`${data.targetWeight} kg`} />
//             <Detail label="Active Status" value={data.activityLevel} />
//             <Detail label="Medical Disabilities" value={data.medicalDisabilities || 'None'} />
//           </div>
//         )}
//         {!loading && !error && !data && (
//           <div className="text-center space-y-4">
//             <p className="text-gray-600">You haven't submitted your details yet.</p>
//             <button
//               onClick={() => window.location.href = '/details'}
//               className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition"
//             >Add Your Details</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function Detail({ label, value }) {
//   return (
//     <div className="p-4 bg-gray-50 border rounded-xl">
//       <p className="text-sm text-gray-500">{label}</p>
//       <p className="text-lg font-medium text-gray-800">{value}</p>
//     </div>
//   );
// }

import { useEffect, useState,useNavigate } from 'react';
import axios from 'axios';
import './Profile.css';

export default function ProfilePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate=useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('fitmate_token');
    if (!token) {
      setError('Not logged in');
      setLoading(false);
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await axios.get('https://fm-new-2.onrender.com/api/details/profile', {
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
            <h2>User Profile</h2>
            <p className="lead">Personal health & fitness details</p>

            {loading && <p className="muted">Loading...</p>}
            {!loading && error && <p className="muted">{error}</p>}

            {!loading && !error && data && (
              <div className="profile-grid">
                <Detail label="Name" value={data.name} />
                <Detail label="Sex" value={data.gender} />
                <Detail label="Current Weight" value={`${data.weight} kg`} />
                <Detail label="Current Height" value={`${data.height} cm`} />
                <Detail label="Age" value={data.age} />
                <Detail label="Weight Goal" value={`${data.targetWeight} kg`} />
                <Detail label="Active Status" value={data.activityLevel} />
                <Detail
                  label="Medical Disabilities"
                  value={data.medicalDisabilities || 'None'}
                />

                <div className="actions">
                  <button
                    className="primary-btn"
                    onClick={() => (window.location.href = '/details')}
                  >
                    Edit Details
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && !data && (
              <div style={{ textAlign: 'center', padding: 24 }}>
                <p className="muted">You haven't submitted your details yet.</p>
                <button
                  className="primary-btn"
                  onClick={() => (window.location.href = '/details')}
                  style={{ marginTop: 12 }}
                >
                  Add Your Details
                </button>
              </div>
            )}
          </div>
        </div>

        <aside className="aside">
          <div className="aside-card">
            <h3>Quick Info</h3>
            <p className="muted">
              Manage your preferences, view recent activity and update profile
              information.
            </p>
            <div style={{ marginTop: 16 }}>
              <button
                className="primary-btn"
                style={{ width: '100%' }}
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="water-input">
      <p className="water-label">{label}</p>
      <p className="water-value">{value}</p>
    </div>
  );
}
