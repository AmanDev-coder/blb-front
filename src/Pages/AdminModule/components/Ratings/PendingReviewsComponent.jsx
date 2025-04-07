import { useState, useEffect } from 'react';
import { FaCheck, FaBan, FaFilter, FaEye, FaReply, FaSearch, FaStar } from 'react-icons/fa';

// Sample data - we're filtering to only show pending reviews
const initialReviews = [
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
    id: 7,
    customerName: "Thomas Wilson",
    customerAvatar: "",
    yachtName: "Blue Horizon",
    rating: 4,
    reviewTitle: "Great experience with minor issues",
    reviewText: "The yacht was beautiful and the crew was friendly. We had a small issue with the timing of our food service, but other than that it was a wonderful day on the water. The captain knew all the best spots to stop for swimming.",
    date: "2023-09-25",
    status: "pending",
    featured: false,
    responded: false,
    responseText: "",
    responseDate: ""
  },
  {
    id: 8,
    customerName: "Sophia Patel",
    customerAvatar: "",
    yachtName: "Crystal Waters",
    rating: 5,
    reviewTitle: "Exceeded expectations",
    reviewText: "From the moment we stepped aboard, we were treated like royalty. The yacht was immaculate, the staff was professional and attentive, and the food was outstanding. This experience exceeded all our expectations.",
    date: "2023-09-20",
    status: "pending",
    featured: false,
    responded: false,
    responseText: "",
    responseDate: ""
  }
];

