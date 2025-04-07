import { useState, useEffect } from "react";
import { FaSearch, FaStar, FaRegStar, FaArrowDown, FaArrowUp, FaPlus, FaListAlt } from "react-icons/fa";
import { fetchFAQs } from "../../../../Redux/adminReducer.js/action";
import { useDispatch } from "react-redux";
// Sample FAQ data
const initialFaqs = [
  {
    id: 1,
    question: "How do I make a reservation?",
    answer: "You can make a reservation through our website by selecting your preferred yacht, date, and time. Alternatively, you can contact our customer service at (866) 218-6272 for assistance with your booking.",
    categoryId: 1,
    categoryName: "Booking & Reservation",
    status: "published",
    featured: true,
    order: 1,
    createdAt: "2023-10-15"
  },
  {
    id: 2,
    question: "What is the cancellation policy?",
    answer: "Cancellations made 7 days or more before the scheduled trip receive a full refund. Cancellations made 3-6 days prior receive a 50% refund. Cancellations within 48 hours of the scheduled trip are non-refundable. However, rescheduling is available subject to availability.",
    categoryId: 4,
    categoryName: "Cancellations & Refunds",
    status: "published",
    featured: true,
    order: 2,
    createdAt: "2023-10-16"
  },
  {
    id: 5,
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), as well as bank transfers. For certain high-value charters, we may also accept wire transfers. All payments are processed securely through our encrypted payment gateway.",
    categoryId: 3,
    categoryName: "Payment & Pricing",
    status: "published",
    featured: true,
    order: 3,
    createdAt: "2023-10-19"
  }
];

