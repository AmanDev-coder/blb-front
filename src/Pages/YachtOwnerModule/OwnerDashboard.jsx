import React, { useState } from "react";
import styled from "styled-components"; // Import styled-components
import { Menu } from "lucide-react"; // Import the Menu icon for the hamburger button
import HeaderAdmin from "../../components/YachtOwnerModule/HeaderAdmin";
import { AppSidebar } from "../../components/YachtOwnerModule/app-sidebar";
import { useNavigate } from "react-router-dom";
import { OwnerRoutes } from "./OwnerRoutes";


const MainContainer = styled.div`
  display: flex;
  height: 100vh; /* Full height */
`;

const SidebarContainer = styled.div`
  width: ${(props) => (props.isSidebarOpen ? "240px" : "0")};
  transition: width 0.3s ease;
  margin-top: 64px; /* Adjust for the header */
  overflow: hidden; /* Prevent content overflow when closed */
  
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  transition: margin-left 0.3s ease;
  margin-left: ${(props) => (props.isSidebarOpen ? "240px" : "0")};
  margin-top: 64px; /* Adjust for the header */
`;

const OwnerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Toggle sidebar visibility
  };
  const handleLogout = () => {
    console.log("Logging out...");
    // Add your logout logic here
  };

  // Sidebar menu click handler
  const handleMenuClick = (url) => {
    navigate(url); // Navigate to the selected URL without page refresh
  };

  return (
    <MainContainer>
      <HeaderAdmin /> 
      <SidebarContainer
        style={{ width: isSidebarOpen ? "240px" : "0", overflow: "hidden" }}
      >
        <AppSidebar
          isOpen={isSidebarOpen}
          // toggleSidebar={toggleSidebar}
          onLogout={handleLogout}
          onMenuClick={handleMenuClick}
        />
      </SidebarContainer>
      <ContentContainer
        style={{ marginLeft: isSidebarOpen ? "40px" : "0", marginTop: "60px" }}
      >
   <OwnerRoutes/>
      </ContentContainer>
    </MainContainer>
  );
};

export default OwnerDashboard;
