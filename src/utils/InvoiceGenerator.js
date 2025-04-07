import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Generates a PDF invoice for a yacht booking
 * @param {Object} booking - The booking data
 * @returns {jsPDF} - The generated PDF document
 */
const generateInvoice = (booking) => {
  try {
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: `Invoice for ${booking.user}`,
      subject: 'Yacht Booking Invoice',
      author: 'Book Luxury Boat',
      keywords: 'invoice, yacht, booking'
    });

    // Extract booking amount - remove any non-numeric characters except decimal
    const totalAmount = parseFloat(booking.amount.replace(/[^0-9.]/g, ''));
    
    // Calculate booking duration in days
    let bookingDays = 1; // Default to 1 day
    if (booking.startDate && booking.endDate) {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      const diffTime = Math.abs(end - start);
      bookingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // Ensure minimum 1 day
    }
    
    // Calculate daily rate
    const dailyRate = Math.round(totalAmount / bookingDays);
    
    // Calculate captain fee separately - Only used for display in the invoice items section
    const captainFee = booking.captainIncluded ? 80 : 0;
    
    // Calculate the base service cost (without fees)
    // Working backwards from the total to ensure total matches booking amount
    // Assuming the total includes all fees
    const baseAmount = totalAmount / (1 + 0.039 + 0.1 + 0.13); // Divide by (1 + all fee percentages)
    
    // Calculate fees as portions of the total rather than additions
    const bankServiceCharge = Math.round(baseAmount * 0.039 * 100) / 100; // 3.9%
    const gratuity = Math.round(baseAmount * 0.1 * 100) / 100; // 10%
    const serviceCharge = Math.round(baseAmount * 0.13 * 100) / 100; // 13%
    
    // Subtotal is base amount (may include captain fee in the actual booking calculation)
    const subtotal = Math.round(baseAmount * 100) / 100;
    
    // Generate invoice number based on booking ID
    const invoiceNumber = `#${booking.id.replace(/[^0-9]/g, '')}6345696`;
    
    // Get current date for invoice issuance
    const currentDate = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const invoiceDate = `${months[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
    
    // Due date is same as invoice date
    const dueDate = invoiceDate;
    
    // Format service date from booking
    const serviceDate = booking.startDate || booking.date;
    
    // Get formatted service time if available
    let serviceTime = "";
    if (booking.startTime && booking.endTime) {
      const formatTime = (time) => {
        const date = new Date(time);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutesStr}${ampm}`;
      };
      
      serviceTime = `${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`;
    } else {
      // Default time
      serviceTime = "12:00PM - 3:00PM";
    }
    
    // Function to add the header to both pages
    const addHeader = (doc) => {
      try {
        // Try to add the anchor logo directly with full path
        doc.addImage('../assets/Anchor.png', 'PNG', 15, 15, 30, 30);
      } catch (error) {
        console.error("Error adding logo:", error);
        // Fallback to a colored rectangle
        doc.setFillColor(9, 59, 73); // #093b49 color - matches the anchor logo
        doc.rect(15, 15, 30, 30, 'F');
        
        // Add text "ANCHOR" to the logo placeholder
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('ANCHOR', 20, 30);
      }
    
      // Company name and contact info
      doc.setFontSize(14);
      doc.setTextColor(9, 59, 73); // #093b49 color
      doc.setFont('helvetica', 'bold');
      doc.text('Book Luxury Boat', 55, 25);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('info@bookluxuryboat.com | (866) 218-6272', 55, 32);
    
      // Invoice number and date - right aligned
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Invoice ' + invoiceNumber, 195, 25, { align: 'right' });
    
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Issue date', 195, 32, { align: 'right' });
      doc.setFont('helvetica', 'bold');
      doc.text(invoiceDate, 195, 38, { align: 'right' });
      
      // Separator line after header
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(15, 45, 195, 45);
    };
    
    // Function to add footer with QR code and page number
    const addFooter = (doc, pageNum, totalPages) => {
      const footerY = 270;
      
      try {
        // Try to add the QR code directly with full path
        doc.addImage('../assets/qr.png', 'PNG', 15, footerY, 25, 25);
      } catch (error) {
        console.error("Error adding QR code:", error);
        // Fallback to a black square
        doc.setFillColor(0, 0, 0);
        doc.rect(15, footerY, 25, 25, 'F');
        
        doc.setFontSize(6);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('QR CODE', 19, footerY + 13);
      }
      
      // View online text - properly aligned next to QR code
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text('View online', 45, footerY + 5);
      doc.setFont('helvetica', 'normal');
      doc.text('To view your invoice go to https://squareup.com/u/i9v41zgF', 45, footerY + 10);
      doc.text('Or open the camera on your mobile device and place the QR code in the camera\'s', 45, footerY + 15);
      doc.text('view.', 45, footerY + 20);
      
      // Page number - right aligned
      doc.text(`Page ${pageNum} of ${totalPages}`, 195, footerY + 20, { align: 'right' });
      
      // Horizontal line above footer
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(15, footerY - 5, 195, footerY - 5);
    };
    
    // ------------------- PAGE 1 -------------------
    addHeader(doc);
    
    // Customer ID with proper spacing - Generate a unique ID for the customer
    const customerID = `Y${booking.id.replace(/[^0-9]/g, '')}${booking.user.charAt(0)}`;
    doc.setFontSize(14);
    doc.setTextColor(9, 59, 73); // #093b49 color
    doc.setFont('helvetica', 'bold');
    doc.text(customerID, 15, 60);
    
    // Thank you message with proper alignment and compact spacing
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    
    let yPos = 70;
    const maxWidth = 180; // Maximum width to prevent text from leaking
    
    doc.text('Thank you for choosing Book Luxury Boat for your recent yacht rental in Toronto. We do our best for you to have a', 15, yPos, { maxWidth });
    yPos += 5;
    doc.text('memorable time on the water and in the yacht and that it met all of your expectations. We strive to provide our clients with', 15, yPos, { maxWidth });
    yPos += 5;
    doc.text('exceptional service and luxurious amenities, and we appreciate your business.', 15, yPos, { maxWidth });
    yPos += 10;
    
    doc.text('Please find attached your invoice for the yacht rental services. The breakdown of charges is as follows:', 15, yPos, { maxWidth });
    yPos += 10;
    
    // Yacht booking details - compact and well-formatted - Use booking data
    doc.text(`${booking.yacht} |`, 15, yPos); yPos += 5;
    doc.text(`Date: ${serviceDate} |`, 15, yPos); yPos += 5;
    doc.text(`Time: ${serviceTime} |`, 15, yPos); yPos += 5;
    
    // Only show promotional price per day if we have multiple days
    if (bookingDays > 1) {
      doc.text(`Rate: $${dailyRate}/day for ${bookingDays} days |`, 15, yPos); yPos += 5;
    } else {
      doc.text(`Rate: $${dailyRate} |`, 15, yPos); yPos += 5;
    }
    
    // Show the total with proper formatting
    doc.text(`Total: ${booking.amount} |`, 15, yPos); yPos += 10;
    
    // Tipping information with compact spacing
    doc.text('Just wanted to give you a quick update about tipping the amazing boat crew members on board during your trip.', 15, yPos, { maxWidth }); yPos += 10;
    
    doc.text('We truly appreciate your support in keeping them motivated and providing you with the best service possible for your event', 15, yPos, { maxWidth }); yPos += 5;
    doc.text('.', 15, yPos, { maxWidth }); yPos += 5;
    
    doc.text('Here are the tipping rates for this summer season:', 15, yPos, { maxWidth }); yPos += 8;
    
    doc.text('* For groups of 1-20 people, a minimum tip of 10% is Committed.', 15, yPos, { maxWidth }); yPos += 5;
    doc.text('* For groups of 15-22 people, a minimum tip of 15% is recommended.', 15, yPos, { maxWidth }); yPos += 5;
    doc.text('* And for larger groups of 23-30 people, a minimum tip of 18% is encouraged.', 15, yPos, { maxWidth }); yPos += 10;
    
    doc.text('We want to ensure that you have an incredible experience on our yacht, and these tips go directly to the hardworking boat', 15, yPos, { maxWidth }); yPos += 5;
    doc.text('crew members who make it all possible.', 15, yPos, { maxWidth }); yPos += 10;
    
    doc.text('If you have any questions or need further assistance, feel free to reach out to us.', 15, yPos, { maxWidth }); yPos += 8;
    
    doc.text('We\'re here to make your charter unforgettable!', 15, yPos, { maxWidth }); yPos += 5;
    doc.text('Looking forward to having you on board soon!', 15, yPos, { maxWidth }); yPos += 10;
    
    // Customer/Invoice/Payment Information table - properly aligned
    const tableY = 215;
    
    // Top divider line
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.5);
    doc.line(15, tableY, 65, tableY);
    doc.line(70, tableY, 195, tableY);
    
    // Table headers
    doc.setFontSize(9);
    doc.setTextColor(9, 59, 73); // #093b49 color
    doc.setFont('helvetica', 'bold');
    doc.text('Customer', 15, tableY + 8);
    doc.text('Invoice Details', 70, tableY + 8);
    doc.text('Payment', 145, tableY + 8);
    
    // Table content - Use booking data
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(booking.user, 15, tableY + 16);
    doc.text(booking.email || `${booking.user.toLowerCase().replace(/\s+/g, '.')}@example.com`, 15, tableY + 23);
    doc.text(booking.phone || "(647) 927-5718", 15, tableY + 30);
    
    doc.text(`PDF created ${invoiceDate}`, 70, tableY + 16);
    doc.text(`${booking.amount}`, 70, tableY + 23);
    doc.text(`Service date ${serviceDate}`, 70, tableY + 30);
    
    doc.text(`Due ${dueDate}`, 145, tableY + 16);
    doc.text(`${booking.amount}`, 145, tableY + 23);
    
    // Payment status if available
    if (booking.paymentStatus) {
      doc.text(`Status: ${booking.paymentStatus}`, 145, tableY + 30);
    }
    
    // Add footer to page 1
    addFooter(doc, 1, 2);
    
    // ------------------- PAGE 2 -------------------
    doc.addPage();
    addHeader(doc);
    
    // Invoice items section title
    doc.setFontSize(12);
    doc.setTextColor(9, 59, 73); // #093b49 color
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE ITEMS', 15, 60);
    
    // Create dynamic invoice items based on booking
    const invoiceItems = [];
    let itemCounter = 1;
    
    // Add yacht rental item
    if (bookingDays > 1) {
      invoiceItems.push([
        `${itemCounter}`, 
        `${booking.yacht} Rental (${bookingDays} days)`, 
        `${bookingDays}`, 
        `$${(subtotal / bookingDays).toFixed(2)}`, 
        `$${subtotal.toFixed(2)}`
      ]);
    } else {
      invoiceItems.push([
        `${itemCounter}`, 
        `${booking.yacht} Rental`, 
        '1', 
        `$${subtotal.toFixed(2)}`, 
        `$${subtotal.toFixed(2)}`
      ]);
    }
    itemCounter++;
    
    // Add captain fees if included
    if (booking.captainIncluded && captainFee > 0) {
      invoiceItems.push([
        `${itemCounter}`, 
        'Captain Service', 
        '1', 
        `$${captainFee.toFixed(2)}`, 
        `$${captainFee.toFixed(2)}`
      ]);
      itemCounter++;
    }
    
    // Use autoTable for clean table layout
    doc.autoTable({
      head: [['S.No', 'Item', 'Quantity', 'Price', 'Amount']],
      body: invoiceItems,
      startY: 65,
      theme: 'grid',
      headStyles: {
        fillColor: [9, 59, 73],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      styles: {
        cellPadding: 5,
        fontSize: 9,
        lineWidth: 0.1,
        lineColor: [200, 200, 200]
      },
      columnStyles: {
        0: { cellWidth: 20, halign: 'center' },
        1: { cellWidth: 'auto', halign: 'left' },
        2: { cellWidth: 30, halign: 'center' },
        3: { cellWidth: 35, halign: 'right' },
        4: { cellWidth: 35, halign: 'right' }
      }
    });
    
    // Get position after table
    const tableEndY = doc.autoTable.previous.finalY + 15;
    
    // Create array for cost breakdown items
    const costBreakdownItems = [
      ['Subtotal', `$${subtotal.toFixed(2)}`]
    ];
    
    // Add bank service charge if applicable
    if (bankServiceCharge > 0) {
      costBreakdownItems.push(['Bank Service Charge (3.9%)', `$${bankServiceCharge.toFixed(2)}`]);
    }
    
    // Add gratuity if applicable
    if (gratuity > 0) {
      costBreakdownItems.push(['Gratuity (Centralized Tip) (10%)', `$${gratuity.toFixed(2)}`]);
    }
    
    // Add service charge if applicable
    if (serviceCharge > 0) {
      costBreakdownItems.push(['Service Charge (13%)', `$${serviceCharge.toFixed(2)}`]);
    }
    
    // Cost breakdown with proper alignment
    doc.autoTable({
      body: costBreakdownItems,
      startY: tableEndY,
      theme: 'plain',
      tableWidth: 'auto',
      styles: {
        cellPadding: 3,
        fontSize: 9
      },
      columnStyles: {
        0: { cellWidth: 135, halign: 'right' },
        1: { cellWidth: 45, halign: 'right' }
      },
      margin: { left: 15 }
    });
    
    // Get position after summary table
    const summaryEndY = doc.autoTable.previous.finalY + 5;
    
    // Line above total
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.5);
    doc.line(120, summaryEndY, 195, summaryEndY);
    
    // Total amount - use original booking amount
    doc.setFontSize(11);
    doc.setTextColor(9, 59, 73); // #093b49 color
    doc.setFont('helvetica', 'bold');
    doc.text('Total Paid', 150, summaryEndY + 10);
    doc.text(booking.amount, 195, summaryEndY + 10, { align: 'right' });
    
    // Line below total
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.5);
    doc.line(120, summaryEndY + 15, 195, summaryEndY + 15);
    
    // Payments section - Use booking data for payment method
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'bold');
    doc.text('Payments', 15, summaryEndY + 30);
    doc.setFont('helvetica', 'normal');
    const paymentMethod = booking.paymentMethod || "Credit Card (Mastercard 9375)";
    doc.text(`${dueDate} (${paymentMethod})`, 15, summaryEndY + 40);
    doc.text(booking.amount, 195, summaryEndY + 40, { align: 'right' });
    
    // Add footer to page 2
    addFooter(doc, 2, 2);
    
    return doc;
  } catch (error) {
    console.error("Error in generateInvoice:", error);
    throw new Error(`Failed to generate invoice: ${error.message}`);
  }
};

export default generateInvoice; 