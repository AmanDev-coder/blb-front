import React, { useEffect, useState, useContext, useRef } from "react";
import styled from "styled-components";
import {
  Menu as HamburgerIcon,
  Search,
  Anchor,
  X as CloseIcon,
  MapPin,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Calendar,
  MessageSquare,
  Globe,
  Ship,
  Shield
} from "lucide-react"; 
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../Redux/authReducer/action";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// Modern glassmorphism header with improved aesthetics
const HeaderWrapper = styled.header`
  background: ${props => props.scrolled 
    ? "rgba(255, 255, 255, 0.95)" 
    : "rgba(255, 255, 255, 0.8)"};
  backdrop-filter: blur(10px);
  padding: 1rem 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  font-family: "Poppins", sans-serif;
  box-shadow: ${props => props.scrolled 
    ? "0 10px 30px rgba(0, 0, 0, 0.10)" 
    : "none"};
  transition: all 0.3s ease;
`;

const HeaderContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  
  @media (max-width: 1024px) {
    padding: 0 1rem;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  svg {
    margin-right: 0.5rem;
    color: #2563eb;
  }
  
  &:hover {
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

// Enhanced search container with dropdown support
const SearchContainer = styled.div`
  flex: 1;
  margin: 0 2rem;
  max-width: 500px;
  position: relative;

  @media (max-width: 1024px) {
    margin: 0 1rem;
  }
  
  @media (max-width: 768px) {
    margin: 0;
    order: 3;
    max-width: 100%;
    width: 100%;
    margin-top: ${props => props.isSearchFocused ? "1rem" : "0"};
    transition: all 0.3s ease;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

// Modern search input with improved focus states
const SearchInput = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 1rem 0 3rem;
  border-radius: 24px;
  background-color: #f8fafc;
  color: #1e293b;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
  transition: all 0.3s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
    background-color: #ffffff;
  }

  @media (max-width: 768px) {
    padding: 0 1rem 0 2.5rem;
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  
  @media (max-width: 768px) {
    left: 0.75rem;
  }
`;

// Beautiful search button with gradient and hover effects
const SearchButton = styled.button`
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(29, 78, 216, 0.3);

  &:hover {
    background: linear-gradient(135deg, #2563eb, #1e40af);
    transform: translateY(-50%) scale(1.05);
    box-shadow: 0 4px 12px rgba(29, 78, 216, 0.4);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 1024px) {
    gap: 1rem;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

// Enhanced navigation links with improved hover effects
const NavLink = styled.a`
  color: #374151;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  
  &:after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(to right, #3b82f6, #1d4ed8);
    transform: scaleX(0);
    transition: transform 0.3s ease;
    transform-origin: center;
  }

  &:hover {
    color: #2563eb;

    &:after {
      transform: scaleX(1);
    }
  }
`;

// Modern mobile menu with improved animations
const MenuContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 80%;
  height: 100%;
  background-color: white;
  color: #1e293b;
  z-index: 1002;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

// Overlay for mobile menu
const MenuOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  backdrop-filter: blur(4px);
`;

const MenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const MenuCloseButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f1f5f9;
    color: #1e293b;
  }
`;

// Enhanced menu links with icons and better styling
const MenuLink = styled.a`
  color: #1e293b;
  padding: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  
  svg {
    color: #3b82f6;
  }

  &:hover {
    background-color: #f1f5f9;
    transform: translateX(5px);
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f1f5f9;
    color: #1e293b;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

// Improved dropdown with animations and better styling
const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownTrigger = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 9999px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f1f5f9;
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-weight: 600;
  font-size: 0.875rem;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserName = styled.span`
  font-weight: 500;
  color: #1e293b;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background-color: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
  z-index: 1002;
  min-width: 200px;
  padding: 0.5rem;
`;

const DropdownItem = styled.button`
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  color: #1e293b;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: #3b82f6;
  }

  &:hover {
    background-color: #f1f5f9;
  }
`;

// Location dropdown styled components (from SearchFilters.jsx)
const DropdownLocationContainer = styled(motion.div)`
  position: absolute;
  top: 60px;
  left: 0;
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 1rem;
  max-height: 60vh;
  overflow-y: auto;
`;

const LocationItem = styled(motion.div)`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  color: #334155;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f1f5f9;
    transform: translateX(5px);
  }
`;

// Animation variants
const dropdownVariants = {
  hidden: { 
    opacity: 0,
    y: -10,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: "easeIn"
    }
  }
};

const menuVariants = {
  hidden: { x: "100%" },
  visible: { 
    x: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 250
    }
  },
  exit: { 
    x: "100%",
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300
    }
  }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export default function Header({ onSearch, isdark }) {
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLocationDropdownVisible, setIsLocationDropdownVisible] = useState(false);
  
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector((store) => store.authReducer.isAuth);
  const token = useSelector((store) => store.authReducer.token);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const user = JSON.parse(sessionStorage.getItem("user")) || null;
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return "U";
    return user.name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  // Fetch location suggestions (from SearchFilters.jsx)
  const fetchSuggestions = async () => {
    if (!searchTerm) {
      setSuggestions([]);
      setIsLocationDropdownVisible(false);
      return;
    }
    
    try {
      const response = await axios.get(
        `${BASE_URL}/locations?locationQuery=${searchTerm}`
      );
      setSuggestions(response.data);
      setIsLocationDropdownVisible(true);
    } catch (err) {
      console.error("Error fetching location suggestions:", err);
      // Fallback default suggestions if API fails
      setSuggestions([
        { description: "Miami, Florida, USA" },
        { description: "Greece" },
        { description: "Croatia" },
        { description: "Italy" }
      ]);
      setIsLocationDropdownVisible(true);
    }
  };

  // Debounce search input
  useEffect(() => {
    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (event) => {
      // Close menu if clicked outside
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      
      // Close dropdown if clicked outside
      if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      
      // Close location dropdown if clicked outside search area
      if (isLocationDropdownVisible && searchRef.current && !searchRef.current.contains(event.target)) {
        setIsLocationDropdownVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("click", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen, isDropdownOpen, isLocationDropdownVisible]);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    console.log("Search term:", searchTerm);
    onSearch(searchTerm);
    setIsLocationDropdownVisible(false);
    navigate("/yacht-rentals");
  };

  const handleLocationSelect = (location) => {
    setSearchTerm(location);
    setIsLocationDropdownVisible(false);
    handleSearch();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    dispatch(logoutUser);
    setIsDropdownOpen(false);

    if (user?.role === "admin") {
      navigate("/adminLogin");
    } else {
      navigate("/auth");
    }
  };

  const handleProfile = () => {
    setIsDropdownOpen(false);
    if (user?.role === "b") {
      navigate("/ownerDashboard");
    } else {
      navigate("/profile");
    }
  };

  return (
    <HeaderWrapper scrolled={scrolled}>
      <HeaderContainer>
        <Logo onClick={() => navigate("/")}>
          <Anchor size={24} />
          Book Luxury Yacht
        </Logo>
        
        <SearchContainer 
          ref={searchRef}
          isSearchFocused={isSearchFocused}
        >
          <SearchWrapper>
            <SearchIconWrapper>
              <MapPin size={18} />
            </SearchIconWrapper>
            
            <SearchInput
              type="text"
              placeholder="Search destinations, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              onKeyDown={handleKeyDown}
            />
            
            <SearchButton onClick={handleSearch}>
              <Search size={16} />
            </SearchButton>
            
            <AnimatePresence>
              {isLocationDropdownVisible && suggestions.length > 0 && (
                <DropdownLocationContainer
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {suggestions.map((suggestion, index) => (
                    <LocationItem
                      key={suggestion.place_id || index}
                      onClick={() => handleLocationSelect(suggestion.description)}
                    >
                      <MapPin size={16} style={{ marginRight: "12px", color: "#3b82f6" }} />
                      {suggestion.description}
                    </LocationItem>
                  ))}
                </DropdownLocationContainer>
              )}
            </AnimatePresence>
          </SearchWrapper>
        </SearchContainer>
        
        <Nav>
          <NavLink href="#" onClick={() => navigate("/yacht-rentals")}>
            Explore
          </NavLink>
          
          <NavLink href="#" onClick={() => navigate("/about-us")}>
            About Us
          </NavLink>
          
          <NavLink href="#" onClick={() => navigate("/privacy-policy")}>
            Privacy Policy
          </NavLink>
          
          <NavLink onClick={()=>navigate(user?.role=="b" ? "/ownerDashboard" : "/ownerSignup")}>
            List Your Yacht
          </NavLink>
          
          {user ? (
            <DropdownContainer ref={dropdownRef}>
              <DropdownTrigger onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <UserAvatar>
                  {user.profileImage ? 
                    <img src={user.profileImage} alt={user.name} /> : 
                    getUserInitials()
                  }
                </UserAvatar>
                <UserName>{user.name}</UserName>
                <ChevronDown size={16} />
              </DropdownTrigger>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <DropdownMenu
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <DropdownItem onClick={handleProfile}>
                      <Settings size={16} />
                      Dashboard
                    </DropdownItem>
                    <DropdownItem onClick={() => navigate("/my-bookings")}>
                      <Calendar size={16} />
                      My Bookings
                    </DropdownItem>
                    <DropdownItem onClick={handleLogout}>
                      <LogOut size={16} />
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                )}
              </AnimatePresence>
            </DropdownContainer>
          ) : (
            <NavLink href="/auth">
              Login / Sign Up
            </NavLink>
          )}
        </Nav>
        
        <HamburgerButton onClick={toggleMenu}>
          <HamburgerIcon size={24} />
        </HamburgerButton>
      </HeaderContainer>
      
      <AnimatePresence>
        {menuOpen && (
          <>
            <MenuOverlay
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setMenuOpen(false)}
            />
            
            <MenuContainer
              ref={menuRef}
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <MenuHeader>
                <Logo onClick={() => {
                  navigate("/");
                  setMenuOpen(false);
                }}>
                  <Anchor size={24} />
                  Book Luxury Yacht
                </Logo>
                
                <MenuCloseButton onClick={toggleMenu}>
                  <CloseIcon size={24} />
                </MenuCloseButton>
              </MenuHeader>
              
              {user ? (
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                    <UserAvatar style={{ width: "40px", height: "40px", fontSize: "1rem" }}>
                      {user.profileImage ? 
                        <img src={user.profileImage} alt={user.name} /> : 
                        getUserInitials()
                      }
                    </UserAvatar>
                    <div>
                      <div style={{ fontWeight: "600", color: "#1e293b" }}>{user.name}</div>
                      <div style={{ fontSize: "0.875rem", color: "#64748b" }}>{user.email}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <MenuLink href="/auth">
                  <User size={20} />
                  Login / Sign Up
                </MenuLink>
              )}
              
              <MenuLink onClick={() => {
                navigate("/yacht-rentals");
                setMenuOpen(false);
              }}>
                <Search size={20} />
                Explore Yachts
              </MenuLink>
              
              <MenuLink onClick={() => {
                navigate("/about-us");
                setMenuOpen(false);
              }}>
                <User size={20} />
                About Us
              </MenuLink>
              
              <MenuLink onClick={() => {
                navigate("/privacy-policy");
                setMenuOpen(false);
              }}>
                <Shield size={20} />
                Privacy Policy
              </MenuLink>
              
              <MenuLink onClick={() => {
                navigate(user?.role=="b" ? "/ownerDashboard" : "/ownerSignup");
                setMenuOpen(false);
              }}>
                <Ship size={20} />
                List Your Yacht
              </MenuLink>
              
              {user && (
                <>
                  <MenuLink onClick={() => {
                    handleProfile();
                    setMenuOpen(false);
                  }}>
                    <Settings size={20} />
                    Dashboard
                  </MenuLink>
                  
                  <MenuLink onClick={() => {
                    navigate("/my-bookings");
                    setMenuOpen(false);
                  }}>
                    <Calendar size={20} />
                    My Bookings
                  </MenuLink>
                  
                  <MenuLink onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}>
                    <LogOut size={20} />
                    Logout
                  </MenuLink>
                </>
              )}
            </MenuContainer>
          </>
        )}
      </AnimatePresence>
    </HeaderWrapper>
  );
}
