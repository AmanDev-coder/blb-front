import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaArrowUp, FaArrowDown, FaSearch, FaSort } from "react-icons/fa";
import { createFAQCategory, fetchFAQCategories, updateFAQCategory, deleteFAQCategory } from "../../../../Redux/adminReducer.js/action";
import { useDispatch } from "react-redux";  
import { useCallback } from "react";
import { debounce } from "lodash";
import { toast } from "react-toastify";

// Sample FAQ Categories data
  const initialCategories = [
  {
    id: 1,
    name: "Booking & Reservation",
    description: "Questions about the booking process and reservations",
    slug: "booking-reservation",
    order: 1,
    itemsCount: 8,
    active: true,
    icon: "calendar"
  },
  {
    id: 2,
    name: "Yacht Specifications",
    description: "Details about our yacht fleet and specifications",
    slug: "yacht-specifications",
    order: 2,
    itemsCount: 6,
    active: true,
    icon: "ship"
  },
  {
    id: 3,
    name: "Payment & Pricing",
    description: "Information about payment methods and pricing details",
    slug: "payment-pricing",
    order: 3,
    itemsCount: 5,
    active: true,
    icon: "credit-card"
  },
  {
    id: 4,
    name: "Cancellations & Refunds",
    description: "Policies regarding cancellations and refund procedures",
    slug: "cancellations-refunds",
    order: 4,
    itemsCount: 4,
    active: true,
    icon: "ban"
  },
  {
    id: 5,
    name: "Onboard Services",
    description: "Questions about services available during your yacht charter",
    slug: "onboard-services",
    order: 5,
    itemsCount: 7,
    active: true,
    icon: "concierge-bell"
  }
];

