import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper function to sanitize data for PDF generation
const sanitizeDataForPDF = (data) => {
  if (!data) return { content: [], summary: {} };
  
  // Ensure summary exists
  const summary = data.summary || {};
  
  // Convert any summary numeric values to numbers to ensure proper calculations
  if (summary.total !== undefined) {
    summary.total = Number(summary.total) || 0;
  }
  if (summary.count !== undefined) {
    summary.count = Number(summary.count) || 0;
  }
  
  // Ensure content exists and is properly formatted
  let content = data.content;
  
  // Handle null or undefined content
  if (!content) {
    content = [];
  }
  
  // Handle non-array content for array-expecting scenarios
  if (!Array.isArray(content) && typeof content === 'object') {
    // Convert object to array of objects with key-value pairs
    content = Object.entries(content).map(([key, value]) => ({ key, value }));
  }
  
  // Return sanitized data
  return {
    ...data,
    content,
    summary
  };
};

// Helper function to extract table data from report data
const extractTableData = (data) => {
  // Sanitize data first
  const sanitizedData = sanitizeDataForPDF(data);
  const actualData = sanitizedData.content;
  const reportType = sanitizedData.reportType;
  
  console.log("Extracting table data for report type:", reportType);
  
  // Handle empty or invalid data
  if (!actualData || (Array.isArray(actualData) && actualData.length === 0)) {
    return { headers: ['No Data'], rows: [['No data available']] };
  }
  
  try {
    // Special handling for different report types
    if (reportType === 'payouts') {
      // Continue using the existing special handling for payouts
      console.log("Processing payouts data for table:", actualData);
      
      // Ensure we have an array
      if (Array.isArray(actualData)) {
        // Define standard headers for payout reports if needed
        const standardHeaders = ['name', 'payout', 'yachts', 'payoutDate'];
        
        // Use standardHeaders if the data objects might be incomplete
        const firstItem = actualData[0] || {};
        const headers = Object.keys(firstItem).length >= 3 ? 
                       Object.keys(firstItem) : standardHeaders;
        
        // Create rows, ensuring all expected fields exist
        const rows = actualData.map(item => {
          return headers.map(header => {
            // If property exists in item, use it, otherwise use appropriate default
            if (Object.prototype.hasOwnProperty.call(item, header)) {
              // Format date if it's a date field
              if (header === 'payoutDate' && typeof item[header] === 'string' && 
                  item[header].match(/^\d{4}-\d{2}-\d{2}T/)) {
                return formatDate(new Date(item[header]));
              }
              
              // Format currency for payout field
              if (header === 'payout') {
                return typeof item[header] === 'number' ? 
                       formatCurrency(item[header]) : 
                       (item[header] || '$0.00');
              }
              
              return item[header] !== null && item[header] !== undefined ? 
                     item[header] : '';
            } else {
              // Provide reasonable defaults for missing fields
              if (header === 'payout') return '$0.00';
              if (header === 'yachts') return '0';
              if (header === 'payoutDate') return formatDate(new Date());
              return '';
            }
          });
        });
        
        return { headers, rows };
      }
    } else if (reportType === 'revenue') {
      // Enhanced handling for revenue reports
      console.log("Processing revenue data for table");
      
      if (Array.isArray(actualData) && actualData.length > 0) {
        const headers = ['month', 'amount'];
        const rows = actualData.map(item => [
          item.month || '',
          typeof item.amount === 'number' ? item.amount : Number(item.amount) || 0
        ]);
        
        return { headers, rows };
      }
    } else if (reportType === 'profitLoss') {
      // Enhanced handling for profit/loss reports
      console.log("Processing profit/loss data for table");
      
      if (Array.isArray(actualData) && actualData.length > 0) {
        const headers = ['month', 'profit'];
        const rows = actualData.map(item => [
          item.month || '',
          typeof item.profit === 'number' ? item.profit : Number(item.profit) || 0
        ]);
        
        return { headers, rows };
      }
    } else if (reportType === 'bookings') {
      // Enhanced handling for bookings reports
      console.log("Processing bookings data for table");
      
      if (Array.isArray(actualData) && actualData.length > 0) {
        const headers = ['date', 'count'];
        const rows = actualData.map(item => [
          item.date || '',
          typeof item.count === 'number' ? item.count : Number(item.count) || 0
        ]);
        
        return { headers, rows };
      }
    } else if (reportType === 'transactions') {
      // Enhanced handling for transactions reports
      console.log("Processing transactions data for table");
      
      if (Array.isArray(actualData) && actualData.length > 0) {
        const headers = ['date', 'amount'];
        const rows = actualData.map(item => [
          item.date || '',
          typeof item.amount === 'number' ? item.amount : Number(item.amount) || 0
        ]);
        
        return { headers, rows };
      }
    } else if (reportType === 'users') {
      // Enhanced handling for users reports
      console.log("Processing users data for table");
      
      if (Array.isArray(actualData) && actualData.length > 0) {
        const headers = ['date', 'newUsers'];
        const rows = actualData.map(item => [
          item.date || '',
          typeof item.newUsers === 'number' ? item.newUsers : Number(item.newUsers) || 0
        ]);
        
        return { headers, rows };
      }
    } else if (reportType === 'yachts') {
      // Enhanced handling for yachts reports
      console.log("Processing yachts data for table");
      
      if (Array.isArray(actualData) && actualData.length > 0) {
        const headers = ['name', 'owner', 'price'];
        const rows = actualData.map(item => [
          item.name || '',
          item.owner || '',
          typeof item.price === 'number' ? item.price : Number(item.price) || 0
        ]);
        
        return { headers, rows };
      }
    } else if (reportType === 'yachtOwners') {
      // Enhanced handling for yacht owners reports
      console.log("Processing yacht owners data for table");
      
      if (Array.isArray(actualData) && actualData.length > 0) {
        const headers = ['name', 'yachts', 'payout'];
        const rows = actualData.map(item => [
          item.name || '',
          typeof item.yachts === 'number' ? item.yachts : Number(item.yachts) || 0,
          typeof item.payout === 'number' ? item.payout : Number(item.payout) || 0
        ]);
        
        return { headers, rows };
      }
    }
  
    // General handling for any other data types
    console.log("Using general table data extraction");
    
    if (Array.isArray(actualData) && actualData.length > 0) {
      // Extract headers from the first item
      const headers = Object.keys(actualData[0] || {});
      
      if (headers.length === 0) {
        return { headers: ['No Data'], rows: [['No data available']] };
      }
      
      // Create rows from data
      const rows = actualData.map(item => 
        headers.map(header => {
          // Handle objects
          if (typeof item[header] === 'object' && item[header] !== null) {
            return JSON.stringify(item[header]);
          }
          
          return item[header] !== null && item[header] !== undefined ? item[header] : '';
        })
      );
      
      return { headers, rows };
    } else if (actualData && typeof actualData === 'object') {
      // If data is an object, convert to single row
      const headers = Object.keys(actualData);
      const rows = [headers.map(header => {
        if (typeof actualData[header] === 'object' && actualData[header] !== null) {
          return JSON.stringify(actualData[header]);
        }
        return actualData[header] !== null && actualData[header] !== undefined ? actualData[header] : '';
      })];
      
      return { headers, rows };
    }
  } catch (error) {
    console.error("Error in extractTableData:", error);
    return { headers: ['Error'], rows: [['Error extracting table data']] };
  }
  
  return { headers: ['No Data'], rows: [['No data available']] };
};

