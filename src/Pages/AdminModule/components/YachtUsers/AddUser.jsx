import { useState, useRef, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaKey,
  FaEye,
  FaEyeSlash,
  FaUserShield,
  FaSave,
  FaRedo,
  FaUpload,
  FaUserPlus
} from "react-icons/fa";
import styles from "./AddUser.module.scss";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const roles = ["Admin", "Editor", "Viewer", "Moderator"];
const statuses = ["Active", "Pending", "Suspended"];

const AddUserComponent = ({ onUserAdded }) => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
//   const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    role: "Viewer",
    password: "",
    status: "Active",
    profileImg:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  });

  // Password Strength Checker
  useEffect(() => {
    if (formData.password.length < 6) {
      setPasswordStrength("Weak");
    } else if (formData.password.length < 10) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Strong");
    }
  }, [formData.password]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Profile Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
        setFormData((prev) => ({ ...prev, profileImg: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset Form
  const handleReset = () => {
    formRef.current.reset();
    setFormData({
      name: "",
      email: "",
      contact: "",
      role: "Viewer",
      password: "",
      status: "Active",
      profileImg:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    });
    setPreviewImage(null);
  };

  // Load Existing Users from Local Storage
  const loadUsers = () => {
    const storedUsers = localStorage.getItem("usersData");
    return storedUsers ? JSON.parse(storedUsers) : [];
  };

 // ** Handle Form Submission **
 const handleSubmit = (e) => {
    e.preventDefault();
    const users = loadUsers();
    const newUser = { ...formData, id: `#U${users.length + 1}` };

    // ✅ Append the new user to existing users
    const updatedUsers = [...users, newUser];
    localStorage.setItem("usersData", JSON.stringify(updatedUsers));

    // ✅ Call parent function to refresh user table
    if (onUserAdded) onUserAdded(newUser);

    // ✅ Redirect to Users Table
    navigate("/adminn/users");
  };

  return (
    <div className={styles.addUserContainer}>
      <div className={styles.header}>
        <h2>
          <FaUserPlus /> Add User
        </h2>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className={styles.userForm}>
        <fieldset className={styles.importantFields}>
          <legend>User Information</legend>

          <div className={styles.profileSection}>
          <label className={styles.uploadLabel}>
            {previewImage ? (
              <img src={previewImage} alt="Profile Preview" className={styles.profilePreview} />
            ) : (
              <FaUpload className={styles.profilePlaceholder} />
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
            
          </label>
          <span>Upload Profile Image</span>
        </div>

          <div className={styles.formGroup}>
            <label>
              <FaUser /> Full Name*
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              <FaEnvelope /> Email*
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              <FaPhone /> Contact Number*
            </label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>
        </fieldset>

        <fieldset className={styles.optionalFields}>
          <legend>Role & Status</legend>
          <div className={styles.formGroup}>
            <label>
              <FaUserShield /> Role*
            </label>
            <select name="role" value={formData.role} onChange={handleChange}>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Status*</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <fieldset className={styles.authFields}>
          <legend>Authentication</legend>
          <div className={styles.formGroup}>
            <label>
              <FaKey /> Password*
            </label>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <p className={styles.passwordStrength}>
              Strength: <span className={styles[passwordStrength.toLowerCase()]}>{passwordStrength}</span>
            </p>
          </div>
        </fieldset>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton}>
            <FaSave /> Add User
          </button>
          <button type="button" className={styles.resetButton} onClick={handleReset}>
            <FaRedo /> Reset
          </button>
        </div>
      </form>
    </div>
  );
};

// Add prop type validation
AddUserComponent.propTypes = {
  onUserAdded: PropTypes.func,
};

export default AddUserComponent;
