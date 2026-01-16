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

// Mock result for demo (since API might not be available)
const MOCK_RESULT = {
  project_name: 'My Construction Project',
  filename: 'floor-plan.png',
  total_area: 2450,
  unit_system: 'sq ft',
  rooms: [
    { name: 'Living Room', dimensions: { length: 20, width: 15, height: 9 }, area: 300, confidence: 0.92 },
    { name: 'Master Bedroom', dimensions: { length: 16, width: 14, height: 9 }, area: 224, confidence: 0.88 },
    { name: 'Kitchen', dimensions: { length: 14, width: 12, height: 9 }, area: 168, confidence: 0.95 },
    { name: 'Bedroom 2', dimensions: { length: 12, width: 11, height: 9 }, area: 132, confidence: 0.85 },
    { name: 'Bathroom 1', dimensions: { length: 10, width: 8, height: 9 }, area: 80, confidence: 0.90 },
    { name: 'Bathroom 2', dimensions: { length: 8, width: 6, height: 9 }, area: 48, confidence: 0.87 },
  ],
  materials: [
    { name: 'Hardwood Flooring', category: 'Flooring', quantity: 520, unit: 'sq ft', unit_cost: 8.50, material_cost: 4420, labor_cost: 1560, total_cost: 5980 },
    { name: 'Carpet', category: 'Flooring', quantity: 356, unit: 'sq ft', unit_cost: 4.25, material_cost: 1513, labor_cost: 534, total_cost: 2047 },
    { name: 'Tile Flooring', category: 'Flooring', quantity: 128, unit: 'sq ft', unit_cost: 12.00, material_cost: 1536, labor_cost: 640, total_cost: 2176 },
    { name: 'Interior Paint', category: 'Paint', quantity: 12, unit: 'gallons', unit_cost: 45.00, material_cost: 540, labor_cost: 1200, total_cost: 1740 },
    { name: 'Primer', category: 'Paint', quantity: 6, unit: 'gallons', unit_cost: 32.00, material_cost: 192, labor_cost: 300, total_cost: 492 },
    { name: 'Drywall Sheets', category: 'Drywall', quantity: 98, unit: 'sheets', unit_cost: 14.00, material_cost: 1372, labor_cost: 1960, total_cost: 3332 },
    { name: 'Joint Compound', category: 'Drywall', quantity: 8, unit: 'buckets', unit_cost: 18.00, material_cost: 144, labor_cost: 0, total_cost: 144 },
    { name: 'Baseboard Trim', category: 'Trim', quantity: 320, unit: 'linear ft', unit_cost: 3.50, material_cost: 1120, labor_cost: 640, total_cost: 1760 },
    { name: 'Crown Molding', category: 'Trim', quantity: 180, unit: 'linear ft', unit_cost: 5.25, material_cost: 945, labor_cost: 540, total_cost: 1485 },
  ],
  cost_breakdown: {
    materials_subtotal: 11782,
    labor_subtotal: 7374,
    subtotal: 19156,
    contingency_amount: 1916,
    grand_total: 21072,
  },
  tier_comparisons: [
    { tier: 'budget' as const, grand_total: 15246, materials_subtotal: 8540, labor_subtotal: 5780 },
    { tier: 'standard' as const, grand_total: 21072, materials_subtotal: 11782, labor_subtotal: 7374 },
    { tier: 'premium' as const, grand_total: 32450, materials_subtotal: 18230, labor_subtotal: 11680 },
    { tier: 'luxury' as const, grand_total: 48920, materials_subtotal: 27540, labor_subtotal: 17420 },
  ],
  warnings: [],
  quality_tier: 'standard' as const,
  region: 'national' as const,
  include_labor: true,
  contingency_percent: 10,
};

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

                {useMock && (
                  <p className="text-xs text-center text-muted-foreground">
                    Demo mode: Using sample data for demonstration
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
