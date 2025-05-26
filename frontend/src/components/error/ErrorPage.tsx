'use client';
import Link from 'next/link';
import { AlertTriangle, Home } from 'lucide-react';

interface ErrorPageProps {
  errorCode: number;
  title: string;
  description: string;
  suggestions?: string[];
  showRefresh?: boolean;
  showGoBack?: boolean;
  showContactSupport?: boolean;
}

export function ErrorPage({ errorCode, title, description, suggestions = [] }: ErrorPageProps) {
  const getErrorIcon = () => {
    switch (errorCode) {
      case 404:
        return '🔍';
      case 500:
        return '⚠️';
      case 403:
        return '🔒';
      default:
        return '❌';
    }
  };

  const getHeaderVariant = () => {
    switch (errorCode) {
      case 404:
        return '';
      case 500:
        return 'card__header--purple-pink';
      case 403:
        return 'card__header--green-blue';
      default:
        return '';
    }
  };

  return (
    <div className="app">
      <div className="app__container">
        {/* Header */}
        <div className="header">
          <div className="header__icon-container">
            <div className="header__icon-wrapper">
              <AlertTriangle className="header__icon" />
            </div>
          </div>
          <h1 className="header__title">{errorCode}</h1>
          <p className="header__subtitle">
            {title} {getErrorIcon()}
          </p>
        </div>

        {/* Main Error Card */}
        <div className="card">
          <div className={`card__header ${getHeaderVariant()}`}>
            <h2 className="card__title">
              <AlertTriangle className="form__button-icon" />
              {title}
            </h2>
            <p className="card__subtitle">{description}</p>
          </div>

          <div className="card__content">
            <div className="form">
              <div className="error-page">
                {suggestions.length > 0 && (
                  <div className="error-page__content">
                    <h3 className="error-page__title">What you can try:</h3>
                    <ul className="error-page__list">
                      {suggestions.map((suggestion, index) => (
                        <li key={index} className="error-page__list-item">
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="error-page__actions">
                  <Link href="/" className="form__button">
                    <Home className="form__button-icon" />
                    Go Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
