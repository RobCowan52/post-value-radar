import type { PostMetrics, AnalysisResult } from '../types';

// Re-export types for compatibility
export type { PostMetrics, AnalysisResult };

export class SocialAnalyticsService {
  /* ───────── platform helper ───────── */
  private static detectPlatform(url: string): string {
    if (/instagram\.com/.test(url)) return 'Instagram';
    if (/(twitter|x)\.com/.test(url)) return 'X';
    if (/tiktok\.com/.test(url)) return 'TikTok';
    if (/facebook\.com/.test(url)) return 'Facebook';
    if (/linkedin\.com/.test(url)) return 'LinkedIn';
    if (/youtube\.com/.test(url)) return 'YouTube';
    return 'Unknown';
  }

  /* ───────── dev mock metrics ───────── */
  private static devMockMetrics(): PostMetrics {
    return {
      impressions: 100_000,
      engagements: { likes: 5_000, shares: 250, comments: 120 },
      clicks: 80,
    };
  }

  private static async fetchPostMetrics(postUrl: string): Promise<PostMetrics> {
    if (import.meta.env.MODE === 'development') {
      await new Promise((r) => setTimeout(r, 600)); // simulate latency
      return this.devMockMetrics();
    }
    throw new Error('Real metrics fetch not yet implemented');
  }

  /* ───────── valuation ───────── */
  private static calculateMediaValue(
    metrics: PostMetrics,
    cpm = 25,
    cpe = 0.4,
  ): number {
    const base = (metrics.impressions / 1_000) * cpm;
    const engTotal = Object.values(metrics.engagements).reduce((s, v) => s + v, 0);
    const engVal = engTotal * cpe;
    return Math.round((base + engVal) * 100) / 100;
  }

  /* ───────── top-level analyzer ───────── */
  static async analyzePost(
    postUrl: string,
    brandLogos: string[],
  ): Promise<AnalysisResult> {
    const platform = this.detectPlatform(postUrl);

    try {
      // TODO replace with real logo-detection call
      const logoDetected = brandLogos.length > 0 && Math.random() > 0.3;
      if (!logoDetected) {
        return { platform, logo_detected: false, message: 'No target logos found in post.' };
      }

      const metrics = await this.fetchPostMetrics(postUrl);
      const mediaValue = this.calculateMediaValue(metrics);
      const brand = brandLogos[0];

      return {
        platform,
        brand,
        logo_detected: true,
        estimated_impressions: metrics.impressions,
        engagements: metrics.engagements,
        clicks: metrics.clicks,
        media_value: mediaValue,
      };
    } catch (err) {
      return {
        platform,
        logo_detected: false,
        error: err instanceof Error ? err.message : 'Unexpected error',
        post_url: postUrl,
      };
    }
  }
}