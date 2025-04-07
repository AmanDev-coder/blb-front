import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "../../LibComponents/ui/button";
import { useDispatch } from "react-redux";
import { sendContactUsRequest } from "../../../Redux/authReducer/action";
import { BlBtoast } from "../../../hooks/toast";
import { MailIcon, MessageSquare, User, Send, MapPin, Phone, Mail, CheckCircle2 } from "lucide-react";
import { BoxReveal } from "../../LibComponents/magicui/box-reveal";
import { BorderBeam } from "../../LibComponents/magicui/border-beam";

// Section container
const ContactSection = styled.section`
  // padding: 6rem 0;
  // background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
  position: relative;
  padding-bottom: 10rem;
  overflow: hidden;
  font-family: 'Poppins', sans-serif;
  color: #ffffff;
`;

// Background Elements
const BackgroundCircle = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(124, 58, 237, 0.05));
  z-index: 0;
  
  &.circle1 {
    width: 500px;
    height: 500px;
    top: -200px;
    right: -150px;
  }
  
  &.circle2 {
    width: 400px;
    height: 400px;
    bottom: -150px;
    left: -200px;
  }
`;

const Container = styled.div`
    max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  z-index: 1;
`;

// Header Styling
const SectionHeader = styled.div`
  text-align: left;
  margin-bottom: 4rem;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 0 1rem;
`;

const Title = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  background: linear-gradient(to right, #1e3a8a, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  position: relative;
  display: inline-block;
  
  &::after {
    content: "";
    position: absolute;
    bottom: -0.75rem;
    left: 0;
    transform: none;
    width: 80px;
    height: 4px;
    background: linear-gradient(to right, #3b82f6, #7c3aed);
    border-radius: 4px;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.1rem;
  color: #64748b;
  max-width: 600px;
  margin: 1.5rem 0 0;
  line-height: 1.6;
  padding: 0;
`;

// Contact Content Layout
const ContactContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

// Contact Information Section
const ContactInfo = styled(motion.div)`
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  border-radius: 1.5rem;
  padding: 3rem 2rem;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const InfoPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 0);
  background-size: 20px 20px;
  opacity: 0.4;
`;

const InfoTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  position: relative;
  color: #ffffff;
`;

const InfoDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 2.5rem;
  line-height: 1.7;
  opacity: 0.9;
  color: #ffffff;
  position: relative;
`;

const ContactMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
`;

const ContactMethod = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconCircle = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
  }
`;

const ContactDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContactLabel = styled.span`
  font-size: 0.875rem;
  opacity: 0.7;
  margin-bottom: 0.25rem;
`;

const ContactValue = styled.a`
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  color: white;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2.5rem;
  position: relative;
`;

const SocialLink = styled(motion.a)`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    background: white;
    color: #3b82f6;
    transform: translateY(-3px);
  }
`;

// Contact Form Section
const ContactForm = styled(motion.div)`
  background: white;
  border-radius: 1.5rem;
  padding: 3rem 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(229, 231, 235, 0.5);
`;

const FormTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 0.5rem;
`;

const FormDescription = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 2rem;
`;

const Form = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const InputContainer = styled.div`
  position: relative;
  
  &.full-width {
    grid-column: 1 / -1;
  }
`;

