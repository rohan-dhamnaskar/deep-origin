'use client';
import { Copy, Link2 } from 'lucide-react';
import { ShortenedUrl } from '@/types/ShortenedURL';

interface RecentURLsProps {
  urls: ShortenedUrl[];
  onCopy: (url: string) => void;
}

export function RecentURLs({ urls, onCopy }: RecentURLsProps) {
  if (urls.length === 0) return null;

  return (
    <div className="card">
      <div className="card__header card__header--purple-pink">
        <h2 className="card__title">
          <Link2 className="form__button-icon" />
          All URLS sorted by views (Most popular first)
        </h2>
      </div>
      <div className="card__content">
        <div className="recent-urls">
          {urls.map((item, index) => (
            <div key={index} className="recent-urls__item">
              <div className="recent-urls__url-info">
                <p className="recent-urls__original-url">Original URL: {item.original_url}</p>
                <a
                  href={item.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="recent-urls__shortened-url"
                >
                  Short Code: {item.short_code}
                </a>
                <span className="recent-urls__count">Views: {item.views}</span>
              </div>
              <button onClick={() => onCopy(item.short_code)} className="recent-urls__copy-button">
                <Copy className="recent-urls__copy-icon" />
                Copy
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
