import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Ship, 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  ChevronRight,
  ArrowUp
} from "lucide-react";

// Main Footer Container
const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #0f172a, #1e3a8a);
  color: #f8fafc;
  position: relative;
  overflow: visible;
  // margin-top: 2rem;
`;

// Background decoration
const FooterPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 25%),
    radial-gradient(circle at 85% 30%, rgba(124, 58, 237, 0.1) 0%, transparent 25%);
  pointer-events: none;
`;

// Main content wrapper
const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 5rem 1.5rem 2rem;
  position: relative;
  z-index: 1;
`;

// Top section with logo and newsletter
const FooterTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4rem;
  flex-wrap: wrap;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// Logo and description section
const FooterBrand = styled.div`
  max-width: 320px;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const LogoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6, #7c3aed);
  width: 48px;
  height: 48px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
`;

const LogoText = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(to right, #f8fafc, #cbd5e1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const BrandDescription = styled.p`
  color: #cbd5e1;
  line-height: 1.7;
  margin-bottom: 1.5rem;
`;

// Newsletter section
const Newsletter = styled.div`
  max-width: 400px;
`;

const NewsletterHeading = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #f8fafc;
`;

const NewsletterDescription = styled.p`
  color: #cbd5e1;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const SubscribeForm = styled.form`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const EmailInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #475569;
  background-color: rgba(255, 255, 255, 0.05);
  color: #f8fafc;
  font-size: 0.875rem;
  
  &::placeholder {
    color: #94a3b8;
  }
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }
`;

const SubscribeButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  background: linear-gradient(to right, #3b82f6, #7c3aed);
  color: white;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
`;

// Main footer grid with links and info
const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 3rem;
  margin-bottom: 4rem;
`;

// Footer columns
const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const ColumnTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #f8fafc;
  
  &::after {
    content: "";
    display: block;
    width: 40px;
    height: 2px;
    background: linear-gradient(to right, #3b82f6, #7c3aed);
    margin-top: 0.75rem;
    border-radius: 1px;
  }
`;

const FooterNavLink = styled(Link)`
  color: #cbd5e1;
  text-decoration: none;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    color: #f8fafc;
    transform: translateX(4px);
  }
`;

const ExternalLink = styled.a`
  color: #cbd5e1;
  text-decoration: none;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    color: #f8fafc;
    transform: translateX(4px);
  }
`;

const LinkIcon = styled.span`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
`;

// Contact Information
const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: #cbd5e1;
`;

const ContactIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
`;

const ContactText = styled.div`
  line-height: 1.6;
`;

// Social media section
const SocialLinks = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const SocialLink = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #f8fafc;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #3b82f6;
    transform: translateY(-3px);
  }
`;

// Bottom section with copyright and terms
const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: #94a3b8;
  font-size: 0.875rem;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
`;

const LegalLink = styled(Link)`
  color: #94a3b8;
  font-size: 0.875rem;
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: #f8fafc;
  }
`;

