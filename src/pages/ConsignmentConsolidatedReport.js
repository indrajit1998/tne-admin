// import React, { useState, useEffect, useRef } from 'react';
// import { getConsignmentConsolidatedReport } from '../Services/Api';
// import './Styles/ConsignmentConsolidatedReport.css';

// const ConsignmentConsolidatedReport = () => {
//   const [consignments, setConsignments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [recordsPerPage, setRecordsPerPage] = useState(30);
//   const [copiedCell, setCopiedCell] = useState(null);
//   const tableContainerRef = useRef(null);

//   useEffect(() => {
//     fetchConsignmentData();
//   }, [currentPage]);

//   // Function to copy text to clipboard
//   const copyToClipboard = async (text, cellId) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       setCopiedCell(cellId);
//       // Clear the copied state after 2 seconds
//       setTimeout(() => setCopiedCell(null), 2000);
//     } catch (err) {
//       console.error('Failed to copy text: ', err);
//       // Fallback for older browsers
//       const textArea = document.createElement('textarea');
//       textArea.value = text;
//       document.body.appendChild(textArea);
//       textArea.select();
//       document.execCommand('copy');
//       document.body.removeChild(textArea);
//       setCopiedCell(cellId);
//       setTimeout(() => setCopiedCell(null), 2000);
//     }
//   };

//   useEffect(() => {
//     // Add horizontal scroll functionality with mouse wheel
//     const tableContainer = tableContainerRef.current;
//     if (!tableContainer) return;

//     const handleWheel = (e) => {
//       if (e.shiftKey) {
//         e.preventDefault();
//         const scrollAmount = e.deltaY || e.deltaX;
//         tableContainer.scrollLeft += scrollAmount;
//       }
//     };

//     tableContainer.addEventListener('wheel', handleWheel, { passive: false });

//     return () => {
//       tableContainer.removeEventListener('wheel', handleWheel);
//     };
//   }, []);

//   const getPageNumbers = () => {
//     const maxButtons = 3;
//     let start = Math.max(currentPage - 1, 1);
//     let end = Math.min(start + maxButtons - 1, totalPages);

//     // Adjust start if we're near the end
//     if (end - start < maxButtons - 1) {
//       start = Math.max(end - maxButtons + 1, 1);
//     }

//     const pages = [];
//     for (let i = start; i <= end; i++) {
//       pages.push(i);
//     }
//     return pages;
//   };

//   const fetchConsignmentData = async () => {
//     try {
//       setLoading(true);
//       const response = await getConsignmentConsolidatedReport(currentPage, recordsPerPage);
//       console.log('Consignment consolidated data received:', response);
//       console.log('Response structure:', {
//         hasData: !!response.data,
//         dataLength: response.data?.length,
//         isArray: Array.isArray(response),
//         responseKeys: Object.keys(response || {})
//       });
      
//       // Log first record if available
//       if (response.data && response.data.length > 0) {
//         console.log('First record sample:', response.data[0]);
//         console.log('First record keys:', Object.keys(response.data[0]));
//       }
      
//       // Handle the pagination structure
//       if (response.data && Array.isArray(response.data)) {
//         setConsignments(response.data);
//       } else if (Array.isArray(response)) {
//         setConsignments(response);
//       } else {
//         setConsignments([]);
//       }
      
//       // Set pagination info if available
//       if (response.pagination) {
//         setTotalPages(response.pagination.totalPages || 1);
//         setTotalRecords(response.pagination.totalRecords || response.pagination.total || 0);
//         setRecordsPerPage(response.pagination.recordsPerPage || 30);
//       } else {
//         // If no pagination info, calculate based on data length
//         setTotalPages(Math.ceil((Array.isArray(response.data || response) ? (response.data || response).length : 0) / recordsPerPage));
//         setTotalRecords(Array.isArray(response.data || response) ? (response.data || response).length : 0);
//       }
      
//       setError(null);
//     } catch (err) {
//       setError('Failed to fetch consignment data');
//       console.error('Error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredConsignments = consignments.filter(consignment => {
//     const matchesSearch = 
//       consignment['Consignment ID']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       consignment['Sender Name']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       consignment['Traveler Name']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       consignment['Recipient Name']?.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesStatus = filterStatus === 'all' || consignment['Consignment Status'] === filterStatus;
    
