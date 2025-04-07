import { useState } from "react";
import { useDispatch } from "react-redux";
import { DeleteYachtImage } from "../../../Redux/yachtReducer/action";

const StepPhotos = ({ formData, setFormData, errors, setErrors }) => {
  const [images, setImages] = useState([]);
  const dispatch = useDispatch();

  console.log(formData);
  const handlePhotoUpload = async (files) => {
    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length + images.length > 10) {
      setErrors({ photos: "A maximum of 10 photos can be uploaded." });
      return;
    }
    console.log(validFiles);

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));
    setErrors((prev) => ({ ...prev, photos: "" }));
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    handlePhotoUpload(e.dataTransfer.files);
  };

  const handlePhotoDelete = (index,imageId) => {
    dispatch(DeleteYachtImage(imageId))
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="step">
      <h3>Photos</h3>

      {/* Photo Upload Section */}
      <div className="photo-upload-section">
        <label>Upload Photos*</label>
        <div
          className="photo-upload-box"
          onDrop={handleFileDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <p>Drag & Drop your images here or click to upload</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handlePhotoUpload(e.target.files)}
            className="photo-input"
            style={{ display: "none" }}
          />
          <button
            type="button"
            onClick={() => document.querySelector(".photo-input").click()}
            className="upload-button"
          >
            Click to Upload Photos
          </button>
        </div>
        <small>
          A minimum of 3 photos is required. Ensure images do not contain logos,
          phone numbers, or stock photos.
        </small>
        {errors.photos && <p className="error">{errors.photos}</p>}
      </div>

      <hr />

      {/* Photo Gallery Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "10px",
        }}
      >
        {formData.images &&
          formData.images.map((images, index) => (
            <div key={index} style={{ position: "relative" }}>
              <img
                src={
               //    typeof images === "string"
                  images.imgeUrl? images.imgeUrl : URL.createObjectURL(images) // File preview
                }
                alt={`Photo ${index + 1}`}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
              <button
                onClick={() => handlePhotoDelete(index,images._id)}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              >
                ✖
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default StepPhotos;
