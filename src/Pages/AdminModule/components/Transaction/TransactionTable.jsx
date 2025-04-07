import { useState, useRef, useEffect } from "react";
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
  FaExternalLinkAlt,
  // FaUser, // Removed unused import
} from "react-icons/fa";
import styles from "./TransactionTable.module.scss";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { fetchTransactions, updateTransaction } from "../../../../Redux/adminReducer.js/action";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import YachtDetails from "./YachtDetails";

// **Initial Transactions Data**
const initialTransactions = [
  {
    id: "#T101",
    transactionNumber: "TXN001",
    user: {
      id: "#U101",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 9876",
      location: "Miami, FL",
      bookings: 5,
      totalSpent: "$5,500"
    },
    yacht: {
      id: "#Y101",
      name: "Luxury Cruiser",
      owner: "John Smith",
      length: "120 feet",
      capacity: "12 passengers",
      location: "Miami, FL",
      pricePerDay: "$1200",
      status: "Available"
    },
    amount: "$1200",
    transactionCode: "ABC12345678901234567",
    status: "Completed",
    date: "2024-03-01",
    paymentMethod: "Credit Card",
    cardLast4: "4242",
    billingAddress: "123 Main St, Miami, FL",
    phone: "+1 (555) 9876"
  },
  {
    id: "#T102",
    transactionNumber: "TXN002",
    user: {
      id: "#U102",
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "+44 (770) 1122334",
      location: "Monaco",
      bookings: 3,
      totalSpent: "$2,700"
    },
    yacht: {
      id: "#Y102",
      name: "Ocean Breeze",
      owner: "Emma White",
      length: "90 feet",
      capacity: "8 passengers",
      location: "Monaco",
      pricePerDay: "$900",
      status: "Available"
    },
    amount: "$900",
    transactionCode: "DEF45678901234567890",
    status: "Pending",
    date: "2024-03-02",
    paymentMethod: "Credit Card",
    cardLast4: "1234",
    billingAddress: "45 Ocean Drive, Monaco",
    phone: "+44 (770) 1122334"
  },
  {
    id: "#T103",
    transactionNumber: "TXN003",
    user: {
      id: "#U103",
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "+33 (612) 789012",
      location: "Cannes",
      bookings: 2,
      totalSpent: "$3,000"
    },
    yacht: {
      id: "#Y103",
      name: "Sunset Cruiser",
      owner: "David Wilson",
      length: "100 feet",
      capacity: "10 passengers",
      location: "Cannes",
      pricePerDay: "$1500",
      status: "Available"
    },
    amount: "$1500",
    transactionCode: "GHI78901234567890123",
    status: "Failed",
    date: "2024-03-03",
    paymentMethod: "Credit Card",
    cardLast4: "5678",
    billingAddress: "78 Riviera Blvd, Cannes",
    phone: "+33 (612) 789012"
  },
  {
    id: "#T104",
    transactionNumber: "TXN004",
    user: {
      id: "#U104",
      name: "Emma White",
      email: "emma@example.com",
      phone: "+1 (555) 6543",
      location: "Dubai",
      bookings: 4,
      totalSpent: "$8,000"
    },
    yacht: {
      id: "#Y104",
      name: "Sea Explorer",
      owner: "Sophia Martinez",
      length: "130 feet",
      capacity: "14 passengers",
      location: "Dubai",
      pricePerDay: "$2000",
      status: "Available"
    },
    amount: "$2000",
    transactionCode: "JKL01234567890123456",
    status: "Completed",
    date: "2024-03-04",
    paymentMethod: "Credit Card",
    cardLast4: "9012",
    billingAddress: "123 Palm Jumeirah, Dubai",
    phone: "+1 (555) 6543"
  },
  {
    id: "#T105",
    transactionNumber: "TXN005",
    user: {
      id: "#U105",
      name: "Liam Harris",
      email: "liam@example.com",
      phone: "+49 (171) 654321",
      location: "Barcelona",
      bookings: 1,
      totalSpent: "$800"
    },
    yacht: {
      id: "#Y105",
      name: "Wave Rider",
      owner: "Isabella Young",
      length: "75 feet",
      capacity: "6 passengers",
      location: "Barcelona",
      pricePerDay: "$800",
      status: "Available"
    },
    amount: "$800",
    transactionCode: "MNO34567890123456789",
    status: "Pending",
    date: "2024-03-05",
    paymentMethod: "Credit Card",
    cardLast4: "3456",
    billingAddress: "56 Marina Way, Barcelona",
    phone: "+49 (171) 654321"
  }
];

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("transactionNumber");
  const [filterStatus, setFilterStatus] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedYacht, setSelectedYacht] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showYachtModal, setShowYachtModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [totalTransactions, setTotalTransactions] = useState(0);
  const dispatch = useDispatch();
  const filterRef = useRef(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    // const storedTransactions = JSON.parse(localStorage.getItem("transactionsData")) || [];
    // setTransactions([...initialTransactions, ...storedTransactions]);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ **Update localStorage whenever transactions change**
  // useEffect(() => {
  //   const storedTransactions = transactions.filter(transaction => !initialTransactions.some(t => t.id === transaction.id)); // Exclude initial transactions
  //   localStorage.setItem("transactionsData", JSON.stringify(storedTransactions));
  // }, [transactions]);

  const toggleFilterDropdown = () => setFilterDropdownOpen(!filterDropdownOpen);

  // Handle multi-select status filter
  const handleStatusChange = (status) => {
    setFilterStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Sorting logic
  // **Filter Transactions**
  // const filteredTransactions = [...transactions]
  //   .filter((transaction) => {
  //     const matchesSearch =
  //       transaction.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       transaction.user.toLowerCase().includes(searchTerm.toLowerCase());
  // const filteredTransactions = [...transactions]
  //   .filter((transaction) => {
  //     const matchesSearch =
  //       transaction.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       transaction.user.name.toLowerCase().includes(searchTerm.toLowerCase());

  //     const matchesStatus =
  //       filterStatus.length === 0 || filterStatus.includes(transaction.status);

  //     return (
  //       matchesSearch && matchesStatus
  //     );
  //   })
  //   .sort((a, b) => {
  //     if (sortBy === "transactionNumber") return a.transactionNumber.localeCompare(b.transactionNumber);
  //     return 0;
  //   });

  // Pagination logic
  // const totalPages = Math.ceil(filteredTransactions.length / entriesPerPage);
  // const startIndex = (currentPage - 1) * entriesPerPage;
  // const endIndex = Math.min(startIndex + entriesPerPage, filteredTransactions.length);
  // const transactions = filteredTransactions.slice(startIndex, endIndex);

  // Handle Edit Click
  const handleEdit = (id) => {
    const transactionToEdit = transactions.find((transaction) => transaction.id === id);
    setEditingRow(id);
    setEditedData({ ...transactionToEdit }); // Copy the selected row's data
  };

  // Handle Input Changes
  const handleChange = (field, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Handle Save Click
  const handleSave = async  () => {
    console.log(editedData) 
    const previousTransactions = [...transactions];

    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === editedData.id ? editedData : transaction
      )
    );
    try {
      await dispatch(updateTransaction(editedData._id, editedData));
      toast.success("Transaction updated successfully");
    } catch (error) {
      console.error("Error updating transaction:", error);
      setTransactions(previousTransactions);
      toast.error("Failed to update transaction");
    } finally {
      setEditingRow(null);
    }
  };

  // **Export as CSV**
  const exportCSV = () => {
    const csvContent = [
      "Transaction Number, User, Yacht, Amount, Transaction Code, Date, Phone, Status",
      ...transactions.map(
        (t) =>
          `${t.transactionNumber},${t.user.name},${t.yacht.name},${t.amount},${t.transactionCode},${t.date},${t.phone},${t.status}`
      ),
    ].join("\n");
    saveAs(
      new Blob([csvContent], { type: "text/csv;charset=utf-8;" }),
      "Transactions.csv"
    );
  };

  // **Export as PDF**
  const exportPDF = () => {
    try {
      // Create a new jsPDF instance
      const doc = new jsPDF();
      
      // Set document title
      doc.text("Transactions Report", 14, 15);
      
      // Define the columns
      const columns = [
        { header: 'Transaction Number', dataKey: 'transactionNumber' },
        { header: 'User', dataKey: 'user.name' },
        { header: 'Yacht', dataKey: 'yacht.name' },
        { header: 'Amount', dataKey: 'amount' },
        { header: 'Transaction Code', dataKey: 'transactionCode' },
        { header: 'Date', dataKey: 'date' },
        { header: 'Phone', dataKey: 'phone' },
        { header: 'Status', dataKey: 'status' }
      ];
      
      // Generate the table
      doc.autoTable({
        columns: columns,
        body: paginatedTransactions,
        startY: 20,
        margin: { top: 20 },
        styles: { overflow: 'linebreak' },
        bodyStyles: { valign: 'top' },
        columnStyles: { 
          transactionCode: { cellWidth: 'auto' },
          user: { cellWidth: 'auto' }
        }
      });
      
      // Save the PDF
      doc.save("Transactions.pdf");
      
      console.log("PDF generated successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };
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
  }, [debouncedSearchTerm, filterStatus]);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        // setLoading(true);
        const filters = {
          search: debouncedSearchTerm,
          status: filterStatus,
          // location: filterLocation,
          sort: sortBy,
          order: "desc",
          page: currentPage,
          limit: entriesPerPage,
        };
        const data = await dispatch(fetchTransactions(filters));
        setTransactions(data.data); // ✅ Set userss list from API response
        setTotalPages(data.totalPages); // ✅ Backend should return `totalPages`
        setTotalTransactions(data.total);
        console.log(data.data);
      } catch (error) {
        console.error("Failed to load yacht userss");
      } finally {
        // setLoading(false);
      }
    };

    getTransactions();
  }, [
    currentPage,
    entriesPerPage,
    debouncedSearchTerm,
    filterStatus,
    // filterLocation,
  ]);
  console.log(transactions)
  // Handle user click
  const [userLoading, setUserLoading] = useState(false);
  const handleUserClick = async (userId) => {
    setShowUserModal(true);       // Show modal immediately (with loader)
    setUserLoading(true);         // Optional loading state inside modal
  
    try {
      const res = await fetch(`${BASE_URL}/users/${userId}`);
      const data = await res.json();
      setSelectedUser(data.data);
      console.log(data.data)
    } catch (err) {
      console.error("❌ Error fetching user:", err);
    } finally {
      setUserLoading(false);
    }
  };
  

  // Handle yacht click
  const handleYachtClick = (yacht) => {
    setSelectedYacht(yacht);
    setShowYachtModal(true);
  };

  // Handle transaction click
  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  // Handle view more clicks
  const handleViewMoreUser = (user) => {
    setShowUserModal(false);
    navigate(`/adminn/users?search=${user}`);
  };

  const handleViewMoreYacht = () => {
    setShowYachtModal(false);
    navigate('/adminn/yachts');
  };

  // Handle modal closes
  const handleCloseUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  const handleCloseYachtModal = () => {
    setShowYachtModal(false);
    setSelectedYacht(null);
  };

  const handleCloseTransactionModal = () => {
    setShowTransactionModal(false);
    setSelectedTransaction(null);
  };

  return (
    <div className={styles.transactionsContainer}>
      {/* Export Buttons */}
      <div className={styles.exportButtons}>
        <button onClick={exportCSV}>
          <FaDownload /> CSV
        </button>
        <button onClick={exportPDF}>
          <FaDownload /> PDF
        </button>
      </div>
      {/* 📌 Header & Controls */}
      <div className={styles.header}>
        <h3>🛥️ Transactions</h3>
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                {/* Status Multi-Select Filter */}
                <div className={styles.filterGroup}>
                  <label>
                    <input
                      type="checkbox"
                      checked={filterStatus.includes("Completed")}
                      onChange={() => handleStatusChange("Completed")}
                    />{" "}
                    Completed
                  </label>
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
                      checked={filterStatus.includes("Failed")}
                      onChange={() => handleStatusChange("Failed")}
                    />{" "}
                    Failed
                  </label>
                </div>
                <div className={styles.filterGroup}>
                  <label>Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setFilterDropdownOpen(false);
                    }}
                  >
                    <option value="transactionNumber">Transaction Number</option>
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

      {/* 📌 Table */}
      <table className={styles.table}>
        <thead>
          <tr className={styles.emailCell}>
            <th>Trnx No</th>
            <th>Type</th>

            <th>From</th>
            <th>To</th>

            <th>Amount</th>
            <th>Trnx Reference</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className={styles.nameCell}>
                {editingRow === transaction.id ? (
                  <input
                    className="inputt"
                    type="text"
                    value={editedData.transactionNumber}
                    onChange={(e) => handleChange("transactionNumber", e.target.value)}
                  />
                ) : (
                  transaction.transactionNumber
                )}
              </td>
              <td className={styles.nameCell}>
                {editingRow === transaction.id ? (
                  <input
                    className="inputt"
                    type="text"
                    value={editedData.type}
                    onChange={(e) => handleChange("transactionNumber", e.target.value)}
                  />
                ) : (
                  transaction.type
                )}
              </td>
              {/* <td className={styles.nameCell}>
                {editingRow === transaction.id ? (
                  
                  <input
                    className="inputt"
                    type="text"
                    value={editedData.user}
                    onChange={(e) => handleChange("user", e.target.value)}
                  />
                ) : (
                transaction.type==="payment"?  transaction.user:"Platform"
                )}
              </td> */}
              <td 
                className={`${styles.nameCell} ${transaction.type === "payment" ? styles.clickableCell : ''}`}
                onClick={transaction.type === "payment" ? () => handleUserClick(transaction.user.id) : undefined}
                // className={`${styles.nameCell} ${styles.clickableCell}`}
                // onClick={() => handleUserClick(transaction.user)}
              >
                {transaction.type==="payment"?  transaction.user.name:"Platform"}
              </td>
              <td 
             className={`${styles.nameCell} ${transaction.type === "payout" ? styles.clickableCell : ''}`}
             onClick={transaction.type === "payout" ? () => handleUserClick(transaction.owner.id) : undefined}
              
              >
                {editingRow === transaction.id ? (
                  <input
                    className="inputt"
                    type="text"
                    value={editedData.yacht}
                    onChange={(e) =>
                      handleChange("yacht", e.target.value)
                    }
                  />
                ) : (
                  transaction.type==="payout"?  transaction.owner.name:"Platform"

                )}
              </td>
              <td className={styles.roleCell}>
                {editingRow === transaction.id ? (
                  <input
                    className="inputt"
                    type="text"
                    value={editedData.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                  />
                ) : (
                  transaction.amount
                )}
              </td>
              <td 
                className={`${styles.transactionCell} ${styles.clickableCell}`}
                onClick={() => handleTransactionClick(transaction)}
              >
                {transaction.transactionCode}
              </td>
              <td className={styles.roleCell}>
                {editingRow === transaction.id ? (
                  <input
                    className="inputt"
                    type="date"
                    value={editedData.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                  />
                ) : (
                  transaction.date
                )}
              </td>
              {/* <td className={styles.roleCell}>
                {editingRow === transaction.id ? (
                  <input
                    className="inputt"
                    type="text"
                    value={editedData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                ) : (
                  transaction.phone
                )}
              </td> */}
              <td>
                {editingRow === transaction.id ? (
                  <select
                    value={editedData.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                  >
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                ) : (
                  <span
                    className={`${styles.statusCell} ${
                      styles[transaction.status.toLowerCase()]
                    }`}
                  >
                    {transaction.status === "Completed" && (
                      <FaCheckCircle className={styles.statusIcon} />
                    )}
                    {transaction.status === "Pending" && (
                      <FaClock className={styles.statusIcon} />
                    )}
                    {transaction.status === "Failed" && (
                      <FaBan className={styles.statusIcon} />
                    )}
                    {transaction.status}
                  </span>
                )}
              </td>
              <td className={styles.actions}>
                {editingRow === transaction.id ? (
                  <button
                    className={styles.saveButton}
                    onClick={handleSave}
                  >
                    <FaCheck />
                  </button>
                ) : (
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit(transaction.id)}
                  >
                    <FaEdit />
                  </button>
                )}
                <button className={styles.deleteButton}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📌 Pagination */}
      <div className={styles.pagination}>
        <span>
          Showing {(currentPage - 1) * entriesPerPage + 1} to{" "}
          {Math.min(currentPage * entriesPerPage, totalTransactions)} of{" "}
          {totalTransactions} entries
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
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      </div>

      {/* User Modal */}
      {console.log(userLoading)}
      {showUserModal && selectedUser && ( 
        <div className={styles.modalOverlay} onClick={handleCloseUserModal}>
          {userLoading && (
            <div className={styles.loadingOverlay}>
              <div className={styles.loadingSpinner}></div>
            </div>
          )}
          {!userLoading && (
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>User Details</h3>
            <div className={styles.modalBody}>
              <div className={styles.detailRow}>
                <span>ID:</span>
                <span>{selectedUser.id}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Name:</span>
                <span>{selectedUser.name}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Email:</span>
                <span>{selectedUser.email}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Phone:</span>
                <span>{selectedUser.phone}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Location:</span>
                <span>{selectedUser.location}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Total Bookings:</span>
                <span>{selectedUser.bookings}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Total Spent:</span>
                <span>{selectedUser.totalSpent}</span>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.viewMoreButton} onClick={()=>handleViewMoreUser(selectedUser.name)}>
                <FaExternalLinkAlt /> View More Details
              </button>
              <button className={styles.closeButton} onClick={handleCloseUserModal}>
                Close
              </button>
            </div>
          </div>
          )}
        </div>
      )}

      {/* Yacht Modal */}
      {showYachtModal && selectedYacht && (
        <div className={styles.modalOverlay} onClick={handleCloseYachtModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Yacht Details</h3>
            <div className={styles.modalBody}>
              <div className={styles.detailRow}>
                <span>ID:</span>
                <span>{selectedYacht.id}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Name:</span>
                <span>{selectedYacht.name}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Owner:</span>
                <span>{selectedYacht.owner}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Length:</span>
                <span>{selectedYacht.length}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Capacity:</span>
                <span>{selectedYacht.capacity}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Location:</span>
                <span>{selectedYacht.location}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Price per Day:</span>
                <span>{selectedYacht.pricePerDay}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Status:</span>
                <span>{selectedYacht.status}</span>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.viewMoreButton} onClick={handleViewMoreYacht}>
                <FaExternalLinkAlt /> View More Details
              </button>
              <button className={styles.closeButton} onClick={handleCloseYachtModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {showTransactionModal && selectedTransaction && (
        <div className={styles.modalOverlay} onClick={handleCloseTransactionModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Transaction Details</h3>
            <div className={styles.modalBody}>
              <div className={styles.detailRow}>
                <span>Transaction ID:</span>
                <span>{selectedTransaction.id}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Transaction Number:</span>
                <span>{selectedTransaction.transactionNumber}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Amount:</span>
                <span>{selectedTransaction.amount}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Status:</span>
                <span className={`${styles.statusBadge} ${styles[selectedTransaction.status.toLowerCase()]}`}>
                  {selectedTransaction.status}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span>Date:</span>
                <span>{selectedTransaction.date}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Payment Method:</span>
                <span>{selectedTransaction.paymentMethod}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Card:</span>
                <span>**** **** **** {selectedTransaction.cardLast4}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Billing Address:</span>
                <span>{selectedTransaction.billingAddress}</span>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.closeButton} onClick={handleCloseTransactionModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;
