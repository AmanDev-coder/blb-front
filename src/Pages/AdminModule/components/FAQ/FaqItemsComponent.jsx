import  { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaEye, FaCheck, FaBan, FaSave, FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { fetchFAQCategories, fetchFAQs, updateFAQ } from "../../../../Redux/adminReducer.js/action";
import { useCallback } from "react";
import { debounce } from "lodash";

// Sample FAQ items data
const initialFaqItems = [
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
    order: 1,
    createdAt: "2023-10-16"
  },
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
    order: 2,
    createdAt: "2023-10-18"
  },
  {
    id: 5,
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), as well as bank transfers. For certain high-value charters, we may also accept wire transfers. All payments are processed securely through our encrypted payment gateway.",
    categoryId: 3,
    categoryName: "Payment & Pricing",
    status: "published",
    featured: true,
    order: 1,
    createdAt: "2023-10-19"
  },
  {
    id: 6,
    question: "Is a captain included with the yacht rental?",
    answer: "Yes, all our yacht rentals include a licensed captain. The captain is responsible for navigating the yacht and ensuring the safety of all passengers. For luxury yachts over 80 feet, we also provide additional crew members.",
    categoryId: 2,
    categoryName: "Yacht Specifications",
    status: "draft",
    featured: false,
    order: 2,
    createdAt: "2023-10-20"
  }
];

// Sample FAQ categories for the filter/dropdown
// const faqCategories = [
//   { id: 1, name: "Booking & Reservation" },
//   { id: 2, name: "Yacht Specifications" },
//   { id: 3, name: "Payment & Pricing" },
//   { id: 4, name: "Cancellations & Refunds" },
//   { id: 5, name: "Onboard Services" }
// ];

const FaqItemsComponent = () => {
  const [faqs, setFaqs] = useState([]);
  const [filteredItems, setFilteredItems] = useState(initialFaqItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "order", direction: "asc" });
  const [filterVisible, setFilterVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFaqs, setTotalFaqs] = useState(0);
  const [faqCategories, setFaqCategories] = useState([]);
  // Handle search and filter
  // useEffect(() => {
  //   const filtered = faqItems.filter(item => {
  //     const matchesSearch = 
  //       item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       item.answer.toLowerCase().includes(searchTerm.toLowerCase());
      
  //     const matchesCategory = 
  //       categoryFilter === "" || item.categoryId.toString() === categoryFilter;
      
  //     const matchesStatus = 
  //       statusFilter === "" || item.status === statusFilter;
      
  //     const matchesFeatured = 
  //       featuredFilter === "" || 
  //       (featuredFilter === "featured" && item.featured) || 
  //       (featuredFilter === "not-featured" && !item.featured);
      
  //     return matchesSearch && matchesCategory && matchesStatus && matchesFeatured;
  //   });
    
  //   setFilteredItems(filtered);
  // }, [searchTerm, categoryFilter, statusFilter, featuredFilter, faqItems]);
  
  // // Handle sorting
  // useEffect(() => {
  //   let sortedItems = [...filteredItems];
  //   sortedItems.sort((a, b) => {
  //     if (a[sortConfig.key] < b[sortConfig.key]) {
  //       return sortConfig.direction === 'asc' ? -1 : 1;
  //     }
  //     if (a[sortConfig.key] > b[sortConfig.key]) {
  //       return sortConfig.direction === 'asc' ? 1 : -1;
  //     }
  //     return 0;
  //   });
    
  //   setFilteredItems(sortedItems);
  // }, [sortConfig]);
  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await dispatch(fetchFAQCategories());
        setFaqCategories(response.categories);
      } catch (error) {
        console.error('Error fetching FAQ categories:', error);
      }
    };

    fetchCategories();
  }, [dispatch]);


  const debouncedSearchTerm = useCallback(

    debounce((term) => {
      setSearchTerm(term);
      setCurrentPage(1); // Reset to first page when searching
    }, 500),
    []
  );

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
   setSearchTerm(value);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearchTerm.cancel();
    };
  }, [debouncedSearchTerm]);
  const fetchAllFaqs = async () => {
    try {
      const params = {
        page: currentPage,
        limit:50,
        sort: `${sortConfig.key}`,
        order: `${sortConfig.direction}`,
      };

      // Add filters if set
      if (categoryFilter && categoryFilter !== 'All') params.category = categoryFilter;
      if (statusFilter) params.status = statusFilter;
      if (featuredFilter === 'featured') params.featured = true;
      if (featuredFilter === 'not-featured') params.featured = false;
      if (searchTerm) params.search = searchTerm;

      const response = await dispatch(fetchFAQs(params));
console.log(response)
          setFaqs(response.faqs);
      setTotalPages(response.totalPages);
      setTotalFaqs(response.totalFaqs);
      // setFilteredTestimonials(response.reviews);

    } catch (error) {
      console.error('Error fetching filtered FAQs:', error);
    }
  };
  useEffect(() => {
    
  
    fetchAllFaqs();
      }, [dispatch, currentPage, categoryFilter, statusFilter, featuredFilter, searchTerm, sortConfig]);
  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setStatusFilter("");
    setFeaturedFilter("");
    setSortConfig({ key: "order", direction: "asc" });
  };
  
  // Handle sort request
