'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/db/schema';
import { commonStyles } from '@/styles/common';

interface LinkFormProps {
  onSubmit: (data: Omit<Link, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Omit<Link, 'id' | 'createdAt' | 'updatedAt'>;
}

export default function LinkForm({ onSubmit, initialData }: LinkFormProps) {
  const [formData, setFormData] = useState(() => 
    initialData || { 
      url: '', 
      title: '', 
      description: null, 
      prompt: null,
      imageData: null,
      imageMimeType: null,
      thumbnailData: null,
      thumbnailMimeType: null
    }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ url: '', title: '', description: null, prompt: null, imageData: null, imageMimeType: null, thumbnailData: null, thumbnailMimeType: null });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Wysyłanie danych:', formData);
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className={commonStyles.section}>
      <input
        type="text"
        name="url"
        value={formData.url}
        onChange={handleChange}
        placeholder="URL"
        className={commonStyles.input}
        required
      />
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        className={commonStyles.input}
        required
      />
      <textarea
        name="description"
        value={formData.description || ''}
        onChange={handleChange}
        placeholder="Description"
        className={commonStyles.textarea}
      />
      <button 
        type="submit" 
        className="gradient-button copy-gradient flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>{initialData ? 'Zaktualizuj link' : 'Dodaj link'}</span>
      </button>
    </form>
  );
}
