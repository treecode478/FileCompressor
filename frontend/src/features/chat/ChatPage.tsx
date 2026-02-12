import React from 'react';

export const ChatPage: React.FC = () => {
  return (
    <div className="kc-card w-full p-4">
      <h2 className="mb-2 text-sm font-semibold text-slate-800">Chat</h2>
      <p className="text-xs text-slate-500">
        Wire this to Socket.IO (chat:sendDm, chat:message) and /chat/conversations APIs. Show
        conversations and messages in a WhatsApp-style layout.
      </p>
    </div>
  );
};

