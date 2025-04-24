import AppBreadcrumbs from '@/core/components/common/breadcrumbs/app-breadcrumbs';
import { Separator } from '@/core/components/ui/separator';
import { SidebarTrigger } from '@/core/components/ui/sidebar';
import AppBarFeedbackButton from './app-bar-feedback-button';
import { AppBarQuickActions } from './app-bar-quick-actions';
import { AppBarThemeSwitcher } from './app-bar-theme-switcher';

type Props = {
  title: string;
};

const AppBar: React.FC<Props> = ({ title }) => {
  return (
    <header className="flex h-14 shrink-0 z-0 items-center gap-2">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <AppBreadcrumbs />
      </div>
      <div className="ml-auto px-3 flex gap-2">
        <AppBarQuickActions />
        <AppBarThemeSwitcher />
        {process.env.NEXT_PUBLIC_APP_ENABLE_SENTRY === 'true' && (
          <AppBarFeedbackButton />
        )}
      </div>
    </header>
  );
};

export default AppBar;
