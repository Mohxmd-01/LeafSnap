import { Loader2, Leaf } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function LoadingSpinner() {
  return (
    <Card className="border-2 border-primary/20">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Leaf className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <Loader2 className="h-16 w-16 text-primary/30 animate-spin" />
        </div>
        <p className="mt-6 text-lg font-medium text-foreground">
          Examining your leaf...
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Identifying possible plant health issues
        </p>
      </CardContent>
    </Card>
  );
}
