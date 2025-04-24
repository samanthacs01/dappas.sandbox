import AppBreadcrumbs from '@/core/components/common/breadcrumbs/app-breadcrumbs';
import { ProductionAppBarLogOut } from './production-app-bar-log-out';
import { ProductionAppBarUser } from './production-app-bar-user';

const ProductionAppBar: React.FC = () => {
  return (
    <header className="flex h-16 shrink-0 z-0 items-center gap-2">
      <div className="flex flex-1 items-center gap-2 px-3">
        <AppBreadcrumbs />
      </div>
      <div className="ml-auto px-3 flex gap-2">
        <div className="flex gap-4 items-center">
          <ProductionAppBarUser />
          <ProductionAppBarLogOut />
        </div>
      </div>
    </header>
  );
};

export default ProductionAppBar;
