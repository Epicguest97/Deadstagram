import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';

export default function FeedPage() {
  const { token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch('/api/posts/feed', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, [token]);

  if (loading) return <div>Loading feed...</div>;

  return (
    <div className="feed-page">
      <h2>Feed</h2>
      {posts.map(post => (
        <div key={post._id} className="post">
          <div><b>{post.user.username}</b></div>
          <img src={`/${post.image}`} alt="post" style={{ maxWidth: 400 }} />
          <div>{post.caption}</div>
          <div>Likes: {post.likes.length}</div>
        </div>
      ))}
    </div>
  );
}
