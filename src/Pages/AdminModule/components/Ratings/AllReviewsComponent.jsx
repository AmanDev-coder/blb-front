import { useState, useEffect, useCallback } from "react";
import { FaSearch, FaFilter, FaEdit, FaTrash, FaCheck, FaBan, FaStar, FaEye, FaReply, FaSort } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { fetchReviews } from "../../../../Redux/adminReducer.js/action";
import { debounce } from "lodash";
// Sample review data

const initialReviews = [
  {
    id: 1,
    customerName: "Michael Johnson",
    customerAvatar: "",
    yachtName: "Sea Breeze Luxury",
    rating: 5,
    reviewTitle: "Amazing experience!",
    reviewText: "We had an incredible day on this yacht. The captain was professional and the yacht itself was immaculate. Would definitely recommend to anyone looking for a luxury experience.",
    date: "2023-10-15",
    status: "approved",
    featured: true,
    responded: true,
    responseText: "Thank you for your wonderful review, Michael! We're delighted that you enjoyed your time aboard Sea Breeze Luxury. We look forward to welcoming you back soon!",
    responseDate: "2023-10-16"
  },
  {
    id: 2,
    customerName: "Sarah Williams",
    customerAvatar: "",
    yachtName: "Ocean Explorer",
    rating: 4,
    reviewTitle: "Great day on the water",
    reviewText: "The yacht was beautiful and the crew was very attentive. The only small issue was that we started a bit late, but otherwise the experience was fantastic. The food and drinks provided were excellent!",
    date: "2023-10-12",
    status: "approved",
    featured: false,
    responded: false,
    responseText: "",
    responseDate: ""
  },
  {
    id: 3,
    customerName: "David Thompson",
    customerAvatar: "",
    yachtName: "Blue Horizon",
    rating: 3,
    reviewTitle: "Decent experience but overpriced",
    reviewText: "While the yacht was nice and the crew was friendly, I believe it was overpriced for what we got. The amenities described weren't all available during our trip. The views were spectacular though.",
    date: "2023-10-08",
    status: "approved",
    featured: false,
    responded: true,
    responseText: "Thank you for your feedback, David. We apologize for any discrepancies in the amenities. We'd love to discuss this further and make it right for you on your next trip with us.",
    responseDate: "2023-10-09"
  },
  {
    id: 4,
    customerName: "Emily Rodriguez",
    customerAvatar: "",
    yachtName: "Sea Breeze Luxury",
    rating: 5,
    reviewTitle: "Perfect family celebration",
    reviewText: "We celebrated my parents' anniversary on this yacht and it was perfect in every way. The crew went above and beyond to make our day special. The yacht was spacious, clean and luxurious.",
    date: "2023-10-05",
    status: "pending",
    featured: false,
    responded: false,
    responseText: "",
    responseDate: ""
  },
  {
    id: 5,
    customerName: "Robert Chen",
    customerAvatar: "",
    yachtName: "Crystal Waters",
    rating: 2,
    reviewTitle: "Disappointing service",
    reviewText: "The yacht itself was beautiful but the service was lacking. The crew seemed disorganized and not very attentive to our needs. For the price we paid, I expected a much higher level of service.",
    date: "2023-10-01",
    status: "pending",
    featured: false,
    responded: false,
    responseText: "",
    responseDate: ""
  },
  {
    id: 6,
    customerName: "Jessica Miller",
    customerAvatar: "",
    yachtName: "Ocean Explorer",
    rating: 5,
    reviewTitle: "Best charter experience ever",
    reviewText: "This was our third time chartering a yacht and by far the best experience we've had. The yacht was stunning and immaculately maintained. The captain and crew were knowledgeable and attentive. Will definitely book again!",
    date: "2023-09-28",
    status: "approved",
    featured: true,
    responded: true,
    responseText: "Thank you for your glowing review, Jessica! We're thrilled that your experience with us was so positive. Our team works hard to ensure every charter is special, and we can't wait to welcome you back aboard Ocean Explorer!",
    responseDate: "2023-09-29"
  }
];

