import { TableColumnHeader } from '@/core/components/common/table/table-column-header';
import { Tooltip } from '@/core/components/common/tooltip';
import { Button } from '@/core/components/ui/button';
import { Checkbox } from '@/core/components/ui/checkbox';
import { paths } from '@/core/lib/routes';
import { draftTypeRender } from '@/modules/commons/statuses/draftTypeRender';
import { Draft, DraftStatus } from '@/server/types/booking';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

const useDraftsTable = () => {
  const router = useRouter();
  const reviewDraft = (draftId: number) => {
    router.push(
      paths.booking.drafts.reviewDraft.replace(':id', draftId.toString()),
    );
  };

  const columns: ColumnDef<Draft>[] = [
    {
      accessorKey: 'id',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          data-cy="drafts-table-select-all-checkbox"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          data-cy="drafts-table-select-row-checkbox"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'file_name',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Filename" />;
      },
      cell: ({ row }) => (
        <div className="px-4">{row.getValue('file_name')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Status" />;
      },
      cell: ({ row }) => (
        <div className="px-4">
          {draftTypeRender(row.getValue<DraftStatus>('status'))}
        </div>
      ),
    },
    {
      accessorKey: 'actions',
      enableHiding: false,
      header: () => <div className="w-2" />,
      maxSize: 1,
      cell: ({ row }) => (
        <div className="flex gap-2 h-8 w-8">
          {row.getValue<DraftStatus>('status') === 'pending_to_review' ? (
            <Tooltip title="Review draft.">
              <Button
                variant="ghost"
                className="h-8 w-8"
                onClick={() => reviewDraft(row.getValue('id'))}
                data-cy="drafts-table-review-button"
              >
                <span className="sr-only">Review</span>
                <Eye />
              </Button>
            </Tooltip>
          ) : null}
        </div>
      ),
    },
  ];

  return { columns };
};

export default useDraftsTable;
