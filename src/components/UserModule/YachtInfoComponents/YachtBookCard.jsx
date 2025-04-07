const BoatCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  // background: #f8f8f8;
  padding: 15px;
  border-radius: 10px;
  margin-top: 20px;
  // box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  img {
    width: 120px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
  }

  .details {
    flex: 1;

    h5 {
      font-size: 16px;
      margin: 0 0 5px;
      color: #333;
    }

    p {
      font-size: 14px;
      margin: 0 0 5px;
      color: #555;
    }

    small {
      font-size: 12px;
      color: #777;
    }
  }
`;

import React from "react";

export const YachtBookCard = () => {
  return (
    <div>
      {" "}
      <BoatCard>
        <img
          src={yacht?.images[0]?.imgeUrl}
          alt={yacht.title}
          style={{ width: "120px", height: "80px", borderRadius: "10px" }}
        />
        <div className="details">
          <h5>{yacht.title}</h5>
          <p>
            {yacht?.location.city}, {yacht.location.state},{" "}
            {yacht.location.country}
          </p>
        </div>
      </BoatCard>
    </div>
  );
};
