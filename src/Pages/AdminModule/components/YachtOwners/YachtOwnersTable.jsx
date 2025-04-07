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
import styles from "./YachtOwnersTable.module.scss";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import YachtDetails from "./YachtDetails";
import { fetchYachtOwners } from "../../../../Redux/yachtReducer/action";
import { useDispatch } from "react-redux";
import { updateYachtOwner } from "../../../../Redux/yachtOwnerReducer/action";
import { toast } from "react-toastify";

const initialOwners = [
  {
    id: "#Y101",
    name: "James Smith",
    email: "james@example.com",
    contact: "+1 (555) 1234",
    location: "Miami, FL",
    yachts: 5,
    revenue: "$450K",
    status: "Active",
    profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "#Y102",
    name: "Sophia Johnson",
    email: "sophia@example.com",
    contact: "+44 (770) 0900123",
    location: "London, UK",
    yachts: 3,
    revenue: "$300K",
    status: "Pending",
    profileImg: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "#Y103",
    name: "Michael Lee",
    email: "michael@example.com",
    contact: "+33 (612) 345678",
    location: "Nice, France",
    yachts: 2,
    revenue: "$200K",
    status: "Suspended",
    profileImg: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: "#Y104",
    name: "Emma Brown",
    email: "emma@example.com",
    contact: "+49 (171) 2345678",
    location: "Hamburg, Germany",
    yachts: 4,
    revenue: "$380K",
    status: "Active",
    profileImg: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: "#Y105",
    name: "Daniel Garcia",
    email: "daniel@example.com",
    contact: "+34 (600) 123456",
    location: "Barcelona, Spain",
    yachts: 6,
    revenue: "$500K",
    status: "Active",
    profileImg: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    id: "#Y106",
    name: "Olivia Martinez",
    email: "olivia@example.com",
    contact: "+34 (600) 654321",
    location: "Madrid, Spain",
    yachts: 2,
    revenue: "$220K",
    status: "Pending",
    profileImg: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    id: "#Y107",
    name: "Liam Wilson",
    email: "liam@example.com",
    contact: "+1 (555) 5678",
    location: "New York, NY",
    yachts: 3,
    revenue: "$330K",
    status: "Active",
    profileImg: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    id: "#Y108",
    name: "Ava Thompson",
    email: "ava@example.com",
    contact: "+44 (770) 0987654",
    location: "Edinburgh, UK",
    yachts: 1,
    revenue: "$150K",
    status: "Suspended",
    profileImg: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    id: "#Y109",
    name: "Noah Davis",
    email: "noah@example.com",
    contact: "+33 (612) 876543",
    location: "Paris, France",
    yachts: 4,
    revenue: "$400K",
    status: "Active",
    profileImg: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    id: "#Y110",
    name: "Isabella Rodriguez",
    email: "isabella@example.com",
    contact: "+49 (171) 8765432",
    location: "Berlin, Germany",
    yachts: 5,
    revenue: "$470K",
    status: "Pending",
    profileImg: "https://randomuser.me/api/portraits/women/10.jpg",
  },
];

