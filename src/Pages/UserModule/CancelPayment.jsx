import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const CancelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to bottom right, #f44336, #e57373);
  color: #ffffff;
  text-align: center;
`;

const CancelIcon = styled.div`
  font-size: 80px;
  color: #fff;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 18px;
  margin-bottom: 30px;
`;

const Button = styled.button`
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background: #d32f2f;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #b71c1c;
  }
`;

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <CancelContainer>
      <CancelIcon>✘</CancelIcon>
      <Title>Payment Cancelled</Title>
      <Subtitle>Looks like you cancelled your payment. No worries, you can try again anytime.</Subtitle>
      <Button onClick={() => navigate("/book-now/:boatId/:instabookId")}>Try Again</Button>
    </CancelContainer>
  );
};

export default Cancel;
