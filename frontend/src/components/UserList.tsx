import React, { useState } from "react";
import Image from "next/image";

interface User {
  username: string;
  avatar: string;
  online: boolean;
  lastMessage: string;
  lastMessageDate: string;
}

interface UserListProps {
  users: User[];
  setReceiver: (username: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, setReceiver }) => {
  const [selectedUser, setSelectedUser] = useState("");

  const handleUserClick = (username: string) => {
    setSelectedUser(username);
    setReceiver(username);
  };

  return (
    <div className="basis-1/4 border-r border-gray-300">
      <h3 className="text-lg font-semibold p-4 border-b border-gray-300">
        Users
      </h3>
      {users.map((user) => (
        <div
          key={user.username}
          onClick={() => handleUserClick(user.username)}
          className={`flex items-center p-4 cursor-pointer hover:bg-gray-200 ${
            selectedUser === user.username ? "bg-gray-300" : ""
          }`}
        >
          <div className="relative w-12 h-12">
            <Image
              src={user.avatar}
              alt="avatar"
              width={48}
              height={48}
              className="rounded-full"
            />
            {user.online && (
              <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-green-400" />
            )}
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{user.username}</div>
            <div className="text-sm text-gray-500">{user.lastMessage}</div>
          </div>
          <div className="ml-auto text-xs text-gray-400">
            {user.lastMessageDate}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
