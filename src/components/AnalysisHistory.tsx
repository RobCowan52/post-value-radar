import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Clock, ExternalLink, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface AnalysisHistoryItem {
  id: string;
  post_url: string;
  platform: string;
  brand_detected: string | null;
  logo_detected: boolean;
  estimated_impressions: number | null;
  media_value_usd: number | null;
  created_at: string;
}

export const AnalysisHistory = () => {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('analysis_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No analysis history yet. Start analyzing posts to see your results here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {history.map((item) => (
          <div key={item.id} className="border-l-4 border-primary/20 pl-4 py-2">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary">{item.platform}</Badge>
                  {item.logo_detected && item.brand_detected && (
                    <Badge variant="default">{item.brand_detected}</Badge>
                  )}
                  {!item.logo_detected && (
                    <Badge variant="outline">No logo detected</Badge>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {format(new Date(item.created_at), 'MMM d, yyyy • h:mm a')}
                </div>
                
                {item.logo_detected && (
                  <div className="flex items-center gap-4 text-sm">
                    {item.estimated_impressions && (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {item.estimated_impressions.toLocaleString()} impressions
                      </span>
                    )}
                    {item.media_value_usd && (
                      <span className="font-semibold text-primary">
                        ${item.media_value_usd.toLocaleString()}
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.open(item.post_url, '_blank')}
                className="gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                View
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};