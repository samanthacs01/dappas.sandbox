import { useContext } from 'react';
import { WebSocketContext } from './web-socket-context';

const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export default useWebSocket;
