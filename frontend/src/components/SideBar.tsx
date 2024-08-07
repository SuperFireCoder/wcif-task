import React from "react";
import Image from "next/image";

interface SideBarProps {
  avatar: string;
  username: string;
  logout: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ avatar, username, logout }) => {
  return (
    <div className="w-20 flex flex-col justify-between p-4 bg-gray-800 text-white">
      <div className="flex flex-col items-center mb-4">
        <Image
          src={avatar}
          alt="avatar"
          width={48}
          height={48}
          className="rounded-full mb-2"
        />
        <div className="text-sm text-center font-semibold">{username}</div>
      </div>
      <button
        onClick={logout}
        className="p-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
      >
        Log out
      </button>
    </div>
  );
};

export default SideBar;
