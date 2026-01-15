import { Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResultActionsProps {
  onNewEstimate: () => void;
  onDownloadPdf?: () => void;
}

export function ResultActions({ onNewEstimate, onDownloadPdf }: ResultActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 animate-slide-up" style={{ animationDelay: '0.4s' }}>
      <Button 
        onClick={onDownloadPdf}
        variant="outline"
        className="flex-1 gap-2"
      >
        <Download className="w-4 h-4" />
        Download PDF Report
      </Button>
      <Button 
        onClick={onNewEstimate}
        className="flex-1 gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Start New Estimate
      </Button>
    </div>
  );
}