const generatePDF = (options) => {
  try {
    const { title, dateRange, data } = options;
    
    // Enhanced logging for debugging
    console.log("PDF Generation - Report Type:", options.reportType);
    console.log("PDF Generation - Date Range:", dateRange);
    console.log("PDF Generation - Data Summary:", data.summary);
    console.log("PDF Generation - Content Length:", Array.isArray(data.content) ? data.content.length : "N/A");
    console.log("PDF Generation - First Content Item:", Array.isArray(data.content) && data.content.length > 0 ? 
      JSON.stringify(data.content[0]).substring(0, 200) : "No data");
    
    // Sanitize data to prevent PDF generation issues
    const sanitizedData = sanitizeDataForPDF(data);
    const summary = sanitizedData.summary || {};
    const actualTitle = summary.title || title;
    const description = summary.description || '';
    
    // Create PDF document
    const doc = new jsPDF();
    
    // Add logo or branding (placeholder)
    doc.setDrawColor(41, 128, 185); // Blue color
    doc.setFillColor(41, 128, 185);
    doc.rect(14, 10, 10, 10, 'F');
    doc.setTextColor(255);
    doc.setFontSize(12);
    doc.text("LYR", 16, 17); // Luxury Yacht Reports
    
    // Reset text color
    doc.setTextColor(0);
    
    // Add title with better formatting
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text(actualTitle, 30, 17);
    
    // Add horizontal line
    doc.setDrawColor(220, 220, 220);
    doc.line(14, 22, 196, 22);
    
    // Add metadata section
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100);
    
    const currentDate = new Date().toLocaleString();
    doc.text(`Generated: ${currentDate}`, 14, 30);
    doc.text(`Report Period: ${dateRange}`, 14, 36);
    doc.text(`Report Type: ${options.reportType}`, 14, 42);
    
    // Add description if available
    if (description) {
      doc.setFont(undefined, 'italic');
      doc.text(description, 14, 50);
      doc.setFont(undefined, 'normal');
    }
    
    // Add summary section with styled box
    let yPos = description ? 60 : 50;
    
    // Draw summary box
    doc.setFillColor(249, 250, 251); // Light gray background
    doc.setDrawColor(229, 231, 235); // Border color
    doc.roundedRect(14, yPos, 182, summary.count !== undefined && summary.total !== undefined ? 30 : 22, 2, 2, 'FD');
    
    // Add summary title
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(41, 128, 185); // Blue color
    doc.text("REPORT SUMMARY", 20, yPos + 8);
    doc.setTextColor(0);
    doc.setFont(undefined, 'normal');
    
    // Add summary content
    doc.setFontSize(10);
    if (summary.count !== undefined) {
      doc.text(`Total Records: ${summary.count}`, 20, yPos + 16);
    }
    
    if (summary.total !== undefined) {
      // Ensure total is a number and format it
      const totalAmount = Number(summary.total) || 0;
      doc.text(`Total Amount: ${formatCurrency(totalAmount)}`, 20, yPos + 24);
    }
    
    // Position for table
    yPos = summary.count !== undefined && summary.total !== undefined ? yPos + 38 : yPos + 30;
    
    // Check if we have data before attempting to extract table data
    if (Array.isArray(sanitizedData.content) && sanitizedData.content.length > 0) {
      // Add table title
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text("Detailed Data", 14, yPos);
      
      // Skip auto-table attempt and go straight to manual table to avoid errors
      console.log("Using manual table for report type:", options.reportType);
      
      try {
        // Draw table headers
        doc.setFillColor(41, 128, 185);
        doc.setTextColor(255);
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        
        // Get raw content
        const rawContent = sanitizedData.content;
        let tableHeaders = [];
        let colWidths = [];
        let dataRows = [];
        
        // Prepare data based on report type for a simpler manual table
        if (options.reportType === 'revenue') {
          tableHeaders = ['Month', 'Revenue Amount', 'Date'];
          colWidths = [60, 70, 50];
          
          dataRows = rawContent.map(item => [
            item.month || "",
            typeof item.amount === 'number' ? formatCurrency(item.amount) : (item.amount || "$0.00"),
            item.date ? formatDate(new Date(item.date)) : ""
          ]);
        } else if (options.reportType === 'profitLoss') {
          tableHeaders = ['Month', 'Profit Amount', 'Date'];
          colWidths = [60, 70, 50];
          
          dataRows = rawContent.map(item => [
            item.month || "",
            typeof item.profit === 'number' ? formatCurrency(item.profit) : (item.profit || "$0.00"),
            item.date ? formatDate(new Date(item.date)) : ""
          ]);
        } else if (options.reportType === 'bookings') {
          tableHeaders = ['Date', 'Booking Count', 'User', 'Yacht'];
          colWidths = [50, 40, 45, 45];
          
          dataRows = rawContent.map(item => [
            typeof item.date === 'string' ? formatDate(new Date(item.date)) : (item.date || ""),
            item.count?.toString() || "0",
            item.user || "",
            item.yacht || ""
          ]);
        } else if (options.reportType === 'transactions') {
          tableHeaders = ['Date', 'Transaction Amount', 'User', 'Status'];
          colWidths = [50, 50, 50, 30];
          
          dataRows = rawContent.map(item => [
            typeof item.date === 'string' ? formatDate(new Date(item.date)) : (item.date || ""),
            typeof item.amount === 'number' ? formatCurrency(item.amount) : (item.amount || "$0.00"),
            item.user || "",
            item.status || ""
          ]);
        } else if (options.reportType === 'users') {
          tableHeaders = ['Date', 'New Users', 'Name', 'Status'];
          colWidths = [50, 40, 60, 30];
          
          dataRows = rawContent.map(item => [
            typeof item.date === 'string' ? formatDate(new Date(item.date)) : (item.date || ""),
            item.newUsers?.toString() || "0",
            item.name || "",
            item.status || ""
          ]);
        } else if (options.reportType === 'yachts') {
          tableHeaders = ['Yacht Name', 'Owner', 'Price', 'Status'];
          colWidths = [60, 50, 40, 30];
          
          dataRows = rawContent.map(item => [
            item.name || "",
            item.owner || "",
            typeof item.price === 'number' ? formatCurrency(item.price) : (item.price || "$0.00"),
            item.status || ""
          ]);
        } else if (options.reportType === 'yachtOwners') {
          tableHeaders = ['Owner Name', 'Yachts', 'Payout', 'Status'];
          colWidths = [60, 30, 50, 40];
          
          dataRows = rawContent.map(item => [
            item.name || "",
            item.yachts?.toString() || "0",
            typeof item.payout === 'number' ? formatCurrency(item.payout) : (item.payout || "$0.00"),
            item.status || ""
          ]);
        } else if (options.reportType === 'payouts') {
          tableHeaders = ['Owner Name', 'Payout Amount', 'Yachts', 'Payout Date'];
          colWidths = [60, 40, 30, 50];
          
          dataRows = rawContent.map(item => [
            item.name || "",
            typeof item.payout === 'number' ? formatCurrency(item.payout) : (item.payout || "$0.00"),
            item.yachts?.toString() || "0",
            typeof item.payoutDate === 'string' ? formatDate(new Date(item.payoutDate)) : formatDate(new Date())
          ]);
        } else if (options.reportType === 'recentBookings') {
          tableHeaders = ['ID', 'Customer', 'Yacht', 'Amount', 'Status'];
          colWidths = [30, 50, 40, 40, 20];
          
          dataRows = rawContent.map(item => [
            item.id || "",
            item.customer || "",
            item.yacht || "",
            typeof item.amount === 'number' ? formatCurrency(item.amount) : (item.amount || "$0.00"),
            item.status || ""
          ]);
        } else {
          // Default approach for other report types
          // Extract keys from first item
          const firstItem = rawContent[0] || {};
          const keys = Object.keys(firstItem);
          
          // Create header from keys
          tableHeaders = keys.map(key => 
            key.replace(/([A-Z])/g, ' $1')
               .replace(/_/g, ' ')
               .replace(/^\w/, c => c.toUpperCase())
               .trim()
          );
          
          // Evenly divide width
          const tableWidth = 180;
          colWidths = Array(keys.length).fill(Math.floor(tableWidth / keys.length));
          
          // Create rows
          dataRows = rawContent.map(item => {
            return keys.map(key => {
              const value = item[key];
              
              // Format based on key type
              if (typeof value === 'number') {
                if (key.includes('amount') || key.includes('price') || key.includes('payout')) {
                  return formatCurrency(value);
                }
                return value.toString();
              }
              
              if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
                return formatDate(new Date(value));
              }
              
              return value !== null && value !== undefined ? String(value) : '';
            });
          });
        }
        
        // Check if we have any data rows after processing
        if (dataRows.length === 0) {
          // No data to display
          doc.setTextColor(0);
          doc.setFontSize(10);
          doc.text("No data available for the selected date range.", 14, yPos + 20);
          return doc;
        }
        
        const startX = 14;
        const headerHeight = 10;
        
        // Draw header background
        doc.rect(startX, yPos + 10, colWidths.reduce((a, b) => a + b, 0), headerHeight, 'F');
        
        // Draw header text
        let xPos = startX + 3;
        tableHeaders.forEach((header, i) => {
          doc.text(String(header || ""), xPos, yPos + 17);
          xPos += colWidths[i];
        });
        
        // Draw data rows
        doc.setTextColor(0);
        doc.setFont(undefined, 'normal');
        
        let rowY = yPos + 10 + headerHeight;
        const rowHeight = 10;
        
        // Draw each row in the data
        dataRows.forEach((row, rowIndex) => {
          // Alternate row background
          if (rowIndex % 2 === 1) {
            doc.setFillColor(249, 250, 251);
            doc.rect(startX, rowY, colWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
          }
          
          // Draw cell text
          xPos = startX + 3;
          
          row.forEach((cell, cellIndex) => {
            const cellStr = String(cell || "");
            
            // Right-align amounts and payments
            const shouldRightAlign = 
              (tableHeaders[cellIndex] && (
                tableHeaders[cellIndex].includes('Amount') || 
                tableHeaders[cellIndex].includes('Price') ||
                tableHeaders[cellIndex].includes('Payout') ||
                tableHeaders[cellIndex].includes('Profit')
              )) || 
              cellStr.startsWith('$');
            
            // Center-align counts
            const shouldCenterAlign = 
              tableHeaders[cellIndex] && (
                tableHeaders[cellIndex].includes('Count') ||
                tableHeaders[cellIndex].includes('Yachts') ||
                tableHeaders[cellIndex].includes('Number')
              );
            
            if (shouldRightAlign) {
              // Right align currency/monetary values
              const textWidth = doc.getTextWidth(cellStr);
              doc.text(cellStr, xPos + colWidths[cellIndex] - 3 - textWidth, rowY + 7);
            } else if (shouldCenterAlign) {
              // Center align counts
              const textWidth = doc.getTextWidth(cellStr);
              const centerPos = xPos + (colWidths[cellIndex] / 2) - (textWidth / 2);
              doc.text(cellStr, centerPos, rowY + 7);
            } else {
              // Left align everything else
              doc.text(cellStr, xPos, rowY + 7);
            }
            
            xPos += colWidths[cellIndex];
          });
          
          // Move to next row
          rowY += rowHeight;
          
          // Check if we need a new page
          if (rowY > doc.internal.pageSize.height - 20) {
            doc.addPage();
            
            // Reset position
            rowY = 30;
            
            // Add header to new page
            doc.setFillColor(41, 128, 185);
            doc.rect(startX, rowY - 10, colWidths.reduce((a, b) => a + b, 0), headerHeight, 'F');
            
            // Draw header text
            xPos = startX + 3;
            doc.setTextColor(255);
            doc.setFont(undefined, 'bold');
            tableHeaders.forEach((header, i) => {
              doc.text(String(header || ""), xPos, rowY - 3);
              xPos += colWidths[i];
            });
            
            // Reset styles
            doc.setTextColor(0);
            doc.setFont(undefined, 'normal');
          }
        });
        
        // Draw table borders
        doc.setDrawColor(220, 220, 220);
        
        // Main border
        doc.rect(
          startX, 
          yPos + 10, 
          colWidths.reduce((a, b) => a + b, 0), 
          headerHeight + (dataRows.length * rowHeight), 
          'S'
        );
        
        // Vertical dividers between columns
        xPos = startX;
        for (let i = 0; i < colWidths.length - 1; i++) {
          xPos += colWidths[i];
          doc.line(
            xPos, 
            yPos + 10, 
            xPos, 
            yPos + 10 + headerHeight + (dataRows.length * rowHeight)
          );
        }
        
        // Horizontal divider after header
        doc.line(
          startX, 
          yPos + 10 + headerHeight, 
          startX + colWidths.reduce((a, b) => a + b, 0), 
          yPos + 10 + headerHeight
        );
      } catch (manualTableError) {
        console.error("Failed to create manual table:", manualTableError);
        
        // Super simple fallback - just show raw data
        doc.setTextColor(0);
        doc.setFontSize(10);
        doc.text("Data could not be displayed in table format. Raw data sample:", 14, yPos + 20);
        
        try {
          // Show first two items from raw data
          const sampleItems = sanitizedData.content.slice(0, 2);
          const sampleText = JSON.stringify(sampleItems).substring(0, 150) + "...";
          doc.text(sampleText, 14, yPos + 30);
        } catch {
          doc.text("Could not extract sample data", 14, yPos + 30);
        }
      }
    } else {
      // No data available
      doc.setFontSize(10);
      doc.text("No data available for this report type or date range.", 14, yPos + 20);
    }
    
    // Add footer with page numbers to all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2, 
        doc.internal.pageSize.getHeight() - 10, 
        { align: 'center' }
      );
      
      // Add timestamp at bottom left
      doc.text(
        `Generated: ${currentDate}`,
        14, 
        doc.internal.pageSize.getHeight() - 10
      );
    }
    
    return doc;
  } catch (error) {
    console.error("Error generating PDF:", error);
    
    // Create a simple error PDF
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(255, 0, 0);
    doc.text("Error generating PDF report", 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Error message: ${error.message || "Unknown error"}`, 14, 30);
    doc.text("Please try a different format or contact support.", 14, 40);
    
    return doc;
  }
};

const generateExcel = (options) => {
  const { data, title } = options;
  
  // Sanitize data to prevent issues
  const sanitizedData = sanitizeDataForPDF(data);
  const summary = sanitizedData.summary || {};
  const actualTitle = summary.title || title;
  
  // Extract table data
  const { headers, rows } = extractTableData(sanitizedData);
  
  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  
  // Set column widths
  const colWidths = headers.map(header => ({ wch: Math.max(header.length, 15) }));
  worksheet['!cols'] = colWidths;
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, actualTitle.slice(0, 31));
  
  // Generate Excel binary
  const excelBinary = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
  
  // Convert binary to buffer
  const buffer = new ArrayBuffer(excelBinary.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < excelBinary.length; i++) {
    view[i] = excelBinary.charCodeAt(i) & 0xFF;
  }
  
  return buffer;
};

const generateCSV = (options) => {
  const { data } = options;
  
  // Sanitize data to prevent issues
  const sanitizedData = sanitizeDataForPDF(data);
  
  // Extract table data
  const { headers, rows } = extractTableData(sanitizedData);
  
  // Build CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => {
        // Handle cells that contain commas by quoting them
        if (String(cell).includes(',')) {
          return `"${String(cell).replace(/"/g, '""')}"`;
        }
        return String(cell);
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
};

