import { Check, ChevronsUpDown } from 'lucide-react';
import React, { FunctionComponent, useEffect } from 'react';

import { Button } from '@workspace/ui/components/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import { cn } from '@workspace/ui/lib/utils';
import { ComboBoxOption } from './types';
import { normalizeText } from '@/core/lib/text';

export type ComboBoxProps = {
  options: ComboBoxOption[];
  placeholder?: string;
  id?: string;
  onSelect?: (id: string, value: string) => void;
  defaultValue?: string;
  className?: string;
  disabled?: boolean;
  search?: string;
  triggerClassName?: string;
  autoClose?: boolean;
};

export const ComboBox: FunctionComponent<ComboBoxProps> = ({
  options,
  placeholder,
  onSelect,
  defaultValue,
  id = '',
  className,
  disabled,
  search = '',
  triggerClassName = '',
  autoClose = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue ?? '');
  const [searchValue, setSearchValue] = React.useState<string>(search);

  useEffect(() => {
    setValue(defaultValue ?? '');
  }, [defaultValue]);

  const onSelectValue = (currentValue: string) => {
    setValue((prev) => (prev === currentValue ? '' : currentValue));
    onSelect?.(id, value === currentValue ? '' : currentValue);
    if (autoClose) {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-fit justify-between', className, triggerClassName)}
        >
          <span className="truncate overflow-x-hidden">
            {value
              ? options.find((option) => option.value === value)?.label
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-[200px] p-0', className)}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList className="scrollbar-none">
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options
                .filter(({ label }) =>
                  normalizeText(label).includes(normalizeText(searchValue)),
                )
                .map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => onSelectValue(option.value)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === option.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