//     return matchesSearch && matchesStatus;
//   });

//   const exportToCSV = () => {
//     const headers = [
//       'Consignment ID',
//       'Consignment Status',
//       'Sender ID',
//       'Sender Name',
//       'Sender Mobile No',
//       'Sender Address',
//       'Total Amount Sender',
//       'Payment Status',
//       'Traveler Id',
//       'Traveler Acceptance Date',
//       'Traveler Name',
//       'Traveler Mobile No',
//       'Traveler Address',
//       'Amount to be paid to Traveler',
//       'Traveler Payment Status',
//       'Travel Mode',
//       'Travel Start Date',
//       'Travel End Date',
//       'Recipient Name',
//       'Recipient Address',
//       'Recipient Phone no',
//       'Received Date',
//       'T&E Amount',
//       'Tax Component'
//     ];

//     const csvContent = [
//       headers.join(','),
//       ...filteredConsignments.map(consignment => [
//         consignment['Consignment ID'] || '',
//         consignment['Consignment Status'] || '',
//         consignment['Sender ID'] || '',
//         `"${consignment['Sender Name'] || ''}"`,
//         consignment['Sender Mobile No'] || '',
//         `"${consignment['Sender Address'] || ''}"`,
//         consignment['Total Amount Sender'] || '',
//         consignment['Payment Status'] || '',
//         consignment['Traveler Id'] || '',
//         formatDate(consignment['Traveler Acceptance Date']) || '',
//         `"${consignment['Traveler Name'] || ''}"`,
//         consignment['Traveler Mobile No'] || '',
//         `"${consignment['Traveler Address'] || ''}"`,
//         consignment['Amount to be paid to Traveler'] || '',
//         consignment['Traveler Payment Status'] || '',
//         consignment['Travel Mode'] || '',
//         formatDate(consignment['Travel Start Date']) || '',
//         formatDate(consignment['Travel End Date']) || '',
//         `"${consignment['Recipient Name'] || ''}"`,
//         `"${consignment['Recipient Address'] || ''}"`,
//         consignment['Recipient Phone no'] || '',
//         formatDate(consignment['Received Date']) || '',
//         consignment['T&E Amount'] || '',
//         consignment['Tax Component'] || ''
//       ].join(','))
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', 'consignment_consolidated_report.csv');
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Format date to local timezone
//   const formatDate = (dateString) => {
//     if (!dateString || dateString === 'N/A') return 'N/A';
    
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return 'N/A';
      
//       return date.toLocaleString('en-IN', {
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit',
//         hour12: false
//       });
//     } catch (error) {
//       return 'N/A';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="consignment-report-container">
//         <div className="loading">Loading consignment data...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="consignment-report-container">
//         <div className="error">{error}</div>
//         <button onClick={fetchConsignmentData} className="retry-btn">Retry</button>
//       </div>
//     );
//   }

//   return (
//     <div className="consignment-report-container">
//       <div className="report-header">
//         <h1>Consignment Consolidated Report</h1>
//         <div className="header-controls">
//           <div className="search-filter-container">
//                          <input
//                type="text"
//                placeholder="Search by Consignment ID, Sender Name, Traveler Name, Recipient Name..."
//                value={searchTerm}
//                onChange={(e) => setSearchTerm(e.target.value)}
//                className="search-input"
//              />
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="status-filter"
//             >
//               <option value="all">All Status</option>
//               <option value="Pending">Pending</option>
//               <option value="Accepted">Accepted</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Completed">Completed</option>
//               <option value="Delivered">Delivered</option>
//               <option value="Cancelled">Cancelled</option>
//               <option value="Returned">Returned</option>
//               <option value="Lost">Lost</option>
//             </select>
//           </div>
//           <button onClick={exportToCSV} className="export-btn">
//             Export to CSV
//           </button>
//         </div>
//       </div>

//       <div className="summary-stats">
//         <div className="stat-card">
//           <h3>Total Records</h3>
//           <p>{totalRecords}</p>
//         </div>
//         <div className="stat-card">
//           <h3>Current Page</h3>
//           <p>{currentPage} of {totalPages}</p>
//         </div>
//         <div className="stat-card">
//           <h3>Records Per Page</h3>
//           <p>{recordsPerPage}</p>
//         </div>
//       </div>

