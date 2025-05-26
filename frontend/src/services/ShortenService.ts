import { ShortenedUrl } from '@/types/ShortenedURL';

export interface APIErrorResponse {
  message: string;
  statusCode?: number;
}

export class APIError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'APIError';
  }
}

export interface ShortenURLResponse {
  allUrls: ShortenedUrl[];
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const shortenURL = async (url: string): Promise<ShortenURLResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/shorten`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || 'API request failed';
      } catch (e) {
        errorMessage = errorText || `Request failed with status ${response.status}`;
      }
      throw new APIError(errorMessage, response.status);
    }

    return await response.json();
  } catch (error) {
    console.error('Error shortening URL:', error);
    if (error instanceof APIError) throw error;
    throw new APIError(error instanceof Error ? error.message : 'Network error', 500);
  }
};

export const getUrlList = async (): Promise<ShortenedUrl[]> => {
  try {
    const response = await fetch(`${BASE_URL}/shorten`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
    });

    if (!response.ok) {
      throw new APIError(`Failed to fetch URLs: ${response.statusText}`, response.status);
    }

    const data = await response.json();
    const { allUrls }: { allUrls: ShortenedUrl[] } = data;
    return allUrls;
  } catch (error) {
    console.error('Error fetching URL list:', error);
    throw error;
  }
};

export const getUrl = async (shortCode: string): Promise<string> => {
  try {
    const response = await fetch(`${BASE_URL}/shorten/${shortCode}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new APIError(`Failed to get URL: ${response.statusText}`, response.status);
    }

    const data = await response.json();
    return data.originalUrl;
  } catch (error) {
    console.error(`Error fetching URL for ${shortCode}:`, error);
    throw error;
  }
};
