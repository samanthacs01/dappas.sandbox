import { TableColumnHeader } from '@/core/components/common/table/table-column-header';
import { Button } from '@/core/components/ui/button';
import { UploadedDocument } from '@/server/types/booking';
import { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { FileWithPath } from 'react-dropzone';

type UseDraftsTableProps = {
  removeDocument: (fileToRemove: FileWithPath) => void;
  disabled?: boolean;
};

const useDraftsTable = ({ removeDocument, disabled }: UseDraftsTableProps) => {
  const columns: ColumnDef<UploadedDocument>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <TableColumnHeader column={column} label="Filename" disableSorting />
        );
      },
      cell: ({ row }) => <div className="px-4">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'file',
      header: () => <div />,
      cell: ({ cell }) => (
        <div className="flex gap-2 h-8 w-8">
          <Button
            disabled={disabled}
            variant="ghost"
            className="h-8 w-8"
            onClick={() => removeDocument(cell.getValue<FileWithPath>())}
            data-cy="drafts-table-remove-button"
          >
            <span className="sr-only">Delete</span>
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ];

  return { columns };
};

export default useDraftsTable;
