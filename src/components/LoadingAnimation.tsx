import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';

const loadingSteps = [
  { text: 'Detecting platform...', duration: 800 },
  { text: 'Analyzing media content...', duration: 1200 },
  { text: 'Detecting brand logos...', duration: 1000 },
  { text: 'Fetching engagement metrics...', duration: 1500 },
  { text: 'Calculating media value...', duration: 800 },
];

export const LoadingAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let stepTimeout: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    const runStep = (stepIndex: number) => {
      if (stepIndex >= loadingSteps.length) return;

      const step = loadingSteps[stepIndex];
      const stepProgress = (stepIndex / loadingSteps.length) * 100;
      
      setCurrentStep(stepIndex);
      
      // Animate progress for this step
      progressInterval = setInterval(() => {
        setProgress(prev => {
          const target = ((stepIndex + 1) / loadingSteps.length) * 100;
          const increment = (target - stepProgress) / (step.duration / 50);
          return Math.min(prev + increment, target);
        });
      }, 50);

      stepTimeout = setTimeout(() => {
        clearInterval(progressInterval);
        runStep(stepIndex + 1);
      }, step.duration);
    };

    runStep(0);

    return () => {
      clearTimeout(stepTimeout);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-medium">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold">Analyzing Your Post</h3>
            <p className="text-muted-foreground">This may take a few moments...</p>
          </div>

          <div className="space-y-3">
            <Progress value={progress} className="h-2" />
            <div className="text-center">
              <p className="text-sm font-medium text-primary">
                {loadingSteps[currentStep]?.text || 'Processing...'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {loadingSteps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 text-sm ${
                  index < currentStep
                    ? 'text-success'
                    : index === currentStep
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    index < currentStep
                      ? 'bg-success'
                      : index === currentStep
                      ? 'bg-primary animate-pulse'
                      : 'bg-muted'
                  }`}
                />
                {step.text}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};