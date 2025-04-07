import React, { useState } from "react";
import { Snackbar, Button, IconButton, Slide } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const SlideTransition = (props) => {
  return <Slide {...props} direction="left" />;
};

const CompareSnackbar = ({ selectedItems, onCompare, onClose }) => {
  const [open, setOpen] = useState(false);

  // Open the Snackbar whenever the number of selected items changes
  React.useEffect(() => {
    if (selectedItems.length >= 2) {
      setOpen(true);
    }
  }, [selectedItems]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <Snackbar
      open={open}
      TransitionComponent={SlideTransition} // Apply the slide transition
      autoHideDuration={5000} // Prevent auto-closing
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }} // Positioning at top-right
      message={`You selected ${selectedItems.length} item(s)`}
      action={
        <>
          {/* Compare Button */}
          <Button
            color="black"
            size="small"
            onClick={() => {
              onCompare(true);
              handleClose();
            }}
          >
            Compare
          </Button>

      
        </>
      }
      sx={{
        "& .MuiSnackbarContent-root": {
          backgroundColor: "gray", // Set your desired background color
        },
      }}
      style={{
        top: "180px", // Set the top position to 100px

      }}
    />
  );
};

export default CompareSnackbar;
