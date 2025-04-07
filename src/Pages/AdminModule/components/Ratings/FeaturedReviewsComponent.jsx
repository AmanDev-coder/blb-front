import { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown, FaSearch, FaStar, FaEye, FaEdit, FaTrash, FaBan } from 'react-icons/fa';

// Sample featured reviews data
const initialFeaturedReviews = [
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
    responseDate: "2023-10-16",
    displayOrder: 1
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
    responseDate: "2023-09-29",
    displayOrder: 2
  },
  {
    id: 9,
    customerName: "James Wilson",
    customerAvatar: "",
    yachtName: "Blue Horizon",
    rating: 5,
    reviewTitle: "Unforgettable birthday celebration",
    reviewText: "We booked Blue Horizon for my wife's 40th birthday and it exceeded all our expectations. The yacht was luxurious, the crew was exceptional, and they went above and beyond to make her day special with decorations and a cake. Will definitely be booking again!",
    date: "2023-09-15",
    status: "approved",
    featured: true,
    responded: true,
    responseText: "Thank you for choosing Blue Horizon for such a special celebration, James! We're honored to have been part of your wife's 40th birthday and delighted that we could help make it memorable. We look forward to hosting you again for future special occasions!",
    responseDate: "2023-09-16",
    displayOrder: 3
  }
];

