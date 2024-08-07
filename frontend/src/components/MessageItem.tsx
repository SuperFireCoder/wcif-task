import React from "react";

interface MessageItemProps {
  sender: string;
  timestamp: string;
  content: string;
  isCurrentUser: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
  sender,
  timestamp,
  content,
  isCurrentUser,
}) => {
  return (
    <div className={`flex flex-col mb-4 ${isCurrentUser ? "ml-20" : "mr-20"}`}>
      <div className="text-sm text-gray-600">
        <span className="font-semibold">{sender}</span>{" "}
        <span className="text-xs text-gray-500">
          {new Date(timestamp).toLocaleString()}
        </span>
      </div>
      <div
        className={`p-2 rounded-lg shadow-sm ${
          isCurrentUser ? "bg-blue-100" : "bg-gray-100"
        }`}
      >
        {content}
      </div>
    </div>
  );
};

export default MessageItem;
