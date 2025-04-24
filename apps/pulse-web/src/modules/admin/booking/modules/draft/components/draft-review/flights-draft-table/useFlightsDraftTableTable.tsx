import RHFDatePickerToggle from '@/core/components/common/form-inputs/rhf-date-picker-toggle';
import RHFFromCombobox from '@/core/components/common/form-inputs/rhf-from-combobox';
import RHFTextField from '@/core/components/common/form-inputs/rhf-text-field';
import { TableColumnHeader } from '@/core/components/common/table/table-column-header';
import { Button } from '@/core/components/ui/button';
import { Checkbox } from '@/core/components/ui/checkbox';
import useUrlParams from '@/core/hooks/use-url-params';
import { getProductionsNomenclator } from '@/server/services/nomenclator';
import { DraftFlights } from '@/server/types/booking';
import { ComboBoxOption } from '@/server/types/combo-box';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const useFlightsDraftTableTable = () => {
  const [options, setOptions] = useState<ComboBoxOption[]>([]);
  const { updateSearchParams } = useUrlParams();

  useEffect(() => {
    getProductions();
  }, []);

  const getProductions = async () => {
    const data = await getProductionsNomenclator();
    if (data) {
      setOptions(data);
    }
  };

  const onDeleteRow = (row: Row<DraftFlights>) => {
    updateSearchParams({
      currentModal: {
        action: 'set',
        value: 'delete-flight-draft',
      },
      deleteIndex: {
        action: 'set',
        value: row.index.toString(),
      },
    });
  };

  const columns: ColumnDef<DraftFlights>[] = [
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
        />
      ),
      cell: ({ row }) => (
        <div className="h-6 flex items-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'production',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Production" disableSorting/>;
      },
      cell: ({ row }) => (
        <div className="mx-4 w-52">
          <RHFFromCombobox
            name={`flights[${row.index}].production_id`}
            options={options}
            placeholder="Select a production"
            disableErrorLabel
            autoClose
          />
        </div>
      ),
    },
    {
      accessorKey: 'advertiser',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Advertiser" disableSorting/>;
      },
      cell: ({ row }) => (
        <div className="px-4">
          <RHFTextField
            name={`flights[${row.index}].advertiser`}
            disableErrorLabel
          />
        </div>
      ),
    },
    {
      accessorKey: 'media',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Media" disableSorting/>;
      },
      cell: ({ row }) => (
        <div className="px-4">
          <RHFTextField
            name={`flights[${row.index}].media`}
            disableErrorLabel
          />
        </div>
      ),
    },
    {
      accessorKey: 'ads_type',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Ads type" disableSorting/>;
      },
      cell: ({ row }) => (
        <div className="px-4">
          <RHFTextField
            name={`flights[${row.index}].ads_type`}
            disableErrorLabel
          />
        </div>
      ),
    },
    {
      accessorKey: 'placement',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Placement" disableSorting/>;
      },
      cell: ({ row }) => (
        <div className="px-4">
          <RHFTextField
            name={`flights[${row.index}].placement`}
            disableErrorLabel
          />
        </div>
      ),
    },
    {
      accessorKey: 'length',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Length (Secs)" disableSorting/>;
      },
      cell: ({ row }) => (
        <div className="px-4">
          <RHFTextField
            name={`flights[${row.index}].length`}
            disableErrorLabel
            type="text"
          />
        </div>
      ),
    },
    {
      accessorKey: 'cpm',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="CPM" disableSorting/>;
      },
      cell: ({ row }) => (
        <div className="px-4">
          <RHFTextField
            name={`flights[${row.index}].cpm`}
            type="number"
            disableErrorLabel
          />
        </div>
      ),
    },
    {
      accessorKey: 'total_cost',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Total cost" disableSorting/>;
      },
      cell: ({ row }) => (
        <div className="px-4">
          <RHFTextField
            name={`flights[${row.index}].total_cost`}
            disableErrorLabel
            type="number"
          />
        </div>
      ),
    },
    {
      accessorKey: 'drop_dates',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Date(s)" disableSorting />;
      },
      cell: ({ row }) => {
        return (
          <div className="px-4">
            {/* <RHFTextField
              name={`flights[${row.index}].drop_dates`}
              disableErrorLabel
            /> */}
            <RHFDatePickerToggle
              name={`flights[${row.index}].drop_dates`}
              disableErrorLabel
            />
          </div>
        );
      },
    },
    {
      accessorKey: 'impressions',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Impressions" disableSorting/>;
      },
      cell: ({ row }) => (
        <div className="px-4">
          <RHFTextField
            name={`flights[${row.index}].impressions`}
            type="number"
            disableErrorLabel
          />
        </div>
      ),
    },
    {
      accessorKey: 'promo_code',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Promo code" disableSorting/>;
      },
      cell: ({ row }) => (
        <div className="px-4">
          <RHFTextField name={`flights[${row.index}].promo_code`} />
        </div>
      ),
    },
    {
      accessorKey: 'action',
      header: () => <div />,
      cell: ({ row }) => (
        <div className="px-4">
          <Button
            variant={'destructive'}
            className="h-8 w-8"
            type="button"
            onClick={() => onDeleteRow(row)}
          >
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ];

  return { columns };
};

export default useFlightsDraftTableTable;
