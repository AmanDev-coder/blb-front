import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "../../Styles/AdminSignup.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AdminRegisteration, clearAuthError } from "../../Redux/authReducer/action";
import { BlBtoast } from "../../hooks/toast";

const defaultValue = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
};

const AdminSignup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch =useDispatch()

  const isError = useSelector((store) => store.authReducer.isError);


  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isDirty, isValid },
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: defaultValue,
  });

  const onSubmit = async (data) => {
    const newUser = {
      name: data.username,
      email: data.email,
      password:data.password
    };
    dispatch(AdminRegisteration(newUser)).then((res)=>res.status=="success"?BlBtoast(`${res.message}`):null)

  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const closeDropdown = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdown);
    dispatch(clearAuthError())
    
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  const handleDropdownSelect = (value) => {
    setValue("role", value, { shouldValidate: true });
    setDropdownOpen(false);
  };

  
 

  return (
    <div className={styles.signupContainer}>
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <div className={styles.logo}>
            Book Luxury Yacht <span>App</span>
          </div>
          <h1 className={styles.heading}>Welcome, Admin</h1>
          <p className={styles.subHeading}>
            Create your account to manage everything
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Username */}
            <div className={styles.formGroup}>
              <div className={styles.inputWrapper}>
                <input
                  id="username"
                  type="text"
                  placeholder=" "
                  {...register("username", { required: true })}
                />
                <label htmlFor="username">Username</label>
              </div>
              {errors.username && <p className="error">Username is required</p>}
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
              <div className={styles.inputWrapper}>
                <input
                  id="email"
                  type="email"
                  placeholder=" "
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                />
                <label htmlFor="email">Email</label>
              </div>
              {errors.email && <p className="error">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <div className={styles.inputWrapper}>
                <input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  placeholder=" "
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                  })}
                />
                <label htmlFor="password">Password</label>
                <i
                  className={`fas ${
                    passwordVisible ? "fa-eye-slash" : "fa-eye"
                  } ${styles.icon}`}
                  onClick={() => setPasswordVisible(!passwordVisible)}
                ></i>
              </div>
              {errors.password && (
                <p className="error">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className={styles.formGroup}>
              <div className={styles.inputWrapper}>
                <input
                  id="confirmPassword"
                  type={confirmPasswordVisible ? "text" : "password"}
                  placeholder=" "
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
                <i
                  className={`fas ${
                    confirmPasswordVisible ? "fa-eye-slash" : "fa-eye"
                  } ${styles.icon}`}
                  onClick={() =>
                    setConfirmPasswordVisible(!confirmPasswordVisible)
                  }
                ></i>
              </div>
              {errors.confirmPassword && (
                <p className="error">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Role - Custom Dropdown */}
            <div className={styles.formGroup}>
              <div
                className={styles.customDropdown}
                ref={dropdownRef}
                onClick={toggleDropdown}
              >
                <div className={styles.dropdownToggle}>
                  {watch("role") || "Select Role"}
                </div>
                {dropdownOpen && (
                  <ul className={styles.dropdownMenu}>
                    {["Admin", "Others"].map((option, index) => (
                      <li
                        key={index}
                        onClick={() => handleDropdownSelect(option)}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {errors.role && <p className="error">Role is required</p>}
            </div>
            {isError && <p className="error"  style={{marginBottom:"15px",color:"red"}} >{isError.message}</p>}

            <div className={styles.buttons}>
              <button
                type="button"
                className={`${styles.button} ${styles.secondary}`}
                onClick={()=>navigate("/adminLogin")}
              >
                Sign In
              </button>
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

export default AdminSignup;
