import styled from "styled-components";

export const Heading = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`;

export const SubHeading = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
  box-sizing: border-box;
  &:focus {
    border-color: #4e8fff;
  }
`;

export const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
`;

export const StyledButton = styled.button`
  padding: 12px;
  background: blue;
`;
