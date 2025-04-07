import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';
import { BorderBeam } from "../../LibComponents/magicui/border-beam";
import { Input } from "../../LibComponents/ui/input";
import { fetchFAQCategories, fetchFAQs } from '../../../Redux/adminReducer.js/action';
import { useDispatch } from 'react-redux';    

// Section Container
const FAQSection = styled.section`
  // padding: 6rem 0;
  // padding-bottom: 6rem;
  // background: linear-gradient(to bottom, #f1f5f9, #f8fafc);
  position: relative;
  overflow: hidden;
`;

// Background Elements
const BackgroundPattern = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  // background-image: radial-gradient(rgba(99, 102, 241, 0.03) 2px, transparent 0);
  background-size: 30px 30px;
  pointer-events: none;
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
  // display: flex;
  flex-direction: column;
  align-items: flex-start;
  // width: 100%;
  // padding: 0 1rem;
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
  margin: 1.5rem 0 1.5rem;
  line-height: 1.6;
  padding: 0;
`;

// Search Bar
const SearchContainer = styled.div`
  max-width: 500px;
  margin: 0 auto 3rem;
  position: relative;
`;

const SearchInput = styled(Input)`
  padding-left: 3rem;
  height: 3.5rem;
  border-radius: 9999px;
  border: 1px solid #e2e8f0;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:focus {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(59, 130, 246, 0.1);
    border-color: #3b82f6;
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 1.25rem;
  transform: translateY(-50%);
  color: #94a3b8;
`;

// FAQ Container
const FAQContainer = styled.div`
 display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 0 auto;
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(229, 231, 235, 0.5);
`;

// Category Tabs
const CategoriesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
  justify-content: center;
`;

const CategoryTab = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.active ? '#3b82f6' : 'white'};
  color: ${props => props.active ? 'white' : '#64748b'};
  border: 1px solid ${props => props.active ? '#3b82f6' : '#e2e8f0'};
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 4px 12px rgba(59, 130, 246, 0.25)' : 'none'};
  
  &:hover {
    background-color: ${props => props.active ? '#2563eb' : '#f8fafc'};
    transform: translateY(-2px);
  }
`;

// FAQ Item
const FAQItem = styled(motion.div)`
  border-radius: 1rem;
  overflow: hidden;
  background: ${props => props.isOpen ? 'rgba(243, 244, 246, 0.6)' : 'white'};
  border: 1px solid ${props => props.isOpen ? 'rgba(59, 130, 246, 0.1)' : 'rgba(229, 231, 235, 0.5)'};
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.isOpen ? 'rgba(59, 130, 246, 0.2)' : 'rgba(203, 213, 225, 0.8)'};
    box-shadow: ${props => props.isOpen ? '0 8px 20px rgba(0, 0, 0, 0.05)' : '0 4px 12px rgba(0, 0, 0, 0.03)'};
  }
`;

const FAQQuestion = styled.button`
  width: 100%;
  background-color: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 1.5rem;
  cursor: pointer;
  color: ${props => props.isOpen ? '#1e3a8a' : '#334155'};
  transition: all 0.3s ease;
`;

const QuestionText = styled.span`
  flex: 1;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background-color: ${props => props.isOpen ? '#3b82f6' : '#f1f5f9'};
  color: ${props => props.isOpen ? 'white' : '#64748b'};
  transition: all 0.3s ease;
  margin-left: 1rem;
  flex-shrink: 0;
`;

const FAQAnswer = styled(motion.div)`
  padding: 0 1.5rem 1.5rem;
  color: #64748b;
  line-height: 1.7;
  font-size: 1rem;
`;

// Additional Help Section
const AdditionalHelp = styled.div`
  margin-top: 3rem;
  text-align: center;
  // background: linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(124, 58, 237, 0.1));
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03);
`;

const HelpTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 1rem;
`;

