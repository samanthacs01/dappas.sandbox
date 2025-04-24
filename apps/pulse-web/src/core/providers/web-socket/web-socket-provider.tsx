'use client';

import { WebSocketMessage } from '@/server/types/ws';
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { WebSocketContext } from './web-socket-context';

type Props = PropsWithChildren & {
  url: string;
};

const WebSocketProvider: React.FC<Props> = ({ children, url }) => {
  const connection = useRef<WebSocket | null>(null);
  const [message, setMessage] = useState<WebSocketMessage | null>(null);

  const connectWebSocket = async () => {
    if (!connection.current && url) {
      const socket = new WebSocket(url);

      socket.onmessage = (event) => {
        try {
          setMessage(JSON.parse(event.data));
        } catch (e) {
          console.error(e);
        }
      };

      connection.current = socket;
    }
  };


  useEffect(() => {
    connectWebSocket();
    return () => {
      if (connection.current) {
        connection.current.close();
        connection.current = null;
      }
    };
  }, [url]);

  return (
    <WebSocketContext.Provider value={{ message }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
