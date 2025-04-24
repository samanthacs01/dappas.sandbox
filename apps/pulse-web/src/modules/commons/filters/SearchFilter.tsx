'use client';

import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { useDebounce } from '@/core/hooks/use-debounce';
import clsx from 'clsx';
import { Search, X } from 'lucide-react';
import { ChangeEvent, FC, useEffect, useState } from 'react';

type SearchFilterProps = {
  onChange: (value: string) => void;
  value?: string;
  className?: string;
  placeholder?: string;
};

const SearchFilter: FC<SearchFilterProps> = ({
  onChange,
  value,
  className,
  placeholder = 'Search...',
}) => {
  const [searchTerm, setSearchTerm] = useState<string | undefined>(value);
  const debouncedSearchTerm = useDebounce(searchTerm ?? '', 500); // 500ms debounce delay

  useEffect(() => {
    onChange(debouncedSearchTerm as string);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.currentTarget.value);
  };

  const handleClear = () => {
    onChange('');
    setSearchTerm('');
  };

  return (
    <div className={clsx('relative flex items-center w-60', className)}>
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        className="pl-8 pr-8 w-full"
        placeholder={placeholder}
        data-cy="search-filter-input"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full"
          onClick={handleClear}
          data-cy="search-filter-clear-button"
        >
          <X className="h-4 w-4 text-gray-500" />
        </Button>
      )}
    </div>
  );
};

export default SearchFilter;
