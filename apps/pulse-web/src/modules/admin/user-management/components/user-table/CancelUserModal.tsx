import AlertModal from '@/core/components/common/alert-modal/alert-modal';

type Props = {
  open: boolean;
  isEditing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const CancelUserModal: React.FC<Props> = ({
  onCancel: onClose,
  onConfirm,
  open,
  isEditing,
}) => {
  return (
    <AlertModal
      {...{
        open,
        onConfirm,
        onClose,
        title: isEditing ? 'Cancel User Edition' : 'Cancel User Creation',
        description:
          'If you cancel the form, all changes will not be saved. Are you sure you want to continue?',
      }}
    />
  );
};

export default CancelUserModal;
