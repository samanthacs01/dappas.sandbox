'use client';
import React, { useState } from 'react';
import {
  Gift,
  Package,
  Package2,
  PackageOpen,
  Inbox,
  ArchiveX,
} from 'lucide-react';
import clsx from 'clsx';

interface PackagingSelectorProps {
  onSelectPackage: (packageIcon: number) => void;
}

const PackagingSelector: React.FC<PackagingSelectorProps> = ({
  onSelectPackage,
}) => {
  const [selectedIcon, setSelectedIcon] = useState<number>();

  const packageIcons = [
    { id: 1, icon: Gift },
    { id: 2, icon: Package },
    { id: 3, icon: Package2 },
    { id: 4, icon: PackageOpen },
    { id: 5, icon: Inbox },
    { id: 6, icon: ArchiveX },
  ];

  const handlePackageClick = (packegeIconId: number) => {
    setSelectedIcon(packegeIconId);
    onSelectPackage(packegeIconId);
  };

  return (
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
  );
};

export default PackagingSelector;
