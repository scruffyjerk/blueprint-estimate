import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TierEstimate, QualityTier } from '@/types';

interface TierComparisonProps {
  tiers: TierEstimate[];
  currentTier: QualityTier;
  onTierChange: (tier: QualityTier) => void;
}

const TIER_INFO: Record<QualityTier, { label: string; description: string }> = {
  budget: { label: 'Budget', description: 'Cost-effective materials' },
  standard: { label: 'Standard', description: 'Quality mid-range' },
  premium: { label: 'Premium', description: 'High-end finishes' },
  luxury: { label: 'Luxury', description: 'Top-tier everything' },
};

function formatCurrency(amount: number) {
  return '$' + (amount || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function TierComparison({ tiers, currentTier, onTierChange }: TierComparisonProps) {
  return (
    <div className="card-elevated p-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <h3 className="font-semibold text-foreground mb-4">Compare Quality Tiers</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tiers.map((tier) => {
          const info = TIER_INFO[tier.tier];
          const isActive = tier.tier === currentTier;
          
          return (
            <button
              key={tier.tier}
              onClick={() => onTierChange(tier.tier)}
              className={cn(
                "relative p-4 rounded-xl border-2 text-left transition-all",
                isActive 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              {isActive && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              
              <p className={cn(
                "font-semibold mb-1",
                isActive ? "text-primary" : "text-foreground"
              )}>
                {info.label}
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                {info.description}
              </p>
              <p className={cn(
                "font-mono font-bold",
                isActive ? "text-primary" : "text-foreground"
              )}>
                {formatCurrency(tier.grand_total)}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
