import reportsDataRaw from './reportsData.json';

// Export the report data as a named export
export const reportsData = reportsDataRaw;

// Function to generate a report based on type, date range and format
export const generateReport = (reportType, dateRange) => {
  // Default report structure
  const reportContent = {
    reportType,
    dateRange,
    timestamp: new Date().toISOString(),
    content: null,
    summary: {
      title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
      description: '',
      count: 0,
      total: 0
    }
  };

  // Variables for custom and default cases
  let customData = [];
  let allData = [];
  let payoutTotal = 0;

  // Get the relevant data for the report type
  switch (reportType) {
    case 'revenue':
      reportContent.content = reportsData.revenue || [];
      reportContent.summary = {
        total: reportsData.revenue?.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) || 0,
        count: reportsData.revenue?.length || 0,
        title: 'Revenue Analysis Report',
        description: 'This report shows revenue data over time'
      };
      console.log("Revenue total:", reportContent.summary.total);
      break;
    case 'profitLoss':
      reportContent.content = reportsData.profit || [];
      reportContent.summary = {
        total: reportsData.profit?.reduce((sum, item) => sum + (Number(item.profit) || 0), 0) || 0,
        count: reportsData.profit?.length || 0,
        title: 'Profit & Loss Report',
        description: 'This report shows profit data over time'
      };
      console.log("Profit total:", reportContent.summary.total);
      break;
    case 'bookings':
      reportContent.content = reportsData.bookings || [];
      reportContent.summary = {
        total: reportsData.bookings?.reduce((sum, item) => sum + (Number(item.count) || 0), 0) || 0,
        count: reportsData.bookings?.length || 0,
        title: 'Bookings Report',
        description: 'This report shows booking data over time'
      };
      console.log("Bookings total:", reportContent.summary.total);
      break;
    case 'transactions':
      reportContent.content = reportsData.transactions || [];
      reportContent.summary = {
        total: reportsData.transactions?.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) || 0,
        count: reportsData.transactions?.length || 0,
        title: 'Transactions Report',
        description: 'This report shows transaction data over time'
      };
      console.log("Transactions total:", reportContent.summary.total);
      break;
    case 'users':
      reportContent.content = reportsData.users || [];
      reportContent.summary = {
        total: reportsData.users?.reduce((sum, item) => sum + (Number(item.newUsers) || 0), 0) || 0,
        count: reportsData.users?.length || 0,
        title: 'Users Report',
        description: 'This report shows user registration data over time'
      };
      console.log("Users total:", reportContent.summary.total);
      break;
    case 'yachts':
      reportContent.content = reportsData.yachts || [];
      reportContent.summary = {
        total: reportsData.yachts?.reduce((sum, item) => sum + (Number(item.price) || 0), 0) || 0,
        count: reportsData.yachts?.length || 0,
        title: 'Yachts Data Report',
        description: 'This report shows detailed yacht information'
      };
      break;
    case 'yachtOwners':
      reportContent.content = reportsData.yachtOwners || [];
      reportContent.summary = {
        total: reportsData.yachtOwners?.reduce((sum, item) => sum + (Number(item.payout) || 0), 0) || 0,
        count: reportsData.yachtOwners?.length || 0,
        title: 'Yacht Owners Report',
        description: 'This report shows yacht owner information'
      };
      break;
    case 'payouts': 
      reportContent.content = reportsData.payouts || [];
      payoutTotal = reportContent.content.reduce((sum, item) => sum + (Number(item.payout) || 0), 0);
      
      reportContent.summary = {
        total: payoutTotal,
        count: reportContent.content.length,
        title: 'Yacht Owners Payout Report',
        description: 'This report shows payout information for yacht owners'
      };
      console.log("Payouts total:", reportContent.summary.total);
      break;
    case 'recentBookings':
      reportContent.content = reportsData.recentBookings || [];
      reportContent.summary = {
        total: reportsData.recentBookings?.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) || 0,
        count: reportsData.recentBookings?.length || 0,
        title: 'Recent Bookings Report',
        description: 'This report shows recent booking information'
      };
      console.log("Recent Bookings total:", reportContent.summary.total);
      break;
    case 'custom':
      // For custom reports, use a more tabular structure for better export
      
      // Transform the data to make it more suitable for tabular display
      if (reportsData.revenue && reportsData.revenue.length > 0) {
        reportsData.revenue.forEach(item => {
          customData.push({
            type: 'Revenue',
            month: item.month,
            amount: item.amount,
            date: new Date().toISOString().split('T')[0] // Use current date as placeholder
          });
        });
      }
      
      if (reportsData.profit && reportsData.profit.length > 0) {
        reportsData.profit.forEach(item => {
          customData.push({
            type: 'Profit',
            month: item.month,
            amount: item.profit,
            date: new Date().toISOString().split('T')[0] // Use current date as placeholder
          });
        });
      }
      
      if (reportsData.bookings && reportsData.bookings.length > 0) {
        reportsData.bookings.forEach(item => {
          customData.push({
            type: 'Booking',
            date: item.date,
            count: item.count,
            amount: null
          });
        });
      }
      
      if (reportsData.transactions && reportsData.transactions.length > 0) {
        reportsData.transactions.forEach(item => {
          customData.push({
            type: 'Transaction',
            date: item.date,
            amount: item.amount,
            count: null
          });
        });
      }
      
      reportContent.content = customData;
      reportContent.summary = {
        title: 'Custom Combined Report',
        description: 'This report includes data from multiple sources',
        count: customData.length,
        total: customData.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
      };
      break;
    default:
      // If no specific type, collect all data in a structured format for reports
      
      if (reportsData.revenue && reportsData.revenue.length > 0) {
        reportsData.revenue.forEach(item => {
          allData.push({
            type: 'Revenue',
            month: item.month,
            amount: item.amount,
            date: item.date || new Date().toISOString().split('T')[0]
          });
        });
      }
      
      if (reportsData.profit && reportsData.profit.length > 0) {
        reportsData.profit.forEach(item => {
          allData.push({
            type: 'Profit',
            month: item.month,
            amount: item.profit,
            date: item.date || new Date().toISOString().split('T')[0]
          });
        });
      }
      
      if (reportsData.bookings && reportsData.bookings.length > 0) {
        reportsData.bookings.forEach(item => {
          allData.push({
            type: 'Booking',
            date: item.date,
            count: item.count
          });
        });
      }
      
      reportContent.content = allData;
      reportContent.summary = {
        title: 'Complete Data Report',
        description: 'This report contains all available data',
        count: allData.length,
        total: allData.reduce((sum, item) => sum + (Number(item.amount || 0)), 0)
      };
  }

  // Apply date range filtering if needed and if data has date field
  if (dateRange !== 'all' && Array.isArray(reportContent.content)) {
    const now = new Date();
    let startDate;
    let endDate = now;

    // Check if dateRange is an object (for custom date range)
    if (typeof dateRange === 'object' && dateRange.startDate && dateRange.endDate) {
      console.log("Using custom date range:", dateRange);
      startDate = new Date(dateRange.startDate);
      endDate = new Date(dateRange.endDate);
      // Set to end of day for the end date
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Handle predefined date ranges
      switch (dateRange) {
        case 'last24hours':
          startDate = new Date(now);
          startDate.setHours(startDate.getHours() - 24);
          break;
        case 'last7days':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'last30days':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 30);
          break;
        case 'lastQuarter':
          startDate = new Date(now);
          startDate.setMonth(startDate.getMonth() - 3);
          break;
        case 'ytd':
          startDate = new Date(now.getFullYear(), 0, 1); // Jan 1st of current year
          break;
        default:
          // No filtering
          startDate = null;
      }
    }

    if (startDate) {
      console.log(`Filtering data from ${startDate.toISOString()} to ${endDate.toISOString()}`);

      // Make a copy of the original content length for logging
      const originalLength = reportContent.content.length;

      const filteredContent = reportContent.content.filter(item => {
        let itemDate;
        
        // Look for different date fields based on the report type
        if (item.date) {
          itemDate = new Date(item.date);
        } else if (item.payoutDate) {
          itemDate = new Date(item.payoutDate);
        } else if (reportType === 'revenue' || reportType === 'profitLoss') {
          // Create a date from month field for revenue/profit reports if we have month
          if (item.month) {
            const monthMap = {
              'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
              'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
            };
            const monthIndex = monthMap[item.month];
            if (monthIndex !== undefined) {
              // Use current year for simplicity
              itemDate = new Date(now.getFullYear(), monthIndex, 15);
            }
          }
        }
        
        if (!itemDate) {
          return true; // Keep items without date
        }
        
        // Use timestamp comparison to avoid time-of-day issues
        return itemDate >= startDate && itemDate <= endDate;
      });
      
      console.log(`Filtered from ${originalLength} to ${filteredContent.length} items`);
      
      // Only set filtered content if there are results, otherwise keep original
      if (filteredContent.length > 0) {
        reportContent.content = filteredContent;
        
        // Update summary counts
        if (reportContent.summary) {
          reportContent.summary.count = filteredContent.length;
          
          // Recalculate totals based on report type
          if (reportContent.summary.total !== undefined) {
            let valueKey;
            switch(reportType) {
              case 'profitLoss':
                valueKey = 'profit';
                break;
              case 'bookings':
                valueKey = 'count';
                break;
              case 'users':
                valueKey = 'newUsers';
                break;
              case 'yachts':
                valueKey = 'price';
                break;
              case 'yachtOwners':
              case 'payouts':
                valueKey = 'payout';
                break;
              case 'recentBookings':
                valueKey = 'amount';
                break;
              default:
                valueKey = 'amount';
            }
            
            reportContent.summary.total = filteredContent.reduce(
              (sum, item) => sum + (Number(item[valueKey]) || 0), 0
            );
            
            console.log(`Recalculated ${reportType} total:`, reportContent.summary.total);
          }
        }
      } else {
        console.warn("Filtering resulted in empty data set. Using original data instead.");
      }
    }
  }

  return reportContent;
}; 