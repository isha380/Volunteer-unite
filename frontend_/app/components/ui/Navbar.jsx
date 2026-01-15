// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { LayoutDashboard, CalendarDays } from "lucide-react";

// export default function Navbar() {
//   const pathname = usePathname();

//   const linkClass = (path) =>
//     `nav-link ${pathname === path ? "active" : ""}`;

//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         <h2 className="logo">Volunteer Unite</h2>
//       </div>

//       <div className="navbar-right">
//         <Link href="/events" className={linkClass("/events")}>
//           <CalendarDays size={18} />
//           Browse Events
//         </Link>

//         <Link href="/dashboard" className={linkClass("/dashboard")}>
//           <LayoutDashboard size={18} />
//           Dashboard
//         </Link>
//       </div>
//     </nav>
//   );
// }



// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { LayoutDashboard, CalendarDays } from "lucide-react";

// export default function Navbar() {
//   const pathname = usePathname();

//   const linkClass = (path) =>
//     `nav-link ${pathname === path ? "active" : ""}`;

//   return (
//     <nav className="navbar">
//       <div className="navbar-inner">
//         {/* Left */}
//         <div className="navbar-left">
//           <span className="logo">Volunteer Unite</span>
//         </div>

//         {/* Right */}
//         <div className="navbar-right">
//           <Link href="/events" className={linkClass("/events")}>
//             <CalendarDays size={18} />
//             Browse Events
//           </Link>

//           <Link href="/dashboard" className={linkClass("/dashboard")}>
//             <LayoutDashboard size={18} />
//             Dashboard
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// }
// -------------------------------------------------------------------

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { LayoutDashboard, CalendarDays } from "lucide-react";

// export default function Navbar() {
//   const pathname = usePathname();

//   const linkClass = (path) =>
//     `nav-link ${pathname === path ? "active" : ""}`;

//   return (
//     <nav className="navbar">
//       <div className="navbar-inner">
//         <div className="navbar-left">
//           <div className="logo-container">
//             <div className="logo-image">
//               <img src="/assets/vu-logo.png" alt="Volunteer Unite Logo" className="logo-pic" />
//             </div>
//             <div className="logo-text">
//               <h2 className="logo-text1">Volunteer Unite</h2>
//               <p className="logo-text2">Making a difference together</p>
//             </div>
          

//           </div>
//         </div>

//         <div className="navbar-right">
//           <Link href="/events" className={linkClass("/events")}>
//             <CalendarDays size={18} />
//             Browse Events
//           </Link>

//           <Link href="/dashboard" className={linkClass("/dashboard")}>
//             <LayoutDashboard size={18} />
//             Dashboard
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import { getCurrentUser } from "../../services/api";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user has a valid token
    const token = localStorage.getItem("access_token");
    if (token) {
      const userData = getCurrentUser();
      setUser(userData);
    } else {
      setUser(null);
    }
  }, [pathname]);

  // Hide navbar on login and register pages
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const linkClass = (path) => `nav-link ${pathname === path ? "active" : ""}`;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">
          <div className="logo-container">
            <div className="logo-image">
              <img
                src="/assets/vu-logo.png"
                alt="Volunteer Unite Logo"
                className="logo-pic"
              />
            </div>
            <div className="logo-text">
              <h2 className="logo-text1">Volunteer Unite</h2>
              <p className="logo-text2">Making a difference together</p>
            </div>
          </div>
        </div>

        <div className="navbar-right">
          <Link href="/events" className={linkClass("/events")}>
            <CalendarDays size={18} />
            Browse Events
          </Link>
          
          {/* Only show Dashboard link if user is logged in */}
          {user && (
            <Link href="/dashboard" className={linkClass("/dashboard")}>
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          )}

          {/* Show Login button if not logged in, otherwise show profile */}
          {!user ? (
            <Link href="/login" className="nav-link login-btn">
              Login
            </Link>
          ) : (
            <ProfileDropdown user={user} />
          )}
        </div>
      </div>
    </nav>
  );
}