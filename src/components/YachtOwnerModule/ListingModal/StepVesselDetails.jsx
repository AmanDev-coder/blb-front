import { useEffect, useState } from "react";

const StepVesselDetails = ({
  formData,
  errors,
  handleEngineChange,
  setFormData,
}) => 
     
     {
  const [selectedMake, setSelectedMake] = useState(null);
  const [AmenityData, setAmenityData] = useState([]);

  const [make, setMake] = useState([]);
  const [modelData, setModelData] = useState([]);
  useEffect(() => {
    if (selectedMake) {
      fetchFeatures(`model?manufacturerId=${selectedMake}`, setModelData);
      return;
    }
    fetchFeatures("make", setMake);
  }, [selectedMake]);

  const fetchFeatures = async (endpoint, setData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/features/${endpoint}`
      );
      const data = await response.json();
      console.log(data);
      setData(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      // setLoading(false);
    }
  };

  const handleMakeSelect = (e) => {
    console.log(e.target.value)
    setFormData((prev) => ({
      ...prev,
      features: { ...prev.features, [e.target.name]: e.target.value },
    }));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      // setLoading(true);
      try {
        const amRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/features/amenities`
        );
        const amenities = await amRes.json();
        setAmenityData(amenities);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleFeatureToggle = (feature) => {
    setFormData((prev) => {
      const isSelected = prev.features.amenities.includes(feature);

      const updatedAmenities = isSelected
        ? prev.features.amenities.filter((f) => f !== feature)
        : [...prev.features.amenities, feature];

      return {
        ...prev,
        features: {
          ...prev.features, // Spread the existing features object
          amenities: updatedAmenities, // Update only the amenities array
        },
      };
    });
  };

  console.log(modelData,make)
console.log(formData)
  return (
    <div className="step">
      <h3>Vessel Details</h3>

      {/* Make and Model */}
      <div className="field">
        <label>Make*</label>
        <select
          name="make"
          value={formData.features.make}
          onChange={(e) => {
            setSelectedMake(e.target.value);
            handleMakeSelect(e);
          }}
        >
          <option value="" disabled>
            Select Make
          </option>
          {make.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>
        {errors.make && <p className="error">{errors.make}</p>}
      </div>

      <div className="field">
        <label>Model*</label>

        <select
          name="model"
          value={formData.features.model} 
            onChange={(e) =>handleMakeSelect(e) }
          // disabled={!formData.features.make} // Disable until a make is selected
        >
          <option value="" >
            Select Model
          </option>
          
          {modelData.length > 0 &&
            modelData.map((md) => (
              <option key={md.name} value={md.name}>
                {md.name}
              </option>
            ))}
        </select>
        {errors.model && <p className="error">{errors.model}</p>}
      </div>

      {/* Year and Length */}
      <div className="field">
        <label>Year*</label>
        <input
          type="number"
          name="year"
          placeholder="Enter year of manufacture"
          value={formData.features.year}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              features: { ...prev.features, year: e.target.value },
            }))
          }
        />
        {errors.year && <p className="error">{errors.year}</p>}
      </div>

      <div className="field">
        <label>Length (ft)*</label>
        <input
          type="number"
          name="length"
          placeholder="Enter length in feet"
          value={formData.features.length}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              features: { ...prev.features, length: e.target.value },
            }))
          }
        />
        {errors.length && <p className="error">{errors.length}</p>}
      </div>

      <hr />

      {/* Features */}
      <div className="features-section">
        <h4>Features*</h4>
        <div className="feature-tags">
          {AmenityData.map((ame) => (
            <span
              key={ame._id}
              className={`feature-tag ${
                formData.features.amenities.includes(ame._id) ? "selected" : ""
              }`}
              onClick={() => handleFeatureToggle(ame._id)}
            >
              {ame.title}
            </span>
          ))}
        </div>
        <p>Please select any significant features for your watercraft.</p>
        {errors.features && <p className="error">{errors.features}</p>}
      </div>

      <hr />

      {/* Engine Specifications */}
      <div className="engine-specs-section">
        <h4>Engine Specifications</h4>
        {formData.features.engines.map((engine, index) => (
          <div key={index} className="engine-spec">
            <div className="field">
              <label>Engine Number*</label>
              <input
                type="text"
                value={engine.number_engines}
                onChange={(e) =>
                  handleEngineChange(index, "number_engines", e.target.value)
                }
              />
            </div>
            <div className="field">
              <label>Horsepower*</label>
              <input
                type="number"
                value={engine.engine_horsepower}
                onChange={(e) =>
                  handleEngineChange(index, "engine_horsepower", e.target.value)
                }
              />
            </div>
            <div className="field">
              <label>Maker*</label>
              <input
                type="text"
                value={engine.engine_brand}
                onChange={(e) =>
                  handleEngineChange(index, "engine_brand", e.target.value)
                }
              />
            </div>
            <div className="field">
              <label>Model*</label>
              <input
                type="text"
                value={engine.engine_model}
                onChange={(e) =>
                  handleEngineChange(index, "engine_model", e.target.value)
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepVesselDetails;
