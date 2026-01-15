import { AnalysisResult, AnalysisSettings } from '@/types';

const API_BASE_URL = 'https://takeoff-api.onrender.com';

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

  return response.json();
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
