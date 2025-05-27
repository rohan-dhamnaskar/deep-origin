import { ErrorPage } from '@/components/error/ErrorPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | URL Shortener',
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <ErrorPage
      errorCode={404}
      title="Page Not Found"
      description="The URL you're trying to access might be broken, removed, or doesn't exist"
      suggestions={[
        'Check if the URL is typed correctly',
        'The page may have been moved or deleted',
        'The shortened link may have expired',
        "Try searching for the content you're looking for",
      ]}
    />
  );
}
