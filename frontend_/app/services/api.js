

const API_URL = "http://127.0.0.1:5000";

// ---------------- Login ----------------
export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  console.log("Full login response:", data); // Debug

  if (res.ok) {
    // Backend returns 'access_token', not 'token'
    const token = data.access_token;
    
    if (!token) {
      console.error("No token found in response:", data);
      throw new Error("Login response missing token");
    }

    // Store token and user info in localStorage
    // Note: backend returns user.id, not user_id
    localStorage.setItem("access_token", token);
    localStorage.setItem("user_id", data.user.id);
    localStorage.setItem("user_data", JSON.stringify(data.user));

    console.log("Token stored:", token);
    console.log("User data stored:", data.user);
    
    return data;
  } else {
    throw new Error(data.message || "Login failed");
  }
};

// ---------------- Dashboard stats (Works with or without token) ----------------
export const getDashboardStats = async () => { 
  const token = localStorage.getItem("access_token");
  
  // Build headers object
  const headers = {
    "Content-Type": "application/json"
  };
  
  // Only add Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/volunteers/dashboard-stats`, {
    headers: headers,
  });
  
  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Dashboard stats error:", res.status, errorBody);
    throw new Error("Failed to fetch dashboard stats");
  }
  
  return res.json();
};

// ---------------- Volunteer profile ----------------
export const getVolunteerProfile = async () => {
  const token = localStorage.getItem("access_token");
  console.log("Token from localStorage:", token);

  if (!token) {
    throw new Error("No access token found. Please login.");
  }

  const res = await fetch(`${API_URL}/volunteers/volunteer/profile`, {
    headers: { 
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Error fetching profile:", res.status, res.statusText, errorBody);
    throw new Error(`Failed to fetch volunteer profile: ${res.status} ${res.statusText}`);
  }

  return res.json();
};

// ---------------- Get current user from localStorage ----------------
export const getCurrentUser = () => {
  const userDataString = localStorage.getItem("user_data");
  if (!userDataString) return null;
  
  try {
    return JSON.parse(userDataString);
  } catch (e) {
    console.error("Failed to parse user data:", e);
    return null;
  }
};