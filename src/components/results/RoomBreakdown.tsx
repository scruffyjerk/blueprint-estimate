import { cn } from '@/lib/utils';
import { Room } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface RoomBreakdownProps {
  rooms: Room[];
}

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const level = confidence >= 0.85 ? 'high' : confidence >= 0.7 ? 'medium' : 'low';
  const labels = { high: 'High', medium: 'Medium', low: 'Low' };
  
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
      level === 'high' && "bg-success/10 text-success",
      level === 'medium' && "bg-warning/10 text-warning",
      level === 'low' && "bg-destructive/10 text-destructive"
    )}>
      {labels[level]}
    </span>
  );
}

export function RoomBreakdown({ rooms }: RoomBreakdownProps) {
  return (
    <div className="card-elevated overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Room Breakdown</h3>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room</TableHead>
              <TableHead className="text-right">Dimensions</TableHead>
              <TableHead className="text-right">Area</TableHead>
              <TableHead className="text-right">Confidence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{room.name || 'Unknown Room'}</TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {(room.dimensions?.length || 0)}' × {(room.dimensions?.width || 0)}'
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {(room.area || 0).toLocaleString()} sq ft
                </TableCell>
                <TableCell className="text-right">
                  <ConfidenceBadge confidence={room.confidence || 0} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
