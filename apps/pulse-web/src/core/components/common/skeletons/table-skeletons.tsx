import { Skeleton } from '@/core/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/core/components/ui/table';

interface TableSkeletonsProps {
  rows: number;
  columns: number;
  showHeader?: boolean;
  showActions?: boolean;
}

export default function TableSkeletons({
  rows,
  columns,
  showHeader = true,
  showActions = false,
}: TableSkeletonsProps) {
  const getRandomWidth = () => `${Math.floor(Math.random() * 30 + 70)}%`;

  return (
    <div className="w-full overflow-hidden border rounded-lg">
      <Table>
        {showHeader && (
          <TableHeader>
            <TableRow className="bg-muted/50">
              {[...Array(columns)].map((_, index) => (
                <TableHead key={index} className="h-10 px-2 py-3">
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
              {showActions && <TableHead className="w-[100px]" />}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {[...Array(rows)].map((_, rowIndex) => (
            <TableRow
              key={rowIndex}
              className="border-b transition-colors hover:bg-muted/50"
            >
              {[...Array(columns)].map((_, colIndex) => (
                <TableCell key={colIndex} className="p-2 py-3">
                  <Skeleton className={`h-4 w-${getRandomWidth()}`} />
                </TableCell>
              ))}
              {showActions && (
                <TableCell className="p-2">
                  <div className="flex justify-end space-x-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