const HelpText = styled.p`
  color: #64748b;
  margin-bottom: 1.5rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const ContactButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(to right, #3b82f6, #7c3aed);
  color: white;
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  text-decoration: none;
  box-shadow: 0 10px 15px rgba(59, 130, 246, 0.25);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 25px rgba(59, 130, 246, 0.3);
  }
`;

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
    transition: { duration: 0.6 }
  }
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [categories,setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(1);
  const dispatch = useDispatch();
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  // Categories
  const ShortCategories = ['All', 'Booking', 'Yachts', 'Payment', 'Safety'];

 
  const getAllFAQCategories = async () => {
    try {
      const data = await dispatch(fetchFAQCategories());
      data.categories.unshift({ name: 'All', _id: 1 }); 
      setCategories([...data.categories]); // Use spread operator to force re-render
    } catch (error) {
      console.error("Error fetching FAQ categories:", error);
    }
  };

  // Fetch FAQs
  const getFAQs = async (categoryId = 1) => {
    try {
      const params = { featured: true };
      if (categoryId !== 1) params.category = categoryId;
      if (searchQuery) params.search = searchQuery;

      const data = await dispatch(fetchFAQs(params)); 
      
      console.log("Fetched FAQs:", data.faqs); // Check if data is being fetched correctly
      
      setFaqs([...data.faqs]); // Spread operator ensures React re-renders
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

  useEffect(() => {
    getAllFAQCategories();
  }, []);
  // Fetch FAQ data
useEffect(() => {
  getFAQs(selectedCategory);
}, [selectedCategory,searchQuery]);
 
  
  // Filter FAQs based on search and category
  // useEffect(() => {
  //   let result = [...faqData];
    
  //   // Filter by search query
  //   if (searchQuery) {
  //     const query = searchQuery.toLowerCase();
  //     result = result.filter(
  //       faq => 
  //         faq.question.toLowerCase().includes(query) || 
  //         faq.answer.toLowerCase().includes(query)
  //     );
  //   }
    
  //   // Filter by category
  //   if (selectedCategory !== 'All') {
  //     result = result.filter(faq => faq.category === selectedCategory);
  //   }
    
  //   setFilteredFaqs(result);
  // }, [searchQuery, selectedCategory, faqData]);
  
  // Start animations when in view
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);
  
  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle category selection
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);


  };

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

 console.log(faqs)  

  return (
    <FAQSection ref={ref}>
      <BackgroundPattern />
      <Container>
        <SectionHeader>
          <Title
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            Frequently Asked Questions
          </Title>
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
            }}
          >
            Find answers to common questions about our yacht rental services, booking process, and more
          </Subtitle>
          
          <SearchContainer>
            <SearchIconWrapper>
              <Search size={20} />
            </SearchIconWrapper>
            <SearchInput 
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </SearchContainer>
          
          <CategoriesContainer>
            {categories.map((category, index) => (
              <CategoryTab
                key={category._id}
                active={selectedCategory === category._id}
                onClick={() => handleCategoryChange(category._id)}
              >
                {category.name}
              </CategoryTab>
            ))}
          </CategoriesContainer>
        </SectionHeader>
        
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
   <FAQContainer key={selectedCategory}> {/* Adding key here to force re-render */}
  {faqs.length > 0 ? (
    faqs.map((faq, index) => (
      <FAQItem 
        key={faq._id || index}
        isOpen={openIndex === index}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        layout
      >
        <FAQQuestion
          onClick={() => handleToggle(index)}
          isOpen={openIndex === index}
          aria-expanded={openIndex === index}
        >
          <QuestionText>{faq.question}</QuestionText>
          <IconContainer isOpen={openIndex === index}>
            {openIndex === index ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </IconContainer>
        </FAQQuestion>
        <AnimatePresence>
          {openIndex === index && (
            <FAQAnswer
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {faq.answer}
            </FAQAnswer>
          )}
        </AnimatePresence>
      </FAQItem>
    ))
  ) : (
    <motion.div
    initial="hidden"
    animate="visible"
    variants={itemVariants}
      style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}
    >
      <HelpCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
      <h3 style={{ marginBottom: '0.5rem', color: '#334155' }}>No results found</h3>
      <p>Try adjusting your search or category selection</p>
    </motion.div>
  )}
</FAQContainer>

        </motion.div>
        
        {/* <AdditionalHelp>
          <HelpTitle>Still have questions?</HelpTitle>
          <HelpText>
            If you couldn&apos;t find the answer to your question, our team is ready to help you.
          </HelpText>
          <ContactButton 
            href="/contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Contact Us
          </ContactButton>
        </AdditionalHelp> */}
      </Container>
    </FAQSection>
  );
}
