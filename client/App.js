import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import FeedPage from './FeedPage';
import UploadPage from './UploadPage';
import UserProfilePage from './UserProfilePage';

import UserSearchBar from './UserSearchBar';
import UsersPage from './UsersPage';
import PostPage from './PostPage';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Link to="/">Feed</Link>
      <Link to="/users">Users</Link>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <label htmlFor="user-search-bar" style={{ fontSize: 12, color: '#555', marginBottom: 2 }}>Search users</label>
        <UserSearchBar inputId="user-search-bar" />
      </div>
      {user ? (
        <>
          <Link to="/upload">Upload</Link>
          <span>Hi, {user.username}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

function AppRoutes() {
  const { user } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/" element={<FeedPage />} />
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
      <Route path="/upload" element={user ? <UploadPage /> : <Navigate to="/login" />} />
      <Route path="/user/:userId" element={<UserProfilePage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/post/:postId" element={<PostPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
