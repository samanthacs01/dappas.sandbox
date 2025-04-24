import { Menubar } from '@/core/components/ui/menubar';
import { SquareActivity } from 'lucide-react';

import { FunctionComponent } from 'react';
import { LogoutButton } from './logout-button';

interface AppBarProps {
  title: string;
}

export const AppBar: FunctionComponent<AppBarProps> = ({ title }) => {
  return (
    <header className="sticky top-0 z-50 left-0 right-0">
      <Menubar className="h-16 px-6 justify-between rounded-none">
        <div className="flex gap-6 items-center">
          <SquareActivity className="h-6 w-6" />
          <h2 className="text-lg font-medium tracking-tight first:mt-0">
            {title}
          </h2>
        </div>
        <div>
          <LogoutButton />
        </div>
      </Menubar>
    </header>
  );
};
