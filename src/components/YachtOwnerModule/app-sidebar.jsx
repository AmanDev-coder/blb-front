

"use client";
import React from "react";
import {
  BookOpen,
  Bot,
  Command,
  LifeBuoy,
  Settings2,
  LogOut,
  Menu,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../LibComponents/ui/collapsible";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from "../LibComponents/ui/sidebar";

import { ChevronRightIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const defaultUser = {
  name: "Aman Ahuja",
  email: "aman@bookyouryacht.com",
  avatar: "/path/to/default/avatar.jpg", // Provide a default avatar path
};


const data = {
  navMain: [
    // { title: "Dashboard", url: "/OwnerDashboard/dashboard", icon: Command },
    { title: "Listing", url: "/OwnerDashboard/listings", icon: Command },
    {
      title: "Availability",
      icon: BookOpen,
      url: "/OwnerDashboard/availabilitycalendar" ,
      items: [
        { title: "Block Time", url: "/OwnerDashboard/availabilitycalendar" },
        { title: "Activate InstaBook", url: "/OwnerDashboard/instantbooking" },
      ],
    },
    { title: "Inbox", url: "/OwnerDashboard/inbox", icon: LifeBuoy },
    {
      title: "Account Settings",
      icon: Settings2,
      items: [
        { title: "Payout Settings", url: "/OwnerDashboard/account-settings/payout" },
        { title: "Account Settings", url: "/OwnerDashboard/account-settings" },
        { title: "Profile Update", url: "/OwnerDashboard/profile-update" },
        { title: "Offline Listing", url: "/OwnerDashboard/account-settings/offline" },
      ],
    },
  ],
};

export function AppSidebar({
  user = JSON.parse(sessionStorage.getItem("user"))||defaultUser, // Use default user if none is provided
  isOpen,
  // toggleSidebar,
  onLogout,
  ...props
}) {
  const navigate = useNavigate();

  const handleMenuClick = (url) => {
    console.log(url)
    if (url !== "#") navigate(url); // Navigate only if it's not a placeholder
  };
console.log(user)
  return (
    <SidebarProvider>
      <div className="flex flex-col h-full">
        {/* Sidebar Component */}
        <Sidebar
          variant="inset"
          {...props}
          className={`sidebar ${isOpen ? "block" : "hidden"}`}
          style={{ padding: "16px", marginTop: "90px" }}
        >
          {/* Sidebar Header */}
          <SidebarHeader className="sidebar-header">
            <div className="user-info">
             { user.photo? <img
                src={user.avatar}
                alt={`${user.name} Avatar`}
                className="avatar"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  marginBottom: "8px",
                }}
              />:<FaUserCircle size={60} style={{color:"gray"}} /> }
             
              <div>
                <p className="user-name" style={{ fontWeight: "bold" }}>
                  {user.name}
                </p>
                <p className="user-email" style={{ color: "#666" }}>
                  {user.email}
                </p>
              </div>
            </div>
          </SidebarHeader>

          {/* Sidebar Content */}
          <SidebarContent className="sidebar-group-content">
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive} // Default open for active items
                  >
                    <SidebarMenuItem>
                      {/* Top-level menu item */}
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <a href="#" onClick={() => handleMenuClick(item.url)}>
                          <item.icon size={20} />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>

                      {/* Submenu for nested items */}
                      {item.items?.length ? (
                        <>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuAction className="data-[state=open]:rotate-90">
                              <ChevronRightIcon />
                              <span className="sr-only">Toggle</span>
                            </SidebarMenuAction>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild>
                                    <a
                                      href="#"
                                      onClick={() =>
                                        handleMenuClick(subItem.url)
                                      }
                                    >
                                      <span>{subItem.title}</span>
                                    </a>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </>
                      ) : null}
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          {/* Sidebar Footer */}
          <SidebarFooter className="sidebar-footer">
            <button
              onClick={onLogout}
              className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition w-full"
            >
              Logout
            </button>
          </SidebarFooter>
        </Sidebar>

        {/* Toggle Sidebar Button */}
        {/* <button
          onClick={toggleSidebar}
          className="absolute top-24 left-64 ml-6 z-10 p-2 bg-transparent rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out"
          style={{
            zIndex: 100,
            transform: isOpen ? "translateX(0)" : "translateX(-650%)",
            backgroundColor: "#4e8fff",
            color: "white",
          }}
          dir="rtl"
        >
          <Menu size={24} />
        </button> */}
      </div>
    </SidebarProvider>
  );
}
