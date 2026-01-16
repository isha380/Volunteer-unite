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
import { User, Phone, Calendar, Clock, Star, Heart, Mail, Sparkles, X } from "lucide-react";
import { getVolunteerProfile, updateVolunteerProfile, uploadProfilePicture } from "@/app/services/api";
import "./profile.css";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    skills: "",
    interests: "",
    availability: ""
  });
  const [saving, setSaving] = useState(false);
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

        // Populate edit form with current data
        setEditForm({
          name: data.name || "",
          phone: data.phone || "",
          skills: Array.isArray(data.skills) ? data.skills.join(", ") : data.skills || "",
          interests: Array.isArray(data.interests) ? data.interests.join(", ") : data.interests || "",
          availability: data.availability || ""
        });
      } catch (error) {
        console.error("PROFILE ERROR:", error);

        if (
          error.message?.includes("No access token") ||
          error.message?.includes("expired") ||
          error.message?.includes("401") ||
          error.message?.includes("UNAUTHORIZED")
        ) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_id");
          localStorage.removeItem("user_data");

          alert("Your session has expired. Please login again.");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    // Reset image preview when closing
    setProfileImage(null);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }
    
    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Step 1: Update text fields with JSON
      const updateData = {
        name: editForm.name,
        phone: editForm.phone,
        skills: editForm.skills,
        interests: editForm.interests,
        availability: editForm.availability
      };

      console.log("Updating profile data...");
      await updateVolunteerProfile(updateData);

      // Step 2: Upload profile picture if selected
      if (profileImage) {
        console.log("Uploading profile picture...");
        try {
          await uploadProfilePicture(profileImage);
        } catch (imageError) {
          console.error("Failed to upload image:", imageError);
          // Don't fail the entire operation if image upload fails
        }
      }

      // Reload profile data
      const updatedData = await getVolunteerProfile();
      setProfile(updatedData);

      // Update localStorage user_data
      const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
      userData.name = editForm.name;
      userData.phone = editForm.phone;
      localStorage.setItem("user_data", JSON.stringify(userData));

      // Reset image states
      setProfileImage(null);
      setImagePreview(null);

      alert("Profile updated successfully!");
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(`Failed to update profile: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

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
    if (!dateString) return "Not available";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Not available";
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return "Not available";
    }
  };

  const imageUrl = profile.profile
    ? `http://127.0.0.1:5000/profile_pics/${profile.profile}`
    : null;

  return (
    <div className="profile-page">
      {/* Header Section */}
      <div className="profile-header">
        <div className="celebration-quote">
          <Sparkles className="sparkle sparkle-1" size={20} />
          <Sparkles className="sparkle sparkle-2" size={16} />
          <Sparkles className="sparkle sparkle-3" size={18} />
          <h3 className="quote-text">
            You are the help people are waiting for
          </h3>
          <div className="quote-underline"></div>
        </div>

        <div className="profile-header-content">
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

          <h1 className="profile-name">{profile.name}</h1>
          <p className="profile-email">
            <Mail size={16} />
            {profile.email}
          </p>

          <div className="celebration-badge">
            <Star size={16} className="badge-icon" />
            <span>Valued Volunteer</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-section">
            <h2 className="section-title">
              <User size={20} />
              Personal Details
            </h2>

            <div className="details-grid">
              <div className="detail-item">
                <Phone size={20} />
                <div>
                  <p className="detail-label">Phone Number</p>
                  <p className="detail-value">{profile.phone || "Not provided"}</p>
                </div>
              </div>

              <div className="detail-item">
                <Calendar size={20} />
                <div>
                  <p className="detail-label">Member Since</p>
                  <p className="detail-value">{formatDate(profile.joined_at)}</p>
                </div>
              </div>

              <div className="detail-item full-width">
                <Clock size={20} />
                <div>
                  <p className="detail-label">Availability</p>
                  <p className="detail-value">{profile.availability || "Not specified"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2 className="section-title">
              <Star size={20} />
              Skills
            </h2>
            <div className="tags-container">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <span key={index} className="tag tag-blue" style={{ animationDelay: `${index * 0.1}s` }}>
                    {skill}
                  </span>
                ))
              ) : (
                <p className="empty-message">No skills added yet</p>
              )}
            </div>
          </div>

          <div className="profile-section">
            <h2 className="section-title">
              <Heart size={20} />
              Interests
            </h2>
            <div className="tags-container">
              {profile.interests && profile.interests.length > 0 ? (
                profile.interests.map((interest, index) => (
                  <span key={index} className="tag tag-purple" style={{ animationDelay: `${index * 0.1}s` }}>
                    {interest}
                  </span>
                ))
              ) : (
                <p className="empty-message">No interests added yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="edit-profile-btn" onClick={handleEditClick}>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="edit-overlay" onClick={handleCloseModal}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="edit-header">
              <h2>Edit Your Profile</h2>
              <button className="edit-close" onClick={handleCloseModal}>
                <X size={22} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="edit-body">
              <div className="edit-group center">
                <label className="edit-label">Profile Picture</label>

                <div className="edit-avatar-wrapper">
                  <img
                    src={imagePreview || imageUrl || "/default-avatar.png"}
                    alt="Profile Preview"
                    className="edit-avatar"
                  />

                  <label className="edit-avatar-btn">
                    Change
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              <div className="edit-group">
                <label className="edit-label">Full Name</label>
                <div className="edit-field">
                  <User size={18} />
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="edit-group">
                <label className="edit-label">Phone Number</label>
                <div className="edit-field">
                  <Phone size={18} />
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="edit-group">
                <label className="edit-label">
                  Skills <span className="edit-hint">(comma separated)</span>
                </label>
                <div className="edit-field">
                  <Star size={18} />
                  <input
                    type="text"
                    name="skills"
                    value={editForm.skills}
                    onChange={handleInputChange}
                    placeholder="Teaching, First Aid, Event Management"
                  />
                </div>
              </div>

              <div className="edit-group">
                <label className="edit-label">
                  Interests <span className="edit-hint">(comma separated)</span>
                </label>
                <div className="edit-field">
                  <Heart size={18} />
                  <input
                    type="text"
                    name="interests"
                    value={editForm.interests}
                    onChange={handleInputChange}
                    placeholder="Community, Health, Education"
                  />
                </div>
              </div>

              <div className="edit-group">
                <label className="edit-label">Availability</label>
                <div className="edit-field">
                  <Clock size={18} />
                  <input
                    type="text"
                    name="availability"
                    value={editForm.availability}
                    onChange={handleInputChange}
                    placeholder="Weekends, Evenings"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="edit-footer">
              <button className="edit-cancel" onClick={handleCloseModal}>
                Cancel
              </button>
              <button
                className="edit-save"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}