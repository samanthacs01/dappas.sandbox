import { UIMessage } from 'ai';
import { useEffect, useRef } from 'react';
import { ChatStatus } from '../../types/chat';
import ChatMessage from './message';
import ChatThinking from './thinking';

type Props = {
  messages: UIMessage[];
  chatStatus: ChatStatus;
  onCustomMessage: (message: UIMessage) => void;
};

const ChatMessages: React.FC<Props> = ({ messages, chatStatus, onCustomMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="grow overflow-y-auto p-4 space-y-4 max-h-[calc(100vh_-_160px)]">
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message}  onCustomMessage={onCustomMessage}/>
      ))}
      {chatStatus !== 'ready' && <ChatThinking />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
