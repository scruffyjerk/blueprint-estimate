import { AnalysisResult, AnalysisSettings, Room, MaterialItem, CostBreakdown, TierEstimate } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://takeoff-api-uyzv.onrender.com';

/**
 * Transform the backend API response to match the frontend's expected structure
 */
function transformApiResponse(data: any): AnalysisResult {
  // The backend wraps the response in "blueprint_analysis"
  const analysis = data.blueprint_analysis || data;
  
  // Transform rooms - backend returns strings for area, frontend expects numbers
  const rooms: Room[] = (analysis.rooms || []).map((room: any) => ({
    name: room.name || 'Unknown Room',
    dimensions: {
      length: parseFloat(room.length) || 0,
      width: parseFloat(room.width) || 0,
      height: room.height || 0,
    },
    area: parseAreaString(room.area),
    confidence: parseConfidence(room.confidence),
  }));

  // Calculate total area from rooms if not provided
  const totalArea = analysis.total_area 
    ? parseAreaString(analysis.total_area)
    : rooms.reduce((sum, room) => sum + (room.area || 0), 0);

  // Build the result with defaults for missing fields
  const result: AnalysisResult = {
    project_name: data.project_name || 'Untitled Project',
    filename: analysis.filename || 'Unknown File',
    total_area: totalArea,
    unit_system: analysis.unit_system || 'imperial',
    rooms: rooms,
    materials: transformMaterials(data.materials || []),
    cost_breakdown: transformCostBreakdown(data.cost_breakdown || {}),
    tier_comparisons: transformTierComparisons(data.tier_comparisons || []),
    warnings: analysis.warnings || [],
    quality_tier: data.quality_tier || 'standard',
    region: data.region || 'us_national',
    include_labor: data.include_labor ?? true,
    contingency_percent: data.contingency_percent || 10,
  };

  return result;
}

/**
 * Parse area string like "14,8 m²" or "252 sq ft" to a number
 */
function parseAreaString(areaStr: string | number | null | undefined): number {
  if (typeof areaStr === 'number') return areaStr;
  if (!areaStr) return 0;
  
  // Remove units and parse the number
  const cleaned = areaStr
    .replace(/m²|sq\s*ft|sqft|square\s*feet|square\s*meters/gi, '')
    .replace(/,/g, '.') // Handle European decimal notation
    .trim();
  
  return parseFloat(cleaned) || 0;
}

/**
 * Parse confidence string to number (0-1)
 */
function parseConfidence(confidence: string | number | null | undefined): number {
  if (typeof confidence === 'number') return confidence;
  if (!confidence) return 0.5;
  
  const confidenceMap: Record<string, number> = {
    'high': 0.9,
    'medium': 0.7,
    'low': 0.4,
  };
  
  return confidenceMap[confidence.toLowerCase()] || 0.5;
}

/**
 * Transform materials array
 */
function transformMaterials(materials: any[]): MaterialItem[] {
  return materials.map((item: any) => ({
    name: item.name || item.material_name || 'Unknown Material',
    category: item.category || item.material_category || 'Other',
    quantity: item.quantity || item.qty || 0,
    unit: item.unit || 'units',
    unit_cost: item.unit_cost || item.unitCost || 0,
    material_cost: item.material_cost || item.materialCost || 0,
    labor_cost: item.labor_cost || item.laborCost || 0,
    total_cost: item.total_cost || item.totalCost || 0,
  }));
}

/**
 * Transform cost breakdown
 */
function transformCostBreakdown(breakdown: any): CostBreakdown {
  return {
    materials_subtotal: breakdown.materials_subtotal || breakdown.materialsSubtotal || 0,
    labor_subtotal: breakdown.labor_subtotal || breakdown.laborSubtotal || 0,
    subtotal: breakdown.subtotal || 0,
    contingency_amount: breakdown.contingency_amount || breakdown.contingencyAmount || 0,
    grand_total: breakdown.grand_total || breakdown.grandTotal || 0,
  };
}

/**
 * Transform tier comparisons
 */
function transformTierComparisons(tiers: any[]): TierEstimate[] {
  return tiers.map((tier: any) => ({
    tier: tier.tier || tier.quality_tier || 'standard',
    grand_total: tier.grand_total || tier.grandTotal || 0,
    materials_subtotal: tier.materials_subtotal || tier.materialsSubtotal || 0,
    labor_subtotal: tier.labor_subtotal || tier.laborSubtotal || 0,
  }));
}

export async function analyzeBlueprint(
  file: File,
  settings: AnalysisSettings
): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('file', file);

  const params = new URLSearchParams({
    project_name: settings.project_name || 'Untitled Project',
    quality_tier: settings.quality_tier,
    region: settings.region,
    include_labor: String(settings.include_labor),
    contingency_percent: String(settings.contingency_percent),
  });

  const response = await fetch(`${API_BASE_URL}/api/v1/analyze?${params}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Analysis failed: ${response.statusText}`);
  }

  const rawData = await response.json();
  
  // Transform the API response to match frontend expectations
  return transformApiResponse(rawData);
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Please upload a PNG, JPG, or WEBP image.' };
  }

  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File size must be under 10MB.' };
  }

  return { valid: true };
}
