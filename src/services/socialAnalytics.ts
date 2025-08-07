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

  static async fetchPostMetrics(url: string): Promise<PostMetrics> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock metrics - in real app this would call actual APIs
    const mockMetrics = {
      impressions: Math.floor(Math.random() * 150000) + 50000,
      engagements: {
        likes: Math.floor(Math.random() * 8000) + 2000,
        shares: Math.floor(Math.random() * 500) + 100,
        comments: Math.floor(Math.random() * 300) + 50,
      },
      clicks: Math.floor(Math.random() * 200) + 50,
    };

    return mockMetrics;
  }

  static calculateMediaValue(metrics: PostMetrics, cpm: number = 25.0, cpe: number = 0.40): number {
    const baseValue = (metrics.impressions / 1000) * cpm;
    const engagementTotal = Object.values(metrics.engagements).reduce((sum, val) => sum + val, 0);
    const engagementValue = engagementTotal * cpe;
    return Math.round((baseValue + engagementValue) * 100) / 100;
  }

  static async analyzePost(postUrl: string, brandLogos: string[]): Promise<AnalysisResult> {
    try {
      const platform = this.detectPlatform(postUrl);
      
      // Simulate logo detection
      await new Promise(resolve => setTimeout(resolve, 1000));
      const logoDetected = Math.random() > 0.3; // 70% chance of detection
      
      if (!logoDetected) {
        return {
          platform,
          logo_detected: false,
          message: "No target logos found in post.",
        };
      }

      const metrics = await this.fetchPostMetrics(postUrl);
      const mediaValue = this.calculateMediaValue(metrics);
      const selectedBrand = brandLogos[Math.floor(Math.random() * brandLogos.length)];

      return {
        platform,
        brand: selectedBrand,
        logo_detected: true,
        estimated_impressions: metrics.impressions,
        engagements: metrics.engagements,
        clicks: metrics.clicks,
        media_value: `$${mediaValue.toLocaleString()}`,
      };

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