import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AnalyzingStateProps {
  progress: number;
  status: 'uploading' | 'analyzing';
}

export function AnalyzingState({ progress, status }: AnalyzingStateProps) {
  const messages = {
    uploading: 'Uploading your blueprint...',
    analyzing: 'AI is analyzing rooms and dimensions...',
  };

  return (
    <div className="card-elevated p-8 md:p-12 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {messages[status]}
      </h3>
      <p className="text-muted-foreground mb-6">
        This usually takes 10–30 seconds.
      </p>

      <div className="max-w-sm mx-auto space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-sm font-mono text-muted-foreground">
          {progress}%
        </p>
      </div>
    </div>
  );
}
