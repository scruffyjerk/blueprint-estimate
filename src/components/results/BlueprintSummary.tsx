import { FileImage, AlertTriangle, Ruler, Layers } from 'lucide-react';
import { AnalysisResult } from '@/types';

interface BlueprintSummaryProps {
  result: AnalysisResult;
  thumbnail?: string;
}

export function BlueprintSummary({ result, thumbnail }: BlueprintSummaryProps) {
  return (
    <div className="card-elevated p-5 animate-slide-up">
      <div className="flex gap-4">
        {thumbnail && (
          <div className="w-20 h-20 rounded-lg overflow-hidden border border-border flex-shrink-0">
            <img src={thumbnail} alt="Blueprint" className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-3">
            <FileImage className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate">{result.filename}</h3>
              <p className="text-sm text-muted-foreground">{result.project_name}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Ruler className="w-4 h-4" />
              <span>{result.total_area.toLocaleString()} {result.unit_system}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Layers className="w-4 h-4" />
              <span>{result.rooms.length} rooms detected</span>
            </div>
          </div>
        </div>
      </div>

      {result.warnings.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/20">
          <div className="flex gap-2">
            <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              {result.warnings.map((warning, i) => (
                <p key={i} className="text-warning">{warning}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
