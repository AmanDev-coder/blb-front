import React, { useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import styled from "styled-components";

// Styled components for the Privacy Policy page
const PolicySection = styled(motion.section)`
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const PolicyList = styled.ul`
  list-style-type: disc;
  margin-left: 1.5rem;
  margin-bottom: 1.5rem;
  
  li {
    margin-bottom: 0.75rem;
    color: #4a5568;
  }
`;

const PrivacyPolicy = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const controls = useAnimation();
  
  React.useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  const effectiveDate = "April 01, 2023";
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pt-24 pb-16 relative overflow-hidden" ref={ref}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute w-[500px] h-[500px] -top-32 -left-64 rounded-full bg-gradient-to-r from-blue-400/10 to-purple-500/10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
        />
        <motion.div 
          className="absolute w-[400px] h-[400px] -bottom-32 -right-32 rounded-full bg-gradient-to-r from-blue-400/10 to-purple-500/10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />
      </div>
      
      {/* Privacy Policy Header */}
      <div className="max-w-[90%] mx-auto mb-12 relative z-10">
        <motion.h1
          className="text-4xl md:text-5xl py-2 font-extrabold bg-gradient-to-r from-blue-900 to-purple-700 bg-clip-text text-transparent inline-block mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
        >
          Privacy Policy
        </motion.h1>
        
        <motion.div 
          className="h-[3px] w-20 bg-gradient-to-r from-blue-800 to-blue-500 rounded-md mt-2"
          initial={{ width: "0px" }}
          animate={{ width: "80px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        
        <motion.p
          className="text-lg text-slate-600 max-w-3xl mt-6 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
          }}
        >
          At Book Luxury Yachts, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website and services.
        </motion.p>
        
        <motion.p
          className="text-slate-500 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.3 } }
          }}
        >
          Last updated: {effectiveDate}
        </motion.p>
      </div>
      
      <div className="max-w-[90%] mx-auto relative z-1">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Information We Collect */}
          <PolicySection variants={itemVariants}>
            <h2 className="text-2xl font-bold text-blue-900 mb-6">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-blue-800 mb-3">1.1 Personal Information</h3>
            <p className="text-slate-600 mb-4">
              We may collect the following personal information when you use our services, create an account, or make a booking:
            </p>
            <PolicyList>
              <li>Name, email address, phone number, and contact details</li>
              <li>Billing and payment information</li>
              <li>Identification documents required for yacht rentals</li>
              <li>Travel preferences and booking history</li>
              <li>Communication history with our customer service team</li>
              <li>User-generated content such as reviews and feedback</li>
            </PolicyList>
            
            <h3 className="text-xl font-semibold text-blue-800 mb-3">1.2 Automatically Collected Information</h3>
            <p className="text-slate-600 mb-4">
              When you visit our website, we automatically collect certain information about your device and usage, including:
            </p>
            <PolicyList>
              <li>IP address and device information</li>
              <li>Browser type and operating system</li>
              <li>Browsing patterns and interaction with our website</li>
              <li>Referring websites and search terms</li>
              <li>Location information (with your consent)</li>
              <li>Cookies and similar tracking technologies</li>
            </PolicyList>
          </PolicySection>
          
          {/* How We Use Your Information */}
          <PolicySection variants={itemVariants}>
            <h2 className="text-2xl font-bold text-blue-900 mb-6">2. How We Use Your Information</h2>
            
            <p className="text-slate-600 mb-4">
              We use the collected information for various purposes, including but not limited to:
            </p>
            <PolicyList>
              <li>Facilitating and managing yacht bookings and reservations</li>
              <li>Processing payments and maintaining financial records</li>
              <li>Providing customer support and responding to inquiries</li>
              <li>Improving our website, services, and user experience</li>
              <li>Sending relevant notifications, updates, and marketing communications (subject to your preferences)</li>
              <li>Analyzing usage patterns and conducting research to enhance our offerings</li>
              <li>Ensuring compliance with legal obligations and industry standards</li>
              <li>Preventing fraud and ensuring the security of our platform</li>
            </PolicyList>
          </PolicySection>
          
          {/* Data Sharing and Disclosure */}
          <PolicySection variants={itemVariants}>
            <h2 className="text-2xl font-bold text-blue-900 mb-6">3. Data Sharing and Disclosure</h2>
            
            <p className="text-slate-600 mb-4">
              We may share your information with the following parties:
            </p>
            <PolicyList>
              <li>Yacht owners and operators necessary to fulfill your booking requests</li>
              <li>Payment processors and financial institutions to facilitate transactions</li>
              <li>Service providers who assist us in operating our website and business</li>
              <li>Legal authorities when required by law or to protect our rights</li>
              <li>Business partners with your explicit consent</li>
              <li>Potential acquirers in the event of a merger, acquisition, or sale of assets</li>
            </PolicyList>
            
            <p className="text-slate-600 mt-4">
              We do not sell your personal information to third parties. Any third-party service providers we work with are bound by contractual obligations to keep your information confidential and secure.
            </p>
          </PolicySection>
          
          {/* Your Rights and Choices */}
          <PolicySection variants={itemVariants}>
            <h2 className="text-2xl font-bold text-blue-900 mb-6">4. Your Rights and Choices</h2>
            
            <p className="text-slate-600 mb-4">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <PolicyList>
              <li>Access and receive a copy of your personal information</li>
              <li>Rectify inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to or restrict the processing of your data</li>
              <li>Data portability (receiving your data in a structured, machine-readable format)</li>
              <li>Withdraw consent at any time (where processing is based on consent)</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </PolicyList>
            
            <p className="text-slate-600 mt-4">
              To exercise these rights, please contact us using the information provided in the "Contact Us" section below. We will respond to your request within the timeframe required by applicable law.
            </p>
          </PolicySection>
          
          {/* Data Security */}
          <PolicySection variants={itemVariants}>
            <h2 className="text-2xl font-bold text-blue-900 mb-6">5. Data Security</h2>
            
            <p className="text-slate-600 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, loss, misuse, or alteration. These measures include:
            </p>
            <PolicyList>
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Secure network infrastructure with firewalls and intrusion detection</li>
              <li>Regular security assessments and vulnerability testing</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Employee training on data protection and privacy</li>
              <li>Incident response procedures for potential data breaches</li>
            </PolicyList>
            
            <p className="text-slate-600 mt-4">
              While we strive to protect your information, no method of transmission over the Internet or electronic storage is 100% secure. We encourage you to use strong passwords and be cautious about the information you share online.
            </p>
          </PolicySection>
          
          {/* Cookies and Tracking Technologies */}
          <PolicySection variants={itemVariants}>
            <h2 className="text-2xl font-bold text-blue-900 mb-6">6. Cookies and Tracking Technologies</h2>
            
            <p className="text-slate-600 mb-4">
              Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. These technologies may collect information about your online activities over time and across different websites.
            </p>
            
            <p className="text-slate-600 mb-4">
              You can manage your cookie preferences through your browser settings, including blocking or deleting cookies. However, disabling certain cookies may limit your ability to use some features of our website.
            </p>
            
            <p className="text-slate-600 mb-4">
              For more detailed information about the cookies we use, please refer to our Cookie Policy.
            </p>
          </PolicySection>
          
          {/* Children's Privacy */}
          <PolicySection variants={itemVariants}>
            <h2 className="text-2xl font-bold text-blue-900 mb-6">7. Children's Privacy</h2>
            
            <p className="text-slate-600 mb-4">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately, and we will take steps to delete the information.
            </p>
          </PolicySection>
          
          {/* International Data Transfers */}
          <PolicySection variants={itemVariants}>
            <h2 className="text-2xl font-bold text-blue-900 mb-6">8. International Data Transfers</h2>
            
            <p className="text-slate-600 mb-4">
              We operate globally and may transfer your information to countries with different data protection laws than your country of residence. When we transfer personal information across borders, we implement appropriate safeguards to ensure your data is protected in compliance with applicable laws.
            </p>
            
            <p className="text-slate-600 mb-4">
              These safeguards may include data transfer agreements incorporating standard contractual clauses approved by regulatory authorities, ensuring an adequate level of protection for your personal information.
            </p>
          </PolicySection>
          
          {/* Changes to This Policy */}
          <PolicySection variants={itemVariants}>
            <h2 className="text-2xl font-bold text-blue-900 mb-6">9. Changes to This Policy</h2>
            
            <p className="text-slate-600 mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices, services, or applicable laws. We will notify you of any material changes by posting the updated policy on our website and, where required by law, seeking your consent.
            </p>
            
            <p className="text-slate-600 mb-4">
              We encourage you to review this policy periodically to stay informed about how we protect your information.
            </p>
          </PolicySection>
          
          {/* Contact Us */}
          <PolicySection variants={itemVariants}>
            <h2 className="text-2xl font-bold text-blue-900 mb-6">10. Contact Us</h2>
            
            <p className="text-slate-600 mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Data Protection Officer at:
            </p>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-4">
              <p className="text-blue-800 font-medium mb-1">Book Luxury Yachts</p>
              <p className="text-slate-600">123 Marina Boulevard</p>
              <p className="text-slate-600">Miami, FL 33101</p>
              <p className="text-slate-600">United States</p>
              <p className="text-slate-600 mt-3">Email: privacy@bookluxuryyachts.com</p>
              <p className="text-slate-600">Phone: +1 (305) 555-0123</p>
            </div>
            
            <p className="text-slate-600">
              We will respond to your inquiry as soon as possible and within the timeframe specified by applicable law.
            </p>
          </PolicySection>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 