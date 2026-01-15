// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { loginUser } from "../services/api";

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const data = await loginUser(email, password);
//       console.log("Login success:", data);

//       // redirect to dashboard
//       router.push("/dashboard");
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   return (
//   <div className="page-wrapper">
//     <div className="container">
//       <h2>Welcome Back</h2>
//       <p style={{ textAlign: "center", color: "#555" }}>
//         Sign in to continue making a difference
//       </p>

//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           placeholder="Email Address"
//           required
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           required
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button type="submit">Sign In</button>

//         <small>
//           Don’t have an account? <a href="/register">Register here</a>
//         </small>
//       </form>
//     </div>
//   </div>
// );

// }


"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../services/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Attempting login...");
      const data = await loginUser(email, password);
      console.log("Login success:", data);
      
      // Check if token was actually stored
      const storedToken = localStorage.getItem("access_token");
      console.log("Token in localStorage after login:", storedToken);
      
      if (!storedToken) {
        alert("Warning: Token was not saved to localStorage!");
      }

      // redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      alert(err.message);
    }
  };

  return (
    <div className="page-wrapper">
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
            Don't have an account? <a href="/register">Register here</a>
          </small>
        </form>
      </div>
    </div>
  );
}