// frontend/app/services/api.js

// ---------------- Login ----------------
export const loginUser = async (email, password) => {
  const res = await fetch("http://127.0.0.1:5000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (res.ok) {
    // Store token and user info in localStorage
    localStorage.setItem("access_token", data.token);
    localStorage.setItem("user_id", data.user_id);
    localStorage.setItem("user_data", JSON.stringify(data.user)); // store full user object

    console.log("Token stored:", data.token);
    return data;
  } else {
    throw new Error(data.message || "Login failed");
  }
};

// ---------------- Dashboard stats ----------------
export const getDashboardStats = async () => { 
  const token = localStorage.getItem("access_token");
  const res = await fetch("http://127.0.0.1:5000/volunteers/dashboard-stats", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch dashboard stats");
  return res.json();
};

// ---------------- Volunteer profile ----------------
export const getVolunteerProfile = async () => {
  const token = localStorage.getItem("access_token");
  console.log("Token from localStorage:", token);

  const res = await fetch("http://127.0.0.1:5000/volunteers/volunteer/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    // const err = await res.json().catch(() => ({}));
    // console.error("Error fetching profile:", res.status, err);
    // throw new Error("Failed to fetch volunteer profile");
    // Try to get more specific error details from the server response
    const errorBody = await res.text();
    console.error("Error fetching profile:", res.status, res.statusText, errorBody);
    throw new Error(`Failed to fetch volunteer profile: ${res.status} ${res.statusText}`);
  }

  return res.json();
};


