import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { FabricObject, IText } from 'fabric';
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = {
  selectedObject: FabricObject | null;
  onObjectChange: VoidFunction;
};

const EditorSidebar: React.FC<Props> = ({ selectedObject, onObjectChange }) => {
  const [textValue, setTextValue] = useState<string>('');
  const [fontSize, setFontSize] = useState<number>(24);
  const [textColor, setTextColor] = useState<string>('#FFCC00');
  const [outlineColor, setOutlineColor] = useState<string>('');
  const updateTextProperties = () => {
    if (!selectedObject) return;
    if (selectedObject.type !== 'i-text') return;

    const textObject = selectedObject as IText;

    if (textValue) {
      textObject.set({ text: textValue });
    }

    textObject.set({
      fontSize: fontSize,
      fill: textColor,
    });

    if (outlineColor) {
      textObject.set({
        stroke: outlineColor,
        strokeWidth: 1,
      });
    } else {
      textObject.set({
        stroke: undefined,
        strokeWidth: 0,
      });
    }

    onObjectChange();
  };

  const alignText = (alignment: 'left' | 'center' | 'right') => {
    if (!selectedObject) return;
    if (selectedObject.type !== 'i-text') return;

    const textObject = selectedObject as IText;
    textObject.set({ textAlign: alignment });
    onObjectChange();
  };

  useEffect(() => {
    if (selectedObject && selectedObject.type === 'i-text') {
      updateTextProperties();
    }
  }, [fontSize, textColor, outlineColor]);

  return (
    <div className="w-80 h-full border-l bg-white p-4 overflow-y-auto">
      <h2 className="font-bold text-lg mb-4">EDIT TEXT</h2>

      <div className="space-y-4">
        <div>
          <Input
            placeholder="Enter Text Here"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            onBlur={updateTextProperties}
            className="border-gray-300"
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-1 block">Typefaces</Label>
          <Select defaultValue="roboto-bold">
            <SelectTrigger className="w-full bg-gray-100">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="roboto-bold">ROBOTO BOLD</SelectItem>
              <SelectItem value="roboto">Roboto</SelectItem>
              <SelectItem value="arial">Arial</SelectItem>
              <SelectItem value="times">Times New Roman</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <Label className="text-sm font-medium">Text Color</Label>
            <span className="text-sm text-gray-500">Yellow</span>
          </div>
          <div className="flex items-center">
            <div
              className="w-8 h-8 rounded-full border border-gray-300 mr-2"
              style={{ backgroundColor: textColor }}
            />
            <Input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-full h-8"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <Label className="text-sm font-medium">Outline Text Color</Label>
            <span className="text-sm text-gray-500">None</span>
          </div>
          <div className="flex items-center">
            <div
              className="w-8 h-8 rounded-full border border-gray-300 mr-2"
              style={{ backgroundColor: outlineColor || 'transparent' }}
            />
            <Input
              type="color"
              value={outlineColor}
              onChange={(e) => setOutlineColor(e.target.value)}
              className="w-full h-8"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-1 block">Text Shape</Label>
          <Select defaultValue="normal">
            <SelectTrigger className="w-full bg-gray-100">
              <SelectValue placeholder="Select shape" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">NORMAL</SelectItem>
              <SelectItem value="arc">Arc</SelectItem>
              <SelectItem value="circle">Circle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <Label className="text-sm font-medium">Text Size</Label>
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">{fontSize}</span>
              <span className="text-sm text-gray-500">inch</span>
            </div>
          </div>
          <Select
            defaultValue={fontSize.toString()}
            onValueChange={(value) => setFontSize(+value)}
          >
            <SelectTrigger className="w-full bg-gray-100">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">1.2</SelectItem>
              <SelectItem value="18">1.8</SelectItem>
              <SelectItem value="24">2.4</SelectItem>
              <SelectItem value="36">3.6</SelectItem>
              <SelectItem value="48">4.8</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-between pt-4">
          <div className="flex space-x-2">
            <button className="w-8 h-8 border rounded flex items-center justify-center">
              <AlignLeft
                className="h-4 w-4"
                onClick={() => alignText('left')}
              />
            </button>
            <button className="w-8 h-8 border rounded flex items-center justify-center">
              <AlignCenter
                className="h-4 w-4"
                onClick={() => alignText('center')}
              />
            </button>
            <button className="w-8 h-8 border rounded flex items-center justify-center">
              <AlignRight
                className="h-4 w-4"
                onClick={() => alignText('right')}
              />
            </button>
          </div>

          <div className="flex space-x-2">
            <button className="w-8 h-8 border rounded flex items-center justify-center">
              <span className="font-bold text-xs">A</span>
            </button>
            <button className="w-8 h-8 border rounded flex items-center justify-center">
              <span className="font-bold text-xs">A</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorSidebar;
