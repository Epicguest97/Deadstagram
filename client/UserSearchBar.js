import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserSearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    setQuery(e.target.value);
    if (e.target.value.length > 0) {
      const res = await fetch(`/api/users/search/all?q=${encodeURIComponent(e.target.value)}`);
      const users = await res.json();
      setResults(users);
      setShowDropdown(true);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  };

  const handleUserClick = (userId) => {
    setShowDropdown(false);
    setQuery('');
    setResults([]);
    navigate(`/user/${userId}`);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={handleSearch}
        onFocus={() => setShowDropdown(results.length > 0)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        style={{ padding: 5, borderRadius: 4, border: '1px solid #ccc' }}
      />
      {showDropdown && results.length > 0 && (
        <div style={{ position: 'absolute', top: '110%', left: 0, background: '#fff', border: '1px solid #ccc', zIndex: 10, width: '100%' }}>
          {results.map(user => (
            <div key={user._id} style={{ padding: 8, cursor: 'pointer' }} onClick={() => handleUserClick(user._id)}>
              <img src={user.avatar} alt="avatar" style={{ width: 30, height: 30, borderRadius: '50%', marginRight: 8 }} />
              {user.username} <span style={{ color: '#888', fontSize: 12 }}>({user.email})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
