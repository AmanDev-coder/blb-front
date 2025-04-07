import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "../../Styles/OwnerLogin.module.scss";

const defaultValue = {
  username: "",
  password: "",
};

const OwnerLogin = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userdata"));
    if (userData?.token) {
      navigate("/userDashboard");
    }
  }, [navigate]);

  const {
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: defaultValue,
  });

  const onSubmit = async (data) => {
    const userData = {
      userid: "sam",
      username: data.username,
      token: 12341212,
      role: "organiser",
    };
    localStorage.setItem("userdata", JSON.stringify(userData));
    navigate("/userDashboard");
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <div className={styles.logo}>
            Book Luxury Yacht <span>App</span>
          </div>
          <h1 className={styles.heading}>Holla, Yacht Owner</h1>
          <p className={styles.subHeading}>
            Hey, welcome back to your special place
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formGroup}>
              <div className={styles.inputWrapper}>
                <input
                  id="username"
                  type="text"
                  placeholder=" "
                  {...register("username", { required: true })}
                />
                <label htmlFor="username">Email</label>
              </div>
              {errors.username && <p className="error">Email is required</p>}
            </div>
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
                  className={`fas ${passwordVisible ? "fa-eye-slash" : "fa-eye"} ${styles.icon}`}
                  onClick={() => setPasswordVisible(!passwordVisible)}
                ></i>
              </div>
              {errors.password && (
                <p className="error">Password is required</p>
              )}
            </div>
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

export default OwnerLogin;