const InputIconWrapper = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  color: #64748b;
  z-index: 1;
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 1rem;
  background: #f8fafc;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  color: #334155;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
    background: white;
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const TextArea = styled(motion.textarea)`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 1rem;
  background: #f8fafc;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  resize: none;
  height: 150px;
  color: #334155;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
    background: white;
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const SubmitButton = styled(Button)`
  grid-column: 1 / -1;
  background: linear-gradient(to right, #3b82f6, #7c3aed);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  padding: 1.25rem 2rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
  box-shadow: 0 10px 15px rgba(59, 130, 246, 0.2);
  
  &:hover:not(:disabled) {
    background: linear-gradient(to right, #2563eb, #6d28d9);
    transform: translateY(-2px);
    box-shadow: 0 15px 25px rgba(59, 130, 246, 0.25);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

// Success Overlay
const SuccessOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border-radius: 1.5rem;
  z-index: 10;
`;

const SuccessIcon = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background: #ecfdf5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: #10b981;
`;

const SuccessTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const SuccessMessage = styled.p`
  font-size: 1rem;
  color: #64748b;
  text-align: center;
  margin-bottom: 2rem;
`;

const init = {
  name: "",
  email: "",
  message: "",
  subject: "",
};

const ContactUs = () => {
  const [formData, setFormdata] = useState(init);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useDispatch();
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  // Animate when in view
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({ ...formData, [name]: value });
  };
  
  const handleSubmit = async () => {
    // Form validation
    if (!formData.name || !formData.email || !formData.message) {
      BlBtoast("Please fill in all required fields");
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      BlBtoast("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
    const res = await dispatch(sendContactUsRequest(formData));
    console.log(res);
      
      if (res.success) {
        setIsSuccess(true);
        BlBtoast(res.message);
        setTimeout(() => {
          setIsSuccess(false);
    setFormdata(init);
        }, 5000);
      }
    } catch (error) {
      BlBtoast("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <ContactSection ref={ref}>
      {/* <BackgroundCircle 
        className="circle1"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2 }}
      />
      <BackgroundCircle 
        className="circle2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      /> */}
      
      <Container>
        <SectionHeader>
          <Title
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            Get In Touch
          </Title>
          <Subtitle
      initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
            }}
          >
            Have questions or need assistance? Reach out to our team and we&apos;ll get back to you shortly.
          </Subtitle>
        </SectionHeader>
        
        <ContactContent>
          <ContactInfo 
            initial="hidden"
            animate={controls}
            variants={containerVariants}
          >
            <InfoPattern />
            <div>
              <InfoTitle>Contact Information</InfoTitle>
              <InfoDescription>
                Our dedicated team is here to provide exceptional service. Feel free to contact us through any of the following methods.
              </InfoDescription>
              
              <ContactMethods>
                <ContactMethod variants={itemVariants}>
                  <IconCircle>
                    <MapPin size={20} />
                  </IconCircle>
                  <ContactDetails>
                    <ContactLabel>Our Location</ContactLabel>
                    <ContactValue as="span">123 Marina Bay, Miami, FL 33101</ContactValue>
                  </ContactDetails>
                </ContactMethod>
                
                <ContactMethod variants={itemVariants}>
                  <IconCircle>
                    <Phone size={20} />
                  </IconCircle>
                  <ContactDetails>
                    <ContactLabel>Phone Number</ContactLabel>
                    <ContactValue href="tel:+18009991234">+1 (800) 999-1234</ContactValue>
                  </ContactDetails>
                </ContactMethod>
                
                <ContactMethod variants={itemVariants}>
                  <IconCircle>
                    <Mail size={20} />
                  </IconCircle>
                  <ContactDetails>
                    <ContactLabel>Email Address</ContactLabel>
                    <ContactValue href="mailto:info@luxuryyachts.com">info@luxuryyachts.com</ContactValue>
                  </ContactDetails>
                </ContactMethod>
              </ContactMethods>
            </div>
            
            <SocialLinks>
              <SocialLink 
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </SocialLink>
              
              <SocialLink 
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </SocialLink>
              
              <SocialLink 
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </SocialLink>
              
              <SocialLink 
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </SocialLink>
            </SocialLinks>
          </ContactInfo>
          
          <ContactForm 
            initial="hidden"
            animate={controls}
            variants={containerVariants}
          >
            <FormTitle>Send Us a Message</FormTitle>
            <FormDescription>Fill out the form below, and we'll get back to you as soon as possible.</FormDescription>
            
            <Form>
              <InputContainer variants={itemVariants}>
                <InputIconWrapper>
                  <User size={18} />
                </InputIconWrapper>
        <Input
          type="text"
          name="name"
                  placeholder="Your Name"
          value={formData.name}
                  onChange={handleChange}
                  required
        />
      </InputContainer>
              
              <InputContainer variants={itemVariants}>
                <InputIconWrapper>
                  <MailIcon size={18} />
                </InputIconWrapper>
        <Input
          type="email"
          name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
          required
        />
      </InputContainer>
              
              <InputContainer className="full-width" variants={itemVariants}>
                <InputIconWrapper>
                  <MessageSquare size={18} />
                </InputIconWrapper>
        <TextArea
          name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
          required
                />
              </InputContainer>
              
              <SubmitButton 
                type="submit" 
                onClick={handleSubmit}
                disabled={isSubmitting}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send size={18} />
      </SubmitButton>
            </Form>
            
            {isSuccess && (
              <SuccessOverlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SuccessIcon>
                  <CheckCircle2 size={32} />
                </SuccessIcon>
                <SuccessTitle>Message Sent!</SuccessTitle>
                <SuccessMessage>
                  Thank you for reaching out. We've received your message and will get back to you shortly.
                </SuccessMessage>
                <Button 
                  variant="outline"
                  onClick={() => setIsSuccess(false)}
                >
                  Send Another Message
                </Button>
              </SuccessOverlay>
            )}
          </ContactForm>
        </ContactContent>
      </Container>
    </ContactSection>
  );
};

export default ContactUs;
