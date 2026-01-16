const API_URL = "http://127.0.0.1:5000";

// ---------------- Login ----------------
export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  console.log("Full login response:", data);

  if (res.ok) {
    const token = data.access_token;
    
    if (!token) {
      console.error("No token found in response:", data);
      throw new Error("Login response missing token");
    }

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

// ---------------- Dashboard stats ----------------
export const getDashboardStats = async () => { 
  const token = localStorage.getItem("access_token");
  
  const headers = {
    "Content-Type": "application/json"
  };
  
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
    method: "GET",
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

// ---------------- Update volunteer profile (TEXT ONLY) ----------------
export const updateVolunteerProfile = async (profileData) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No access token found. Please login.");
  }

  const res = await fetch(`${API_URL}/volunteers/volunteer/profile`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(profileData)
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `Failed to update profile: ${res.status}`);
  }

  return res.json();
};

// ---------------- Upload profile picture ----------------
export const uploadProfilePicture = async (imageFile) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No access token found. Please login.");
  }

  const formData = new FormData();
  formData.append("profile", imageFile);

  const res = await fetch(`${API_URL}/volunteers/volunteer/profile/picture`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
      // Don't set Content-Type for FormData
    },
    body: formData
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `Failed to upload picture: ${res.status}`);
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

// ---------------- Logout ----------------
export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_data");
};