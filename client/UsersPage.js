import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users/search/all')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="users-page">
      <h2>All Users</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.map(user => (
          <li key={user._id} style={{ margin: '12px 0', display: 'flex', alignItems: 'center' }}>
            <img src={user.avatar} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 12 }} />
            <Link to={`/user/${user._id}`}>{user.username}</Link>
            <span style={{ color: '#888', marginLeft: 8 }}>({user.email})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
