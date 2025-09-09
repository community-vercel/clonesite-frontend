'use client';
import { useState } from 'react';
import api from '../lib/api';
import { toast } from 'react-toastify';

export default function PortfolioUpload() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      await api.post('/users/portfolio', { image: data.secure_url });
      toast.success('Portfolio item uploaded!');
    } catch (error) {
      toast.error('Failed to upload portfolio item');
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-white"
      />
      <button
        onClick={handleUpload}
        className="bg-primary text-white py-2 px-4 rounded hover:bg-green-600"
        disabled={!file}
      >
        Upload Portfolio Item
      </button>
    </div>
  );
}