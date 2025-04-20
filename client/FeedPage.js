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

  const [commentText, setCommentText] = useState({});
  const { user } = useContext(AuthContext);
  const navigate = window.location ? (path) => window.location.assign(path) : () => {};

  const handleLike = async (postId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    await fetch(`/api/posts/${postId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id })
    });
    setPosts(posts => posts.map(p => p._id === postId ? { ...p, likes: [...p.likes, user.id] } : p));
  };

  const handleUnlike = async (postId) => {
    await fetch(`/api/posts/${postId}/unlike`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user?.id })
    });
    setPosts(posts => posts.map(p => p._id === postId ? { ...p, likes: p.likes.filter(id => id !== user.id) } : p));
  };

  const handleComment = async (postId) => {
    if (!commentText[postId]) return;
    const res = await fetch(`/api/posts/${postId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user?.id, text: commentText[postId] })
    });
    const comment = await res.json();
    setPosts(posts => posts.map(p => p._id === postId ? { ...p, comments: [...(p.comments || []), comment] } : p));
    setCommentText({ ...commentText, [postId]: '' });
  };

  const handleDelete = async (postId) => {
    await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
    setPosts(posts => posts.filter(p => p._id !== postId));
  };

  const handleDeleteComment = async (postId, commentId) => {
    await fetch(`/api/posts/${postId}/comment/${commentId}`, { method: 'DELETE' });
    setPosts(posts => posts.map(p => p._id === postId ? { ...p, comments: (p.comments || []).filter(c => c._id !== commentId) } : p));
  };

  const getImageUrl = (img) => {
    if (img.startsWith('http')) return img;
    if (img.startsWith('/')) return img;
    return `/${img}`;
  };

  return (
    <div className="feed-page">
      <h2>Feed</h2>
      {posts.map(post => (
        <div key={post._id} className="post">
          <div><b><a href={`/user/${post.user._id}`}>{post.user.username}</a></b></div>
          <img src={getImageUrl(post.image)} alt="post" style={{ maxWidth: 400 }} />
          <div>{post.caption}</div>
          <div>Likes: {post.likes.length}</div>
          <div style={{ margin: '8px 0' }}>
            <button
              onClick={() => user && post.likes.includes(user.id) ? handleUnlike(post._id) : handleLike(post._id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 24,
                color: user && post.likes.includes(user.id) ? 'red' : '#aaa',
                verticalAlign: 'middle',
              }}
              aria-label={user && post.likes.includes(user.id) ? 'Unlike' : 'Like'}
              title={user && post.likes.includes(user.id) ? 'Unlike' : 'Like'}
            >
              ❤️
            </button>
            <span style={{ marginLeft: 8 }}>{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</span>
          </div>
          {user && post.user._id === user.id && (
            <button onClick={() => handleDelete(post._id)}>Delete</button>
          )}
          {user && (
            <div>
              <input
                type="text"
                placeholder="Add a comment"
                value={commentText[post._id] || ''}
                onChange={e => setCommentText({ ...commentText, [post._id]: e.target.value })}
              />
              <button onClick={() => handleComment(post._id)}>Comment</button>
            </div>
          )}
          <div>
            Comments:
            <ul>
              {(post.comments || []).map(comment => (
                <li key={comment._id}>
                  <b>{comment.user? <a href={`/user/${comment.user._id}`}>{comment.user.username}</a> : 'user'}</b>: {comment.text}
                  {user && comment.user && comment.user._id === user.id && (
                    <button onClick={() => handleDeleteComment(post._id, comment._id)}>Delete</button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
