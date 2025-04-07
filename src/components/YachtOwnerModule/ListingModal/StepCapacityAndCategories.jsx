import { useEffect, useState } from "react";

const StepCapacityAndCategories = ({
  formData,
  setFormData,
  errors,
//   handleAddCategory,
  handleChange,
}) => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
     const fetchCategories = async () => {
       try {
         const response = await fetch(
           `${import.meta.env.VITE_API_BASE_URL}/categories`
         );
 
         const data = await response.json();
         setCategories(data);
       } catch (error) {
         console.error("Error fetching categories:", error);
       } finally {
       }
     };
 
     fetchCategories();
   }, []);

   const handleAddCategory = () => {
     setFormData((prev) => ({
       ...prev,
       categories: [...prev.categories, { major: "", sub: "" }],
     }));
   };
   
     const handleCategoryChange = (index, field, value) => {
          setFormData((prev) => {
            const updatedCategories = [...prev.categories];
            updatedCategories[index][field] = value;
      
            if (field === "categoryId") {
              const selectedCategory = categories.find(
                (cat) => cat.categoryId === value
              );
              updatedCategories[index].categoryName = selectedCategory?.name || "";
              updatedCategories[index].subcategoryId = null; 
              updatedCategories[index].subcategoryName = "";
            } else if (field === "subcategoryId") {
              const selectedCategory = categories.find(
                (cat) => cat.categoryId === updatedCategories[index].categoryId
              );
              const selectedSubcategory = selectedCategory?.subcategories.find(
                (sub) => sub.subcategoryId === value
              );
              updatedCategories[index].subcategoryName =
                selectedSubcategory?.name || "";
            }
      
            return { ...prev, categories: updatedCategories };
          });
        }; 
  return (
    <div className="step">
      <h3>Capacity & Categories</h3>

      {/* Capacity Input */}
      <div className="field">
        <label>Capacity (Number of Passengers)*</label>
        <input
          type="number"
          name="capacity"
          placeholder="Enter capacity (e.g., 12)"
          value={formData.capacity}
          onChange={handleChange} // Uses parent's handleChange
          min="1"
        />
        <small>
          Additional documentation may be required for operation with more than
          12 passengers. Learn more here.
        </small>
        {errors.capacity && <p className="error">{errors.capacity}</p>}
      </div>

      <hr />

      {/* Categories Section */}
      <div className="field categories">
        <h4>Categories*</h4>
        {formData.categories.map((category, index) => (
          <div key={index} className="category">
            {/* Major Category */}
            <div className="field">
              <label>Main Category (#{index + 1})*</label>
              <select
                value={category.categoryId || ""}
                onChange={(e) =>
                  handleCategoryChange(index, "categoryId", e.target.value)
                }
              >
                <option value="" disabled>
                  Select Main Category
                </option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Subcategory */}
              {category.categoryId && (
                <>
                  <label>Subcategory*</label>
                  <select
                    value={category.subcategoryId || ""}
                    onChange={(e) =>
                      handleCategoryChange(
                        index,
                        "subcategoryId",
                        e.target.value
                      )
                    }
                  >
                    <option value="" disabled>
                      Select Subcategory
                    </option>
                    {categories
                      .find((cat) => cat.categoryId === category.categoryId)
                      ?.subcategories.map((sub) => (
                        <option
                          key={sub.subcategoryId}
                          value={sub.subcategoryId}
                        >
                          {sub.name}
                        </option>
                      ))}
                  </select>
                </>
              )}
            </div>
            {index > 0 && <hr />} {/* Divider for new categories */}
          </div>
        ))}
      </div>

      {/* Add New Category Button */}
      <button
        type="button"
        onClick={handleAddCategory}
        className="add-category-button"
      >
        + Add Another Category
      </button>

      {errors.categories && <p className="error">{errors.categories}</p>}
    </div>
  );
};

export default StepCapacityAndCategories;
