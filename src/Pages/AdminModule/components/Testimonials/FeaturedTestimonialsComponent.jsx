import React, { useState, useMemo, useEffect, useCallback } from "react";
import { FaStar, FaSearch, FaTimes, FaCheck, FaEye, FaChevronDown, FaChevronUp, FaSort, FaBan } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchReviews } from "../../../../Redux/adminReducer.js/action";
import { debounce } from "lodash";
    const FeaturedTestimonialsComponent = () => {
  // Sample data - would be fetched from API in a real application
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "John Miller",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      position: "CEO",
      company: "Tech Solutions",
      rating: 5,
      date: "2023-05-15",
      yachtName: "Ocean Explorer",
      featured: true,
      verified: true,
      content: "The yacht experience exceeded all our expectations. From the moment we stepped on board, the crew made us feel like royalty. The yacht was immaculate, and the service was impeccable. We will definitely be booking again!",
      category: "Corporate",
      status: "approved"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      position: "Marketing Director",
      company: "Creative Media",
      rating: 5,
      date: "2023-06-10",
      yachtName: "Sea Breeze",
      featured: true,
      verified: true,
      content: "We hosted our company retreat on this yacht and it was the highlight of our year. The spacious layout was perfect for our team building activities, and the breathtaking views created a truly inspiring environment.",
      category: "Corporate",
      status: "approved"
    },
    {
      id: 3,
      name: "Michael Brown",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      position: "Event Planner",
      company: "Celebration Events",
      rating: 5,
      date: "2023-07-22",
      yachtName: "Royal Wave",
      featured: true,
      verified: true,
      content: "As an event planner, I have high standards for venues and experiences. This yacht charter exceeded even my expectations. The flexibility of the space, the professional crew, and the stunning setting made for an unforgettable client event.",
      category: "Corporate",
      status: "approved"
    },
    {
      id: 4,
      name: "Emma Wilson",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      position: "Bride",
      company: "",
      rating: 5,
      date: "2023-08-05",
      yachtName: "Golden Sail",
      featured: true,
      verified: true,
      content: "Our wedding on the yacht was absolutely magical! The sunset ceremony on the deck, followed by dinner under the stars, created the romantic atmosphere we dreamed of. Our guests are still talking about how amazing it was.",
      category: "Wedding",
      status: "approved"
    },
    {
      id: 5,
      name: "David Thompson",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      position: "Family Vacation",
      company: "",
      rating: 4,
      date: "2023-09-18",
      yachtName: "Blue Horizon",
      featured: true,
      verified: true,
      content: "This was our third time booking with Lux Yachts and they never disappoint. The kids loved the water activities and the adults enjoyed the luxurious amenities. The chef prepared incredible meals that catered to everyone's preferences.",
      category: "Family",
      status: "approved"
    }
  ]);

  // All available testimonials for adding to featured
  const [allTestimonials, setAllTestimonials] = useState([
    {
      id: 6,
      name: "Robert Clark",
      avatar: "https://randomuser.me/api/portraits/men/6.jpg",
      position: "Entrepreneur",
      company: "Startup Ventures",
      rating: 5,
      date: "2023-10-05",
      yachtName: "Coastal Venture",
      featured: false,
      verified: true,
      content: "I booked this yacht to impress important clients, and it definitely accomplished that goal. The professional crew, elegant interior, and smooth sailing created the perfect environment for our business discussions.",
      category: "Corporate",
      status: "approved"
    },
    {
      id: 7,
      name: "Jennifer Adams",
      avatar: "https://randomuser.me/api/portraits/women/7.jpg",
      position: "Anniversary Celebration",
      company: "",
      rating: 5,
      date: "2023-11-12",
      yachtName: "Sunset Dream",
      featured: false,
      verified: true,
      content: "We celebrated our 25th anniversary on this beautiful yacht, and it was everything we hoped for. The romantic dinner prepared by the private chef, the attentive service, and the stunning coastal views made it a milestone celebration we'll cherish forever.",
      category: "Anniversary",
      status: "approved"
    },
    {
      id: 8,
      name: "Thomas Wright",
      avatar: "https://randomuser.me/api/portraits/men/8.jpg",
      position: "Birthday Celebration",
      company: "",
      rating: 4,
      date: "2023-12-20",
      yachtName: "Silver Tide",
      featured: false,
      verified: true,
      content: "My 40th birthday celebration on this yacht was unforgettable! The crew went above and beyond to ensure we had everything we needed. The sound system was perfect for our party, and the outdoor lounge areas provided plenty of space for our group to relax and enjoy.",
      category: "Birthday",
      status: "approved"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [editIndex, setEditIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [totalPages, setTotalPages] = useState(1);
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const dispatch = useDispatch();
  // const { reviews } = useSelector((state) => state.admin);

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
   setModalSearchTerm(value);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearchTerm.cancel();
    };
  }, [debouncedSearchTerm]);

  useEffect(() => {
    
    const fetchFeaturedTestimonials = async () => {
      try {
        const params = {
          page: currentPage,
          limit:4,
          // sort: `${sortConfig.key}`,
          // order: `${sortConfig.direction}`,
          type: 'testimonial',
          featured: true
        };
  
        // // Add filters if set
        // if (ratingFilter) params.rating = ratingFilter;
        // if (categoryFilter && categoryFilter !== 'All') params.category = categoryFilter;
        // if (statusFilter) params.status = statusFilter;
        // if (featuredFilter) params.featured = featuredFilter === 'true';
        if (modalSearchTerm) params.search = modalSearchTerm;
  
        const response = await dispatch(fetchReviews(params));
  console.log(response)
        setTestimonials(response.reviews);
        setTotalPages(response.totalPages);
        // setFilteredTestimonials(response.reviews);
  
      } catch (error) {
        console.error('Error fetching filtered testimonials:', error);
      }
    };
    fetchFeaturedTestimonials();
  }, [dispatch, currentPage, modalSearchTerm, sortConfig]);
  

  // Current testimonials for pagination
  const currentTestimonials = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return testimonials.slice(indexOfFirstItem, indexOfLastItem);
  }, [testimonials, currentPage, itemsPerPage]);

  // Calculate pagination
  // const totalPages = Math.ceil(sortedTestimonials.length / itemsPerPage);

  // Handle sort request
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Render sort icon
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort className="ml-1 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? 
      <FaChevronUp className="ml-1 text-blue-500" /> : 
      <FaChevronDown className="ml-1 text-blue-500" />;
  };

  // Add this useEffect to listen for featured changes from AllTestimonialsComponent
  useEffect(() => {
    const handleFeaturedToggle = (event) => {
      const { testimonial, featured } = event.detail;
      
      if (featured) {
        // Add to featured testimonials
        if (!testimonials.some(t => t.id === testimonial.id)) {
          setTestimonials([...testimonials, testimonial]);
          // Remove from all testimonials if it exists there
          setAllTestimonials(allTestimonials.filter(t => t.id !== testimonial.id));
        }
      } else {
        // Remove from featured testimonials
        setTestimonials(testimonials.filter(t => t.id !== testimonial.id));
        // Add to all testimonials
        if (!allTestimonials.some(t => t.id === testimonial.id)) {
          setAllTestimonials([...allTestimonials, { ...testimonial, featured: false }]);
        }
      }
    };

    // Add event listener
    document.addEventListener('testimonialFeaturedToggled', handleFeaturedToggle);
    
    // Clean up
    return () => {
      document.removeEventListener('testimonialFeaturedToggled', handleFeaturedToggle);
    };
  }, [testimonials, allTestimonials]);

  // Also update handleRemoveFromFeatured to emit the same event
  const handleRemoveFromFeatured = (id) => {
    // Find the testimonial
    const testimonial = testimonials.find(t => t.id === id);
    if (!testimonial) return;

    // Remove from featured list
    setTestimonials(testimonials.filter(t => t.id !== id));
    
    // Add to all testimonials and mark as not featured
    const updatedTestimonial = { ...testimonial, featured: false };
    setAllTestimonials([...allTestimonials, updatedTestimonial]);

    // Dispatch event to notify other components
    const event = new CustomEvent('testimonialFeaturedToggled', { 
      detail: { 
        testimonial: updatedTestimonial,
        featured: false
      } 
    });
    document.dispatchEvent(event);
  };

  // Handle add to featured
  const handleAddToFeatured = (id) => {
    // Find the testimonial
    const testimonial = allTestimonials.find(t => t.id === id);
    if (!testimonial) return;

    // Remove from all testimonials list
    setAllTestimonials(allTestimonials.filter(t => t.id !== id));
    
    // Add to featured testimonials and mark as featured
    const updatedTestimonial = { ...testimonial, featured: true };
    setTestimonials([...testimonials, updatedTestimonial]);
    
    // Dispatch event to notify other components
    const event = new CustomEvent('testimonialFeaturedToggled', { 
      detail: { 
        testimonial: updatedTestimonial,
        featured: true
      } 
    });
    document.dispatchEvent(event);
    
    // Close modal if no more testimonials to add
    if (allTestimonials.length <= 1) {
      setShowAddModal(false);
    }
  };

  // Render rating stars
  const renderRating = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar 
            key={star}
            className={star <= rating ? "text-yellow-400" : "text-gray-300"}
            size={14}
          />
        ))}
      </div>
    );
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Featured Testimonials</h3>
          <p className="text-gray-600">Manage testimonials displayed on the home page and other prominent locations</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
            onClick={() => setShowAddModal(true)}
            disabled={testimonials.length === 0}
          >
            <span>Add Testimonial</span>
          </button>
        </div>
      </div>

      {/* Search and Info */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-64 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Search testimonials..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={modalSearchTerm}
            onChange={(e) => handleSearchChange(e)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="text-sm text-gray-600">
          Showing {currentTestimonials.length} of {testimonials.length} Featured Testimonials
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {currentTestimonials.length > 0 ? (
          currentTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
              {/* Testimonial Header */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <img 
                      src={testimonial?.userAvatar||"https://randomuser.me/api/portraits/women/7.jpg"} 
                      alt={testimonial?.userName} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=0D8ABC&color=fff`;
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 flex items-center">
                        {testimonial?.userName}
                      {testimonial?.verified && (
                        <span className="ml-1 text-blue-500" title="Verified Customer">
                          <FaCheck size={12} />
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {testimonial.position}
                      {testimonial?.company && `, ${testimonial?.company}`}
                    </p>
                  </div>
                </div>
                <div>
                  <button
                    className="p-1.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100"
                    onClick={() => handleRemoveFromFeatured(testimonial.id)}
                    title="Remove from featured"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              </div>
              
              {/* Testimonial Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>{renderRating(testimonial.rating)}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(testimonial?.date).toLocaleDateString()}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-4">
                  {testimonial?.comment}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{testimonial?.yachtName}</span>
                  <span className="px-2 py-1 bg-gray-100 rounded-full">
                    {testimonial?.category}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 py-8 text-center">
            <p className="text-gray-500">No featured testimonials found. Add testimonials to display here.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-l-md border border-gray-300 ${
                currentPage === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 border-t border-b border-gray-300 ${
                  currentPage === index + 1
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-r-md border border-gray-300 ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Add Testimonial Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setShowAddModal(false)}>
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                      Add Testimonial to Featured
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Select testimonials to display on the homepage and other prominent locations.
                    </p>
                    
                    {/* Search */}
                    <div className="relative w-full mb-4">
                      <input
                        type="text"
                        placeholder="Search testimonials..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={modalSearchTerm}
                        onChange={(e) => setModalSearchTerm(e.target.value)}
                      />
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    
                    {/* Testimonial List */}
                    <div className="max-h-96 overflow-y-auto">
                      {testimonials.length > 0 ? (
                        testimonials.map((testimonial) => (
                          <div 
                            key={testimonial.id} 
                            className="border border-gray-200 rounded-md p-3 mb-3 hover:bg-gray-50"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-start">
                                <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                                  <img 
                                    src={testimonial?.userAvatar} 
                                    alt={testimonial?.userName} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial?.userName)}&background=0D8ABC&color=fff`;
                                    }}
                                  />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-800 flex items-center">
                                    {testimonial?.userName}
                                    {testimonial?.verified && (
                                      <span className="ml-1 text-blue-500" title="Verified Customer">
                                        <FaCheck size={12} />
                                      </span>
                                    )}
                                  </h4>
                                  <div className="flex items-center text-sm mb-1">
                                    {renderRating(testimonial.rating)}
                                    <span className="text-xs text-gray-500 ml-2">
                                      {new Date(testimonial?.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    {testimonial?.yachtName} • {testimonial?.category}
                                  </p>
                                </div>
                              </div>
                              <button
                                className="ml-2 px-2.5 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm flex items-center"
                                onClick={() => handleAddToFeatured(testimonial.id)}
                              >
                                <span>Add</span>
                              </button>
                            </div>
                            <div className="mt-2">
                              <p className="text-sm text-gray-700 line-clamp-2">
                                    {testimonial?.comment}
                              </p>
                            </div>
                          </div>
                        ))  
                      ) : (
                        <div className="py-4 text-center">
                          <p className="text-gray-500">No testimonials available to add.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedTestimonialsComponent; 