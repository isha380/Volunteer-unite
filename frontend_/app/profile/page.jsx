// "use client";

// import { useState } from "react";
// import axios from "@/lib/axios";

// export default function ProfilePage() {
//   const [image, setImage] = useState(null);

//   const uploadImage = async () => {
//     const formData = new FormData();
//     formData.append("image", image);

//     await axios.post("/profile/upload-image", formData);
//     alert("Profile image updated");
//   };

//   return (
//     <div>
//       <h2>Customize Profile</h2>

//       <input
//         type="file"
//         onChange={(e) => setImage(e.target.files[0])}
//       />

//       <button onClick={uploadImage}>Upload</button>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import api from "@/lib/axios";

// export default function ProfilePage() {
//   const [profile, setProfile] = useState(null);

//   useEffect(() => {
//     console.log("Profile page mounted");

//     api.get("/profile/me")
//       .then((res) => {
//         console.log("PROFILE DATA:", res.data);
//         setProfile(res.data);
//       })
//       .catch((err) => {
//         console.error("PROFILE ERROR:", err);
//       });
//   }, []);

//   return (
//     <div style={{ padding: "40px" }}>
//       <h2>Customize Profile</h2>

//       {!profile && <p>Loading profile...</p>}

//       {profile && (
//         <>
//           <p><strong>Name:</strong> {profile.name}</p>
//           <p><strong>Email:</strong> {profile.email}</p>
//         </>
//       )}
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, Calendar, Clock, Star, Heart, Mail, Sparkles } from "lucide-react";
import { getVolunteerProfile } from "@/app/services/api";
import "./profile.css";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const data = await getVolunteerProfile();
        console.log("PROFILE DATA:", data);
        setProfile(data);
      } catch (error) {
        console.error("PROFILE ERROR:", error);
        // Handle expired token or authentication errors
        if (
          error.message?.includes("No access token") ||
          error.message?.includes("expired") ||
          error.message?.includes("401") ||
          error.message?.includes("UNAUTHORIZED")
        ) {
          // Clear expired token
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_id");
          localStorage.removeItem("user_data");
          // Redirect to login
          alert("Your session has expired. Please login again.");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-loading">
        <p>Failed to load profile</p>
      </div>
    );
  }

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently joined";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const imageUrl = profile.profile_picture 
    ? `http://127.0.0.1:5000/uploads/${profile.profile_picture}` 
    : null;

  return (
    <div className="profile-page">
      {/* Header Section with Profile Picture and Background */}
      <div className="profile-header">
        {/* Animated Quote */}
        <div className="celebration-quote">
          <Sparkles className="sparkle sparkle-1" size={20} />
          <Sparkles className="sparkle sparkle-2" size={16} />
          <Sparkles className="sparkle sparkle-3" size={18} />
          <h3 className="quote-text">
            You are the help people are waiting for
          </h3>
          
        </div>

        <div className="profile-header-content">
          {/* Profile Picture with celebration effect */}
          <div className="profile-picture-container">
            <div className="celebration-ring ring-1"></div>
            <div className="celebration-ring ring-2"></div>
            <div className="celebration-ring ring-3"></div>
            <div className="profile-picture">
              {imageUrl ? (
                <img src={imageUrl} alt={profile.name} />
              ) : (
                <span className="profile-initials">
                  {getInitials(profile.name)}
                </span>
              )}
            </div>
          </div>

          {/* Name with fade-in animation */}
          <h1 className="profile-name">{profile.name}</h1>
          <p className="profile-email">
            <Mail size={16} />
            {profile.email}
          </p>
          
          {/* Celebration badge */}
          <div className="celebration-badge">
            <Star size={16} className="badge-icon" />
            <span>Valued Volunteer</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="profile-content">
        <div className="profile-card">
          {/* Personal Details */}
          <div className="profile-section">
            <h2 className="section-title">
              <User size={20} />
              Personal Details
            </h2>
            
            <div className="details-grid">
              {/* Phone */}
              <div className="detail-item">
                <Phone size={20} />
                <div>
                  <p className="detail-label">Phone Number</p>
                  <p className="detail-value">{profile.phone || "Not provided"}</p>
                </div>
              </div>

              {/* Joined Date */}
              <div className="detail-item">
                <Calendar size={20} />
                <div>
                  <p className="detail-label">Member Since</p>
                  <p className="detail-value">{formatDate(profile.joined_at || profile.created_at)}</p>
                </div>
              </div>

              {/* Availability */}
              <div className="detail-item full-width">
                <Clock size={20} />
                <div>
                  <p className="detail-label">Availability</p>
                  <p className="detail-value">{profile.availability || "Not specified"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="profile-section">
            <h2 className="section-title">
              <Star size={20} />
              Skills
            </h2>
            <div className="tags-container">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <span key={index} className="tag tag-blue" style={{animationDelay: `${index * 0.1}s`}}>
                    {skill}
                  </span>
                ))
              ) : (
                <p className="empty-message">No skills added yet</p>
              )}
            </div>
          </div>

          {/* Interests */}
          <div className="profile-section">
            <h2 className="section-title">
              <Heart size={20} />
              Interests
            </h2>
            <div className="tags-container">
              {profile.interests && profile.interests.length > 0 ? (
                profile.interests.map((interest, index) => (
                  <span key={index} className="tag tag-purple" style={{animationDelay: `${index * 0.1}s`}}>
                    {interest}
                  </span>
                ))
              ) : (
                <p className="empty-message">No interests added yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="profile-actions">
          <button className="edit-profile-btn">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}