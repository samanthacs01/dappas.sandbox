'use client';

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/core/components/ui/alert-dialog';
import { AlertDialog } from '@radix-ui/react-alert-dialog';
import { createPortal } from 'react-dom';
import { CircularLoading } from '../loading/circular-loading';

interface AlertProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLAbel?: string;
  loading?: boolean;
}

const AlertModal = ({
  onClose,
  onConfirm,
  open,
  description,
  title,
  confirmLabel = 'Continue',
  cancelLAbel = 'Cancel',
  loading,
}: Readonly<AlertProps>) => {
  return createPortal(
    <AlertDialog {...{ onOpenChange: onClose, open }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={loading}>
            {cancelLAbel}
            <CircularLoading loading={loading} />
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={loading}>
            {confirmLabel}
            <CircularLoading loading={loading} />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>,
    document.body,
  );
};

export default AlertModal;
