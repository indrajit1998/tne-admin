// import React, { useState, useEffect } from 'react';
// import { getTravelerReport, getTravelerConsignmentDetails } from '../Services/Api';
// import './Styles/TravelerReport.css';

// const Box = ({ children, sx, ...props }) => <div style={sx} {...props}>{children}</div>;
// const Typography = ({ variant, children, sx, ...props }) => {
//   const styles = {
//     h4: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' },
//     h6: { fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' },
//     subtitle2: { fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' },
//     body2: { fontSize: '0.875rem' },
//     caption: { fontSize: '0.75rem', color: '#666' }
//   };
//   return <div style={{ ...styles[variant], ...sx }} {...props}>{children}</div>;
// };
// const Chip = ({ label, color, variant, size, sx, ...props }) => {
//   const colorStyles = {
//     success: { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' },
//     warning: { backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeaa7' },
//     error: { backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' },
//     primary: { backgroundColor: '#e3f2fd', color: '#1976d2', border: '1px solid #bbdefb' },
//     default: { backgroundColor: '#e2e3e5', color: '#383d41', border: '1px solid #d6d8db' }
//   };
//   const sizeStyles = {
//     small: { padding: '2px 8px', fontSize: '0.75rem' },
//     medium: { padding: '4px 12px', fontSize: '0.875rem' }
//   };
//   return (
//     <span 
//       style={{ 
//         display: 'inline-block',
//         padding: '4px 8px',
//         borderRadius: '4px',
//         fontSize: '0.75rem',
//         fontWeight: '500',
//         ...colorStyles[color] || colorStyles.default,
//         ...sizeStyles[size] || sizeStyles.medium,
//         ...sx
//       }} 
//       {...props}
//     >
//       {label}
//     </span>
//   );
// };
// const CircularProgress = () => (
//   <div style={{ 
//     display: 'flex', 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     minHeight: '400px' 
//   }}>
//     <div style={{
//       width: '40px',
//       height: '40px',
//       border: '4px solid #f3f3f3',
//       borderTop: '4px solid #4a90e2',
//       borderRadius: '50%',
//       animation: 'spin 1s linear infinite'
//     }}></div>
//   </div>
// );
// const Alert = ({ severity, children, sx, ...props }) => {
//   const severityStyles = {
//     error: { backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' },
//     warning: { backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeaa7' },
//     info: { backgroundColor: '#d1ecf1', color: '#0c5460', border: '1px solid #bee5eb' },
//     success: { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' }
//   };
//   return (
//     <div 
//       style={{ 
//         padding: '12px 16px', 
//         borderRadius: '4px', 
//         marginBottom: '16px',
//         ...severityStyles[severity],
//         ...sx
//       }} 
//       {...props}
//     >
//       {children}
//     </div>
//   );
// };

// const TravelerReport = () => {
//   const [travelers, setTravelers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedConsignments, setSelectedConsignments] = useState([]);
//   const [selectedTraveler, setSelectedTraveler] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [copiedCell, setCopiedCell] = useState(null);
//   const [modalCopiedCell, setModalCopiedCell] = useState(null);
//   const [loadingDetails, setLoadingDetails] = useState(false);
//   const recordsPerPage = 30;

//   useEffect(() => {
//     fetchTravelerData();
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

//   // Function to copy text to clipboard for modal
//   const copyModalToClipboard = async (text, cellId) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       setModalCopiedCell(cellId);
//       // Clear the copied state after 2 seconds
//       setTimeout(() => setModalCopiedCell(null), 2000);
//     } catch (err) {
//       console.error('Failed to copy text: ', err);
//       // Fallback for older browsers
//       const textArea = document.createElement('textarea');
//       textArea.value = text;
//       document.body.appendChild(textArea);
//       textArea.select();
//       document.execCommand('copy');
//       document.body.removeChild(textArea);
//       setModalCopiedCell(cellId);
//       setTimeout(() => setModalCopiedCell(null), 2000);
//     }
//   };

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

//   const fetchTravelerData = async () => {
//     try {
//       setLoading(true);
//       const response = await getTravelerReport(currentPage, recordsPerPage);
//       console.log('Traveler data received:', response);
      
//       // Handle the backend response structure with data and pagination
//       const data = response.data || response;
//       console.log('Processed data:', data);
      
//       if (Array.isArray(data) && data.length > 0) {
//         console.log('First traveler record keys:', Object.keys(data[0]));
//         console.log('Sample traveler record:', {
//           travelerId: data[0]['Traveler Id'],
//           name: data[0]['Name'],
//           phoneNo: data[0]['Phone No'],
//           address: data[0]['Address'],
//           noOfTravels: data[0]['No of Travels'],
//           noOfConsignments: data[0]['No of Consignments'],
//           totalAmount: data[0]['Total Amount'],
//           status: data[0]['Status of Consignments'],
//           payment: data[0]['Payment']
//         });
//       }
      
//       setTravelers(Array.isArray(data) ? data : []);
      
//       // Set pagination info if available
//       if (response.pagination) {
//         setTotalPages(response.pagination.totalPages || 1);
//         setTotalRecords(response.pagination.totalRecords || 0);
//       } else {
//         // If no pagination info, calculate based on data length
//         setTotalPages(Math.ceil((Array.isArray(data) ? data.length : 0) / recordsPerPage));
//         setTotalRecords(Array.isArray(data) ? data.length : 0);
//       }
      
