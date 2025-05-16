'use client';

import { Label } from '@workspace/ui/components/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import { cn } from '@workspace/ui/lib/utils';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Controller, useFormContext } from 'react-hook-form';

interface ColorPickerProps {
  maxColors?: number;
  defaultColors?: string[];
  name: string;
  label?: string;
  labelOrientation?: 'horizontal' | 'vertical';
  required?: boolean;
}

const RHFColorPicker = ({
  maxColors = 4,
  defaultColors = [],
  name,
  label,
  labelOrientation,
  required,
}: ColorPickerProps) => {
  const [activeColorIndex, setActiveColorIndex] = useState<number | null>(null);
  const { control, setValue, watch } = useFormContext();
  const colors = watch(name) || defaultColors || [];

  const handleAddColor = () => {
    if (colors.length < maxColors) {
      const newColors = [...colors, '#ffffff'];
      setValue(name, newColors, { shouldValidate: true, shouldDirty: true });
      setActiveColorIndex(newColors.length - 1);
    }
  };

  const handleRemoveColor = (index: number) => {
    const newColors = colors.filter((_: string, i: number) => i !== index);
    setValue(name, newColors, { shouldValidate: true, shouldDirty: true });
    setActiveColorIndex(null);
  };

  const handleColorChange = (color: string, index: number) => {
    const newColors = [...colors];
    newColors[index] = color;
    setValue(name, newColors, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultColors}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col">
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
            <div className="space-y-4">
              <input type="hidden" {...field} />
              <div className="flex flex-wrap gap-2">
                {colors.map((color: string, index: number) => (
                  <div key={index} className="relative">
                    <Popover
                      open={activeColorIndex === index}
                      onOpenChange={(open) =>
                        setActiveColorIndex(open ? index : null)
                      }
                    >
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden"
                          style={{ backgroundColor: color }}
                          onClick={() => setActiveColorIndex(index)}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-3">
                        <HexColorPicker
                          color={color}
                          onChange={(newColor) =>
                            handleColorChange(newColor, index)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(index)}
                      className="absolute -top-1 -right-1 bg-white rounded-full h-5 w-5 flex items-center justify-center border border-gray-300 shadow-sm"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {colors.length < maxColors && (
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="h-10 w-10 rounded-full border border-dashed border-gray-600 flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          </div>
          {error && (
            <Label className="text-destructive text-xs mt-1 w-full flex justify-end">
              {error.message}
            </Label>
          )}
        </div>
      )}
    />
  );
};

export default RHFColorPicker;
