import { Alert, AlertDescription, AlertTitle } from '@/core/components/ui/alert';
import { OctagonAlert, ShieldAlert } from 'lucide-react';

type Props = {
  title: string;
  description: string;
  variant?: 'default' | 'destructive' | 'warning';
};

const AlertBox = ({ title, description, variant = 'default' }: Props) => {
  const renderIcon = (variant: 'default' | 'destructive' | 'warning') => {
    switch (variant) {
      case 'warning':
        return <ShieldAlert width={16} height={16} />;
      case 'destructive':
        return <OctagonAlert width={16} height={16} />;
      case 'default':
        return null;
    }
  };
  return (
    <Alert variant={variant}>
      {renderIcon(variant)}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};

export default AlertBox;
