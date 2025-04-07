import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
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
import Grid from "@mui/material/Grid2";
import { MdClear } from "react-icons/md";
import { Share2Icon, HeartIcon } from "@radix-ui/react-icons";
import styled from "styled-components";
import { FaCheckCircle, FaUserSecret } from "react-icons/fa";
import { accentColor } from "../../../cssCode";
import { FaCircleUser } from "react-icons/fa6";

const OwnerModal = ({ YachtOwner }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const shareOptions = [
    { icon: <Link />, text: "Copy Link" },
    { icon: <Mail />, text: "Email" },
    { icon: <Message />, text: "Messages" },
    { icon: <WhatsApp />, text: "WhatsApp" },
    { icon: <LiaFacebookMessenger />, text: "Messenger" },
    { icon: <Facebook />, text: "Facebook" },
    { icon: <Twitter />, text: "Twitter" },
    { icon: <MoreHoriz />, text: "More options" },
  ];

  const OwnerPhoto = styled.img`
    width: 64px; /* w-16 */
    height: 64px; /* h-16 */
    border-radius: 50%; /* rounded-full */
    object-fit: cover;
  `;
  const OwnerContainer = styled.div`
    display: flex;
    // justify-content: space-between;
    padding: 10px;
    align-items: center;
    gap: 20px;
  `;

  const defaultpic =
    "https://a0.muscache.com/im/pictures/user/7ba83062-4094-4be7-a7f8-4a435ae1bbba.jpg?im_w=240";
  return (
    <div>
      {/* Share Icon to trigger modal */}
      <IconButton onClick={handleOpen}>
        {YachtOwner?.profilePicture ? (
          <OwnerPhoto
            src={YachtOwner?.profilePicture || defaultpic} // Replace with actual owner photo URL
            alt="Boat Owner"
          />
        ) : (
          <div
            style={{
              borderRadius: "50%",
              background: `${accentColor.gray}`,
              color:`${accentColor.haddingColor}`
            }}
          >
            {/* <FaUserSecret size={40}  /> */}
            <FaCircleUser  size={50}/>
          </div>
        )}

        {/* Replace with actual owner's name */}
      </IconButton>

      {/* Modal for share options */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "40%",
            bgcolor: "background.paper",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
          }}
        >
          {/* Title */}
          <IconButton onClick={handleClose}>
            <MdClear size={30} style={{ cursor: "pointer", color: "black" }} />
          </IconButton>

          <OwnerContainer>
          {YachtOwner?.profilePicture ? (
          <OwnerPhoto
            src={YachtOwner?.profilePicture || defaultpic} // Replace with actual owner photo URL
            alt="Boat Owner"
          />
        ) : (
          <div
            style={{
              borderRadius: "50%",
              padding: "10px",
              background: `${accentColor.gray}`,
            }}
          >
            <FaUserSecret size={40} />
          </div>
        )}
            <div>
              <Typography variant="h6" fontWeight={"bold"}>
                Meet your host, {YachtOwner?.name}
              </Typography>
              <Typography>
                {" "}
                <FaCheckCircle style={{ color: "#1bc1ef" }} /> 5 bookings
              </Typography>
            </div>
          </OwnerContainer>

          {/* <Typography variant="h5"  sx={{ mb: 2, fontWeight: "bold" }}>
            Share this experience
          </Typography> */}

          {/* Yacht/Experience Details */}
          <Typography variant="p" color="black" sx={{ mb: 3, width: "90%" }}>
            Hey there! We're Kira & Geoffrey, your go-to Airbnb Experience
            gurus, sailing the seas of fun since 2013!
            <br></br>
            <br></br>
            As pioneers in yacht and party boat tours, we've been making waves
            in the Airbnb world, offering top-notch nautical adventures without
            breaking your bank. Our mission? To craft unforgettable memories
            that float your boat!
            <br></br>
            <br></br>
            Our crew? A stellar team with thousands of rave reviews and
            world-class experiences under our belts. We're more than hosts;
            we're creators of tailor-made aquatic escapades, just for you!
            <br></br>
            <br></br>
            Safety and fun sail together with us. Each team member is a licensed
            US Coast Guard Captain, CPR/First Aid certified, and part of a
            strict Drug & Alcohol testing program. With years of navigating
            Miami's vibrant waters, we're thrilled to share our passion and
            expertise. Get ready to anchor down some epic moments with us!
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default OwnerModal;
