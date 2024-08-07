import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { isUserLoggedIn } from "../src/utils/auth";

import Button from "../src/components/Button";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (isUserLoggedIn()) {
      router.push("/chat");
    }
  }, [router]);

  const handleRegister = () => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        username,
        password,
        avatar,
      })
      .then((response) => {
        alert(response.data.message);
        router.push("/login");
      })
      .catch((error) => alert(error.response.data.message));
  };

  return (
    <div
      className="flex flex-col items-center h-screen m-4 bg-gradient-to-r from-green-400 to-green-600"
      style={{ justifyContent: "center" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <h3 className="text-lg font-semibold text-center p-4">Register</h3>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="mb-4 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mb-4 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="text"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          placeholder="Avatar URL"
          className="mb-4 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <div className="flex" style={{ justifyContent: "center" }}>
          <Button onClick={handleRegister}>Register</Button>
        </div>
      </div>
    </div>
  );
}
