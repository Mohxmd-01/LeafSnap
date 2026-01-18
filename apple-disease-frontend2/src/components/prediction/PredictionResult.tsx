import { AlertTriangle, CheckCircle2, Leaf, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { PredictionResponse } from '@/services/api';

interface PredictionResultProps {
  result: PredictionResponse;
}

export function PredictionResult({ result }: PredictionResultProps) {
  const { disease, confidence } = result;
  const isLowConfidence = confidence < 70;
  const isHealthy = disease.toLowerCase().includes('healthy');

  const getConfidenceColor = () => {
    if (confidence >= 85) return 'text-success';
    if (confidence >= 70) return 'text-primary';
    return 'text-warning';
  };

  const getProgressColor = () => {
    if (confidence >= 85) return 'bg-success';
    if (confidence >= 70) return 'bg-primary';
    return 'bg-warning';
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {isLowConfidence && (
        <Alert variant="destructive" className="border-warning/50 bg-warning/10">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <AlertTitle className="text-warning">Uncertain Prediction</AlertTitle>
          <AlertDescription className="text-warning/80">
             Confidence for this prediction is below 70%. Try uploading a clearer, well-lit leaf image for more accurate results.
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-lg">
            {isHealthy ? (
              <CheckCircle2 className="h-6 w-6 text-success" />
            ) : (
              <Leaf className="h-6 w-6 text-primary" />
            )}
            Prediction Result
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Detected Condition
              </p>
              <h2 className={cn(
                'text-2xl sm:text-3xl font-bold',
                isHealthy ? 'text-success' : 'text-foreground'
              )}>
                {disease}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className={cn('h-5 w-5', getConfidenceColor())} />
              <span className={cn('text-3xl font-bold', getConfidenceColor())}>
                {confidence.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Confidence Level</span>
              <span className={cn('font-medium', getConfidenceColor())}>
                {confidence >= 85 ? 'High' : confidence >= 70 ? 'Moderate' : 'Low'}
              </span>
            </div>
            <div className="relative h-3 rounded-full bg-muted overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-500', getProgressColor())}
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
