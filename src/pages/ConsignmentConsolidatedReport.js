import React, { useState, useEffect, useRef } from 'react';
import { getConsolidatedReportData } from '../Services/Api';
import './Styles/ConsignmentConsolidatedReport.css';

const ConsignmentConsolidatedReport = () => {
  const [allConsignments, setAllConsignments] = useState([]);
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [recordsPerPage] = useState(30);
  const [copiedCell, setCopiedCell] = useState(null);
  const tableContainerRef = useRef(null);

  // Fetch Data
  useEffect(() => {
    const fetchConsignmentData = async () => {
      try {
        setLoading(true);
        const response = await getConsolidatedReportData();
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
  }, []);

  // Filtering, searching, pagination
  useEffect(() => {
    let filteredData = allConsignments;

    if (filterStatus !== 'all') {
      filteredData = filteredData.filter(item => item.consignmentStatus === filterStatus);
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filteredData = filteredData.filter(item =>
        item.consignmentId?.toLowerCase().includes(lowerSearch) ||
        item.senderName?.toLowerCase().includes(lowerSearch) ||
        item.travellerName?.toLowerCase().includes(lowerSearch)
      );
    }

    setTotalRecords(filteredData.length);
    setTotalPages(Math.ceil(filteredData.length / recordsPerPage));

    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    setConsignments(filteredData.slice(startIndex, endIndex));
  }, [allConsignments, currentPage, searchTerm, filterStatus, recordsPerPage]);

  const getPageNumbers = () => {
    const maxButtons = 3;
    let start = Math.max(currentPage - 1, 1);
    let end = Math.min(start + maxButtons - 1, totalPages);
    if (end - start < maxButtons - 1) start = Math.max(end - maxButtons + 1, 1);
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
    } catch {
      return 'N/A';
    }
  };

  const copyToClipboard = async (text, cellId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCell(cellId);
      setTimeout(() => setCopiedCell(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

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
              placeholder="Search by Consignment, Sender, Traveller..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="search-input"
            />
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              className="status-filter"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="in-transit">In Transition</option>
              <option value="assigned">Accepted</option>
            </select>
          </div>
          <button className="export-btn">Export to CSV</button>
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
            <thead>
              <tr>
                <th>Consignment ID</th>
                <th>Sender Name</th>
                <th>Sender Phone</th>
                <th>Sender Email</th>
                <th>Traveller Name</th>
                <th>Traveller Phone</th>
                <th>Traveller Email</th>
                <th>From City</th>
                <th>To City</th>
                <th>Sending Date</th>
                <th>Consignment Status</th>
                <th>Travel Status</th>
                <th>Sender Paid (₹)</th>
                <th>Traveller Earned (₹)</th>
                <th>Pickup Time</th>
                <th>Delivery Time</th>
                <th>Created At</th>
                <th>Mode of Travel</th>
                <th>GST Amount (₹)</th>
                <th>Margin Amount (₹)</th>
                <th>Travel & Earn Fee (₹)</th>
                <th>Remaining Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {consignments.length === 0 ? (
                <tr><td colSpan="23" className="no-data">No data available</td></tr>
              ) : (
                consignments.map((item, index) => (
                  <tr key={index}>
                    <td onClick={() => copyToClipboard(item.consignmentId, `${index}-cid`)} className={`copyable-cell ${copiedCell === `${index}-cid` ? 'copied' : ''}`}>{item.consignmentId || 'N/A'}</td>
                    <td>{item.senderName || 'N/A'}</td>
                    <td>{item.senderPhone || 'N/A'}</td>
                    <td>{item.senderEmail || 'N/A'}</td>
                    <td>{item.travellerName || 'N/A'}</td>
                    <td>{item.travellerPhone || 'N/A'}</td>
                    <td>{item.travellerEmail || 'N/A'}</td>
                    <td>{item.fromCity || 'N/A'}</td>
                    <td>{item.toCity || 'N/A'}</td>
                    <td>{formatDate(item.sendingDate)}</td>
                    <td><span className={`status ${item.consignmentStatus || 'unknown'}`}>{item.consignmentStatus || 'N/A'}</span></td>
                    <td><span className={`status ${item.travelConsignmentStatus || 'unknown'}`}>{item.travelConsignmentStatus || 'N/A'}</span></td>
                    <td>₹{Number(item.senderPaid || 0).toFixed(2)}</td>
                    <td>₹{Number(item.travellerEarned || 0).toFixed(2)}</td>
                    <td>{formatDate(item.pickupTime)}</td>
                    <td>{formatDate(item.deliveryTime)}</td>
                    <td>{formatDate(item.createdAt)}</td>
                    <td>{item.modeOfTravel || 'N/A'}</td>
                    <td>₹{Number(item.gstAmount || 0).toFixed(2)}</td>
                    <td>₹{Number(item.marginAmount || 0).toFixed(2)}</td>
                    <td>₹{Number(item.travelAndEarnFee || 0).toFixed(2)}</td>
                    <td>₹{Number(item.remainingAmount || 0).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pagination">
        <div className="page-controls">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>«</button>
          {getPageNumbers().map(page => (
            <button
              key={page}
              className={currentPage === page ? "active-page" : ""}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0}>»</button>
        </div>
        <div className="pagination-info">
          Showing page {currentPage} of {totalPages} ({totalRecords} total records)
        </div>
      </div>
    </div>
  );
};

export default ConsignmentConsolidatedReport;