const AllReviewsComponent = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");
  const [respondedFilter, setRespondedFilter] = useState("");
  const [yachtFilter, setYachtFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [filterVisible, setFilterVisible] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);      
  const dispatch = useDispatch();

  // Get unique yacht names for the filter
  const yachts = [...new Set(reviews.map(review => review.yachtName))];

  // FILTERING LOGIC
  // useEffect(() => {
  //   let result = [...reviews];
    
  //   // Apply search filter
  //   if (searchTerm) {
  //     result = result.filter(review => 
  //       review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       review.reviewTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       review.reviewText.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       review.yachtName.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //   }
    
  //   // Apply status filter
  //   if (statusFilter) {
  //     result = result.filter(review => review.status === statusFilter);
  //   }
    
  //   // Apply rating filter
  //   if (ratingFilter) {
  //     result = result.filter(review => review.rating === parseInt(ratingFilter));
  //   }
    
  //   // Apply featured filter
  //   if (featuredFilter) {
  //     result = result.filter(review => 
  //       featuredFilter === "featured" ? review.featured : !review.featured
  //     );
  //   }
    
  //   // Apply responded filter
  //   if (respondedFilter) {
  //     result = result.filter(review => 
  //       respondedFilter === "responded" ? review.responded : !review.responded
  //     );
  //   }
    
  //   // Apply yacht filter
  //   if (yachtFilter) {
  //     result = result.filter(review => review.yachtName === yachtFilter);
  //   }
    
  //   // Apply sorting
  //   result.sort((a, b) => {
  //     if (a[sortConfig.key] < b[sortConfig.key]) {
  //       return sortConfig.direction === 'asc' ? -1 : 1;
  //     }
  //     if (a[sortConfig.key] > b[sortConfig.key]) {
  //       return sortConfig.direction === 'asc' ? 1 : -1;
  //     }
  //     return 0;
  //   });
    
  //   setFilteredReviews(result);
  // }, [reviews, searchTerm, statusFilter, ratingFilter, featuredFilter, respondedFilter, yachtFilter, sortConfig]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setRatingFilter("");
    setFeaturedFilter("");
    setRespondedFilter("");
    setYachtFilter("");
  };

  // Handle sort request
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Render star rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <FaStar key={index} className={`${index < rating ? "text-yellow-400" : "text-gray-300"} inline-block text-xs`} />
    ));
  };
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

  useEffect(() => {
    
    const fetchAllReviews = async () => {
      try {
        const params = {
          page: currentPage,
          limit:5,
          sort: `${sortConfig.key}`,
          order: `${sortConfig.direction}`,
          type: 'review'
        };
  
        // Add filters if set
        if (ratingFilter) params.rating = ratingFilter;
        // if (categoryFilter && categoryFilter !== 'All') params.category = categoryFilter;
        if (statusFilter) params.status = statusFilter;
        if (featuredFilter) params.featured = featuredFilter === 'true';
        if (searchTerm) params.search = searchTerm;
  
        const response = await dispatch(fetchReviews(params));
  
        setReviews(response.reviews);
        setTotalPages(response.totalPages);
        // setFilteredfetchReviews(response.reviews);
  
      } catch (error) {
        console.error('Error fetching filtered fetchReviews:', error);
      }
    };
    fetchAllReviews();
  }, [dispatch, currentPage, ratingFilter, statusFilter, featuredFilter, searchTerm, sortConfig]);
  
