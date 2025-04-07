import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import Select from "react-select";
import { FaArrowLeft, FaArrowRight, FaCalendarDay, FaStar } from "react-icons/fa";
import styled from "styled-components";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  addBlock,
  deleteBlock,
  fetchAllBlocks,
  fetchBlocks,
  getAllInstaBooks,
  getOwnerYachts,
} from "../../Redux/yachtReducer/action";
import { useDispatch, useSelector } from "react-redux";
import YachtSelector from "./YachtSelector";
import CalendarView from "./CalendarView";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const placeholderImage = "https://via.placeholder.com/320x180";

const sampleYachts = [
  { value: "yacht1", label: "Luxury Yacht 1" },
  { value: "yacht2", label: "Premium Yacht 2" },
  { value: "yacht3", label: "Elite Yacht 3" },
];

const CalendarWrapper = styled.div`
  height: 100vh;
  // margin-left: 40px;
  padding: 20px;
  padding-left: 30px;

  .custom-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #007bff;
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    margin-bottom: 10px;
    box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
  }

  .toolbar-label {
    font-size: 22px;
    font-weight: bold;
  }

  .toolbar-left,
  .toolbar-right {
    display: flex;
    gap: 15px;
  }

  .toolbar-left button,
  .toolbar-right button {
    background-color: white;
    color: #007bff;
    border: none;
    border-radius: 8px;
    padding: 8px 15px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0px 4px 8px rgba(0, 123, 255, 0.2);
    transition: background-color 0.3s ease, transform 0.2s ease;
  }

  .toolbar-left button:hover,
  .toolbar-right button:hover {
    background-color: #0056b3;
    color: white;
    transform: scale(1.1);
  }

  .rbc-btn-group {
    display: flex;
    gap: 15px;
  }

  .rbc-btn-group button {
    background-color: white;
    color: #007bff;
    border: none;
    border-radius: 8px;
    padding: 10px 15px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
    transition: all 0.3s ease;
  }

  .rbc-btn-group button:hover {
    background-color: #0056b3;
    color: white;
    transform: scale(1.1);
  }

  .rbc-day-bg {
    background-color: #ffffff;
    transition: background-color 0.3s ease;
    border-radius: 5px;
  }

  .rbc-day-bg:hover {
    background-color: #f0f8ff;
  }

  .rbc-day-bg.locked {
    background-color: rgba(255, 0, 0, 0.8);
    pointer-events: none;
    cursor: not-allowed;
    border-radius: 5px;
  }

  .rbc-event {
    border: none;
    border-radius: 8px;
    padding: 5px;
    text-align: center;
    color: white;
    font-weight: bold;
  }

  .rbc-event.locked {
    background-color: rgb(255, 0, 0) !important;
  }

  @media (max-width: 768px) {
    .rbc-toolbar {
      flex-direction: column;
      align-items: flex-start;
    }

    .rbc-toolbar-label {
      margin-bottom: 10px;
    }

    .rbc-btn-group button {
      padding: 8px;
      font-size: 12px;
    }
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  // background-color: #fff;
  border-radius: 15px;
  width: 600px;
  max-width: 90%;
  min-height: 300px;
  max-height: 70vh;
  radius: 15px;
  position: relative;

  .block-modal-header {
    padding: 20px;
    // border-bottom: 1px solid #ddd;
    text-align: center;
    font-size: 26px;
    font-weight: bold;
    color: #333;
    text-transform: uppercase;
    letter-spacing: 1px;
    // background: #f9f9f9;
  }

  .block-modal-content {
    flex: 1;
    padding: 20px 30px;
    scrollbar-width: none; /* Hides scrollbar for modern browsers */
    -ms-overflow-style: none; /* Hides scrollbar for Internet Explorer/Edge */
    overflow-y: auto;
    background: #fff;

    display: flex;
    flex-direction: column;
    align-items: center; /* Center content inside the modal */

    .block-modal-content::-webkit-scrollbar {
      display: none; /* Hides scrollbar for WebKit-based browsers */
    }

    .block-yacht-info {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
      margin-bottom: 20px;
      padding: 10px;
      border: 1px solid #eee;
      border-radius: 8px;
      cursor: pointer;
      // transition: background-color 0.3s ease-in-out;

      &:hover {
        background-color: #f9f9f9;
      }

      img {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        object-fit: cover;
      }

      .yacht-details {
        h3 {
          margin: 0;
          font-size: 18px;
          font-weight: bold;
        }

        p {
          margin: 5px 0;
          font-size: 14px;
          color: #555;
        }
      }
    }

    .dropdown {
      margin-top: 10px;
      z-index: 999;
    }

    .block-booking-options {
      display: flex;
      gap: 20px;
      justify-content: space-around;
      margin: 15px 0;

      .custom-radio {
        position: relative;
        padding-left: 35px;
        font-size: 16px;
        cursor: pointer;

        input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }

        .checkmark {
          position: absolute;
          top: 0;
          left: 0;
          height: 22px;
          width: 22px;
          background-color: #eee;
          border-radius: 50%;
          border: 2px solid #ccc;
        }

        input:checked ~ .checkmark {
          background-color: #4caf50;
          border-color: #4caf50;
        }

        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }

        input:checked ~ .checkmark:after {
          display: block;
        }

        .checkmark:after {
          top: 6px;
          left: 6px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
        }
      }
    }

    .time-range {
      display: flex;
      justify-content: space-between;
      gap: 15px;

      input {
        width: 48%;
        padding: 12px;
        gap: 20px;
        font-size: 14px;
        border-radius: 5px;
        border: 1px solid #ddd;
      }
    }
  }

  .go-back-btn {
    display: flex;
    align-items: center;
    color: #007bff;
    font-size: 16px;
    text-decoration: none;
    font-weight: bold;
    margin-bottom: 10px;
    gap: 5px;
  }

  .go-back-btn:hover {
    text-decoration: underline;
  }

  .block-modal-footer {
    padding: 20px;
    border-top: 1px solid #ddd;
    display: flex;
    gap: 20px;
    justify-content: space-between;
    // background: #f9f9f9;

    button {
      flex: 1;
      padding: 12px 20px;
      font-size: 16px;
      font-weight: bold;
      text-transform: uppercase;
      border-radius: 5px;
      border: none;
      cursor: pointer;

      &.cancel-btn {
        background-color: #ddd;
        color: #333;

        &:hover {
          background-color: #ccc;
        }
      }

      &.lock-btn {
        background-color: #4caf50;
        color: white;

        &:hover {
          background-color: #45a049;
        }
      }

      & + & {
        margin-left: 10px;
      }
    }
  }
`;