const PendingReviewsComponent = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [yachtFilter, setYachtFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [showResponseModal, setShowResponseModal] = useState(false);
  
  // Get unique yacht names for the filter
  const yachts = [...new Set(reviews.map(review => review.yachtName))];
  
  // Filter reviews based on search term and filters
  useEffect(() => {
    let result = [...reviews];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(review => 
        review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.reviewTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.reviewText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.yachtName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply yacht filter
    if (yachtFilter) {
      result = result.filter(review => review.yachtName === yachtFilter);
    }
    
    // Apply rating filter
    if (ratingFilter) {
      result = result.filter(review => review.rating === parseInt(ratingFilter));
    }
    
    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredReviews(result);
  }, [reviews, searchTerm, yachtFilter, ratingFilter]);
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setYachtFilter('');
    setRatingFilter('');
  };
  
  // Emit events to notify other components about review status changes
  const emitReviewStatusChanged = (reviewId, newStatus) => {
    const event = new CustomEvent('reviewStatusChanged', { 
      detail: { reviewId, newStatus }
    });
    document.dispatchEvent(event);
  };
  
  // Approve a review
  const handleApproveReview = (reviewId) => {
    const updatedReviews = reviews.map(review => 
      review.id === reviewId 
        ? { ...review, status: 'approved' } 
        : review
    );
    setReviews(updatedReviews);
    emitReviewStatusChanged(reviewId, 'approved');
  };
  
  // Reject a review
  const handleRejectReview = (reviewId) => {
    const updatedReviews = reviews.map(review => 
      review.id === reviewId 
        ? { ...review, status: 'rejected' } 
        : review
    );
    setReviews(updatedReviews);
    emitReviewStatusChanged(reviewId, 'rejected');
  };
  
  // Render star rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <FaStar key={index} className={`${index < rating ? "text-yellow-400" : "text-gray-300"} inline-block`} />
    ));
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-4 sm:p-6">
      {/* Header and stats section */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 border-b border-gray-200 -mx-6 -mt-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Pending Reviews</h3>
        <p className="text-gray-600 text-sm mb-4">Moderate customer reviews awaiting approval</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaFilter className="text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.length > 0 
                    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
                    : "N/A"}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FaStar className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Oldest Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.length > 0 
                    ? new Date(Math.min(...reviews.map(r => new Date(r.date)))).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })
                    : "N/A"}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <FaFilter className="text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and filter controls */}
      <div className="p-6 border-b border-gray-200 -mx-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search pending reviews..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-700 text-sm transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <div className="flex w-full md:w-auto flex-wrap gap-4">
            {/* Yacht Filter */}
            <div className="w-full md:w-auto">
              <select
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white shadow-sm text-sm"
                value={yachtFilter}
                onChange={(e) => setYachtFilter(e.target.value)}
              >
                <option value="">All Yachts</option>
                {yachts.map((yacht, index) => (
                  <option key={index} value={yacht}>{yacht}</option>
                ))}
              </select>
            </div>
            
            {/* Rating Filter */}
            <div className="w-full md:w-auto">
              <select
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white shadow-sm text-sm"
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
            
            {/* Reset Button */}
            <button
              className="w-full md:w-auto px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all shadow-sm font-medium text-sm"
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      
      {/* Reviews list */}
      <div className="mt-6">
        {filteredReviews.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredReviews.map((review) => (
              <li key={review.id} className="hover:bg-gray-50 transition-all">
                <div className="px-6 py-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="flex items-center mb-3 md:mb-0">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center overflow-hidden">
                        {review.customerAvatar ? (
                          <img src={review.customerAvatar} alt={review.customerName} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-lg font-medium">{review.customerName.charAt(0)}</span>
                        )}
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">{review.customerName}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">Yacht: <span className="font-medium text-gray-700">{review.yachtName}</span></span>
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-base font-medium text-gray-900 mb-1">{review.reviewTitle}</h3>
                    <p className="text-sm text-gray-700">{review.reviewText}</p>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-3">
                    <button 
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors text-sm"
                      onClick={() => {
                        setCurrentReview(review);
                        setShowViewModal(true);
                      }}
                    >
                      <FaEye className="text-sm" />
                      <span>View</span>
                    </button>
                    
                    <button 
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
                      onClick={() => handleApproveReview(review.id)}
                    >
                      <FaCheck className="text-sm" />
                      <span>Approve</span>
                    </button>
                    
                    <button 
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                      onClick={() => handleRejectReview(review.id)}
                    >
                      <FaBan className="text-sm" />
                      <span>Reject</span>
                    </button>
                    
                    <button 
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                      onClick={() => {
                        setCurrentReview(review);
                        setResponseText('');
                        setShowResponseModal(true);
                      }}
                    >
                      <FaReply className="text-sm" />
                      <span>Respond</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-12 text-center">
            <svg className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No pending reviews found</h3>
            <p className="text-gray-500">There are no reviews that match your search criteria.</p>
          </div>
        )}
      </div>
      
      {/* View Review Modal */}
      {showViewModal && currentReview && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-5 sm:px-6">
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
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center overflow-hidden">
                            {currentReview.customerAvatar ? (
                              <img src={currentReview.customerAvatar} alt={currentReview.customerName} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-lg font-medium">{currentReview.customerName.charAt(0)}</span>
                            )}
                          </div>
                          <div className="ml-3">
                            <h4 className="text-sm font-medium text-gray-900">{currentReview.customerName}</h4>
                            <p className="text-sm text-gray-500">
                              {new Date(currentReview.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-900">
                          {renderStars(currentReview.rating)}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                        <h5 className="text-md font-semibold text-gray-800 mb-2">{currentReview.reviewTitle}</h5>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{currentReview.reviewText}</p>
                      </div>
                      
                      <div className="mt-3 text-sm text-gray-500">
                        <span className="font-medium text-gray-700">Yacht:</span> {currentReview.yachtName}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 pt-3 border-t border-gray-200">
                      <button 
                        className="flex-1 inline-flex justify-center items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm font-medium"
                        onClick={() => {
                          handleApproveReview(currentReview.id);
                          setShowViewModal(false);
                        }}
                      >
                        <FaCheck className="text-sm" />
                        <span>Approve</span>
                      </button>
                      
                      <button 
                        className="flex-1 inline-flex justify-center items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
                        onClick={() => {
                          setResponseText('');
                          setShowViewModal(false);
                          setShowResponseModal(true);
                        }}
                      >
                        <FaReply className="text-sm" />
                        <span>Respond & Approve</span>
                      </button>
                      
                      <button 
                        className="flex-1 inline-flex justify-center items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
                        onClick={() => {
                          handleRejectReview(currentReview.id);
                          setShowViewModal(false);
                        }}
                      >
                        <FaBan className="text-sm" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
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
                    Respond to Review
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
                      <h4 className="text-md font-medium text-gray-700 mb-2">Review by {currentReview.customerName}</h4>
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                        <div className="text-sm text-gray-900 mb-1">
                          {renderStars(currentReview.rating)}
                        </div>
                        <h5 className="text-sm font-semibold text-gray-800 mb-1">{currentReview.reviewTitle}</h5>
                        <p className="text-xs text-gray-600">{currentReview.reviewText}</p>
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
                    
                    <div className="mb-4">
                      <div className="flex items-center">
                        <input
                          id="approve-checkbox"
                          name="approve-checkbox"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="approve-checkbox" className="ml-2 block text-sm text-gray-900">
                          Approve review when responding
                        </label>
                      </div>
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
                        status: 'approved',
                        responded: true, 
                        responseText: responseText,
                        responseDate: now
                      } : r
                    );
                    setReviews(updatedReviews);
                    // Notify other components about the status change
                    emitReviewStatusChanged(currentReview.id, 'approved');
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

export default PendingReviewsComponent; 