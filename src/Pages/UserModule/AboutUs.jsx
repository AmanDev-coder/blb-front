import React, { useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import styled from "styled-components";

// Styled components for the About Us page
const TeamMemberCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  }
  
  img {
    width: 100%;
    height: 280px;
    object-fit: cover;
  }
`;

const ValueCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  height: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-top: 4px solid #3b82f6;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  }
  
  .icon {
    width: 60px;
    height: 60px;
    background: #f0f7ff;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
  }
`;

const AboutSection = styled(motion.section)`
  padding: 5rem 0;
`;

const AboutUs = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
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
        staggerChildren: 0.2
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
      
      {/* Hero Section */}
      <div className="max-w-[90%] mx-auto mb-12 relative z-10">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold py-2 bg-gradient-to-r from-blue-900 to-purple-700 bg-clip-text text-transparent inline-block mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
        >
          About Book Luxury Yachts
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
          We're on a mission to make luxury yacht experiences accessible to everyone. With our curated fleet of world-class vessels and exceptional service, we create unforgettable maritime adventures.
        </motion.p>
      </div>
      
      {/* Our Story Section */}
      <AboutSection
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="max-w-[90%] mx-auto relative z-10"
      >
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <motion.div className="md:w-1/2" variants={itemVariants}>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Our Story</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Founded in 2019, Book Luxury Yachts began with a simple vision - to transform how people experience the ocean. Our founders, marine enthusiasts with decades of experience in hospitality and nautical industries, recognized a gap in the market for accessible luxury yacht rentals.
            </p>
            <p className="text-slate-600 mb-4 leading-relaxed">
              What started as a small fleet of five premium yachts in Miami has quickly expanded to multiple locations across the globe. Today, we're proud to offer over 200 meticulously maintained vessels, each representing the pinnacle of maritime luxury and performance.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We've partnered with the most respected yacht owners, captains, and maritime professionals to ensure that every journey with Book Luxury Yachts exceeds expectations and creates memories that last a lifetime.
            </p>
          </motion.div>
          
          <motion.div className="md:w-1/2 relative" variants={itemVariants}>
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1599071867399-01c7873e209e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Luxury yacht on the ocean" 
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-blue-100/50 rounded-full filter blur-3xl"></div>
          </motion.div>
        </div>
      </AboutSection>
      
      {/* Our Values Section */}
      <AboutSection
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="max-w-[90%] mx-auto relative z-10 pt-16"
      >
        <motion.h2 
          className="text-3xl font-bold text-blue-900 mb-12 text-center"
          variants={itemVariants}
        >
          Our Core Values
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ValueCard variants={itemVariants}>
            <div className="icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-blue-900 mb-3">Customer Delight</h3>
            <p className="text-slate-600">
              We go beyond satisfaction to create delightful experiences that exceed expectations at every touchpoint. Our customers' joy is our ultimate measure of success.
            </p>
          </ValueCard>
          
          <ValueCard variants={itemVariants}>
            <div className="icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="m14.31 8-5.34 5.34M8.97 8h5.34v5.34" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-blue-900 mb-3">Innovation</h3>
            <p className="text-slate-600">
              We constantly reimagine the yachting experience, leveraging technology and creativity to make luxury boating more accessible, enjoyable, and sustainable.
            </p>
          </ValueCard>
          
          <ValueCard variants={itemVariants}>
            <div className="icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-blue-900 mb-3">Safety</h3>
            <p className="text-slate-600">
              Safety underpins everything we do. We maintain rigorous standards for our fleet and crew, ensuring peace of mind so our guests can focus on enjoying their journey.
            </p>
          </ValueCard>
        </div>
      </AboutSection>
      
      {/* Our Team Section */}
      <AboutSection
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="max-w-[90%] mx-auto relative z-10 pt-16"
      >
        <motion.h2 
          className="text-3xl font-bold text-blue-900 mb-12 text-center"
          variants={itemVariants}
        >
          Meet Our Team
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <TeamMemberCard variants={itemVariants}>
            <img 
              src="https://images.unsplash.com/photo-1629425733761-caae3b5f2e50?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
              alt="CEO"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-blue-900">Michael Stevens</h3>
              <p className="text-blue-500 font-medium mb-3">CEO & Founder</p>
              <p className="text-slate-600 text-sm">
                Former captain with 15+ years of experience in luxury maritime services.
              </p>
            </div>
          </TeamMemberCard>
          
          <TeamMemberCard variants={itemVariants}>
            <img 
              src="https://images.unsplash.com/photo-1525072124541-6237cc05f4f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
              alt="COO"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-blue-900">Sarah Johnson</h3>
              <p className="text-blue-500 font-medium mb-3">Chief Operations Officer</p>
              <p className="text-slate-600 text-sm">
                Hospitality expert passionate about creating seamless customer experiences.
              </p>
            </div>
          </TeamMemberCard>
          
          <TeamMemberCard variants={itemVariants}>
            <img 
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
              alt="CTO"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-blue-900">David Rodriguez</h3>
              <p className="text-blue-500 font-medium mb-3">Chief Technology Officer</p>
              <p className="text-slate-600 text-sm">
                Tech visionary implementing innovative booking solutions for our platform.
              </p>
            </div>
          </TeamMemberCard>
          
          <TeamMemberCard variants={itemVariants}>
            <img 
              src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" 
              alt="CCO"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-blue-900">Emily Chen</h3>
              <p className="text-blue-500 font-medium mb-3">Chief Customer Officer</p>
              <p className="text-slate-600 text-sm">
                Dedicated to elevating the customer journey from inquiry to voyage.
              </p>
            </div>
          </TeamMemberCard>
        </div>
      </AboutSection>
      
      {/* Call to Action */}
      <AboutSection
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="max-w-[90%] mx-auto relative z-10 pt-16"
      >
        <motion.div 
          className="bg-white rounded-2xl p-12 text-center shadow-xl"
          variants={itemVariants}
        >
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Ready to Experience Luxury at Sea?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers who have discovered the ultimate yachting experience with Book Luxury Yachts.
          </p>
          <button 
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            onClick={() => window.location.href = '/yacht-rentals'}
          >
            Explore Our Fleet
          </button>
        </motion.div>
      </AboutSection>
    </div>
  );
};

export default AboutUs; 