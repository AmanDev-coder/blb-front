const StepCancellationPolicy = ({ formData, setFormData, errors }) => {
     const handleCancellationChange = (key, value) => {
       setFormData((prev) => ({
         ...prev,
         cancellationPolicy: {
           ...prev.cancellationPolicy,
           [key]: value,
         },
       }));
     };
   
     return (
       <div className="step">
         <h3>Cancellation Policy & Rental Agreement</h3>
   
         {/* Refund Percentage */}
         <div className="field">
           <label>Refund Percentage*</label>
           <input
             type="number"
             min="0"
             max="100"
             value={formData.cancellationPolicy.refund}
             onChange={(e) =>
               handleCancellationChange("refund", parseInt(e.target.value) || 0)
             }
           />
           <small>
             Specify the percentage of the booking price to be refunded for
             cancellations.
           </small>
           {errors.refund && <p className="error">{errors.refund}</p>}
         </div>
   
         {/* Days Prior for Refund Eligibility */}
         <div className="field">
           <label>Days Prior for Cancellation*</label>
           <input
             type="number"
             min="0"
             value={formData.cancellationPolicy.daysPrior}
             onChange={(e) =>
               handleCancellationChange("daysPrior", parseInt(e.target.value) || 0)
             }
           />
           <small>
             Specify the minimum days prior to the rental start date for full refund
             eligibility.
           </small>
           {errors.daysPrior && <p className="error">{errors.daysPrior}</p>}
         </div>
   
         <hr />
   
         {/* Security Allowance */}
         <div className="field">
           <label>Security Allowance (Optional)</label>
           <input
             type="number"
             min="0"
             value={formData.securityAllowance}
             onChange={(e) =>
               setFormData((prev) => ({
                 ...prev,
                 securityAllowance: parseFloat(e.target.value) || 0,
               }))
             }
           />
           <small>
             Specify an optional security deposit amount to cover potential damages
             or issues.
           </small>
         </div>
   
         <hr />
   
         {/* Rental Agreement */}
         <div className="field">
           <label>Rental Agreement</label>
           <textarea
             value={formData.rentalAgreement}
             onChange={(e) =>
               setFormData((prev) => ({
                 ...prev,
                 rentalAgreement: e.target.value,
               }))
             }
             placeholder="Provide the rental agreement terms or leave the default text."
             rows={8}
           />
           <small>
             Provide a detailed rental agreement outlining policies for cancellations,
             late arrivals, safety considerations, and other important terms.
           </small>
         </div>
       </div>
     );
   };
   
   export default StepCancellationPolicy;
   