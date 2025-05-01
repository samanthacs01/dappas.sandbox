import { cn } from '@/core/lib/utils';
import { PackagingInfo } from '@/server/schemas/brand';
import { UIMessage } from 'ai';
import { useCallback, useEffect, useState } from 'react';

import useChatComponent from '../../hooks/use-chat-component';
import { ComponentToken } from '../../types/chat';
import { extractComponentTags } from '../../utils/chat';

type Props = {
  message: UIMessage;
};

const ChatMessage: React.FC<Props> = ({ message }) => {
  const [cleanMessage, setCleanMessage] = useState<string>('');
  const [components, setComponents] = useState<ComponentToken[]>([]);

  const { getComponent } = useChatComponent();

  // Initialize the chat with AI SDK

  const handleChangeComponent = (obj: Partial<PackagingInfo>) => {
    console.log(`Change component: ${obj}`);
  };

  const extractMessageAndComponents = useCallback(() => {
    const { cleanedText, extractedTags } = extractComponentTags(
      message.content
    );
    setCleanMessage(cleanedText);
    setComponents(extractedTags);
  }, [message.content]);

  useEffect(() => {
    if (message.role === 'assistant') {
      extractMessageAndComponents();
    } else {
      setCleanMessage(message.content);
    }
  }, [message.content, message.role, extractMessageAndComponents]);

  return (
    <div
      className={cn(
        'flex flex-col max-w-[80%]',
        message.role === 'user' ? 'ml-auto items-end' : 'items-start'
      )}
    >
      <div
        className={cn(
          'rounded-lg p-3',
          message.role === 'user' ? 'bg-purple-100' : 'bg-gray-100'
        )}
      >
        {cleanMessage}
        <div className="flex flex-col gap-2">
          {components?.map((value, index) => {
            return getComponent(value, handleChangeComponent, index);
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
