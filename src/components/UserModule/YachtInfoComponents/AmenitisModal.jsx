import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  WhatsApp,
  Mail,
  Link,
  Message,
  MoreHoriz,
} from "@mui/icons-material";
import { LiaFacebookMessenger } from "react-icons/lia";
import { MdClear } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import styled from "styled-components";

const AmenitiesModal = ({ open, handleClose, featuresList }) => {
  const BigScreen = styled.div`
    margin-top: 0;
    margin-bottom: 5px;
    @media (max-width: 768px) {
      display: none;
    }
  `;

  const SmallScreen = styled.div`
    display: none;
    margin-bottom: 5px;
    @media (max-width: 768px) {
      display: block;
    }
  `;

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "80%", md: "40%" }, // Responsive width
            maxWidth: "600px", // Maximum width for large screens
            bgcolor: "background.paper",
            borderRadius: "16px", // Rounded corners
            boxShadow: 24,
            p: { xs: 2, md: 4 }, // Responsive padding
            maxHeight: "80vh", // Limits the modal height
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            paddingTop: { xs: "10px", md: "20px" }, // Responsive padding at top
            paddingBottom: { xs: "10px", md: "20px" }, // Padding at bottom
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 10,
            }}
          >
            <MdClear size={30} style={{ cursor: "pointer", color: "black" }} />
          </IconButton>

          {/* Modal Title */}
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontWeight: "bold",
              fontSize: { xs: "18px", md: "24px" }, // Responsive font size
            }}
          >
          All Popular  Amenities
          </Typography>

          {/* Scrollable content with top and bottom padding */}
          <Box
            sx={{
              // flexGrow: 1,
              paddingTop: "10px",
              paddingRight: 0, 
              paddingBottom: "20px",
              marginRight: 0,
              overflowY: "auto",
              maxHeight: { xs: "60vh", md: "auto" }, // Limit height on mobile
            }}
          >
            <List>
              {featuresList.map((detail, index) => (
                <ListItem key={index} disableGutters sx={{ gap: "15px" }}>
                  {detail.icon ? detail.icon : <GoDotFill />}
                  <ListItemText
                    primary={detail.title}
                    primaryTypographyProps={{
                      color: "textPrimary",
                      fontSize: { xs: "14px", md: "16px" }, // Responsive text size
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default AmenitiesModal;
