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
          Recent URLs
        </h2>
      </div>
      <div className="card__content">
        <div className="recent-urls">
          {urls.map((item, index) => (
            <div key={index} className="recent-urls__item">
              <div className="recent-urls__url-info">
                <p className="recent-urls__original-url">{item.original_url}</p>
                <a
                  href={item.shortened}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="recent-urls__shortened-url"
                >
                  {item.short_code}
                </a>
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
