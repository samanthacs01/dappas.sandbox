'use client';

import { Button } from '@/core/components/ui/button';
import { Label } from '@/core/components/ui/label';
import { Plus, Trash } from 'lucide-react';
import { FC } from 'react';

export const DraftReviewFlights: FC = () => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <Label>Flights</Label>
        <div className="flex gap-2">
          <Button>
            <Plus />
            Add new row
          </Button>
          <Button>
            <Trash />
            Delete selected row
          </Button>
        </div>
      </div>
    </div>
  );
};
