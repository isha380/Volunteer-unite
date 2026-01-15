// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { logout } from "@/lib/auth";
// import "./profile-dropdown.css";

// export default function ProfileDropdown({ user }) {
//   const [open, setOpen] = useState(false);

//   const imageUrl = user.profile_image
//     ? `${process.env.NEXT_PUBLIC_API_URL}/${user.profile_image}`
//     : null;

//   const initials = user.name
//     ?.split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase();

//   return (
//     <div className="profile-container">
//       <div className="avatar" onClick={() => setOpen(!open)}>
//         {imageUrl ? (
//           <img src={imageUrl} alt="Profile" />
//         ) : (
//           <span>{initials || "VU"}</span>
//         )}
//       </div>

//       {open && (
//         <div className="profile-dropdown">
//           <div className="profile-info">
//             <p className="role">{user.role}</p>
//             <p className="email">{user.email}</p>
//           </div>

//           <Link href="/profile" className="dropdown-item">
//             Customize Profile
//           </Link>

//           <button className="dropdown-item logout" onClick={logout}>
//             Logout
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./profile-dropdown.css";

export default function ProfileDropdown({ user }) {
  const [open, setOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  if (!user) return null;

  const imageUrl = user.profile
    ? `http://127.0.0.1:5000/uploads/${user.profile}`
    : null;

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_data");
    
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
      router.push("/login"); // Redirect to login page instead of home
    }, 2000);
  };

  return (
    <div className="profile-container">
      <div className="avatar" onClick={() => setOpen(!open)}>
        {imageUrl ? (
          <img src={imageUrl} alt="Profile" />
        ) : (
          <span>{initials || "VU"}</span>
        )}
      </div>
      {open && (
        <div className="profile-dropdown">
          <div className="profile-info">
            <p className="role">{user.role}</p>
            <p className="email">{user.email}</p>
          </div>
          <Link href="/profile" className="dropdown-item">
            Profile
          </Link>
          <button className="dropdown-item logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
      {showToast && (
        <div className="toast-message">
          Volunteer has signed out
        </div>
      )}
    </div>
  );
}