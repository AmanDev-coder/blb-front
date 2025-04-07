import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaCheck,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaBan,
  FaFilter,
  FaDownload,
  FaInfoCircle,
  FaFileInvoiceDollar,
  FaFileAlt,
  FaPassport,
  FaIdCard,
  FaCreditCard,
  FaFilePdf,
  FaFileImage,
} from "react-icons/fa";
import styles from "./RecentBookings.module.scss";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { fetchBookings, updateBooking } from "../../../../Redux/adminReducer.js/action";
import { useDispatch } from "react-redux";
import BookingDetails from "./BookingDetails";
import generateInvoice from "../../../../utils/InvoiceGenerator";
import { toast } from "react-toastify";
// import RecentBooking from "../../RecentBooking";
// import YachtDetails from "./YachtDetails";

// **Initial Users Data**
const initialUsers = [
  {
    id: "#B101",
    user: "John Doe",
    yacht: "Luxury Yacht 1",
    date: "2024-03-10",
    startDate: "2024-03-10",
    endDate: "2024-03-15",
    amount: "$1200",
    status: "Pending",
    captainIncluded: true,
    email: "john.doe@example.com",
    phone: "+1 (416) 123-4567",
    address: "123 Lakeshore Blvd, Toronto, ON, Canada",
    yachtType: "Motor Yacht",
    yachtLength: "52 ft",
    yachtCapacity: "12 guests",
    yachtOwner: "Blue Lux Yachts",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    documents: [
      { id: 1, type: "ID Verification", name: "passport.jpg", uploadDate: "2024-03-08", url: "https://placehold.co/600x400?text=Passport" },
      { id: 2, type: "Credit Card", name: "credit-card.jpg", uploadDate: "2024-03-08", url: "https://placehold.co/600x400?text=Credit+Card" }
    ]
  },
  {
    id: "#B102",
    user: "Alice Johnson",
    yacht: "Ocean Breeze",
    date: "2024-03-08",
    startDate: "2024-03-08",
    endDate: "2024-03-12",
    amount: "$900",
    status: "Confirmed",
    captainIncluded: false,
    email: "alice.j@example.com",
    phone: "+1 (416) 987-6543",
    address: "456 Bay Street, Toronto, ON, Canada",
    yachtType: "Sailing Yacht",
    yachtLength: "42 ft",
    yachtCapacity: "8 guests",
    yachtOwner: "Blue Lux Yachts",
    paymentMethod: "PayPal",
    paymentStatus: "Paid",
    documents: [
      { id: 1, type: "Driver's License", name: "drivers-license.jpg", uploadDate: "2024-03-05", url: "https://placehold.co/600x400?text=Driver+License" },
      { id: 2, type: "Insurance Proof", name: "insurance.pdf", uploadDate: "2024-03-05", url: "https://placehold.co/600x400?text=Insurance+Document" }
    ]
  },
  {
    id: "#B103",
    user: "Michael Brown",
    yacht: "Sunset Cruiser",
    date: "2024-03-05",
    startDate: "2024-03-05",
    endDate: "2024-03-10",
    amount: "$1500",
    status: "Cancelled",
    documents: [
      { id: 1, type: "Passport", name: "passport-scan.pdf", uploadDate: "2024-03-01", url: "https://placehold.co/600x400?text=Passport+Scan" }
    ]
  },
  // Additional entries
  {
    id: "#B104",
    user: "Emily Davis",
    yacht: "Sea Explorer",
    date: "2024-03-12",
    startDate: "2024-03-12",
    endDate: "2024-03-17",
    amount: "$1100",
    status: "Pending",
    documents: [
      { id: 1, type: "Government ID", name: "government-id.jpg", uploadDate: "2024-03-10", url: "https://placehold.co/600x400?text=Government+ID" },
      { id: 2, type: "Proof of Address", name: "utility-bill.pdf", uploadDate: "2024-03-10", url: "https://placehold.co/600x400?text=Utility+Bill" }
    ]
  },
  {
    id: "#B105",
    user: "Chris Martin",
    yacht: "Wave Rider",
    date: "2024-03-15",
    startDate: "2024-03-15",
    endDate: "2024-03-20",
    amount: "$1300",
    status: "Confirmed",
    captainIncluded: true,
    email: "chris.martin@example.com",
    phone: "+1 (416) 555-1234",
    address: "789 Queen Street, Toronto, ON, Canada",
    yachtType: "Catamaran",
    yachtLength: "46 ft",
    yachtCapacity: "10 guests",
    yachtOwner: "Blue Lux Yachts",
    paymentMethod: "Debit Card",
    paymentStatus: "Paid",
    documents: [
      { id: 1, type: "Passport", name: "passport-scan.jpg", uploadDate: "2024-03-12", url: "https://placehold.co/600x400?text=Passport+Document" },
      { id: 2, type: "Credit Card", name: "credit-card-scan.jpg", uploadDate: "2024-03-12", url: "https://placehold.co/600x400?text=Credit+Card" }
    ]
  },
  {
    id: "#B106",
    user: "Jessica Lee",
    yacht: "Ocean Dream",
    date: "2024-03-18",
    startDate: "2024-03-18",
    endDate: "2024-03-23",
    amount: "$1400",
    status: "Cancelled",
    captainIncluded: false,
    email: "jessica.lee@example.com",
    phone: "+1 (647) 555-9876",
    address: "321 Yonge Street, Toronto, ON, Canada",
    yachtType: "Sport Yacht",
    yachtLength: "38 ft",
    yachtCapacity: "6 guests",
    yachtOwner: "Blue Lux Yachts",
    paymentMethod: "Bank Transfer",
    paymentStatus: "Refunded",
    documents: [
      { id: 1, type: "Driver's License", name: "drivers-license.pdf", uploadDate: "2024-03-16", url: "https://placehold.co/600x400?text=Driver+License" }
    ]
  },
  {
    id: "#B107",
    user: "David Wilson",
    yacht: "Sunset Voyager",
    date: "2024-03-20",
    startDate: "2024-03-20",
    endDate: "2024-03-25",
    amount: "$1250",
    status: "Pending",
    captainIncluded: true,
    email: "david.wilson@example.com",
    phone: "+1 (416) 555-4321",
    address: "567 College Street, Toronto, ON, Canada",
    yachtType: "Yacht Cruiser",
    yachtLength: "55 ft",
    yachtCapacity: "15 guests",
    yachtOwner: "Blue Lux Yachts",
    paymentMethod: "Credit Card",
    paymentStatus: "Pending",
    documents: [
      { id: 1, type: "Government ID", name: "government-id.jpg", uploadDate: "2024-03-18", url: "https://placehold.co/600x400?text=Government+ID" },
      { id: 2, type: "Proof of Insurance", name: "insurance.pdf", uploadDate: "2024-03-18", url: "https://placehold.co/600x400?text=Insurance+Document" },
      { id: 3, type: "Billing Information", name: "billing.pdf", uploadDate: "2024-03-19", url: "https://placehold.co/600x400?text=Billing+Document" }
    ]
  },
  {
    id: "#B108",
    user: "Sophia Brown",
    yacht: "Blue Horizon",
    date: "2024-03-22",
    startDate: "2024-03-22",
    endDate: "2024-03-27",
    amount: "$1350",
    status: "Confirmed",
    captainIncluded: false,
    email: "sophia.brown@example.com",
    phone: "+1 (647) 555-7890",
    address: "432 Bloor Street, Toronto, ON, Canada",
    yachtType: "Sailing Yacht",
    yachtLength: "48 ft",
    yachtCapacity: "8 guests",
    yachtOwner: "Blue Lux Yachts",
    paymentMethod: "PayPal",
    paymentStatus: "Paid",
    documents: [
      { id: 1, type: "SSN Verification", name: "ssn-verification.jpg", uploadDate: "2024-03-20", url: "https://placehold.co/600x400?text=SSN+Verification" },
      { id: 2, type: "Credit Card", name: "credit-card.jpg", uploadDate: "2024-03-20", url: "https://placehold.co/600x400?text=Credit+Card+Image" }
    ]
  },
  {
    id: "#B109",
    user: "James Taylor",
    yacht: "Sea Breeze",
    date: "2024-03-25",
    startDate: "2024-03-25",
    endDate: "2024-03-30",
    amount: "$1450",
    status: "Cancelled",
    captainIncluded: true,
    email: "james.taylor@example.com",
    phone: "+1 (416) 555-8765",
    address: "987 Dundas Street, Toronto, ON, Canada",
    yachtType: "Motor Yacht",
    yachtLength: "50 ft",
    yachtCapacity: "12 guests",
    yachtOwner: "Blue Lux Yachts",
    paymentMethod: "Credit Card",
    paymentStatus: "Refunded",
    documents: [
      { id: 1, type: "Passport", name: "passport.pdf", uploadDate: "2024-03-22", url: "https://placehold.co/600x400?text=Passport+PDF" }
    ]
  },
  {
    id: "#B110",
    user: "Olivia Harris",
    yacht: "Ocean Pearl",
    date: "2024-03-28",
    startDate: "2024-03-28",
    endDate: "2024-04-02",
    amount: "$1500",
    status: "Pending",
    captainIncluded: false,
    email: "olivia.harris@example.com",
    phone: "+1 (647) 555-2468",
    address: "654 King Street, Toronto, ON, Canada",
    yachtType: "Luxury Cruiser",
    yachtLength: "60 ft",
    yachtCapacity: "16 guests",
    yachtOwner: "Blue Lux Yachts",
    paymentMethod: "Bank Transfer",
    paymentStatus: "Pending",
    documents: [
      { id: 1, type: "Driver's License", name: "license.jpg", uploadDate: "2024-03-26", url: "https://placehold.co/600x400?text=Driver+License" },
      { id: 2, type: "Utility Bill", name: "utility-bill.pdf", uploadDate: "2024-03-26", url: "https://placehold.co/600x400?text=Utility+Bill" },
      { id: 3, type: "Credit Card", name: "credit-card.jpg", uploadDate: "2024-03-27", url: "https://placehold.co/600x400?text=Credit+Card+Image" }
    ]
  },
  {
    id: "#B111",
    user: "Liam Clark",
    yacht: "Sunset Dream",
    date: "2024-03-30",
    startDate: "2024-03-30",
    endDate: "2024-04-04",
    amount: "$1600",
    status: "Confirmed",
  },
  {
    id: "#B112",
    user: "Emma Lewis",
    yacht: "Wave Chaser",
    date: "2024-04-02",
    startDate: "2024-04-02",
    endDate: "2024-04-07",
    amount: "$1700",
    status: "Cancelled",
  },
  {
    id: "#B113",
    user: "Noah Walker",
    yacht: "Sea Voyager",
    date: "2024-04-05",
    startDate: "2024-04-05",
    endDate: "2024-04-10",
    amount: "$1800",
    status: "Pending",
  },
  {
    id: "#B114",
    user: "Ava Hall",
    yacht: "Ocean Explorer",
    date: "2024-04-08",
    startDate: "2024-04-08",
    endDate: "2024-04-13",
    amount: "$1900",
    status: "Confirmed",
  },
  {
    id: "#B115",
    user: "William Young",
    yacht: "Sunset Cruiser",
    date: "2024-04-10",
    startDate: "2024-04-10",
    endDate: "2024-04-15",
    amount: "$2000",
    status: "Cancelled",
  },
  {
    id: "#B116",
    user: "Isabella King",
    yacht: "Blue Wave",
    date: "2024-04-12",
    startDate: "2024-04-12",
    endDate: "2024-04-17",
    amount: "$2100",
    status: "Pending",
  },
  {
    id: "#B117",
    user: "Mason Wright",
    yacht: "Sea Dream",
    date: "2024-04-15",
    startDate: "2024-04-15",
    endDate: "2024-04-20",
    amount: "$2200",
    status: "Confirmed",
  },
  {
    id: "#B118",
    user: "Mia Scott",
    yacht: "Ocean Breeze",
    date: "2024-04-18",
    startDate: "2024-04-18",
    endDate: "2024-04-23",
    amount: "$2300",
    status: "Cancelled",
  },
  {
    id: "#B119",
    user: "Ethan Green",
    yacht: "Sunset Horizon",
    date: "2024-04-20",
    startDate: "2024-04-20",
    endDate: "2024-04-25",
    amount: "$2400",
    status: "Pending",
  },
  {
    id: "#B120",
    user: "Amelia Adams",
    yacht: "Blue Ocean",
    date: "2024-04-22",
    startDate: "2024-04-22",
    endDate: "2024-04-27",
    amount: "$2500",
    status: "Confirmed",
  },
  {
    id: "#B121",
    user: "Lucas Nelson",
    yacht: "Sea Voyager",
    date: "2024-04-25",
    startDate: "2024-04-25",
    endDate: "2024-04-30",
    amount: "$2600",
    status: "Cancelled",
  },
  {
    id: "#B122",
    user: "Charlotte Baker",
    yacht: "Ocean Dream",
    date: "2024-04-28",
    startDate: "2024-04-28",
    endDate: "2024-05-03",
    amount: "$2700",
    status: "Pending",
  },
  {
    id: "#B123",
    user: "Henry Carter",
    yacht: "Sunset Explorer",
    date: "2024-05-01",
    startDate: "2024-05-01",
    endDate: "2024-05-06",
    amount: "$2800",
    status: "Confirmed",
  },
  {
    id: "#B124",
    user: "Sophia Mitchell",
    yacht: "Blue Horizon",
    date: "2024-05-03",
    startDate: "2024-05-03",
    endDate: "2024-05-08",
    amount: "$2900",
    status: "Cancelled",
  },
  {
    id: "#B125",
    user: "Oliver Perez",
    yacht: "Sea Breeze",
    date: "2024-05-05",
    startDate: "2024-05-05",
    endDate: "2024-05-10",
    amount: "$3000",
    status: "Pending",
  },
];

