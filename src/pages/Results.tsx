import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { StickySummary } from '@/components/results/StickySummary';
import { BlueprintSummary } from '@/components/results/BlueprintSummary';
import { RoomBreakdown } from '@/components/results/RoomBreakdown';
import { CostTable } from '@/components/results/CostTable';
import { TierComparison } from '@/components/results/TierComparison';
import { ResultActions } from '@/components/results/ResultActions';
import { AnalysisResult, QualityTier } from '@/types';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result: initialResult, thumbnail } = (location.state || {}) as { 
    result?: AnalysisResult; 
    thumbnail?: string;
  };

  const [result, setResult] = useState<AnalysisResult | null>(initialResult || null);
  const [selectedTier, setSelectedTier] = useState<QualityTier>(initialResult?.quality_tier || 'standard');

  // Redirect if no result
  useEffect(() => {
    if (!result) {
      navigate('/analyze');
    }
  }, [result, navigate]);

  if (!result) {
    return null;
  }

  // Get current tier data
  const currentTierData = result.tier_comparisons?.find(t => t.tier === selectedTier);
  const displayTotal = currentTierData?.grand_total || result.cost_breakdown?.grand_total || 0;

  const handleTierChange = (tier: QualityTier) => {
    setSelectedTier(tier);
    // In a real app, this would recalculate with the API
  };

  const handleNewEstimate = () => {
    navigate('/analyze');
  };

  const handleDownloadPdf = () => {
    // PDF download would be implemented here
    alert('PDF download coming soon!');
  };

  return (
    <Layout hideFooter>
      <StickySummary
        grandTotal={displayTotal}
        roomCount={result.rooms?.length || 0}
        totalArea={result.total_area || 0}
      />

      <div className="container py-6 md:py-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <BlueprintSummary result={result} thumbnail={thumbnail} />

          <RoomBreakdown rooms={result.rooms || []} />

          <CostTable
            materials={result.materials || []}
            costBreakdown={result.cost_breakdown || {} as any}
            contingencyPercent={result.contingency_percent || 10}
          />

          <TierComparison
            tiers={result.tier_comparisons || []}
            currentTier={selectedTier}
            onTierChange={handleTierChange}
          />

          <ResultActions
            onNewEstimate={handleNewEstimate}
            onDownloadPdf={handleDownloadPdf}
          />
        </div>
      </div>
    </Layout>
  );
}
