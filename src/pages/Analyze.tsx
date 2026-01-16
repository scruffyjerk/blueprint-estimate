import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { UploadZone } from '@/components/upload/UploadZone';
import { SettingsPanel } from '@/components/upload/SettingsPanel';
import { AnalyzingState } from '@/components/upload/AnalyzingState';
import { ErrorState } from '@/components/upload/ErrorState';
import { useAnalysis } from '@/hooks/useAnalysis';

export default function Analyze() {
  const navigate = useNavigate();
  const {
    state,
    settings,
    selectedFile,
    filePreview,
    handleFileSelect,
    analyze,
    reset,
    updateSettings,
    setResult,
  } = useAnalysis();

  const handleAnalyze = async () => {
    const result = await analyze();
    if (result) {
      navigate('/results', { state: { result, thumbnail: filePreview } });
    }
  };

  const isLoading = state.status === 'uploading' || state.status === 'analyzing';

  return (
    <Layout hideFooter>
      <div className="container py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Analyze Your Blueprint
            </h1>
            <p className="text-muted-foreground">
              Upload a floor plan image to get started
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {isLoading ? (
              <AnalyzingState
                progress={state.progress}
                status={state.status as 'uploading' | 'analyzing'}
              />
            ) : state.status === 'error' ? (
              <ErrorState
                message={state.error || 'An error occurred'}
                onRetry={reset}
              />
            ) : (
              <>
                <UploadZone
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                  filePreview={filePreview}
                  onClear={reset}
                  disabled={isLoading}
                />

                <SettingsPanel
                  settings={settings}
                  onUpdate={updateSettings}
                  disabled={isLoading}
                />

                <Button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || isLoading}
                  size="lg"
                  className="w-full gap-2"
                >
                  Analyze Blueprint
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