//       setError(null);
//     } catch (err) {
//       setError('Failed to fetch traveler data');
//       console.error('Error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Get status color for chips
//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'payment completed':
//       case 'paid':
//       case 'delivered':
//       case 'successful':
//       case 'completed':
//         return 'success';
//       case 'payment pending':
//       case 'pending':
//       case 'in progress':
//         return 'warning';
//       case 'no consignments':
//       case 'cancelled':
//       case 'failed':
//         return 'error';
//       default:
//         return 'default';
//     }
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     if (!amount || amount === 0) return '₹0.00';
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR'
//     }).format(amount);
//   };

//   const handleConsignmentClick = async (travelerPhone, travelerName) => {
//     setLoadingDetails(true);
//     setSelectedTraveler({ phone: travelerPhone, name: travelerName });
    
//     try {
//       const detailsResponse = await getTravelerConsignmentDetails(travelerPhone);
//       console.log('Consignment details received:', detailsResponse);
      
//       const consignments = detailsResponse.data || [];
//       setSelectedConsignments(consignments);
//       setShowModal(true);
//     } catch (err) {
//       console.error('Error fetching consignment details:', err);
//       setSelectedConsignments([]);
//       setShowModal(true);
//     } finally {
//       setLoadingDetails(false);
//     }
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedConsignments([]);
//     setSelectedTraveler(null);
//   };

//   const filteredTravelers = travelers.filter(traveler => {
//     const nameValue = traveler['Name'] || '';
//     const address = traveler['Address'] || '';
    
//     const matchesSearch = 
//       traveler['Traveler Id']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       nameValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       traveler['Phone No']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       address.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesStatus = filterStatus === 'all' || traveler['Status of Consignments'] === filterStatus;
    
//     return matchesSearch && matchesStatus;
//   });

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

//   const exportToCSV = () => {
//     const headers = [
//       'Traveler Id',
//       'Name',
//       'Phone No',
//       'Address',
//       'No of Travels',
//       'No of Consignments',
//       'Total Amount',
//       'Status of Consignments',
//       'Payment'
//     ];

