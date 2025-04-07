import  { useState, useRef } from "react";
import { FaStar, FaInfoCircle, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { addTestimonial } from "../../../../Redux/adminReducer.js/action";
// import { Editor } from '@tinymce/tinymce-react';
import { useDispatch } from "react-redux";
const AddTestimonialComponent = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    position: "",
    company: "",
    yachtName: "",
    serviceDate: "",
    rating: 5,
    category: "",
    comment: "",
    featured: false,
    verified: false,
    status: "pending",
    type:"testimonial",
    userAvatar: null
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const dispatch = useDispatch();
  const editorRef = useRef(null);
  
  // Categories for dropdown
  const categories = [
    "Corporate",
    "Leisure",
    "Wedding",
    "Birthday",
    "Anniversary",
    "Family",
    "Celebration",
    "Other"
  ];
  
  // Yacht options
  const yachtOptions = [
    "Ocean Explorer",
    "Sea Breeze",
    "Sunset Dream",
    "Blue Horizon",
    "Coastal Venture",
    "Royal Wave",
    "Golden Sail",
    "Silver Tide"
  ];
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Handle rating change
  const handleRatingChange = (newRating) => {
    setFormData({ ...formData, rating: newRating });
  };
  
  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file is an image and not too large
      if (!file.type.match('image.*')) {
        setErrors({
          ...errors,
          avatar: "Please upload an image file (JPEG, PNG)"
        });
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setErrors({
          ...errors,
          avatar: "Image size should be less than 2MB"
        });
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      setFormData({
        ...formData,
        avatar: file
      });
      
      // Clear error
      if (errors.avatar) {
        setErrors({
          ...errors,
          avatar: null
        });
      }
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.userName.trim()) {
      newErrors.userName = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.position.trim()) {
      newErrors.position = "Position is required";
    }
    
    if (!formData.yachtName) {
      newErrors.yachtName = "Yacht name is required";
    }
    
    if (!formData.serviceDate) {
      newErrors.serviceDate = "Service date is required";
    }
    
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    
    if (!formData.comment && (!editorRef.current || editorRef.current.getContent().trim() === '')) {
      newErrors.comment = "Testimonial content is required";
    }
    
    return newErrors;
  };
  
  // Handle form submission
  const handleSubmit = async  (e) => {
    e.preventDefault();
    // Prevent default form submission
    e.preventDefault();

    // Create testimonial data object
    const testimonialData = {
      ...formData,
      rating: parseInt(formData.rating),
      status: formData.status || 'pending'
    };

    try {
      const response = await dispatch(addTestimonial(testimonialData));
      console.log(response)
      if (response.status === 'success') {
        toast.success('Testimonial added successfully');
      } else {
        toast.error(response.message || 'Error adding testimonial');
        setErrors({
          ...errors, 
          submit: response.message || 'Failed to submit testimonial'
        });
        return;
      }

    } catch (error) {
      console.error('Error adding testimonial:', error);
      toast.error('Error adding testimonial');
      setErrors({
        ...errors,
        submit: 'Failed to submit testimonial. Please try again.'
      });
      return;
    }
      // If rich text editor is used, get content
    if (editorRef.current) {
      formData.comment = editorRef.current.getContent();
    }
    
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          userName: "",
          email: "",
          position: "",
          company: "",
          yachtName: "",
          serviceDate: "",
          rating: 5,
          category: "",
          comment: "",
          featured: false,
          verified: false,
          status: "pending",
          userAvatar: null
        });
        setPreviewImage(null);
        setSubmitSuccess(false);
        
        // Reset editor if used
        if (editorRef.current) {
          editorRef.current.setContent('');
        }
      }, 3000);
    }, 1500);
  };
  
  // Render star rating input
  const renderRatingInput = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`text-2xl focus:outline-none ${
              star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => handleRatingChange(star)}
          >
            <FaStar />
          </button>
        ))}
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Form Header */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800">Add New Testimonial</h3>
        <p className="text-gray-600">Fill out the form below to add a new customer testimonial</p>
      </div>
      
      {/* Success Message */}
      {submitSuccess && (
        <div className="mb-6 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Testimonial has been added successfully.</span>
        </div>
      )}
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="space-y-6">
            <div className="border-b pb-3">
              <h4 className="text-md font-medium text-gray-700 mb-4">Customer Information</h4>
              
              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              
              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="john.doe@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              
              {/* Position & Company */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="position">
                    Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className={`w-full border ${
                      errors.position ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="CEO"
                  />
                  {errors.position && (
                    <p className="mt-1 text-sm text-red-500">{errors.position}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="company">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Company Name"
                  />
                </div>
              </div>
            </div>
            
            {/* Service Information */}
            <div className="border-b pb-3">
              <h4 className="text-md font-medium text-gray-700 mb-4">Service Information</h4>
              
              {/* Yacht Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="yachtName">
                  Yacht Name <span className="text-red-500">*</span>
                </label>
                <select
                  id="yachtName"
                  name="yachtName"
                  value={formData.yachtName}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.yachtName ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select Yacht</option>
                  {yachtOptions.map((yacht, index) => (
                    <option key={index} value={yacht}>{yacht}</option>
                  ))}
                </select>
                {errors.yachtName && (
                  <p className="mt-1 text-sm text-red-500">{errors.yachtName}</p>
                )}
              </div>
              
              {/* Service Date */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="serviceDate">
                  Service Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="serviceDate"
                  name="serviceDate"
                  value={formData.serviceDate}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.serviceDate ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.serviceDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.serviceDate}</p>
                )}
              </div>
              
              {/* Category */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select Category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                )}
              </div>
              
              {/* Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating <span className="text-red-500">*</span>
                </label>
                {renderRatingInput()}
              </div>
            </div>
            
            {/* Upload Avatar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Photo
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <div className="flex-shrink-0 h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                  {previewImage ? (
                    <img src={previewImage} alt="Avatar preview" className="h-full w-full object-cover" />
                  ) : (
                    <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.5 19.5h-17v-1.5A4.5 4.5 0 008 13.5h8a4.5 4.5 0 004.5 4.5zM12 2C9.8 2 8 3.8 8 6s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z" />
                    </svg>
                  )}
                </div>
                
                <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
                
                <p className="text-xs text-gray-500">
                  JPEG, PNG, GIF up to 2MB
                </p>
              </div>
              {errors.avatar && (
                <p className="mt-1 text-sm text-red-500">{errors.avatar}</p>
              )}
            </div>
            
            {/* Status and Featured */}
            <div className="flex flex-col space-y-3 border-t pt-4 mt-4">
              <div className="flex items-center">
                <input
                  id="verified"
                  name="verified"
                  type="checkbox"
                  checked={formData.verified}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="verified" className="ml-2 block text-sm text-gray-700">
                  Mark as verified customer
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="featured"
                  name="featured"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                  Feature this testimonial
                </label>
                <div className="ml-2 text-gray-500 hover:text-gray-700" title="Featured testimonials appear on the homepage and other prominent locations">
                  <FaInfoCircle size={14} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      id="status-pending"
                      name="status"
                      type="radio"
                      value="pending"
                      checked={formData.status === "pending"}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="status-pending" className="ml-2 block text-sm text-gray-700">
                      Pending
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="status-approved"
                      name="status"
                      type="radio"
                      value="approved"
                      checked={formData.status === "approved"}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="status-approved" className="ml-2 block text-sm text-gray-700">
                      Approved
                    </label>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
          
          {/* Testimonial Content */}
          <div>
            <div className="border-b pb-3 mb-4">
              <h4 className="text-md font-medium text-gray-700 mb-3">Testimonial Content <span className="text-red-500">*</span></h4>
              
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="border-b border-gray-300 bg-gray-50 px-3 py-2 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Rich Text Editor</span>
                </div>
                <div className="p-3">
                  {/* Text area for simple version */}
                  <textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    rows={10}
                    className={`w-full border ${
                      errors.content ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter the testimonial content here..."
                  />
                  
                  {/* Uncomment to enable rich text editor 
                  <Editor
                    apiKey="your-api-key" // Get free API key from TinyMCE
                    onInit={(editor) => (editorRef.current = editor)}
                    initialValue=""
                    init={{
                      height: 260,
                      menubar: false,
                      plugins: [
                        'advlist autolink lists link image',
                        'charmap preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code wordcount'
                      ],
                      toolbar:
                        'undo redo | formatselect | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat'
                    }}
                  />
                  */}
                </div>
              </div>
              {errors.content && (
                <p className="mt-1 text-sm text-red-500">{errors.content}</p>
              )}
              
              <p className="mt-2 text-xs text-gray-500">
                Testimonial should be authentic and include specific details about the customer&apos;s experience.
              </p>
            </div>
            
            {/* Preview */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-3">Preview</h4>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 mr-3">
                    {previewImage ? (
                      <img src={previewImage} alt="Avatar" className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 text-sm">
                          {formData.userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium text-gray-900">
                        {formData.userName || 'Customer Name'}
                      </p>
                      {formData.verified && (
                        <span className="ml-1 text-blue-500">
                          <FaCheckCircle className="inline" size={14} />
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {formData.position || 'Position'}{formData.company ? `, ${formData.company}` : ''}
                    </p>
                    <div className="flex items-center mt-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}
                          size={14}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700">
                      {formData.comment || 'Testimonial content will appear here...'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.yachtName && `${formData.yachtName} • `}
                      {formData.serviceDate && new Date(formData.serviceDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Form Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => {
              setFormData({
                ...formData,
                status: "pending"
              });
              handleSubmit({ preventDefault: () => {} });
            }}
          >
            Save as Draft
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTestimonialComponent; 