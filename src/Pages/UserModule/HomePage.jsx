import React, { Suspense, lazy, useState } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../../components/UserModule/HomeComponents/HeroSection';
// import Footer from '../../components/UserModule/Footer';
import PropTypes from 'prop-types';
// Lazy load components to improve initial loading performance
const YachtListings = lazy(() => import('../../components/UserModule/HomeComponents/YachtListings'));
const Adventures = lazy(() => import('../../components/UserModule/HomeComponents/AdventuresNew'));
const Testimonials = lazy(() => import('../../components/UserModule/HomeComponents/Testimonials'));
const FAQ = lazy(() => import('../../components/UserModule/HomeComponents/FAQ'));
const BusinessFeatures = lazy(() => import('../../components/UserModule/HomeComponents/BusinessFeatures'));
const BusinessGrowth = lazy(() => import('../../components/UserModule/HomeComponents/BusinessGrowth'));
const ContactUs = lazy(() => import('../../components/UserModule/HomeComponents/ContactUs'));

// Error Boundary Component to catch runtime errors
function ErrorBoundary({ children, fallback }) {
  const [hasError, setHasError] = useState(false);
  
  // Reset error state when children change
  React.useEffect(() => {
    setHasError(false);
  }, [children]);
  
  // If there's an error, show the fallback UI
  if (hasError) {
    return fallback || (
      <div className="p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
        <p className="mb-4 text-gray-600">This section couldn&apos;t be loaded</p>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => setHasError(false)}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  // Otherwise, render the children
  return (
    <React.Fragment>
      {React.cloneElement(children, {
        onError: () => setHasError(true)
      })}
    </React.Fragment>
  );
}

// PropTypes for ErrorBoundary
ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node
};

// Loading fallback component
const LoadingFallback = () => (
  <div className="w-full p-12 flex justify-center items-center">
    <div className="animate-pulse flex flex-col items-center">
      <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 w-32 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Animation variants for staggered children animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const HomePage = () => {
  return (
    <motion.div
      className="flex flex-col min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section with background video */}
      {/* <motion.section 
        variants={sectionVariants} 
        className="relative z-10"
      > */}
         <ErrorBoundary>
          <HeroSection  />
        </ErrorBoundary>
      {/* </motion.section> */}
      {/* Yacht Listings Section - Added margin-top for SearchFilters overlay */}
      <motion.section 
        variants={sectionVariants} 
        className="relative z-20 bg-gradient-to-b from-slate-50 to-slate-100"
        style={{
          marginTop: "-2rem", // Negative margin to properly overlap with hero section
          paddingTop: "6rem"  // Add padding to compensate for the negative margin
        }}
      >
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <YachtListings />
          </Suspense>
        </ErrorBoundary>
      </motion.section>

      {/* Adventures Section */}
      <motion.section 
        variants={sectionVariants} 
        className="relative z-20"
      >
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <Adventures />
          </Suspense>
        </ErrorBoundary>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        variants={sectionVariants}
        className="relative z-20"
      >
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
        <Testimonials />
          </Suspense>
        </ErrorBoundary>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        variants={sectionVariants}
        className="relative z-20 bg-gradient-to-b from-[#f1f5f9] to-[#f8fafc] p-6"
      >
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
        <FAQ />
          </Suspense>
        </ErrorBoundary>
      </motion.section>

      {/* Business Features Section - New */}
      <motion.section 
        variants={sectionVariants}
        className="relative z-20"
      >
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <BusinessFeatures />
          </Suspense>
        </ErrorBoundary>
      </motion.section>

      {/* Business Growth Section */}
      <motion.section 
        variants={sectionVariants}
        className="relative z-20 bg-gradient-to-b from-[#f1f5f9] to-[#f8fafc] flex justify-center items-center"
      >
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <BusinessGrowth />
          </Suspense>
        </ErrorBoundary>
      </motion.section>

      {/* Contact Us Section */}
      <motion.section 
        variants={sectionVariants}
        className="relative z-20"
      >
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
        <ContactUs />
          </Suspense>
        </ErrorBoundary>
      </motion.section>

     
    </motion.div>
  );
};

export default HomePage;
