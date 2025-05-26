import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Label } from '@workspace/ui/components/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import { cn } from '@workspace/ui/lib/utils';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export interface Option {
  label: string;
  value: string;
}

export interface BadgeOverflowProps {
  /** Form field name */
  name: string;
  /** All available options */
  options: Option[];
  /** Max badges to display before collapsing */
  maxVisible?: number;
  label?: string;
  labelOrientation?: 'horizontal' | 'vertical';
  required?: boolean;
  badgeContainerClassName?: string;
}

/**
 * Minimalist RHF Badge Overflow component.
 * Shows up to `maxVisible` selected badges and collapses the rest into a "more" popover.
 */
export const RHFBadgeOverflow: React.FC<BadgeOverflowProps> = ({
  name,
  options,
  label,
  labelOrientation = 'horizontal',
  required = false,
  badgeContainerClassName,
  maxVisible = 3,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value = [], onChange }, fieldState: { error } }) => {
        // filter selected options
        const selected = options.filter((opt) => value.includes(opt.value));
        const visible = selected.slice(0, maxVisible);
        const hidden = selected.slice(maxVisible);

        // toggle selection
        const toggle = (val: string) => {
          const updated = value.includes(val)
            ? value.filter((v: string) => v !== val)
            : [...value, val];
          onChange(updated);
        };

        return (
          <div
            className={cn(
              'flex',
              labelOrientation === 'vertical'
                ? 'flex-col gap-2'
                : 'flex-row gap-10',
            )}
          >
            {label ? (
              typeof label === 'string' ? (
                <Label
                  htmlFor={name}
                  className={cn(
                    error && 'text-destructive',
                    'font-medium',
                    labelOrientation === 'vertical' ? '' : 'w-1/3',
                  )}
                >
                  {label} {required && '*'}
                </Label>
              ) : (
                label
              )
            ) : null}
            <div
              className={cn(
                'flex flex-wrap items-center gap-1',
                labelOrientation === 'vertical'
                  ? 'w-full' : 'w-2/3',
                badgeContainerClassName,
              )}
            >
              {/* visible badges */}
              {visible.map((opt) => (
                <Badge
                  key={opt.value}
                  onClick={() => toggle(opt.value)}
                  className="cursor-pointer px-2 py-1 text-xs"
                >
                  {opt.label}
                </Badge>
              ))}

              {/* more popover for hidden badges */}
              {hidden.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="px-2">
                      +{hidden.length} more
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-1">
                    <div className="flex flex-wrap gap-1">
                      {hidden.map((opt) => (
                        <Badge
                          key={opt.value}
                          onClick={() => toggle(opt.value)}
                          className="cursor-pointer px-2 py-1 text-sm"
                        >
                          {opt.label}
                        </Badge>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              {/* unselected badges as secondary */}
              {options
                .filter((opt) => !value.includes(opt.value))
                .map((opt) => (
                  <Badge
                    key={opt.value}
                    variant="outline"
                    onClick={() => toggle(opt.value)}
                    className="cursor-pointer px-2 py-1 text-sm"
                  >
                    {opt.label}
                  </Badge>
                ))}
            </div>
          </div>
        );
      }}
    />
  );
};
