import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { isUserLoggedIn } from "../src/utils/auth";

import Button from "../src/components/Button";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (isUserLoggedIn()) {
      router.push("/chat");
    }
  }, [router]);

  const handleLogin = () => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/login`, { username, password })
      .then((response) => {
        alert(response.data.message);
        const session = {
          username: response.data.username,
          avatar: response.data.avatar,
          timestamp: new Date().getTime(),
        };
        localStorage.setItem("session", JSON.stringify(session));
        router.push("/chat");
      })
      .catch((error) => {
        if (error.response.status === 403) {
          alert("User already logged in.");
        } else {
          alert(error.response.data.message);
        }
      });
  };

  return (
    <div
      className="flex flex-col items-center h-screen bg-gradient-to-r from-blue-400 to-blue-600"
      style={{ justifyContent: "center" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <h3 className="text-lg font-semibold text-center p-4">Login</h3>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="mb-4 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mb-4 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex" style={{ justifyContent: "center" }}>
          <Button onClick={handleLogin}>Login</Button>
          <div className="ml-4">
            <Button onClick={() => router.push("/register")}>
              New Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
