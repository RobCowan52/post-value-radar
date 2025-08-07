import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';
import { SocialAnalyticsService } from '@/services/socialAnalytics';
import type { AnalysisResult } from '@/services/socialAnalytics';

interface AnalysisFormProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  onAnalysisStart: () => void;
}

export const AnalysisForm = ({ onAnalysisComplete, onAnalysisStart }: AnalysisFormProps) => {
  const [postUrl, setPostUrl] = useState('');
  const [brandInput, setBrandInput] = useState('');
  const [brandLogos, setBrandLogos] = useState<string[]>(['Nike', 'Adidas']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addBrand = () => {
    if (brandInput.trim() && !brandLogos.includes(brandInput.trim())) {
      setBrandLogos([...brandLogos, brandInput.trim()]);
      setBrandInput('');
    }
  };

  const removeBrand = (brand: string) => {
    setBrandLogos(brandLogos.filter(b => b !== brand));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postUrl.trim() || brandLogos.length === 0) return;

    setIsAnalyzing(true);
    onAnalysisStart();

    try {
      const result = await SocialAnalyticsService.analyzePost(postUrl, brandLogos);
      onAnalysisComplete(result);
    } catch (error) {
      onAnalysisComplete({
        platform: 'Unknown',
        logo_detected: false,
        error: 'Analysis failed. Please try again.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-medium">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Social Media Post Analyzer
        </CardTitle>
        <p className="text-muted-foreground">
          Analyze social media posts for brand logo detection and media value estimation
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="post-url">Social Media Post URL</Label>
            <Input
              id="post-url"
              type="url"
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
              placeholder="https://instagram.com/p/... or https://x.com/..."
              required
              className="transition-all duration-200"
            />
          </div>

          <div className="space-y-3">
            <Label>Brand Logos to Detect</Label>
            <div className="flex gap-2">
              <Input
                value={brandInput}
                onChange={(e) => setBrandInput(e.target.value)}
                placeholder="Enter brand name"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBrand())}
                className="flex-1"
              />
              <Button type="button" onClick={addBrand} variant="outline" size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {brandLogos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {brandLogos.map((brand) => (
                  <Badge key={brand} variant="secondary" className="gap-1">
                    {brand}
                    <button
                      type="button"
                      onClick={() => removeBrand(brand)}
                      className="hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isAnalyzing || !postUrl.trim() || brandLogos.length === 0}
            className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-200"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Post'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};