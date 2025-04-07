import { useState, useEffect, useCallback } from "react";
import { 
  FaSearch, 
  FaStar, 
  FaFilter, 
  FaTrash, 
  FaPen, 
  FaSort, 
  FaEye, 
  FaCheckCircle, 
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { fetchReviews, updateTestimonial, deleteTestimonialAndReviews } from "../../../../Redux/adminReducer.js/action";
import { debounce } from "lodash";
import { toast } from "react-toastify";
          // Sample testimonial data
const initialTestimonials = [
  {
    id: 1,
    name: "John Smith",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    position: "CEO, Tech Solutions",
    rating: 5,
    date: "2023-11-15",
    yachtName: "Ocean Explorer",
    featured: true,
    verified: true,
    content: "The yacht experience was absolutely incredible. The staff was professional and attentive to our needs. Would definitely recommend for corporate events!",
    category: "Corporate",
    status: "approved"
  },
  {
    id: 2,
    name: "Maria Garcia",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    position: "Travel Blogger",
    rating: 4,
    date: "2023-10-22",
    yachtName: "Sea Breeze",
    featured: false,
    verified: true,
    content: "Beautiful yacht and amazing service. The captain was knowledgeable about the area and took us to some hidden gems. Only giving 4 stars because the weather wasn't perfect, but that's obviously not their fault!",
    category: "Leisure",
    status: "approved"
  },
  {
    id: 3,
    name: "Robert Johnson",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    position: "Wedding Planner",
    rating: 5,
    date: "2023-12-05",
    yachtName: "Sunset Dream",
    featured: true,
    verified: true,
    content: "We hosted a wedding on the yacht and it was magical. Everything was perfect from start to finish. The crew went above and beyond to make our day special.",
    category: "Wedding",
    status: "approved"
  },
  {
    id: 4,
    name: "Emily Chen",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    position: "Family Vacationer",
    rating: 3,
    date: "2023-09-30",
    yachtName: "Blue Horizon",
    featured: false,
    verified: false,
    content: "The yacht was beautiful but smaller than it appeared in the photos. The kids enjoyed the experience but there wasn't enough space for everyone to be comfortable.",
    category: "Family",
    status: "pending"
  },
  {
    id: 5,
    name: "David Williams",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    position: "Birthday Celebrant",
    rating: 5,
    date: "2023-11-28",
    yachtName: "Ocean Explorer",
    featured: false,
    verified: true,
    content: "Had my 40th birthday celebration on this yacht and it was unforgettable! The staff was amazing and the yacht itself was luxurious. Highly recommend!",
    category: "Celebration",
    status: "approved"
  }
];

const AllTestimonialsComponent = () => {
  const dispatch = useDispatch();
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // const [limit] = useState(10);

  // Fetch testimonials with filters and sorting

  // Request sort
  // const requestSort = (key) => {
  //   let direction = 'asc';
  //   if (sortConfig.key === key && sortConfig.direction === 'asc') {
  //     direction = 'desc';
  //   }
  //   setSortConfig({ key, direction });
  // };

  // // Reset filters
  // const resetFilters = () => {
  //   setSearchTerm('');
  //   setRatingFilter('');
  //   setCategoryFilter('');
  //   setStatusFilter('');
  //   setFeaturedFilter('');
  //   setSortConfig({ key: 'date', direction: 'desc' });
  //   setCurrentPage(1);
  // };
  const [filteredTestimonials, setFilteredTestimonials] = useState(initialTestimonials);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [ratingFilter, setRatingFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");
  
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [viewTestimonial, setViewTestimonial] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editTestimonial, setEditTestimonial] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  // Categories for filter dropdown
  const categories = ["All", "Corporate", "Leisure", "Wedding", "Family", "Celebration"];

console.log(sortConfig)
  // Fetch when filters, sort or page changes
  // Debounce search term changes
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
    
    const fetchTestimonials = async () => {
      try {
        const params = {
          page: currentPage,
          limit:5,
          sort: `${sortConfig.key}`,
          order: `${sortConfig.direction}`,
          type: 'testimonial'
        };
  
        // Add filters if set
        if (ratingFilter) params.rating = ratingFilter;
        if (categoryFilter && categoryFilter !== 'All') params.category = categoryFilter;
        if (statusFilter) params.status = statusFilter;
        if (featuredFilter) params.featured = featuredFilter === 'true';
        if (searchTerm) params.search = searchTerm;
  
        const response = await dispatch(fetchReviews(params));
  
        setTestimonials(response.reviews);
        setTotalPages(response.totalPages);
        // setFilteredTestimonials(response.reviews);
  
      } catch (error) {
        console.error('Error fetching filtered testimonials:', error);
      }
    };
    fetchTestimonials();
  }, [dispatch, currentPage, ratingFilter, categoryFilter, statusFilter, featuredFilter, searchTerm, sortConfig]);
  

  // Handle search functionality
  // useEffect(() => {
  //   const filtered = testimonials.filter(testimonial => {
  //     const matchesSearch = 
  //       testimonial.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       testimonial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       testimonial.yachtName.toLowerCase().includes(searchTerm.toLowerCase());
      
  //     const matchesRating = 
  //       ratingFilter === "" || testimonial.rating.toString() === ratingFilter;
      
  //     const matchesCategory = 
  //       categoryFilter === "" || categoryFilter === "All" || testimonial.category === categoryFilter;
      
  //     const matchesStatus = 
  //       statusFilter === "" || testimonial.status === statusFilter;
      
  //     const matchesFeatured = 
  //       featuredFilter === "" || 
  //       (featuredFilter === "featured" && testimonial.featured) || 
  //       (featuredFilter === "not-featured" && !testimonial.featured);
      
  //     return matchesSearch && matchesRating && matchesCategory && matchesStatus && matchesFeatured;
  //   });
    
  //   setFilteredTestimonials(filtered);
  // }, [searchTerm, testimonials, ratingFilter, categoryFilter, statusFilter, featuredFilter]);
  
  // Handle sorting functionality
  // useEffect(() => {
  //   let sortedTestimonials = [...filteredTestimonials];
  //   sortedTestimonials.sort((a, b) => {
  //     if (a[sortConfig.key] < b[sortConfig.key]) {
  //       return sortConfig.direction === 'asc' ? -1 : 1;
  //     }
  //     if (a[sortConfig.key] > b[sortConfig.key]) {
  //       return sortConfig.direction === 'asc' ? 1 : -1;
  //     }
  //     return 0;
  //   });
    
  //   setFilteredTestimonials(sortedTestimonials);
  // }, [sortConfig]);
  
  // Handle sort request
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Toggle featured status
  const toggleFeatured = (id) => {
    const prevTestimonials = [...testimonials];
    const updatedTestimonials = testimonials.map(testimonial => 
      testimonial.id === id 
        ? { ...testimonial, featured: !testimonial.featured }
        : testimonial
    );
    setTestimonials(updatedTestimonials);
    try {
      const response = dispatch(updateTestimonial({
        id,
        featured: !testimonials.find(t => t.id === id).featured
      }));
      if (response) {
        toast.success("Featured status updated successfully");
      }
    } catch (error) {
      setTestimonials(prevTestimonials);
      toast.error("Error updating featured status");
      console.error("Error updating featured status:", error);
      return;
    }
  
    
    // Dispatch a custom event to notify other components
    const testimonial = updatedTestimonials.find(t => t.id === id);
    const event = new CustomEvent('testimonialFeaturedToggled', { 
      detail: { 
        testimonial,
        featured: testimonial.featured 
      } 
    });
    document.dispatchEvent(event);
  };
  
  // Delete testimonial
  const deleteTestimonial = async(id) => {
    console.log(id)
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      const updatedTestimonials = testimonials.filter(testimonial => testimonial.id !== id);
      setTestimonials(updatedTestimonials);
      try {
        const response = await dispatch(deleteTestimonialAndReviews(id));
      if (response) {
        toast.success("Testimonial deleted successfully");
        }
      } catch (error) {
        toast.error("Error deleting testimonial:", error);
        console.error("Error deleting testimonial:", error);
      }
    }
  };
  
  // Approve testimonial
  const approveTestimonial = (id) => {
    const updatedTestimonials = testimonials.map(testimonial => 
      testimonial.id === id 
        ? { ...testimonial, status: "approved" }
        : testimonial
    );
    setTestimonials(updatedTestimonials);
  };
  
  // Render star ratings
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <FaStar 
        key={i} 
        className={`inline ${i < rating ? "text-yellow-400" : "text-gray-300"}`} 
      />
    ));
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setRatingFilter("");
    setCategoryFilter("");
    setStatusFilter("");
    setFeaturedFilter("");
    setSortConfig({ key: "date", direction: "desc" });
  };

  // View testimonial details
  const viewTestimonialDetails = (testimonial) => {
    console.log(testimonial)
    setViewTestimonial(testimonial);
    setShowViewModal(true);
  };

  // Edit testimonial
  const openEditModal = (testimonial) => {
    setEditTestimonial({ ...testimonial });
    setShowEditModal(true);
  };

  // Save edited testimonial
  const saveEditedTestimonial = async () => {
    const prevTestimonial = [...testimonials];
    console.log(editTestimonial)
    const updatedTestimonials = testimonials.map(testimonial => 
      testimonial.id === editTestimonial.id 
          ? { ...editTestimonial }
        : testimonial
    );
    setTestimonials(updatedTestimonials);
    try {
      console.log(editTestimonial)
      const response = await dispatch(updateTestimonial(editTestimonial));
      if (response.status === 'success') {
        toast.success('Testimonial updated successfully');
    setShowEditModal(false);

      } else {
        toast.error(response.message || 'Error updating testimonial');
        return;
      }
    } catch (error) {
      setTestimonials(prevTestimonial);
      console.error('Error updating testimonial:', error);
      toast.error('Failed to update testimonial');
      return;
    }
  
    setShowEditModal(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md max-w-7xl mx-auto overflow-hidden border border-gray-100">
      {/* Header section with title and description */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">All Testimonials</h3>
        <p className="text-gray-600 text-sm">Manage and review customer testimonials from all yacht experiences</p>
      </div>
      
      {/* Search and Filter Controls */}
      <div className="p-6 border-b border-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search testimonials..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        
        {/* Filter Button */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                filterVisible ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setFilterVisible(!filterVisible)}
          >
              <FaFilter className="text-sm" />
            <span>Filter</span>
          </button>
          
            {/* Sort Dropdown */}
            <div className="relative group">
            <button
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
            >
                <FaSort className="text-sm" />
              <span>Sort</span>
            </button>
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 hidden group-hover:block min-w-[140px]">
              <div className="p-2">
                <button 
                    className="flex items-center justify-between gap-2 px-3 py-2 hover:bg-gray-100 w-full text-left rounded text-sm"
                  onClick={() => requestSort('date')}
                >
                    <span>Date</span>
                    {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? <FaArrowUp className="text-blue-500" /> : <FaArrowDown className="text-blue-500" />)}
                </button>
                <button 
                    className="flex items-center justify-between gap-2 px-3 py-2 hover:bg-gray-100 w-full text-left rounded text-sm"
                  onClick={() => requestSort('rating')}
                >
                    <span>Rating</span>
                    {sortConfig.key === 'rating' && (sortConfig.direction === 'asc' ? <FaArrowUp className="text-blue-500" /> : <FaArrowDown className="text-blue-500" />)}
                </button>
                <button 
                    className="flex items-center justify-between gap-2 px-3 py-2 hover:bg-gray-100 w-full text-left rounded text-sm"
                  onClick={() => requestSort('name')}
                >
                    <span>Name</span>
                    {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <FaArrowUp className="text-blue-500" /> : <FaArrowDown className="text-blue-500" />)}
                </button>
              </div>
            </div>
          </div>
          
          {/* Add Testimonial Button */}
          <a
            href="/adminn/add-testimonial"
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2"
            style={{ color: "#ffffff" }}
          >
              <span>Add Testimonial</span>
          </a>
        </div>
      </div>
      
      {/* Filter Panel */}
      {filterVisible && (
          <div className="bg-gray-50 p-5 rounded-xl mt-4 border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Rating Filter */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating</label>
              <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
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
            
            {/* Category Filter */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
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
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
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
      
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
          <p className="text-blue-600 font-semibold text-sm">Total Testimonials</p>
          <h3 className="text-2xl font-bold mt-1">{testimonials.length}</h3>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-all">
          <p className="text-green-600 font-semibold text-sm">Approved</p>
          <h3 className="text-2xl font-bold mt-1">
            {testimonials.filter(t => t.status === "approved").length}
          </h3>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 shadow-sm hover:shadow-md transition-all">
          <p className="text-yellow-600 font-semibold text-sm">Pending</p>
          <h3 className="text-2xl font-bold mt-1">
            {testimonials.filter(t => t.status === "pending").length}
          </h3>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-all">
          <p className="text-purple-600 font-semibold text-sm">Featured</p>
          <h3 className="text-2xl font-bold mt-1">
            {testimonials.filter(t => t.featured).length}
          </h3>
        </div>
      </div>
      
      {/* Testimonials List */}
      <div className="px-6 pb-6">
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Testimonial
              </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Yacht
              </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {testimonials.map((testimonial) => (
              <tr key={testimonial.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-start max-w-md">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img 
                        className="h-10 w-10 rounded-full object-cover shadow-sm" 
                        src={testimonial?.userAvatar||"https://randomuser.me/api/portraits/men/1.jpg"} 
                        alt=""
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.userName)}&background=0D8ABC&color=fff`;
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {testimonial.userName}
                        </div>
                        {testimonial.verified && (
                          <span className="ml-1 text-blue-500" title="Verified">
                            <FaCheckCircle className="inline" size={12} />
                          </span>
                        )}
                        {testimonial.featured && (
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{testimonial.position}</div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2 pr-4">{testimonial.comment}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {renderStars(testimonial.rating)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {testimonial.yachtName || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(testimonial.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${testimonial.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : testimonial.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <button 
                      className="text-indigo-600 hover:text-indigo-900 w-7 h-7 rounded-full flex items-center justify-center hover:bg-indigo-50 transition-colors"
                      title="View Details"
                      onClick={() => viewTestimonialDetails(testimonial)}
                    >
                      <FaEye size={15} />
                    </button>
                    <button 
                      className="text-blue-600 hover:text-blue-900 w-7 h-7 rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors"
                      title="Edit"
                      onClick={() => openEditModal(testimonial)}
                    >
                      <FaPen size={15} />
                    </button>
                    <button 
                      className={`${testimonial.featured ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-600 w-7 h-7 rounded-full flex items-center justify-center hover:bg-yellow-50 transition-colors`}
                      title={testimonial.featured ? "Remove from Featured" : "Add to Featured"}
                      onClick={() => toggleFeatured(testimonial.id)}
                    >
                      <FaStar size={15} />
                    </button>
                    {testimonial.status === 'pending' && (
                      <button 
                        className="text-green-600 hover:text-green-900 w-7 h-7 rounded-full flex items-center justify-center hover:bg-green-50 transition-colors"
                        title="Approve"
                        onClick={() => approveTestimonial(testimonial.id)}
                      >
                        <FaCheckCircle size={15} />
                      </button>
                    )}
                    <button 
                      className="text-red-600 hover:text-red-900 w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                      title="Delete"
                      onClick={() => deleteTestimonial(testimonial.id)}
                    >
                      <FaTrash size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Empty State */}
        {testimonials.length === 0 && (
          <div className="text-center py-16">
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No testimonials found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria to find what you&apos;re looking for.
            </p>
            <div className="mt-6">
              <a
                href="/adminn/add-testimonial"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Add new testimonial
              </a>
            </div>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {testimonials.length > 0 && (
        <div className="px-6 pb-6">
          <div className="bg-white px-4 py-4 flex items-center justify-between border-t border-gray-200 rounded-b-xl">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{Math.min(10, testimonials.length)}</span> of{' '}
                      <span className="font-medium">{testimonials.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors ${currentPage === i + 1 ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                {/* <button
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  1
                        </button>
                <button
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  2
                </button>
                <button
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  3
                </button> */}
                {totalPages >1 && currentPage > 1 && (
                    
                  <>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                    <button
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                  
                </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  </button>
                  </>
                )}
              </nav>  
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* View Testimonial Modal */}
      {showViewModal && viewTestimonial && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setShowViewModal(false)}>
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
                        Testimonial Details
                      </h3>
                      <button
                        onClick={() => setShowViewModal(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                          <img 
                            src={viewTestimonial.userAvataravatar}
                            alt={viewTestimonial.userName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(viewTestimonial.name)}&background=0D8ABC&color=fff`;
                            }}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 flex items-center">
                            {viewTestimonial.userName}
                            {viewTestimonial.verified && (
                              <span className="ml-1 text-blue-500" title="Verified">
                                <FaCheckCircle size={12} />
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-500">{viewTestimonial.position}</p>
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex">
                            {renderStars(viewTestimonial.rating)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(viewTestimonial.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span className="text-gray-700">Yacht: <span className="font-medium">{viewTestimonial.yachtName}</span></span>
                        <span className="px-2 py-0.5 bg-gray-200 rounded-full text-gray-700">{viewTestimonial.category}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {viewTestimonial.featured && (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            Featured
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                          ${viewTestimonial.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : viewTestimonial.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                          {viewTestimonial.status.charAt(0).toUpperCase() + viewTestimonial.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Testimonial Content</h4>
                      <p className="text-gray-700 bg-white p-4 rounded-lg border border-gray-200 whitespace-pre-line">
                        {viewTestimonial.comment}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => openEditModal(viewTestimonial)}
                >
                  Edit Testimonial
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Testimonial Modal */}
      {showEditModal && editTestimonial && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setShowEditModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div 
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Edit Testimonial
                      </h3>
                      <button
                        onClick={() => setShowEditModal(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <form className="space-y-4">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                          <img 
                            src={editTestimonial.userAvatar}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(editTestimonial.name)}&background=0D8ABC&color=fff`;
                            }}
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                              </label>
                              <input
                                type="text"
                                id="name"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={editTestimonial.userName}
                                onChange={(e) => setEditTestimonial({...editTestimonial, name: e.target.value})}
                              />
                            </div>
                            <div>
                              <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                                Position
                              </label>
                              <input
                                type="text"
                                id="position"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={editTestimonial.position}
                                onChange={(e) => setEditTestimonial({...editTestimonial, position: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                            Rating
                          </label>
                          <select
                            id="rating"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={editTestimonial.rating}
                            onChange={(e) => setEditTestimonial({...editTestimonial, rating: parseInt(e.target.value)})}
                          >
                            <option value="1">1 Star</option>
                            <option value="2">2 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="5">5 Stars</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Category
                          </label>
                          <select
                            id="category"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={editTestimonial.category}
                            onChange={(e) => setEditTestimonial({...editTestimonial, category: e.target.value})}
                          >
                            {categories.map((category, idx) => (
                              <option key={idx} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="yachtName" className="block text-sm font-medium text-gray-700">
                            Yacht Name
                          </label>
                          <input
                            type="text"
                            id="yachtName"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={editTestimonial.yachtName}
                            onChange={(e) => setEditTestimonial({...editTestimonial, yachtName: e.target.value})}
                          />
                        </div>
                        <div>
                          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                            Date
                          </label>
                          <input
                            type="date"
                            id="date"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={editTestimonial.date}
                            onChange={(e) => setEditTestimonial({...editTestimonial, date: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                          Testimonial Content
                        </label>
                        <textarea
                          id="content"
                          rows="5"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={editTestimonial.comment}
                          onChange={(e) => setEditTestimonial({...editTestimonial, comment: e.target.value})}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-8">
                        <div className="flex items-center">
                          <input
                            id="verified"
                            name="verified"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={editTestimonial.verified}
                            onChange={(e) => setEditTestimonial({...editTestimonial, verified: e.target.checked})}
                          />
                          <label htmlFor="verified" className="ml-2 block text-sm text-gray-700">
                            Verified Customer
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            id="featured"
                            name="featured"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={editTestimonial.featured}
                            onChange={(e) => setEditTestimonial({...editTestimonial, featured: e.target.checked})}
                          />
                          <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                            Featured Testimonial
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          id="status"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={editTestimonial.status}
                          onChange={(e) => setEditTestimonial({...editTestimonial, status: e.target.value})}
                        >
                          <option value="approved">Approved</option>
                          <option value="pending">Pending</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={saveEditedTestimonial}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowEditModal(false)}
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

export default AllTestimonialsComponent; 