//       <div className="table-container" ref={tableContainerRef}>
//         {/* <div className="scroll-hint">
//           <span>💡 Tip: Hold Shift + Mouse Wheel for horizontal scrolling</span>
//         </div> */}
//         <div className="table-wrapper">
//           <table className="consignment-table">
//             <thead>
//               <tr>
//                 <th>Consignment ID</th>
//                 <th>Consignment Status</th>
//                 <th>Sender ID</th>
//                 <th>Sender Name</th>
//                 <th>Sender Mobile No</th>
//                 <th>Sender Address</th>
//                 <th>Total Amount Sender</th>
//                 <th>Payment Status</th>
//                 <th>Traveler Id</th>
//                 <th>Traveler Acceptance Date</th>
//                 <th>Traveler Name</th>
//                 <th>Traveler Mobile No</th>
//                 <th>Traveler Address</th>
//                 <th>Amount to be paid to Traveler</th>
//                 <th>Traveler Payment Status</th>
//                 <th>Travel Mode</th>
//                 <th>Travel Start Date</th>
//                 <th>Travel End Date</th>
//                 <th>Recipient Name</th>
//                 <th>Recipient Address</th>
//                 <th>Recipient Phone no</th>
//                 <th>Received Date</th>
//                 <th>T&E Amount</th>
//                 <th>Tax Component</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredConsignments.length === 0 ? (
//                 <tr>
//                   <td colSpan="24" className="no-data">No consignment data available</td>
//                 </tr>
//               ) : (
//                 filteredConsignments.map((consignment, index) => (
//                   <tr key={consignment['Consignment ID'] || index}>
//                     <td 
//                       className={`copyable-cell ${copiedCell === `${index}-consignment-id` ? 'copied' : ''}`}
//                       title={consignment['Consignment ID'] || 'N/A'}
//                       onClick={() => copyToClipboard(consignment['Consignment ID'] || 'N/A', `${index}-consignment-id`)}
//                     >
//                       {consignment['Consignment ID'] || 'N/A'}
//                     </td>
//                     <td 
//                       className={`copyable-cell ${copiedCell === `${index}-status` ? 'copied' : ''}`}
//                       onClick={() => copyToClipboard(consignment['Consignment Status'] || 'N/A', `${index}-status`)}
//                     >
//                       <span 
//                         className={`status ${consignment['Consignment Status']?.toLowerCase() || 'unknown'}`}
//                         title={consignment['Consignment Status'] || 'N/A'}
//                       >
//                         {consignment['Consignment Status'] || 'N/A'}
//                       </span>
//                     </td>
//                     <td 
//                       className={`copyable-cell ${copiedCell === `${index}-sender-id` ? 'copied' : ''}`}
//                       title={consignment['Sender ID'] || 'N/A'}
//                       onClick={() => copyToClipboard(consignment['Sender ID'] || 'N/A', `${index}-sender-id`)}
//                     >
//                       {consignment['Sender ID'] || 'N/A'}
//                     </td>
//                     <td 
//                       className={`copyable-cell ${copiedCell === `${index}-sender-name` ? 'copied' : ''}`}
//                       title={consignment['Sender Name'] || 'N/A'}
//                       onClick={() => copyToClipboard(consignment['Sender Name'] || 'N/A', `${index}-sender-name`)}
//                     >
//                       {consignment['Sender Name'] || 'N/A'}
//                     </td>
//                     <td 
//                       className={`copyable-cell ${copiedCell === `${index}-sender-mobile` ? 'copied' : ''}`}
//                       title={consignment['Sender Mobile No'] || 'N/A'}
//                       onClick={() => copyToClipboard(consignment['Sender Mobile No'] || 'N/A', `${index}-sender-mobile`)}
//                     >
//                       {consignment['Sender Mobile No'] || 'N/A'}
//                     </td>
//                     <td 
//                       className={`copyable-cell ${copiedCell === `${index}-sender-address` ? 'copied' : ''}`}
//                       title={consignment['Sender Address'] || 'N/A'}
//                       onClick={() => copyToClipboard(consignment['Sender Address'] || 'N/A', `${index}-sender-address`)}
//                     >
//                       {consignment['Sender Address'] || 'N/A'}
//                     </td>
//                     <td 
//                       className={`copyable-cell ${copiedCell === `${index}-sender-amount` ? 'copied' : ''}`}
//                       title={`₹${Number(consignment['Total Amount Sender'] || 0).toFixed(2)}`}
//                       onClick={() => copyToClipboard(`₹${Number(consignment['Total Amount Sender'] || 0).toFixed(2)}`, `${index}-sender-amount`)}
//                     >
//                       ₹{Number(consignment['Total Amount Sender'] || 0).toFixed(2)}
//                     </td>
//                     <td 
//                       className={`copyable-cell ${copiedCell === `${index}-payment-status` ? 'copied' : ''}`}
//                       onClick={() => copyToClipboard(consignment['Payment Status'] || 'N/A', `${index}-payment-status`)}
//                     >
//                       <span 
//                         className={`payment ${consignment['Payment Status']?.toLowerCase() || 'unknown'}`}
//                         title={consignment['Payment Status'] || 'N/A'}
//                       >
//                         {consignment['Payment Status'] || 'N/A'}
//                       </span>
//                     </td>
//                     <td 
//                       className={`copyable-cell ${copiedCell === `${index}-traveler-id` ? 'copied' : ''}`}
//                       title={consignment['Traveler Id'] || 'N/A'}
//                       onClick={() => copyToClipboard(consignment['Traveler Id'] || 'N/A', `${index}-traveler-id`)}
//                     >
//                       {consignment['Traveler Id'] || 'N/A'}
//                     </td>
//                     <td 
//                       className={`copyable-cell ${copiedCell === `${index}-acceptance-date` ? 'copied' : ''}`}
//                       title={formatDate(consignment['Traveler Acceptance Date'])}
//                       onClick={() => copyToClipboard(formatDate(consignment['Traveler Acceptance Date']), `${index}-acceptance-date`)}
//                     >
//                       {formatDate(consignment['Traveler Acceptance Date'])}
//                     </td>
//                     <td 
//                       className={`copyable-cell ${copiedCell === `${index}-traveler-name` ? 'copied' : ''}`}
//                       title={consignment['Traveler Name'] || 'N/A'}
//                       onClick={() => copyToClipboard(consignment['Traveler Name'] || 'N/A', `${index}-traveler-name`)}
//                     >
//                       {consignment['Traveler Name'] || 'N/A'}
//                     </td>
//                     <td 
//                       className={`copyable-cell ${copiedCell === `${index}-traveler-mobile` ? 'copied' : ''}`}
//                       title={consignment['Traveler Mobile No'] || 'N/A'}
//                       onClick={() => copyToClipboard(consignment['Traveler Mobile No'] || 'N/A', `${index}-traveler-mobile`)}
//                     >
//                       {consignment['Traveler Mobile No'] || 'N/A'}
//                     </td>
//                     <td 
//                       className={`copyable-cell ${copiedCell === `${index}-traveler-address` ? 'copied' : ''}`}
//                       title={consignment['Traveler Address'] || 'N/A'}
//                       onClick={() => copyToClipboard(consignment['Traveler Address'] || 'N/A', `${index}-traveler-address`)}
//                     >
//                       {consignment['Traveler Address'] || 'N/A'}
//                     </td>
//                     <td 
//                       className={`copyable-cell ${copiedCell === `${index}-traveler-amount` ? 'copied' : ''}`}
//                       title={`₹${Number(consignment['Amount to be paid to Traveler'] || 0).toFixed(2)}`}
//                       onClick={() => copyToClipboard(`₹${Number(consignment['Amount to be paid to Traveler'] || 0).toFixed(2)}`, `${index}-traveler-amount`)}
//                     >
//                       ₹{Number(consignment['Amount to be paid to Traveler'] || 0).toFixed(2)}
//                     </td>
//                     <td 
//                       className={`copyable-cell ${copiedCell === `${index}-traveler-payment` ? 'copied' : ''}`}
//                       onClick={() => copyToClipboard(consignment['Traveler Payment Status'] || 'N/A', `${index}-traveler-payment`)}
//                     >
//                       <span 
//                         className={`payment ${consignment['Traveler Payment Status']?.toLowerCase() || 'unknown'}`}
//                         title={consignment['Traveler Payment Status'] || 'N/A'}
//                       >
//                         {consignment['Traveler Payment Status'] || 'N/A'}
//                       </span>
//                     </td>
//                     <td 
//                       className={`copyable-cell ${copiedCell === `${index}-travel-mode` ? 'copied' : ''}`}
//                       title={consignment['Travel Mode'] || 'N/A'}
//                       onClick={() => copyToClipboard(consignment['Travel Mode'] || 'N/A', `${index}-travel-mode`)}
//                     >
//                       {consignment['Travel Mode'] || 'N/A'}
//                     </td>
//                     <td 
//                       className={`copyable-cell ${copiedCell === `${index}-travel-start` ? 'copied' : ''}`}
//                       title={formatDate(consignment['Travel Start Date'])}
//                       onClick={() => copyToClipboard(formatDate(consignment['Travel Start Date']), `${index}-travel-start`)}
//                     >
//                       {formatDate(consignment['Travel Start Date'])}
//                     </td>
//                     <td 
//                       className={`copyable-cell ${copiedCell === `${index}-travel-end` ? 'copied' : ''}`}
//                       title={formatDate(consignment['Travel End Date'])}
//                       onClick={() => copyToClipboard(formatDate(consignment['Travel End Date']), `${index}-travel-end`)}
//                     >
//                       {formatDate(consignment['Travel End Date'])}
//                     </td>
//                     <td 
//                       className={`copyable-cell ${copiedCell === `${index}-recipient-name` ? 'copied' : ''}`}
//                       title={consignment['Recipient Name'] || 'N/A'}
//                       onClick={() => copyToClipboard(consignment['Recipient Name'] || 'N/A', `${index}-recipient-name`)}
//                     >
//                       {consignment['Recipient Name'] || 'N/A'}
//                     </td>
//                     <td 
//                       className={`copyable-cell ${copiedCell === `${index}-recipient-address` ? 'copied' : ''}`}
//                       title={consignment['Recipient Address'] || 'N/A'}
//                       onClick={() => copyToClipboard(consignment['Recipient Address'] || 'N/A', `${index}-recipient-address`)}
//                     >
//                       {consignment['Recipient Address'] || 'N/A'}
//                     </td>
//                     <td 
//                       className={`copyable-cell ${copiedCell === `${index}-recipient-phone` ? 'copied' : ''}`}
//                       title={consignment['Recipient Phone no'] || 'N/A'}
//                       onClick={() => copyToClipboard(consignment['Recipient Phone no'] || 'N/A', `${index}-recipient-phone`)}
//                     >
//                       {consignment['Recipient Phone no'] || 'N/A'}
//                     </td>
//                     <td 
//                       className={`copyable-cell ${copiedCell === `${index}-received-date` ? 'copied' : ''}`}
//                       title={formatDate(consignment['Received Date'])}
//                       onClick={() => copyToClipboard(formatDate(consignment['Received Date']), `${index}-received-date`)}
//                     >
//                       {formatDate(consignment['Received Date'])}
//                     </td>
//                     <td 
//                       className={`copyable-cell ${copiedCell === `${index}-te-amount` ? 'copied' : ''}`}
//                       title={`₹${Number(consignment['T&E Amount'] || 0).toFixed(2)}`}
//                       onClick={() => copyToClipboard(`₹${Number(consignment['T&E Amount'] || 0).toFixed(2)}`, `${index}-te-amount`)}
//                     >
//                       ₹{Number(consignment['T&E Amount'] || 0).toFixed(2)}
//                     </td>
//                     <td 
//                       className={`copyable-cell ${copiedCell === `${index}-tax-component` ? 'copied' : ''}`}
//                       title={`₹${Number(consignment['Tax Component'] || 0).toFixed(2)}`}
//                       onClick={() => copyToClipboard(`₹${Number(consignment['Tax Component'] || 0).toFixed(2)}`, `${index}-tax-component`)}
//                     >
//                       ₹{Number(consignment['Tax Component'] || 0).toFixed(2)}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Pagination */}
//       <div className="pagination">
//         <div className="page-controls">
//           <button
//             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//           >
//             «
//           </button>