export const downloadReport = (reportData, format, reportType, dateRange = "all time") => {
  try {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${reportType}_report_${timestamp}`;
    const title = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`;
    
    const options = {
      title,
      dateRange,
      reportType,
      data: reportData
    };
    
    switch (format) {
      case "pdf": {
        try {
          // Try using jsPDF first
          const doc = generatePDF(options);
          
          try {
            // Save PDF with error handling
            doc.save(`${filename}.pdf`);
          } catch (saveError) {
            console.error("Error saving PDF:", saveError);
            
            // Alternative method - create blob and use saveAs
            try {
              const pdfBlob = new Blob([doc.output('blob')], { type: 'application/pdf' });
              saveAs(pdfBlob, `${filename}.pdf`);
            } catch (blobError) {
              console.error("Error with blob approach:", blobError);
              
              // Last resort - open in new window
              window.open(URL.createObjectURL(doc.output('blob')), '_blank');
            }
          }
        } catch (jsPdfError) {
          console.error("jsPDF approach failed:", jsPdfError);
          // Fallback to HTML approach
          generateHTMLReport(options, filename);
        }
        break;
      }
      
      case "excel": {
        // Generate Excel binary
        const buffer = generateExcel(options);
        
        // Create blob and save
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `${filename}.xlsx`);
        break;
      }
      
      case "csv": {
        // Generate CSV content
        const csvContent = generateCSV(options);
        
        // Create blob and save
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${filename}.csv`);
        break;
      }
      
      default: {
        // Default to JSON for unknown formats
        const jsonContent = JSON.stringify(reportData, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        saveAs(blob, `${filename}.json`);
      }
    }
  } catch (error) {
    console.error("Error in downloadReport:", error);
    alert("There was an error generating your report. Please try a different format or contact support.");
  }
};

// Helper function to generate a simple HTML PDF report as fallback
const generateHTMLReport = (options, filename) => {
  const { title, dateRange, data, reportType } = options;
  
  console.log("Generating HTML report for:", reportType);
  
  // Sanitize data to prevent issues
  const sanitizedData = sanitizeDataForPDF(data);
  const summary = sanitizedData.summary || {};
  const actualTitle = summary.title || title;
  const description = summary.description || '';
  
  // Ensure the summary total is a proper number
  const totalAmount = Number(summary.total) || 0;
  console.log("HTML Report Summary Total:", totalAmount);
  
  // Extract and format table data with special handling for payouts
  let tableData;
  if (reportType === 'payouts' && Array.isArray(sanitizedData.content) && sanitizedData.content.length > 0) {
    console.log("Using custom table data for payouts HTML report");
    
    // Define standard payouts headers
    const headers = ['name', 'payout', 'yachts', 'payoutDate'];
    const formattedHeaders = ['Owner Name', 'Payout Amount', 'Yachts', 'Payout Date'];
    
    // Format rows with consistent data
    const rows = sanitizedData.content.map(item => {
      // Create a properly formatted row
      const payoutText = typeof item.payout === 'number' ? 
                        formatCurrency(item.payout) : 
                        (item.payout || '$0.00');
      
      let dateText = '';
      if (item.payoutDate) {
        if (typeof item.payoutDate === 'string' && item.payoutDate.match(/^\d{4}-\d{2}-\d{2}T/)) {
          dateText = formatDate(new Date(item.payoutDate));
        } else {
          dateText = String(item.payoutDate);
        }
      } else {
        dateText = formatDate(new Date());
      }
      
      return [
        item.name || '',
        payoutText,
        String(item.yachts || '0'),
        dateText
      ];
    });
    
    tableData = { headers, formattedHeaders, rows };
  } else {
    // Regular extraction for other report types
    const { headers, rows } = extractTableData({...sanitizedData, reportType});
  
    // Format headers for better display
    const formattedHeaders = headers.map(header => {
      // Convert camelCase or snake_case to Title Case With Spaces
      return header
        .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/^\w/, c => c.toUpperCase()) // Capitalize first letter
        .trim();
    });
    
    // Format cell data for better display
    const formattedRows = rows.map(row => 
      row.map((cell, index) => {
        // Format dates
        if (typeof cell === 'string' && cell.match(/^\d{4}-\d{2}-\d{2}T/)) {
          return formatDate(new Date(cell));
        }
        
        // Format currency for amount or price columns
        if (headers[index].toLowerCase().includes('amount') || 
            headers[index].toLowerCase().includes('price') ||
            headers[index].toLowerCase().includes('payout')) {
          return typeof cell === 'number' ? formatCurrency(cell) : cell;
        }
        
        return cell;
      })
    );
    
    tableData = { headers, formattedHeaders, rows: formattedRows };
  }

  // Create HTML content with the table data
  let htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${actualTitle}</title>
        <style>
          body {
            font-family: Poppins, sans-serif;
            line-height: 1.6;
            padding: 20px;
            max-width: 1000px;
            margin: 0 auto;
            color: #333;
          }
          .header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 15px;
          }
          .logo {
            background-color: #2980b9;
            color: white;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 15px;
          }
          h1 {
            color: #2563eb;
            margin: 0;
            font-size: 24px;
          }
          .metadata {
            color: #6b7280;
            margin-bottom: 20px;
            font-size: 14px;
          }
          .description {
            font-style: italic;
            margin-bottom: 20px;
          }
          .summary {
            background-color: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 30px;
            border: 1px solid #e5e7eb;
          }
          .summary h2 {
            color: #2980b9;
            margin-top: 0;
            font-size: 16px;
            text-transform: uppercase;
          }
          .details h2 {
            font-size: 18px;
            margin-bottom: 15px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 14px;
          }
          th {
            background-color: #2980b9;
            color: white;
            text-align: left;
            padding: 10px;
            font-weight: bold;
          }
          td {
            padding: 8px 10px;
            border-bottom: 1px solid #e5e7eb;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .text-right {
            text-align: right;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
            display: flex;
            justify-content: space-between;
          }
          @media print {
            body {
              padding: 0;
            }
            .footer {
              position: fixed;
              bottom: 0;
              width: 100%;
            }
          }
          
          /* Add specific styles for payout reports */
          .payout-amount {
            text-align: right;
            font-weight: ${reportType === 'payouts' ? 'bold' : 'normal'};
            color: ${reportType === 'payouts' ? '#2563eb' : 'inherit'};
          }
          .yacht-count {
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">LYR</div>
          <h1>${actualTitle}</h1>
        </div>
        
        <div class="metadata">
          <div>Generated: ${new Date().toLocaleString()}</div>
          <div>Report Period: ${dateRange}</div>
          <div>Report Type: ${reportType || 'Standard'}</div>
        </div>
        
        ${description ? `<div class="description">${description}</div>` : ''}
        
        <div class="summary">
          <h2>Report Summary</h2>
          ${summary.count !== undefined ? `<p>Total Records: ${summary.count}</p>` : ''}
          ${summary.total !== undefined ? `<p>Total Amount: ${formatCurrency(totalAmount)}</p>` : ''}
        </div>
        
        <div class="details">
          <h2>Detailed Data</h2>
          <table>
            <thead>
              <tr>
                ${tableData.formattedHeaders.map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${tableData.rows.map(row => `
                <tr>
                  ${row.map((cell, index) => {
                    let className = '';
                    
                    // Apply special classes based on column type
                    if (reportType === 'payouts') {
                      if (index === 1) className = 'payout-amount'; // Payout amount
                      if (index === 2) className = 'yacht-count';   // Yacht count
                    } else {
                      // For other report types
                      const isNumeric = 
                        tableData.headers[index].toLowerCase().includes('amount') || 
                        tableData.headers[index].toLowerCase().includes('price') ||
                        tableData.headers[index].toLowerCase().includes('payout');
                      
                      if (isNumeric) className = 'text-right';
                    }
                    
                    return `<td class="${className}">${cell}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="footer">
          <div>Luxury Yacht Reports</div>
          <div>Page 1</div>
        </div>
      </body>
    </html>
  `;
  
  // Open in new window
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Give it a moment to render then either print or save
    setTimeout(() => {
      try {
        printWindow.print();
        // Close window after print dialog is shown
        setTimeout(() => printWindow.close(), 500);
      } catch (printError) {
        console.error("Error with print approach:", printError);
        printWindow.document.title = filename;
        alert("Your report has been opened in a new tab. Please use your browser's print function to save it as PDF.");
      }
    }, 500);
  } else {
    alert("Unable to open a new window for the report. Please check your browser settings.");
  }
};

export const emailReport = async (email, reportData, reportType, dateRange = "all time") => {
  try {
    // In a real implementation, you would generate the PDF and attach it to an email
    console.log(`Sending ${reportType} report to ${email}`);
    
    // Generate a PDF document for the email
    const title = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`;
    const options = {
      title,
      dateRange,
      reportType,
      data: reportData
    };
    
    // For demonstration purposes, generate a PDF but don't actually send it
    // In a real app, you would attach this PDF to an email
    const doc = generatePDF(options);
    console.log(`PDF generated successfully for email, ${doc.getNumberOfPages()} pages`);
    
    // Simulate a successful email
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email.includes("@")) {
          resolve({
            success: true,
            message: `Report successfully sent to ${email}`,
            timestamp: new Date().toISOString(),
          });
        } else {
          reject(new Error("Invalid email address"));
        }
      }, 1500);
    });
  } catch (error) {
    console.error("Error preparing email:", error);
    return Promise.reject(new Error("Failed to prepare email attachment"));
  }
};

export const printReport = (reportData, reportType, dateRange = "all time") => {
  const title = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`;
  const options = {
    title,
    dateRange,
    reportType,
    data: reportData
  };
  
  // Use the more reliable HTML approach for printing
  generateHTMLReport(options, `${reportType}_report_${new Date().toISOString().split('T')[0]}`);
}; 