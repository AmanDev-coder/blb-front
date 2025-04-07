
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { MdDeleteOutline } from "react-icons/md";
import { RiChatDeleteLine } from "react-icons/ri";
import React from "react";
import { Modal, Typography, IconButton } from "@mui/material";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
const CompareProductsModal = ({ open, onClose, products ,onRemove}) => {
  if (!products || products.length === 0) return null;

  const navigate=useNavigate()
  // Define the feature mappings for better readability
  const FEATURE_MAP = {
    // title: "Title",

    "priceDetails.hourly.rate": "Price Per Hour",
    averageRating: "Rating",
    capacity: "Capacity",
    amenities: "Amenities",
    cancellation_policy: "Cancellation Policy",
    // "features.make": "Make",
    // "features.model": "Model",
    "features.length": "Length",
    "features.year": "Year",

    highlights: "Highlights",
    // description: "Description",
  };

  // Extract all features to display from the first product
  const featureKeys = Object.keys(FEATURE_MAP);

  // Helper function to get feature value dynamically
  const getFeatureValue = (product, key) => {
    const keys = key.split(".");
    let value = product;
    keys.forEach((k) => {
      value = value?.[k];
    });

    
    // Handle special cases (e.g., Amenities)
    if (key === "amenities") {
      return (
        product?.features?.amenities
          ?.filter((amenity) => amenity.available) // Show only available ones
          ?.map((amenity) => amenity.title) // Extract only title
          ?.join(" , ") || "N/A" // Join with newline for better readability
      );
    }
    if (key === "priceDetails.hourly.rate") {
      const currencySymbol = product?.priceDetails?.currency?.symbol || "$"; // Default to $
      return value ? `${currencySymbol}${value}` : "N/A";
    }
    if (key === "Remove") {
      return (
        <button style={{padding:"5px"}}>Remove</button>
      );
    }
    // Handle lengths, prices, or fallback to "N/A"
    return value ?? "N/A";
  };
  console.log(products);
  return (
    <Modal open={open} onClose={onClose}>
      <StyledModal>
        {/* Header */}
        <Header>
          <Typography variant="h5">Compare Products</Typography>
          {/* <ProductCount>
            <Typography variant="h6">{products.length}</Typography>
            <span>Products to compare</span>
          </ProductCount> */}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Header>

        {/* Table */}
        <ScrollableTableContainer>
          <StyledTable>
            <thead>
              <tr>
                <th>
                  <SidebarTop>
                    <div>
                      <Typography variant="h4">{products.length}</Typography>
                      <Typography>Products</Typography>
                    </div>

                    <ArrowNavigation>
                      <button>
                        <ArrowBackIcon />
                      </button>
                      <div className="divider"></div>
                      <button>
                        <ArrowForwardIcon />
                      </button>
                    </ArrowNavigation>
                  </SidebarTop>
                </th>
                {products.map((product, index) => (
                  <th key={index}>
                    <ProductHeader>
                      {/* <Typography variant="subtitle1">
                        {product.title}
                      </Typography> */}
                      {/* <button style={{padding:"8px",backGround:"gray"}}>Remove</button> */}
                      {/* <RiChatDeleteLine  size={25} style={{color:"blue"}} /> */}

                      <ProductContainer>
                        <ProductImage
                          src={product?.images[0]?.imgeUrl}
                          alt={product.title}
                        />
                        <DeleteButton
                          onClick={() => onRemove(product._id)}
                          title="Remove Product"
                        >
                          <MdDeleteOutline size={20} />
                        </DeleteButton>
                        <ChooseButton
                          onClick={() =>navigate(`/${product._id}`)}
                          title="Choose Product"
                        >
                          <IoMdCheckmarkCircleOutline size={20} />
                          {/* <MdDeleteOutline size={20} /> */}
                        </ChooseButton>
                      </ProductContainer>

                      {/* <Typography>
                      ${product.priceDetails.price} / {product.priceDetails.unit}
                    </Typography> */}
                    </ProductHeader>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
             
              {featureKeys.map((key, index) => (
                <tr key={index}>
                  <td>
                    <Typography
                      style={{
                        borderBottom: "1px solid #c2bdbd",
                        padding: "5px",
                      }}
                    >
                      {FEATURE_MAP[key]}
                    </Typography>
                  </td>
                  {products.map((product, productIndex) => (
                    <>
                     

                      <td key={productIndex}>
                        <Typography>{getFeatureValue(product, key)}</Typography>
                      </td>
                    </>
                  ))}
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </ScrollableTableContainer>
      </StyledModal>
    </Modal>
  );
};

const ProductContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(24, 24, 234, 0.5);;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  padding: 5px;
  display: none;
  align-items: center;
  justify-content: center;

  ${ProductContainer}:hover & {
    display: flex;
  }

  &:hover {
    background: rgba(7, 7, 222, 0.5);
  }
`;
const ChooseButton = styled.button`
  position: absolute;
  top: 35px;
  right: 5px;
  background:  rgba(78, 147, 238, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  padding: 5px;
  display: none;
  align-items: center;
  justify-content: center;

  ${ProductContainer}:hover & {
    display: flex;
  }

  &:hover {
    background: rgba(62, 131, 221, 0.5)
  }
`;
const SidebarTop = styled.div`
  text-align: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const ArrowNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 25px; /* Pill shape */
  overflow: hidden; /* To clip the divider */
  width: 100px; /* Adjust based on your design */
  height: 40px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  & > button {
    flex: 1;
    border: none;
    background: none;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #f5f5f5;
    }

    &:active {
      background-color: #e0e0e0;
    }

    svg {
      font-size: 16px;
      color: #333;
    }
  }

  & > .divider {
    width: 1px;
    background-color: #ccc;
    height: 60%; /* Adjust the height of the divider */
  }
`;

const StyledModal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 90%;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden; /* Prevent overflow of modal content */
  display: flex;
  flex-direction: column;
`;
const ScrollableTableContainer = styled.div`
  flex: 1; /* Allow the container to fill the modal height */
  overflow-y: auto; /* Enable vertical scrolling */
  overflow-x: hidden; /* Prevent horizontal scrolling */
  // padding: 10px; /* Optional padding around the scrollable area */

  /* Optional custom scrollbar styles */
  &::-webkit-scrollbar {
    width: 8px; /* Vertical scrollbar width */
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc; /* Thumb color */
    border-radius: 5px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f8f9fa; /* Track color */
  }
`;

const StyledTable = styled.table`
  width: 100%; /* Ensure the table spans the container width */
  border-collapse: collapse; /* Remove gaps between cells */

  th,
  td {
    padding: 15px;
    border-right: 1px solid #ddd;
    vertical-align: middle;
  }

  /* Sticky Header */
  th {
    background-color: white; /* Ensure a solid background for sticky headers */
    font-weight: bold;
    position: sticky;
    top: 0; /* Make the header sticky */
    z-index: 1; /* Ensure the header stays above scrolling content */
    // border-bottom: 2px solid #ddd; /* Add a solid border for better separation */
  }
  td:first-child,
  th:first-child {
    background-color: #f0f4ff; /* Light blue background */
    font-weight: bold; /* Optional: Make text bold */
    text-align: center; /* Optional: Align text to the left */
  }
  /* Alternate Row Backgrounds */
  tbody tr:nth-child(odd) {
    // background-color: #f9f9f9; /* Light gray background for odd rows */
  }
  td:first-child {
  }
  /* Optional Hover Effect */
  tbody tr:hover {
    // background-color: #f1f1f1; /* Highlight row on hover */
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ddd;
`;

const ProductCount = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  h6 {
    font-size: 1.5rem;
    font-weight: bold;
  }

  span {
    font-size: 0.875rem;
    color: #666;
  }
`;


const ProductHeader = styled.div`
  max-width: 80%;

  display: flex;
  flex-direction: column;
  align-items: center;
  // text-align:left;
  justify-content: space-between;
  gap: 15px;
`;

const ProductImage = styled.img`
  max-width: 80%;
  margin-bottom: 5px;
  border-radius: 15px;
`;

export default CompareProductsModal;
