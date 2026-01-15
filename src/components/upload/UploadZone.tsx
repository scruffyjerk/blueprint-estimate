import { useCallback, useState } from 'react';
import { Upload, FileImage, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface UploadZoneProps {
  onFileSelect: (file: File) => boolean;
  selectedFile: File | null;
  filePreview: string | null;
  onClear: () => void;
  disabled?: boolean;
}

export function UploadZone({ 
  onFileSelect, 
  selectedFile, 
  filePreview, 
  onClear,
  disabled 
}: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect, disabled]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const files = e.target.files;
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect, disabled]);

  if (selectedFile && filePreview) {
    return (
      <div className="card-elevated p-6 animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border border-border flex-shrink-0">
            <img 
              src={filePreview} 
              alt="Blueprint preview" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClear}
                disabled={disabled}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-3 text-sm text-success">
              <FileImage className="w-4 h-4" />
              <span>Ready to analyze</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <label
      className={cn(
        "upload-zone flex flex-col items-center justify-center p-8 md:p-12 cursor-pointer",
        isDragActive && "upload-zone-active",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
      />
      
      <div className="flex flex-col items-center text-center">
        <div className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors",
          isDragActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
          <Upload className="w-6 h-6" />
        </div>
        
        <p className="text-lg font-medium text-foreground mb-2">
          {isDragActive ? 'Drop your floor plan here' : 'Drag and drop your floor plan here'}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          PNG, JPG, WEBP up to 10MB
        </p>
      </div>
    </label>
  );
}
