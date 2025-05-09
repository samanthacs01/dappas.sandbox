'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import {
  MenuItem,
  MoreDropdownProps,
} from '@/server/expandable-menu/types/expandable-menu';

export const ExpandableMenu = ({
  categories,
  buttonLabel = 'More',
  className = '',
  onItemClick,
}: MoreDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleItemClick = (item: MenuItem) => {
    setIsOpen(false);

    if (item.onClick) {
      item.onClick(item.id);
    } else if (onItemClick) {
      onItemClick(item.id);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Botón More */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-6 py-3 bg-black text-white font-medium"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {buttonLabel}
        {isOpen ? (
          <ChevronUp className="ml-2 h-4 w-4" />
        ) : (
          <ChevronDown className="ml-2 h-4 w-4" />
        )}
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-10 mt-1 bg-white border border-gray-200 shadow-lg w-screen max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
            {categories.map((category, index) => (
              <div key={index} className="space-y-4">
                <h3 className="font-bold text-lg">{category.title}</h3>
                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <button
                        onClick={() => handleItemClick(item)}
                        className="text-gray-800 hover:underline text-left w-auto bg-transparent border-none p-0 cursor-pointer"
                        type="button"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
