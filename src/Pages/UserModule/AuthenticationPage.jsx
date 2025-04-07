import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import IslandVideo from '/assets/Island.mp4';
import Login from '../../components/Authentication/Login';
import Signup from '../../components/Authentication/Signup';
import { auth } from '../../Config/firebaseConfig';
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveUserToDatabase } from '../../Redux/authReducer/action';
import { useDispatch, useSelector } from 'react-redux';
import { BlBtoast } from '../../hooks/toast';
const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f0f0f0;
 
`;

const LeftSection = styled.div`
  flex: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
`;

const RightSection = styled.div`
  flex: 2;
   padding-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  // background-color: rgba(255, 255, 255, 0.8); /* White background with reduced opacity */
  perspective: 1000px;
`;

const FlipWrapper = styled.div`
  width: 100%;
  max-width: 400px;
//   height: 100%;
  position: relative;
  transition: transform 0.6s ease-in-out;
  transform-style: preserve-3d;
  transform: ${({ isFlipped }) => (isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)')};
  perspective: 1000px;  /* Ensure perspective is added to the wrapper */
  background-color: rgba(255, 255, 255, 0.8); /* White background with reduced opacity */
`;

const FormContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;  /* Ensure this is hidden */
  display: flex;
  flex-direction: column;
  justify-content: center;
  transform: ${({ isBack }) => (isBack ? 'rotateY(180deg)' : 'rotateY(0deg)')};  /* Flip the hidden side */
  
  
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;



const Tabs = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;
const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledVideo = styled.video`
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
`;

const Tab = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 10px;
  border-bottom: ${({ active }) => (active ? '2px solid #4285f4' : 'none')};
  color: ${({ active }) => (active ? '#4285f4' : '#000')};
`;

const AuthenticationPage = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('login');
  const [flipCompleted, setFlipCompleted] = useState(false);
  const navigate =useNavigate()
  const location = useLocation();
  const isAuth = useSelector((store) => store.authReducer.isAuth);
  const isLoginError = useSelector((store) => store.authReducer.isLoginError);


  useEffect(() => {
    setFlipCompleted(false);
    const flipDelay = setTimeout(() => setFlipCompleted(true), 600);
    return () => clearTimeout(flipDelay);
  }, [activeTab]);


  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();
      sessionStorage.setItem("token",token)
      sessionStorage.setItem("user",JSON.stringify({name:user.displayName,email:user.email}))
      //  navigate("/")
      await dispatch(
        saveUserToDatabase({
          name: user.displayName,
          email: user.email,
          token, // Optional: Pass token for backend validation if needed
        })
      );
          BlBtoast('Login Successful!')
      
     
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  const handleFacebookSignIn = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User info:", user);
      const token = await user.getIdToken();
      await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
    } catch (error) {
      console.error("Error during Facebook sign-in:", error);
    }
  };

  useEffect(() => {
    if (isAuth) {
      
      // BlBtoast('Login Successful!')
      const redirectPath = location.state?.from||"/" ; // Redirect back if redirected
      navigate(redirectPath, { replace: true });
    } 
  }, [isAuth, isLoginError]);
  return (
    <PageContainer>
      <LeftSection>
        <VideoContainer>
          <StyledVideo autoPlay loop muted>
            <source src={IslandVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </StyledVideo>
        </VideoContainer>
      </LeftSection>
      <RightSection>
      <FlipWrapper isFlipped={activeTab === 'signup'}>
  {/* Front side (Login) */}
  <FormContainer isBack={false}>
    <Tabs>
      <Tab active={activeTab === 'login'} onClick={() => setActiveTab('login')}>
        Login
      </Tab>
      <Tab active={activeTab === 'signup'} onClick={() => setActiveTab('signup')}>
        Signup
      </Tab>
    </Tabs>
    {
    
    activeTab === 'login'&&<Login handleFacebookSignIn={handleFacebookSignIn} handleGoogleSignIn={handleGoogleSignIn} />
    }
  </FormContainer>

  {/* Back side (Signup) */}
  <FormContainer isBack={true}>
    <Tabs>
      <Tab active={activeTab === 'login'} onClick={() => setActiveTab('login')}>
        Login
      </Tab>
      <Tab active={activeTab === 'signup'} onClick={() => setActiveTab('signup')}>
        Signup
      </Tab>
    </Tabs>
    
    {
      activeTab === 'signup'&&<Signup />
    }
  </FormContainer>
</FlipWrapper>

      </RightSection>
    </PageContainer>
  );
};

export default AuthenticationPage;