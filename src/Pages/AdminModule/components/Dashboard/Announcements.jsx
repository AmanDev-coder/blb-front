import React, { useState } from "react";
import styles from "./Announcements.module.scss";
import { FaTimes, FaPlus } from "react-icons/fa";

const initialAnnouncements = [
  { id: 1, message: "📢 System update scheduled for next Friday." },
  { id: 2, message: "🛥 New yacht models added for rental!" },
  { id: 3, message: "🎉 Congratulations to our top yacht owner of the month!" },
];

const Announcements = () => {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [newMessage, setNewMessage] = useState("");

  const handleRemove = (id) => {
    setAnnouncements(announcements.filter((ann) => ann.id !== id));
  };

  const handleAdd = () => {
    if (newMessage.trim() === "") return;
    const newAnn = { id: Date.now(), message: newMessage };
    setAnnouncements([newAnn, ...announcements]);
    setNewMessage("");
  };

  return (
    <div className={styles.announcementBox}>
      <h3>📢 Announcements</h3>
      <div className={styles.announcementList}>
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div key={announcement.id} className={styles.announcementItem}>
              <p>{announcement.message}</p>
              <FaTimes
                className={styles.removeIcon}
                onClick={() => handleRemove(announcement.id)}
              />
            </div>
          ))
        ) : (
          <p className={styles.noAnnouncements}>No announcements available.</p>
        )}
      </div>

      <div className={styles.addAnnouncement}>
        <input
          type="text"
          value={newMessage}
          placeholder="Add new announcement..."
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleAdd}>
          <FaPlus /> Add
        </button>
      </div>
    </div>
  );
};

export default Announcements;