//   const requestSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };
  
  // Toggle featured status
// Generic Update Function
const updateFaq = async (id, updates) => {
  try {
    // Find the relevant FAQ
    const faq = faqs.find(item => item._id === id);
    if (faq) {
      const updatedFaq = { ...faq, ...updates }; // Merge updates

      // Dispatch the update action to the store (Redux)
      await dispatch(updateFAQ(id, updatedFaq));

      // Dispatch custom event if featured is updated
      if (updates.featured !== undefined) {
        window.dispatchEvent(new CustomEvent('faqFeaturedToggled', {
          detail: { faqId: id, featured: updates.featured }
        }));
      }

      // Refresh the FAQ list
      fetchAllFaqs();
    }
  } catch (error) {
    console.error('Error updating FAQ:', error);
  }
};

// Toggle Featured Status
const toggleFeatured = (id) => {
  const faq = faqs.find(item => item._id === id);
  if (faq) {
    updateFaq(id, { featured: !faq.featured });
  }
};

// Toggle Published/Draft Status
const toggleStatus = (id) => {
  const faq = faqs.find(item => item._id === id);
  if (faq) {
    const newStatus = faq.status === 'published' ? 'draft' : 'published';
    updateFaq(id, { status: newStatus });
  }
};

  
  // Delete FAQ item
  const deleteFaqItem = (id) => {
    if (window.confirm("Are you sure you want to delete this FAQ item?")) {
      setFaqItems(faqItems.filter(item => item.id !== id));
    }
  };
  
  // View FAQ details
  const viewFaqDetails = (item) => {
    setViewItem(item);
    setShowModal(true);
  };
  
  // Function to get label color class based on status
  const getStatusColorClass = (status) => {
    return status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  // New functions for edit functionality
  const openEditModal = (item) => {
    setEditItem({...item});
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditItem(null);
    setShowEditModal(false);
    setFormErrors({});
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditItem({
      ...editItem,
      [name]: type === "checkbox" ? checked : value
    });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

//   const handleEditEditorChange = (event, editor) => {
//     if (editor && editor.getData) {
//       const data = editor.getData();
//       setEditItem({
//         ...editItem,
//         answer: data
//       });
      
//       // Clear error when user starts typing
//       if (formErrors.answer) {
//         setFormErrors({
//           ...formErrors,
//           answer: null
//         });
//       }
//     }
//   };

  const validateEditForm = () => {
    const errors = {};
    
    if (!editItem.question.trim()) {
      errors.question = "Question is required";
    }
    
    if (!editItem.answer.trim()) {
      errors.answer = "Answer is required";
    }
    
    if (!editItem.categoryId) {
      errors.categoryId = "Category is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveEditedFaq = () => {
    if (validateEditForm()) {
      const updatedItems = faqItems.map(item => 
        item.id === editItem.id ? editItem : item
      );
      
      setFaqItems(updatedItems);
      
      // If item is featured and we're toggling it, dispatch the event
      if (editItem.featured !== faqItems.find(item => item.id === editItem.id).featured) {
        window.dispatchEvent(new CustomEvent('faqFeaturedToggled', {
          detail: { faqId: editItem.id, featured: editItem.featured }
        }));
      }
      
      closeEditModal();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md max-w-7xl mx-auto overflow-hidden border border-gray-100">
      {/* Header section with title and description */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">FAQ Items</h3>
        <p className="text-gray-600 text-sm">Manage questions and answers for the FAQ section</p>
      </div>
      
      {/* Search and Filter Controls */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Filter Button */}
            <button
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                filterVisible ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setFilterVisible(!filterVisible)}
            >
              <FaFilter className="text-sm" />
              <span>Filter</span>
            </button>
            
            {/* Add FAQ Button */}
            <a
              href="/adminn/add-faq"
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2"
            >
              <FaPlus className="text-sm" />
              <span>Add FAQ</span>
            </a>
          </div>
        </div>
        
        {/* Filter Panel */}
        {filterVisible && (
          <div className="bg-gray-50 p-5 rounded-xl mt-4 border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {faqCategories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              
              {/* Featured Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Featured</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  value={featuredFilter}
                  onChange={(e) => setFeaturedFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="featured">Featured</option>
                  <option value="not-featured">Not Featured</option>
                </select>
              </div>
              
              {/* Reset Filters */}
              <div className="flex items-end">
                <button
                  className="w-full px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all shadow-sm font-medium"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* FAQ Items List */}
      <div className="p-6">
        {faqs.length > 0 ? (
          <div className="space-y-4">
            {faqs.map((item) => (
              <div 
                key={item.id} 
                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-3">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColorClass(item.status)}`}>
                      {item.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.category}
                    </span>
                    {item.featured && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-full hover:bg-indigo-50 transition-colors"
                      onClick={() => viewFaqDetails(item)}
                      title="View Details"
                    >
                      <FaEye size={14} />
                    </button>
                    <button 
                      className="text-blue-600 hover:text-blue-900 p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                      onClick={() => openEditModal(item)}
                      title="Edit"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button 
                      className={`${item.featured ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-600 p-1.5 rounded-full hover:bg-yellow-50 transition-colors`}
                      onClick={() => toggleFeatured(item._id)}
                      title={item.featured ? "Remove from Featured" : "Add to Featured"}
                    >
                      <FaPlus size={14} />
                    </button>
                    <button 
                      className={`${item.status === 'published' ? 'text-green-600' : 'text-gray-400'} hover:text-green-700 p-1.5 rounded-full hover:bg-green-50 transition-colors`}
                      onClick={() => toggleStatus(item._id)}
                      title={item.status === 'published' ? "Unpublish" : "Publish"}
                    >
                      {item.status === 'published' ? <FaBan size={14} /> : <FaCheck size={14} />}
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                        onClick={() => deleteFaqItem(item._id)}
                      title="Delete"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    {item.question}
                  </h4>
                  <p className="text-gray-600">
                    {item.answer.length > 200 
                      ? `${item.answer.substring(0, 200)}...` 
                      : item.answer
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No FAQ items found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start by creating a new FAQ item or adjust your search filters.
            </p>
            <div className="mt-6">
              <a
                href="/adminn/add-faq"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New FAQ Item
              </a>
            </div>
          </div>
        )}
      </div>
      
      {/* View FAQ Details Modal */}
      {showModal && viewItem && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setShowModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div 
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        FAQ Details
                      </h3>
                      <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColorClass(viewItem.status)}`}>
                          {viewItem.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {viewItem.categoryName}
                        </span>
                        {viewItem.featured && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            Featured
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-1">
                        Created on {new Date(viewItem.createdAt).toLocaleDateString()}
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        Display Order: {viewItem.order}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Question</h4>
                      <p className="text-gray-900 bg-white p-4 rounded-lg border border-gray-200">
                        {viewItem.question}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Answer</h4>
                      <div className="text-gray-700 bg-white p-4 rounded-lg border border-gray-200 prose max-w-none">
                        {viewItem.answer}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowModal(false);
                    openEditModal(viewItem);
                  }}
                >
                  Edit FAQ
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit FAQ Modal */}
      {showEditModal && editItem && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={closeEditModal}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div 
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Edit FAQ
                      </h3>
                      <button
                        onClick={closeEditModal}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <form className="space-y-6">
                      {/* Question */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Question <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="question"
                          placeholder="Enter the frequently asked question"
                          className={`w-full border ${formErrors.question ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm`}
                          value={editItem.question}
                          onChange={handleEditInputChange}
                        />
                        {formErrors.question && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.question}</p>
                        )}
                      </div>
                      
                      {/* Category */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="categoryId"
                          className={`w-full border ${formErrors.categoryId ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm`}
                          value={editItem.categoryId}
                          onChange={handleEditInputChange}
                        >
                          <option value="">Select a category</option>
                          {faqCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        {formErrors.categoryId && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.categoryId}</p>
                        )}
                      </div>
                      
                      {/* Answer */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Answer <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="answer"
                          rows="6"
                          className={`w-full border ${formErrors.answer ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm`}
                          value={editItem.answer}
                          onChange={handleEditInputChange}
                        ></textarea>
                        {formErrors.answer && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.answer}</p>
                        )}
                      </div>
                      
                      {/* Row for Status, Display Order, and Featured checkbox */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Status */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select
                            name="status"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                            value={editItem.status}
                            onChange={handleEditInputChange}
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                          </select>
                        </div>
                        
                        {/* Display Order */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                          <input
                            type="number"
                            name="order"
                            min="1"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                            value={editItem.order}
                            onChange={handleEditInputChange}
                          />
                        </div>
                        
                        {/* Featured */}
                        <div className="flex items-center h-full pt-6">
                          <input
                            type="checkbox"
                            id="featured"
                            name="featured"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={editItem.featured}
                            onChange={handleEditInputChange}
                          />
                          <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                            Featured FAQ
                          </label>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={saveEditedFaq}
                >
                  <FaSave className="mr-2" />
                  Save Changes
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeEditModal}
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaqItemsComponent; 