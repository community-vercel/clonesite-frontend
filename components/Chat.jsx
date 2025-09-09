'use client';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import api from '../lib/api';
import { useAuth } from '../lib/auth';

export default function Chat({ requestId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

  useEffect(() => {
    socket.emit('joinRequest', requestId);
    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.disconnect();
  }, [requestId]);

  const sendMessage = async () => {
    if (message.trim()) {
      const msg = { requestId, userId: user._id, text: message };
      socket.emit('message', msg);
      await api.post(`/requests/${requestId}/messages`, msg);
      setMessage('');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Chat</h2>
      <div className="h-64 overflow-y-auto border p-2 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${msg.userId === user._id ? 'text-right' : 'text-left'}`}
          >
            <p className={`inline-block p-2 rounded-lg ${msg.userId === user._id ? 'bg-primary text-white' : 'bg-gray-100'}`}>
              {msg.text}
            </p>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={sendMessage}
          className="bg-primary text-white py-2 px-4 rounded-r-lg hover:bg-green-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}