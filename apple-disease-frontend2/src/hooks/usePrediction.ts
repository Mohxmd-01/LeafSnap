import { useState } from 'react';
import { predictDisease, PredictionResponse } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export function usePrediction() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const predict = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await predictDisease(file);
      setResult(response);
      
      if (response.confidence >= 70) {
        toast({
          title: "Prediction Complete",
          description: `Detected: ${response.disease} with ${response.confidence.toFixed(1)}% confidence`,
        });
      } else {
        toast({
          title: "Low Confidence Prediction",
          description: "Please try uploading a clearer image",
          variant: "destructive",
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Prediction failed';
      setError(message);
      toast({
        title: "Prediction Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return {
    predict,
    reset,
    isLoading,
    result,
    error,
  };
}
