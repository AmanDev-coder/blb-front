import { useState, useRef, useEffect } from "react";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaCheck,
  FaTrash,
  FaFilter,
  FaDownload,
  FaShip,
  FaUser,
  FaMapMarkerAlt,
  FaRuler,
  FaUsers,
  FaDollarSign,
  FaTimes,
  FaStar,
  FaCheckCircle,
  FaClock,
  FaBan,
  FaComment,
  FaExternalLinkAlt,
  FaAnchor,
  FaShieldAlt
} from "react-icons/fa";
import styles from "./Yachts.module.scss";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useDispatch } from "react-redux";
import { EditYachtListing, fetchYachts } from "../../../../Redux/yachtReducer/action";
// Remove or comment out the SAMPLE_IMAGES constant if it exists
// const SAMPLE_IMAGES = [
//   "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&auto=format&fit=crop&q=60",
//   "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&auto=format&fit=crop&q=60",
//   "https://images.unsplash.com/photo-1586694681327-cc2144178530?w=800&auto=format&fit=crop&q=60",
//   "https://images.unsplash.com/photo-1569263916179-0d3f12fe76f5?w=800&auto=format&fit=crop&q=60",
//   "https://images.unsplash.com/photo-1569263975263-5cd56365b44d?w=800&auto=format&fit=crop&q=60"
// ];

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&auto=format&fit=crop&q=60";

// Update the initialYachts data to include random images
const initialYachts = [
  {
    id: "#Y101",
    name: "Luxury Cruiser",
    owner: "John Smith",
    length: "120 feet",
    capacity: "12 passengers",
    location: "Miami, FL",
    pricePerDay: "$1200",
    status: "Available",
    description: "A magnificent luxury yacht perfect for coastal cruising and entertaining large groups. Features spacious decks, multiple entertainment areas, and state-of-the-art navigation systems.",
    amenities: ["Swimming Pool", "Jacuzzi", "Gym", "Cinema Room", "WiFi", "Air Conditioning"],
    images: ["yacht1.jpg", "yacht1-interior.jpg", "yacht1-deck.jpg"],
    rating: 4.8,
    reviews: 15,
    bookings: 25
  },
  {
    id: "#Y102",
    name: "Ocean Breeze",
    owner: "Emma White",
    length: "90 feet",
    capacity: "8 passengers",
    location: "Monaco",
    pricePerDay: "$900",
    status: "Available",
    description: "Elegant and comfortable yacht ideal for Mediterranean cruising. Features modern interiors, spacious sun deck, and excellent entertainment facilities.",
    amenities: ["Sun Deck", "BBQ Area", "Water Toys", "WiFi", "Air Conditioning"],
    images: ["yacht2.jpg", "yacht2-interior.jpg", "yacht2-deck.jpg"],
    rating: 4.6,
    reviews: 12,
    bookings: 18
  },
  {
    id: "#Y103",
    name: "Sunset Cruiser",
    owner: "David Wilson",
    length: "100 feet",
    capacity: "10 passengers",
    location: "Cannes",
    pricePerDay: "$1500",
    status: "Booked",
    description: "Modern luxury yacht with sleek design and superior performance. Perfect for both day trips and extended cruises along the French Riviera.",
    amenities: ["Beach Club", "Wine Cellar", "Stabilizers", "WiFi", "Air Conditioning"],
    images: ["yacht3.jpg", "yacht3-interior.jpg", "yacht3-deck.jpg"],
    rating: 4.9,
    reviews: 20,
    bookings: 30
  },
  {
    id: "#Y104",
    name: "Sea Explorer",
    owner: "Sophia Martinez",
    length: "130 feet",
    capacity: "14 passengers",
    location: "Dubai",
    pricePerDay: "$2000",
    status: "Maintenance",
    description: "Ultra-luxury mega yacht with exceptional amenities and modern technology. Perfect for luxury cruising in the Arabian Gulf.",
    amenities: ["Helipad", "Spa", "Beach Club", "Cinema", "WiFi", "Air Conditioning"],
    images: ["yacht4.jpg", "yacht4-interior.jpg", "yacht4-deck.jpg"],
    rating: 4.7,
    reviews: 18,
    bookings: 22
  },
  {
    id: "#Y105",
    name: "Wave Rider",
    owner: "Isabella Young",
    length: "75 feet",
    capacity: "6 passengers",
    location: "Barcelona",
    pricePerDay: "$800",
    status: "Available",
    description: "Sporty and stylish yacht perfect for Mediterranean adventures. Features modern amenities and excellent performance capabilities.",
    amenities: ["Water Sports Equipment", "Sun Deck", "BBQ", "WiFi", "Air Conditioning"],
    images: ["yacht5.jpg", "yacht5-interior.jpg", "yacht5-deck.jpg"],
    rating: 4.5,
    reviews: 10,
    bookings: 15
  }
];

