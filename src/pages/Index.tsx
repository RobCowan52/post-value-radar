import { useState } from 'react';
import { AnalysisForm } from '@/components/AnalysisForm';
import { AnalysisResults } from '@/components/AnalysisResults';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { Button } from '@/components/ui/button';
import { BarChart3, ArrowLeft } from 'lucide-react';
import type { AnalysisResult } from '@/services/socialAnalytics';

const Index = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalysisStart = () => {
    setIsLoading(true);
    setAnalysisResult(null);
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setIsLoading(false);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-white shadow-soft border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">SocialAnalytics Pro</h1>
              <p className="text-sm text-muted-foreground">Brand detection & media value analysis</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isLoading && !analysisResult && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                Analyze Social Media Posts
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Detect brand logos in social media posts and get detailed analytics including 
                engagement metrics and estimated media value.
              </p>
            </div>
            <AnalysisForm 
              onAnalysisComplete={handleAnalysisComplete}
              onAnalysisStart={handleAnalysisStart}
            />
          </div>
        )}

        {isLoading && <LoadingAnimation />}

        {analysisResult && !isLoading && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleReset} 
                variant="outline" 
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Analyze Another Post
              </Button>
              <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>
            </div>
            <AnalysisResults result={analysisResult} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 SocialAnalytics Pro. Advanced social media analysis platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