const FeaturedReviewsComponent = () => {
  const [featuredReviews, setFeaturedReviews] = useState(initialFeaturedReviews);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [yachtFilter, setYachtFilter] = useState('');
  
  // Get unique yacht names for the filter
  const yachts = [...new Set(featuredReviews.map(review => review.yachtName))];
  
  // Filter and sort reviews
  useEffect(() => {
    let result = [...featuredReviews];
    
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
    
    // Sort by display order
    result.sort((a, b) => a.displayOrder - b.displayOrder);
    
    setFilteredReviews(result);
  }, [featuredReviews, searchTerm, yachtFilter]);
  
  // Event listener for testimonial featured toggle
  useEffect(() => {
    const handleReviewToggled = (event) => {
      const { reviewId, isFeatured } = event.detail;
      
      if (isFeatured) {
        // Review was added to featured
        const reviewToAdd = initialFeaturedReviews.find(r => r.id === reviewId);
        if (reviewToAdd && !featuredReviews.some(r => r.id === reviewId)) {
          const newDisplayOrder = Math.max(...featuredReviews.map(r => r.displayOrder), 0) + 1;
          setFeaturedReviews([...featuredReviews, {...reviewToAdd, displayOrder: newDisplayOrder}]);
        }
      } else {
        // Review was removed from featured
        setFeaturedReviews(featuredReviews.filter(r => r.id !== reviewId));
      }
    };
    
    document.addEventListener('reviewFeaturedToggled', handleReviewToggled);
    
    return () => {
      document.removeEventListener('reviewFeaturedToggled', handleReviewToggled);
    };
  }, [featuredReviews]);

  // Handle moving review up in order
  const handleMoveUp = (reviewId) => {
    const index = featuredReviews.findIndex(r => r.id === reviewId);
    if (index <= 0) return; // Already at top
    
    const newFeaturedReviews = [...featuredReviews];
    // Swap display orders
    const tempOrder = newFeaturedReviews[index].displayOrder;
    newFeaturedReviews[index].displayOrder = newFeaturedReviews[index - 1].displayOrder;
    newFeaturedReviews[index - 1].displayOrder = tempOrder;
    
    setFeaturedReviews(newFeaturedReviews.sort((a, b) => a.displayOrder - b.displayOrder));
  };
  
  // Handle moving review down in order
  const handleMoveDown = (reviewId) => {
    const index = featuredReviews.findIndex(r => r.id === reviewId);
    if (index === -1 || index >= featuredReviews.length - 1) return; // Already at bottom
    
    const newFeaturedReviews = [...featuredReviews];
    // Swap display orders
    const tempOrder = newFeaturedReviews[index].displayOrder;
    newFeaturedReviews[index].displayOrder = newFeaturedReviews[index + 1].displayOrder;
    newFeaturedReviews[index + 1].displayOrder = tempOrder;
    
    setFeaturedReviews(newFeaturedReviews.sort((a, b) => a.displayOrder - b.displayOrder));
  };
  
  // Handle removing a review from featured
  const handleRemoveFromFeatured = (reviewId) => {
    setFeaturedReviews(featuredReviews.filter(r => r.id !== reviewId));
    
    // Emit event to notify other components
    const event = new CustomEvent('reviewFeaturedToggled', { 
      detail: { reviewId, isFeatured: false }
    });
    document.dispatchEvent(event);
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setYachtFilter('');
  };
  
  // Render star rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <FaStar key={index} className={`${index < rating ? "text-yellow-400" : "text-gray-300"} inline-block`} />
    ));
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-4 sm:p-6">
      {/* Header section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200 -mx-6 -mt-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Featured Reviews</h3>
        <p className="text-gray-600 text-sm mb-4">Manage and order the reviews showcased on your website</p>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Featured Review Count</p>
              <p className="text-2xl font-bold text-gray-900">{featuredReviews.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaStar className="text-blue-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and filter controls */}
      <div className="p-6 border-b border-gray-200 -mx-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Search */}
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search featured reviews..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <div className="flex w-full md:w-auto flex-wrap gap-4">
            {/* Yacht Filter */}
            <div className="w-full md:w-auto">
              <select
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm text-sm"
                value={yachtFilter}
                onChange={(e) => setYachtFilter(e.target.value)}
              >
                <option value="">All Yachts</option>
                {yachts.map((yacht, index) => (
                  <option key={index} value={yacht}>{yacht}</option>
                ))}
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
      
      {/* Featured Reviews List */}
      <div className="mt-6">
        {filteredReviews.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredReviews.map((review, index) => (
              <li key={review.id} className="hover:bg-gray-50 transition-all">
                <div className="px-6 py-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 font-semibold rounded-full">
                        {index + 1}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-base font-medium text-gray-900">{review.reviewTitle}</h4>
                        <div className="flex items-center mt-1">
                          <div className="text-sm text-gray-900">
                            {renderStars(review.rating)}
                          </div>
                          <span className="ml-2 text-sm text-gray-500">by {review.customerName}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <button 
                        className="text-gray-400 hover:text-gray-600 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={index === 0}
                        onClick={() => handleMoveUp(review.id)}
                      >
                        <FaArrowUp />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-gray-600 p-1 ml-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={index === filteredReviews.length - 1}
                        onClick={() => handleMoveDown(review.id)}
                      >
                        <FaArrowDown />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-700 line-clamp-2">{review.reviewText}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span>Yacht: <span className="font-medium text-gray-700">{review.yachtName}</span></span>
                      <span className="mx-2">•</span>
                      <span>
                        {new Date(review.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
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
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                        onClick={() => handleRemoveFromFeatured(review.id)}
                      >
                        <FaBan className="text-sm" />
                        <span>Remove</span>
                      </button>
                    </div>
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
            <h3 className="text-lg font-medium text-gray-900 mb-1">No featured reviews found</h3>
            <p className="text-gray-500">Go to "All Reviews" to add reviews to featured.</p>
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
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-5 sm:px-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Featured Review
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
                      
                      {currentReview.responded && (
                        <div className="mt-3 bg-blue-50 p-3 rounded-md border border-blue-200">
                          <h5 className="text-sm font-semibold text-blue-700 mb-1">Admin Response</h5>
                          <p className="text-sm text-blue-700">{currentReview.responseText}</p>
                          <div className="mt-1 text-xs text-blue-500 text-right">
                            {new Date(currentReview.responseDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-3 text-sm text-gray-500">
                        <span className="font-medium text-gray-700">Yacht:</span> {currentReview.yachtName}
                      </div>
                      
                      <div className="mt-3 text-sm text-gray-500">
                        <span className="font-medium text-gray-700">Display Order:</span> {currentReview.displayOrder}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-200">
                      <button 
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                        onClick={() => {
                          handleRemoveFromFeatured(currentReview.id);
                          setShowViewModal(false);
                        }}
                      >
                        <FaBan className="text-sm" />
                        <span>Remove from Featured</span>
                      </button>
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
    </div>
  );
};

export default FeaturedReviewsComponent; 