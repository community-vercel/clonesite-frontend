'use client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

export default function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

    socket.on('notification', (notification) => {
      setNotifications((prev) => [...prev, notification]);
      toast.info(notification.message);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="fixed top-4 right-4 space-y-2">
      {notifications.map((notif, index) => (
        <div key={index} className="bg-white p-4 rounded shadow">
          {notif.message}
        </div>
      ))}
    </div>
  );
}