const RangePickerStyles = styled.div`
  .rdrCalendarWrapper {
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    position: relative;
  }

  .range-picker-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    // padding: 20px;
  }

  .ok-button {
    margin-top: 15px;
    padding: 10px 20px;
    background-color: white;
    color: #007bff;
    border: none;
    box-shadow: 0px 4px 8px rgba(0, 123, 255, 0.2);

    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
      background-color: #0056b3;
      color: white;
      transform: scale(1.1);
    }
  }

  .rdrDayHovered {
    background-color: transparent !important;
    box-shadow: none !important;
  }
`;

const DeleteModalContent = styled.div`
  padding: 20px;
  text-align: center;

  h2 {
    font-size: 22px;
    margin-bottom: 15px;
    color: #333;
  }

  p {
    font-size: 16px;
    margin-bottom: 20px;
    color: #666;
  }

  .modal-actions {
    display: flex;
    justify-content: center;
    gap: 15px;

    button {
      padding: 10px 20px;
      font-size: 16px;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.3s;

      &.confirm-btn {
        background-color: #d9534f;
        color: white;
        border: none;
      }

      &.confirm-btn:hover {
        background-color: #c9302c;
      }

      &.cancel-btn {
        background-color: #f0f0f0;
        color: #333;
        border: none;
      }

      &.cancel-btn:hover {
        background-color: #ddd;
      }
    }
  }
`;
const StyledInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  background-color: #fff;
  transition: border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  margin-top: 10px;

  &:focus {
    border-color: #2684ff; /* Match react-select's focus color */
    box-shadow: 0 0 0 2px rgba(38, 132, 255, 0.5);
  }

  &::placeholder {
    color: #aaa; /* Placeholder text color */
  }
`;
const FieldWrapper = styled.div`
  margin-bottom: 15px;
  border: 1p solid red;
