import React, { useState, useEffect } from "react";

import Button from "./Button";
import MessageItem from "./MessageItem";

interface ChatListProps {
  username: string;
  receiver: string;
  messages: any[];
  sendMessage: (newMessage: any) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  username,
  receiver,
  messages,
  sendMessage,
}) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage("");
  }, [receiver]);

  const handleSend = () => {
    if (message && receiver) {
      const newMessage = {
        sender: username,
        receiver: receiver,
        content: message,
        timestamp: new Date().toISOString(),
      };
      sendMessage(newMessage);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <h3 className="text-lg font-semibold p-4 border-b border-gray-300">
        Chat with {receiver}
      </h3>
      <div className="overflow-y-auto custom-scrollbar">
        <div className="flex-1 p-4">
          {messages
            .filter(
              (msg) =>
                (msg.sender === username && msg.receiver === receiver) ||
                (msg.sender === receiver && msg.receiver === username)
            )
            .map((msg, index) => (
              <MessageItem
                key={index}
                sender={msg.sender}
                timestamp={msg.timestamp}
                content={msg.content}
                isCurrentUser={msg.sender === username}
              />
            ))}
          <div className="mt-4 flex items-center ml-2">
            <div className="flex-grow">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Message ${receiver}`}
                disabled={!receiver}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300 ease-in-out"
              />
            </div>
            <div className="mx-2">
              <Button onClick={handleSend} disabled={!receiver}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
