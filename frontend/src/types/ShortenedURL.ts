export interface ShortenedUrl {
  created_at: string;
  user_id: string;
  original_url: string;
  short_code: string;
  views: number; // Optional field for views count
}
