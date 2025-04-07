import React from "react";
import { Modal } from "@mui/material";
import { MdClear, MdAccessTime, MdCalendarToday, MdAttachMoney, MdDirectionsBoat } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const BookNowModal = ({ isOpen, onClose, instaBookings, yacht }) => {
  const boatId = yacht?._id;
  const navigate = useNavigate();

  const handleCheckout = (id) => {
    navigate(`/book-now/${boatId}/${id}`);
  };

  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onClose={onClose} className="flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 z-0"></div>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-5 px-6 relative z-10">
          <h2 className="text-xl font-bold text-center">Instant Booking</h2>
          <button 
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <MdClear className="text-white text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-64px)] p-5 relative z-10">
          {/* Yacht Info Card */}
          <div className="flex items-start gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <img
              src={yacht?.images?.[0]?.imgeUrl || "https://via.placeholder.com/120x80?text=Yacht"}
              alt={yacht?.title || "Yacht"}
              className="w-24 h-20 object-cover rounded-lg shadow-sm"
            />
            <div className="flex-1">
              <h3 className="text-base font-bold text-gray-800 mb-1">{yacht?.title || "Luxury Yacht"}</h3>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <HiUserGroup className="text-blue-500" size={16} />
                <span>{`Up to ${yacht?.capacity || "N/A"} People`}</span>
              </div>
              {yacht?.location && (
                <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                  <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{yacht?.location?.city || "Location"}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section Title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-grow bg-gradient-to-r from-blue-500 to-transparent"></div>
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-1.5 whitespace-nowrap">
              <MdDirectionsBoat className="text-blue-500" size={18} />
              Available Packages
            </h3>
            <div className="h-px flex-grow bg-gradient-to-l from-blue-500 to-transparent"></div>
          </div>

          {/* Insta Bookings */}
          <div className="space-y-4">
            {instaBookings && instaBookings.length > 0 ? (
              instaBookings.map((item, index) => (
                <div 
                  key={index}
                  className="relative border border-slate-200 rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                >
                  {/* Package label */}
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-0.5 text-xs font-semibold rounded-bl-lg z-10">
                    Package {index + 1}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-3 pr-16 group-hover:text-blue-600 transition-colors">
                      {item.tripDuration}-Hour Experience
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <MdCalendarToday className="text-blue-500 flex-shrink-0" size={16} />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Date</p>
                          <p className="text-sm text-gray-700">
                            {new Date(item.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MdAccessTime className="text-blue-500 flex-shrink-0" size={16} />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Duration</p>
                          <p className="text-sm text-gray-700">
                            {`${item.tripDuration} hours`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Captain</p>
                          <p className="text-sm text-gray-700">
                            {item.captained ? "Included" : "Not included"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Departure</p>
                          <p className="text-sm text-gray-700 truncate max-w-[120px]">
                            {item.instabookTripTimes.length > 0
                              ? `${item.instabookTripTimes[0].minStartTime} - ${item.instabookTripTimes[0].maxStartTime}`
                              : "Not available"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="text-lg font-bold text-blue-600">
                        ${item.pricing?.totals?.totalRenterPayment || "727"}
                      </div>
                      <button
                        onClick={() => handleCheckout(item._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded-md transition-colors text-sm"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">No Bookings Available</h3>
                <p className="text-gray-600 text-sm max-w-xs mx-auto mb-4">This yacht doesn't have any instant booking packages available.</p>
                <button 
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded-md transition-colors text-sm"
                >
                  <span>Contact Owner</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BookNowModal;
