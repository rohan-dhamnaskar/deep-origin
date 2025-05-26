'use client';

import type React from 'react';

import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface URLFormProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
}

export function URLForm({ onSubmit, isLoading }: URLFormProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    await onSubmit(url);
    setUrl('');
  };

  return (
    <div className="card">
      <div className="card__header">
        <h2 className="card__title">
          <Sparkles className="form__button-icon" />
          Shorten Your URL
        </h2>
        <p className="card__subtitle">
          Paste your long URL below and get a shortened version instantly
        </p>
      </div>
      <div className="card__content">
        <form onSubmit={handleSubmit} className="form">
          <div className="form__input-group">
            <input
              type="text"
              placeholder="https://example.com/very/long/url/that/needs/shortening"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="form__input"
            />
            <button type="submit" disabled={isLoading} className="form__button">
              {isLoading ? (
                <>
                  <Loader2 className="form__button-icon form__button-icon--spinning" />
                  Shortening
                </>
              ) : (
                <>
                  <Sparkles className="form__button-icon" />
                  Shorten URL
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="alert">
              <p className="alert__message">{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
