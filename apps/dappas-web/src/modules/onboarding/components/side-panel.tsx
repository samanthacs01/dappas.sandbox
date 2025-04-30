import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/core/components/ui/avatar';
import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Textarea } from '@/core/components/ui/textarea';
import { PackagingInfo } from '@/server/schemas/brand';
import { Loader2 } from 'lucide-react';
import { ChatStatus } from '../types/chat';

type Props = {
  packagingInfo: PackagingInfo;
  updatePackagingInfo: (key: string, value: string) => void;
  chatStatus: ChatStatus;
  onSubmit: () => void;
};

const OnBoardingSidePanel: React.FC<Props> = ({
  packagingInfo,
  updatePackagingInfo,
  chatStatus,
  onSubmit,
}) => {
  const isGenerating = chatStatus !== 'ready';

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  const handleFormChange = (key: string, value: string) => {
    updatePackagingInfo(key, value);
  };

  return (
    <div className="flex flex-col p-8 bg-white justify-between h-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold">
          Your packaging design information
        </h2>
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>

      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col justify-between space-y-6 flex-1 h-full"
      >
        <div className="flex flex-col space-y-6">
          <div className="space-y-2">
            <label className="font-medium">Product:</label>
            <Input
              placeholder="Your product name"
              value={packagingInfo.product || ''}
              onChange={(e) => handleFormChange('product', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="font-medium">Brand:</label>
            <Input
              placeholder="Your brand name"
              value={packagingInfo.brand || ''}
              onChange={(e) => handleFormChange('brand', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="font-medium">Colors (comma separated):</label>
            <Input
              placeholder="e.g., Blue, Red, Gold"
              value={packagingInfo.colors?.join(', ') || ''}
              onChange={(e) =>
                handleFormChange(
                  'colors',
                  e.target.value
                    .split(',')
                    .map((c) => c.trim())
                    .join(',')
                )
              }
            />
          </div>

          <div className="space-y-2">
            <label className="font-medium">Style:</label>
            <Input
              placeholder="e.g., Modern, Vintage, Minimalist"
              value={packagingInfo.style || ''}
              onChange={(e) => handleFormChange('style', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="font-medium">Description:</label>
            <Textarea
              placeholder="Describe your product and packaging needs"
              value={packagingInfo.description || ''}
              onChange={(e) => handleFormChange('description', e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <div className="mt-auto">
          <Button
            type="submit"
            className="w-full bg-purple-400 hover:bg-purple-500 text-white"
            disabled={
              !packagingInfo.brand || !packagingInfo.brand || isGenerating
            }
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Design'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OnBoardingSidePanel;
