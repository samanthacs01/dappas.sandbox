import { WebSocketMessage } from '@/server/types/ws';
import { createContext } from 'react';

export const WebSocketContext = createContext<{
  message: WebSocketMessage | null;
}>({
  message: null,
});
