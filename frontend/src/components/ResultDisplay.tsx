'use client';

import { Copy, ExternalLink, Sparkles } from 'lucide-react';

interface ResultDisplayProps {
  shortenedUrl: string;
  onCopy: (url: string) => void;
}

export function ResultDisplay({ shortenedUrl, onCopy }: ResultDisplayProps) {
  if (!shortenedUrl) return null;

  return (
    <div className="card__header card__header--green-blue">
      <h3 className="card__title card__subtitle--green">
        <Sparkles className="form__button-icon" />
        Your shortened URL is ready!
      </h3>
      <div className="result">
        <div className="result__url-container">
          <a href={shortenedUrl} target="_blank" rel="noopener noreferrer" className="result__url">
            {shortenedUrl}
          </a>
          <button
            onClick={() => onCopy(shortenedUrl)}
            className="result__action-button result__action-button--blue"
            title="Copy URL"
          >
            <Copy className="result__action-icon" />
          </button>
          <a
            href={shortenedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="result__action-button result__action-button--purple"
            title="Open URL"
          >
            <ExternalLink className="result__action-icon" />
          </a>
        </div>
      </div>
    </div>
  );
}
