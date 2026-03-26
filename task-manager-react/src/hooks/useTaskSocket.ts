import { useEffect, useRef } from 'react';
import type { WsMessage } from '@/types';
import { useTaskStore } from '@/store/taskStore';

const WS_URL = 'ws://localhost:8000/user/ws/tasks';

export function useTaskSocket() {
  const ws = useRef<WebSocket | null>(null);
  const { addTask, updateTask } = useTaskStore();

  useEffect(() => {
    const connect = () => {
      console.log("ws connected ")
      ws.current = new WebSocket(WS_URL);

      ws.current.onmessage = (e) => {
        try {
          const msg: WsMessage = JSON.parse(e.data);
          if (msg.event === 'TASK_CREATED' && msg.task) {
            console.log(msg)
            addTask(msg.task as Parameters<typeof addTask>[0]);
          } else if (msg.event === 'TASK_UPDATED' && msg.task) {
            updateTask(msg.task as Parameters<typeof updateTask>[0]);
          }
        } catch (_) {
          
        }
      };

      ws.current.onerror = () => {
        ws.current?.close();
      };

      ws.current.onclose = () => {
        // Reconnect after 3s
        setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      ws.current?.close();
    };
  }, []);

  return ws;
}
