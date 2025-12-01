// document.addEventListener("DOMContentLoaded", async () => {
//   const token = localStorage.getItem("token");
//   const userId = localStorage.getItem("user_id");

//   if (!token || !userId) {
//     alert("Please log in first!");
//     window.location.href = "login.html";
//     return;
//   }

//   try {
//     const response = await fetch(`http://127.0.0.1:5000/api/dashboard/${userId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const data = await response.json();

//     if (response.ok) {
//       document.getElementById("username").textContent = data.name || "Volunteer";
//       document.getElementById("email").textContent = data.email;
//       document.getElementById("joinedDate").textContent = data.joined_date || "N/A";

//       const activityList = document.getElementById("activityList");
//       if (data.activities && data.activities.length > 0) {
//         data.activities.forEach((a) => {
//           const div = document.createElement("div");
//           div.classList.add("card");
//           div.innerHTML = `<strong>${a.title}</strong><br>${a.description}`;
//           activityList.appendChild(div);
//         });
//       } else {
//         activityList.innerHTML = "<p>No activities yet.</p>";
//       }
//     } else {
//       alert("Failed to load dashboard data.");
//     }
//   } catch (error) {
//     console.error(error);
//     alert("Error fetching dashboard data.");
//   }
// });

// // Logout functionality
// document.getElementById("logoutBtn").addEventListener("click", () => {
//   localStorage.clear();
//   window.location.href = "login.html";
// });
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

  if (!token || !userId) {
    console.warn("Token or user_id missing:", { token, userId });
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }

  console.log("Requesting dashboard for user:", userId);

  try {
    const response = await fetch(`http://127.0.0.1:5000/api/dashboard/${userId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    const raw = await response.text();
    console.log("Dashboard HTTP status:", response.status);
    console.log("Dashboard raw body:", raw);

    let data;
    try { data = JSON.parse(raw); } catch { data = { message: raw }; }

    if (!response.ok) {
      alert(data.message || `Failed to load dashboard (status ${response.status})`);
      return;
    }

    // render minimal info
    document.getElementById("username").textContent = data.name || "Volunteer";
    document.getElementById("email").textContent = data.email || "-";
    document.getElementById("joinedDate").textContent = data.joined_date || "-";

    const activityList = document.getElementById("activityList");
    activityList.innerHTML = "";
    if (data.activities && data.activities.length) {
      data.activities.forEach(a => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `<strong>${a.title}</strong><br>${a.description || ''}`;
        activityList.appendChild(div);
      });
    } else {
      activityList.innerHTML = "<p>No activities yet.</p>";
    }
  } catch (error) {
    console.error("Fetch/dashboard error:", error);
    alert("Error fetching dashboard data. See console for details.");
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});
