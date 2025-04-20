import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';

export default function UploadPage() {
  const { user, token } = useContext(AuthContext);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('image', image);
    formData.append('userId', user.id);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      });
      if (!res.ok) throw new Error('Upload failed');
      setMessage('Upload successful!');
      setCaption('');
      setImage(null);
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  return (
    <div className="upload-page">
      <h2>Upload Post</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Caption" value={caption} onChange={e => setCaption(e.target.value)} />
        <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} required />
        <button type="submit">Upload</button>
        {message && <div>{message}</div>}
      </form>
    </div>
  );
}
