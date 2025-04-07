import React, { useState } from 'react'
import styled from 'styled-components'
import { Search, Anchor } from "lucide-react"
import { useNavigate } from 'react-router-dom'

const HeaderWrapper = styled.header`
  background: #f5f5f5;
  padding: 1rem 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const HeaderContainer = styled.div`
  max-width: 100vw;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: black;
  display: flex;
  align-items: center;
  cursor:pointer;
`;

const SearchContainer = styled.div`
  flex: 1;
  margin: 0 2rem;
  max-width: 600px;
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 1rem 0 3rem;
  border-radius: 9999px;
  background-color: rgba(240, 240, 240, 1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 1rem;

  &::placeholder {
    color: rgba(0, 0, 0, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #4480e0;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background-color: #4480e0;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #2f7dfb;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-right: 2rem;
`;

const NavLink = styled.a`
  color: black;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;
  cursor: pointer;

  &:hover {
    color: #4480e0;
  }
`;

const HamburgerMenu = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  svg {
    color: black;
    transition: color 0.3s ease;

    &:hover {
      color: #4480e0;
    }
  }
`;

const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  z-index: 999;
`;

const MenuModal = styled.div`
  position: absolute;
  top: 70px;
  right: 20px;
  width: 250px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 10px;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: 10px 10px;
      cursor: pointer;
      font-size: 14px;
      color: #333;
      display: flex;
      align-items: center;
      gap: 10px;
      border-radius: 8px;

      &:hover {
        background-color: #f0f0f0;
        color: #4480e0;
      }
    }
  }

  hr {
    border: none;
    border-top: 1px solid #ddd;
    margin: 10px 0;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: bold;

  span {
    background-color: #e0e0e0;
    color: #555;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    font-size: 14px;
    text-transform: uppercase;
  }
`;

export default function HeaderAdmin({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    onSearch(searchTerm);
    navigate('/yacht-rentals');
  };

  return (
    <HeaderWrapper>
      <HeaderContainer>
        <Logo onClick={()=>navigate('/')}>
          <Anchor size={24} />
          Luxury Yacht Rentals
        </Logo>
        <SearchContainer>
          <SearchWrapper>
            <SearchInput
              type="text"
              placeholder="Find places and things to do"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchButton onClick={handleSearch}>
              <Search size={20} />
            </SearchButton>
          </SearchWrapper>
        </SearchContainer>
        <Nav>
          <NavLink onClick={() => navigate('/listings')}>Listings</NavLink>
          <NavLink onClick={() => navigate('/modify-bookings')}>Modify Bookings</NavLink>
          <NavLink onClick={() => navigate('/messages')}>Messages</NavLink>
          <NavLink onClick={() => navigate('/calendar')}>Calendar</NavLink>
          <NavLink onClick={() => navigate('/ownerDashboard')}>Admin</NavLink>
        </Nav>
      </HeaderContainer>
    </HeaderWrapper>
  );
}
