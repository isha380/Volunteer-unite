


const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

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
    try { data = JSON.parse(raw); } catch { data = { message: raw }; }

    if (response.ok) {
      if (data.token) localStorage.setItem("token", data.token);
      if (data.user_id) localStorage.setItem("user_id", data.user_id);
      window.location.href = "dashboard.html";
    } else {
      alert(data.message || `Invalid credentials (status ${response.status})`);
    }
  } catch (error) {
    console.error("Fetch/login error:", error);
    alert("Something went wrong. Please try again later.");
  }
});