`;
const AvailabilityCalendar = ({ yachts = sampleYachts }) => {
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [dateRangeModal, setDateRangeModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedYacht, setSelectedYacht] = useState(null);
  const [bookingType, setBookingType] = useState("");
  const [timeRange, setTimeRange] = useState({ start: "", end: "" });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const OwnerYachts = useSelector((store) => store.yachtReducer.OwnerYachts);
  const dispatch = useDispatch();
const [modalType,setModalType]=useState("block")
  const handleSelectSlot = ({ start }) => {
    // console.log(start);
    setSelectedDate(start);
    setIsOpen(true);
  };

  const handleConfirmBooking = () => {
    const newEvents = [];
    const blockData = {};

    if (bookingType === "day") {
      let currentDate = new Date(dateRange[0].startDate);
      while (currentDate <= dateRange[0].endDate) {
        newEvents.push({
          title: "Locked",
          start: new Date(currentDate),
          end: new Date(currentDate),
          allDay: true,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      blockData.date = currentDate;
      blockData.type = "day";
      blockData.reason = "maintainance";
      blockData.yachtId = selectedYacht.value;

    } else if (bookingType === "hourly") {
      newEvents.push({
        title: `${timeRange.start} - ${timeRange.end}`,
        start: selectedDate,
        end: new Date(
          selectedDate.setHours(
            timeRange.end.split(":")[0],
            timeRange.end.split(":")[1]
          )
        ),
        allDay: false,
      });
      blockData.date = selectedDate;
      blockData.type = "slots";
      blockData.reason = "offline booking";
      blockData.yachtId = selectedYacht.value;
      blockData.slots = [
        { startTime: timeRange.start, endTime: timeRange.end },
      ];
    }
    setEvents([...events, ...newEvents]);
    setIsOpen(false);
    setDateRangeModal(false);
    console.log(newEvents, blockData);
    dispatch(addBlock(blockData));
  };

  const isDateLocked = (date) => {
    return events.some(
      (event) =>
        date >= new Date(event.start).setHours(0, 0, 0, 0) &&
        date <= new Date(event.end).setHours(23, 59, 59, 999)
    );
  };

  useEffect(() => {
    dispatch(getOwnerYachts);
  }, []);


  console.log(OwnerYachts);
  const getImageUrl = (images) => {
    if (images && images.length > 0) {
      return images[0].imgeUrl; // Fetch first image URL from array
    }
    return placeholderImage; // Return placeholder if no images
  };

  // useEffect(()=>{
  //   dispatch(fetchBlocks(OwnerYachts[0]?._id))

  // },[OwnerYachts])
  const yachtOptions = OwnerYachts.map((yacht) => ({
    value: yacht._id, // Use a unique identifier as the value
    label: yacht.title, // Use the yacht title for display
    description: yacht.short_description,
    image: getImageUrl(yacht.images),
  }));

  // console.log(yachtOptions);

  const handleChange = (selectedOption) => {
    setSelectedYacht(selectedOption);
  };

  const handlegetBlocks = async (selectedYacht) => {
    setSelectedYacht(selectedYacht);
    const blocks = await dispatch(fetchAllBlocks(selectedYacht.value));
    const instaBooks = await dispatch(getAllInstaBooks(selectedYacht.value));
    const formattedInstaBooks = instaBooks.map(pkg => ({
      id: pkg._id,
      title:<><FaStar/> {pkg.yachtId.title} (Package)</>,
      start: new Date(pkg.date).toISOString().split('T')[0],
      
      end: new Date(pkg.date).toISOString().split('T')[0],
      packageDetails: pkg,
    }));
    const formattedBlocks = transformDataToEvents(blocks);
    console.log(formattedBlocks)
    const events = transformDataToEvents(blocks);
    const bothEvents =[...formattedInstaBooks,...formattedBlocks]
    
    setEvents((pre)=>[...bothEvents]);
  };
console.log(events)
  const transformDataToEvents = (data) => {
    console.log(data)
    if(data.length==0){
      return []
    }
    const events = [];

    data.forEach((entry) => {
      if (entry.type === "day") {
        // Handle full-day blocks
        events.push({
          id: entry._id,
          title: entry.reason, // Use the reason as the event title
          start:new Date(entry.date).toISOString().split('T')[0],  // Start of the day
          end:new Date(entry.date).toISOString().split('T')[0],  // End of the day
          allDay: true, // Indicates it's a full-day event
          isblocked:true
        });
      } else if (entry.type === "slots") {
        // Handle time-specific blocks
        entry.slots.forEach((slot) => {
          events.push({
            id: entry._id,
            title: `${slot.startTime}-${slot.endTime} (${entry.reason})`, // Use the reason as the event title
            // start: new Date(`${entry.date}T${slot.startTime}`), // Start datetime
            // end: new Date(`${entry.date}T${slot.endTime}`),
            start: new Date(entry.date).toISOString().split('T')[0], 
            end: new Date(entry.date).toISOString().split('T')[0], // End datetime
          });
        });
      }
    });

    return events;
  };

  // Example Usage

  const handleDeleteEvent = async (eventToDelete) => {
    console.log(eventToDelete);
    const blocks = dispatch(deleteBlock(eventToDelete.id));
    // await fetch(`/api/events/${event.id}`, { method: "DELETE" }); // Replace with your API endpoint
    // setEvents((prevEvents) => prevEvents.filter((e) => e.id !== event.id));
  };


   useEffect(()=>{
      //  const OwnerYachts= await dispatch(getOwnerYachts)
      fetchInitialEvents()
  
        },[ ])
        const fetchInitialEvents = async () => {
          const instaBooks = await dispatch(getAllInstaBooks());
          const blocks = await dispatch(fetchAllBlocks())

        
          console.log(instaBooks)
          const formattedInstaBooks = instaBooks.map(pkg => ({
            id: pkg._id,
            title:<><FaStar/> {pkg.yachtId.title} (Package)</>,
            start: new Date(pkg.date).toISOString().split('T')[0],
            end: new Date(pkg.date).toISOString().split('T')[0],
            packageDetails: pkg,
          }));
          const formattedBlocks = transformDataToEvents(blocks);
          console.log(formattedBlocks)
          const intialEvents =[...formattedInstaBooks,...formattedBlocks]
          setEvents(prevEvents => [...prevEvents, ...intialEvents]);
        };
    
    //     setSelectedYacht(id);
    //     const instaBooks= await  dispatch(getAllInstaBooks())
    //     console.log(instaBooks)
    //   //  const yachtsInstaBook= instaBooks.filter((instabook)=>instabook.yachtId===id)4
    //   const groupedEvents = instaBooks.reduce((acc, instabook) => {
    //     const title = instabook.yachtId.title;
    //     const date = new Date(instabook.date).toDateString(); // Use the date as part of the key
      
    //     // Create a unique key combining the title and date
    //     const key = `${title}-${date}`;
      
    //     // Check if this key is already in the accumulator
    //     if (!acc[key]) {
    //       acc[key] = {
    //         title,
    //         start: new Date(instabook.date),
    //         end: new Date(instabook.date),
    //         allDay: true,
    //         status: "published",
    //         isInstaBook: true,
    //         count: 0, // Initialize count
    //       };
    //     }
      
    //     // Increment the count for this key
    //     acc[key].count += 1;
      
    //     return acc;
    //   }, {});
      
    //   // Convert grouped events back to an array and update the title with the count
    //   const newEvents = Object.values(groupedEvents).map((event) => ({
    //     ...event,
    //     title: `(${event.count}) ${event.title} `, // Add count to the title
    //   }));
      
    //   setEvents((prevEvents) => [...prevEvents, ...newEvents]);
        
    //     };

  return (
    <CalendarWrapper>
      <YachtSelector yachts={OwnerYachts} onSelect={handlegetBlocks} handlegetBlocks={handlegetBlocks}/>

      <CalendarView
        events={events}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={(event) => {
          setEventToDelete(event);
          // setModalType("delete");
          // setModalOpen(true);
          setDeleteModalOpen(true);
        }}
      />
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => handleDeleteEvent(eventToDelete)}
      />
     
      <Modal
        open={modalIsOpen}
        onClose={() => setIsOpen(false)}
        center
        styles={{
          modal: {
            padding: "0",
            maxHeight: "90vh",
            overflow: "visible",
            borderRadius: "20px",
            justifyContent: "center",
            alignItems: "center",
          },
          overlay: {
            overflowY: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <ModalContent>
          {/* Modal Header */}
          <div className="block-modal-header">
            {selectedYacht ? (
              <div>
                <button
                  className="go-back-btn"
                  onClick={() => setSelectedYacht(null)}
                  style={{
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    textDecoration: "none",
                  }}
                >
                  <FaArrowLeft /> Back to Yacht Selection
                </button>
                <span style={{ fontSize: "1.5rem" }}>
                  {" "}
                  | Lock Booking for {selectedDate?.toDateString()}
                </span>
                

              </div>
            ) : (
              // <span>Lock Booking for {selectedDate?.toDateString()}</span>
              <div>
                 <button onClick={()=>setModalType("block")}>block</button>
                 <button onClick={()=>setModalType("instabook")}>instabook</button>
              </div>

             

            )}
          </div>

          {/* Modal Content */}
          <div className="block-modal-content">
            {!selectedYacht ? (
              <div className="block-yachts-list">
                {yachtOptions.map((yacht) => (
                  <div
                    className="block-yacht-info"
                    key={yacht.id}
                    onClick={() => setSelectedYacht(yacht)}
                  >
                    <img
                      src={yacht.image}
                      alt={yacht.title || "No Title Provided"}
                      className="block-yacht-image"
                    />
                    <div className="yacht-details">
                      <h3>{yacht.label}</h3>
                      <p>{yacht.description || "No description provided."}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              modalType =="block"?
              (<>
                <div
                  className="selected-yacht block-yacht-info"
                  style={{
                    justifyContent: "flex-start",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <img
                    src={selectedYacht.image || "./placeholder.png"}
                    alt={selectedYacht.label || "Yacht"}
                    className="block-yacht-image "
                  />
                  <div className="yacht-details">
                    <h3>{selectedYacht.label}</h3>
                    <p>{selectedYacht.label}</p>
                  </div>
                </div>

                {/* Booking Options */}
                <div className="block-booking-options">
                  <label className="custom-radio">
                    <input
                      type="radio"
                      value="day"
                      checked={bookingType === "day"}
                      onChange={() => {
                        setBookingType("day");
                        setDateRangeModal(true);
                      }}
                    />
                    Whole Day
                    <span className="checkmark"></span>
                  </label>
                  <label className="custom-radio">
                    <input
                      type="radio"
                      value="hourly"
                      checked={bookingType === "hourly"}
                      onChange={() => setBookingType("hourly")}
                    />
                    Hourly Range
                    <span className="checkmark"></span>
                  </label>
                </div>

                {bookingType === "hourly" && (
                  <div className="time-range">
                    <input
                      type="time"
                      value={timeRange.start}
                      onChange={(e) =>
                        setTimeRange({ ...timeRange, start: e.target.value })
                      }
                    />
                    <input
                      type="time"
                      value={timeRange.end}
                      onChange={(e) =>
                        setTimeRange({ ...timeRange, end: e.target.value })
                      }
                    />
                  </div>
                )}
              </>):null

              
            )}
          </div>

          {/* Modal Footer */}
          <div className="block-modal-footer">
            <button
              className="cancel-btn"
              onClick={() => {
                setSelectedYacht(null); // Reset yacht selection on cancel
                setIsOpen(false);
              }}
            >
              Cancel
            </button>
            {selectedYacht && (
              <button
                className="lock-btn"
                onClick={() => {
                  handleConfirmBooking();
                  setSelectedYacht(null); // Reset yacht selection for next modal opening
                }}
              >
                Lock It
              </button>
            )}
          </div>
        </ModalContent>
      </Modal>

      <Modal
        open={dateRangeModal}
        onClose={() => setDateRangeModal(false)}
        center
        styles={{ modal: { borderRadius: "20px", padding: "40px" } }}
      >
        <RangePickerStyles>
          <div className="range-picker-container">
            <DateRangePicker
              onChange={(item) => setDateRange([item.selection])}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
              rangeColors={["#F9C74F"]}
              showMonthAndYearPickers={true}
              monthDisplayFormat="MMMM yyyy"
            />
            <button
              className="ok-button"
              onClick={() => setDateRangeModal(false)}
            >
              OK
            </button>
          </div>
        </RangePickerStyles>
      </Modal>
    </CalendarWrapper>
  );
};

export default AvailabilityCalendar;
