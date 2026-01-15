import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="card-elevated p-8 md:p-12 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Something went wrong
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {message}
      </p>

      <Button onClick={onRetry} variant="outline" className="gap-2">
        <RefreshCw className="w-4 h-4" />
        Try Again
      </Button>
    </div>
  );
}