//           {getPageNumbers().map((page) => (
//             <button
//               key={page}
//               className={`${currentPage === page ? "page-controls active-page" : ""}`}
//               onClick={() => setCurrentPage(page)}
//             >
//               {page}
//             </button>
//           ))}

//           <button
//             onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//           >
//             »
//           </button>
//         </div>
//         <div className="pagination-info">
//           Showing page {currentPage} of {totalPages} ({totalRecords} total records)
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConsignmentConsolidatedReport; 

import React, { useState, useEffect, useRef, useMemo } from 'react';
// CHANGED: Make sure to import the new function from your Api.js file
import { getConsolidatedReportData } from '../Services/Api';
import './Styles/ConsignmentConsolidatedReport.css';

const ConsignmentConsolidatedReport = () => {
  // STATE MANAGEMENT
  const [allConsignments, setAllConsignments] = useState([]); // Holds all data from API
  const [consignments, setConsignments] = useState([]); // Holds data for the current page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [recordsPerPage] = useState(30); // Kept for pagination logic
  const [copiedCell, setCopiedCell] = useState(null);
  const tableContainerRef = useRef(null);

  // DATA FETCHING
  useEffect(() => {
    const fetchConsignmentData = async () => {
      try {
        setLoading(true);
        const response = await getConsolidatedReportData();
        console.log('Consolidated data received:', response);
        
        setAllConsignments(response.data || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch consignment data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConsignmentData();
  }, []); // Runs only once on component mount

  // CLIENT-SIDE FILTERING, SEARCHING, and PAGINATION
  useEffect(() => {
    let filteredData = allConsignments;

    // Filter by status
    if (filterStatus !== 'all') {
      filteredData = filteredData.filter(item => item.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      filteredData = filteredData.filter(item => {
        const senderName = `${item.consignmentId?.senderId?.firstName || ''} ${item.consignmentId?.senderId?.lastName || ''}`.toLowerCase();
        const travellerName = `${item.travellerId?.firstName || ''} ${item.travellerId?.lastName || ''}`.toLowerCase();
        
        return (
          item.consignmentId?._id?.toLowerCase().includes(lowercasedSearchTerm) ||
          senderName.includes(lowercasedSearchTerm) ||
          travellerName.includes(lowercasedSearchTerm)
        );
      });
    }

    // Update total records and pages based on filtered data
    setTotalRecords(filteredData.length);
    setTotalPages(Math.ceil(filteredData.length / recordsPerPage));

    // Slice the data for the current page
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    setConsignments(filteredData.slice(startIndex, endIndex));

  }, [allConsignments, currentPage, searchTerm, filterStatus, recordsPerPage]);


  // HELPER FUNCTIONS
  const getPageNumbers = () => {
    const maxButtons = 3;
    let start = Math.max(currentPage - 1, 1);
    let end = Math.min(start + maxButtons - 1, totalPages);
    if (end - start < maxButtons - 1) {
      start = Math.max(end - maxButtons + 1, 1);
    }
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
    } catch (error) {
      return 'N/A';
    }
  };

  const copyToClipboard = async (text, cellId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCell(cellId);
      setTimeout(() => setCopiedCell(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // CSV EXPORT
  const exportToCSV = () => {
    // NOTE: Headers and data mapping are updated for the new structure
    const headers = [
      'Carry Request ID', 'Carry Request Status', 'Carry Request Date',
      'Consignment ID', 'Consignment Status', 'Consignment Date',
      'Sender ID', 'Sender Name', 'Sender Phone',
      'Traveller ID', 'Traveller Name', 'Traveller Phone',
      'Sender Pay Amount', 'Traveller Earning'
    ];
    
    const csvContent = [
      headers.join(','),
      ...allConsignments.map(item => { // Export all filtered data, not just the current page
        const senderName = `${item.consignmentId?.senderId?.firstName || ''} ${item.consignmentId?.senderId?.lastName || ''}`;
        const travellerName = `${item.travellerId?.firstName || ''} ${item.travellerId?.lastName || ''}`;
        return [
          item._id || '',
          item.status || '',
          formatDate(item.createdAt) || '',
          item.consignmentId?._id || '',
          item.consignmentId?.status || '',
          formatDate(item.consignmentId?.createdAt) || '',
          item.consignmentId?.senderId?._id || '',
          `"${senderName}"`,
          item.consignmentId?.senderId?.phoneNumber || '',
          item.travellerId?._id || '',
          `"${travellerName}"`,
          item.travellerId?.phoneNumber || '',
          item.senderPayAmount || 0,
          item.travellerEarning || 0
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'consolidated_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // RENDER LOGIC
  if (loading) return <div className="consignment-report-container"><div className="loading">Loading...</div></div>;
  if (error) return <div className="consignment-report-container"><div className="error">{error}</div></div>;

  return (
    <div className="consignment-report-container">
      <div className="report-header">
        <h1>Consolidated Report</h1>
        <div className="header-controls">
          <div className="search-filter-container">
            <input
              type="text"
              placeholder="Search by ID, Sender, Traveller..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} // Reset to page 1 on search
              className="search-input"
            />
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }} // Reset to page 1 on filter
              className="status-filter"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <button onClick={exportToCSV} className="export-btn">Export to CSV</button>
        </div>
      </div>

      <div className="summary-stats">
        <div className="stat-card"><h3>Total Records</h3><p>{totalRecords}</p></div>
        <div className="stat-card"><h3>Current Page</h3><p>{totalPages > 0 ? `${currentPage} of ${totalPages}` : '0 of 0'}</p></div>
        <div className="stat-card"><h3>Records Per Page</h3><p>{recordsPerPage}</p></div>
      </div>

      <div className="table-container" ref={tableContainerRef}>
        <div className="table-wrapper">
          <table className="consignment-table">
            {/* CHANGED: Simplified headers based on available data */}
            <thead>
              <tr>
                <th>Consignment ID</th>
                <th>Consignment Status</th>
                <th>Sender Name</th>
                <th>Sender Phone</th>
                <th>Traveller Name</th>
                <th>Traveller Phone</th>
                <th>Carry Request Status</th>
                <th>Request Date</th>
                <th>Sender Pays</th>
                <th>Traveller Earns</th>
              </tr>
            </thead>
            <tbody>
              {consignments.length === 0 ? (
                <tr><td colSpan="10" className="no-data">No data available</td></tr>
              ) : (
                consignments.map((item, index) => {
                  const sender = item.consignmentId?.senderId;
                  const traveller = item.travellerId;
                  const consignment = item.consignmentId;
                  const senderName = `${sender?.firstName || ''} ${sender?.lastName || ''}`;
                  const travellerName = `${traveller?.firstName || ''} ${traveller?.lastName || ''}`;

                  return (
                    // CHANGED: Data mapping now uses the new nested structure
                    <tr key={item._id || index}>
                      <td title={consignment?._id} onClick={() => copyToClipboard(consignment?._id, `${index}-cid`)} className={`copyable-cell ${copiedCell === `${index}-cid` ? 'copied' : ''}`}>{consignment?._id || 'N/A'}</td>
                      <td><span className={`status ${consignment?.status || 'unknown'}`}>{consignment?.status || 'N/A'}</span></td>
                      <td title={senderName} onClick={() => copyToClipboard(senderName, `${index}-sname`)} className={`copyable-cell ${copiedCell === `${index}-sname` ? 'copied' : ''}`}>{senderName}</td>
                      <td title={sender?.phoneNumber} onClick={() => copyToClipboard(sender?.phoneNumber, `${index}-sphone`)} className={`copyable-cell ${copiedCell === `${index}-sphone` ? 'copied' : ''}`}>{sender?.phoneNumber || 'N/A'}</td>
                      <td title={travellerName} onClick={() => copyToClipboard(travellerName, `${index}-tname`)} className={`copyable-cell ${copiedCell === `${index}-tname` ? 'copied' : ''}`}>{travellerName}</td>
                      <td title={traveller?.phoneNumber} onClick={() => copyToClipboard(traveller?.phoneNumber, `${index}-tphone`)} className={`copyable-cell ${copiedCell === `${index}-tphone` ? 'copied' : ''}`}>{traveller?.phoneNumber || 'N/A'}</td>
                      <td><span className={`status ${item.status || 'unknown'}`}>{item.status || 'N/A'}</span></td>
                      <td>{formatDate(item.createdAt)}</td>
                      <td>₹{Number(item.senderPayAmount || 0).toFixed(2)}</td>
                      <td>₹{Number(item.travellerEarning || 0).toFixed(2)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pagination">
        <div className="page-controls">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>«</button>
          {getPageNumbers().map(page => <button key={page} className={currentPage === page ? "active-page" : ""} onClick={() => setCurrentPage(page)}>{page}</button>)}
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0}>»</button>
        </div>
        <div className="pagination-info">Showing page {currentPage} of {totalPages} ({totalRecords} total records)</div>
      </div>
    </div>
  );
};

export default ConsignmentConsolidatedReport;