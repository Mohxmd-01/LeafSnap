import { useState } from 'react';
import { Microscope, Sparkles } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ImageUploader } from '@/components/prediction/ImageUploader';
import { PredictionResult } from '@/components/prediction/PredictionResult';
import { LoadingSpinner } from '@/components/prediction/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { usePrediction } from '@/hooks/usePrediction';

export default function Prediction() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { predict, reset, isLoading, result } = usePrediction();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    reset();
  };

  const handleClear = () => {
    setSelectedFile(null);
    reset();
  };

  const handlePredict = () => {
    if (selectedFile) {
      predict(selectedFile);
    }
  };

  return (
    <AppLayout title="Prediction">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Leaf Analysis
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            LeafSnap: Plant Health Insights
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Upload a apple leaf and get instant information about its health and potential diseases.
          </p>
        </div>

        {/* Upload Section */}
        <div className="space-y-4">
          <ImageUploader
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            onClear={handleClear}
            disabled={isLoading}
          />

          {selectedFile && !isLoading && !result && (
            <Button
              onClick={handlePredict}
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              <Microscope className="mr-2 h-5 w-5" />
              Predict Disease
            </Button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Result Section */}
        {result && <PredictionResult result={result} />}
      </div>
    </AppLayout>
  );
}
