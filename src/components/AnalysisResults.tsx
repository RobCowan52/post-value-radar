import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, TrendingUp, Users, MousePointer, Eye } from 'lucide-react';
import type { AnalysisResult } from '@/services/socialAnalytics';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export const AnalysisResults = ({ result }: AnalysisResultsProps) => {
  if (result.error) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-destructive/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-destructive">
            <XCircle className="w-5 h-5" />
            <span className="font-medium">Analysis Failed</span>
          </div>
          <p className="text-muted-foreground mt-2">{result.error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!result.logo_detected) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-muted">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-muted-foreground">
            <XCircle className="w-5 h-5" />
            <span className="font-medium">No Logo Detected</span>
          </div>
          <p className="text-muted-foreground mt-2">
            {result.message || 'No target brand logos found in this post.'}
          </p>
          <div className="mt-3">
            <Badge variant="outline">{result.platform}</Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalEngagements = result.engagements 
    ? Object.values(result.engagements).reduce((sum, val) => sum + val, 0)
    : 0;

  const engagementRate = result.estimated_impressions 
    ? Math.round((totalEngagements / result.estimated_impressions) * 100 * 100) / 100
    : 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Success Header */}
      <Card className="border-success/50 bg-success/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-success">
            <CheckCircle className="w-6 h-6" />
            <div>
              <h3 className="font-semibold text-lg">Logo Detected Successfully!</h3>
              <p className="text-muted-foreground">
                Found <span className="font-medium text-foreground">{result.brand}</span> logo on {result.platform}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Impressions"
          value={result.estimated_impressions?.toLocaleString() || '0'}
          icon={<Eye className="w-5 h-5" />}
          gradient="from-analytics-blue to-primary-glow"
        />
        <MetricCard
          title="Total Engagements"
          value={totalEngagements.toLocaleString()}
          subtitle={`${engagementRate}% rate`}
          icon={<Users className="w-5 h-5" />}
          gradient="from-analytics-purple to-accent"
        />
        <MetricCard
          title="Clicks"
          value={result.clicks?.toLocaleString() || '0'}
          icon={<MousePointer className="w-5 h-5" />}
          gradient="from-analytics-green to-success"
        />
        <MetricCard
          title="Media Value"
          value={result.media_value ? `$${result.media_value.toLocaleString()}` : '$0'}
          icon={<TrendingUp className="w-5 h-5" />}
          gradient="from-analytics-orange to-destructive"
        />
      </div>

      {/* Detailed Engagement Breakdown */}
      {result.engagements && (
        <Card>
          <CardHeader>
            <CardTitle>Engagement Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <EngagementItem
              label="Likes"
              value={result.engagements.likes}
              total={totalEngagements}
              color="text-analytics-blue"
            />
            <EngagementItem
              label="Shares"
              value={result.engagements.shares}
              total={totalEngagements}
              color="text-analytics-purple"
            />
            <EngagementItem
              label="Comments"
              value={result.engagements.comments}
              total={totalEngagements}
              color="text-analytics-green"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  gradient: string;
}

const MetricCard = ({ title, value, subtitle, icon, gradient }: MetricCardProps) => (
  <Card className="shadow-soft hover:shadow-medium transition-all duration-200">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-r ${gradient} text-white`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

interface EngagementItemProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

const EngagementItem = ({ label, value, total, color }: EngagementItemProps) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium">{label}</span>
        <span className={`font-semibold ${color}`}>{value.toLocaleString()}</span>
      </div>
      <Progress value={percentage} className="h-2" />
      <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}% of total engagements</p>
    </div>
  );
};