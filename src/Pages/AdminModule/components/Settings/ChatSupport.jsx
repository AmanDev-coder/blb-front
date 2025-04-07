import { useState, useEffect } from "react";
import {
  MessageCircle,
  Send,
  User,
  Headset,
  Calendar,
  Bell,
  Clock,
  File,
  Upload,
  PlusCircle,
  Search,
  CheckCircle,
  Loader,
} from "lucide-react";

// Sample Support Tickets (Placeholder Data)
const sampleTickets = [
  {
    id: 1,
    user: "John Doe",
    message: "I'm having trouble booking a yacht. The payment isn't going through.",
    status: "unresolved",
    timestamp: "2024-03-20 14:30",
  },
  {
    id: 2,
    user: "Jane Smith",
    message: "Can I get a refund for my cancelled booking?",
    status: "pending",
    timestamp: "2024-03-21 10:00",
  },
  {
    id: 3,
    user: "Alex Johnson",
    message: "How can I contact the yacht owner directly?",
    status: "resolved",
    timestamp: "2024-03-19 16:45",
  },
];

// Chat Support Component
const ChatSupport = () => {
  const [tickets, setTickets] = useState(sampleTickets);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [fileInput, setFileInput] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Simulated API Call (Fetch Chat History)
  useEffect(() => {
    if (selectedTicket) {
      setMessages([
        { sender: "user", text: selectedTicket.message, timestamp: selectedTicket.timestamp },
        { sender: "support", text: "We're looking into your issue. Please hold.", timestamp: "2024-03-20 15:00" },
      ]);
    }
  }, [selectedTicket]);

  // Handle Sending a Message
  const sendMessage = () => {
    if (messageInput.trim() === "") return;
    setMessages([...messages, { sender: "support", text: messageInput, timestamp: new Date().toLocaleString() }]);
    setMessageInput("");
  };

  // Handle File Upload (Placeholder)
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileInput(file.name);
    }
  };

  // Search Functionality for Tickets
  const filteredTickets = tickets.filter((ticket) =>
    ticket.user.toLowerCase().includes(searchQuery.toLowerCase()) || ticket.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto bg-white rounded-xl shadow-lg p-6 flex">
        {/* Sidebar - Support Inbox */}
        <div className="w-1/3 border-r p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Headset className="w-6 h-6 text-blue-600" /> Support Inbox
            </h2>
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              className="w-full p-2 pl-10 border rounded-lg"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
          </div>

          <div className="mt-4 space-y-3">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedTicket?.id === ticket.id ? "bg-blue-100 border-blue-600" : "hover:bg-gray-100"
                }`}
              >
                <p className="font-medium text-gray-800">{ticket.user}</p>
                <p className="text-sm text-gray-600 truncate">{ticket.message}</p>
                <span className="text-xs text-gray-400">{ticket.timestamp}</span>
                <span
                  className={`ml-2 px-2 py-1 text-xs font-medium rounded ${
                    ticket.status === "resolved"
                      ? "bg-green-100 text-green-700"
                      : ticket.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="w-2/3 p-6">
          {selectedTicket ? (
            <>
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <User className="w-6 h-6 text-blue-600" /> {selectedTicket.user}
                </h2>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded ${
                    selectedTicket.status === "resolved"
                      ? "bg-green-100 text-green-700"
                      : selectedTicket.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedTicket.status}
                </span>
              </div>

              <div className="mt-4 h-80 overflow-y-auto space-y-3">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg max-w-xs ${
                      msg.sender === "support" ? "bg-blue-500 text-white ml-auto" : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="block text-xs text-gray-400 mt-1">{msg.timestamp}</span>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="mt-4 flex items-center gap-3">
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* File Upload */}
              <div className="mt-3 flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-blue-600">
                  <Upload className="w-5 h-5" />
                  <span className="text-sm">{fileInput || "Attach a file"}</span>
                  <input type="file" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageCircle className="w-10 h-10" />
              <p className="mt-3">Select a ticket to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSupport;
