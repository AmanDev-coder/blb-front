import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "../../Styles/OwnerSignup.module.scss";
import { OwnerRegisterationRequest } from "../../Redux/authReducer/action";
import { useDispatch } from "react-redux";

const defaultValue = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  businessType: "",
  businessName: "",
  country: "",
  state: "",
  city: "",
  town: "",
  yachtTypes: "",
};



const yachtOptions = [
  "Motor Yacht",
  "Sailing Yacht",
  "Catamaran",
  "Superyacht",
  "Luxury Yacht",
  "Fishing Boat",
  "Speed Boat",
];

const regionOptions = [
  "Canada",
  "United States of America",
  "Europe",
  "Rest of the World",
];

const businessTypeOptions = [
  "Individual",
  "Charter/Rental Company",
  "Charter Broker",
];

const OwnerSignup = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(sessionStorage.getItem("user")) || {};
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: user.name || "",
      email: user.email || "",
      businessType: "",
      region: "",
      yachtTypes: "",
    },
  });

  // Dropdown states (separate for each dropdown)
  const [businessDropdownOpen, setBusinessDropdownOpen] = useState(false);
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const [yachtDropdownOpen, setYachtDropdownOpen] = useState(false);

  const businessDropdownRef = useRef(null);
  const regionDropdownRef = useRef(null);
  const yachtDropdownRef = useRef(null);

  const closeDropdown = (e) => {
    if (businessDropdownRef.current && !businessDropdownRef.current.contains(e.target)) {
      setBusinessDropdownOpen(false);
    }
    if (regionDropdownRef.current && !regionDropdownRef.current.contains(e.target)) {
      setRegionDropdownOpen(false);
    }
    if (yachtDropdownRef.current && !yachtDropdownRef.current.contains(e.target)) {
      setYachtDropdownOpen(false);
    }
  };
  useEffect(() => {
    
  if(user.role=="b"){
    navigate("/ownerDashboard")
  }
  }, []);


  useEffect(() => {
    
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  const handleDropdownSelect = (field, value) => {
    setValue(field, value, { shouldValidate: true });

    // Close only the relevant dropdown
    if (field === "businessType") setBusinessDropdownOpen(false);
    if (field === "region") setRegionDropdownOpen(false);
    if (field === "yachtTypes") setYachtDropdownOpen(false);
  };

  const onSubmit = async (data) => {
    try {
      const newUser = {
        username: data.username,
        email: data.email,
        role: "Owner",
        businessType: data.businessType,
        businessName: data.businessName,
        region: data.region,
        yachtTypes: data.yachtTypes,
        verified: false,
        documents: [], // Placeholder for documents
      };

      // Dispatch action
      await dispatch(OwnerRegisterationRequest(newUser));

      navigate("/OwnerDashboard");
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <div className={styles.logo}>
            Book Luxury Yacht <span>App</span>
          </div>
          <h1 className={styles.heading}>Welcome, Owner</h1>
          <p className={styles.subHeading}>
            Create your account to manage everything
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Business Type Dropdown */}
            <div className={styles.formGroup}>
              <div
                className={styles.customDropdown}
                ref={businessDropdownRef}
                onClick={() => setBusinessDropdownOpen(!businessDropdownOpen)}
              >
                <div className={styles.dropdownToggle}>
                  {watch("businessType") || "Select Business Type"}
                </div>
                {businessDropdownOpen && (
                  <ul className={styles.dropdownMenu}>
                    {businessTypeOptions.map((option, index) => (
                      <li key={index} onClick={() => handleDropdownSelect("businessType", option)}>
                        {option}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {errors.businessType && <p className="error">Business Type is required</p>}
            </div>

            {/* Business Name Input */}
            <div className={styles.formGroup}>
              <div className={styles.inputWrapper}>
                <input
                  id="businessName"
                  type="text"
                  placeholder=" "
                  {...register("businessName", { required: true })}
                />
                <label htmlFor="businessName">Business Name</label>
              </div>
              {errors.businessName && <p className="error">Business Name is required</p>}
            </div>

            {/* Region Dropdown */}
            <div className={styles.formGroup}>
              <div
                className={styles.customDropdown}
                ref={regionDropdownRef}
                onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
              >
                <div className={styles.dropdownToggle}>
                  {watch("region") || "Select Region"}
                </div>
                {regionDropdownOpen && (
                  <ul className={styles.dropdownMenu}>
                    {regionOptions.map((option, index) => (
                      <li key={index} onClick={() => handleDropdownSelect("region", option)}>
                        {option}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {errors.region && <p className="error">Region is required</p>}
            </div>

            {/* Yacht Type Dropdown */}
            <div className={styles.formGroup}>
              <div
                className={styles.customDropdown}
                ref={yachtDropdownRef}
                onClick={() => setYachtDropdownOpen(!yachtDropdownOpen)}
              >
                <div className={styles.dropdownToggle}>
                  {watch("yachtTypes") || "Select Yacht Type"}
                </div>
                {yachtDropdownOpen && (
                  <ul className={styles.dropdownMenu}>
                    {yachtOptions.map((option, index) => (
                      <li key={index} onClick={() => handleDropdownSelect("yachtTypes", option)}>
                        {option}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {errors.yachtTypes && <p className="error">Yacht Type is required</p>}
            </div>

            {/* Submit Button */}
            <div className={styles.buttons}>
              <button
                type="submit"
                className={`${styles.button} ${styles.primary}`}
                disabled={!isDirty || !isValid}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className={styles.imageSection}>
        <img src="/assets/login21.jpg" alt="Signup Illustration" />
      </div>
    </div>
  );
};

export default OwnerSignup;

