import React, { useEffect } from "react";
import "./YachtsList.css";
import { getOwnerYachts } from "../../../Redux/yachtReducer/action";
import { useDispatch, useSelector } from "react-redux";

// Sample Yachts Data
const placeholderImage = "https://via.placeholder.com/320x180";


const YachtsList = ({ onYachtSelect }) => {
  const OwnerYachts = useSelector((store) => store.yachtReducer.OwnerYachts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOwnerYachts);
  }, []);

  const getImageUrl = (images) => {
    if (images && images.length > 0) {
      return images[0].imgeUrl; // Fetch first image URL from array
    }
    return placeholderImage; // Return placeholder if no images
  };

  return (
    <div className="yachts-list">
      {
        OwnerYachts.length==0&&<p>No Listing Created Yet</p>
      }
      {OwnerYachts&&OwnerYachts.map((yacht) => (
        <div
          key={yacht.id}
          className="yacht-card"
          onClick={() => onYachtSelect(yacht)}
        >
          <img
            src={getImageUrl(yacht.images)}
            alt={yacht.title || "No Title Provided"}
            className="yacht-image"
          />
          <div className="yacht-details">
            <h4 className="yacht-name">{yacht.title}</h4>
            <p className="yacht-description">{yacht.short_description}</p>
          </div>
        </div>
      ))}
      
    </div>
  );
};

export default YachtsList;
