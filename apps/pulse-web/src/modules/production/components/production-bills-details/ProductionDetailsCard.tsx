import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { valueFormatter } from '@/core/lib/numbers';
import { PayableProductionDto } from '@/server/types/payable';
import { FC } from 'react';

type ProductionDetailsCardProps = {
  productionDetails: PayableProductionDto;
};

export const ProductionDetailsCard: FC<ProductionDetailsCardProps> = ({
  productionDetails: {
    contact_email,
    contact_name,
    contact_phone_number,
    entity_address,
    production_billing_type,
    production_split,
    net_payment_terms,
    production_expense_recoupment_type,
  },
}) => {
  return (
    <Card>
      <div className="grid grid-cols-2 p-6 gap-6">
        <CardHeader className="p-0">
          <CardTitle>Address</CardTitle>
          <CardDescription>{entity_address}</CardDescription>
        </CardHeader>
        <CardHeader className="p-0">
          <CardTitle>Contact Name</CardTitle>
          <CardDescription>{contact_name}</CardDescription>
        </CardHeader>
        <CardHeader className="p-0">
          <CardTitle>Contact Phone Number</CardTitle>
          <CardDescription>{contact_phone_number}</CardDescription>
        </CardHeader>
        <CardHeader className="p-0">
          <CardTitle>Contact Email</CardTitle>
          <CardDescription>{contact_email}</CardDescription>
        </CardHeader>
        <CardHeader className="p-0">
          <CardTitle>Production Split</CardTitle>
          <CardDescription>
            {valueFormatter(production_split, 'percentage')}
          </CardDescription>
        </CardHeader>
        <CardHeader className="p-0">
          <CardTitle>Payment type</CardTitle>
          <CardDescription className="capitalize">
            {production_billing_type.toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardHeader className="p-0">
          <CardTitle>Net payment terms(Days)</CardTitle>
          <CardDescription>{net_payment_terms}</CardDescription>
        </CardHeader>
        <CardHeader className="p-0">
          <CardTitle>Expense recoupment</CardTitle>
          <CardDescription className="capitalize">
            {production_expense_recoupment_type.toLowerCase()}
          </CardDescription>
        </CardHeader>
      </div>
    </Card>
  );
};
