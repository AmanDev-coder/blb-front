import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "../../Styles/AdminLogin.module.scss";
import { LoginAdmin } from "../../Redux/authReducer/action";
import { useDispatch, useSelector } from "react-redux";
import { BlBtoast } from "../../hooks/toast";

const defaultValue = {
  password: "",
  email:"",
  role: "",
};

const AdminLogin = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isError = useSelector((store) => store.authReducer.isError);
  const isAuth = useSelector((store) => store.authReducer.isAuth);
  const isLoading = useSelector((store) => store.authReducer.isLoading);


  useEffect(() => {
    if (isAuth) {
      BlBtoast("Login Successful!");
      navigate("/adminn/dashboard")
    } 
  }, [isAuth, isError]);
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: defaultValue,
  });

  const onSubmit = async (data) => {
    const userData = {
      email:data.email,
      password:data.password
    };
    dispatch(LoginAdmin(userData));
    // localStorage.setItem("userdata", JSON.stringify(userData));
    // navigate("/userDashboard");
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const closeDropdown = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  const handleDropdownSelect = (value) => {
    setValue("role", value, { shouldValidate: true });
    setDropdownOpen(false);
  };

  return (
    
    <div className={styles.loginContainer}>
      
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <div className={styles.logo}>
            Book Luxury Yacht <span>App</span>
          </div>
          <h1 className={styles.heading}>Holla, Admin</h1>
          <p className={styles.subHeading}>
            Hey, welcome back to your special place
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Username */}
            <div className={styles.formGroup}>
              <div className={styles.inputWrapper}>
                <input
                  id="email"
                  type="text"
                  placeholder=" "
                  {...register("email", { required: true })}
                />
                <label htmlFor="email">Email</label>
              </div>
              {errors.email && <p className="error">Email is required</p>}
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <div className={styles.inputWrapper}>
                <input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  placeholder=" "
                  {...register("password", { required: true })}
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
                <p className="error">Password is required</p>
              )}
            </div>

            {/* Role - Custom Dropdown */}
            {/* <div className={styles.formGroup}>
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
            </div> */}
         {isError && <p className="error" style={{marginBottom:"15px",color:"red"}}>{isError.message}</p>}

            {/* Buttons */}
            <div className={styles.buttons}>
              <button
                type="button"
                className={`${styles.button} ${styles.secondary}`}
              >
                Switch Method
              </button>
              <button
                type="submit"
                className={`${styles.button} ${styles.primary}`}
                disabled={!isDirty || !isValid}
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className={styles.imageSection}>
        <img src="/assets/login21.jpg" alt="Login Illustration" />
      </div>
    </div>
  );
};

export default AdminLogin;
