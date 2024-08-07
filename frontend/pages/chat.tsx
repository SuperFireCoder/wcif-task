import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";
import axios from "axios";

import ChatList from "../src/components/ChatList";
import UserList from "../src/components/UserList";
import SideBar from "../src/components/SideBar";
import { isUserLoggedIn } from "../src/utils/auth";

const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
  query: {
    username:
      typeof window !== "undefined"
        ? localStorage.getItem("session") &&
          JSON.parse(localStorage.getItem("session")!).username
        : "",
  },
});

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [receiver, setReceiver] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoggedIn()) {
      router.push("/login");
    } else {
      const session = JSON.parse(localStorage.getItem("session")!);
      setUsername(session.username);
      setAvatar(session.avatar);
      setIsLoggedIn(true);
      socket.emit("join", { username: session.username });

      // Define message handler
      const handleMessage = (message: any) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      // Define user list handler
      const handleUserList = (userList: any) => {
        setUsers(userList.filter((user: any) => user.username !== username));
      };

      // Attach listeners
      socket.on("message", handleMessage);
      socket.on("user_list", handleUserList);

      if (username) {
        axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/users`)
          .then((response) =>
            setUsers(
              response.data.filter((user: any) => user.username !== username)
            )
          )
          .catch((error) => console.error(error));
      }

      return () => {
        socket.off("message", handleMessage);
        socket.off("user_list", handleUserList);
        socket.emit("leave", { username: session.username });
      };
    }
  }, [username, router]);

  const loadChatHistory = (receiver: string) => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/history/${username}/${receiver}`)
      .then((response) => setMessages(response.data))
      .catch((error) => console.error(error));
  };

  const sendMessage = (newMessage: any) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]); // Update local state immediately
    socket.emit("message", newMessage);
  };

  const logout = () => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/logout`, { username })
      .then((response) => {
        alert(response.data.message);
        setIsLoggedIn(false);
        localStorage.removeItem("session");
        socket.emit("leave", { username });
        router.push("/login");
      })
      .catch((error) => alert(error.response.data.message));
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex h-screen">
      <SideBar avatar={avatar} username={username} logout={logout} />
      <UserList
        users={users}
        setReceiver={(user) => {
          setReceiver(user);
          loadChatHistory(user);
        }}
      />
      <ChatList
        username={username}
        receiver={receiver}
        messages={messages}
        sendMessage={sendMessage}
      />
    </div>
  );
}
