export interface Room {
  name: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  area: number;
  confidence: number;
}

export interface MaterialItem {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unit_cost: number;
  material_cost: number;
  labor_cost: number;
  total_cost: number;
}

export interface CostBreakdown {
  materials_subtotal: number;
  labor_subtotal: number;
  subtotal: number;
  contingency_amount: number;
  grand_total: number;
}

export interface TierEstimate {
  tier: QualityTier;
  grand_total: number;
  materials_subtotal: number;
  labor_subtotal: number;
}

export interface AnalysisResult {
  project_name: string;
  filename: string;
  total_area: number;
  unit_system: string;
  rooms: Room[];
  materials: MaterialItem[];
  cost_breakdown: CostBreakdown;
  tier_comparisons: TierEstimate[];
  warnings: string[];
  quality_tier: QualityTier;
  region: Region;
  include_labor: boolean;
  contingency_percent: number;
}

export type QualityTier = 'budget' | 'standard' | 'premium' | 'luxury';
export type Region = 'national' | 'northeast' | 'southeast' | 'midwest' | 'southwest' | 'west';

export interface AnalysisSettings {
  project_name: string;
  quality_tier: QualityTier;
  region: Region;
  include_labor: boolean;
  contingency_percent: number;
}

export interface AnalysisState {
  status: 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';
  progress: number;
  result: AnalysisResult | null;
  error: string | null;
}
