import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "../../Styles/ListingCard.scss";
import { useDispatch } from "react-redux";
import { DeleteYachtListing, EditYachtListing } from "../../Redux/yachtReducer/action";
import {  useNavigate } from "react-router-dom";
const placeholderImage = "https://via.placeholder.com/320x180";

const ListingCard = ({ listing, onDelete,onEdit ,onPublish}) => {
  const { _id, title,short_description, description, photos, published, images} = listing;
const dispatch =useDispatch()
const navigate =useNavigate()
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };



  const handleDelete = () => {
    onDelete(_id); // Remove the card
    dispatch(DeleteYachtListing(listing._id))
    handleMenuClose();
window.location.reload()
  };


  // Get the first image URL or fallback
  const getImageUrl = () => {
    if (images && images.length > 0) {
      return images[0].imgeUrl; // Fetch first image URL from array
    }
    return placeholderImage; // Return placeholder if no images
  };

  return (
    <div className="listing-card">
      <div className={`status-container ${listing.isLive ? "published" : "draft"}`}>
        <div className="status-dot"></div>
        <span>{listing.isLive ? "Live" : "Draft"}</span>
      </div>

      <div className="image-container">
        <img
           src={getImageUrl()}
           alt={title || "No Title Provided"}
        />
      </div>

      <CardContent>
        <Typography variant="h6" className="title">
          {title || "Untitled Yacht"}
        </Typography>
        <Typography variant="body2" className="description">
          {short_description || "No description provided."}
        </Typography>
      </CardContent>

      <div className="footer-container">
        <div className="update-indicator">
          <ErrorOutlineIcon fontSize="small" />
          Updates Required
        </div>
        <IconButton
          size="small"
          className="more-button"
          onClick={handleMenuClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          className="dropdown-menu"
        >
          <MenuItem onClick={
            ()=>{onEdit(listing?._id)
              handleMenuClose()  
            }

          }>Edit</MenuItem>
          <MenuItem onClick={()=>{
            handleMenuClose()
            navigate(`/preview/${_id}`)

          }}>Preview Listing</MenuItem>
          <MenuItem onClick={()=>{
            handleMenuClose()
            navigate(`/preview/${_id}`)

          }}>View Live Listing</MenuItem>
          <MenuItem onClick={handleMenuClose}>Snooze</MenuItem>
          {listing.isLive ? (
            <MenuItem onClick={onPublish} >
              unpublish
            </MenuItem>
          ) : (
            <MenuItem onClick={onPublish}>Publish</MenuItem>
          )}
          <MenuItem onClick={()=>{
            onDelete()
            handleMenuClose()
            }}>Delete</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default ListingCard;
