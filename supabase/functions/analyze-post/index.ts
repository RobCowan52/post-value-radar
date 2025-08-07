import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  postUrl: string;
  brandLogos: string[];
}

interface PostMetrics {
  impressions: number;
  engagements: {
    likes: number;
    shares: number;
    comments: number;
  };
  clicks: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { postUrl, brandLogos }: AnalysisRequest = await req.json();
    
    if (!postUrl || !brandLogos?.length) {
      return new Response(
        JSON.stringify({ error: 'Post URL and brand logos are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing post: ${postUrl} for brands: ${brandLogos.join(', ')}`);

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    });

    // Get user from auth header
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Detect platform
    const platform = detectPlatform(postUrl);
    
    // Simulate processing delay for demo
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock logo detection (70% chance of detection)
    const logoDetected = Math.random() > 0.3;
    
    if (!logoDetected) {
      const result = {
        platform,
        logo_detected: false,
        message: "No target logos found in post.",
      };

      // Store analysis result
      await supabase.from('analysis_results').insert({
        user_id: user.id,
        post_url: postUrl,
        platform,
        logo_detected: false,
        analysis_metadata: { brands_searched: brandLogos }
      });

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Mock metrics generation
    const metrics = generateMockMetrics();
    const mediaValue = calculateMediaValue(metrics);
    const selectedBrand = brandLogos[Math.floor(Math.random() * brandLogos.length)];

    const result = {
      platform,
      brand: selectedBrand,
      logo_detected: true,
      estimated_impressions: metrics.impressions,
      engagements: metrics.engagements,
      clicks: metrics.clicks,
      media_value: `$${mediaValue.toLocaleString()}`,
    };

    // Store analysis result in database
    await supabase.from('analysis_results').insert({
      user_id: user.id,
      post_url: postUrl,
      platform,
      brand_detected: selectedBrand,
      logo_detected: true,
      estimated_impressions: metrics.impressions,
      engagement_data: metrics.engagements,
      clicks: metrics.clicks,
      media_value_usd: mediaValue,
      analysis_metadata: { brands_searched: brandLogos, confidence: 0.85 }
    });

    console.log(`Analysis completed for user ${user.id}: ${JSON.stringify(result)}`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-post function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Analysis failed',
        platform: 'Unknown'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function detectPlatform(url: string): string {
  if (url.includes('instagram.com')) return 'Instagram';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'X';
  if (url.includes('facebook.com')) return 'Facebook';
  if (url.includes('linkedin.com')) return 'LinkedIn';
  if (url.includes('tiktok.com')) return 'TikTok';
  if (url.includes('youtube.com')) return 'YouTube';
  return 'Unknown';
}

function generateMockMetrics(): PostMetrics {
  return {
    impressions: Math.floor(Math.random() * 150000) + 50000,
    engagements: {
      likes: Math.floor(Math.random() * 8000) + 2000,
      shares: Math.floor(Math.random() * 500) + 100,
      comments: Math.floor(Math.random() * 300) + 50,
    },
    clicks: Math.floor(Math.random() * 200) + 50,
  };
}

function calculateMediaValue(metrics: PostMetrics, cpm: number = 25.0, cpe: number = 0.40): number {
  const baseValue = (metrics.impressions / 1000) * cpm;
  const engagementTotal = Object.values(metrics.engagements).reduce((sum, val) => sum + val, 0);
  const engagementValue = engagementTotal * cpe;
  return Math.round((baseValue + engagementValue) * 100) / 100;
}