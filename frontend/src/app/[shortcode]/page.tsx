'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { getUrl } from '@/services/ShortenService';
import { ErrorPage } from '@/components/error/ErrorPage';

export default function ShortCodeRedirect({ params }: { params: { shortcode: string } }) {
  const unwrappedParams = use(params);
  const { shortcode } = unwrappedParams;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOriginalUrl = async () => {
      try {
        const originalUrl = await getUrl(shortcode);

        // If we got a URL, redirect to it
        if (originalUrl) {
          const urlToRedirect = originalUrl.startsWith('http')
            ? originalUrl
            : `https://${originalUrl}`;
          window.location.href = urlToRedirect;
        } else {
          // No URL found
          setError('This short URL does not exist or has expired');
          router.push('/not-found');
        }
      } catch (error) {
        console.error('Error fetching URL:', error);
        setError('This short URL does not exist or has expired');
        router.push('/not-found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOriginalUrl();
  }, [shortcode, router]);

  if (error) {
    return (
      <ErrorPage
        errorCode={404}
        title="Page Not Found"
        description={error}
        suggestions={[
          'Check if the URL is typed correctly',
          'The page may have been moved or deleted',
          'The shortened link may have expired',
          "Try searching for the content you're looking for",
        ]}
      />
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      {isLoading && (
        <div className="text-center">
          Loading...
          <p className="mt-4">Redirecting you to your destination...</p>
        </div>
      )}
    </div>
  );
}
