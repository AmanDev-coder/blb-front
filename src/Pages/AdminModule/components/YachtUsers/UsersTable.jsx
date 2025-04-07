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
  FaUser,
} from "react-icons/fa";
import styles from "./UsersTable.module.scss";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { fetchUsers } from "../../../../Redux/adminReducer.js/action";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
// import YachtDetails from "./YachtDetails";

// **Initial Users Data**
const initialUsers = [
  {
    id: "#U101",
    name: "John Doe",
    email: "john@example.com",
    contact: "+1 (555) 9876",
    role: "Customer",
    status: "Active",
    location: "Miami, FL",
    totalBookings: 5,
    totalSpent: "$5,500",
    profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "#U102",
    name: "Alice Johnson",
    email: "alice@example.com",
    contact: "+44 (770) 1122334",
    role: "Customer",
    status: "Active",
    location: "Monaco",
    totalBookings: 3,
    totalSpent: "$2,700",
    profileImg: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "#U103",
    name: "Michael Brown",
    email: "michael@example.com",
    contact: "+33 (612) 789012",
    role: "Customer",
    status: "Pending",
    location: "Cannes",
    totalBookings: 2,
    totalSpent: "$3,000",
    profileImg: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: "#U104",
    name: "Emma White",
    email: "emma@example.com",
    contact: "+1 (555) 6543",
    role: "Customer",
    status: "Active",
    location: "Dubai",
    totalBookings: 4,
    totalSpent: "$8,000",
    profileImg: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: "#U105",
    name: "Liam Harris",
    email: "liam@example.com",
    contact: "+49 (171) 654321",
    role: "Customer",
    status: "Pending",
    location: "Barcelona",
    totalBookings: 1,
    totalSpent: "$800",
    profileImg: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    id: "#U106",
    name: "Sophia Martinez",
    email: "sophia@example.com",
    contact: "+34 (600) 555555",
    role: "Editor",
    status: "Suspended",
    profileImg: "https://randomuser.me/api/portraits/women/15.jpg",
  },
  {
    id: "#U107",
    name: "James Wilson",
    email: "james@example.com",
    contact: "+1 (555) 223344",
    role: "Viewer",
    status: "Active",
    profileImg: "https://randomuser.me/api/portraits/men/16.jpg",
  },
  {
    id: "#U108",
    name: "Olivia Adams",
    email: "olivia@example.com",
    contact: "+33 (612) 123456",
    role: "Admin",
    status: "Pending",
    profileImg: "https://randomuser.me/api/portraits/women/17.jpg",
  },
  {
    id: "#U109",
    name: "Noah Thompson",
    email: "noah@example.com",
    contact: "+44 (770) 556677",
    role: "Moderator",
    status: "Active",
    profileImg: "https://randomuser.me/api/portraits/men/18.jpg",
  },
  {
    id: "#U110",
    name: "Ava Clark",
    email: "ava@example.com",
    contact: "+49 (171) 876543",
    role: "Viewer",
    status: "Suspended",
    profileImg: "https://randomuser.me/api/portraits/women/19.jpg",
  },
  {
    id: "#U111",
    name: "William Scott",
    email: "william@example.com",
    contact: "+1 (555) 888999",
    role: "Editor",
    status: "Active",
    profileImg: "https://randomuser.me/api/portraits/men/20.jpg",
  },
  {
    id: "#U112",
    name: "Isabella Young",
    email: "isabella@example.com",
    contact: "+34 (600) 777888",
    role: "Admin",
    status: "Pending",
    profileImg: "https://randomuser.me/api/portraits/women/21.jpg",
  },
  {
    id: "#U113",
    name: "Ethan King",
    email: "ethan@example.com",
    contact: "+44 (770) 999000",
    role: "Moderator",
    status: "Suspended",
    profileImg: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    id: "#U114",
    name: "Charlotte Green",
    email: "charlotte@example.com",
    contact: "+1 (555) 222111",
    role: "Editor",
    status: "Active",
    profileImg: "https://randomuser.me/api/portraits/women/23.jpg",
  },
  {
    id: "#U115",
    name: "Benjamin Baker",
    email: "benjamin@example.com",
    contact: "+33 (612) 555666",
    role: "Viewer",
    status: "Pending",
    profileImg: "https://randomuser.me/api/portraits/men/24.jpg",
  },
  {
    id: "#U116",
    name: "Mia Hall",
    email: "mia@example.com",
    contact: "+49 (171) 444333",
    role: "Admin",
    status: "Active",
    profileImg: "https://randomuser.me/api/portraits/women/25.jpg",
  },
  {
    id: "#U117",
    name: "Lucas Allen",
    email: "lucas@example.com",
    contact: "+1 (555) 123456",
    role: "Moderator",
    status: "Suspended",
    profileImg: "https://randomuser.me/api/portraits/men/26.jpg",
  },
  {
    id: "#U118",
    name: "Harper Wright",
    email: "harper@example.com",
    contact: "+33 (612) 777999",
    role: "Editor",
    status: "Pending",
    profileImg: "https://randomuser.me/api/portraits/women/27.jpg",
  },
  {
    id: "#U119",
    name: "Daniel Carter",
    email: "daniel@example.com",
    contact: "+44 (770) 888777",
    role: "Viewer",
    status: "Active",
    profileImg: "https://randomuser.me/api/portraits/men/28.jpg",
  },
  {
    id: "#U120",
    name: "Evelyn Nelson",
    email: "evelyn@example.com",
    contact: "+49 (171) 666555",
    role: "Admin",
    status: "Suspended",
    profileImg: "https://randomuser.me/api/portraits/women/29.jpg",
  },
  {
    id: "#U121",
    name: "Henry Mitchell",
    email: "henry@example.com",
    contact: "+1 (555) 111222",
    role: "Editor",
    status: "Active",
    profileImg: "https://randomuser.me/api/portraits/men/30.jpg",
  },
  {
    id: "#U122",
    name: "Scarlett Perez",
    email: "scarlett@example.com",
    contact: "+34 (600) 999111",
    role: "Viewer",
    status: "Pending",
    profileImg: "https://randomuser.me/api/portraits/women/31.jpg",
  },
  {
    id: "#U123",
    name: "Jack Roberts",
    email: "jack@example.com",
    contact: "+33 (612) 222333",
    role: "Moderator",
    status: "Active",
    profileImg: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "#U124",
    name: "Victoria Collins",
    email: "victoria@example.com",
    contact: "+49 (171) 777888",
    role: "Admin",
    status: "Suspended",
    profileImg: "https://randomuser.me/api/portraits/women/33.jpg",
  },
  {
    id: "#U125",
    name: "Sebastian Turner",
    email: "sebastian@example.com",
    contact: "+1 (555) 444555",
    role: "Editor",
    status: "Pending",
    profileImg: "https://randomuser.me/api/portraits/men/34.jpg",
  },
  {
    id: "#U126",
    name: "Penelope Reed",
    email: "penelope@example.com",
    contact: "+44 (770) 222555",
    role: "Viewer",
    status: "Active",
    profileImg: "https://randomuser.me/api/portraits/women/35.jpg",
  },
];

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterStatus, setFilterStatus] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [filterLocation, setFilterLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setselectedUser] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const searchParam = queryParams.get('search');
    
    if (searchParam) {
      setSearchTerm(searchParam);
    }
    
    // dispatch(fetchUsers());
  }, []);
  //   useEffect(() => {
  //     const storeduserss = localStorage.getItem("userssData");

  //     if (storeduserss) {
  //       // Merge Initial Data + Stored Data
  //       const mergeduserss = [...initialUsers, ...JSON.parse(storeduserss)];
  //       setuserss(mergeduserss);
  //     } else {
  //       // First time, save initial JSON data to `localStorage`
  //     //   localStorage.setItem("userssData", JSON.stringify([])); // Empty initially
  //       setuserss(initialUsers);
  //     }
  //   }, []);

  const filterRef = useRef(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    // const storedUsers = JSON.parse(localStorage.getItem("usersData")) || [];
    // setUsers([...users, ...storedUsers]);
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
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;


  // Sorting logic

  // Handle Edit Click
  
  const handleEdit = (id) => {

    const usersToEdit = users.find((users) => users.id === id);
    setEditingRow(id);
    setEditedData({ ...usersToEdit }); // Copy the selected row's data
  };

  // Handle Input Changes
  const handleChange = (field, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: field === "yachts" ? parseInt(value, 10) || 0 : value, // Ensure yachts remains numeric
    }));
  };

  // Handle Save Click
  const handleSave = async() => {
    const previousUsers = [...users];
  
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === editedData.id ? editedData : user))
    );

    try { 
      // await dispatch(updateUserRole(editedData.id, editedData));
      const response = await axios.patch(`${BASE_URL}/users/${editedData.id}`, editedData);
      console.log(response)
    } catch (error) {
      console.error("Error updating user role:", error);
      setUsers(previousUsers);
      toast.error("Failed to update user role");
    } finally {
      setEditingRow(null);
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
  }, [debouncedSearchTerm, filterStatus, filterLocation]);
  useEffect(() => {
    const getUsers = async () => {
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
        const data = await dispatch(fetchUsers(filters));
        setUsers(data.data); // ✅ Set userss list from API response
        setTotalPages(data.totalPages); // ✅ Backend should return `totalPages`
        setTotalUsers(data.total);
        // Remove search query parameter from URL if it exists
       
        console.log(data.data);
      } catch (error) {
        console.error("Failed to load yacht userss");
      } finally {
        // setLoading(false);
      }
    };

    getUsers();
  }, [
    currentPage,
    entriesPerPage,
    debouncedSearchTerm,
    filterStatus,
    filterLocation,
  ]);

  // **Export as CSV**
  const exportCSV = () => {
    const csvContent = [
      "ID, Name, Email, Contact, Status",
      ...users.map(
        (o) => `${o.id},${o.name},${o.email},${o.contact},${o.status}`
      ),
    ].join("\n");
    saveAs(
      new Blob([csvContent], { type: "text/csv;charset=utf-8;" }),
      "YachtUsers.csv"
    );
  };

  // **Export as PDF**
  const exportPDF = () => {
    try {
      // Create a new jsPDF instance
      const doc = new jsPDF();
      
      // Set document title
      doc.text("Yacht Users Report", 14, 15);
      
      // Define the columns
      const columns = [
        { header: 'ID', dataKey: 'id' },
        { header: 'Name', dataKey: 'name' },
        { header: 'Email', dataKey: 'email' },
        { header: 'Contact', dataKey: 'contact' },
        { header: 'Role', dataKey: 'role' },
        { header: 'Status', dataKey: 'status' }
      ];
      
      // Generate the table
      doc.autoTable({
        columns: columns,
        body: paginatedOwners,
        startY: 20,
        margin: { top: 20 },
        styles: { overflow: 'linebreak' },
        bodyStyles: { valign: 'top' },
        columnStyles: { email: { cellWidth: 'auto' } }
      });
      
      // Save the PDF
      doc.save("YachtUsers.pdf");
      
      console.log("PDF generated successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className={styles.yachtOwnersContainer}>
      {/* Export Buttons */}

      {/* 📌 If an users is selected, show Yacht Details Page */}
      {selectedUser ? (
        console.log(selectedUser)
      ) : (
        //   (
        //     <YachtDetails
        //       users={selectedUser}
        //       onBack={() => setselectedUser(null)}
        //     />
        //   )
        <>
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
            <h3>🛥️ Users </h3>
            <div className={styles.controls}>
              <div className={styles.searchBox}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search userss..."
                  value={searchTerm}
                  onChange={(e) => {
                    setCurrentPage(1);
                    // Update URL with search term
                    const params = new URLSearchParams(window.location.search);
                    if (e.target.value) {
                      params.set('search', e.target.value);
                    } else {
                      params.delete('search');
                    }
                    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
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
                        {[...new Set(users.map((o) => o.location))].map(
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
                          checked={filterStatus.includes("Active")}
                          onChange={() => handleStatusChange("Active")}
                        />{" "}
                        Active
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
                          checked={filterStatus.includes("Suspended")}
                          onChange={() => handleStatusChange("Suspended")}
                        />{" "}
                        Suspended
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
                        <option value="revenue">Revenue</option>
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

          {/* 📌 Entries Selection */}

          {/* 📌 Table */}
          <table className={styles.table}>
            <thead>
              <tr className={styles.emailCell}>
                <th>User</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Role</th> {/* ✅ Changed from Location to Role */}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((users) => (
                <tr key={users.id}>
                  <td>
                    <img
                      src={users.profileImg}
                      alt={users.name}
                      className={styles.avatar}
                    />
                  </td>
                  <td className={styles.nameCell}>
                    {editingRow === users.id ? (
                      <input
                        className="inputt"
                        type="text"
                        value={editedData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                      />
                    ) : (
                      users.name
                    )}
                  </td>
                  <td className={styles.emailCell}>
                    {editingRow === users.id ? (
                      <input
                        className="inputt"
                        type="email"
                        value={editedData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />
                    ) : (
                      users.email
                    )}
                  </td>
                  <td className={styles.contactCell}>
                    {editingRow === users.id ? (
                      <input
                        className="inputt"
                        type="text"
                        value={editedData.contact}
                        onChange={(e) =>
                          handleChange("contact", e.target.value)
                        }
                      />
                    ) : (
                      users.contact
                    )}
                  </td>
                  <td className={styles.roleCell}>
                    {" "}
                    {/* ✅ Changed from Location to Role */}
                    {editingRow === users.id ? (
                      <input
                        className="inputt"
                        type="text"
                        value={editedData.role}
                        onChange={(e) => handleChange("role", e.target.value)}
                      />
                    ) : (
                      users.role
                    )}
                  </td>
                  <td>
                    {editingRow === users.id ? (
                      <select
                        value={editedData.status}
                        onChange={(e) => handleChange("status", e.target.value)}
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    ) : (
                      <span
                        className={`${styles.statusCell} ${
                          styles[users.status.toLowerCase()]
                        }`}
                      >
                        {users.status === "Active" && (
                          <FaCheckCircle className={styles.statusIcon} />
                        )}
                        {users.status === "Pending" && (
                          <FaClock className={styles.statusIcon} />
                        )}
                        {users.status === "Suspended" && (
                          <FaBan className={styles.statusIcon} />
                        )}
                        {users.status}
                      </span>
                    )}
                  </td>
                  <td className={styles.actions}>
                    {editingRow === users.id ? (
                      <button
                        className={styles.saveButton}
                        onClick={handleSave}
                      >
                        <FaCheck />
                      </button>
                    ) : (
                      <button
                        className={styles.editButton}
                        onClick={() => handleEdit(users.id)}
                      >
                        <FaEdit />
                      </button>
                    )}
                    <button className={styles.deleteButton}>
                      <FaTrash />
                    </button>
                    <button
                      className={styles.viewProfileButton}
                      onClick={() => setselectedUser(users)}
                    >
                      <FaUser />
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
              {Math.min(currentPage * entriesPerPage, totalUsers)} of{" "}
              {totalUsers} entries
            </span>

            <div className={styles.entriesSelector}>
              <span>Show:</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page on limit change
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
        </>
      )}
    </div>
  );
};

export default UsersTable;
