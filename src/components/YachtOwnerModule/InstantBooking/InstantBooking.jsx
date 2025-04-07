import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import InstabookModal from "./InstabookModal";
import styles from './InstantBooking.module.css';
import { getAllInstaBooks, getOwnerYachts } from "../../../Redux/yachtReducer/action";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { GiSpeedBoat } from "react-icons/gi";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const InstantBooking = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionModalType, setActionModalType] = useState("");
  const OwnerYachts = useSelector((store) => store.yachtReducer.OwnerYachts);
    const [selectedYacht, setSelectedYacht] = useState(null);
  
    const yachtOptions = OwnerYachts.map((yacht) => ({
      value: yacht._id, // Use a unique identifier as the value
      label: yacht.title, // Use the yacht title for display
    }));
const dispatch=useDispatch()
  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    setModalOpen(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setActionModalType(event.status === "published" ? "delete" : "draft");
    setActionModalOpen(true);
  };

  const handleSaveBooking = (bookingData, status) => {
    const newEvents = bookingData.availabilityDates.map((date) => ({
      title: bookingData.yacht.title,
      start: new Date(date),
      end: new Date(date),
      allDay: true,
      status: status,
      bookingDetails: bookingData,
      isInstaBook: true
    }));
    setEvents((prevEvents) => [...prevEvents, ...newEvents]);
    setModalOpen(false);
  };

  const handleDeleteBooking = () => {
    setEvents((prevEvents) =>
      prevEvents.filter(
        (event) =>
          !(
            event.start.toDateString() === selectedEvent.start.toDateString() &&
            event.status === selectedEvent.status
          )
      )
    );
    setActionModalOpen(false);
    setSelectedEvent(null);
  };

  const handlePublishDraft = () => {
    const updatedEvents = events.map((event) =>
      event.status === "draft" &&
      event.start.toDateString() === selectedEvent.start.toDateString()
        ? { ...event, status: "published" }
        : event
    );
    setEvents(updatedEvents);
    setActionModalOpen(false);
    setSelectedEvent(null);
  };

  const closeActionModal = () => {
    setActionModalOpen(false);
    setSelectedEvent(null);
  };

 useEffect(()=>{
    //  const OwnerYachts= await dispatch(getOwnerYachts)
     handlegetInstaBookings()

      },[ ])

   const handlegetInstaBookings =async (id) => {
      setSelectedYacht(id);
      const instaBooks= await  dispatch(getAllInstaBooks())
      console.log(instaBooks)
    //  const yachtsInstaBook= instaBooks.filter((instabook)=>instabook.yachtId===id)4
    const groupedEvents = instaBooks.reduce((acc, instabook) => {
      const title = instabook.yachtId.title;
      const date = new Date(instabook.date).toDateString(); // Use the date as part of the key
    
      // Create a unique key combining the title and date
      const key = `${title}-${date}`;
    
      // Check if this key is already in the accumulator
      if (!acc[key]) {
        acc[key] = {
          title,
          start: new Date(instabook.date),
          end: new Date(instabook.date),
          allDay: true,
          status: "published",
          isInstaBook: true,
          count: 0, // Initialize count
        };
      }
    
      // Increment the count for this key
      acc[key].count += 1;
    
      return acc;
    }, {});
    
    // Convert grouped events back to an array and update the title with the count
    const newEvents = Object.values(groupedEvents).map((event) => ({
      ...event,
      title: `(${event.count}) ${event.title} `, // Add count to the title
    }));
    
    setEvents((prevEvents) => [...prevEvents, ...newEvents]);
      
      };
    
      
      
  return (
    <div className="big-calendar-container">
      {/* <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleEventClick}
        style={{ height: "calc(100vh - 20px)" }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.status === "published" ? "green" : "yellow",
            color: "white",
            borderRadius: "5px",
            padding: "5px",
            border: "none",
          },
        })}
        dayPropGetter={(date) => {
          const event = events.find(
            (e) => e.start.toDateString() === date.toDateString()
          );
          if (event) {
            return {
              style: {
                backgroundColor: event.status === "published" ? "green" : "yellow",
                color: "white",
              },
            };
          }
          return {};
        }}
        components={{
          toolbar: (props) => (
            <div className="custom-toolbar">
              <div className="toolbar-left">
                <button onClick={() => props.onNavigate("PREV")}>Previous</button>
              </div>
              <div className="toolbar-center">
                <span className="toolbar-label">{props.label}</span>
              </div>
              <div className="toolbar-right">
                <button onClick={() => props.onNavigate("TODAY")}>Today</button>
                <button onClick={() => props.onNavigate("NEXT")}>Next</button>
              </div>
            </div>
          ),
        }}
      /> */}
          <Select
            options={yachtOptions}
            onChange={handlegetInstaBookings}
            placeholder="Select a yacht"
            className="dropdown"
            styles={{
              control: (provided) => ({
                ...provided,
                minWidth: "200px", // Minimum width to fit the data
                width: "auto", // Adjust width dynamically
                zIndex: 2, // Ensure dropdown is above the calendar
              }),
              menu: (provided) => ({
                ...provided,
                zIndex: 3, // Higher z-index to appear above calendar
                marginTop: 0, // Remove default gap between input and dropdown
              }),
              menuPortal: (provided) => ({
                ...provided,
                zIndex: 9999, // Place menu portal above everything
              }),
            }}
            menuPortalTarget={document.body} // Render dropdown in body to avoid overflow issues
          />
      <Calendar
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  selectable
  onSelectSlot={handleSelectSlot}
  onSelectEvent={handleEventClick}
  style={{ height: "calc(100vh - 20px)" }}
  eventPropGetter={(event) => ({
    style: {
      // backgroundColor: event.status === "published" ? "green" : "yellow",
      color: "white",
      borderRadius: "5px",
      padding: "5px",
      border: "none",
      position: "relative", // To position the icon/text
    },
    className: event.isInstaBook ? "insta-book-event" : "", // Add a class for InstaBooking
  })}
  dayPropGetter={(date) => {
    const event = events.find(
      (e) => e.start.toDateString() === date.toDateString()
    );
    if (event && event.isInstaBook) {
      return {
        style: {
          // backgroundColor: "blue", // InstaBook-specific color
          color: "white",
          position: "relative",
        },
        className: "insta-book-day", // Add a class for InstaBooking days
      };
    }
    return {};
  }}
  components={{
    // eventWrapper: ({ event, children }) => (
    //   <div style={{ position: "relative" }}>
    //     {children}
    //     {event.isInstaBook && (
    //       // <span
    //       //   style={{
    //       //     position: "absolute",
    //       //     top: "5px",
    //       //     right: "5px",
    //       //     backgroundColor: "orange",
    //       //     color: "white",
    //       //     padding: "2px 5px",
    //       //     borderRadius: "3px",
    //       //     fontSize: "10px",
    //       //   }}
    //       // >
    //       //   InstaBook
    //       // </span>
    //       <GiSpeedBoat  style={{
    //             position: "absolute",
    //             top: "5px",
    //             right: "5px",
    //             // backgroundColor: "orange",
    //             color: "orange",
    //             padding: "2px 5px",
    //             borderRadius: "3px",
    //             // fontSize: "10px",
    //             fontSize:"30px"
    //           }} />

    //     )}
    //   </div>
    // ),
    toolbar: (props) => (
      <div className="custom-toolbar">
        <div className="toolbar-left">
          <button onClick={() => props.onNavigate("PREV")}>Previous</button>
        </div>
        <div className="toolbar-center">
          <span className="toolbar-label">{props.label}</span>
        </div>
        <div className="toolbar-right">
          <button onClick={() => props.onNavigate("TODAY")}>Today</button>
          <button onClick={() => props.onNavigate("NEXT")}>Next</button>
        </div>
      </div>
    ),
  }}
/>


      {/* InstabookModal */}
      {modalOpen && (
        <InstabookModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedDate={selectedDate}
          onSave={handleSaveBooking}
        />
      )}

      {/* Action Modal */}
      {actionModalOpen && (
        <div className={styles["instant-booking-modals"]}>
          <div className="modal-containers">
            <div className="modal-headers">
              <h2>
                {actionModalType === "delete"
                  ? "Delete Booking"
                  : "Draft Actions"}
              </h2>
            </div>
            <div className="modal-bodys">
              {actionModalType === "delete" ? (
                <p>Do you want to cancel the booking for this day?</p>
              ) : (
                <p>
                  This booking is in draft. Would you like to publish or delete
                  it?
                </p>
              )}
            </div>
            <div className="modal-footers">
              {actionModalType === "delete" ? (
                <>
                  <button className="btn-primary" onClick={handleDeleteBooking}>
                    Confirm
                  </button>
                  <button className="btn-secondary" onClick={closeActionModal}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button className="btn-primary" onClick={handlePublishDraft}>
                    Publish
                  </button>
                  <button className="btn-secondary" onClick={handleDeleteBooking}>
                    Delete
                  </button>
                  <button className="btn-secondary" onClick={closeActionModal}>
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstantBooking;
