'use client';

import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Label } from '@workspace/ui/components/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import { cn } from '@workspace/ui/lib/utils';
import { Pencil, Plus } from 'lucide-react';
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
  const [temporalColors, setTemporalColors] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const { control, setValue, watch } = useFormContext();
  const colors = watch(name) || defaultColors || [];

  const handleColorChange = (color: string, index: number) => {
    const newColors = [...temporalColors];
    newColors[index] = color;
    setTemporalColors(newColors);
  };

  const handleSave = () => {
    setValue(name, temporalColors, { shouldValidate: true, shouldDirty: true });
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    setTemporalColors(colors);
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultColors}
      render={({ field, fieldState: { error } }) => (
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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              <div className="flex gap-6">
                {Array.from({ length: maxColors }).map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      'size-9 rounded-full flex items-center justify-center cursor-pointer border border-dashed border-primary',
                    )}
                    style={{ backgroundColor: colors[index] }}
                  >
                    {!colors[index] && <Plus size={16} />}
                  </div>
                ))}
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select brand color</DialogTitle>
              </DialogHeader>
              <div className="">
                <input type="hidden" {...field} />
                <div className="flex flex-wrap justify-around gap-2 py-8">
                  {Array.from({ length: maxColors }).map((_, index) => (
                    <div key={index} className="relative">
                      <Popover
                        open={activeColorIndex === index}
                        onOpenChange={(open) =>
                          setActiveColorIndex(open ? index : null)
                        }
                      >
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            className="size-20 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden"
                            style={{ backgroundColor: temporalColors[index] }}
                          />
                          <div className="flex w-full items-center justify-between">
                            <span className="text-sm">Color {index + 1}</span>
                            <PopoverTrigger asChild>
                              <button
                                className="size-3"
                                onClick={() => setActiveColorIndex(index)}
                              >
                                <Pencil className="size-3" />
                              </button>
                            </PopoverTrigger>
                          </div>
                          <input
                            type="text"
                            value={temporalColors[index] ?? '#'}
                            className="border w-[90px] px-2"
                            onChange={(e) =>
                              handleColorChange(e.target.value, index)
                            }
                          />
                        </div>
                        <PopoverContent className="w-auto p-3">
                          <HexColorPicker
                            color={temporalColors[index]}
                            onChange={(newColor) =>
                              handleColorChange(newColor, index)
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter className="w-full grid grid-cols-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="rounded-none border-black"
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} className="rounded-none">
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    />
  );
};

export default RHFColorPicker;
