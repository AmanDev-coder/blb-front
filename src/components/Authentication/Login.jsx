import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Eye, EyeOff } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
// import { ReactComponent as AppleIcon } from '../../assets/apple.svg';
// import { ReactComponent as FacebookIcon } from '../../assets/facebook.svg';
import { useSelector, useDispatch } from "react-redux";
import { clearAuthError, LoginUser } from "../../Redux/authReducer/action";
import { useLocation, useNavigate } from "react-router-dom";
import { BlBtoast } from "../../hooks/toast";

// import { useToast } from "../../hooks/use-toast"

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 50px; /* Added padding */
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 350px; /* Set max width for the input fields */
`;

const Input = styled.input`
  width: 100%; /* Allow it to take the full width of the PasswordWrapper */
  padding: 12px 40px 12px 12px; /* Adjust right padding to make space for the eye icon */
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box; /* Ensure padding doesn't break the width */
`;

const TogglePassword = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const SignInButton = styled.button`
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
`;

const OrContinueWith = styled.div`
  text-align: center;
  color: #777;
  margin: 20px 0;
`;

const SocialButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const SocialButton = styled.button`
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    background-color: #f0f0f0; /* Light gray background on hover */
    transform: scale(1.05); /* Slightly increase size on hover */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); /* Add shadow on hover */
  }

  &:active {
    transform: scale(1); /* Reset scale on click */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow when clicked */
  }
`;

const Login = ({ handleGoogleSignIn, handleFacebookSignIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const isAuth = useSelector((store) => store.authReducer.isAuth);
  const isLoginError = useSelector((store) => store.authReducer.isLoginError);
  const isError = useSelector((store) => store.authReducer.isError);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(LoginUser(email, password));
  };

  useEffect(() => {
    if (isAuth) {
      BlBtoast("Login Successful!");
    } 
  }, [isAuth, isError]);

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          dispatch(clearAuthError())
        }}
        required
      />
      <PasswordWrapper>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TogglePassword onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
        </TogglePassword>
      </PasswordWrapper>
      {isError && <p style={{ color: "red" }}>{isError.message}</p>}

      <SignInButton type="submit">Sign In</SignInButton>
      <OrContinueWith>Or continue with</OrContinueWith>
      <SocialButtons>
        <SocialButton type="button" onClick={handleGoogleSignIn}>
          {" "}
          <FaGoogle size={30} style={{ color: "#4285f4" }} />
        </SocialButton>
        {/* <SocialButton type='button'><AppleIcon /></SocialButton> */}
        <SocialButton type="button" onClick={handleFacebookSignIn}>
          <FaFacebook size={30} style={{ color: "#4285f4" }} />
        </SocialButton>
      </SocialButtons>
      
    </Form>
  );
};

export default Login;
