import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function UserProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserAndPosts() {
      const userRes = await fetch(`/api/users/${userId}`);
      const userData = await userRes.json();
      setUser(userData);
      const postsRes = await fetch(`/api/posts/user/${userId}`);
      const postsData = await postsRes.json();
      setPosts(postsData);
      setLoading(false);
    }
    fetchUserAndPosts();
  }, [userId]);

  if (loading) return <div>Loading profile...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="user-profile-page">
      <h2>{user.username}'s Profile</h2>
      <img src={user.avatar} alt="avatar" style={{ width: 100, borderRadius: '50%' }} />
      <div>Email: {user.email}</div>
      <h3>Posts</h3>
      <div>
        {posts.map(post => (
          <div key={post._id} className="post">
            <img src={post.image.startsWith('http') ? post.image : `/${post.image}`} alt="post" style={{ maxWidth: 200 }} />
            <div>{post.caption}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
