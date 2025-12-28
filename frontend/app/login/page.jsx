"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const raw = await response.text();
      console.log("Login HTTP status:", response.status);
      console.log("Login raw body:", raw);

      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        data = { message: raw };
      }

      if (response.ok) {
        if (data.token) localStorage.setItem("token", data.token);
        if (data.user_id) localStorage.setItem("user_id", data.user_id);

        router.push("/dashboard");
      } else {
        alert(data.message || `Invalid credentials (status ${response.status})`);
      }
    } catch (error) {
      console.error("Fetch/login error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="container">
      <h2>Welcome Back</h2>
      <p style={{ textAlign: "center", color: "#555" }}>
        Sign in to continue making a difference
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email Address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Sign In</button>

        <small>
          Don’t have an account? <a href="/register">Register here</a>
        </small>
      </form>
    </div>
  );
}
