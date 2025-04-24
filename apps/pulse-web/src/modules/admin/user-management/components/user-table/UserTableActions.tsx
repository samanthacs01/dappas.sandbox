import { Tooltip } from '@/core/components/common/tooltip';
import { Button } from '@/core/components/ui/button';
import { FilePen, Mail, Trash } from 'lucide-react';
import { FunctionComponent } from 'react';

type UserTableActionsProps = {
  onEdit: () => void;
  onRemove: () => void;
  onSendEmail: () => void;
  status: 'active' | 'inactive';
};

const UserTableActions: FunctionComponent<UserTableActionsProps> = ({
  onEdit,
  onRemove,
  status,
  onSendEmail,
}) => {
  if (!status)
    return (
      <Tooltip title="Resend activation.">
        <Button variant={'ghost'} className="w-10 h-10" onClick={onSendEmail}>
          <Mail />
        </Button>
      </Tooltip>
    );
  return (
    <div className="flex gap-1">
      <Tooltip title="Edit.">
        <Button variant={'ghost'} className="w-10 h-10" onClick={onEdit}>
          <FilePen width={16} height={16} />
        </Button>
      </Tooltip>
      <Tooltip title="Delete.">
        <Button variant={'ghost'} className="w-10 h-10" onClick={onRemove}>
          <Trash width={16} height={16} />
        </Button>
      </Tooltip>
    </div>
  );
};

export default UserTableActions;
