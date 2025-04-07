import { useState, useRef, useEffect } from "react";
import {
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBuilding, FaSave, FaRedo,
   FaIdCard, FaCalendarAlt, FaKey, FaEye, FaEyeSlash
} from "react-icons/fa";
import styles from "./AddOwner.module.scss";
import countryCodes from "../jsondatamap/CountryCodes.json"; // JSON file for country codes
import locationSuggestions from "../jsondatamap/countries.json"; // JSON for locations
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { createYachtOwnerByAdmin } from "../../../../Redux/adminReducer.js/action";
const AddYachtOwnerComponnent = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const dispatch = useDispatch();
  // const [password, setPassword] = useState("");
  const [formData, setFormData] = useState({
    name: "",
        email: "",
        contact: "",
        countryCode: "+1",
        location: "",
        company: "",
        businessLicense: "",
        experience: "",
        website: "",
        yachts: 4,
        revenue: "$400K",
        socialMedia: "",
        registrationDate: new Date().toISOString().split("T")[0],
        ssn: null,
        age: null,
        // businessType: "",
        businessName: "",
        contacts: "",
        businessLocation: "",
        password: "",
        status: "Pending",
        profileImg: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  });

  useEffect(() => {
    setFilteredLocations(
      locationSuggestions
        .filter((loc) => loc.name && typeof loc.name === "string" && loc.name.toLowerCase().includes(searchLocation.toLowerCase()))
        .map((loc) => loc.name) // Extract only the names
    );
  }, [searchLocation]);
  

  useEffect(() => {
    setFilteredCountries(
      countryCodes.filter((code) =>
        code.name.toLowerCase().includes(formData.countryCode.toLowerCase())
      )
    );
  }, [formData.countryCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    if (formRef.current) {
      formRef.current.reset();
      setFormData({
        name: "",
        email: "",
        contact: "",
        countryCode: "+1",
        location: "",
        company: "",
        businessLicense: "",
        experience: "",
        website: "",
        socialMedia: "",
        registrationDate: "",
        ssn: "",
        age: "",
        password: "",
        status: "Active",
        businessType: "",
        businessName: "",
        contacts: "",
        businessLocation: "",
        profileImg: "",
      });
    }
  };

  // const loadOwners = () => {
  //   const storedOwners = localStorage.getItem("ownersData");
  //   return storedOwners ? JSON.parse(storedOwners) : [];
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await dispatch(createYachtOwnerByAdmin(formData));
      if (response) {
        toast.success("Yacht owner created successfully!");
    navigate("/adminn/yacht-owners");

        handleReset();
      }
    } catch (error) {
      console.error("Error creating yacht owner:", error);
      toast.error(error.response?.data?.message || "Failed to create yacht owner");
    }

    // // const owners = loadOwners();
    // const newOwner = { ...formData, id: `#Y${owners.length + 1}` };

    // // ✅ Save updated owners to localStorage
    // const updatedOwners = [...owners, newOwner];

    // ✅ Redirect to Yacht Owners page
  };

  return (
    <div className={styles.addOwnerContainer}>
      <div className={styles.header}>
        <h2>Add Yacht Owner</h2>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className={styles.ownerForm}>
        <fieldset className={styles.importantFields}>
          <legend>Owner Information</legend>

          <div className={styles.formGroup}>
            <label><FaUser /> Full Name*</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label><FaEnvelope /> Email*</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label><FaPhone /> Phone*</label>
            <div className={styles.phoneInput}>
              <input type="text" name="countryCode" className="countryCode" value={formData.countryCode} onChange={handleChange} list="countryCodes" />
              <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />
              <datalist id="countryCodes">
                {filteredCountries.map((country, index) => (
                  <option key={index} value={`${country.code} (${country.dial_code})`} />
                ))}
              </datalist>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label><FaMapMarkerAlt /> Location*</label>
            <input type="text" name="location" value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} required />
            {filteredLocations.length > 0 && (
              <ul className={styles.suggestions}>
                {filteredLocations.map((loc, index) => (
                  <li key={index} onClick={() => { setSearchLocation(loc); setFilteredLocations([]); }}>
                    {loc}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </fieldset>

        <fieldset className={styles.optionalFields}>
          <legend>Business Information</legend>
          <div className={styles.formGroup}>
            <label><FaBuilding /> Company Name*</label>
            <input type="text" name="company" value={formData.company} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label><FaIdCard /> Business License</label>
            <input type="text" name="businessLicense" value={formData.businessLicense} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label><FaCalendarAlt /> Experience (Years)</label>
            <input type="number" name="experience" value={formData.experience} onChange={handleChange} />
          </div>
        </fieldset>

        <fieldset className={styles.authFields}>
          <legend>Authentication</legend>
          <div className={styles.formGroup}>
            <label><FaKey /> Password*</label>
            <div className={styles.passwordContainer}>
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required />
              <button type="button" className={styles.togglePassword} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </fieldset>

        <fieldset className={styles.additionalFields}>
          <legend>Additional Info</legend>
          <div className={styles.formGroup}>
            <label>SSN (Optional)</label>
            <input type="text" name="ssn" value={formData.ssn} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label>Age (Optional)</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} />
          </div>
        </fieldset>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton}><FaSave /> Save Owner</button>
          <button type="button" className={styles.resetButton} onClick={handleReset}><FaRedo /> Reset</button>
        </div>
      </form>
    </div>
  );
};

// Add prop type validation
AddYachtOwnerComponnent.propTypes = {
  onOwnerAdded: PropTypes.func.isRequired,
};

export default AddYachtOwnerComponnent;
