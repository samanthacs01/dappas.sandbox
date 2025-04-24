import ProductionAppBar from '@/core/layout/app-bar/production-app-bar/production-app-bar';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col w-full">
      <ProductionAppBar />
      {children}
    </div>
  );
}
