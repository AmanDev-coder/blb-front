import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSearch,
  FaFilter,
  FaDownload,
  FaEdit,
  FaCheck,
} from "react-icons/fa";
import styles from "./OwnerPayoutComponent.module.scss";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import {
  getYachtOwnersPayouts,
  updatePayoutStatus,
} from "../../../../Redux/yachtOwnerReducer/action";
import { toast } from "react-toastify";

const initialPayouts = [
  {
    id: "#P101",
    owner: {
      name: "James Smith",
      email: "james@example.com",
      contact: "+1 (555) 1234",
      profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    date: "2024-05-12",
    amount: "$5,000",
    reference: "TXN123456789",
    status: "Pending",
  },
  {
    id: "#P102",
    owner: {
      name: "Sophia Johnson",
      email: "sophia@example.com",
      contact: "+44 (770) 0900123",
      profileImg: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    date: "2024-05-10",
    amount: "$3,200",
    reference: "TXN987654321",
    status: "Approved",
  },
  {
    id: "#P103",
    owner: {
      name: "Michael Lee",
      email: "michael@example.com",
      contact: "+33 (612) 345678",
      profileImg: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    date: "2024-05-08",
    amount: "$4,500",
    reference: "TXN564738291",
    status: "Declined",
  },
  {
    id: "#P104",
    owner: {
      name: "Emma Brown",
      email: "emma@example.com",
      contact: "+49 (171) 2345678",
      profileImg: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    date: "2024-05-07",
    amount: "$6,800",
    reference: "TXN192837465",
    status: "On Hold",
  },
];

const OwnerPayoutComponent = () => {
  const dispatch = useDispatch();
  // const payouts = useSelector((store) => store.yachtOwnerReducer.OwnerPayouts);
  const [payouts, setPayouts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterStatus, setFilterStatus] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRow, setEditingRow] = useState(null);
  const [editedStatus, setEditedStatus] = useState("");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [revenueRange, setRevenueRange] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  // const [filters, setFilters] = useState({
  //   status: "",
  //   page: 1,
  //   limit: 10,
  //   sortBy: "requestedAt",
  //   order: "desc",
  // });
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayouts, setTotalPayouts] = useState(0);
  const filterRef = useRef(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
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

  // Handle Edit Click
  const handleEdit = (id) => {
    console.log("ed click");

    const payoutToEdit = payouts.find((payout) => payout.id === id);
    setEditingRow(id);
    setEditedStatus(payoutToEdit.status);
  };

  // Handle Save Click
  // Handle Save Click (Status Update Only)
  const handleSave = async () => {
    console.log("ed save click");

    const previousPayouts = [...payouts]; // Keep a backup in case of error

    setPayouts((prevPayouts) =>
      prevPayouts.map((payout) =>
        payout.id === editingRow ? { ...payout, status: editedStatus } : payout
      )
    );

    try {
      // Dispatching only status update to the backend
      console.log(editingRow, editedStatus);
      await dispatch(
        updatePayoutStatus(editingRow, { status: editedStatus })
       
      );

      // Clear edit mode
      setEditingRow(null);
    } catch (error) {
      console.error("Failed to update status:", error);

      // Revert to previous state on error
      setPayouts(previousPayouts);

      // Optionally, show error notification to user
      toast.error("Failed to update status. Please try again.");
    }
  };

  // Filtering logic
  // const filteredPayouts = [...payouts]
  //   .filter((payout) => {
  //     const matchesSearch =
  //       payout.owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       payout.owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       payout.reference.toLowerCase().includes(searchTerm.toLowerCase());

  //     const matchesStatus =
  //       filterStatus.length === 0 || filterStatus.includes(payout.status);

  //     return matchesSearch && matchesStatus;
  //   })
  //   .sort((a, b) => {
  //     if (sortBy === "date") return new Date(b.date) - new Date(a.date);
  //     if (sortBy === "amount") {
  //       return parseFloat(b.amount.replace(/[$,]/g, "")) -
  //              parseFloat(a.amount.replace(/[$,]/g, ""));
  //     }
  //     if (sortBy === "name") return a.owner.name.localeCompare(b.owner.name);
  //     return 0;
  //   });

  // Pagination logic
  // const totalPages = Math.ceil(filteredPayouts.length / entriesPerPage);
  // const startIndex = (currentPage - 1) * entriesPerPage;
  // const endIndex = Math.min(startIndex + entriesPerPage, filteredPayouts.length);
  // const paginatedPayouts = filteredPayouts.slice(startIndex, endIndex);

  // **Export as CSV**
  const exportCSV = () => {
    const csvContent = [
      "ID,Owner,Email,Contact,Date,Amount,Reference,Status",
      ...payouts.map(
        (p) =>
          `${p.id},${p.owner.name},${p.owner.email},${p.owner.contact},${p.date},${p.amount},${p.reference},${p.status}`
      ),
    ].join("\n");
    saveAs(
      new Blob([csvContent], { type: "text/csv;charset=utf-8;" }),
      "OwnerPayouts.csv"
    );
  };

  // **Export as PDF**
  const exportPDF = () => {
    try {
      // Create a new jsPDF instance
      const doc = new jsPDF();

      // Set document title
      doc.text("Owner Payouts Report", 14, 15);

      // Define the columns
      const columns = [
        { header: "ID", dataKey: "id" },
        { header: "Owner", dataKey: "owner" },
        { header: "Email", dataKey: "email" },
        { header: "Date", dataKey: "date" },
        { header: "Amount", dataKey: "amount" },
        { header: "Reference", dataKey: "reference" },
        { header: "Status", dataKey: "status" },
      ];

      // Prepare the data
      const data = payouts.map((p) => ({
        id: p.id,
        owner: p.owner.name,
        email: p.owner.email,
        date: p.date,
        amount: p.amount,
        reference: p.reference,
        status: p.status,
      }));

      // Generate the table
      doc.autoTable({
        columns: columns,
        body: data,
        startY: 20,
        margin: { top: 20 },
        styles: { overflow: "linebreak" },
        bodyStyles: { valign: "top" },
        columnStyles: { email: { cellWidth: "auto" } },
      });

      // Save the PDF
      doc.save("OwnerPayouts.pdf");

      console.log("PDF generated successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // Status style mapping functions
  const getStatusClassName = (status) => {
    const statusMap = {
      Approved: "active",
      Pending: "pending",
      Declined: "suspended",
      "On Hold": "pending",
    };
    return statusMap[status] || "";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <FaCheckCircle className={styles.statusIcon} />;
      case "Pending":
        return <FaClock className={styles.statusIcon} />;
      case "On Hold":
        return <FaClock className={styles.statusIcon} />;
      case "Declined":
        return <FaTimesCircle className={styles.statusIcon} />;
      default:
        return null;
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
    const getOwnersPayouts = async () => {
      try {
        // secltLoading(true);
        // console.log("searchTerm",searchTerm)
        // console.log(debouncedSearchTerm)
        const filters = {
          search: debouncedSearchTerm,
          status: filterStatus,
          revenueRange: revenueRange,
          location: filterLocation,
          sort: sortBy,
          order: "desc",
          page: currentPage,
          limit: entriesPerPage,
        };
        // if(searchTerm){
        //   filters.search=debouncedSearchTerm
        // }
        const data = await dispatch(getYachtOwnersPayouts(filters));
        setPayouts(data.data); // ✅ Set owners list from API response
        setTotalPages(data.totalPages); // ✅ Backend should return `totalPages`
        setTotalPayouts(data.total);
        console.log(data.data);
      } catch (error) {
        console.error("Failed to load yacht owners");
      } finally {
        // setLoading(false);
      }
    };

    getOwnersPayouts();
  }, [
    currentPage,
    revenueRange,
    entriesPerPage,
    debouncedSearchTerm,
    filterStatus,
    filterLocation,
  ]);

  return (
    <div className={styles.yachtOwnersContainer}>
      {/* Header & Controls */}
      <div className={styles.header}>
        <h3>💰 Owner Payouts</h3>
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search payouts..."
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
                      checked={filterStatus.includes("Approved")}
                      onChange={() => handleStatusChange("Approved")}
                    />{" "}
                    Approved
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
                      checked={filterStatus.includes("Declined")}
                      onChange={() => handleStatusChange("Declined")}
                    />{" "}
                    Declined
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={filterStatus.includes("On Hold")}
                      onChange={() => handleStatusChange("On Hold")}
                    />{" "}
                    On Hold
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
                    <option value="date">Date</option>
                    <option value="amount">Amount</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <button className={styles.filterButton} onClick={exportCSV}>
            <FaDownload /> CSV
          </button>
          <button className={styles.filterButton} onClick={exportPDF}>
            <FaDownload /> PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Profile</th>
            <th>Owner</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Reference #</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payouts.length > 0 &&
            payouts?.map((payout) => (
              <tr key={payout.id}>
                <td>
                  <img
                    src={payout.owner.profileImg}
                    alt={payout.owner.name}
                    className={styles.avatar}
                  />
                </td>
                <td className={styles.nameCell}>{payout.owner.name}</td>
                <td className={styles.emailCell}>{payout.owner.email}</td>
                <td className={styles.contactCell}>{payout.owner.contact}</td>
                <td>{payout.date}</td>
                <td>{payout.amount}</td>
                <td>{payout.reference}</td>
                <td>
                  {editingRow === payout.id ? (
                    <select
                      value={editedStatus}
                      onChange={(e) => setEditedStatus(e.target.value)}
                      className={styles.inputt}
                    >
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Declined">Declined</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  ) : (
                    <span
                      className={`${styles.statusCell} ${
                        styles[getStatusClassName(payout.status)]
                      }`}
                    >
                      {getStatusIcon(payout.status)}
                      {payout.status}
                    </span>
                  )}
                </td>
                <td className={styles.actions}>
                  {editingRow === payout.id ? (
                    <button className={styles.saveButton} onClick={handleSave}>
                      <FaCheck />
                    </button>
                  ) : (
                    <button
                      className={styles.editButton}
                      onClick={() => handleEdit(payout.id)}
                    >
                      <FaEdit />
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className={styles.pagination}>
        <span>
          Showing {(currentPage - 1) * entriesPerPage + 1} to{" "}
          {Math.min(currentPage * entriesPerPage, totalPayouts)} of{" "}
          {totalPayouts} entries
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
    </div>
  );
};

export default OwnerPayoutComponent;
