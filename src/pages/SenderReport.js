import React, { useState, useEffect } from 'react';
import { getSenderReport, getSenderConsignmentDetails,cancelConsignmentById} from '../Services/Api';
import Api from '../Services/Api';
import './Styles/SenderReport.css';
const SenderReport = () => {
  const [senders, setSenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [copiedCell, setCopiedCell] = useState(null);
  const [modalCopiedCell, setModalCopiedCell] = useState(null);
  const [expandedSender, setExpandedSender] = useState(null);
  const [expandedConsignments, setExpandedConsignments] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const recordsPerPage = 30;

  useEffect(() => {
    fetchSenderData();
  }, [currentPage]);

  // Function to copy text to clipboard
  const copyToClipboard = async (text, cellId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCell(cellId);
      setTimeout(() => setCopiedCell(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedCell(cellId);
      setTimeout(() => setCopiedCell(null), 2000);
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

  const fetchSenderData = async () => {
    try {
      setLoading(true);
      // CHANGED: Pass page and limit to the API call
      const response = await getSenderReport(currentPage, recordsPerPage);
      console.log('Sender data received:', response);

      // CHANGED: Handle the new backend response structure
      const data = response.stats || [];
      setSenders(Array.isArray(data) ? data : []);

      // CHANGED: Set pagination info from the new response structure
      setTotalPages(response.totalPages || 1);
      setTotalRecords(response.totalSenders || 0);

      setError(null);
    } catch (err) {
      setError('Failed to fetch sender data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConsignmentClick = async (senderPhone) => {
    if (expandedSender === senderPhone) {
      setExpandedSender(null);
      setExpandedConsignments([]);
    } else {
      setExpandedSender(senderPhone);
      setLoadingDetails(true);
      try {
        const detailsResponse = await getSenderConsignmentDetails(senderPhone);
        setExpandedConsignments(detailsResponse.data || []);
      } catch (err) {
        console.error('Error fetching consignment details:', err);
        setExpandedConsignments([]);
      } finally {
        setLoadingDetails(false);
      }
    }
  };
  const handleCancelConsignment = async (consignmentId, senderPhone) => {
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
    <h3 style="margin-top: 0; color: #1565c0;">Cancel Consignment?</h3>
    <p>Are you sure you want to cancel consignmentId: <b>${consignmentId}</b>?</p>
    <div style="margin-top: 15px;">
      <button id="confirmCancel" style="padding:8px 8px 8px 16px;margin:10px 10px; background-color: #2196f3; border: none; color: white; border-radius: 5px; cursor: pointer; font-weight: bold;">Yes, Cancel</button>
      <button id="cancelCancel" style="padding: 8px 8px 8px 16px; ;margin:10px 10px;background-color: #f44336; border: none; color: white; border-radius: 5px; cursor: pointer; font-weight: bold; margin-left: 10px;">No</button>
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

  // 🟨 Step 2: Proceed with API
  setCancellingId(consignmentId);
  try {
    await cancelConsignmentById(consignmentId);

    // 🟩 Success alert
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
      color: #ffffffff;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999;
      text-align: center;
    ">
      <h3 style="margin-top: 0; color: #2e7d32;">Consignment Cancelled</h3>
      <p><b>Consignment with consignmentID:${consignmentId}</b> was cancelled successfully.</p>
      <button id="closeSuccess" style="padding: 8px 16px; background-color: #4caf50; border: none; color: white; border-radius: 5px; cursor: pointer; font-weight: bold;">OK</button>
    </div>`;
    document.body.appendChild(successBox);
    successBox.querySelector("#closeSuccess").onclick = () => successBox.remove();

    // Refresh data
    setLoadingDetails(true);
    try {
      const detailsResponse = await getSenderConsignmentDetails(senderPhone);
      setExpandedConsignments(detailsResponse.data || []);
    } catch (err) {
      console.error("Error re-fetching consignment details:", err);
      setExpandedConsignments([]);
    } finally {
      setLoadingDetails(false);
    }
  } catch (err) {
    console.error("Failed to cancel consignment:", err);

    // 🔴 Error alert
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
      color: #ffffffff;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999;
      text-align: center;
    ">
      <h3 style="margin-top: 0; color: #c62828;">Cancellation Failed</h3>
      <p>Unable to cancel consignment with consignment ID <b>${consignmentId}</b>. Please try again.</p>
      <button id="closeError" style="padding: 8px 16px; background-color: #e53935; border: none; color: white; border-radius: 5px; cursor: pointer; font-weight: bold;">Close</button>
    </div>`;
    document.body.appendChild(errorBox);
    errorBox.querySelector("#closeError").onclick = () => errorBox.remove();
  } finally {
    setCancellingId(null);
  }
};

 const handleRefundConsignment = async(consignmentId) => {
  

  // Ask user for refund amount
  const refundAmount = prompt(`Enter refund amount for consignmentId ${consignmentId}:`);
  if (!refundAmount) {
    alert("Refund cancelled. No amount entered.");
    return;
  }
   const refundAmountPaise = parseInt(refundAmount) * 100;

  // Create a custom alert container
  try {
    const res = await Api.post(`api/v1/admin/initiateRefund/${consignmentId}`, {
      amount: refundAmountPaise,
    });

    const data = res.data; // ✅ Axios auto-parses JSON

    if (res.status === 200) {
      // ✅ success alert
      const alertBox = document.createElement("div");
      alertBox.innerHTML = `
    <div style="background-color: #ffffff; border: 2px solid #4caf50; border-radius: 8px; padding: 15px 25px; width: 300px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); font-family: Arial, sans-serif; color: #333; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999; text-align: center;">
      <h3 style="margin-top: 0; color: #4caf50;">Refund Initiated</h3>
      <p>Consignment ID: <b>${consignmentId}</b></p>
      <p>Refund Amount: <b>₹${refundAmount}</b></p>
      <button id="closeAlertBtn" style="padding: 5px 10px; margin-top: 10px; background-color: #4caf50; border: none; border-radius: 4px; color: white; font-weight: bold; cursor: pointer;">OK</button>
    </div>`;
      document.body.appendChild(alertBox);
      document.getElementById("closeAlertBtn").onclick = () =>
        alertBox.remove();
    } else {
      alert(`Refund failed: ${data.message}`);
    }
  } catch (err) {
    console.error(err);
    alert("Error initiating refund.");
  }
};

  const filteredSenders = senders.filter(sender => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      String(sender.senderId)?.toLowerCase().includes(searchTermLower) ||
      String(sender.name)?.toLowerCase().includes(searchTermLower) ||
      String(sender.email)?.toLowerCase().includes(searchTermLower) ||
      String(sender.phone)?.toLowerCase().includes(searchTermLower)
    );
  });

  // CHANGED: CSV export updated for new data fields
  const exportToCSV = () => {
    const headers = [
      'Sender ID',
      'Name',
      'Email',
      'Phone',
      'Consignment Count',
      'Total Paid',
    ];

    const csvContent = [
      headers.join(','),
      ...filteredSenders.map(sender => [
        `"${sender.senderId || ''}"`,
        `"${sender.name || ''}"`,
        `"${sender.email || ''}"`,
        `"${sender.phone || ''}"`,
        sender.consignmentCount || 0,
        Number(sender.totalPaid || 0).toFixed(2),
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'sender_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleString('en-IN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      });
    } catch (error) {
      return 'N/A';
    }
  };
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

  const refundButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#008CBA", // Blue
    color: "white",
  };

  const disabledButtonStyle = {
    ...cancelButtonStyle,
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  };


  if (loading) {
    return <div className="sender-report-container"><div className="loading">Loading sender data...</div></div>;
  }

  if (error) {
    return (
      <div className="sender-report-container">
        <div className="error">{error}</div>
        <button onClick={fetchSenderData} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="sender-report-container">
      <div className="report-header">
        <h1>Sender Report</h1>
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
          <button onClick={exportToCSV} className="export-btn">
            Export to CSV
          </button>
        </div>
      </div>

      <div className="summary-stats">
        <div className="stat-card"><h3>Total Senders</h3><p>{totalRecords}</p></div>
        <div className="stat-card"><h3>Current Page</h3><p>{currentPage} of {totalPages}</p></div>
        <div className="stat-card"><h3>Records Per Page</h3><p>{recordsPerPage}</p></div>
      </div>

      <div className="table-container">
        <table className="sender-table">
      <thead>
        <tr>
          <th>Sender ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Consignment Count</th>
          <th>Total Paid</th>
        </tr>
      </thead>
      <tbody>
        {filteredSenders.length === 0 ? (
          <tr><td colSpan="6" className="no-data">No sender data available</td></tr>
        ) : (
          filteredSenders.map((sender, index) => (
            <React.Fragment key={sender.senderId || index}>
              
              {/* THIS IS THE MAIN SENDER ROW - IT SHOULD BE EXACTLY AS YOU HAD IT */}
              <tr>
                <td className={`id-cell copyable-cell ${copiedCell === `${index}-id` ? 'copied' : ''}`} title={sender.senderId || 'N/A'} onClick={() => copyToClipboard(sender.senderId || 'N/A', `${index}-id`)}>
                  {sender.senderId || 'N/A'}
                </td>
                <td className={`large-value copyable-cell ${copiedCell === `${index}-name` ? 'copied' : ''}`} title={sender.name || 'N/A'} onClick={() => copyToClipboard(sender.name || 'N/A', `${index}-name`)}>
                  {sender.name || 'N/A'}
                </td>
                <td className={`copyable-cell ${copiedCell === `${index}-email` ? 'copied' : ''}`} title={sender.email || 'N/A'} onClick={() => copyToClipboard(sender.email || 'N/A', `${index}-email`)}>
                  {sender.email || 'N/A'}
                </td>
                <td className={`phone-cell copyable-cell ${copiedCell === `${index}-phone` ? 'copied' : ''}`} title={sender.phone || 'N/A'} onClick={() => copyToClipboard(sender.phone || 'N/A', `${index}-phone`)}>
                  {sender.phone || 'N/A'}
                </td>
                <td className="consignment-count-cell" title={`Click to view ${sender.consignmentCount || 0} consignments`} onClick={() => handleConsignmentClick(sender.phone)}>
                  <span className="clickable-count">
                    {sender.consignmentCount || 0}
                    {expandedSender === sender.phone ? ' ▼' : ' ▶'}
                  </span>
                </td>
                <td className={`amount-cell copyable-cell ${copiedCell === `${index}-amount` ? 'copied' : ''}`} title={`₹${Number(sender.totalPaid || 0).toFixed(2)}`} onClick={() => copyToClipboard(`₹${Number(sender.totalPaid || 0).toFixed(2)}`, `${index}-amount`)}>
                  ₹{Number(sender.totalPaid || 0).toFixed(2)}
                </td>
              </tr>
              
              {/* This is the expanded row where all our changes for the buttons belong */}
              {expandedSender === sender.phone && (
                <tr className="expanded-details-row">
                  <td colSpan="6" className="consignment-details-cell">
                    {loadingDetails ? (
                      <div className="loading-details">Loading consignment details...</div>
                    ) : expandedConsignments.length > 0 ? (
                      <div className="consignment-details-container">
                        <h4>Consignment Details for {sender.name}</h4>
                        <div className="consignment-details-table">
                          <table>
                            <thead>
                              <tr>
                                <th>Consignment ID</th>
                                <th>Starting Location</th>
                                <th>Ending Location</th>
                                <th>Payment Status</th>
                                <th>Consignment Status</th>
                                <th>Date of Sending</th>
                                <th>Weight</th>
                                <th>Receiver Name</th>
                                <th>Receiver Phone</th>
                                <th>Earnings</th>
                                <th>Sender Pay</th>
                                {/* This is the new column we added */}
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {expandedConsignments.map((consignment, consIndex) => {
                                // ... (Logic for showing buttons)
                                const consStatus = String(consignment.consignmentStatus || '').toUpperCase();
                                const payStatus = String(consignment.paymentStatus || '').toUpperCase();
                                const showCancel = ['PUBLISHED', 'REQUESTD', 'ASSIGNED'].includes(consStatus);
                                const showRefund = consStatus === 'CANCELLED' && payStatus === 'PAID';
                                const isCancelling = cancellingId === consignment.consignmentId;

                                return (
                                  <tr key={consignment.consignmentId || consIndex}>
                                    {/* ... (all existing <td> cells for consignment details) ... */}
                                    <td title={consignment.consignmentId || 'N/A'} onClick={() => copyModalToClipboard(consignment.consignmentId, `modal-${consIndex}-id`)} className={modalCopiedCell === `modal-${consIndex}-id` ? 'copied' : ''}>{consignment.consignmentId || 'N/A'}</td>
                                    <td title={consignment.startingLocation || 'N/A'} onClick={() => copyModalToClipboard(consignment.startingLocation, `modal-${consIndex}-start`)} className={modalCopiedCell === `modal-${consIndex}-start` ? 'copied' : ''}>{consignment.startingLocation || 'N/A'}</td>
                                    <td title={consignment.endingLocation || 'N/A'} onClick={() => copyModalToClipboard(consignment.endingLocation, `modal-${consIndex}-end`)} className={modalCopiedCell === `modal-${consIndex}-end` ? 'copied' : ''}>{consignment.endingLocation || 'N/A'}</td>
                                    <td><span className={`payment ${consignment.paymentStatus?.toLowerCase() || 'unknown'}`}>{consignment.paymentStatus || 'N/A'}</span></td>
                                    <td><span className={`status ${consignment.consignmentStatus?.toLowerCase().replace(' ', '-') || 'unknown'}`}>{consignment.consignmentStatus || 'N/A'}</span></td>
                                    <td title={formatDate(consignment.dateOfSending)} onClick={() => copyModalToClipboard(formatDate(consignment.dateOfSending), `modal-${consIndex}-date`)} className={modalCopiedCell === `modal-${consIndex}-date` ? 'copied' : ''}>{formatDate(consignment.dateOfSending)}</td>
                                    <td title={consignment.weight || 'N/A'} onClick={() => copyModalToClipboard(consignment.weight, `modal-${consIndex}-weight`)} className={modalCopiedCell === `modal-${consIndex}-weight` ? 'copied' : ''}>{consignment.weight || 'N/A'}</td>
                                    <td title={consignment.receiverName || 'N/A'} onClick={() => copyModalToClipboard(consignment.receiverName, `modal-${consIndex}-receiver`)} className={modalCopiedCell === `modal-${consIndex}-receiver` ? 'copied' : ''}>{consignment.receiverName || 'N/A'}</td>
                                    <td title={consignment.receiverPhone || 'N/A'} onClick={() => copyModalToClipboard(consignment.receiverPhone, `modal-${consIndex}-receiverPhone`)} className={modalCopiedCell === `modal-${consIndex}-receiverPhone` ? 'copied' : ''}>{consignment.receiverPhone || 'N/A'}</td>
                                    <td title={`₹${Number(consignment.earnings || 0).toFixed(2)}`} onClick={() => copyModalToClipboard(Number(consignment.earnings || 0).toFixed(2), `modal-${consIndex}-earnings`)} className={modalCopiedCell === `modal-${consIndex}-earnings` ? 'copied' : ''}>₹{Number(consignment.earnings || 0).toFixed(2)}</td>
                                    <td title={`₹${Number(consignment.senderPayAmount|| 0).toFixed(2)}`} >₹{Number(consignment.senderPayAmount || 0).toFixed(2)}</td>
                                    {/* This is the new cell with the buttons */}
                                    <td style={{ minWidth: '120px', textAlign: 'center' }}>
                                      {showCancel && (
                                        <button
                                          style={isCancelling ? disabledButtonStyle : cancelButtonStyle}
                                          onClick={() => handleCancelConsignment(consignment.consignmentId, sender.phone)}
                                          disabled={isCancelling}
                                        >
                                          {isCancelling ? 'Cancelling...' : 'Cancel'}
                                        </button>
                                      )}
                                      {showRefund && (
                                        <button
                                          style={refundButtonStyle}
                                          onClick={() => handleRefundConsignment(consignment.consignmentId)}
                                        >
                                          Refund
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="no-consignments-message">No consignment details available</div>
                    )}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))
        )}
      </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <div className="page-controls">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>«</button>
          {getPageNumbers().map((page) => (
            <button key={page} className={`${currentPage === page ? "page-controls active-page" : ""}`} onClick={() => setCurrentPage(page)}>{page}</button>
          ))}
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>»</button>
        </div>
        <div className="pagination-info">
          Showing page {currentPage} of {totalPages} ({totalRecords} total records)
        </div>
      </div>
    </div>
  );
};

export default SenderReport;
