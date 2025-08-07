export interface PostMetrics {
  impressions: number;
  engagements: {
    likes: number;
    shares: number;
    comments: number;
  };
  clicks: number;
}

export interface AnalysisResult {
  platform: string;
  brand?: string;
  logo_detected: boolean;
  estimated_impressions?: number;
  engagements?: PostMetrics['engagements'];
  clicks?: number;
  media_value?: number;
  message?: string;
  error?: string;
  post_url?: string;
}