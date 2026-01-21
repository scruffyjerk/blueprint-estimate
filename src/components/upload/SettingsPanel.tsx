import { useState } from 'react';
import { ChevronDown, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { AnalysisSettings, QualityTier, Region, LaborAvailability } from '@/types';

interface SettingsPanelProps {
  settings: AnalysisSettings;
  onUpdate: (updates: Partial<AnalysisSettings>) => void;
  disabled?: boolean;
}

const QUALITY_TIERS: { value: QualityTier; label: string; description: string }[] = [
  { value: 'budget', label: 'Budget', description: 'Cost-effective materials' },
  { value: 'standard', label: 'Standard', description: 'Quality mid-range options' },
  { value: 'premium', label: 'Premium', description: 'High-end finishes' },
  { value: 'luxury', label: 'Luxury', description: 'Top-tier materials' },
];

const REGIONS: { value: Region; label: string }[] = [
  { value: 'us_national', label: 'National Average' },
  { value: 'us_northeast', label: 'Northeast' },
  { value: 'us_southeast', label: 'Southeast' },
  { value: 'us_midwest', label: 'Midwest' },
  { value: 'us_southwest', label: 'Southwest' },
  { value: 'us_west', label: 'West' },
];

const LABOR_AVAILABILITY: { value: LaborAvailability; label: string; description: string; adjustment: string }[] = [
  { value: 'low', label: 'Low', description: 'Labor shortage in your area', adjustment: '+15%' },
  { value: 'average', label: 'Average', description: 'Normal market conditions', adjustment: '0%' },
  { value: 'high', label: 'High', description: 'Labor surplus available', adjustment: '-10%' },
];

export function SettingsPanel({ settings, onUpdate, disabled }: SettingsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="card-elevated overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
        disabled={disabled}
      >
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-muted-foreground" />
          <span className="font-medium">Project Settings</span>
        </div>
        <ChevronDown className={cn(
          "w-5 h-5 text-muted-foreground transition-transform",
          isExpanded && "rotate-180"
        )} />
      </button>

      <div className={cn(
        "grid transition-all duration-200",
        isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      )}>
        <div className="overflow-hidden">
          <div className="p-4 pt-0 space-y-6 border-t border-border">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name (optional)</Label>
              <Input
                id="project-name"
                placeholder="My Construction Project"
                value={settings.project_name}
                onChange={(e) => onUpdate({ project_name: e.target.value })}
                disabled={disabled}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Quality Tier */}
              <div className="space-y-2">
                <Label>Quality Tier</Label>
                <Select
                  value={settings.quality_tier}
                  onValueChange={(value: QualityTier) => onUpdate({ quality_tier: value })}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUALITY_TIERS.map((tier) => (
                      <SelectItem key={tier.value} value={tier.value}>
                        <div>
                          <span className="font-medium">{tier.label}</span>
                          <span className="text-muted-foreground ml-2 text-sm">
                            {tier.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Region */}
              <div className="space-y-2">
                <Label>Region</Label>
                <Select
                  value={settings.region}
                  onValueChange={(value: Region) => onUpdate({ region: value })}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Labor Availability Toggle */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <Label>Local Labor Availability</Label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {LABOR_AVAILABILITY.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onUpdate({ labor_availability: option.value })}
                    disabled={disabled}
                    className={cn(
                      "relative flex flex-col items-center p-3 rounded-lg border-2 transition-all",
                      settings.labor_availability === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/50",
                      disabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <span className="font-medium text-sm">{option.label}</span>
                    <span className={cn(
                      "text-xs mt-1 font-mono",
                      option.value === 'low' && "text-red-500",
                      option.value === 'average' && "text-muted-foreground",
                      option.value === 'high' && "text-green-500"
                    )}>
                      {option.adjustment} labor
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Adjust labor costs based on local market conditions. Low availability = higher costs due to labor shortage.
              </p>
            </div>

            {/* Include Labor */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="include-labor" className="text-base">Include Labor Costs</Label>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Add estimated labor to your total
                </p>
              </div>
              <Switch
                id="include-labor"
                checked={settings.include_labor}
                onCheckedChange={(checked) => onUpdate({ include_labor: checked })}
                disabled={disabled}
              />
            </div>

            {/* Contingency */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Contingency</Label>
                <span className="text-sm font-mono font-medium text-foreground">
                  {settings.contingency_percent}%
                </span>
              </div>
              <Slider
                value={[settings.contingency_percent]}
                onValueChange={([value]) => onUpdate({ contingency_percent: value })}
                min={0}
                max={25}
                step={5}
                disabled={disabled}
              />
              <p className="text-sm text-muted-foreground">
                Buffer for unexpected costs and changes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
