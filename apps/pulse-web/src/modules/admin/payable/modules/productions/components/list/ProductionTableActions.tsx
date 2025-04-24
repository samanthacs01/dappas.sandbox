import { Tooltip } from '@/core/components/common/tooltip';
import { Button } from '@/core/components/ui/button';
import { BookOpenText, FilePen, Trash } from 'lucide-react';
import { FunctionComponent } from 'react';

type AdminCompanyActionsProps = {
  onRemove: () => void;
  onRegisterExpense: () => void;
  onEdit: () => void;
};

const ProductionTableActions: FunctionComponent<AdminCompanyActionsProps> = ({
  onEdit,
  onRemove,
  onRegisterExpense,
}) => {
  return (
    <div className="flex gap-0.5 w-[80px]">
      <Tooltip title="Create expense.">
        <Button
          variant="ghost"
          className="h-10 w-10"
          onClick={onRegisterExpense}
        >
          <BookOpenText />
        </Button>
      </Tooltip>
      <Tooltip title="Edit.">
        <Button variant="ghost" className="h-10 w-10" onClick={onEdit}>
          <FilePen />
        </Button>
      </Tooltip>
      <Tooltip title="Delete.">
        <Button variant="ghost" className="h-10 w-10" onClick={onRemove}>
          <Trash />
        </Button>
      </Tooltip>
    </div>
  );
};

export default ProductionTableActions;