//     const csvContent = [
//       headers.join(','),
//       ...filteredTravelers.map(traveler => {
//         return [
//           traveler['Traveler Id'] || '',
//           `"${traveler['Name'] || ''}"`,
//           traveler['Phone No'] || '',
//           `"${traveler['Address'] || ''}"`,
//           traveler['No of Travels'] || 0,
//           traveler['No of Consignments'] || 0,
//           Number(traveler['Total Amount'] || 0).toFixed(2),
//           traveler['Status of Consignments'] || '',
//           traveler['Payment'] || ''
//         ].join(',');
//       })
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', 'traveler_report.csv');
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   if (loading) {
//     return (
//       <div className="traveler-report-container">
//         <CircularProgress />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="traveler-report-container">
//         <Alert severity="error">{error}</Alert>
//         <button onClick={fetchTravelerData} className="retry-btn">Retry</button>
//       </div>
//     );
//   }

//   return (
//     <div className="traveler-report-container">
//       <div className="report-header">
//         <Typography variant="h4">Traveler Report</Typography>
//         <div className="header-controls">
//           <div className="search-filter-container">
//             <input
//               type="text"
//               placeholder="Search by ID, name, phone, address..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="search-input"
//             />
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="status-filter"
//             >
//               <option value="all">All Status</option>
//               <option value="Payment Completed">Payment Completed</option>
//               <option value="Payment Pending">Payment Pending</option>
//               <option value="No Consignments">No Consignments</option>
//             </select>
//           </div>
//           <button onClick={exportToCSV} className="export-btn">
//             Export to CSV
//           </button>
//         </div>
//       </div>

//       <div className="summary-stats">
//         <div className="stat-card">
//           <Typography variant="subtitle2">Total Travelers</Typography>
//           <Typography variant="h6">{totalRecords}</Typography>
//         </div>
//         <div className="stat-card">
//           <Typography variant="subtitle2">Current Page</Typography>
//           <Typography variant="h6">{currentPage} of {totalPages}</Typography>
//         </div>
//         <div className="stat-card">
//           <Typography variant="subtitle2">Records Per Page</Typography>
//           <Typography variant="h6">{recordsPerPage}</Typography>
//         </div>
//       </div>

//       <div className="table-container">
//         <table className="traveler-table">
//           <thead>
//             <tr>
//               <th>Traveler ID</th>
//               <th>Name</th>
//               <th>Phone No</th>
//               {/* <th>Address</th> */}
//               <th>No of Travels</th>
//               <th>No of Consignments</th>
//               <th>Total Amount</th>
//               <th>Status of Consignments</th>
//              {/* <th>Payment</th> */}
//             </tr>
//           </thead>
//           <tbody>
//             {filteredTravelers.length === 0 ? (
//               <tr>
//                 <td colSpan="9" className="no-data">No traveler data available</td>
//               </tr>
//             ) : (
//               filteredTravelers.map((traveler, index) => (
//                 <tr key={traveler['Traveler Id'] || index}>
//                   <td 
//                     className={`id-cell copyable-cell ${copiedCell === `${index}-id` ? 'copied' : ''}`}
//                     title={traveler['Traveler Id'] || 'N/A'}
//                     onClick={() => copyToClipboard(traveler['Traveler Id'] || 'N/A', `${index}-id`)}
//                   >
//                     {traveler['Traveler Id'] || 'N/A'}
//                   </td>
//                   <td 
//                     className={`large-value copyable-cell ${copiedCell === `${index}-name` ? 'copied' : ''}`}
//                     title={traveler['Name'] || 'N/A'}
//                     onClick={() => copyToClipboard(traveler['Name'] || 'N/A', `${index}-name`)}
//                   >
//                     {traveler['Name'] || 'N/A'}
//                   </td>
//                   <td 
//                     className={`phone-cell copyable-cell ${copiedCell === `${index}-phone` ? 'copied' : ''}`}
//                     title={traveler['Phone No'] || 'N/A'}
//                     onClick={() => copyToClipboard(traveler['Phone No'] || 'N/A', `${index}-phone`)}
//                   >
//                     {traveler['Phone No'] || 'N/A'}
//                   </td>
//                   {/* <td 
//                     className={`address-cell copyable-cell ${copiedCell === `${index}-address` ? 'copied' : ''}`}
//                     title={traveler['Address'] || 'N/A'}
//                     onClick={() => copyToClipboard(traveler['Address'] || 'N/A', `${index}-address`)}
//                   >
//                     {traveler['Address'] || 'N/A'}
//                   </td> */}
//                   <td 
//                     className={`copyable-cell ${copiedCell === `${index}-travels` ? 'copied' : ''}`}
//                     title={traveler['No of Travels'] || 0}
//                     onClick={() => copyToClipboard(String(traveler['No of Travels'] || 0), `${index}-travels`)}
//                   >
//                     {traveler['No of Travels'] || 0}
//                   </td>
//                   <td 
//                     className={`consignment-count-cell ${copiedCell === `${index}-consignment-count` ? 'copied' : ''}`}
//                     title={`Click to view ${traveler['No of Consignments'] || 0} consignments`}
//                     onClick={() => handleConsignmentClick(traveler['Phone No'], traveler['Name'])}
//                   >
//                     <Chip 
//                       label={traveler['No of Consignments'] || 0}
//                       color="primary"
//                       variant="outlined"
//                       size="small"
//                     />
//                   </td>
//                   <td 
//                     className={`amount-cell copyable-cell ${copiedCell === `${index}-amount` ? 'copied' : ''}`}
//                     title={formatCurrency(traveler['Total Amount'])}
//                     onClick={() => {
//                       const amount = Number(traveler['Total Amount'] || 0);
//                       copyToClipboard(formatCurrency(amount), `${index}-amount`);
//                     }}
//                   >
//                     {formatCurrency(traveler['Total Amount'])}
//                   </td>
//                    <td 
//                     className={`copyable-cell ${copiedCell === `${index}-status` ? 'copied' : ''}`}
//                     title={traveler['Status of Consignments'] || 'N/A'}
//                     onClick={() => copyToClipboard(traveler['Status of Consignments'] || 'N/A', `${index}-status`)}
//                   >
//                     <Chip 
//                       label={traveler['Status of Consignments'] || 'N/A'}
//                       color={getStatusColor(traveler['Status of Consignments'])}
//                       size="small"
//                     />
//                   </td>
//                  {/* <td 
//                     className={`copyable-cell ${copiedCell === `${index}-payment` ? 'copied' : ''}`}
//                     title={traveler['Payment'] || 'N/A'}
//                     onClick={() => copyToClipboard(traveler['Payment'] || 'N/A', `${index}-payment`)}
//                   >
//                     <Chip 
//                       label={traveler['Payment'] || 'N/A'}
//                       color={getStatusColor(traveler['Payment'])}
//                       size="small"
//                     />
//                   </td> */}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
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

//       {/* Modal for consignment details */}
//       {showModal && (
//         <div className="modal-overlay show" onClick={closeModal}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <Typography variant="h6">
//                 Consignment Details for {selectedTraveler?.name || 'Traveler'}
//               </Typography>
//               <button className="close-btn" onClick={closeModal}>×</button>
//             </div>
//             <div className="modal-body">
//               {loadingDetails ? (
//                 <div className="loading-details">
//                   <CircularProgress />
//                   <Typography variant="body2">Loading consignment details...</Typography>
//                 </div>
//               ) : selectedConsignments.length === 0 ? (
//                 <div className="no-consignments-message">
//                   <Typography variant="body2">No consignment details available for this traveler.</Typography>
//                 </div>
//               ) : (
//                 <div>
//                   <div className="consignment-summary">
//                     <div>
//                       <Typography variant="subtitle2">Total Consignments</Typography>
//                       <Typography variant="h6">{selectedConsignments.length}</Typography>
//                     </div>
//                     <div>
//                       <Typography variant="subtitle2">Total Earnings</Typography>
//                       <Typography variant="h6">{formatCurrency(selectedConsignments.reduce((sum, c) => sum + (c.earnings || 0), 0))}</Typography>
//                     </div>
//                   </div>
//                   <div className="table-container">
//                     <table className="consignment-modal-table">
//                       <thead>
//                         <tr>
//                           <th>Consignment ID</th>
//                           <th>Status</th>
//                           <th>Payment Status</th>
//                           <th>Weight</th>
//                           <th>Dimensions</th>
//                           <th>Pickup</th>
//                           <th>Drop</th>
//                           <th>Travel Mode</th>
//                           <th>Travel Date</th>
//                           <th>Earnings</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {selectedConsignments.map((consignment, index) => (
//                           <tr key={consignment.consignmentId || index}>
//                             <td 
//                               className={`copyable-cell ${modalCopiedCell === `modal-${index}-id` ? 'copied' : ''}`}
//                               title={consignment.consignmentId || 'N/A'}
//                               onClick={() => copyModalToClipboard(consignment.consignmentId || 'N/A', `modal-${index}-id`)}
//                             >
//                               {consignment.consignmentId || 'N/A'}
//                             </td>
//                             <td 
//                               className={`copyable-cell ${modalCopiedCell === `modal-${index}-status` ? 'copied' : ''}`}
//                               title={consignment.status || 'N/A'}
//                               onClick={() => copyModalToClipboard(consignment.status || 'N/A', `modal-${index}-status`)}
//                             >
//                               <Chip 
//                                 label={consignment.status || 'N/A'}
//                                 color={getStatusColor(consignment.status)}
//                                 size="small"
//                               />
//                             </td>
//                             <td 
//                               className={`copyable-cell ${modalCopiedCell === `modal-${index}-payment` ? 'copied' : ''}`}
//                               title={consignment.paymentStatus || 'N/A'}
//                               onClick={() => copyModalToClipboard(consignment.paymentStatus || 'N/A', `modal-${index}-payment`)}
//                             >
//                               <Chip 
//                                 label={consignment.paymentStatus || 'N/A'}
//                                 color={getStatusColor(consignment.paymentStatus)}
//                                 size="small"
//                               />
//                             </td>
//                             <td 
//                               className={`copyable-cell ${modalCopiedCell === `modal-${index}-weight` ? 'copied' : ''}`}
//                               title={consignment.weight || 'N/A'}
//                               onClick={() => copyModalToClipboard(consignment.weight || 'N/A', `modal-${index}-weight`)}
//                             >
//                               {consignment.weight || 'N/A'}
//                             </td>
//                             <td 
//                               className={`copyable-cell ${modalCopiedCell === `modal-${index}-dimensions` ? 'copied' : ''}`}
//                               title={consignment.dimensions || 'N/A'}
//                               onClick={() => copyModalToClipboard(consignment.dimensions || 'N/A', `modal-${index}-dimensions`)}
//                             >
//                               {consignment.dimensions || 'N/A'}
//                             </td>
//                             <td 
//                               className={`copyable-cell ${modalCopiedCell === `modal-${index}-pickup` ? 'copied' : ''}`}
//                               title={consignment.pickup || 'N/A'}
//                               onClick={() => copyModalToClipboard(consignment.pickup || 'N/A', `modal-${index}-pickup`)}
//                             >
//                               {consignment.pickup || 'N/A'}
//                             </td>
//                             <td 
//                               className={`copyable-cell ${modalCopiedCell === `modal-${index}-drop` ? 'copied' : ''}`}
//                               title={consignment.drop || 'N/A'}
//                               onClick={() => copyModalToClipboard(consignment.drop || 'N/A', `modal-${index}-drop`)}
//                             >
//                               {consignment.drop || 'N/A'}
//                             </td>
//                             <td 
//                               className={`copyable-cell ${modalCopiedCell === `modal-${index}-mode` ? 'copied' : ''}`}
//                               title={consignment.travelMode || 'N/A'}
//                               onClick={() => copyModalToClipboard(consignment.travelMode || 'N/A', `modal-${index}-mode`)}
//                             >
//                               {consignment.travelMode || 'N/A'}
//                             </td>
//                             <td 
//                               className={`copyable-cell ${modalCopiedCell === `modal-${index}-date` ? 'copied' : ''}`}
//                               title={consignment.travelDate || 'N/A'}
//                               onClick={() => copyModalToClipboard(consignment.travelDate || 'N/A', `modal-${index}-date`)}
//                             >
//                               {consignment.travelDate || 'N/A'}
//                             </td>
//                             <td 
//                               className={`copyable-cell amount-cell ${modalCopiedCell === `modal-${index}-earnings` ? 'copied' : ''}`}
//                               title={formatCurrency(consignment.earnings)}
//                               onClick={() => copyModalToClipboard(formatCurrency(consignment.earnings), `modal-${index}-earnings`)}
//                             >
//                               {formatCurrency(consignment.earnings)}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TravelerReport; 





import React, { useState, useEffect } from 'react';
import { getTravelerReport, getTravelerConsignmentDetails,cancelTravelById } from '../Services/Api';
import './Styles/TravelerReport.css';

const Box = ({ children, sx, ...props }) => <div style={sx} {...props}>{children}</div>;
const Typography = ({ variant, children, sx, ...props }) => {
  const styles = {
    h4: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' },
    h6: { fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' },
    subtitle2: { fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' },
    body2: { fontSize: '0.875rem' },
    caption: { fontSize: '0.75rem', color: '#666' }
  };
  return <div style={{ ...styles[variant], ...sx }} {...props}>{children}</div>;
};
const Chip = ({ label, color, variant, size, sx, ...props }) => {
  const colorStyles = {
    success: { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' },
    warning: { backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeaa7' },
    error: { backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' },
    primary: { backgroundColor: '#e3f2fd', color: '#1976d2', border: '1px solid #bbdefb' },
    default: { backgroundColor: '#e2e3e5', color: '#383d41', border: '1px solid #d6d8db' }
  };
  const sizeStyles = {
    small: { padding: '2px 8px', fontSize: '0.75rem' },
    medium: { padding: '4px 12px', fontSize: '0.875rem' }
  };
  return (
    <span 
      style={{ 
        display: 'inline-block',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: '500',
        ...colorStyles[color] || colorStyles.default,
        ...sizeStyles[size] || sizeStyles.medium,
        ...sx
      }} 
      {...props}
    >
      {label}
    </span>
  );
};
const CircularProgress = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
    <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #4a90e2', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
  </div>
);
const Alert = ({ severity, children, sx, ...props }) => {
  const severityStyles = {
    error: { backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' },
    warning: { backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeaa7' },
    info: { backgroundColor: '#d1ecf1', color: '#0c5460', border: '1px solid #bee5eb' },
    success: { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' }
  };
  return <div style={{ padding: '12px 16px', borderRadius: '4px', marginBottom: '16px', ...severityStyles[severity], ...sx }} {...props}>{children}</div>;
};
// --- Button Styles (Unchanged) ---
const buttonStyle = {
    padding: "5px 10px",
    margin: "0 5px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
  };
  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#f44336", // Red
    color: "white",
  };
  const disabledButtonStyle = {
    ...cancelButtonStyle,
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  };


const TravelerReport = () => {
  const [travelers, setTravelers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedConsignments, setSelectedConsignments] = useState([]);
  const [selectedTraveler, setSelectedTraveler] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  // NOTE: Status filter state removed as it's no longer used.
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const[totalEarnings, setTotalEarnings] = useState(0);
  const[noOfConsignments, setNoOfConsignments] = useState(0);
  const [copiedCell, setCopiedCell] = useState(null);
  const [modalCopiedCell, setModalCopiedCell] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const [actionStatus, setActionStatus] = useState({ id: null, message: '', type: '' });
  const recordsPerPage = 30;

  useEffect(() => {
    fetchTravelerData();
  }, [currentPage]);

  const copyToClipboard = async (text, cellId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCell(cellId);
      setTimeout(() => setCopiedCell(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const copyModalToClipboard = async (text, cellId) => {
    try {
      await navigator.clipboard.writeText(text);
      setModalCopiedCell(cellId);
      setTimeout(() => setModalCopiedCell(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  const getPageNumbers = () => {
    const maxButtons = 3;
    let start = Math.max(currentPage - 1, 1);
    let end = Math.min(start + maxButtons - 1, totalPages);
    if (end - start < maxButtons - 1) {
      start = Math.max(end - maxButtons + 1, 1);
    }
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const fetchTravelerData = async () => {
    try {
      setLoading(true);
      const response = await getTravelerReport(currentPage, recordsPerPage);
      console.log('Traveler data received:', response);
      
      // CHANGED: Handle the new backend response structure
      const data = response.stats || [];
      setTravelers(Array.isArray(data) ? data : []);
      
      // CHANGED: Set pagination info from the new response structure
      setTotalPages(response.totalPages || 1);
      setTotalRecords(response.totalTravellers || 0);
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch traveler data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'payment completed': case 'paid': case 'delivered': case 'successful': case 'completed': return 'success';
      case 'payment pending': case 'pending': case 'in progress': return 'warning';
      case 'no consignments': case 'cancelled': case 'failed': return 'error';
      default: return 'default';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const handleConsignmentClick = async (travelerPhone, travelerName) => {
    setLoadingDetails(true);
    setSelectedTraveler({ phone: travelerPhone, name: travelerName });
    try {
      const detailsResponse = await getTravelerConsignmentDetails(travelerPhone);
      const consignments = detailsResponse.data || [];
      console.log('Consignment details received:', consignments);
      setTotalEarnings(detailsResponse.totalAcceptedEarnings|| 0);
      setNoOfConsignments(detailsResponse.count || 0);
      setSelectedConsignments(consignments);
      setShowModal(true);
    } catch (err) {
      console.error('Error fetching consignment details:', err);
      setSelectedConsignments([]);
      setShowModal(true);
    } finally {
      setLoadingDetails(false);
    }
  };

//     const handleCancelConsignment = async (travelId) => {
//     // Add a confirmation dialog
//     if (!window.confirm("Are you sure you want to cancel this consignment?")) {
//       return;
//     }
//   
//     setCancellingId(travelId); // Set loading state for this specific button
//     setActionStatus({ id: travelId, message: 'Cancelling...', type: 'loading' });
//     try {
//       // Call the API
//       const response = await cancelTravelById(travelId);
//   
//       if (response.success) {
//         setActionStatus({ id: travelId, message: 'Cancelled!', type: 'success' });
//         alert('Consignment cancelled successfully.');
        
//         // --- THIS IS THE FIX ---
//         // Use the phone number from the 'selectedTraveler' state variable
//         if (selectedTraveler && selectedTraveler.phone) {
//             // Refresh the consignment details to show the change
//             setLoadingDetails(true);
//             try {
//                 const detailsResponse = await getTravelerConsignmentDetails(selectedTraveler.phone);
//                 setSelectedConsignments(detailsResponse.data || []);
//                 setTotalEarnings(detailsResponse.totalAcceptedEarnings || 0);
//                 setNoOfConsignments(detailsResponse.count || 0);
//             } catch (err) {
//                 console.error("Error re-fetching consignment details:", err);
//                 setActionStatus({ id: 'modal', message: 'Could not re-fetch details.', type: 'error' });
//             } finally {
//                 setLoadingDetails(false);
//             }
//         }
        
//         // Also re-fetch the main report to update the aggregates
//         fetchTravelerData(); 
//       } else {
//         throw new Error(response.message || "Failed to cancel");
//       }
//     } catch (err) {
//       console.error("Failed to cancel consignment:", err);
//       setActionStatus({ id: travelId, message: err.message || 'Failed', type: 'error' });
//     } finally {
//       setCancellingId(null); // Remove loading state
//       // Clear status message after 3 seconds
//       setTimeout(() => setActionStatus({ id: null, message: '', type: '' }), 3000);
//     }
//   };

const handleCancelConsignment = async (travelId) => {
  // 🟦 Step 1: Custom confirmation modal
  const confirmationBox = document.createElement("div");
  confirmationBox.innerHTML = `
  <div style="
    background-color: #ffffffff;
    border: 2px solid #141415ff;
    border-radius: 10px;
    padding: 20px 25px;
    width: 340px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.25);
    font-family: 'Segoe UI', sans-serif;
    color: #ffffffff;
    position: fixed;
    margin: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    text-align: center;
  ">
    <h3 style="margin-top: 0; color: #1565c0;">Cancel Travel Consignment?</h3>
    <p>Are you sure you want to cancel travelId: <b>${travelId}</b>?</p>
    <div style="margin-top: 15px;">
      <button id="confirmCancel" style="padding:8px 8px 8px 16px;margin:10px 10px; background-color: #2196f3; border: none; color: white; border-radius: 5px; cursor: pointer; font-weight: bold;">Yes, Cancel</button>
      <button id="cancelCancel" style="padding: 8px 8px 8px 16px; margin:10px 10px;background-color: #f44336; border: none; color: white; border-radius: 5px; cursor: pointer; font-weight: bold;">No</button>
    </div>
  </div>
  `;
  document.body.appendChild(confirmationBox);

  const confirmButton = confirmationBox.querySelector("#confirmCancel");
  const cancelButton = confirmationBox.querySelector("#cancelCancel");

  const waitForUserChoice = () => {
    return new Promise((resolve) => {
      confirmButton.onclick = () => {
        confirmationBox.remove();
        resolve(true);
      };
      cancelButton.onclick = () => {
        confirmationBox.remove();
        resolve(false);
      };
    });
  };

  const confirmed = await waitForUserChoice();
  if (!confirmed) return;

  // 🟨 Step 2: Proceed with your existing logic
  setCancellingId(travelId);
  setActionStatus({ id: travelId, message: 'Cancelling...', type: 'loading' });
  try {
    const response = await cancelTravelById(travelId);

    if (response.success) {
      setActionStatus({ id: travelId, message: 'Cancelled!', type: 'success' });

      // 🟩 Success modal
      const successBox = document.createElement("div");
      successBox.innerHTML = `
      <div style="
        background-color: #ffffffff;
        border: 2px solid #4caf50;
        border-radius: 10px;
        padding: 20px 25px;
        width: 340px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.25);
        font-family: 'Segoe UI', sans-serif;
        color: #141415ff;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        text-align: center;
      ">
        <h3 style="margin-top: 0; color: #2e7d32;">Travel Consignment Cancelled</h3>
        <p><b>Travel ID: ${travelId}</b> was cancelled successfully.</p>
        <button id="closeSuccess" style="padding: 8px 16px; background-color: #4caf50; border: none; color: white; border-radius: 5px; cursor: pointer; font-weight: bold;">OK</button>
      </div>`;
      document.body.appendChild(successBox);
      successBox.querySelector("#closeSuccess").onclick = () => successBox.remove();

      // your existing data refresh logic remains unchanged
      if (selectedTraveler && selectedTraveler.phone) {
        setLoadingDetails(true);
        try {
          const detailsResponse = await getTravelerConsignmentDetails(selectedTraveler.phone);
          setSelectedConsignments(detailsResponse.data || []);
          setTotalEarnings(detailsResponse.totalAcceptedEarnings || 0);
          setNoOfConsignments(detailsResponse.count || 0);
        } catch (err) {
          console.error("Error re-fetching consignment details:", err);
          setActionStatus({ id: 'modal', message: 'Could not re-fetch details.', type: 'error' });
        } finally {
          setLoadingDetails(false);
        }
      }
      fetchTravelerData();
    } else {
      throw new Error(response.message || "Failed to cancel");
    }
  } catch (err) {
    console.error("Failed to cancel consignment:", err);
    setActionStatus({ id: travelId, message: err.message || 'Failed', type: 'error' });

    // 🔴 Error modal
    const errorBox = document.createElement("div");
    errorBox.innerHTML = `
    <div style="
      background-color: #ffffffff;
      border: 2px solid #e53935;
      border-radius: 10px;
      padding: 20px 25px;
      width: 340px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.25);
      font-family: 'Segoe UI', sans-serif;
      color: #141415ff;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999;
      text-align: center;
    ">
      <h3 style="margin-top: 0; color: #c62828;">Cancellation Failed</h3>
      <p>Unable to cancel travel ID <b>${travelId}</b>. Please try again.</p>
      <button id="closeError" style="padding: 8px 16px; background-color: #e53935; border: none; color: white; border-radius: 5px; cursor: pointer; font-weight: bold;">Close</button>
    </div>`;
    document.body.appendChild(errorBox);
    errorBox.querySelector("#closeError").onclick = () => errorBox.remove();
  } finally {
    setCancellingId(null);
    setTimeout(() => setActionStatus({ id: null, message: '', type: '' }), 3000);
  }
};

  const closeModal = () => {
    setShowModal(false);
    setSelectedConsignments([]);
    setSelectedTraveler(null);
  };

  // CHANGED: Filter logic updated for new data fields
  const filteredTravelers = travelers.filter(traveler => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      String(traveler.travellerId)?.toLowerCase().includes(searchTermLower) ||
      String(traveler.name)?.toLowerCase().includes(searchTermLower) ||
      String(traveler.email)?.toLowerCase().includes(searchTermLower) ||
      String(traveler.phone)?.toLowerCase().includes(searchTermLower)
    );
  });
  
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleString('en-IN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // CHANGED: CSV export updated for new data fields
  const exportToCSV = () => {
    const headers = ['Traveler ID', 'Name', 'Email', 'Phone', 'Consignment Count', 'Total Earnings'];
    const csvContent = [
      headers.join(','),
      ...filteredTravelers.map(traveler => [
        `"${traveler.travellerId || ''}"`,
        `"${traveler.name || ''}"`,
        `"${traveler.email || ''}"`,
        `"${traveler.phone || ''}"`,
        traveler.consignmentCount || 0,
        Number(traveler.totalEarnings || 0).toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'traveler_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="traveler-report-container"><CircularProgress /></div>;

  if (error) {
    return (
      <div className="traveler-report-container">
        <Alert severity="error">{error}</Alert>
        <button onClick={fetchTravelerData} className="retry-btn">Retry</button>
      </div>
    );
  }

return (
    <div className="traveler-report-container">
      <div className="report-header">
        <Typography variant="h4">Traveler Report</Typography>
        <div className="header-controls">
          <div className="search-filter-container">
            <input
              type="text"
              placeholder="Search by ID, name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {/* NOTE: Status filter removed as it is not supported by the new data */}
          </div>
          <button onClick={exportToCSV} className="export-btn">Export to CSV</button>
        </div>
      </div>

      <div className="summary-stats">
        <div className="stat-card"><Typography variant="subtitle2">Total Travelers</Typography><Typography variant="h6">{totalRecords}</Typography></div>
        <div className="stat-card"><Typography variant="subtitle2">Current Page</Typography><Typography variant="h6">{currentPage} of {totalPages}</Typography></div>
        <div className="stat-card"><Typography variant="subtitle2">Records Per Page</Typography><Typography variant="h6">{recordsPerPage}</Typography></div>
      </div>

      <div className="table-container">
        <table className="traveler-table">
          {/* CHANGED: Table headers updated */}
          <thead>
            <tr>
              <th>Traveler ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Consignment Count</th>
              <th>Total Earnings</th>
            </tr>
          </thead>
          <tbody>
            {filteredTravelers.length === 0 ? (
              <tr><td colSpan="6" className="no-data">No traveler data available</td></tr>
            ) : (
              filteredTravelers.map((traveler, index) => (
                // CHANGED: Table row data updated to use new keys
                <tr key={traveler.travellerId || index}>
                  <td className={`id-cell copyable-cell ${copiedCell === `${index}-id` ? 'copied' : ''}`} title={traveler.travellerId} onClick={() => copyToClipboard(traveler.travellerId, `${index}-id`)}>
                    {traveler.travellerId || 'N/A'}
                  </td>
                  <td className={`large-value copyable-cell ${copiedCell === `${index}-name` ? 'copied' : ''}`} title={traveler.name} onClick={() => copyToClipboard(traveler.name, `${index}-name`)}>
                    {traveler.name || 'N/A'}
                  </td>
                  <td className={`copyable-cell ${copiedCell === `${index}-email` ? 'copied' : ''}`} title={traveler.email} onClick={() => copyToClipboard(traveler.email, `${index}-email`)}>
                    {traveler.email || 'N/A'}
                  </td>
                  <td className={`phone-cell copyable-cell ${copiedCell === `${index}-phone` ? 'copied' : ''}`} title={traveler.phone} onClick={() => copyToClipboard(traveler.phone, `${index}-phone`)}>
                    {traveler.phone || 'N/A'}
                  </td>
                  <td className="consignment-count-cell" title={`Click to view ${traveler.consignmentCount || 0} consignments`} onClick={() => handleConsignmentClick(traveler.phone, traveler.name)}>
                    <Chip label={traveler.consignmentCount || 0} color="primary" variant="outlined" size="small" />
                  </td>
                  <td className={`amount-cell copyable-cell ${copiedCell === `${index}-amount` ? 'copied' : ''}`} title={formatCurrency(traveler.totalEarnings)} onClick={() => copyToClipboard(formatCurrency(traveler.totalEarnings), `${index}-amount`)}>
                    {formatCurrency(traveler.totalEarnings)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="pagination">
        <div className="page-controls">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>«</button>
          {getPageNumbers().map(page => <button key={page} className={currentPage === page ? "active-page" : ""} onClick={() => setCurrentPage(page)}>{page}</button>)}
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>»</button>
        </div>
        <div className="pagination-info">Showing page {currentPage} of {totalPages} ({totalRecords} total records)</div>
      </div>
      
      {/* Modal for consignment details (logic remains the same) */}
      {showModal && (
        <div className="modal-overlay show" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <Typography variant="h6">Travel & Consignment Details for {selectedTraveler?.name}</Typography>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              {loadingDetails ? (
                <div className="loading-details"><CircularProgress /><Typography variant="body2">Loading details...</Typography></div>
              ) : (actionStatus.id === 'modal' && actionStatus.type === 'error') ? (
                            <Alert severity="error">{actionStatus.message}</Alert>
              )  : selectedConsignments.length === 0 ? (
                <div className="no-consignments-message"><Typography variant="body2">No consignment details available.</Typography></div>
              ) : (
                <div>
                  <div className="consignment-summary">
                        {/* Summary content can stay the same */}
                        <div><Typography variant="subtitle2">Total Consignments</Typography><Typography variant="h6">{noOfConsignments}</Typography></div>
                        <div><Typography variant="subtitle2">Total Earnings</Typography><Typography variant="h6">{totalEarnings}</Typography></div>
                  </div>
                      <div className="table-container">
                        <table className="consignment-modal-table">
                          <thead>
                            <tr>
                              <th>Travel ID</th>
                              <th>Consignment ID</th>
                              <th>Starting Location</th>
                              <th>Ending Location</th>
                              <th>Mode of Travel</th>
                              <th>Travel Status</th>
                              <th>Payment Status</th>
                              <th>Consignment Status</th>
                              <th>Date of Sending</th>
                              <th>Weight</th>
                              <th>Receiver Name</th>
                              <th>Receiver Phone</th>
                              <th>Earnings</th>
                               <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedConsignments.map((c, i) => {
                                    const travelStatus = String(c.travelStatus || '').toLowerCase();
                                    const consignmentStatus = String(c.consignmentStatus || '').toLowerCase();
                                    const hasConsignments = Array.isArray(c.consignments) && c.consignments.length > 0;

                                    const showCancel = (
                                      ['ongoing', 'upcoming'].includes(travelStatus) &&
                                      (
                                        // Case 1: consignments present — check both statuses
                                        (hasConsignments && ['cancelled', 'assigned', 'requested'].includes(consignmentStatus)) ||
                                        // Case 2: no consignments — check only travelStatus
                                        (!hasConsignments)
                                      )
                                    );

                                    const isCancelling = cancellingId === c.travelId;
                            return(
                              <tr key={c.travelId || i}>
                                <td
                                  title={c.travelId}
                                  onClick={() => copyModalToClipboard(c.travelId, `m-${i}-id`)}
                                  className={`copyable-cell ${modalCopiedCell === `m-${i}-id` ? 'copied' : ''}`}
                                >
                                  {c.travelId || 'N/A'} 
                                </td>
                                <td
                                  title={c.consignmentId}
                                  onClick={() => copyModalToClipboard(c.consignmentId, `m-${i}-id`)}
                                  className={`copyable-cell ${modalCopiedCell === `m-${i}-id` ? 'copied' : ''}`}
                                >
                                  {c.consignmentId || 'N/A'} {/* Data: consignmentId */}
                                </td>
                                <td
                                  title={c.startingLocation} /* Data: startingLocation from backend */
                                  onClick={() => copyModalToClipboard(c.startingLocation, `m-${i}-p`)}
                                  className={`copyable-cell ${modalCopiedCell === `m-${i}-p` ? 'copied' : ''}`}
                                >
                                  {c.startingLocation || 'N/A'}
                                </td>
                                <td
                                  title={c.endingLocation} /* Data: endingLocation from backend */
                                  onClick={() => copyModalToClipboard(c.endingLocation, `m-${i}-d`)}
                                  className={`copyable-cell ${modalCopiedCell === `m-${i}-d` ? 'copied' : ''}`}
                                >
                                  {c.endingLocation || 'N/A'}
                                </td>
                                 <td
                                    title={c.modeOfTravel} 
                                    onClick={() => copyModalToClipboard(c.modeOfTravel, `m-${i}-mode`)}
                                    className={`copyable-cell ${modalCopiedCell === `m-${i}-mode` ? 'copied' : ''}`}
                                >
                                    {c.modeOfTravel || 'N/A'}
                                </td>
                                <td>
                                  <Chip label={c.travelStatus} color={getStatusColor(c.travelStatus)} size="small" /> 
                                </td>
                                <td>
                                  <Chip label={c.paymentStatus} color={getStatusColor(c.paymentStatus)} size="small" /> 
                                </td>
                                 <td>
                                  <Chip label={c.consignmentStatus} color={getStatusColor(c.consignmentStatus)} size="small" /> 
                                </td>
                                <td
                                    title={formatDate(c.dateOfSending)} 
                                    onClick={() => copyModalToClipboard(formatDate(c.dateOfSending), `m-${i}-date`)}
                                    className={`copyable-cell ${modalCopiedCell === `m-${i}-date` ? 'copied' : ''}`}
                                >
                                    {formatDate(c.dateOfSending)}
                                </td>
                                <td
                                  title={c.weight}
                                  onClick={() => copyModalToClipboard(c.weight, `m-${i}-w`)}
                                  className={`copyable-cell ${modalCopiedCell === `m-${i}-w` ? 'copied' : ''}`}
                                >
                                  {c.weight || 'N/A'}
                                </td>
                                <td
                                    title={c.receiverName} 
                                    onClick={() => copyModalToClipboard(c.receiverName, `m-${i}-receiver`)}
                                    className={`copyable-cell ${modalCopiedCell === `m-${i}-receiver` ? 'copied' : ''}`}
                                >
                                    {c.receiverName || 'N/A'}
                                </td>
                                <td
                                    title={c.receiverPhone} 
                                    onClick={() => copyModalToClipboard(c.receiverPhone, `m-${i}-receiverPhone`)}
                                    className={`copyable-cell ${modalCopiedCell === `m-${i}-receiverPhone` ? 'copied' : ''}`}
                                >
                                    {c.receiverPhone || 'N/A'}
                                </td>
                                <td className="amount-cell">{formatCurrency(c.earnings)}</td> 
                                 <td style={{ minWidth: '120px', textAlign: 'center' }}>
                                  
                                      {showCancel && (
                                        <button
                                          style={isCancelling ? disabledButtonStyle : cancelButtonStyle}
                                          onClick={() => handleCancelConsignment(c.travelId)}
                                          disabled={isCancelling}
                                        >
                                          {isCancelling ? '....' : 'Cancel'}
                                        </button>
                                      )}
                                      {actionStatus.id === c.travelId && (
                                                <span style={{ 
                                                    display: 'block', 
                                                    fontSize: '11px', 
                                                    marginTop: '4px', 
                                                    color: actionStatus.type === 'error' ? '#721c24' : (actionStatus.type === 'success' ? '#155724' : '#0c5460')
                                                }}>
                                                    {actionStatus.message}
                                                </span>
                                            )}
                                 </td>         
                              </tr>);
                            })}
                          </tbody>
                        </table>
                      </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
)
}

export default TravelerReport;