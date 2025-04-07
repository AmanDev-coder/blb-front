import { useEffect, useState } from "react";
import { FaSave, FaTimes, FaQuestionCircle } from "react-icons/fa";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { createFAQ, fetchFAQCategories } from "../../../../Redux/adminReducer.js/action";
import { useDispatch } from "react-redux";
// Sample FAQ categories
const faqCategories = [
  { id: 1, name: "Booking & Reservation" },
  { id: 2, name: "Yacht Specifications" },
  { id: 3, name: "Payment & Pricing" },
  { id: 4, name: "Cancellations & Refunds" },
  { id: 5, name: "Onboard Services" }
];

const AddFaqComponent = () => {
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    categoryId: "",
    category: "",
    showOnPages: "",
    status: "draft",
    featured: false,
    order: 1,
    // tags: [],
    // relatedFaqs: [],
    isVisible: true
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const dispatch = useDispatch();
  const [faqCategories, setFaqCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await dispatch(fetchFAQCategories());
        console.log(response)
        setFaqCategories(response.categories);
      } catch (error) {
        console.error('Error fetching FAQ categories:', error);
      }
    };

    fetchCategories();
  }, [dispatch]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Handle rich text editor change
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData({
      ...formData,
      answer: data
    });
    
    // Clear error when user starts typing
    if (errors.answer) {
      setErrors({
        ...errors,
        answer: null
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.question.trim()) {
      newErrors.question = "Question is required";
    }
    
    if (!formData.answer.trim()) {
      newErrors.answer = "Answer is required";
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      console.log(formData)
      try {
        const response = await dispatch(createFAQ(formData));

        if (response) {
          setShowSuccessMessage(true);
          
          // Reset form after successful submission
          setFormData({
            question: "",
            answer: "", 
            categoryId: "",
            status: "draft",
            featured: false,
            order: 1
          });

          // Hide success message after 3 seconds
          setTimeout(() => {
            setShowSuccessMessage(false);
          }, 3000);
        }
      } catch (error) {
        console.error('Error creating FAQ:', error);
        // Handle error - could set error state and display message to user
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  // const handleSubmit = (e) => {
  //   e.preventDefault();
    
  //   if (validateForm()) {
  //     setIsSubmitting(true);
      
  //     // Simulate API call
  //     setTimeout(() => {
  //       console.log("Submitted FAQ:", formData);
  //       setIsSubmitting(false);
  //       setShowSuccessMessage(true);
        
  //       // Reset form after submission
  //       setFormData({
  //         question: "",
  //         answer: "",
  //         categoryId: "",
  //         status: "draft",
  //         featured: false,
  //         order: 1
  //       });
        
  //       // Hide success message after 3 seconds
  //       setTimeout(() => {
  //         setShowSuccessMessage(false);
  //       }, 3000);
  //     }, 1000);
  //   }
  // };
  
  // Handle form reset
  const handleReset = () => {
    setFormData({
      question: "",
      answer: "",
      categoryId: "",
      status: "draft",
      featured: false,
      order: 1
    });
    setErrors({});
  };

  return (
    <div className="bg-white rounded-xl shadow-md max-w-7xl mx-auto overflow-hidden border border-gray-100">
      {/* Header section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Add New FAQ</h3>
        <p className="text-gray-600 text-sm">Create a new question and answer for the FAQ section</p>
      </div>
      
      {/* Success message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 m-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                FAQ has been successfully added!
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Form section */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="question"
              placeholder="Enter the frequently asked question"
              className={`w-full border ${errors.question ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm`}
              value={formData.question}
              onChange={handleInputChange}
            />
            {errors.question && (
              <p className="mt-1 text-sm text-red-600">{errors.question}</p>
            )}
          </div>
          
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="categoryId"
              className={`w-full border ${errors.categoryId ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm`}
              value={formData.categoryId}
              onChange={handleInputChange}
            >
              <option value="">Select a category</option>
              {faqCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
            )}
          </div>
          
          {/* Answer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Answer <span className="text-red-500">*</span>
            </label>
            <div className={`${errors.answer ? 'border border-red-500 rounded-lg' : ''}`}>
              {/* <CKEditor
                editor={ClassicEditor}
                data={formData.answer}
                onChange={handleEditorChange}
                config={{
                  toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo']
                }}
              />
               */}

              <textarea
                name="answer"
                value={formData.answer}
                onChange={handleInputChange}
                className={`w-full border ${errors.answer ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm`}
              />  
            </div>
            {errors.answer && (
              <p className="mt-1 text-sm text-red-600">{errors.answer}</p>
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
                value={formData.status}
                onChange={handleInputChange}
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
                value={formData.order}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Featured */}
            <div className="flex items-center h-full pt-6">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.featured}
                onChange={handleInputChange}
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                Featured FAQ
              </label>
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3 mt-8">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <div className="flex items-center">
              <FaTimes className="mr-2" />
              <span>Cancel</span>
            </div>
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2.5 shadow-sm text-sm font-medium rounded-lg text-white ${
              isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            <div className="flex items-center">
              <FaSave className="mr-2" />
              <span>{isSubmitting ? 'Saving...' : 'Save FAQ'}</span>
            </div>
          </button>
        </div>
      </form>
      
      {/* FAQ Writing Tips */}
      <div className="bg-blue-50 p-6 border-t border-blue-100">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <FaQuestionCircle className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">Tips for Writing Effective FAQs</h4>
            <ul className="mt-2 text-sm text-blue-700 space-y-1 list-disc pl-5">
              <li>Keep questions concise and to the point</li>
              <li>Use clear, conversational language that customers would use</li>
              <li>Avoid jargon and technical terms unless necessary</li>
              <li>Provide complete, helpful answers that address the question fully</li>
              <li>Group related questions under the same category</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFaqComponent; 