const YachtOwnersTable = () => {
  const [owners, setOwners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterStatus, setFilterStatus] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [filterLocation, setFilterLocation] = useState("");
  const [revenueRange, setRevenueRange] = useState([0, 5000000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOwners, setTotalOwners] = useState(0);
  const dispatch = useDispatch();
  // const [filters, setFilters] = useState({
  //   search: "",
  //   status: "",
  //   location: "",
  //   sort: "createdAt",
  //   order: "desc",
  //   page: currentPage,
  //   limit: entriesPerPage,
  // });

  // useEffect(() => {
  //   const storedOwners = localStorage.getItem("ownersData");

  //   if (storedOwners) {
  //     // Merge Initial Data + Stored Data
  //     const mergedOwners = [...initialOwners, ...JSON.parse(storedOwners)];
  //     setOwners(mergedOwners);
  //   } else {
  //     // First time, save initial JSON data to `localStorage`
  //     localStorage.setItem("ownersData", JSON.stringify([])); // Empty initially
  //     setOwners(initialOwners);
  //   }
  // }, []);

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

  // Sorting logic
  // **Filter Owners**
  // const filteredOwners = [...owners]
  //   .filter((owner) => {
  //     const matchesSearch =
  //       owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       owner.email.toLowerCase().includes(searchTerm.toLowerCase());

  //     const matchesStatus =
  //       filterStatus.length === 0 || filterStatus.includes(owner.status);

  //     const matchesLocation =
  //       !filterLocation || owner.location === filterLocation;

  //     const matchesRevenue =
  //       parseInt(owner.revenue.replace(/[$K]/g, "") * 1000) >=
  //         revenueRange[0] &&
  //       parseInt(owner.revenue.replace(/[$K]/g, "") * 1000) <= revenueRange[1];

  //     return (
  //       matchesSearch && matchesStatus && matchesLocation && matchesRevenue
  //     );
  //   })
  //   .sort((a, b) => {
  //     if (sortBy === "name") return a.name.localeCompare(b.name);
  //     if (sortBy === "yachts") return b.yachts - a.yachts;
  //     if (sortBy === "revenue")
  //       return (
  //         parseInt(b.revenue.replace(/[$K]/g, "") * 1000) -
  //         parseInt(a.revenue.replace(/[$K]/g, "") * 1000)
  //       );
  //     return 0;
  //   });

  // // Pagination logic
  // // const totalPages = Math.ceil(filteredOwners.length / entriesPerPage);
  // const startIndex = (currentPage - 1) * entriesPerPage;
  // const endIndex = Math.min(startIndex + entriesPerPage, filteredOwners.length);
  // const paginatedOwners = filteredOwners.slice(startIndex, endIndex);
  // Handle Edit Click
  const handleEdit = (id) => {
    console.log("ed click")
    const ownerToEdit = owners.find((owner) => owner.id === id);
    setEditingRow(id);
    setEditedData({ ...ownerToEdit }); // Copy the selected row's data
  };

  // Handle Input Changes
  const handleChange = (field, value) => {
    console.log("ed click newupdate")

    setEditedData((prevData) => ({
      ...prevData,
      [field]: field === "yachts" ? parseInt(value, 10) || 0 : value, // Ensure yachts remains numeric
    }));
  };

  // Handle Save Click
  // const handleSave = () => {

  //   dispatch(updateYachtOwner(editedData.id,editedData))
 
  //   setEditingRow(null);
  // };

  const handleSave = async () => {
    const previousOwners = [...owners];
  
    setOwners((prevOwners) =>
      prevOwners.map((owner) =>
        owner.id === editedData.id ? { ...owner, ...editedData } : owner
      )
    );
  
    try {
      await dispatch(updateYachtOwner(editedData.id, editedData));
  
      // 4. Optionally re-fetch single owner to sync (if backend modifies other data)
      // const updatedOwner = await dispatch(fetchYachtOwnerById(editedData.id));
      // setOwners((prevOwners) =>
      //   prevOwners.map((owner) =>
      //     owner.id === editedData.id ? { ...owner, ...updatedOwner } : owner
      //   )
      // );
  
    } catch (error) {
      console.error("Failed to update yacht owner:", error);
  
      // ❌ Rollback to previous state on error
      setOwners(previousOwners);
  
      // 🔔 Show error to user
      toast.error("Failed to update. Please try again.");
    } finally {
      setEditingRow(null); // Close edit mode
    }
  };
  

  // **Export as CSV**
  const exportCSV = () => {
    const csvContent = [
      "ID, Name, Email, Contact, Location, Yachts, Revenue, Status",
      ...owners.map(
        (o) =>
          `${o.id},${o.name},${o.email},${o.contact},${o.location},${o.yachts},${o.revenue},${o.status}`
      ),
    ].join("\n");
    saveAs(
      new Blob([csvContent], { type: "text/csv;charset=utf-8;" }),
      "YachtOwners.csv"
    );
  };

  // **Export as PDF**
  const exportPDF = () => {

    const doc = new jsPDF();
    doc.text("Yacht Owners Report", 20, 10);
    doc.autoTable({
      head: [
        [
          "ID",
          "Name",
          "Email",
          "Contact",
          "Location",
          "Yachts",
          "Revenue",
          "Status",
        ],
      ],
      body: owners.map((o) => [
        o.id,
        o.name,
        o.email,
        o.contact,
        o.location,
        o.yachts,
        o.revenue,
        o.status,
      ]),
    });
    doc.save("YachtOwners.pdf");
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
    const getYachtOwners = async () => {
      try {
        // setLoading(true);
       const filters ={
        
          search: debouncedSearchTerm,
          status: filterStatus,
          revenueRange:revenueRange,
          location:filterLocation,
          sort: sortBy,
          order: "desc",
          page: currentPage,
          limit: entriesPerPage,
        }
        const data = await dispatch(fetchYachtOwners(filters));
        setOwners(data.data); // ✅ Set owners list from API response
        setTotalPages(data.totalPages); // ✅ Backend should return `totalPages`
        setTotalOwners(data.total);
        console.log(data.data);
      } catch (error) {
        console.error("Failed to load yacht owners");
      } finally {
        // setLoading(false);
      }
    };

    getYachtOwners();
  }, [currentPage, revenueRange,entriesPerPage,debouncedSearchTerm,filterStatus,filterLocation]);

  console.log(owners);
  return (
    <div className={styles.yachtOwnersContainer}>
      {/* Export Buttons */}

      {/* 📌 If an owner is selected, show Yacht Details Page */}
      {selectedOwner ? (
        (console.log(selectedOwner),
        (
          <YachtDetails
            owner={selectedOwner}
            onBack={() => setSelectedOwner(null)}
          />
        ))
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
          {/* 📌 Header & Controls */}
          <div className={styles.header}>
            <h3>🛥️ Yacht Owners</h3>
            <div className={styles.controls}>
              <div className={styles.searchBox}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search owners..."
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
                    {/* Location Filter */}
                    <div className={styles.filterGroup}>
                      <select
                        value={filterLocation}
                        onChange={(e) => setFilterLocation(e.target.value)}
                      >
                        <option value="">All Locations</option>
                        {[...new Set(owners.map((o) => o.location))].map(
                          (loc) => (
                            <option key={loc} value={loc}>
                              {loc}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* Revenue Range Filter */}
                    <div className={styles.filterGroup}>
                      <input
                        type="range"
                        min="0"
                        max="500000"
                        step="1000"
                        value={revenueRange[0]}
                        onChange={(e) =>
                          setRevenueRange([
                            parseInt(e.target.value),
                            revenueRange[1],
                          ])
                        }
                      />
                      <label>
                        Revenue: ${revenueRange[0] / 1000}K - $
                        {revenueRange[1] / 1000}K
                      </label>
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
                <th>Location</th>
                <th>Yachts</th>
                <th>Revenue</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {owners.map((owner) => (
                <tr key={owner.id}>
                  <td>
                    <img
                      src={owner.profileImg}
                      alt={owner.name}
                      className={styles.avatar}
                    />
                  </td>
                  <td className={styles.nameCell}>
                    {editingRow === owner.id ? (
                      <input
                        className="inputt"
                        type="text"
                        value={editedData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                      />
                    ) : (
                      owner.name
                    )}
                  </td>
                  <td className={styles.emailCell}>
                    {editingRow === owner.id ? (
                      <input
                        className="inputt"
                        type="email"
                        value={editedData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />
                    ) : (
                      owner.email
                    )}
                  </td>
                  <td className={styles.contactCell}>
                    {editingRow === owner.id ? (
                      <input
                        className="inputt"
                        type="text"
                        value={editedData.contact}
                        onChange={(e) =>
                          handleChange("contact", e.target.value)
                        }
                      />
                    ) : (
                      owner.contact
                    )}
                  </td>
                  <td className={styles.locationCell}>
                    {editingRow === owner.id ? (
                      <input
                        className="inputt"
                        type="text"
                        value={editedData.location}
                        onChange={(e) =>
                          handleChange("location", e.target.value)
                        }
                      />
                    ) : (
                      owner.location
                    )}
                  </td>
                  <td className={styles.yachtsCell}>
                    {editingRow === owner.id ? (
                      <input
                        className="inputt"
                        type="number"
                        value={editedData.yachts}
                        onChange={(e) => handleChange("yachts", e.target.value)}
                      />
                    ) : (
                      owner.yachts.length
                    )}
                  </td>
                  <td className={styles.revenueCell}>
                    {editingRow === owner.id ? (
                      <input
                        className="inputt"
                        type="text"
                        value={editedData.revenue}
                        onChange={(e) =>
                          handleChange("revenue", e.target.value)
                        }
                      />
                    ) : (
                      owner.revenue
                    )}
                  </td>
                  <td>
                    {editingRow === owner.id ? (
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
                          styles[owner.status.toLowerCase()]
                        }`}
                      >
                        {owner.status === "Active" && (
                          <FaCheckCircle className={styles.statusIcon} />
                        )}
                        {owner.status === "Pending" && (
                          <FaClock className={styles.statusIcon} />
                        )}
                        {owner.status === "Suspended" && (
                          <FaBan className={styles.statusIcon} />
                        )}
                        {owner.status}
                      </span>
                    )}
                  </td>
                  <td className={styles.actions}>
                    {editingRow === owner.id ? (
                      <button
                        className={styles.saveButton}
                        onClick={handleSave}
                      >
                        <FaCheck />
                      </button>
                    ) : (
                      <button
                        className={styles.editButton}
                        onClick={() => handleEdit(owner.id)}
                      >
                        <FaEdit />
                      </button>
                    )}
                    <button className={styles.deleteButton} >
                      <FaTrash />
                    </button>
                    <button
                      className={styles.viewProfileButton}
                      onClick={() => setSelectedOwner(owner)}
                    >
                      <FaUser />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 📌 Pagination */}
          {/* <div className={styles.pagination}>
            <span>
              Showing {(currentPage - 1) * entriesPerPage + 1} to{" "}
              {Math.min(currentPage * entriesPerPage, filteredOwners.length)} of{" "}
              {filteredOwners.length} entries
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
          </div> */}

          <div className={styles.pagination}>
            <span>
              Showing {(currentPage - 1) * entriesPerPage + 1} to{" "}
              {Math.min(currentPage * entriesPerPage, totalOwners)} of{" "}
              {totalOwners} entries
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

export default YachtOwnersTable;

// import { useState, useEffect, useRef } from "react";
// import { FaSearch, FaPlus, FaEdit, FaCheck, FaTrash, FaFilter, FaDownload, FaUser } from "react-icons/fa";
// import styles from "./YachtOwnersTable.module.scss";
// import { saveAs } from "file-saver";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import YachtDetails from "./YachtDetails";
// import { fetchYachtOwners } from "../../../../Redux/yachtReducer/action";
// import { useDispatch, useSelector } from "react-redux";

// const YachtOwnersTable = () => {
//   const dispatch = useDispatch();
//   // const { yachtOwners, loading } = useSelector((state) => state.yachtReducer);
// const [yachtOwners,setYachtOwners]=useState([])
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("name");
//   const [filterStatus, setFilterStatus] = useState([]);
//   const [entriesPerPage, setEntriesPerPage] = useState(10);
//   const [filterLocation, setFilterLocation] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedOwner, setSelectedOwner] = useState(null);
//   const [editingRow, setEditingRow] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
//   const filterRef = useRef(null);

//   const filters = {
//     search: searchTerm,
//     status: filterStatus.length ? filterStatus.join(",") : "",
//     location: filterLocation,
//     sort: sortBy,
//     order: "desc",
//     page: currentPage,
//     limit: entriesPerPage,
//   };

//   useEffect(() => {
//     // dispatch(fetchYachtOwners(filters));

//    const getYachtOwners = async () => {
//             try {
//               // setLoading(true);
//               const data = await dispatch(fetchYachtOwners(filters));
//               setYachtOwners(data.data); // ✅ Set owners list from API response
//               // console.log(data.data)
//             } catch (error) {
//               console.error("Failed to load yacht owners");
//             } finally {
//               // setLoading(false);
//             }
//           };
//           getYachtOwners()
//   }, []);

//   // Close filter dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (filterRef.current && !filterRef.current.contains(event.target)) {
//         setFilterDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Handle status filter
//   const handleStatusChange = (status) => {
//     setFilterStatus((prev) =>
//       prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
//     );
//   };

//   // Handle edit
//   const handleEdit = (id) => {
//     const ownerToEdit = yachtOwners.find((owner) => owner.id === id);
//     setEditingRow(id);
//     setEditedData({ ...ownerToEdit });
//   };

//   // Handle input changes
//   const handleChange = (field, value) => {
//     setEditedData((prevData) => ({
//       ...prevData,
//       [field]: value,
//     }));
//   };

//   // Save edited data
//   const handleSave = () => {
//     // Here, API call should be made to update the owner details
//     setEditingRow(null);
//   };

//   // Export CSV
//   const exportCSV = () => {
//     const csvContent = [
//       "ID, Name, Email, Contact, Location, Yachts, Revenue, Status",
//       ...yachtOwners.map(
//         (o) =>
//           `${o.id},${o.name},${o.email},${o.contact},${o.location},${o.yachts},${o.revenue},${o.status}`
//       ),
//     ].join("\n");
//     saveAs(new Blob([csvContent], { type: "text/csv;charset=utf-8;" }), "YachtOwners.csv");
//   };

//   // Export PDF
//   const exportPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Yacht Owners Report", 20, 10);
//     doc.autoTable({
//       head: [["ID", "Name", "Email", "Contact", "Location", "Yachts", "Revenue", "Status"]],
//       body: yachtOwners.map((o) => [
//         o.id, o.name, o.email, o.contact, o.location, o.yachts, o.revenue, o.status,
//       ]),
//     });
//     doc.save("YachtOwners.pdf");
//   };

//   return (
//     <div className={styles.yachtOwnersContainer}>
//       {/* Export Buttons */}
//       <div className={styles.exportButtons}>
//         <button onClick={exportCSV}><FaDownload /> CSV</button>
//         <button onClick={exportPDF}><FaDownload /> PDF</button>
//       </div>

//       {/* If an owner is selected, show Yacht Details */}
//       {selectedOwner ? (
//         <YachtDetails owner={selectedOwner} onBack={() => setSelectedOwner(null)} />
//       ) : (
//         <>
//           {/* Header & Controls */}
//           <div className={styles.header}>
//             <h3>🛥️ Yacht Owners</h3>
//             <div className={styles.controls}>
//               <div className={styles.searchBox}>
//                 <FaSearch className={styles.searchIcon} />
//                 <input
//                   type="text"
//                   placeholder="Search owners..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>

//               {/* Filter Button */}
//               <div className={styles.filterContainer} ref={filterRef}>
//                 <button className={styles.filterButton} onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}>
//                   <FaFilter /> Filter
//                 </button>
//                 {filterDropdownOpen && (
//                   <div className={styles.filterDropdown}>
//                     {/* Location Filter */}
//                     <div className={styles.filterGroup}>
//                       <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}>
//                         <option value="">All Locations</option>
//                         {[...new Set(yachtOwners.map((o) => o.location))].map((loc) => (
//                           <option key={loc} value={loc}>{loc}</option>
//                         ))}
//                       </select>
//                     </div>

//                     {/* Status Multi-Select Filter */}
//                     <div className={styles.filterGroup}>
//                       {["Active", "Pending", "Suspended"].map((status) => (
//                         <label key={status}>
//                           <input
//                             type="checkbox"
//                             checked={filterStatus.includes(status)}
//                             onChange={() => handleStatusChange(status)}
//                           />{" "}
//                           {status}
//                         </label>
//                       ))}
//                     </div>

//                     {/* Sorting */}
//                     <div className={styles.filterGroup}>
//                       <label>Sort by:</label>
//                       <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
//                         <option value="name">Name</option>
//                         <option value="yachts">Yachts</option>
//                         <option value="revenue">Revenue</option>
//                       </select>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <button className={styles.addButton}><FaPlus /> Add New</button>
//             </div>
//           </div>

//           {/* Table */}
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>User</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Contact</th>
//                 <th>Location</th>
//                 <th>Yachts</th>
//                 <th>Revenue</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {yachtOwners.map((owner) => (
//                 <tr key={owner.id}>
//                   <td><img src={owner.profileImg} alt={owner.name} className={styles.avatar} /></td>
//                   <td>{owner.name}</td>
//                   <td>{owner.email}</td>
//                   <td>{owner.contact}</td>
//                   <td>{owner.location}</td>
//                   <td>{owner.yachts}</td>
//                   <td>{owner.revenue}</td>
//                   <td>{owner.status}</td>
//                   <td>
//                     <button className={styles.editButton} onClick={() => handleEdit(owner.id)}><FaEdit /></button>
//                     <button className={styles.deleteButton}><FaTrash /></button>
//                     <button className={styles.viewProfileButton} onClick={() => setSelectedOwner(owner)}><FaUser /></button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
//       )}
//     </div>
//   );
// };

// export default YachtOwnersTable;
