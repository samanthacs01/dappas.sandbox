'use client';

import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface BrandColorsProps {
  colors: string[];
}

export function BrandColors({ colors: initialColors }: BrandColorsProps) {
  const [colors, setColors] = useState<string[]>(initialColors);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const colorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setColors(initialColors);
  }, [initialColors]);

  // Update position of the popover when editing index changes
  useEffect(() => {
    if (editingIndex !== null && colorRefs.current[editingIndex]) {
      const colorElement = colorRefs.current[editingIndex];
      if (!colorElement) return;

      const rect = colorElement.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

      // Position the popover centered above the color circle
      setPopoverPosition({
        top: rect.top + scrollTop - 10,
        left: rect.left + scrollLeft - 40, // Offset to center better with wider color picker
      });
    }
  }, [editingIndex]);

  // Close popover when clicking outside
  useEffect(() => {
    if (editingIndex === null) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        colorRefs.current[editingIndex] &&
        !colorRefs.current[editingIndex]?.contains(event.target as Node)
      ) {
        setEditingIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingIndex]);

  const handleEditStart = (index: number) => {
    setEditingIndex(index);
    setEditingValue(colors[index]);
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
  };

  const handleEditSave = () => {
    if (editingIndex !== null) {
      const newColors = [...colors];
      newColors[editingIndex] = editingValue;
      setColors(newColors);
      setEditingIndex(null);
    }
  };

  const handleAddColor = () => {
    setColors([...colors, '#CCCCCC']);
    // Update refs array to include the new color
    colorRefs.current = [...colorRefs.current, null];
  };

  const handleDeleteColor = () => {
    if (editingIndex !== null) {
      const newColors = [...colors];
      newColors.splice(editingIndex, 1);
      setColors(newColors);
      setEditingIndex(null);
      // Update refs array to remove the deleted color
      colorRefs.current = colorRefs.current.filter(
        (_, i) => i !== editingIndex
      );
    }
  };

  return (
    <div className="flex flex-col space-y-4 items-start justify-start">
      <div className="flex flex-wrap items-start justify-start gap-6 relative">
        {colors.map((color, index) => (
          <div
            key={index}
            className="flex flex-col items-center"
            ref={(el) => {
              colorRefs.current[index] = el;
            }}
          >
            <div
              className="h-10 w-10 rounded-full border cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-gray-300 transition-all"
              style={{ backgroundColor: color }}
              onClick={() => handleEditStart(index)}
              title={`${color}`}
            />
            <span className="text-xs text-gray-500 mt-1">{color}</span>
          </div>
        ))}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 border border-primary rounded-full"
          onClick={handleAddColor}
        >
          <Plus className="h-5 w-5" />
          <span className="sr-only">Add color</span>
        </Button>

        {editingIndex !== null && (
          <div
            ref={popoverRef}
            className="fixed z-10 bg-white dark:bg-gray-950 shadow-lg rounded-lg p-4 border"
            style={{
              top: `${popoverPosition.top}px`,
              left: `${popoverPosition.left}px`,
            }}
          >
            <div className="flex flex-col gap-3 w-64">
              <div className="flex justify-between items-center">
                <div
                  className="h-16 w-16 rounded-full border"
                  style={{ backgroundColor: editingValue }}
                />
                <div className="flex flex-col gap-1">
                  <Label htmlFor="color-picker" className="text-xs">
                    Pick a color
                  </Label>
                  <input
                    id="color-picker"
                    type="color"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="w-full h-8 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="color-hex" className="text-xs">
                  Hex value
                </Label>
                <Input
                  id="color-hex"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  className="h-8 text-xs px-2"
                />
              </div>

              <div className="flex justify-between gap-2 mt-1">
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={handleDeleteColor}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={handleEditCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 text-xs"
                    onClick={handleEditSave}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