const YachtsComponent = () => {
  const [yachts, setYachts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterStatus, setFilterStatus] = useState([]);
  const [filterOwner, setFilterOwner] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedYacht, setSelectedYacht] = useState(null);
  const [showYachtModal, setShowYachtModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedYacht, setEditedYacht] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [showAcceptRejectModal, setShowAcceptRejectModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const dispatch = useDispatch();
  const filterRef = useRef(null);

  // Close filter dropdown when clicking outside


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
    const getYachts = async () => {
      try {
        // setLoading(true);
        const filters = {
          search: debouncedSearchTerm,
          bookingStatus: filterStatus,
              sort: sortBy,
          order: "desc",
          page: currentPage,
          limit: entriesPerPage,
        };
          const data = await dispatch(fetchYachts(filters));
         console.log(data)
          setYachts(data.boats); // ✅ Set userss list from API response
           setTotalPages(data.totalPages); // ✅ Backend should return `totalPages`
           setTotalCount(data.totalCount);
        // // setTotalUsers(data.data.total);
        // // Remove search query parameter from URL if it exists
       
        // console.log(data.data);
      } catch (error) {
        console.error("Failed to load yacht userss");
      } finally {
        // setLoading(false);
      }
    };

    getYachts();
  }, [
    currentPage,
    entriesPerPage,
    debouncedSearchTerm,
    filterStatus,
    // filterLocation,
  ]);
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

  // Handle yacht selection
  const handleYachtClick = (yacht) => {
    console.log(yacht)
   fetchAmenities(yacht.features.amenities,yacht)
    // setSelectedYacht(yacht);
    setShowYachtModal(true);
    setEditMode(false);
  };
const fetchAmenities = async (amenities,yacht) => {
  console.log(amenities)
    if (!amenities || amenities.length === 0) setSelectedYacht({...yacht,amenities:null})

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/features/amenities/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: amenities }),
      });
      const data = await response.json();

    console.log(data)

      // Get yacht details along with amenities
      const amenityTitles = data.map(amenity => amenity.title);
      const yachtWithAmenities = {
        ...yacht,
        amenities: data.map(amenity => (amenity.title))
      };
      
      setSelectedYacht(yachtWithAmenities);


    } catch (error) {
      console.error("Failed to fetch amenities:", error);
    }
  };