// Sample non-featured FAQs for the Add to Featured section
const nonFeaturedFaqs = [
  {
    id: 3,
    question: "How many people can the yacht accommodate?",
    answer: "Our yacht fleet has different capacities. Our smaller yachts accommodate 8-10 guests, mid-size yachts accommodate 12-20 guests, and our larger yachts can accommodate up to 30 guests. The specific capacity is listed on each yacht's detail page.",
    categoryId: 2,
    categoryName: "Yacht Specifications",
    status: "published",
    featured: false,
    order: 1,
    createdAt: "2023-10-17"
  },
  {
    id: 4,
    question: "Do you provide catering services?",
    answer: "Yes, we offer premium catering services for all yacht charters. You can select from our pre-designed menu packages or request a custom menu. Please inform us of any dietary restrictions, and our culinary team will accommodate them.",
    categoryId: 5,
    categoryName: "Onboard Services",
    status: "published",
    featured: false,
    order: 1,
    createdAt: "2023-10-18"
  }
];

  const FeaturedFaqsComponent = () => {
  const dispatch = useDispatch();
  const [featuredFaqs, setFeaturedFaqs] = useState([]);
  const [availableFaqs, setAvailableFaqs] = useState(nonFeaturedFaqs);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAvailableFaqs, setFilteredAvailableFaqs] = useState(nonFeaturedFaqs);
  const [isAddingSectionOpen, setIsAddingSectionOpen] = useState(false);
  
  // Filter available FAQs based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAvailableFaqs(availableFaqs);
    } else {
      const filtered = availableFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAvailableFaqs(filtered);
    }
  }, [searchTerm, availableFaqs]);
  
  // Listen for featured changes from other components
  useEffect(() => {
    const handleFeaturedToggle = (event) => {
      const { faqId, featured } = event.detail;
      if (featured) {
        // Find the FAQ in available FAQs
        const faqToAdd = availableFaqs.find(faq => faq.id === faqId);
        if (faqToAdd) {
          handleAddToFeatured(faqId);
        }
      } else {
        // Find the FAQ in featured FAQs
        const faqToRemove = featuredFaqs.find(faq => faq.id === faqId);
        if (faqToRemove) {
          handleRemoveFromFeatured(faqId);
        }
      }
    };
    
    window.addEventListener('faqFeaturedToggled', handleFeaturedToggle);
    
    return () => {
      window.removeEventListener('faqFeaturedToggled', handleFeaturedToggle);
    };
  }, [featuredFaqs, availableFaqs]);
  
  // 
  // 
    const fetchAllFaqs = async () => {
    try {
      const params = {
       
       
        featured: true,
      };

      // Add filters if set
      // if (categoryFilter && categoryFilter !== 'All') params.category = categoryFilter;
      // if (statusFilter) params.status = statusFilter;
      // if (featuredFilter === 'featured') params.featured = true;
      // if (featuredFilter === 'not-featured') params.featured = false;
      // if (searchTerm) params.search = searchTerm;

      const response = await dispatch(fetchFAQs(params));
            setFeaturedFaqs(response.faqs);
   

    } catch (error) {
      console.error('Error fetching filtered FAQs:', error);
    }
  };
  useEffect(() => {
    
  
    fetchAllFaqs(); 
      }, [dispatch]);
  // Reset filtersAdd to featured
  const handleAddToFeatured = (id) => {
    const faqToAdd = availableFaqs.find(faq => faq.id === id);
    if (faqToAdd) {
      // Add to featured with next order number
      const nextOrder = featuredFaqs.length > 0 
        ? Math.max(...featuredFaqs.map(faq => faq.order)) + 1 
        : 1;
      
      const updatedFaq = { ...faqToAdd, featured: true, order: nextOrder };
      
      setFeaturedFaqs([...featuredFaqs, updatedFaq]);
      setAvailableFaqs(availableFaqs.filter(faq => faq.id !== id));
      
      // Dispatch event for cross-component communication
      window.dispatchEvent(new CustomEvent('faqFeaturedToggled', {
        detail: { faqId: id, featured: true }
      }));
    }
  };
  
  // Remove from featured
  const handleRemoveFromFeatured = (id) => {
    const faqToRemove = featuredFaqs.find(faq => faq.id === id);
    if (faqToRemove) {
      const updatedFaq = { ...faqToRemove, featured: false, order: 1 };
      
      setAvailableFaqs([...availableFaqs, updatedFaq]);
      setFeaturedFaqs(featuredFaqs.filter(faq => faq.id !== id));
      
      // Re-order remaining featured FAQs
      const updatedFeaturedFaqs = featuredFaqs
        .filter(faq => faq.id !== id)
        .map((faq, index) => ({ ...faq, order: index + 1 }));
      
      setFeaturedFaqs(updatedFeaturedFaqs);
      
      // Dispatch event for cross-component communication
      window.dispatchEvent(new CustomEvent('faqFeaturedToggled', {
        detail: { faqId: id, featured: false }
      }));
    }
  };
  
  // Move FAQ up in order
  const handleMoveUp = (id) => {
    const index = featuredFaqs.findIndex(faq => faq.id === id);
    if (index > 0) {
      const updatedFaqs = [...featuredFaqs];
      
      // Swap orders
      const tempOrder = updatedFaqs[index].order;
      updatedFaqs[index].order = updatedFaqs[index - 1].order;
      updatedFaqs[index - 1].order = tempOrder;
      
      // Sort by order
      updatedFaqs.sort((a, b) => a.order - b.order);
      
      setFeaturedFaqs(updatedFaqs);
    }
  };
  
  // Move FAQ down in order
  const handleMoveDown = (id) => {
    const index = featuredFaqs.findIndex(faq => faq.id === id);
    if (index < featuredFaqs.length - 1) {
      const updatedFaqs = [...featuredFaqs];
      
      // Swap orders
      const tempOrder = updatedFaqs[index].order;
      updatedFaqs[index].order = updatedFaqs[index + 1].order;
      updatedFaqs[index + 1].order = tempOrder;
      
      // Sort by order
      updatedFaqs.sort((a, b) => a.order - b.order);
      
      setFeaturedFaqs(updatedFaqs);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md max-w-7xl mx-auto overflow-hidden border border-gray-100 p-4 sm:p-6">
      {/* Header section with title and description */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200 -mx-6 -mt-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Featured FAQs</h3>
        <p className="text-gray-600 text-sm mb-4">Manage FAQs that appear in featured sections on the website</p>
        
        {/* Stats card */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Featured FAQ Count</p>
              <p className="text-2xl font-bold text-gray-900">{featuredFaqs.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaStar className="text-blue-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured FAQs List */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-medium text-gray-800">Current Featured FAQs</h4>
          {featuredFaqs.length > 0 && (
            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              Showing {featuredFaqs.length} Featured FAQs
            </span>
          )}
        </div>
        
        {featuredFaqs.length > 0 ? (
          <div className="space-y-4">
            {featuredFaqs.map((faq, index) => (
              <div 
                key={faq._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-3">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-800 font-semibold rounded-full mr-3">
                      {faq.order}
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {faq.categoryName}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleMoveUp(faq._id)}
                      disabled={index === 0}
                      className={`p-1.5 rounded ${
                        index === 0 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-blue-600 hover:bg-blue-50 hover:text-blue-800'
                      }`}
                      title="Move Up"
                    >
                      <FaArrowUp size={14} />
                    </button>
                    
                    <button
                      onClick={() => handleMoveDown(faq._id)}
                      disabled={index === featuredFaqs.length - 1}
                      className={`p-1.5 rounded ${
                        index === featuredFaqs.length - 1 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-blue-600 hover:bg-blue-50 hover:text-blue-800'
                      }`}
                      title="Move Down"
                    >
                      <FaArrowDown size={14} />
                    </button>
                    
                    <button
                      onClick={() => handleRemoveFromFeatured(faq._id)}
                      className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50"
                      title="Remove from Featured"
                    >
                      <FaRegStar size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <h5 className="text-lg font-medium text-gray-900 mb-2">
                    {faq.question}
                  </h5>
                  <p className="text-gray-600">
                    {faq.answer.length > 150 
                      ? `${faq.answer.substring(0, 150)}...` 
                      : faq.answer
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex flex-col items-center justify-center">
              <div className="p-4 bg-blue-50 rounded-full mb-4">
                <FaRegStar className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Featured FAQs</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                Add FAQs to this section to make them appear in the featured areas on the website.
                Featured FAQs will be displayed prominently to help users find key information quickly.
              </p>
              <button 
                onClick={() => setIsAddingSectionOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaPlus className="-ml-1 mr-2 h-4 w-4" />
                Add Your First Featured FAQ
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Add to Featured section */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-lg font-medium text-gray-800">Add to Featured</h4>
            <p className="text-sm text-gray-500 mt-1">
              Select FAQs from below to add them to your featured section
            </p>
          </div>
          <button
            onClick={() => setIsAddingSectionOpen(!isAddingSectionOpen)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isAddingSectionOpen ? 'Hide FAQs' : 'Show Available FAQs'}
          </button>
        </div>
        
        {isAddingSectionOpen && (
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-gray-700">Available FAQs</h5>
                
                <div className="relative w-64">
                  <input
                    type="text"
                    placeholder="Search available FAQs..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="p-4">
              {filteredAvailableFaqs.length > 0 ? (
                <div className="space-y-4">
                  {filteredAvailableFaqs.map((faq) => (
                    <div 
                      key={faq._id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="mb-1 flex items-center">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mr-2">
                              {faq.categoryName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(faq.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h5 className="text-md font-medium text-gray-900 mb-2">
                            {faq.question}
                          </h5>
                          <p className="text-sm text-gray-600">
                            {faq.answer.length > 120 
                              ? `${faq.answer.substring(0, 120)}...` 
                              : faq.answer
                            }
                          </p>
                        </div>
                        
                        <button
                          onClick={() => handleAddToFeatured(faq._id)}
                          className="ml-4 flex-shrink-0 text-gray-400 hover:text-yellow-500 p-2 rounded-full hover:bg-yellow-50 transition-colors"
                          title="Add to Featured"
                        >
                          <FaStar size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <FaListAlt className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                  <h5 className="text-base font-medium text-gray-700 mb-1">No FAQs Available</h5>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    {searchTerm 
                      ? "No FAQs match your search criteria. Try a different search term." 
                      : "All available FAQs are already featured or there are no FAQs to feature."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedFaqsComponent; 