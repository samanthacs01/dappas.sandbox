'use client';

import React, { useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

type ColorItem = {
  id: number;
  name: string;
  color: string;
};

interface ColorPickerProps {
  colors: ColorItem[];
}

const ColorPicker: React.FC<ColorPickerProps> = ({ colors: initialColors }) => {
  const [colors, setColors] = useState<ColorItem[]>(initialColors);

  const [open, setOpen] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [activeColorPicker, setActiveColorPicker] = useState<number | null>(
    null,
  );
  const [tempColors, setTempColors] = useState<ColorItem[]>(colors);

  const handleCircleClick = (id: number) => {
    setSelectedColorId(id);
    setTempColors([...colors]);
    setOpen(true);
  };

  const handleColorChange = (newColor: string) => {
    if (activeColorPicker !== null) {
      setTempColors(
        tempColors.map((color) =>
          color.id === selectedColorId ? { ...color, color: newColor } : color,
        ),
      );
    }
  };

  const handleSave = () => {
    setColors(tempColors);
    setOpen(false);
    setActiveColorPicker(null);
  };

  const handleCancel = () => {
    setOpen(false);
    setActiveColorPicker(null);
  };

  return (
    <div>
      <div className="flex gap-6">
        {colors.map((color) => (
          <div
            key={color.id}
            onClick={() => handleCircleClick(color.id)}
            className={cn(
              'size-9 rounded-full flex items-center justify-center cursor-pointer border border-dashed border-primary',
            )}
            style={{ backgroundColor: color.color }}
          >
            {!color.color && <Plus size={16} />}
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select brand color</DialogTitle>
          </DialogHeader>
          <div className="flex py-6 justify-around">
            {tempColors.map((color) => (
              <div key={color.id} className="flex flex-col items-center">
                <div
                  className="size-20 rounded-full mb-2"
                  style={{ backgroundColor: color.color || '#e5e7eb' }}
                />
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="text-sm">{color.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-3"
                    onClick={() => {
                      setSelectedColorId(color.id);
                      setActiveColorPicker(
                        activeColorPicker === color.id ? null : color.id,
                      );
                    }}
                  >
                    <Pencil className="size-3" />
                  </Button>
                </div>
                {activeColorPicker === color.id && (
                  <div className="absolute top-[70%]">
                    <HexColorPicker
                      color={color.color || '#ffffff'}
                      onChange={handleColorChange}
                    />
                  </div>
                )}
                <div className="flex mt-2 w-full h-7 px-3 py-2 items-center border border-gray-300 text-sm">
                  {color.color || '#'}
                </div>
              </div>
            ))}
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
  );
};

export default ColorPicker;
