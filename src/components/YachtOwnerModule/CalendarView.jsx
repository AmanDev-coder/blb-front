import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

const localizer = momentLocalizer(moment);

const CalendarView = ({ events, onSelectSlot, onSelectEvent }) => {

  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: event.isblocked ? "red" : "#3174ad", // ✅ Red for blocked, blue for normal
      color: "white",
      borderRadius: "5px",
      opacity: 0.8,
      display: "block",
    };

    return { style };
  };
  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      selectable
      onSelectSlot={onSelectSlot}
      onSelectEvent={onSelectEvent}
      style={{ height: "100%" }}
      eventPropGetter={eventStyleGetter}
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
    />
  );
};

export default CalendarView;
