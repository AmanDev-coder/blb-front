import React from "react";
import styled from "styled-components";

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  overflow-y: hidden;
  width: 100%;
  background-color: #ffffff;
`;
const PayoutAccountWrapper = styled.div`
  
  align-items: center;
  width: 80%;
  max-width: 1200px;
  padding: 30px;
  box-sizing: border-box;
  border-radius: 8px;
  background-color: #ffffff;
`;
const FormWrapper = styled.div`

  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;
const Title = styled.h1`
  color: #0056b3;
`;

const Subtitle = styled.h3`
  color: #333;
  margin: 20px 0 10px;
`;

const Description = styled.p`
  color: #555;
  line-height: 1.5;
`;
const FormRow = styled.div`
  display: flex;
  flex: 1 1 48%; /* Two inputs per line */
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
`;

const Select = styled.select`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  align-items:center;
`;

const CheckboxLabel = styled.label`
  margin-left: 10px;
  color: #555;
`;

const SubmitButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #0056b3;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #004494;
  }
`;
export default function BankForm() {
  return (
 <MainContainer>
     <PayoutAccountWrapper>
            <Title>Account Holder Information</Title>
            <Description>
            Please enter the details associated with your Bank account.
          </Description>
            <FormWrapper>
      
      
          
          <CheckboxWrapper>
            <input
              type="radio"
              id="personal"
              name="accountType"
              value="personal"
            />
            <CheckboxLabel htmlFor="personal">Personal Account</CheckboxLabel>
            <br />
            <input
              type="radio"
              id="business"
              name="accountType"
              value="business"
            />
            <CheckboxLabel htmlFor="business">Business Account</CheckboxLabel>
          </CheckboxWrapper>
          <FormWrapper>
            <FormRow>
              <Label>First Name of Account Holder *</Label>
              <Input type="text" placeholder="Enter your first name" />
            </FormRow>
            <FormRow>
              <Label>Last Name *</Label>
              <Input type="text" placeholder="Enter your last name" />
            </FormRow>
            <FormRow>
              <Label>Country *</Label>
              <Select>
                <option>Select a Country</option>
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
              </Select>
            </FormRow>
            <FormRow>
              <Label>Currency *</Label>
              <Select>
                <option>Select a Currency</option>
                <option>USD</option>
                <option>CAD</option>
                <option>GBP</option>
              </Select>
            </FormRow>
            <FormRow>
              <Label>Address *</Label>
              <Input type="text" placeholder="Enter your address" />
            </FormRow>
            <FormRow>
              <Label>City *</Label>
              <Input type="text" placeholder="Enter your city" />
            </FormRow>
            <FormRow>
              <Label>State/Province *</Label>
              <Input type="text" placeholder="Enter your state/province" />
            </FormRow>
            <FormRow>
              <Label>Zip Code *</Label>
              <Input type="text" placeholder="Enter your zip code" />
            </FormRow>
          </FormWrapper>
          <SubmitButton>Submit</SubmitButton>
    </FormWrapper>
    </PayoutAccountWrapper>
 </MainContainer>

  );
}
