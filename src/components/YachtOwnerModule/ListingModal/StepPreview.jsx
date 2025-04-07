const PreviewSection = ({ title, children }) => (
     <div className="preview-section">
       <h4>{title}</h4>
       {children}
       <hr />
     </div>
   );
   

const StepPreview = ({ formData, onClose }) => {
     return (
       <div className="step preview">
         <h3 className="preview-title">Preview Your Yacht Listing</h3>
   
         {/* Essentials Section */}
         <PreviewSection title="Essentials">
           <p>
             <strong>Title:</strong> {formData.title}
           </p>
           <p>
             <strong>Short Name:</strong> {formData.shortName}
           </p>
           <p>
             <strong>Description:</strong> {formData.description}
           </p>
         </PreviewSection>
   
         {/* Location Section */}
         <PreviewSection title="Location">
           {formData.location?.coordinates ? (
             <>
               <p>
                 <strong>Latitude:</strong> {formData.location.coordinates[1]}
               </p>
               <p>
                 <strong>Longitude:</strong> {formData.location.coordinates[0]}
               </p>
             </>
           ) : (
             <p>
               <strong>Address:</strong> {formData.location?.address || "N/A"}
             </p>
           )}
         </PreviewSection>
   
         {/* Capacity & Categories Section */}
         <PreviewSection title="Capacity & Categories">
           <p>
             <strong>Capacity:</strong> {formData.capacity}
           </p>
           {formData.categories.map((category, index) => (
             <p key={index}>
               <strong>Category {index + 1}:</strong> {category.major} &gt;{" "}
               {category.sub}
             </p>
           ))}
         </PreviewSection>
   
         {/* Photos Section */}
         <PreviewSection title="Photos">
           <div className="photo-carousel">
             {formData.images.length > 0 ? (
               formData.images.map((images, index) => (
                 <img
                   key={index}
                   src={images.imgeUrl?images.imgeUrl:URL.createObjectURL(images)}
                   alt={`Photo ${index}`}
                   style={{ height: "100px", marginRight: "10px" }}
                 />
               ))
             ) : (
               <p>No photos added yet.</p>
             )}
           </div>
         </PreviewSection>
   
         {/* Vessel Details Section */}
         <PreviewSection title="Vessel Details">
           <p>
             <strong>Make:</strong> {formData.make}
           </p>
           <p>
             <strong>Model:</strong> {formData.model}
           </p>
           <p>
             <strong>Year:</strong> {formData.year}
           </p>
           <p>
             <strong>Length:</strong> {formData.length} ft
           </p>
           <p>
             <strong>Amenities:</strong>{" "}
             {formData.features.amenities.length > 0
               ? formData.features.amenities.join(", ")
               : "No features selected"}
           </p>
           {formData.features.engines.map((engine, index) => (
             <div key={index}>
               <h5>Engine {index + 1}</h5>
               <p>
                 <strong>Number:</strong> {engine.number_engines}
               </p>
               <p>
                 <strong>Horsepower:</strong> {engine.engine_horsepower} HP
               </p>
               <p>
                 <strong>Maker:</strong> {engine.engine_brand}
               </p>
               <p>
                 <strong>Model:</strong> {engine.engine_model}
               </p>
             </div>
           ))}
         </PreviewSection>
   
         {/* Pricing Section */}
         <PreviewSection title="Pricing">
           <p>
             <strong>Pricing Type:</strong> {formData.priceDetails.type}
           </p>
           {formData.priceDetails?.daily.rate && (
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
           {formData.priceDetails?.hourly.rate && (
             <>
               <p>
                 <strong>Hourly Rate:</strong> ${formData.priceDetails.hourly.rate}
               </p>
               <p>
                 <strong>Min Duration:</strong>{" "}
                 {formData.priceDetails.hourly.minDuration} hours
               </p>
             </>
           )}
           {formData.priceDetails.captainProvided && (
             <p>
               <strong>Captain Price:</strong> ${formData.priceDetails.captainPrice}
             </p>
           )}
         </PreviewSection>
   
         {/* Cancellation Policy Section */}
         <PreviewSection title="Cancellation Policy">
           <p>
             <strong>Refund:</strong> {formData.cancellationPolicy.refund}%
           </p>
           <p>
             <strong>Days Prior:</strong>{" "}
             {formData.cancellationPolicy.daysPrior} days
           </p>
           <p>
             <strong>Security Allowance:</strong> $
             {formData.securityAllowance || "N/A"}
           </p>
           <p>
             <strong>Rental Agreement:</strong> {formData.rentalAgreement || "N/A"}
           </p>
         </PreviewSection>
   
         {/* Action Buttons */}
         <div className="preview-actions">
           {/* <button onClick={onClose}>Edit</button> */}
           <button
             className="finalize-btn"
             onClick={onClose}
           >
             Finalize & Submit
           </button>
         </div>
       </div>
     );
   };
   
   export default StepPreview;
   