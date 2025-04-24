import TableSkeletonFilters from '@/core/components/common/skeletons/table-skeleton-filters';
import { Button } from '@/core/components/ui/button';
import { paths } from '@/core/lib/routes';
import { SearchParams } from '@/server/types/params';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { FunctionComponent, Suspense } from 'react';
import UserManagementTableContainer from './UserManagementTableContainer';

type UserManagementContainerProps = {
  searchParams: SearchParams;
};

const UserManagementContainer: FunctionComponent<
  UserManagementContainerProps
> = ({ searchParams }) => {
  return (
    <div className="w-full h-full p-8 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">User list</h3>
        <Link href={paths.user_management.create_user}>
          <Button>
            <Plus /> Create user
          </Button>
        </Link>
      </div>
      <Suspense fallback={<TableSkeletonFilters filters={3} />}>
        <UserManagementTableContainer {...{ searchParams }} />
      </Suspense>
    </div>
  );
};

export default UserManagementContainer;