console.log(selectedYacht)
  // Handle edit mode
  const handleEditClick = () => {
    setEditMode(true);
    setEditedYacht({ ...selectedYacht });
  };

  // Handle save changes
    const handleSaveChanges = async () => {
      console.log(editedYacht)
    // Call API to update yacht
    try {
      const response = await dispatch(EditYachtListing(editedYacht._id,{
        _id: editedYacht._id,
        title: editedYacht.title,
        ownerName: editedYacht.ownerName,
        features: editedYacht.features,
        capacity: editedYacht.capacity,
        // location: editedYacht.location,
        price: editedYacht.price,
        status: editedYacht.status,
        description: editedYacht.description
      }));

      if (!response.success) {
        throw new Error('Failed to update yacht');
      }
      setSelectedYacht(editedYacht);
      setYachts(yachts.map(yacht => 
        yacht.id === editedYacht.id ? editedYacht : yacht
      ));
      setEditMode(false);
    } catch (error) {
      console.error("Error updating yacht:", error);
      // Could add error handling UI feedback here
      return;
    }
    // setYachts(yachts.map(yacht => 
    //   yacht.id === editedYacht.id ? editedYacht : yacht
    // ));
   
  };

  // Handle delete yacht
  const handleDeleteYacht = () => {
    setYachts(yachts.filter(yacht => yacht.id !== selectedYacht.id));
    setShowYachtModal(false);
    setDeleteConfirmation(false);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowYachtModal(false);
    setSelectedYacht(null);
    setEditMode(false);
    setDeleteConfirmation(false);
  };

  // Handle feedback modal
  const handleFeedbackClick = (yacht) => {
    setSelectedYacht(yacht);
    setShowFeedbackModal(true);
    setFeedbackText("");
    setFeedbackRating(5);
  };

  // Handle feedback submission
  const handleSubmitFeedback = () => {
    // In a real application, this would submit to a backend API
    console.log("Feedback submitted:", {
      yachtId: selectedYacht.id,
      rating: feedbackRating,
      feedback: feedbackText
    });
    // Close the modal after submission
    setShowFeedbackModal(false);
  };

  // Handle multi-select status filter
  const handleStatusChange = (status) => {
    setFilterStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Handle accept yacht
  const handleAcceptYacht = (yacht) => {
    setSelectedYacht(yacht);
    setActionType("accept");
    setActionMessage(`Are you sure you want to accept ${yacht.name}?`);
    setShowAcceptRejectModal(true);
  };

  // Handle reject yacht
  const handleRejectYacht = (yacht) => {
    setSelectedYacht(yacht);
    setActionType("reject");
    setActionMessage(`Are you sure you want to reject ${yacht.name}?`);
    setShowAcceptRejectModal(true);
  };

  // Handle confirm action
  const handleConfirmAction = () => {
    const updatedYachts = yachts.map(yacht => {
      if (yacht.id === selectedYacht.id) {
        return {
          ...yacht,
          status: actionType === "accept" ? "Available" : "Maintenance"
        };
      }
      return yacht;
    });
    
    setYachts(updatedYachts);
    setShowAcceptRejectModal(false);
  };

  // Filtering and sorting logic
  // const filteredYachts = [...yachts]
  //   .filter((yacht) => {
  //     const matchesSearch =
  //       yacht.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       yacht.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       yacht.location.toLowerCase().includes(searchTerm.toLowerCase());

  //     const matchesStatus =
  //       filterStatus.length === 0 || filterStatus.includes(yacht.status);

  //     const matchesOwner = !filterOwner || yacht.owner === filterOwner;

  //     return matchesSearch && matchesStatus && matchesOwner;
  //   })
  //   .sort((a, b) => {
  //     if (sortBy === "name") return a.name.localeCompare(b.name);
  //     if (sortBy === "price") return parseFloat(a.pricePerDay.slice(1)) - parseFloat(b.pricePerDay.slice(1));
  //     if (sortBy === "rating") return b.rating - a.rating;
  //     if (sortBy === "owner") return a.owner.localeCompare(b.owner);
  //     return 0;
  //   });

  // Pagination logic
  // const totalPages = Math.ceil(filteredYachts.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalCount);
  // const paginatedYachts = filteredYachts.slice(startIndex, endIndex);

  // Export as CSV
  const exportCSV = () => {
    const csvContent = [
      "ID,Name,Owner,Capacity,Length,Location,Status,Price Per Day,Rating,Reviews,Bookings,Amenities,Description",
      ...filteredYachts.map(
        (y) =>
          `${y.id},${y.name},${y.owner},${y.capacity},${y.length},${y.location},${y.status},${y.pricePerDay},${y.rating},${y.reviews},${y.bookings},"${y.amenities.join(', ')}","${y.description}"`
      ),
    ].join("\n");
    saveAs(
      new Blob([csvContent], { type: "text/csv;charset=utf-8;" }),
      "Yachts.csv"
    );
  };

  // Export as PDF
  const exportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text("Yachts Report", 14, 15);
      
      const columns = [
        { header: 'ID', dataKey: 'id' },
        { header: 'Name', dataKey: 'name' },
        { header: 'Owner', dataKey: 'owner' },
        { header: 'Location', dataKey: 'location' },
        { header: 'Capacity', dataKey: 'capacity' },
        { header: 'Length', dataKey: 'length' },
        { header: 'Status', dataKey: 'status' },
        { header: 'Price/Day', dataKey: 'pricePerDay' },
        { header: 'Rating', dataKey: 'rating' }
      ];
      
      doc.autoTable({
        columns: columns,
        body: filteredYachts,
        startY: 20,
        margin: { top: 20 },
        styles: { overflow: 'linebreak' },
        bodyStyles: { valign: 'top' },
        columnStyles: { name: { cellWidth: 'auto' } }
      });
      
      doc.save("Yachts.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // Get status style and icon
  const getStatusClassName = (status) => {
    const statusMap = {
      "Available": "available",
      "Booked": "booked",
      "Maintenance": "maintenance"
    };
    return statusMap[status] || "";
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Available":
        return <FaCheckCircle className={styles.statusIcon} />;
      case "Booked":
        return <FaClock className={styles.statusIcon} />;
      case "Maintenance":
        return <FaBan className={styles.statusIcon} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.yachtsContainer}>
      {/* Export Buttons */}
      <div className={styles.exportButtons}>
        <button onClick={exportCSV}>
          <FaDownload /> Export CSV
        </button>
        <button onClick={exportPDF}>
          <FaDownload /> Export PDF
        </button>
      </div>

      {/* Header & Controls */}
      <div className={styles.header}>
        <h3><FaShip /> Luxury Yachts</h3>
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search yachts, owners, or locations..."
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
            <button className={styles.filterButton} onClick={toggleFilterDropdown}>
              <FaFilter /> Filter
            </button>
            {filterDropdownOpen && (
              <div className={styles.filterDropdown}>
                {/* Owner Filter */}
                <div className={styles.filterGroup}>
                  <label>Filter by Owner:</label>
                  <select
                    value={filterOwner}
                    onChange={(e) => setFilterOwner(e.target.value)}
                  >
                    <option value="">All Owners</option>
                    {[...new Set(yachts.map((yacht) => yacht.owner))].map((owner) => (
                      <option key={owner} value={owner}>
                        {owner}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className={styles.filterGroup}>
                  <label>Status:</label>
                  <div className={styles.statusOptions}>
                  {["Available", "Booked", "Maintenance"].map((status) => (
                    <label key={status} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={filterStatus.includes(status)}
                        onChange={() => handleStatusChange(status)}
                      />
                        <div className={styles.statusLabelWrapper}>
                      <span className={`${styles.statusDot} ${styles[status.toLowerCase()]}`} />
                      {status}
                        </div>
                    </label>
                  ))}
                  </div>
                </div>

                {/* Sort Options */}
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
                    <option value="price">Price</option>
                    <option value="rating">Rating</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <button className={styles.addButton}>
            <FaPlus /> Add New Yacht
          </button>
        </div>
      </div>

      {/* Yachts Table */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Owner</th>
            <th>Location</th>
            <th>Capacity</th>
            <th>Price/Day</th>
            <th> Booking Status</th>
            <th>Rating</th>
            <th>Actions</th>

            
          </tr>
        </thead>
        <tbody>
          {yachts.map((yacht) => (
            <tr key={yacht.id}>
              <td>{yacht.id}</td>
              <td 
                className={styles.nameCell}
                onClick={() => handleYachtClick(yacht)}
                style={{
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >{yacht.title}</td>
              <td>{yacht.owner}</td>
              
              <td 
              style={{
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >{yacht.location.address}</td>
              <td>{yacht.capacity}</td>
              <td>{yacht?.price}</td>
              <td>
                <span className={`${styles.statusCell} ${styles[getStatusClassName(yacht.status)]}`}>
                  {getStatusIcon(yacht.status)}
                  {yacht.status}
                </span>
              </td>
              <td>
                <span className={styles.rating}>
                  <FaStar className={styles.starIcon} /> {yacht.rating}
                </span>
              </td>
              <td className={styles.actions}>
                <button
                  className={styles.editButton}
                  onClick={() => {
                    setSelectedYacht(yacht);
                    setEditMode(true);
                    setEditedYacht({...yacht});
                    setShowYachtModal(true);
                  }}
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => {
                    setSelectedYacht(yacht);
                    setDeleteConfirmation(true);
                  }}
                  title="Delete"
                >
                  <FaTrash />
                </button>
                <button
                  className={styles.feedbackButton}
                  onClick={() => handleFeedbackClick(yacht)}
                  title="Feedback"
                >
                  <FaComment />
                </button>
                {/* <button
                  className={styles.viewDetailsButton}
                  onClick={() => handleYachtClick(yacht)}
                  title="View Details"
                >
                  <FaExternalLinkAlt />
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modals */}
      {showYachtModal && selectedYacht && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editMode ? 'Edit Yacht' : selectedYacht.title}</h3>
              <button className={styles.closeButton} onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>

            {editMode ? (
              <div className={styles.editForm}>
                <div className={styles.formGroup}>
                  <label>Name:</label>
                  <input
                    type="text"
                    value={editedYacht.title}
                    onChange={(e) => setEditedYacht({...editedYacht, name: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Owner:</label>
                  <input
                    type="text"
                    value={editedYacht.ownerName}
                    onChange={(e) => setEditedYacht({...editedYacht, ownerName: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Length:</label>
                  <input
                    type="text"
                    value={editedYacht.features?.length}
                    onChange={(e) => setEditedYacht({...editedYacht, features: {...editedYacht.features, length: e.target.value}})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Capacity:</label>
                  <input
                    type="text"
                    value={editedYacht.capacity}  
                    onChange={(e) => setEditedYacht({...editedYacht, capacity: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Location:</label>
                  <input
                    type="text"
                    value={editedYacht.location.address}
                    onChange={(e) => setEditedYacht({...editedYacht, location: {address: e.target.value}})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Price Per Day:</label>
                  <input
                    type="text"
                    value={editedYacht.price}
                    onChange={(e) => setEditedYacht({...editedYacht, pricePerDay: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Status:</label>
                  <select
                    value={editedYacht.status}
                    onChange={(e) => setEditedYacht({...editedYacht, status: e.target.value})}
                  >
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Description:</label>
                  <textarea
                    value={editedYacht.description}
                    onChange={(e) => setEditedYacht({...editedYacht, description: e.target.value})}
                    rows={4}
                  />
                </div>
              </div>
            ) : (
              <div className={styles.yachtModalDetails}>
                <div className={styles.imageGallery}>
                  <img 
                    src={selectedYacht?.images?.[0].imgeUrl || DEFAULT_IMAGE} 
                    alt={selectedYacht.title}
                    loading="lazy"
                  />
                </div>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <FaUser className={styles.icon} />
                    <label>Owner</label>
                    <span>{selectedYacht.owner}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FaMapMarkerAlt className={styles.icon} />
                    <label>Location</label>
                    <span>{selectedYacht.location.address}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FaRuler className={styles.icon} />
                    <label>Length</label>
                    <span>{selectedYacht.features?.length}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FaUsers className={styles.icon} />
                    <label>Capacity</label>
                    <span>{selectedYacht.capacity}</span>
                  </div>
                </div>
                <div className={styles.description}>
                  <h4>Description</h4>
                  <p>{selectedYacht.description}</p>
                </div>
                <div className={styles.amenitiesList}>
                  <h4>Amenities</h4>
                  <div className={styles.amenitiesGrid}>
                    {selectedYacht?.amenities?.map((amenity, index) => (
                      <span key={index} className={styles.amenity}>
                        {amenity}
                      </span>
                    ))}{
                      selectedYacht.amenities==null && <span>No amenities</span>
                    }
                  </div>
                </div>
                <div className={styles.statistics}>
                  <div className={styles.statItem}>
                    <h4>Rating</h4>
                    <div className={styles.statValue}>
                      <FaStar className={styles.starIcon} />
                      <span>{selectedYacht.rating}</span>
                      <small>({selectedYacht.reviews} reviews)</small>
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <h4>Bookings</h4>
                    <div className={styles.statValue}>
                      <span>{selectedYacht.bookings}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.modalPrice}>
                  {/* <FaDollarSign className={styles.priceIcon} /> */}
                  <span className={styles.priceText}>{selectedYacht.price}</span>
                  <span className={styles.perDay}>/day</span>
                </div>
              </div>
            )}

            <div className={styles.modalActions}>
              {editMode ? (
                <>
                  <button className={styles.saveButton} onClick={handleSaveChanges}>
                    <FaCheck /> Save Changes
                  </button>
                  <button className={styles.cancelButton} onClick={() => setEditMode(false)}>
                    <FaTimes /> Cancel
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className={`${styles.acceptButton} text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200`}
                    onClick={() => handleAcceptYacht(selectedYacht)}
                    title="Approve Yacht"
                  >
                    <FaAnchor className="mr-2" /> Approve
                  </button>
                  <button 
                    className={`${styles.rejectButton} text-amber-600 hover:text-amber-800 bg-amber-50 border border-amber-200`}
                    onClick={() => handleRejectYacht(selectedYacht)}
                    title="Reject Yacht"
                  >
                    <FaShieldAlt className="mr-2" /> Reject
                  </button>
                  <button className={styles.editButton} onClick={handleEditClick}>
                    <FaEdit /> Edit
                  </button>
                  <button 
                    className={styles.deleteButton} 
                    onClick={() => setDeleteConfirmation(true)}
                  >
                    <FaTrash /> Delete
                  </button>
                  <button
                    className={styles.feedbackButton}
                    onClick={() => handleFeedbackClick(selectedYacht)}
                  >
                    <FaComment /> Add Feedback
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Separate Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className={styles.deleteModalOverlay} onClick={() => setDeleteConfirmation(false)}>
          <div className={styles.confirmationModal} onClick={(e) => e.stopPropagation()}>
            <h4>Confirm Delete</h4>
            <p>Are you sure you want to delete {selectedYacht.name}?</p>
            <div className={styles.modalActions}>
              <button className={styles.deleteButton} onClick={handleDeleteYacht}>
                <FaTrash /> Delete
              </button>
              <button className={styles.cancelButton} onClick={() => setDeleteConfirmation(false)}>
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedYacht && (
        <div className={styles.modalOverlay} onClick={() => setShowFeedbackModal(false)}>
          <div className={styles.feedbackModal} onClick={(e) => e.stopPropagation()}>
            <h4>Leave Feedback for {selectedYacht.title}</h4>
            <div className={styles.ratingSelector}>
              <label>Rating:</label>
              <div className={styles.starRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`${styles.ratingStar} ${feedbackRating >= star ? styles.active : ''}`}
                    onClick={() => setFeedbackRating(star)}
                  />
                ))}
              </div>
            </div>
            <div className={styles.feedbackForm}>
              <label>Your Feedback:</label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your experience with this yacht..."
                rows={4}
              />
            </div>
            <div className={styles.modalActions}>
              <button className={styles.submitButton} onClick={handleSubmitFeedback}>
                <FaCheck /> Submit Feedback
              </button>
              <button className={styles.cancelButton} onClick={() => setShowFeedbackModal(false)}>
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accept/Reject Confirmation Modal */}
      {showAcceptRejectModal && (
        <div className={styles.deleteModalOverlay} onClick={() => setShowAcceptRejectModal(false)}>
          <div className={styles.confirmationModal} onClick={(e) => e.stopPropagation()}>
            <h4>{actionType === "accept" ? "Confirm Approval" : "Confirm Rejection"}</h4>
            <p>{actionMessage}</p>
            <div className={styles.modalActions}>
              <button 
                className={actionType === "accept" 
                  ? `${styles.acceptButton} text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200` 
                  : `${styles.rejectButton} text-amber-600 hover:text-amber-800 bg-amber-50 border border-amber-200`} 
                onClick={handleConfirmAction}
              >
                {actionType === "accept" ? <FaAnchor className="mr-2" /> : <FaShieldAlt className="mr-2" />} 
                {actionType === "accept" ? "Approve" : "Reject"}
              </button>
              <button className={`${styles.cancelButton} bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300`} onClick={() => setShowAcceptRejectModal(false)}>
                <FaTimes className="mr-2" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className={styles.pagination}>
        <span>
          Showing {startIndex + 1} to {endIndex} of {totalPages} entries
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

export default YachtsComponent; 