import { MaterialItem, CostBreakdown } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CostTableProps {
  materials: MaterialItem[];
  costBreakdown: CostBreakdown;
  contingencyPercent: number;
}

function formatCurrency(amount: number) {
  return '$' + (amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function CostTable({ materials, costBreakdown, contingencyPercent }: CostTableProps) {
  // Group materials by category
  const grouped = materials.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MaterialItem[]>);

  return (
    <div className="card-elevated overflow-hidden animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Cost Estimate</h3>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Material</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right hidden sm:table-cell">Unit Cost</TableHead>
              <TableHead className="text-right hidden md:table-cell">Materials</TableHead>
              <TableHead className="text-right hidden md:table-cell">Labor</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(grouped).map(([category, items]) => (
              <>
                <TableRow key={category} className="bg-muted/50">
                  <TableCell colSpan={6} className="font-medium text-muted-foreground text-xs uppercase tracking-wide py-2">
                    {category}
                  </TableCell>
                </TableRow>
                {items.map((item, index) => (
                  <TableRow key={`${category}-${index}`}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {item.quantity} {item.unit}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm hidden sm:table-cell">
                      {formatCurrency(item.unit_cost)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm hidden md:table-cell">
                      {formatCurrency(item.material_cost)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm hidden md:table-cell">
                      {formatCurrency(item.labor_cost)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-medium">
                      {formatCurrency(item.total_cost)}
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="border-t border-border bg-surface p-4">
        <div className="space-y-2 max-w-xs ml-auto">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Materials Subtotal</span>
            <span className="font-mono">{formatCurrency(costBreakdown.materials_subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Labor Subtotal</span>
            <span className="font-mono">{formatCurrency(costBreakdown.labor_subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-mono">{formatCurrency(costBreakdown.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Contingency ({contingencyPercent}%)</span>
            <span className="font-mono">{formatCurrency(costBreakdown.contingency_amount)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border">
            <span className="font-semibold">Grand Total</span>
            <span className="font-mono font-bold text-lg text-primary">
              {formatCurrency(costBreakdown.grand_total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
