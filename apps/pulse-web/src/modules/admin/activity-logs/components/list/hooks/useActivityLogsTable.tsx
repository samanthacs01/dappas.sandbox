import { TableColumnHeader } from '@/core/components/common/table/table-column-header';
import { Tooltip } from '@/core/components/common/tooltip';
import { Button } from '@/core/components/ui/button';
import useUrlParams from '@/core/hooks/use-url-params';
import { valueFormatter } from '@/core/lib/numbers';
import {
  actionsName,
  ActivityLogs,
  entityName,
  LogData,
} from '@/server/types/logs';
import { ColumnDef } from '@tanstack/react-table';
import { Logs } from 'lucide-react';

const useActivityLogsTable = () => {
  const { updateSearchParams } = useUrlParams();

  const handleOnViewJSON = (data: LogData) => {
    updateSearchParams({
      current_modal: { action: 'set', value: 'view-json' },
    });

    localStorage.setItem('local-activity-logs', JSON.stringify(data));
  };
  const columns: ColumnDef<ActivityLogs>[] = [
    {
      accessorKey: 'action_at',
      header: ({ column }) => (
        <TableColumnHeader column={column} label="Action at" />
      ),
      cell: ({ row }) => (
        <div className="px-4">
          {valueFormatter(row.getValue('action_at'), 'date')}
        </div>
      ),
    },
    {
      accessorKey: 'entity',
      header: ({ column }) => (
        <TableColumnHeader column={column} label="Entity" />
      ),
      cell: ({ row }) => (
        <div className="px-4">
          {entityName[row.original.entity] ?? row.original.entity}
        </div>
      ),
    },
    {
      accessorKey: 'actor',
      header: ({ column }) => (
        <TableColumnHeader column={column} label="Actor" />
      ),
      cell: ({ row }) => <div className="px-4">{row.original.actor}</div>,
    },
    {
      accessorKey: 'action',
      header: ({ column }) => (
        <TableColumnHeader column={column} label="Action" />
      ),
      cell: ({ row }) => (
        <div className="px-4">
          {actionsName[row.original.action] ?? row.original.action}
        </div>
      ),
    },

    {
      accessorKey: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="px-4">
          <Tooltip title="View logs data.">
            <Button
              variant={'ghost'}
              onClick={() => handleOnViewJSON(row.original.data)}
            >
              <Logs />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];
  return { columns };
};

export default useActivityLogsTable;
