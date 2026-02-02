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

const US_STATES: { value: string; label: string }[] = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
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

            {/* Zipcode for State-Specific Pricing - Most Prominent */}
            <div className="space-y-2">
              <Label htmlFor="zipcode">Zipcode (recommended for accurate pricing)</Label>
              <Input
                id="zipcode"
                placeholder="Enter 5-digit zipcode"
                value={settings.zipcode || ''}
                onChange={(e) => onUpdate({ zipcode: e.target.value })}
                disabled={disabled}
                maxLength={5}
                pattern="[0-9]{5}"
              />
              <p className="text-sm text-muted-foreground">
                Zipcode provides the most accurate state-level pricing. If left blank, state selection below will be used.
              </p>
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

              {/* State */}
              <div className="space-y-2">
                <Label>State (optional)</Label>
                <Select
                  value={settings.region}
                  onValueChange={(value: string) => onUpdate({ region: value })}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
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
