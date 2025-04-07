import React, { useState } from "react";
import styled from "styled-components";

// Main Container
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${(props) => (props.sidebarOpen ? "100px" : "40px")}; /* Adjust width based on sidebar */
  transition: margin-left 0.3s ease;
  padding: 20px;
  background-color: #ffffff;
  min-height: 100vh;
`;

// Headings
const Heading = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
`;

const SubHeading = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
`;

// Form Container
const FormContainer = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Input Group
const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  label {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }

  input,
  select {
    width: 100%;
    padding: 12px 14px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fafafa;
    box-sizing: border-box;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: #4e8fff;
      background-color: #fff;
      outline: none;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.2);
    }
  }
`;

// Full Width Input Group
const FullWidthInputGroup = styled(InputGroup)`
  grid-column: span 2;

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

// Divider
const Divider = styled.hr`
  grid-column: span 2;
  border: none;
  border-top: 1px solid #ddd;
  margin: 20px 0;
`;

// Button Container
const ButtonContainer = styled.div`
  grid-column: span 2;
  text-align: right;

  button {
    padding: 12px 20px;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    background-color: #4e8fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #357ae8;
    }
  }
`;

const ProfileUpdate = ({ sidebarOpen }) => {
  const [formData, setFormData] = useState({
    businessName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    socialSecurityNumber: "",
    federalID: "",
    phone: "",
    email: "",
    displayCurrency: "INR",
    password: "",
    timezone: "Asia/Kolkata",
  });

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted: ", formData);
  };

  return (
    <MainContainer sidebarOpen={sidebarOpen}>
      <Heading>Account</Heading>
      <SubHeading>
        Please provide the details you would like to use for tax purposes.
      </SubHeading>
      <FormContainer onSubmit={handleSubmit}>
        {/* Business Name */}
        <FullWidthInputGroup>
          <label htmlFor="businessName">Individual or Business Name*</label>
          <input
            type="text"
            id="businessName"
            placeholder="Enter your business name"
            value={formData.businessName}
            onChange={(e) => handleInputChange("businessName", e.target.value)}
            required
          />
        </FullWidthInputGroup>

        {/* Address Line 1 */}
        <InputGroup>
          <label htmlFor="addressLine1">Address Line 1*</label>
          <input
            type="text"
            id="addressLine1"
            placeholder="Enter your address"
            value={formData.addressLine1}
            onChange={(e) => handleInputChange("addressLine1", e.target.value)}
            required
          />
        </InputGroup>

        {/* Address Line 2 */}
        <InputGroup>
          <label htmlFor="addressLine2">Address Line 2</label>
          <input
            type="text"
            id="addressLine2"
            placeholder="Enter your address"
            value={formData.addressLine2}
            onChange={(e) => handleInputChange("addressLine2", e.target.value)}
          />
        </InputGroup>

        {/* City */}
        <InputGroup>
          <label htmlFor="city">City*</label>
          <input
            type="text"
            id="city"
            placeholder="City"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            required
          />
        </InputGroup>

        {/* State */}
        <InputGroup>
          <label htmlFor="state">State/Province*</label>
          <input
            type="text"
            id="state"
            placeholder="State"
            value={formData.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
            required
          />
        </InputGroup>

        {/* Zip Code */}
        <InputGroup>
          <label htmlFor="zipCode">Zip Code*</label>
          <input
            type="text"
            id="zipCode"
            placeholder="Zip Code"
            value={formData.zipCode}
            onChange={(e) => handleInputChange("zipCode", e.target.value)}
            required
          />
        </InputGroup>

        {/* Divider */}
        <Divider />

        {/* Social Security Number */}
        <InputGroup>
          <label htmlFor="socialSecurityNumber">
            Social Security Number* (XXX-XX-XXXX)
          </label>
          <input
            type="text"
            id="socialSecurityNumber"
            placeholder="123-45-6789"
            value={formData.socialSecurityNumber}
            onChange={(e) =>
              handleInputChange("socialSecurityNumber", e.target.value)
            }
          />
        </InputGroup>

        {/* Federal ID */}
        <InputGroup>
          <label htmlFor="federalID">Federal ID* (XX-XXXXXXX)</label>
          <input
            type="text"
            id="federalID"
            placeholder="12-3456789"
            value={formData.federalID}
            onChange={(e) => handleInputChange("federalID", e.target.value)}
          />
        </InputGroup>

        {/* Phone */}
        <FullWidthInputGroup>
          <label htmlFor="phone">
            Phone* <span style={{ fontSize: "12px" }}>India 🇮🇳 +91</span>
          </label>
          <input
            type="tel"
            id="phone"
            placeholder="+91 87400 41513"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            required
          />
          <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
            Your phone number is only shared once you make a booking.
          </p>
        </FullWidthInputGroup>

        {/* Divider */}
        <Divider />

        {/* Email */}
        <InputGroup>
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            placeholder="kavita@bookluxuryyacht.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
          />
        </InputGroup>

        {/* Display Currency */}
        <InputGroup>
          <label htmlFor="displayCurrency">Display Currency*</label>
          <select
            id="displayCurrency"
            value={formData.displayCurrency}
            onChange={(e) =>
              handleInputChange("displayCurrency", e.target.value)
            }
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </InputGroup>

        {/* Password */}
        <InputGroup>
          <label htmlFor="password">Password*</label>
          <input
            type="password"
            id="password"
            placeholder="••••••••••••••••••••"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            required
          />
        </InputGroup>

        {/* Timezone */}
        <InputGroup>
          <label htmlFor="timezone">Timezone*</label>
          <select
            id="timezone"
            value={formData.timezone}
            onChange={(e) => handleInputChange("timezone", e.target.value)}
          >
            <option value="Asia/Kolkata">Asia/Kolkata</option>
            <option value="GMT">GMT</option>
            <option value="EST">EST</option>
            <option value="PST">PST</option>
          </select>
        </InputGroup>

        {/* Save Button */}
        <ButtonContainer>
          <button type="submit">Save Changes</button>
        </ButtonContainer>
      </FormContainer>
    </MainContainer>
  );
};

export default ProfileUpdate;
