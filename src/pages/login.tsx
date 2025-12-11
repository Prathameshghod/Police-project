import React, { useState } from "react";
import "./css/Login.css";

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    const response = await fetch("https://police-project-backend-68ng.vercel.app/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action:'login',
        identifier: usernameOrEmail,
        password,
      }),
    });

    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div className="login-container">
      
      {/* Heading outside the box */}
      <h1 className="title">TRINETRA OSINT</h1>

      {/* Only one main box for inputs */}
      
      <div className="login-box">
        <div className="input-group">
          <label>Email</label>
          <input
            type="text"
            placeholder="Enter your email"
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button onClick={handleLogin} className="login-btn">
          Login In
        </button>

        <p className="note">
          Need access? Contact your administrator to create an account.
        </p>

        <p className="message">{message}</p>
      </div>
    </div>
  );
}
