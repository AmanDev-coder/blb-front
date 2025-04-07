import React, { useState } from "react";
import "./PricingAccordion.css";

const PricingAccordion = ({ onPricingChange }) => {
  const [baseCost, setBaseCost] = useState("");
  const [captainCost, setCaptainCost] = useState("");
  const [isExpanded, setIsExpanded] = useState({
    payout: false,
    renter: false,
  });

  const serviceChargeRate = 0.1; // 10% for payout
  const paymentServiceRate = 0.4; // 40% for renter payment

  const toggleAccordion = (section) => {
    setIsExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const calculateTotals = () => {
    const base = parseFloat(baseCost) || 0;
    const captain = parseFloat(captainCost) || 0;
    const serviceCharge = base * serviceChargeRate;
    const paymentServiceCharge = (base + captain) * paymentServiceRate;

    return {
      totalPayout: base - serviceCharge,
      totalRenterPayment: base + captain + paymentServiceCharge,
      serviceCharge,
      paymentServiceCharge,
    };
  };

  const totals = calculateTotals();

  const handlePricingChange = () => {
    onPricingChange({ baseCost, captainCost, totals });
  };

  return (
    <div className="pricing-accordion">
      <div className="pricing-section">
        <label htmlFor="base-cost" className="pricing-label">
          Base Cost ($)
        </label>
        <input
          type="number"
          id="base-cost"
          className="pricing-input"
          value={baseCost}
          onChange={(e) => {
            setBaseCost(e.target.value);
            handlePricingChange();
          }}
        />
      </div>
      <div className="pricing-section">
        <label htmlFor="captain-cost" className="pricing-label">
          Captain Cost ($)
        </label>
        <input
          type="number"
          id="captain-cost"
          className="pricing-input"
          value={captainCost}
          onChange={(e) => {
            setCaptainCost(e.target.value);
            handlePricingChange();
          }}
        />
      </div>
      <div className="accordion">
        {/* Payout Section */}
        <div
          className={`accordion-header ${
            isExpanded.payout ? "expanded" : ""
          }`}
          onClick={() => toggleAccordion("payout")}
        >
          Your Payout
        </div>
        {isExpanded.payout && (
          <div className="accordion-content">
            <div className="pricing-breakdown">
              <span>Base Cost:</span>
              <span>${baseCost || 0}</span>
            </div>
            <div className="pricing-breakdown">
              <span>Service Charge (10%):</span>
              <span>-${totals.serviceCharge.toFixed(2)}</span>
            </div>
            <div className="pricing-breakdown total">
              <span>Total Payout:</span>
              <span>${totals.totalPayout.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Renter Payment Section */}
        <div
          className={`accordion-header ${
            isExpanded.renter ? "expanded" : ""
          }`}
          onClick={() => toggleAccordion("renter")}
        >
          Renter Payment
        </div>
        {isExpanded.renter && (
          <div className="accordion-content">
            <div className="pricing-breakdown">
              <span>Base Cost:</span>
              <span>${baseCost || 0}</span>
            </div>
            <div className="pricing-breakdown">
              <span>Captain Cost:</span>
              <span>${captainCost || 0}</span>
            </div>
            <div className="pricing-breakdown">
              <span>Payment Service Charge (40%):</span>
              <span>-${totals.paymentServiceCharge.toFixed(2)}</span>
            </div>
            <div className="pricing-breakdown total">
              <span>Total Payment:</span>
              <span>${totals.totalRenterPayment.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingAccordion;
