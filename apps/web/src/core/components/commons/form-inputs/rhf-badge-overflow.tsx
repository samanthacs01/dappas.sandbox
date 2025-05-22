import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@workspace/ui/components/popover';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';

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
}

/**
 * Minimalist RHF Badge Overflow component.
 * Shows up to `maxVisible` selected badges and collapses the rest into a "more" popover.
 */
export const RHFBadgeOverflow: React.FC<BadgeOverflowProps> = ({
  name,
  options,
  maxVisible = 3,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value = [], onChange } }) => {
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
          <div className="flex flex-wrap items-center gap-1">
            {/* visible badges */}
            {visible.map((opt) => (
              <Badge
                key={opt.value}
                onClick={() => toggle(opt.value)}
                className="cursor-pointer px-2 py-1 text-sm"
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
        );
      }}
    />
  );
};
