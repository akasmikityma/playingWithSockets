import { useUser } from '../hooks/useUser';
import { useEffect, useState } from 'react';

const WS_URL = 'ws://localhost:3000';

export const useSocketHook = () => {
  const user = useUser();
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!user) return;

    const ws = new WebSocket(`${WS_URL}?token=${user.token}`);
    console.log(ws ? `Socket is there ${user.name}` : 'No socket');

    ws.onopen = () => {
      setSocket(ws);
    };

    ws.onclose = () => {
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, [user]);

  return socket;
};
