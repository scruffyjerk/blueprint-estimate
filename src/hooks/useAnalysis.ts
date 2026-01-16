import { useState, useCallback } from 'react';
import { AnalysisState, AnalysisSettings, AnalysisResult } from '@/types';
import { analyzeBlueprint, validateFile } from '@/services/api';

const DEFAULT_SETTINGS: AnalysisSettings = {
  project_name: '',
  quality_tier: 'standard',
  region: 'us_national',
  include_labor: true,
  contingency_percent: 10,
};

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    status: 'idle',
    progress: 0,
    result: null,
    error: null,
  });

  const [settings, setSettings] = useState<AnalysisSettings>(DEFAULT_SETTINGS);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setState(prev => ({ ...prev, status: 'error', error: validation.error || 'Invalid file' }));
      return false;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setFilePreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setState(prev => ({ ...prev, status: 'idle', error: null }));
    return true;
  }, []);

  const analyze = useCallback(async () => {
    if (!selectedFile) {
      setState(prev => ({ ...prev, status: 'error', error: 'Please select a file first.' }));
      return null;
    }

    setState({ status: 'uploading', progress: 0, result: null, error: null });

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setState(prev => {
        if (prev.progress < 30) {
          return { ...prev, progress: prev.progress + 10 };
        }
        return prev;
      });
    }, 200);

    try {
      setState(prev => ({ ...prev, status: 'analyzing', progress: 40 }));
      clearInterval(progressInterval);

      // Simulate analysis progress
      const analysisInterval = setInterval(() => {
        setState(prev => {
          if (prev.progress < 90) {
            return { ...prev, progress: prev.progress + 10 };
          }
          return prev;
        });
      }, 500);

      const result = await analyzeBlueprint(selectedFile, settings);
      
      clearInterval(analysisInterval);
      setState({ status: 'complete', progress: 100, result, error: null });
      return result;
    } catch (error) {
      clearInterval(progressInterval);
      const message = error instanceof Error ? error.message : 'Analysis failed. Please try again.';
      setState({ status: 'error', progress: 0, result: null, error: message });
      return null;
    }
  }, [selectedFile, settings]);

  const reset = useCallback(() => {
    setState({ status: 'idle', progress: 0, result: null, error: null });
    setSelectedFile(null);
    setFilePreview(null);
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const updateSettings = useCallback((updates: Partial<AnalysisSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const setResult = useCallback((result: AnalysisResult) => {
    setState({ status: 'complete', progress: 100, result, error: null });
  }, []);

  return {
    state,
    settings,
    selectedFile,
    filePreview,
    handleFileSelect,
    analyze,
    reset,
    updateSettings,
    setResult,
  };
}
