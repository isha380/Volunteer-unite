

const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const skills = document.getElementById("skills").value;
  const availability = document.getElementById("availability").value;
  const profile = document.getElementById("profile").files[0];

  // ---------- VALIDATIONS ----------
  // Email: only letters and numbers allowed in local and domain parts,
  // must include single @ and at least one dot before TLD (TLD letters only)
  const emailRegex = /^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z]{2,}$/;

  // Phone: exactly 10 digits and must start with 97 or 98
  const phoneRegex = /^(97|98)[0-9]{8}$/;

  if (!emailRegex.test(email)) {
    alert(
      "Invalid email format. Use only letters and numbers with the format: user@domain.tld"
    );
    return;
  }

  if (!phoneRegex.test(phone)) {
    alert("Invalid phone number. Must be 10 digits and start with 97 or 98.");
    return;
  }
  // Basic validations
  if (password.length <= 4) {
    alert("Password must be more than 4 characters.");
    return;
  }
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }
  if (!profile) {
    alert("Profile picture is required.");
    return;
  }

  const formData = new FormData();
  formData.append("name", fullname); // note: backend expects `name` for auth/register
  formData.append("email", email);
  formData.append("phone", phone);
  formData.append("password", password);
  formData.append("skills", skills);
  formData.append("availability", availability);
  formData.append("profile", profile);

  try {
    const response = await fetch("http://127.0.0.1:5000/auth/register", {
      method: "POST",
      body: formData
    });

    const text = await response.text();
    console.log("Status:", response.status);
    console.log("Response:", text);

    let data;
    try { data = JSON.parse(text); } catch (e) { data = { message: text }; }

    if (response.ok) {
      alert("Registration successful!");
      window.location.href = "login.html";
    } else {
      alert(data.message || `Registration failed (status ${response.status})`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Network error.");
  }
});