// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import Link from 'next/link';
// import './layout.css'; // Separate CSS file

// export default function AdminLayout({ children }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [user, setUser] = useState(null);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);

//   useEffect(() => {
//     // Check authentication
//     const token = localStorage.getItem('token');
//     const userData = localStorage.getItem('user');

//     if (!token || !userData) {
//       router.push('/admin/login');
//       return;
//     }

//     try {
//       const parsedUser = JSON.parse(userData);
//       if (parsedUser.role !== 'admin') {
//         router.push('/admin/login');
//         return;
//       }
//       setUser(parsedUser);
//     } catch (error) {
//       console.error('Error parsing user data:', error);
//       router.push('/admin/login');
//     }
//   }, [router]);

//   // Close profile menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showProfileMenu && !event.target.closest('.profile-dropdown')) {
//         setShowProfileMenu(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [showProfileMenu]);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     router.push('/admin/login');
//   };

//   const isActive = (path) => {
//     return pathname === path;
//   };

//   if (!user) {
//     return (
//       <div className="loading-container">
//         <div className="loading-content">
//           <div className="loading-spinner-large"></div>
//           <p className="loading-text">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="admin-layout">
//       {/* Navbar */}
//       <nav className="admin-navbar">
//         <div className="navbar-container">
//           <div className="navbar-content">
//             {/* Logo */}
//             <div className="navbar-left">
//               <div className="logo-section">
//                 <div className="logo-icon">
//                   <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                   </svg>
//                 </div>
//                 <div className="logo-text">
//                   <h1 className="logo-title">Admin Dashboard</h1>
//                   <p className="logo-subtitle">Volunteer Unite</p>
//                 </div>
//               </div>

//               {/* Navigation Links */}
//               <div className="nav-links">
//                 <Link
//                   href="/dashboard/admin"
//                   className={`nav-link ${isActive('/dashboard/admin') ? 'active' : ''}`}
//                 >
//                   <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
//                   </svg>
//                   <span>Dashboard</span>
//                 </Link>
//                 <Link
//                   href="/dashboard/admin/volunteers"
//                   className={`nav-link ${isActive('/dashboard/admin/volunteers') ? 'active' : ''}`}
//                 >
//                   <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//                   </svg>
//                   <span>Volunteers</span>
//                 </Link>
//                 <Link
//                   href="/dashboard/admin/attendance"
//                   className={`nav-link ${isActive('/dashboard/admin/attendance') ? 'active' : ''}`}
//                 >
//                   <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
//                   </svg>
//                   <span>Attendance</span>
//                 </Link>
//                 <Link
//                   href="/dashboard/admin/notifications"
//                   className={`nav-link ${isActive('/dashboard/admin/notifications') ? 'active' : ''}`}
//                 >
//                   <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//                   </svg>
//                   <span>Notifications</span>
//                 </Link>
//               </div>
//             </div>

//             {/* Profile Dropdown */}
//             <div className="profile-dropdown">
//               <button
//                 onClick={() => setShowProfileMenu(!showProfileMenu)}
//                 className="profile-button"
//               >
//                 <div className="profile-avatar">
//                   {user.name?.charAt(0).toUpperCase()}
//                 </div>
//                 <div className="profile-info">
//                   <p className="profile-name">{user.name}</p>
//                   <p className="profile-role">Administrator</p>
//                 </div>
//                 <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>

//               {/* Dropdown Menu */}
//               {showProfileMenu && (
//                 <div className="dropdown-menu">
//                   <div className="dropdown-header">
//                     <p className="dropdown-name">{user.name}</p>
//                     <p className="dropdown-email">{user.email}</p>
//                   </div>
//                   <Link
//                     href="/dashboard/admin/profile"
//                     className="dropdown-item"
//                     onClick={() => setShowProfileMenu(false)}
//                   >
//                     <svg className="dropdown-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                     </svg>
//                     <span>Profile</span>
//                   </Link>
//                   <button
//                     onClick={handleLogout}
//                     className="dropdown-item logout"
//                   >
//                     <svg className="dropdown-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                     </svg>
//                     <span>Logout</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="main-content">
//         {children}
//       </main>
//     </div>
//   );
// }

'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import './layout.css';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/admin/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        router.push('/admin/login');
        return;
      }
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/admin/login');
    }
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  const isActive = (path) => pathname === path;

  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner-large"></div>
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <nav className="admin-navbar">
        <div className="navbar-container">
          <div className="navbar-content">
            <div className="navbar-left">
              <div className="logo-section">
                <div className="logo-icon">
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="logo-text">
                  <h1 className="logo-title">Admin Dashboard</h1>
                  <p className="logo-subtitle">Volunteer Unite</p>
                </div>
              </div>

              <div className="nav-links">
                <Link href="/dashboard/admin" className={`nav-link ${isActive('/dashboard/admin') ? 'active' : ''}`}>
                  <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>Dashboard</span>
                </Link>
                <Link href="/dashboard/admin/volunteers" className={`nav-link ${isActive('/dashboard/admin/volunteers') ? 'active' : ''}`}>
                  <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>Volunteers</span>
                </Link>
                <Link href="/dashboard/admin/attendance" className={`nav-link ${isActive('/dashboard/admin/attendance') ? 'active' : ''}`}>
                  <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span>Attendance</span>
                </Link>
                <Link href="/dashboard/admin/notifications" className={`nav-link ${isActive('/dashboard/admin/notifications') ? 'active' : ''}`}>
                  <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span>Notifications</span>
                </Link>
              </div>
            </div>

            <div className="profile-dropdown" ref={dropdownRef}>
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="profile-button">
                <div className="profile-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <div className="profile-info">
                  <p className="profile-name">Admin</p>
                  <p className="profile-role">{user.name}</p>
                </div>
                <svg className={`dropdown-icon ${showProfileMenu ? 'rotate' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showProfileMenu && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user.name}</p>
                    <p className="dropdown-email">{user.email}</p>
                  </div>
                  <Link href="/dashboard/admin/profile" className="dropdown-item" onClick={() => setShowProfileMenu(false)}>
                    <svg className="dropdown-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profile</span>
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <svg className="dropdown-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="main-content">{children}</main>
    </div>
  );
}