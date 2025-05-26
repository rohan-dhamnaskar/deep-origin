'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { URLForm } from '@/components/URLForm';
import { ResultDisplay } from '@/components/ResultDisplay';
import { RecentURLs } from '@/components/RecentURLs';
import { Toast } from '@/components/Toast';
import './globals.css';
import { shortenURL, getUrlList, getUrl } from '@/services/ShortenService';
import { ShortenedUrl } from '../types/shortenedUrl';
import { FRONTEND_BASE_URL } from '@/constants/constants';

export default function URLShortener() {
  // create a sample array of URL items

  // const [shortenedUrl, setShortenedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const [recentUrls, setRecentUrls] = useState<URLItem[]>([]);
  // const [recentUrls, setRecentUrls] = useState<ShortenedUrl[]>(sampleUrls);
  const [showToast, setShowToast] = useState(false);
  const [allUrls, setAllUrls] = useState<ShortenedUrl[]>([]);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const urls = await getUrlList();
        setAllUrls(urls);
      } catch (error) {
        console.error('Failed to fetch URLs:', error);
      }
    };

    fetchUrls();
  }, []);

  const handleShortenUrl = async (url: string) => {
    setIsLoading(true);
    // setShortenedUrl('');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate a random short code
      // const shortCode = Math.random().toString(36).substring(2, 8);
      // const newShortenedUrl = `https://short.url/${shortCode}`;

      // setShortenedUrl(newShortenedUrl);
      // setRecentUrls((prev) => [{ original: url, shortened: newShortenedUrl }, ...prev.slice(0, 4)]);
    } catch (err) {
      console.error('Failed to shorten URL:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    const generatedURL = `${FRONTEND_BASE_URL}/${text}`;
    navigator.clipboard.writeText(generatedURL);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="app">
      <div className="app__container">
        <Header
          title="URL Shortener"
          subtitle="Transform your long URLs into compact, shareable links with our lightning-fast shortener"
        />

        <div className="card">
          <URLForm onSubmit={handleShortenUrl} isLoading={isLoading} />
          {/*<ResultDisplay shortenedUrl={shortenedUrl} onCopy={handleCopyToClipboard} />*/}
        </div>

        <RecentURLs urls={allUrls} onCopy={handleCopyToClipboard} />

        <Toast show={showToast} message="URL copied to clipboard!" />
      </div>
    </div>
  );
}
