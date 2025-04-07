import  { useState } from "react";
import { FaPaperPlane, FaTimes, FaCommentDots } from "react-icons/fa";
import styles from "./ChatSupport.module.scss";

// Sample Messages
const initialChats = [
  { id: 1, sender: "User", message: "Hi, I need help with my booking.", time: "10:45 AM" },
  { id: 2, sender: "Admin", message: "Sure! What issue are you facing?", time: "10:46 AM" },
];

const ChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialChats);
  const [newMessage, setNewMessage] = useState("");

  // 📌 Toggle Chat Window
  const toggleChat = () => setIsOpen(!isOpen);

  // 📩 Send Message
  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    setMessages([...messages, { id: messages.length + 1, sender: "User", message: newMessage, time: "Now" }]);
    setNewMessage("");
  };

  return (
    <div className={styles.chatContainer}>
      {/* 💬 Chat Icon */}
      <div className={styles.chatIcon} onClick={toggleChat}>
        <FaCommentDots />
      </div>

      {/* 📝 Chat Window */}
      {isOpen && (
        <div className={styles.chatBox}>
          <div className={styles.chatHeader}>
            <h3>💬 Live Support</h3>
            <FaTimes className={styles.closeIcon} onClick={toggleChat} />
          </div>

          {/* 📜 Chat Messages */}
          <div className={styles.chatMessages}>
            {messages.map((msg) => (
              <div key={msg.id} className={`${styles.message} ${msg.sender === "User" ? styles.userMsg : styles.adminMsg}`}>
                <span>{msg.message}</span>
                <span className={styles.time}>{msg.time}</span>
              </div>
            ))}
          </div>

          {/* 📝 Message Input */}
          <div className={styles.chatInput}>
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSupport;
