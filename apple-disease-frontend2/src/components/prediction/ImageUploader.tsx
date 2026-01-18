import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  disabled?: boolean;
}

export function ImageUploader({ onFileSelect, selectedFile, onClear, disabled }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    if (file.type.startsWith('image/')) {
      onFileSelect(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleClear = useCallback(() => {
    setPreview(null);
    onClear();
  }, [onClear]);

  if (selectedFile && preview) {
    return (
      <Card className="relative overflow-hidden border-2 border-primary/20 bg-card">
        <CardContent className="p-0">
          <div className="relative aspect-video w-full max-h-80 overflow-hidden bg-muted">
            <img
              src={preview}
              alt="Selected leaf"
              className="h-full w-full object-contain"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute right-3 top-3 h-8 w-8 rounded-full shadow-lg"
              onClick={handleClear}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-3 p-4 border-t bg-muted/30">
            <ImageIcon className="h-5 w-5 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'border-2 border-dashed transition-all duration-200 cursor-pointer',
        isDragging
          ? 'border-primary bg-primary/5 scale-[1.02]'
          : 'border-border hover:border-primary/50 hover:bg-muted/50',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <CardContent className="flex flex-col items-center justify-center py-12 px-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
          id="image-upload"
          disabled={disabled}
        />
        <label
          htmlFor="image-upload"
          className={cn(
            'flex flex-col items-center gap-4 cursor-pointer',
            disabled && 'cursor-not-allowed'
          )}
        >
          <div className={cn(
            'flex h-16 w-16 items-center justify-center rounded-2xl transition-colors',
            isDragging ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
          )}>
            <Upload className="h-8 w-8" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">
              Drop your leaf image here
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              or click to browse files
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-1 rounded bg-muted">JPG</span>
            <span className="px-2 py-1 rounded bg-muted">PNG</span>
            <span className="px-2 py-1 rounded bg-muted">WEBP</span>
          </div>
        </label>
      </CardContent>
    </Card>
  );
}