// Back to top button
const BackToTopButton = styled(motion.button)`
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #7c3aed);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4), 0 0 0 4px rgba(59, 130, 246, 0.1);
  z-index: 9999;
  transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
  opacity: 0.9;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(59, 130, 246, 0.5), 0 0 0 6px rgba(59, 130, 246, 0.15);
    opacity: 1;
  }

  @media (max-width: 768px) {
    right: 1.5rem;
    bottom: 1.5rem;
    width: 3rem;
    height: 3rem;
  }
`;

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [showButton, setShowButton] = useState(false);
  
  // Handle scroll to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Show button when user has scrolled down 300px
      setShowButton(scrollPosition > 300);
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Check initial scroll position
    handleScroll();
    
    // Clean up event listener
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <FooterContainer>
      <FooterPattern />
      
      <FooterContent>
        <AnimatePresence>
          {showButton && (
            <BackToTopButton 
              onClick={scrollToTop}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.9, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <ArrowUp size={24} />
            </BackToTopButton>
          )}
        </AnimatePresence>
        
        <FooterTop>
          <FooterBrand>
            <LogoContainer>
              <LogoIcon>
                <Ship size={24} />
              </LogoIcon>
              <LogoText>BookLuxYachts</LogoText>
            </LogoContainer>
            <BrandDescription>
              Discover the world&apos;s most exquisite yachts for your perfect getaway. 
              From intimate cruises to grand celebrations, find your dream yacht experience with us.
            </BrandDescription>
            <SocialLinks>
              <SocialLink 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
              >
                <Facebook size={18} />
              </SocialLink>
              <SocialLink 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
              >
                <Instagram size={18} />
              </SocialLink>
              <SocialLink 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
              >
                <Twitter size={18} />
              </SocialLink>
              <SocialLink 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
              >
                <Linkedin size={18} />
              </SocialLink>
              <SocialLink 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
              >
                <Youtube size={18} />
              </SocialLink>
            </SocialLinks>
          </FooterBrand>
          
          <Newsletter>
            <NewsletterHeading>Subscribe to Our Newsletter</NewsletterHeading>
            <NewsletterDescription>
              Stay updated with the latest yacht deals, exclusive offers, and travel inspiration.
            </NewsletterDescription>
            <SubscribeForm onSubmit={(e) => e.preventDefault()}>
              <EmailInput type="email" placeholder="Your email address" required />
              <SubscribeButton type="submit">Subscribe</SubscribeButton>
            </SubscribeForm>
          </Newsletter>
        </FooterTop>
        
        <FooterGrid>
          <FooterColumn>
            <ColumnTitle>Quick Links</ColumnTitle>
            <FooterNavLink to="/">
              <LinkIcon><ChevronRight size={16} /></LinkIcon>
              Home
            </FooterNavLink>
            <FooterNavLink to="/about">
              <LinkIcon><ChevronRight size={16} /></LinkIcon>
              About Us
            </FooterNavLink>
            <FooterNavLink to="/yachts">
              <LinkIcon><ChevronRight size={16} /></LinkIcon>
              Our Yachts
            </FooterNavLink>
            <FooterNavLink to="/destinations">
              <LinkIcon><ChevronRight size={16} /></LinkIcon>
              Destinations
            </FooterNavLink>
            <FooterNavLink to="/contact">
              <LinkIcon><ChevronRight size={16} /></LinkIcon>
              Contact Us
            </FooterNavLink>
          </FooterColumn>
          
          <FooterColumn>
            <ColumnTitle>Services</ColumnTitle>
            <FooterNavLink to="/luxury-charters">
              <LinkIcon><ChevronRight size={16} /></LinkIcon>
              Luxury Charters
            </FooterNavLink>
            <FooterNavLink to="/special-events">
              <LinkIcon><ChevronRight size={16} /></LinkIcon>
              Special Events
            </FooterNavLink>
            <FooterNavLink to="/corporate-events">
              <LinkIcon><ChevronRight size={16} /></LinkIcon>
              Corporate Events
            </FooterNavLink>
            <FooterNavLink to="/yacht-management">
              <LinkIcon><ChevronRight size={16} /></LinkIcon>
              Yacht Management
            </FooterNavLink>
            <FooterNavLink to="/concierge">
              <LinkIcon><ChevronRight size={16} /></LinkIcon>
              Concierge Service
            </FooterNavLink>
          </FooterColumn>
          
          <FooterColumn>
            <ColumnTitle>Support</ColumnTitle>
            <ExternalLink href="/faq">
              <LinkIcon><ChevronRight size={16} /></LinkIcon>
              FAQ
            </ExternalLink>
            <ExternalLink href="/booking-process">
              <LinkIcon><ChevronRight size={16} /></LinkIcon>
              Booking Process
            </ExternalLink>
            <ExternalLink href="/cancellation-policy">
              <LinkIcon><ChevronRight size={16} /></LinkIcon>
              Cancellation Policy
            </ExternalLink>
            <ExternalLink href="/payment-options">
              <LinkIcon><ChevronRight size={16} /></LinkIcon>
              Payment Options
            </ExternalLink>
            <ExternalLink href="/help-center">
              <LinkIcon><ChevronRight size={16} /></LinkIcon>
              Help Center
            </ExternalLink>
          </FooterColumn>
          
          <FooterColumn>
            <ColumnTitle>Contact Us</ColumnTitle>
            <ContactItem>
              <ContactIconWrapper>
                <MapPin size={16} />
              </ContactIconWrapper>
              <ContactText>
                123 Marina Bay, Miami, FL 33101, United States
              </ContactText>
            </ContactItem>
            <ContactItem>
              <ContactIconWrapper>
                <Phone size={16} />
              </ContactIconWrapper>
              <ContactText>
                +1 (800) 123-4567
              </ContactText>
            </ContactItem>
            <ContactItem>
              <ContactIconWrapper>
                <Mail size={16} />
              </ContactIconWrapper>
              <ContactText>
                info@bookluxuryyachts.com
              </ContactText>
            </ContactItem>
          </FooterColumn>
        </FooterGrid>
        
        <FooterBottom>
          <Copyright>
            © {currentYear} BookLuxYachts. All rights reserved.
          </Copyright>
          
          <LegalLinks>
            <LegalLink to="/privacy-policy">Privacy Policy</LegalLink>
            <LegalLink to="/terms-of-service">Terms of Service</LegalLink>
            <LegalLink to="/cookie-policy">Cookie Policy</LegalLink>
          </LegalLinks>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
}