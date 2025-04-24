'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/core/components/ui/breadcrumb';
import clsx from 'clsx';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import React from 'react';
import { pathsNames } from './path-names';

const AppBreadcrumbs = ({ className }: { className?: string }) => {
  const params = Object.values(useParams<Record<string, string>>());
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter((segment) => segment !== '');
  // remove params
  const breadcrumbSegments = pathSegments.filter(
    (segment) => !params.includes(segment),
  );

  return (
    <Breadcrumb className={clsx('', className)}>
      <BreadcrumbList>
        {breadcrumbSegments.map((segment, index) => {
          const href = `/${breadcrumbSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === breadcrumbSegments.length - 1;

          return (
            <React.Fragment key={segment}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>
                    {pathsNames[segment] || segment}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href} asChild>
                    <Link href={href}>{pathsNames[segment] || segment}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AppBreadcrumbs;
