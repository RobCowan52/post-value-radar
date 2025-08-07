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
  media_value?: string;
  message?: string;
  error?: string;
  post_url?: string;
}

export class SocialAnalyticsService {
  static detectPlatform(url: string): string {
    if (url.includes('instagram.com')) return 'Instagram';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'X';
    if (url.includes('facebook.com')) return 'Facebook';
    if (url.includes('linkedin.com')) return 'LinkedIn';
    if (url.includes('tiktok.com')) return 'TikTok';
    if (url.includes('youtube.com')) return 'YouTube';
    return 'Unknown';
  }

  static async analyzePost(postUrl: string, brandLogos: string[]): Promise<AnalysisResult> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required. Please sign in to analyze posts.');
      }

      // Call the Edge Function
      const { data, error } = await supabase.functions.invoke('analyze-post', {
        body: {
          postUrl,
          brandLogos
        }
      });

      if (error) {
        throw new Error(error.message || 'Analysis failed');
      }

      return data as AnalysisResult;

    } catch (error) {
      return {
        platform: 'Unknown',
        logo_detected: false,
        error: error instanceof Error ? error.message : 'Analysis failed',
        post_url: postUrl,
      };
    }
  }
}