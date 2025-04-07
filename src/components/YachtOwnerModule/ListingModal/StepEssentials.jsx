import React from "react";

const StepEssentials = ({ formData, errors, handleChange }) => {
  return (
    <div className="step">
      <h3>Essentials</h3>

      {/* Listing Title */}
      <div className="field">
        <label htmlFor="title">Listing Title*</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Enter a catchy title..."
          maxLength={80}
          value={formData.title || ""}
          onChange={handleChange}
        />
        <small>{formData?.title?.length}/80</small>
        {errors.title && <p className="error">{errors.title}</p>}
      </div>

      {/* Short Name */}
      <div className="field">
        <label htmlFor="shortName">Short Name*</label>
        <input
          type="text"
          id="shortName"
          name="shortName"
          placeholder="Enter a short name for the yacht"
          maxLength={32}
          value={formData.shortName || ""}
          onChange={handleChange}
        />
        <small>{formData?.shortName?.length}/32</small>
        {errors.shortName && <p className="error">{errors.shortName}</p>}
      </div>

      {/* Short description */}
      <div className="field">
        <label htmlFor="short_description">Short Description*</label>
        <p>
          This will be the first thing customers read after the title, and will
          inspire them to continue.
        </p>

        <input
          type="text"
          id="short_description"
          name="short_description"
          placeholder="Enter a short description for the yacht"
          maxLength={200}
          value={formData.short_description || ""}
          onChange={handleChange}
        />
        <small>{formData.short_description?.length}/200</small>
        {errors.short_description && (
          <p className="error">{errors.short_description}</p>
        )}
      </div>

      {/* Description */}
      <div className="field">
        <label htmlFor="description">Full Description*</label>
        <textarea
          id="description"
          name="description"
          placeholder="Provide a detailed description of the yacht..."
          maxLength={10000}
          value={formData.description || ""}
          onChange={handleChange}
          rows={6}
        />
        <small>{formData.description?.length}/10000</small>
        {errors.description && <p className="error">{errors.description}</p>}
      </div>

      {/* Live Preview */}
      <div className="preview-section">
        <h4>Live Preview</h4>
        <p>
          <strong>Listing Title:</strong>{" "}
          {formData.title || "Your listing title will appear here..."}
        </p>
        <p>
          <strong>Short Name:</strong>{" "}
          {formData.shortName || "Short name will be displayed here..."}
        </p>
        <p>
          <strong>Description:</strong>{" "}
          {formData.description || "Detailed description will be shown here..."}
        </p>
      </div>
    </div>
  );
};

export default StepEssentials;
