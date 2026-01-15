"use client";
import { useState } from "react";

export default function RegisterPage() {
 const [availability, setAvailability] = useState("");
 const [skills, setSkills] = useState("");
 const [interests, setInterests] = useState("");
 const [fullname, setFullname] = useState("");
 const [email, setEmail] = useState("");
 const [phone, setPhone] = useState("");
 const [password, setPassword] = useState("");
 const [confirmPassword, setConfirmPassword] = useState("");
 const [profile, setProfile] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z]{2,}$/;
    const phoneRegex = /^(97|98)[0-9]{8}$/;

    if (!emailRegex.test(email)) return alert("Invalid email format");
    if (!phoneRegex.test(phone)) return alert("Invalid phone number");
    if (password.length <= 4) return alert("Password too short");
    if (password !== confirmPassword) return alert("Passwords do not match");
    if (!profile) return alert("Profile picture required");

    const formData = new FormData();
    formData.append("name", fullname);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("skills", skills);
    formData.append("interests", interests);
    formData.append("availability", availability);
    formData.append("profile", profile);

    try {
      const res = await fetch("http://127.0.0.1:5000/auth/register", {
        method: "POST",
        body: formData,
      });

      const txt = await res.text();
      let data = {};
      try { data = JSON.parse(txt); } catch { data.message = txt; }

      if (res.ok) {
        alert("Registration successful!");
        window.location.href = "/login";
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Network error");
    }
  };

  return (
  <div className="page-wrapper">
    <div className="container">
      <h2>Join Volunteer Unite</h2>
      <p style={{ textAlign: "center", color: "#555" }}>
        Create your account and start making a difference
      </p>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="row">
          <input
            type="text"
            placeholder="Full Name"
            required
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="row">
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <input
          type="text"
          placeholder="Phone Number"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <textarea
          placeholder="Skills "
          required
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        ></textarea>
        <textarea
          placeholder="Interests"
          required
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
        ></textarea>

        <input
          type="text"
          placeholder="Availability (Optional)"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        />

        <label>Upload Profile Photo:</label>
        <input
          type="file"
          accept="image/*"
          required
          onChange={(e) => setProfile(e.target.files?.[0] || null)}
        />

        <button type="submit">Create Account</button>

        <small>
          Already have an account? <a href="/login">Sign in here</a>
        </small>
      </form>
    </div>
  </div>
);

}