// console.log(reviews)
  return (
    <div className="bg-white rounded-xl shadow-md w-full mx-auto overflow-hidden border border-gray-100 p-2 sm:p-4">
      {/* Header section with title and description */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-5 border-b border-gray-200 -mx-2 sm:-mx-4 -mt-2 sm:-mt-4 mb-3 sm:mb-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">All Reviews</h3>
        <p className="text-gray-600 text-sm">Manage and moderate customer reviews for your yacht rentals</p>
      </div>
      
      {/* Search and Filter Controls */}
      <div className="p-3 border-b border-gray-200 -mx-2 sm:-mx-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
          {/* Search Bar */}
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search reviews..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Filter Button */}
            <button
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                filterVisible ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setFilterVisible(!filterVisible)}
            >
              <FaFilter className="text-xs" />
              <span>Filter</span>
            </button>
            
            {/* Sort Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
              >
                <FaSort className="text-xs" />
                <span>Sort</span>
              </button>
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 hidden group-hover:block min-w-[140px]">
                <div className="p-2">
                  <button 
                    className="flex items-center justify-between gap-2 px-3 py-2 hover:bg-gray-100 w-full text-left rounded text-sm"
                    onClick={() => requestSort('date')}
                  >
                    <span>Date</span>
                    {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? 
                      <FaSort className="text-blue-500" /> : 
                      <FaSort className="text-blue-500 rotate-180" />
                    )}
                  </button>
                  <button 
                    className="flex items-center justify-between gap-2 px-3 py-2 hover:bg-gray-100 w-full text-left rounded text-sm"
                    onClick={() => requestSort('rating')}
                  >
                    <span>Rating</span>
                    {sortConfig.key === 'rating' && (sortConfig.direction === 'asc' ? 
                      <FaSort className="text-blue-500" /> : 
                      <FaSort className="text-blue-500 rotate-180" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filter Panel */}
        {filterVisible && (
          <div className="bg-gray-50 p-3 rounded-xl mt-3 border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                >
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
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
                  <option value="">All Reviews</option>
                  <option value="featured">Featured Only</option>
                  <option value="not-featured">Not Featured</option>
                </select>
              </div>
              
              {/* Responded Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Response</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  value={respondedFilter}
                  onChange={(e) => setRespondedFilter(e.target.value)}
                >
                  <option value="">All Reviews</option>
                  <option value="responded">Responded</option>
                  <option value="not-responded">Not Responded</option>
                </select>
              </div>
              
              {/* Yacht Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Yacht</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  value={yachtFilter}
                  onChange={(e) => setYachtFilter(e.target.value)}
                >
                  <option value="">All Yachts</option>
                  {yachts.map((yacht, index) => (
                    <option key={index} value={yacht}>{yacht}</option>
                  ))}
                </select>
              </div>
              
              {/* Reset Filters */}
              <div className="md:col-span-2 lg:col-span-3 xl:col-span-5 flex justify-end mt-4">
                <button
                  className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all shadow-sm font-medium"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Reviews List Table */}
      <div className="overflow-x-auto mt-3">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
                  <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                Customer
              </th>
                  <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell w-32">
                Yacht
              </th>
                  <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Rating
              </th>
                  <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Review
              </th>
                  <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell w-24">
                Date
              </th>
                  <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell w-28">
                Status
              </th>
                  <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-2 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                          <div className="h-6 w-6 flex-shrink-0 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center overflow-hidden">
                            {review.userAvatar ? (
                              <img src={review.userAvatar} alt={review.userName} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-sm font-medium">{review.userName.charAt(0)}</span>
                        )}
                      </div>
                          <div className="ml-2">
                            <div className="text-xs font-medium text-gray-900 truncate max-w-[80px]">{review.userName}</div>
                      </div>
                    </div>
                  </td>
                      <td className="px-2 py-2 whitespace-nowrap hidden sm:table-cell">
                        <div className="text-xs text-gray-900 truncate max-w-[100px]">{review.yachtName}</div>
                  </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        <div className="text-xs text-gray-900">
                      {renderStars(review.rating)}
                    </div>
                  </td>
                      <td className="px-2 py-2">
                        <div className="text-xs text-gray-900 font-medium truncate max-w-[120px] md:max-w-[180px] lg:max-w-[240px]">{review.reviewTitle}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-[180px] lg:max-w-[240px]">
                          {review.comment.length > 60 ? `${review.comment.substring(0, 60)}...` : review.comment}
                        </div>
                    {review.responded && (
                      <div className="mt-1 text-xs text-blue-600 flex items-center gap-1">
                            <FaReply className="text-[10px]" /> Response
                      </div>
                    )}
                  </td>
                      <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500 hidden md:table-cell">
                    {new Date(review.date).toLocaleDateString('en-US', {
                          year: '2-digit',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                      <td className="px-2 py-2 whitespace-nowrap hidden sm:table-cell">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                      review.status === 'approved' ? 'bg-green-100 text-green-800' :
                      review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                          {review.status === 'approved' && <FaCheck className="mr-1 text-[8px]" />}
                          {review.status === 'pending' && <FaFilter className="mr-1 text-[8px]" />}
                          {review.status === 'rejected' && <FaBan className="mr-1 text-[8px]" />}
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </span>
                    {review.featured && (
                          <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800">
                            <FaStar className="mr-1 text-[8px]" /> Featured
                      </span>
                    )}
                  </td>
                      <td className="px-2 py-2 whitespace-nowrap text-xs font-medium">
                        <div className="flex items-center space-x-1">
                      <button 
                            className="text-indigo-600 hover:text-indigo-900 transition-colors p-1"
                        onClick={() => {
                          setCurrentReview(review);
                          setShowViewModal(true);
                        }}
                      >
                            <FaEye size={12} />
                      </button>
                      <button 
                            className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                        onClick={() => {
                          setCurrentReview(review);
                          setResponseText(review.responseText || '');
                          setShowResponseModal(true);
                        }}
                      >
                            <FaReply size={12} />
                      </button>
                      {review.status === 'pending' && (
                        <>
                          <button 
                                className="text-green-600 hover:text-green-900 transition-colors p-1"
                            onClick={() => {
                              // Handle approve logic
                              const updatedReviews = reviews.map(r => 
                                r.id === review.id ? {...r, status: 'approved'} : r
                              );
                              setReviews(updatedReviews);
                            }}
                          >
                                <FaCheck size={12} />
                          </button>
                          <button 
                                className="text-red-600 hover:text-red-900 transition-colors p-1"
                            onClick={() => {
                              // Handle reject logic
                              const updatedReviews = reviews.map(r => 
                                r.id === review.id ? {...r, status: 'rejected'} : r
                              );
                              setReviews(updatedReviews);
                            }}
                          >
                                <FaBan size={12} />
                          </button>
                        </>
                      )}
                      <button 
                            className="text-yellow-600 hover:text-yellow-900 transition-colors p-1"
                        onClick={() => {
                          // Handle feature toggle logic
                          const updatedReviews = reviews.map(r => 
                            r.id === review.id ? {...r, featured: !r.featured} : r
                          );
                          setReviews(updatedReviews);
                        }}
                      >
                            <FaStar size={12} className={`${review.featured ? 'text-yellow-400' : ''}`} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-900 mb-1">No reviews found</p>
                    <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
          </div>
        </div>
      </div>
      
      {/* Pagination Controls (can be added later) */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 mt-4">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{reviews.length}</span> results
            </p>
          </div>
        </div>
      </div>
      
      {/* View Review Modal */}
      {showViewModal && currentReview && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-5 sm:px-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Review Details
                  </h3>
                  <button 
                    onClick={() => setShowViewModal(false)}
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center overflow-hidden">
                            {currentReview.userAvatar ? (
                              <img src={currentReview.userAvatar} alt={currentReview.userName} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-lg font-medium">{currentReview.userName.charAt(0)}</span>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-lg font-medium text-gray-900">{currentReview.userName}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(currentReview.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="text-sm text-gray-900 mb-1">
                            {renderStars(currentReview.rating)}
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            currentReview.status === 'approved' ? 'bg-green-100 text-green-800' :
                            currentReview.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {currentReview.status.charAt(0).toUpperCase() + currentReview.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{currentReview.reviewTitle}</h4>
                        <p className="text-gray-700 mb-3 whitespace-pre-line">{currentReview.comment}</p>
                      
                      <div className="text-sm text-gray-500 border-t border-gray-200 pt-2 flex items-center">
                        <span className="mr-2">Yacht:</span>
                        <span className="font-medium text-gray-700">{currentReview.yachtName}</span>
                      </div>
                    </div>
                    
                    {/* Response Section */}
                    {currentReview.responded && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-md font-semibold text-blue-700">Admin Response</h4>
                          <div className="text-sm text-blue-500">
                            {new Date(currentReview.responseDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                        <p className="text-blue-700 text-sm whitespace-pre-line">{currentReview.responseText}</p>
                      </div>
                    )}
                    
                    {/* Quick Action Buttons */}
                    <div className="mt-5 border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center">
                          <span className="mr-2 text-sm text-gray-500">Status:</span>
                          <select 
                            className="border border-gray-300 rounded-md text-sm p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={currentReview.status}
                            onChange={(e) => {
                              const updatedReviews = reviews.map(r => 
                                r.id === currentReview.id ? {...r, status: e.target.value} : r
                              );
                              setReviews(updatedReviews);
                              setCurrentReview({...currentReview, status: e.target.value});
                            }}
                          >
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <button 
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                              currentReview.featured ? 
                                'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 
                                'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            onClick={() => {
                              const newFeaturedState = !currentReview.featured;
                              const updatedReviews = reviews.map(r => 
                                r.id === currentReview.id ? {...r, featured: newFeaturedState} : r
                              );
                              setReviews(updatedReviews);
                              setCurrentReview({...currentReview, featured: newFeaturedState});
                            }}
                          >
                            <FaStar className={currentReview.featured ? 'text-yellow-500' : ''} />
                            {currentReview.featured ? 'Featured' : 'Add to Featured'}
                          </button>
                          
                          <button 
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                            onClick={() => {
                              setResponseText(currentReview.responseText || '');
                              setShowViewModal(false);
                              setShowResponseModal(true);
                            }}
                          >
                            <FaReply />
                            {currentReview.responded ? 'Edit Response' : 'Add Response'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Response Modal */}
      {showResponseModal && currentReview && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-5 sm:px-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {currentReview.responded ? 'Edit Response' : 'Add Response'}
                  </h3>
                  <button 
                    onClick={() => setShowResponseModal(false)}
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="mb-4">
                      <h4 className="text-md font-medium text-gray-700 mb-2">Review by {currentReview.userName}</h4>
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                        <div className="text-sm text-gray-900 mb-1">
                          {renderStars(currentReview.rating)}
                        </div>
                        <h5 className="text-sm font-semibold text-gray-800 mb-1">{currentReview.reviewTitle}</h5>
                          <p className="text-xs text-gray-600">{currentReview.comment}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="responseText" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Response
                      </label>
                      <textarea
                        id="responseText"
                        name="responseText"
                        rows={4}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Type your response here..."
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                      ></textarea>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      <p>Your response will be visible to all customers viewing this yacht.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    const now = new Date().toISOString().split('T')[0];
                    const updatedReviews = reviews.map(r => 
                      r.id === currentReview.id ? {
                        ...r, 
                        responded: true, 
                        responseText: responseText,
                        responseDate: now
                      } : r
                    );
                    setReviews(updatedReviews);
                    setShowResponseModal(false);
                  }}
                >
                  Save Response
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowResponseModal(false)}
                >
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

export default AllReviewsComponent; 