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


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (path) =>
    `nav-link ${pathname === path ? "active" : ""}`;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">
          <div className="logo-container">
            <div className="logo-image">
              <img src="/assets/vu-logo.png" alt="Volunteer Unite Logo" className="logo-pic" />
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

          <Link href="/dashboard" className={linkClass("/dashboard")}>
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
