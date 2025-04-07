import React, { useState } from "react";
import styled from "styled-components";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import {  useNavigate } from "react-router-dom";

const PayoutAccountWrapper = styled.div`

  // font-family: "Roboto", "Helvetica", "Poppins", sans-serif;
  // margin: 5% 5% 15% 15%;
  // padding: 2% 3% 5% 5%;
  // background: rgba(242, 246, 247, 0.3);
  // box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  // border-radius: 10px;

  // display: flex;
  // flex-direction: column;
  align-items: center;
  width: 80%;
  max-width: 1200px;
  padding: 30px;
  box-sizing: border-box;
  border-radius: 8px;
  background-color: #ffffff;
  
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

const DescriptionMethod = styled.p`
  line-height: 1.5;
  font-weight: bold;
  color: #555;
`;

const MethodOptions = styled.div`
  border-radius: 10px;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
`;

const MethodDetails = styled.div`
  display: grid;
  grid-template-columns:20% 20% 50% 10%;
  align-items: center;
  gap :15px;
  padding: 15px;
  border-bottom: 1px solid #eaeaea;
`;

const MethodInfo = styled.div`
  flex: 1;
`;

const MethodTitle = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

const MethodDescription = styled.div`
  color: #666;
`;

const IconWrapper = styled.img`
  width: 50%;
//   height: auto;
//   margin-left: 20px;
`;
const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  overflow-y: hidden;
  width: 100%;
  background-color: #ffffff;
`;
export default function PayoutAccount() {
  const [selectedMethod, setSelectedMethod] = useState("");
   const navigate = useNavigate()

  return (
    <MainContainer>
 <PayoutAccountWrapper>
      <Title>Payout Account</Title>
      <Subtitle>Payout Method</Subtitle>
      <Description>
        Payout for reservations are released after the rental date and will take
        time to complete depending on your selected payout method.
      </Description>
      <DescriptionMethod>
        We can transfer payment using one of the following payout methods:
      </DescriptionMethod>

      <MethodOptions>
        {/* PayPal Option */}
        <MethodDetails>
          <IconWrapper src={"https://static.vecteezy.com/system/resources/previews/022/100/824/original/paypal-logo-transparent-free-png.png"} alt="PayPal Logo" />
          <MethodDescription>
              <strong>3 Business Days</strong>

            </MethodDescription>
            <MethodDescription>
              <strong>Paypal Withdraw Fees</strong>
              <br />
              PayPal charges a small fee for transfers to
              your bank account.
            </MethodDescription>
            <AddCircleOutlinedIcon
            onClick={()=>navigate("/admin/account-settings/payout/paypal")}
             style={{fontSize:"35px",color:"#3782d2", cursor:"pointer" }}/>

        </MethodDetails>

        {/* Account Transfer Option */}
        <MethodDetails>
                    <IconWrapper  src={"https://th.bing.com/th/id/R.8786dc129795af9ec97c71fea8cde921?rik=qkbZYDz0gS0Iuw&riu=http%3a%2f%2fxpayasia.com%2fimg%2fservices%2flogo-bank-transfer-black.png&ehk=HPag3OvY4EZfDLuqd%2f89qyGppV43RRJqyV0FDFcqO%2bQ%3d&risl=&pid=ImgRaw&r=0"}/>

                    <MethodDescription>
              <strong>5-7 Business Days</strong>

            </MethodDescription>
            <MethodDescription>
              <strong>No Fee</strong>
              <br />
            
               Business day processing only; weekends and banking
              holidays may cause delays.
            </MethodDescription>
           
            <AddCircleOutlinedIcon 
            onClick={()=>navigate("/admin/account-settings/payout/bank")}
            
            style={{fontSize:"35px",color:"#3782d2", cursor:"pointer"}}/>

        </MethodDetails>
      </MethodOptions>

      {selectedMethod && (
        <Description>
          You have selected{" "}
          <strong>
            {selectedMethod === "paypal" ? "PayPal" : "Account Transfer"}
          </strong>
          .
        </Description>
      )}
    </PayoutAccountWrapper>
    </MainContainer>
   
  );
}
