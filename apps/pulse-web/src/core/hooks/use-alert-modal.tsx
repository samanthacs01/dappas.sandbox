import AlertModal from '@/core/components/common/alert-modal/alert-modal';
import { useCallback, useState } from 'react';

interface AlertOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

const useAlertModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<AlertOptions | null>(null);
  const [onConfirm, setOnConfirm] = useState<VoidFunction | null>(null);
  const [onCancel, setOnCancel] = useState<VoidFunction | null>(null);

  const showAlert = useCallback(
    (
      options: AlertOptions,
      onConfirm: VoidFunction,
      onCancel: VoidFunction,
    ) => {
      setOptions(options);
      setOnConfirm(() => onConfirm);
      setOnCancel(() => onCancel);
      setIsOpen(true);
    },
    [],
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setOptions(null);
    setOnConfirm(null);
    if (onCancel) onCancel();
    setOnCancel(null);
  }, []);

  const alertModal = options ? (
    <AlertModal
      open={isOpen}
      onClose={handleClose}
      onConfirm={onConfirm!}
      title={options.title}
      description={options.description}
      confirmLabel={options.confirmLabel}
      cancelLAbel={options.cancelLabel}
      loading={options.loading}
    />
  ) : null;

  return { showAlert, alertModal };
};

export default useAlertModal;
