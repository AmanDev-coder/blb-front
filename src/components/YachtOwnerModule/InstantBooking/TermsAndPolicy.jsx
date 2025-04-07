import React from "react";
import "./TermsAndPolicy.css";

const TermsAndPolicy = () => {
  return (
    <div className="terms-policy">
      <h3 className="section-header">Terms and Cancellation Policy</h3>
      <p className="policy-text">
        Service fees are non-refundable. <br />
        100% refund of amount up to 1 day prior to the booking date.
      </p>
      <div className="divider"></div>
      <h4 className="section-subheader">Security Allowance</h4>
      <p className="policy-text">$70.00 as damage & incidentals</p>
    </div>
  );
};

export default TermsAndPolicy;