const FaqCategoriesComponent = () => {
  const [categories, setCategories] = useState([]);
  // const [categories, setFilteredCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "order", direction: "asc" });
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  // const [loading, setLoading] = useState(false);
  // Available icons for categories
  const availableIcons = [
    "calendar", "ship", "credit-card", "ban", "concierge-bell", 
    "anchor", "life-ring", "cocktail", "utensils", "user-tie"
  ];

  // Handle search functionality
  // useEffect(() => {
  //   const filtered = categories.filter(category => {
  //     return category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //            category.description.toLowerCase().includes(searchTerm.toLowerCase());
  //   });
    
  //   setFilteredCategories(filtered);
  // }, [searchTerm, categories]);
  
  // // Handle sorting functionality
  // useEffect(() => {
  //   let sortedCategories = [...filteredCategories];
  //   sortedCategories.sort((a, b) => {
  //     if (a[sortConfig.key] < b[sortConfig.key]) {
  //       return sortConfig.direction === 'asc' ? -1 : 1;
  //     }
  //     if (a[sortConfig.key] > b[sortConfig.key]) {
  //       return sortConfig.direction === 'asc' ? 1 : -1;
  //     }
  //     return 0;
  //   });
    
  //   setFilteredCategories(sortedCategories);
  // }, [sortConfig]);
  
  // Handle sort request
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Open modal for adding/editing category
  const openModal = (category = null) => {
    setCurrentCategory(category || {
      id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
      name: "",
      description: "",
      slug: "",
      order: categories.length > 0 ? Math.max(...categories.map(c => c.order)) + 1 : 1,
      faqCount: 0,
      active: true,
      icon: "calendar"
    });
    setFormErrors({});
    setShowModal(true);
  };
  
  // Handle input change in the form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentCategory({
      ...currentCategory,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Generate slug if name changes
    if (name === 'name') {
      setCurrentCategory({
        ...currentCategory,
        name: value,
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      });
    }
    
    // Clear error for the field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!currentCategory.name.trim()) {
      errors.name = "Category name is required";
    }
    
    if (!currentCategory.description.trim()) {
      errors.description = "Description is required";
    }
    
    if (!currentCategory.slug.trim()) {
      errors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(currentCategory.slug)) {
      errors.slug = "Slug can only contain lowercase letters, numbers, and hyphens";
    }
    
    if (isNaN(currentCategory.order) || currentCategory.order < 1) {
      errors.order = "Order must be a positive number";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Save category
  const saveCategory = async  () => { 
    try {
      if (!validateForm()) return;
      console.log(currentCategory)
      if (currentCategory._id) {
      console.log(currentCategory)

      // Update existing category
      setCategories(categories.map(cat => 
        cat._id === currentCategory._id ? currentCategory : cat
      ));
      const response = await dispatch(updateFAQCategory(currentCategory._id, currentCategory));
      if (response) {
        toast.success("Category updated successfully");
        // setShowSuccessMessage(true);
      }
    } else {
      // Add new category
      const response = await dispatch(createFAQCategory(currentCategory));
      if (response) {
        toast.success("Category created successfully");
        // setShowSuccessMessage(true);
      } 
      setCategories([...categories, currentCategory]);
    }
    
      setShowModal(false);
  } catch (error) {
    toast.error("Error saving category:", error);
    console.error("Error saving category:", error);
  }
  };
  
  // Delete category
  const deleteCategory = async  (id) => {
    console.log(id)
    if (window.confirm("Are you sure you want to delete this category? All FAQ items in this category will be moved to 'Uncategorized'.")) {
      setCategories(categories.filter(cat => cat._id !== id));
      try {
        const response = await dispatch(deleteFAQCategory(id));
      if (response) {
        toast.success("Category deleted successfully");
        }
      } catch (error) {
        toast.error("Error deleting category:", error);
        console.error("Error deleting category:", error);
      }
    }   
  };
  
  // Reorder category
  const reorderCategory = (id, direction) => {
    const index = categories.findIndex(cat => cat.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === categories.length - 1)) {
      return;
    }
    
    const newCategories = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap the order values
    const temp = newCategories[index].order;
    newCategories[index].order = newCategories[targetIndex].order;
    newCategories[targetIndex].order = temp;
    
    // Sort by order
    newCategories.sort((a, b) => a.order - b.order);
    
    setCategories(newCategories);
  };

  // Function to get icon color class
  const getIconColorClass = (iconName) => {
    const colorMap = {
      'calendar': 'text-blue-500',
      'ship': 'text-green-500',
      'credit-card': 'text-purple-500',
      'ban': 'text-red-500',
      'concierge-bell': 'text-yellow-500',
      'anchor': 'text-blue-600',
      'life-ring': 'text-orange-500',
      'cocktail': 'text-pink-500',
      'utensils': 'text-indigo-500',
      'user-tie': 'text-teal-500'
    };
    
    return colorMap[iconName] || 'text-gray-500';
  };

  // Render the icon
  const renderIcon = (iconName) => {
    // This is a placeholder. In a real app, you'd import and use the actual icons
    return (
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconColorClass(iconName)} bg-gray-100`}>
        <span className="text-lg font-bold">{iconName.charAt(0).toUpperCase()}</span>
      </div>
    );
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


  // Fetch FAQ categories on component mount
  useEffect(() => {
    // Handle debounced search term changes
   
    const getFAQCategories = async () => {
      try {
        const params = {
          page:currentPage ,
          limit:50,
          sort: `${sortConfig.key}`,
          order: `${sortConfig.direction}`,
        };
  
        
        if (searchTerm) params.search =searchTerm ;
  
          const response = await dispatch(fetchFAQCategories(params));    

        if (response) {
          console.log(response);  
          setCategories(response.categories);
          setTotalPages(response.totalPages);
          setTotalCategories(response.totalCategories);
          // setFilteredCategories(response);
        }
      } catch (error) {
        console.error("Error fetching FAQ categories:", error);
        // Handle error appropriately
      }
    };

    getFAQCategories();
  }, [dispatch,  searchTerm, sortConfig]);

  return (
    <div className="bg-white rounded-xl shadow-md w-full mx-auto overflow-hidden border border-gray-100">
      {/* Header section with title and description */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">FAQ Categories</h3>
        <p className="text-gray-600 text-sm">Manage categories for organizing frequently asked questions</p>
      </div>
      
      {/* Search and Controls */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          {/* Add Category Button */}
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2 w-full md:w-auto"
          >
            <FaPlus className="text-sm" />
            <span>Add Category</span>
          </button>
        </div>
      </div>
      
      {/* Categories List */}
      <div className="p-4 sm:p-6 overflow-x-auto">
        {categories.length > 0 ? (
          <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-16"
                    onClick={() => requestSort('order')}
                  >
                    <div className="flex items-center">
                      <span>Order</span>
                      <FaSort className="ml-1 text-gray-400" />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-40 md:w-48"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center">
                      <span>Name</span>
                      <FaSort className="ml-1 text-gray-400" />
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Description
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell w-28">
                    Slug
                  </th>
                  <th 
                    scope="col" 
                    className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-16"
                    onClick={() => requestSort('faqCount')}
                  >
                    <div className="flex items-center justify-center">
                      <span>FAQs</span>
                      <FaSort className="ml-1 text-gray-400" />
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell w-24">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-center font-medium">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => reorderCategory(category.id, 'up')}
                          className="text-gray-400 hover:text-gray-600"
                          disabled={category.order === 1}
                        >
                          <FaArrowUp className={category.order === 1 ? "opacity-30" : ""} />
                        </button>
                        <span className="mx-1">{category.order}</span>
                        <button
                          onClick={() => reorderCategory(category.id, 'down')}
                          className="text-gray-400 hover:text-gray-600"
                          disabled={category.order === categories.length}
                        >
                          <FaArrowDown className={category.order === categories.length ? "opacity-30" : ""} />
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        {renderIcon(category.icon)}
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">{category.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      <div className="text-sm text-gray-500 truncate max-w-[200px] md:max-w-[300px] lg:max-w-[400px]">
                        {category.description.length > 70 
                          ? `${category.description.substring(0, 70)}...` 
                          : category.description}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono truncate block max-w-[100px]">{category.slug}</span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium inline-block min-w-[24px]">
                        {category.faqCount}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap hidden sm:table-cell">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        category.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900 w-7 h-7 rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors"
                          onClick={() => openModal(category)}
                        >
                          <FaEdit size={15} />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900 w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                          onClick={() => deleteCategory(category._id)}
                        >
                          <FaTrash size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new category.
            </p>
            <div className="mt-6">
              <button
                onClick={() => openModal()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Category
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Modal for Add/Edit Category */}
      {showModal && (
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {currentCategory.id ? 'Edit Category' : 'Add New Category'}
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Category Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className={`mt-1 block w-full border ${formErrors.name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                          placeholder="e.g. Booking & Reservation"
                          value={currentCategory.name || ''}
                          onChange={handleInputChange}
                        />
                        {formErrors.name && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description *
                        </label>
                        <textarea
                          name="description"
                          id="description"
                          rows="3"
                          className={`mt-1 block w-full border ${formErrors.description ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                          placeholder="Brief description of this category"
                          value={currentCategory.description || ''}
                          onChange={handleInputChange}
                        />
                        {formErrors.description && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                          Slug *
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                            faq/
                          </span>
                          <input
                            type="text"
                            name="slug"
                            id="slug"
                            className={`flex-1 block w-full border ${formErrors.slug ? 'border-red-300' : 'border-gray-300'} rounded-r-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            placeholder="booking-reservation"
                            value={currentCategory.slug || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        {formErrors.slug && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.slug}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                            Display Order
                          </label>
                          <input
                            type="number"
                            name="order"
                            id="order"
                            min="1"
                            className={`mt-1 block w-full border ${formErrors.order ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            value={currentCategory.order || ''}
                            onChange={handleInputChange}
                          />
                          {formErrors.order && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.order}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
                            Icon
                          </label>
                          <select
                            name="icon"
                            id="icon"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={currentCategory.icon || ''}
                            onChange={handleInputChange}
                          >
                            {availableIcons.map(icon => (
                              <option key={icon} value={icon}>
                                {icon.charAt(0).toUpperCase() + icon.slice(1).replace('-', ' ')}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="active"
                          name="active"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={currentCategory.active}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                          Active
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={saveCategory}
                >
                  {currentCategory._id ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(false)}
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

export default FaqCategoriesComponent; 