const RecentBookingComponent = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterStatus, setFilterStatus] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [filterLocation, setFilterLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);



  const filterRef = useRef(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    // const storedBookings = JSON.parse(localStorage.getItem("usersData")) || [];
    // setBookings([...bookings]);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 

  const toggleFilterDropdown = () => setFilterDropdownOpen(!filterDropdownOpen);

  // Handle multi-select status filter
  const handleStatusChange = (status) => {
    setFilterStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };
  console.log(searchTerm);
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler); // Clear on value change or unmount
      };
    }, [value, delay]);

    return debouncedValue;
  };
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  useEffect(() => {
    setCurrentPage(1); // 👈 This happens FIRST
  }, [debouncedSearchTerm, filterStatus, filterLocation]);

  useEffect(() => {
    const getBookings = async () => {
      try {
        // setLoading(true);
        const filters = {
          search: debouncedSearchTerm,
          status: filterStatus,
          location: filterLocation,
          sort: sortBy,
          order: "desc",
          page: currentPage,
          limit: entriesPerPage,
        };
        const data = await dispatch(fetchBookings(filters));
        setBookings(data.data); // ✅ Set userss list from API response
        setTotalPages(data.totalPages); // ✅ Backend should return `totalPages`
        setTotalBookings(data.total);
        console.log(data.data);
      } catch (error) {
        console.error("Failed to load yacht userss");
      } finally {
        // setLoading(false);
      }
    };

    getBookings();
  }, [
    currentPage,
    entriesPerPage,
    debouncedSearchTerm,
    filterStatus,
    filterLocation,
  ]);
  
  // Handle Edit Click
  const handleEdit = (id) => {
    const ownerToEdit = bookings.find((owner) => owner.id === id);
    setEditingRow(id);
    setEditedData({ ...ownerToEdit }); // Copy the selected row's data
  };

  // Handle Input Changes
  const handleChange = (field, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: field === "yachts" ? parseInt(value, 10) || 0 : value, // Ensure yachts remains numeric
    }));
  };

  // Handle Save Click
  const handleSave = async () => {
    const previousBookings = [...bookings];
    setBookings((prevOwners) =>
      prevOwners.map((owner) =>
        owner.id === editedData.id ? editedData : owner
      )
    );
    try {

      await dispatch(updateBooking(editedData._id, editedData));
      toast.success("Booking updated successfully");
    } catch (error) {
      console.error("Error updating booking:", error);
      setBookings(previousBookings);
      toast.error("Failed to update booking");
    } finally {
      setEditingRow(null);
    }
  };

  // **Export as CSV**
  const exportCSV = () => {
    const csvContent = [
      "ID, User, Yacht, Date, Start Date, End Date, Amount, Status",
      ...bookings.map(
        (b) =>
          `${b.id},${b.user},${b.yacht},${b.date},${b.startDate},${b.endDate},${b.amount},${b.status}`
      ),
    ].join("\n");
    saveAs(
      new Blob([csvContent], { type: "text/csv;charset=utf-8;" }),
      "Bookings.csv"
    );
  };

  // **Export as PDF**
  const exportPDF = () => {
    try {
      // Create a new jsPDF instance
    const doc = new jsPDF();
      
      // Set document title
      doc.text("Recent Bookings Report", 14, 15);
      
      // Define the columns
      const columns = [
        { header: "ID", dataKey: "id" },
        { header: "User", dataKey: "user" },
        { header: "Yacht", dataKey: "yacht" },
        { header: "Date", dataKey: "date" },
        { header: "Start Date", dataKey: "startDate" },
        { header: "End Date", dataKey: "endDate" },
        { header: "Amount", dataKey: "amount" },
        { header: "Status", dataKey: "status" },
      ];
      
      // Generate the table
    doc.autoTable({
        columns: columns,
        body: paginatedBookings,
        startY: 20,
        margin: { top: 20 },
        styles: { overflow: "linebreak" },
        bodyStyles: { valign: "top" },
        columnStyles: { yacht: { cellWidth: "auto" } },
      });
      
      // Save the PDF
    doc.save("Bookings.pdf");
      
      console.log("PDF generated successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // Add new function to handle user click
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  // Add function to close modal
  const handleCloseModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  // Add function to handle View More click
  const handleViewMore = (user) => {
    setShowUserModal(false);
      navigate(`/adminn/users?search=${user}`); // Adjust this path according to your routing setup  
  // Handle View Booking Details
  
  }
  const handleViewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowBookingDetails(true);
  };

  // Handle Back from Booking Details
  const handleBackFromDetails = () => {
    setShowBookingDetails(false);
    setSelectedBooking(null);
  };

  // Handle Invoice Generation
  const handleGenerateInvoice = (booking) => {
    try {
      console.log("Starting invoice generation for booking:", booking.id);
      
      // Create a loading message
      alert("Generating invoice... Please wait.");
      
      // Ensure booking contains all necessary data
      const enhancedBooking = {
        ...booking,
        // Add default values for any missing fields
        email: booking.email || `${booking.user.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        phone: booking.phone || "(647) 927-5718",
        address: booking.address || "123 Bay Street, Toronto, ON, Canada",
        yachtType: booking.yachtType || "Luxury Cruiser",
        yachtLength: booking.yachtLength || "42 ft",
        yachtCapacity: booking.yachtCapacity || "10 guests",
        paymentMethod: booking.paymentMethod || "Credit Card (Mastercard 9375)",
        paymentStatus: booking.paymentStatus || "Paid",
        // Add start and end times if they don't exist
        startTime: booking.startTime || new Date(booking.date + "T12:00:00"),
        endTime: booking.endTime || new Date(booking.date + "T15:00:00")
      };
      
      // Generate invoice using our utility function
      const doc = generateInvoice(enhancedBooking);
      
      if (!doc) {
        throw new Error("Failed to create PDF document - null or undefined returned from generator");
      }
      
      // Generate a sanitized filename that removes special characters
      const sanitizedId = booking.id.replace(/[^a-zA-Z0-9]/g, '');
      const sanitizedName = booking.user.replace(/\s+/g, '_');
      const fileName = `Invoice_${sanitizedId}_${sanitizedName}.pdf`;
      
      // Save the PDF
      doc.save(fileName);
      
      // Show success message
      alert(`Invoice for booking ${booking.id} has been generated successfully.\nFile saved as ${fileName}`);
      console.log("Invoice generation completed successfully:", fileName);
      
    } catch (error) {
      console.error("Error generating invoice:", error);
      
      // Get a more descriptive error message
      let errorMessage = "Unknown error";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // Show detailed error message to user
      alert(`Failed to generate invoice: ${errorMessage}\n\nPlease check if all necessary information is available.`);
    }
  };

  return (
    <div className={styles.yachtOwnersContainer}>
      {/* Export Buttons */}
      {showBookingDetails && selectedBooking ? (
        <BookingDetails booking={selectedBooking} onBack={handleBackFromDetails} />
      ) : (
        <>
        
          <div className={styles.exportButtons}>
            <button onClick={exportCSV}>
              <FaDownload /> CSV
            </button>
            <button onClick={exportPDF}>
              <FaDownload /> PDF
            </button>
          </div>
          <div className={styles.header}>
            <h3>🛥️ Yacht Bookings</h3>
            <div className={styles.controls}>
              <div className={styles.searchBox}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
              onChange={(e) => {
                setCurrentPage(1);
                setSearchTerm(e.target.value);
              }}
                />
              </div>

              <div
                className={`${styles.filterContainer} ${
                  filterDropdownOpen ? styles.active : ""
                }`}
                ref={filterRef}
              >
                <button
                  className={styles.filterButton}
                  onClick={toggleFilterDropdown}
                >
                  <FaFilter /> Filter
                </button>
                {filterDropdownOpen && (
                  <div className={styles.filterDropdown}>
                    {/* Location Filter */}
                    <div className={styles.filterGroup}>
                      <select
                        value={filterLocation}
                    onChange={(e) => {
                      setCurrentPage(1);

                      setFilterLocation(e.target.value);
                    }}
                      >
                        <option value="">All Locations</option>
                        {[...new Set(bookings.map((o) => o.location))].map(
                          (loc) => (
                            <option key={loc} value={loc}>
                              {loc}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* Status Multi-Select Filter */}
                    <div className={styles.filterGroup}>
                      <label>
                        <input
                          type="checkbox"
                          checked={filterStatus.includes("Pending")}
                          onChange={() => handleStatusChange("Pending")}
                        />{" "}
                        Pending
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={filterStatus.includes("Confirmed")}
                          onChange={() => handleStatusChange("Confirmed")}
                        />{" "}
                        Confirmed
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={filterStatus.includes("Cancelled")}
                          onChange={() => handleStatusChange("Cancelled")}
                        />{" "}
                        Cancelled
                      </label>
                    </div>
                    <div className={styles.filterGroup}>
                      <label>Sort by:</label>
                      <select
                        value={sortBy}
                        onChange={(e) => {
                      setCurrentPage(1);
                          setSortBy(e.target.value);
                          setFilterDropdownOpen(false);
                        }}
                      >
                        <option value="name">Name</option>
                        <option value="yachts">Yachts</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
              <button className={styles.addButton}>
                <FaPlus /> Add New
              </button>

            </div>
          </div>



          {showUserModal && selectedUser && (
            <div className={styles.modalOverlay} onClick={handleCloseModal}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h3>User Details</h3>
                <table className={styles.userDetailsTable}>
                  <tbody>
                    <tr>
                      <td>ID:</td>
                      <td>{selectedUser.id}</td>
                    </tr>
                    <tr>
                      <td>Name:</td>
                      <td>{selectedUser.user}</td>
                    </tr>
                    <tr>
                      <td>Yacht:</td>
                      <td>{selectedUser.yacht}</td>
                    </tr>
                    <tr>
                      <td>Booking Date:</td>
                      <td>{selectedUser.bookingDate}</td>
                    </tr>
                    <tr>
                      <td>Start Date:</td>
                      <td>{selectedUser.startDate}</td>
                    </tr>
                    <tr>
                      <td>End Date:</td>
                      <td>{selectedUser.endDate}</td>
                    </tr>
                    <tr>
                      <td>Amount:</td>
                      <td>{selectedUser.amount}</td>
                    </tr>
                    <tr>
                      <td>Status:</td>
                      <td>{selectedUser.status}</td>
                    </tr>
                  </tbody>
                </table>
                
                {/* Documents Section */}
                {selectedUser.documents && selectedUser.documents.length > 0 && (
                  <div className={styles.documentsSection}>
                    <h4>Verification Documents</h4>
                    <div className={styles.documentsGrid}>
                      {selectedUser.documents.map((doc) => (
                        <div key={doc.id} className={styles.documentItemSmall}>
                          <div className={styles.documentIconSmall}>
                            {doc.type.toLowerCase().includes('passport') && <FaPassport />}
                            {(doc.type.toLowerCase().includes('license') || doc.type.toLowerCase().includes('id')) && <FaIdCard />}
                            {doc.type.toLowerCase().includes('credit') && <FaCreditCard />}
                            {doc.type.toLowerCase().includes('pdf') && <FaFilePdf />}
                            {(!doc.type.toLowerCase().includes('passport') && 
                              !doc.type.toLowerCase().includes('license') && 
                              !doc.type.toLowerCase().includes('id') && 
                              !doc.type.toLowerCase().includes('credit') && 
                              !doc.type.toLowerCase().includes('pdf')) && <FaFileImage />}
                          </div>
                          <div className={styles.documentInfoSmall}>
                            <span className={styles.docType}>{doc.type}</span>
                            <span className={styles.docDate}>Uploaded: {doc.uploadDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className={styles.viewDetailsPrompt}>
                      View complete details and files in booking details.
                    </p>
                  </div>
                )}
                
                <div className={styles.modalButtons}>
                  <button 
                    className={styles.viewDetailsButton} 
                    onClick={() => {
                      handleCloseModal();
                      handleViewBookingDetails(selectedUser);
                    }}
                  >
                    <FaInfoCircle /> View Booking Details
                  </button>
                  <button className={styles.closeButton} onClick={handleCloseModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}


          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Yacht</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Documents</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className={styles.idCell}>
                    {editingRow === booking.id ? (
                      <input
                        className="inputt"
                        type="text"
                        value={editedData.id}
                        onChange={(e) => handleChange("id", e.target.value)}
                      />
                    ) : (
                      booking.id
                    )}
                  </td>
                  <td 
                    className={`${styles.nameCell} ${styles.clickableUser}`}
                    onClick={() => handleUserClick(booking)}
                  >
                    {editingRow === booking.id ? (
                      <input
                        className="inputt"
                        type="text"
                        value={editedData.user}
                        onChange={(e) => handleChange("user", e.target.value)}
                      />
                    ) : (
                      booking.user
                    )}
                  </td>
                  <td className={styles.yachtCell}>
                    {editingRow === booking.id ? (
                      <input
                        className="inputt"
                        type="text"
                        value={editedData.yacht}
                        onChange={(e) => handleChange("yacht", e.target.value)}
                      />
                    ) : (
                      booking.yacht
                    )}
                  </td>
                  <td className={styles.dateCell}>
                    {editingRow === booking.id ? (
                      <input
                        className="inputt"
                        type="date"
                        value={editedData.date}
                        onChange={(e) => handleChange("date", e.target.value)}
                      />
                    ) : (
                      booking.tripDate
                    )}
                  </td>
                  <td className={styles.amountCell}>
                    {editingRow === booking.id ? (
                      <input
                        className="inputt"
                        type="text"
                        value={editedData.amount}
                        onChange={(e) => handleChange("amount", e.target.value)}
                      />
                    ) : (
                      booking.amount
                    )}
                  </td>
                  <td>
                    {editingRow === booking.id ? (
                      <select
                        value={editedData.status}
                        onChange={(e) => handleChange("status", e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span
                        className={`${styles.statusCell} ${
                          styles[booking.status.toLowerCase()]
                        }`}
                      >
                        {booking.status === "Pending" && (
                          <FaClock className={styles.statusIcon} />
                        )}
                        {booking.status === "Confirmed" && (
                          <FaCheckCircle className={styles.statusIcon} />
                        )}
                        {booking.status === "Cancelled" && (
                          <FaBan className={styles.statusIcon} />
                        )}
                        {booking.status}
                      </span>
                    )}
                  </td>
                  <td className={styles.documentsCell}>
                    {booking.documents && booking.documents.length > 0 ? (
                      <div className={styles.documentBadge} title={`${booking.documents.length} documents uploaded`}>
                        <FaFileAlt className={styles.documentIcon} />
                        <span>{booking.documents.length}</span>
                      </div>
                    ) : (
                      <span className={styles.noDocuments}>None</span>
                    )}
                  </td>
                  <td className={styles.actions}>
                    {editingRow === booking.id ? (
                      <button className={styles.saveButton} onClick={handleSave}>
                        <FaCheck />
                      </button>
                    ) : (
                      <>
                        <button
                          className={styles.detailsButton}
                          onClick={() => handleViewBookingDetails(booking)}
                          title="View Booking Details"
                        >
                          <FaInfoCircle />
                        </button>
                        <button
                          className={styles.invoiceButton}
                          onClick={() => handleGenerateInvoice(booking)}
                          title="Generate Invoice"
                        >
                          <FaFileInvoiceDollar />
                        </button>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEdit(booking.id)}
                          title="Edit Booking"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className={styles.deleteButton}
                          title="Delete Booking"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.pagination}>
            <span>
              Showing {(currentPage - 1) * entriesPerPage + 1} to{" "}
              {Math.min(currentPage * entriesPerPage, totalBookings)} of{" "}
              {totalBookings} entries
            </span>

            <div className={styles.entriesSelector}>
              <span>Show:</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>

            <div className={styles.pageNumbers}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                «
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={currentPage === i + 1 ? styles.active : ""}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RecentBookingComponent;
    
       
