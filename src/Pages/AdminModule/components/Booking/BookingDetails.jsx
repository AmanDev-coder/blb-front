import React, { useState } from "react";
import styles from "./BookingDetails.module.scss";
import { 
  FaUser, 
  FaShip, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaArrowLeft, 
  FaFileAlt, 
  FaDownload, 
  FaEye,
  FaIdCard,
  FaCreditCard,
  FaPassport,
  FaFilePdf,
  FaFileImage
} from "react-icons/fa";

const BookingDetails = ({ booking, onBack }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  console.log(booking);
  // Calculate cost breakdown
  const basePriceNumber = parseFloat(booking.amount.replace("$", ""));
  const commissionRate = 0.15; // 15% commission
  const taxRate = 0.13; // 13% tax (assumed for Canada)
  const captainCharges = booking.captainIncluded ? 80 : 0; // $80 if captain included

  const basePrice = basePriceNumber - (basePriceNumber * commissionRate) - captainCharges;
  const commission = basePrice * commissionRate;
  const subtotal = basePrice + commission + captainCharges;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Get appropriate icon for document type
  const getDocumentIcon = (docType) => {
    if (docType.toLowerCase().includes('passport')) return <FaPassport />;
    if (docType.toLowerCase().includes('license') || docType.toLowerCase().includes('id')) return <FaIdCard />;
    if (docType.toLowerCase().includes('credit')) return <FaCreditCard />;
    if (docType.toLowerCase().includes('pdf')) return <FaFilePdf />;
    return <FaFileImage />;
  };

  // Open document in a new tab
  const viewDocument = (document) => {
    setSelectedDocument(document);
    window.open(document.url, '_blank');
  };

  // Download document - Simplified and more reliable implementation
  const downloadDocument = (document) => {
    try {
      // For demonstration purposes with placeholder images
      const downloadUrl = document.url;
      const fileName = document.name || `document-${document.id}.jpg`;
      
      // Open in a new window first (this helps with CORS issues on placeholder images)
      const newWindow = window.open(downloadUrl, '_blank');
      
      // Inform the user how to save the image
      alert(`To download the document: 
1. The document has opened in a new tab
2. Right-click on the image 
3. Select "Save image as..." 
4. Save it as "${fileName}"`);
      
      // If opening in a new window fails, try direct download
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Fallback method for direct download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
        }, 100);
      }
    } catch (error) {
      console.error("Error downloading document:", error);
      alert("Failed to download document. Please try opening it in a new tab and saving it manually.");
      // Last resort fallback - just open in new tab
      window.open(document.url, '_blank');
    }
  };

  return (
    <div className={styles.bookingDetailsContainer}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          <FaArrowLeft /> Back to Bookings
        </button>
        <h2>Booking Details {booking.id}</h2>
      </div>

      <div className={styles.detailsGrid}>
        {/* User Details Section */}
        <div className={styles.detailsCard}>
          <div className={styles.cardHeader}>
            <FaUser className={styles.icon} />
            <h3>User Details</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Name:</span>
              <span className={styles.value}>{booking.user}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{booking.email || "user@example.com"}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Phone:</span>
              <span className={styles.value}>{booking.phone || "+1 (123) 456-7890"}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Address:</span>
              <span className={styles.value}>{booking.address || "123 Main St, Toronto, ON, Canada"}</span>
            </div>
          </div>
        </div>

        {/* Yacht Details Section */}
        <div className={styles.detailsCard}>
          <div className={styles.cardHeader}>
            <FaShip className={styles.icon} />
            <h3>Yacht Details</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Yacht Name:</span>
              <span className={styles.value}>{booking.yacht}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Type:</span>
              <span className={styles.value}>{booking.yachtType || "Luxury Cruiser"}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Length:</span>
              <span className={styles.value}>{booking.yachtLength || "48 ft"}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Capacity:</span>
              <span className={styles.value}>{booking.yachtCapacity || "12 guests"}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Owner:</span>
              <span className={styles.value}>{booking.yachtOwner || "Blue Lux Yachts"}</span>
            </div>
          </div>
        </div>

        {/* Booking Details Section */}
        <div className={styles.detailsCard}>
          <div className={styles.cardHeader}>
            <FaCalendarAlt className={styles.icon} />
            <h3>Booking Details</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Booking Date:</span>
              <span className={styles.value}>{booking.bookingDate}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Start Date:</span>
              <span className={styles.value}>{booking.startDate}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>End Date:</span>
              <span className={styles.value}>{booking.endDate}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Duration:</span>
              <span className={styles.value}>
                {(() => {
                  const start = new Date(booking.startDate);
                  const end = new Date(booking.endDate);
                  const diffTime = Math.abs(end - start);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return `${diffDays} days`;
                })()}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Status:</span>
              <span className={`${styles.value} ${styles[booking.status.toLowerCase()]}`}>
                {booking.status}
              </span>
            </div>
          </div>
        </div>

        {/* Cost Breakdown Section */}
        <div className={styles.detailsCard}>
          <div className={styles.cardHeader}>
            <FaMoneyBillWave className={styles.icon} />
            <h3>Cost Breakdown</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Base Price:</span>
              <span className={styles.value}>${basePrice.toFixed(2)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Commission (15%):</span>
              <span className={styles.value}>${commission.toFixed(2)}</span>
            </div>
            {booking.captainIncluded && (
              <div className={styles.detailItem}>
                <span className={styles.label}>Captain Charges:</span>
                <span className={styles.value}>${captainCharges.toFixed(2)}</span>
              </div>
            )}
            <div className={styles.detailItem}>
              <span className={styles.label}>Subtotal:</span>
              <span className={styles.value}>${subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Tax (13%):</span>
              <span className={styles.value}>${tax.toFixed(2)}</span>
            </div>
            <div className={`${styles.detailItem} ${styles.totalRow}`}>
              <span className={styles.label}>Total Amount:</span>
              <span className={styles.value}>${total.toFixed(2)}</span>
            </div>
            <div className={styles.paymentDetails}>
              <div className={styles.paymentMethod}>
                <span className={styles.label}>Payment Method:</span>
                <span className={styles.value}>{booking.paymentMethod || "Credit Card"}</span>
              </div>
              <div className={styles.paymentStatus}>
                <span className={styles.label}>Payment Status:</span>
                <span className={`${styles.value} ${styles.paid}`}>{booking.paymentStatus || "Paid"}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Verification Documents Section - Redesigned as stacked list */}
        {booking.documents && booking.documents.length > 0 && (
          <div className={styles.detailsCard}>
            <div className={styles.cardHeader}>
              <FaFileAlt className={styles.icon} />
              <h3>Verification Documents</h3>
            </div>
            <div className={styles.cardContent}>
              {booking.documents.map((doc) => (
                <div key={doc.id} className={styles.detailItem}>
                  <div className={styles.documentLabel}>
                    <div className={styles.documentIconSmall}>
                      {getDocumentIcon(doc.type)}
                    </div>
                    <div className={styles.documentInfo}>
                      <span className={styles.docType}>{doc.type}</span>
                      <span className={styles.docName}>{doc.name}</span>
                      <span className={styles.uploadDate}>Uploaded: {doc.uploadDate}</span>
                    </div>
                  </div>
                  <div className={styles.documentActions}>
                    <button 
                      className={styles.viewBtn}
                      onClick={() => viewDocument(doc)}
                      title="View Document"
                    >
                      <FaEye />
                    </button>
                    <button 
                      className={styles.downloadBtn}
                      onClick={() => downloadDocument(doc)}
                      title="Download Document"
                    >
                      <FaDownload />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetails; 