'use client';
import clsx from 'clsx';
import {
  ArchiveX,
  Gift,
  Inbox,
  Package,
  Package2,
  PackageOpen,
} from 'lucide-react';
import React, { useState } from 'react';

interface PackagingSelectorProps {
  onSelectPackage: (packageIcon: string) => void;
}

const PackagingSelector: React.FC<PackagingSelectorProps> = ({
  onSelectPackage,
}) => {
  const [selectedIcon, setSelectedIcon] = useState<string>();

  const packageIcons = [
    { id: 'gift', icon: Gift },
    { id: 'package', icon: Package },
    { id: 'package2', icon: Package2 },
    { id: 'package-open', icon: PackageOpen },
    { id: 'inbox', icon: Inbox },
    { id: 'archive-x', icon: ArchiveX },
  ];

  const handlePackageClick = (id: string) => {
    setSelectedIcon(id);
    onSelectPackage(id);
  };

  return (
    <div className="flex w-full justify-center pt-2">
      <div className="grid grid-cols-5 w-[300px] gap-2">
        {packageIcons.map((packageIcon) => (
          <div
            key={packageIcon.id}
            className={clsx(
              'flex items-center justify-center p-3 cursor-pointer transition-colors duration-200 rounded-md border hover:border-orange-500 hover:text-orange-500'
            )}
            onClick={() => handlePackageClick(packageIcon.id)}
          >
            <packageIcon.icon
              className={clsx('size-6', {
                'text-orange-500': selectedIcon === packageIcon.id,
              })}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackagingSelector;
