import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${postId}`)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setLoading(false);
      });
  }, [postId]);

  if (loading) return <div>Loading post...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="post-page">
      <h2>Post by <Link to={`/user/${post.user._id}`}>{post.user.username}</Link></h2>
      <img src={post.image.startsWith('http') ? post.image : `/${post.image}`} alt="post" style={{ maxWidth: 400 }} />
      <div>{post.caption}</div>
      <div>Likes: {post.likes.length}</div>
      <div>
        Comments:
        <ul>
          {(post.comments || []).map(comment => (
            <li key={comment._id}>
              <b>{comment.user ? <Link to={`/user/${comment.user._id}`}>{comment.user.username}</Link> : 'user'}</b>: {comment.text}
            </li>
          ))}
        </ul>
      </div>
      <Link to="/">Back to Feed</Link>
    </div>
  );
}
