'use client';

import { Check, ChevronsUpDown, X } from 'lucide-react';
import React, { FunctionComponent, useEffect } from 'react';

import { Button } from '@/core/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/core/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/core/components/ui/popover';
import { cn } from '@/core/lib/utils';
import { ComboBoxOption } from '@/server/types/combo-box';

interface ComboBoxMultiselectProps {
  options: ComboBoxOption[];
  placeholder?: string;
  id?: string;
  onSelect?: (id: string, value: string | string[]) => void;
  defaultValue?: string[];
  className?: string;
}

export const ComboBoxMultiselect: FunctionComponent<
  ComboBoxMultiselectProps
> = ({ options, placeholder, onSelect, defaultValue, id = '', className }) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string[]>([]);

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  const onSelectValue = (currentValue: string) => {
    const newValue = value.includes(currentValue)
      ? value.filter((val) => val !== currentValue)
      : [...value, currentValue];

    setValue(newValue);
    onSelect?.(id, newValue);
  };

  const clearSelection = () => {
    setValue([]);
    onSelect?.(id, '');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-fit justify-between', className)}
          data-cy="combo-box-multiselect"
        >
          <span className="truncate overflow-x-hidden">
            {value.length ? `${value.length} selected` : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-[200px] p-0', className)}>
        <Command>
          <CommandInput placeholder={`Search ${placeholder}...`} />
          <CommandList className="scrollbar-none">
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => onSelectValue(option.value)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value.includes(option.value)
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandShortcut className="w-full">
            <Button
              onClick={clearSelection}
              variant="ghost"
              type="button"
              className="w-full h-full rounded-none"
            >
              <X /> Clear
            </Button>
          </CommandShortcut>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
