const StepPricing = ({
     formData,
     setFormData,
     errors,
     showBreakdown,
     setShowBreakdown,
     calculateCommission,
     calculateTotalRevenue,
   }) => {
     const handlePricingChange = (key, value) => {
       setFormData((prev) => ({
         ...prev,
         priceDetails: {
           ...prev.priceDetails,
           [key]: value,
         },
       }));
     };
   
     return (
       <div className="step">
         <h3>Pricing</h3>
   
         {/* Pricing Type Selection */}
         <div className="field">
           <label>Pricing Type*</label>
           <select
             value={formData.priceDetails.type}
             onChange={(e) => handlePricingChange("type", e.target.value)}
           >
             <option value="" disabled>
               Select Pricing Type
             </option>
             <option value="daily">Daily</option>
             <option value="hourly">Hourly</option>
             <option value="both">Daily & Hourly</option>
           </select>
           {errors.priceDetailsType && <p className="error">{errors.priceDetailsType}</p>}
         </div>
   
         <hr />
   
         {/* Daily Pricing Section */}
         {(formData.priceDetails.type === "daily" ||
           formData.priceDetails.type === "both") && (
           <div className="priceDetails-section">
             <h4>Daily Pricing</h4>
             <div className="field">
               <label>Rate Per Day*</label>
               <input
                 type="number"
                 value={formData.priceDetails.daily.rate}
                 onChange={(e) =>
                   handlePricingChange("daily", {
                     ...formData.priceDetails.daily,
                     rate: +e.target.value,
                   })
                 }
               />
             </div>
             <div className="field">
               <label>Minimum Days*</label>
               <input
                 type="number"
                 value={formData.priceDetails.daily.minDays}
                 onChange={(e) =>
                   handlePricingChange("daily", {
                     ...formData.priceDetails.daily,
                     minDays: +e.target.value,
                   })
                 }
               />
             </div>
             <div className="field">
               <label>Maximum Days*</label>
               <input
                 type="number"
                 value={formData.priceDetails.daily.maxDays}
                 onChange={(e) =>
                   handlePricingChange("daily", {
                     ...formData.priceDetails.daily,
                     maxDays: +e.target.value,
                   })
                 }
               />
             </div>
           </div>
         )}
   
         <hr />
   
         {/* Hourly Pricing Section */}
         {(formData.priceDetails.type === "hourly" ||
           formData.priceDetails.type === "both") && (
           <div className="priceDetails-section">
             <h4>Hourly Pricing</h4>
             <div className="field">
               <label>Rate Per Hour*</label>
               <input
                 type="number"
                 value={formData.priceDetails.hourly.rate}
                 onChange={(e) =>
                   handlePricingChange("hourly", {
                     ...formData.priceDetails.hourly,
                     rate: +e.target.value,
                   })
                 }
               />
             </div>
             <div className="field">
               <label>Minimum Duration (Hours)*</label>
               <input
                 type="number"
                 value={formData.priceDetails.hourly.minDuration}
                 onChange={(e) =>
                   handlePricingChange("hourly", {
                     ...formData.priceDetails.hourly,
                     minDuration: +e.target.value,
                   })
                 }
               />
             </div>
           </div>
         )}
   
         <hr />
   
         {/* Captain Services */}
         <div className="field">
           <label>Captain Provided?</label>
           <div className="toggle-container">
             <span>No</span>
             <label className="switch">
               <input
                 type="checkbox"
                 checked={formData.priceDetails.captainProvided}
                 onChange={(e) =>
                   handlePricingChange("captainProvided", e.target.checked)
                 }
               />
               <span className="slider round"></span>
             </label>
             <span>Yes</span>
           </div>
         </div>
   
         {formData.priceDetails.captainProvided && (
           <div className="field">
             <label>Captain Price (Per Booking)*</label>
             <input
               type="number"
               value={formData.priceDetails.captainPrice}
               onChange={(e) =>
                 handlePricingChange("captainPrice", +e.target.value)
               }
             />
           </div>
         )}
   
         <hr />
   
         {/* Preview Pricing Breakdown */}
         <button
           type="button"
           className="btn-preview-breakdown"
           onClick={() => setShowBreakdown(true)}
         >
           Preview Pricing Breakdown
         </button>
   
         {/* Pricing Breakdown Modal */}
         {showBreakdown && (
           <div className="priceDetails-breakdown-modal">
             <div className="modal-header">
               <h4>Pricing Breakdown</h4>
               <button className="close-btn" onClick={() => setShowBreakdown(false)}>
                 ✖
               </button>
             </div>
             <div className="modal-body">
               <p>
                 <strong>Type:</strong> {formData.priceDetails.type}
               </p>
               {formData.priceDetails.type !== "hourly" && (
                 <>
                   <p>
                     <strong>Daily Rate:</strong> ${formData.priceDetails.daily.rate}
                   </p>
                   <p>
                     <strong>Min Days:</strong> {formData.priceDetails.daily.minDays}
                   </p>
                   <p>
                     <strong>Max Days:</strong> {formData.priceDetails.daily.maxDays}
                   </p>
                 </>
               )}
               {formData.priceDetails.type !== "daily" && (
                 <>
                   <p>
                     <strong>Hourly Rate:</strong> ${formData.priceDetails.hourly.rate}
                   </p>
                   <p>
                     <strong>Min Duration:</strong> {formData.priceDetails.hourly.minDuration}{" "}
                     hours
                   </p>
                 </>
               )}
               {formData.priceDetails.captainProvided && (
                 <p>
                   <strong>Captain Price:</strong> $
                   {formData.priceDetails.captainPrice}
                 </p>
               )}
               <p>
                 <strong>Commission (12%):</strong> ${calculateCommission(formData)}
               </p>
               <p>
                 <strong>Total Revenue:</strong> ${calculateTotalRevenue(formData)}
               </p>
             </div>
             <div className="modal-footer">
               <button onClick={() => setShowBreakdown(false)}>Close</button>
             </div>
           </div>
         )}
       </div>
     );
   };
   
   export default StepPricing;
   