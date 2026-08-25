import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from "../Components/Sidebar";
import Header from "./Header";
import styles from "./Styles/UserDetails.module.css";
import api from '../Services/Api';

const Refunds = () => {
    const location = useLocation();
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRefunds, setTotalRefunds] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    
    // Stats
    const [pendingCount, setPendingCount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    // Refund Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRefund, setSelectedRefund] = useState(null);
    const [modalStatus, setModalStatus] = useState("pending");
    const [modalComment, setModalComment] = useState("");
    const [modalSubmitting, setModalSubmitting] = useState(false);

    const refundsPerPage = 10;

    const fetchRefunds = async () => {
        setLoading(true);
        try {
            const statusParam = statusFilter ? `&status=${statusFilter}` : "";
            const response = await api.get(
                `/api/v1/admin/refunds?page=${currentPage}&limit=${refundsPerPage}${statusParam}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            
            const resultData = response.data.data;
            const fetchedRefunds = resultData.data || [];
            setRefunds(fetchedRefunds);
            setTotalRefunds(resultData.total || 0);
            setTotalPages(resultData.totalPages || 1);

            // Auto-open modal if openRefund param exists
            const searchParams = new URLSearchParams(window.location.search);
            const openRefundId = searchParams.get('openRefund');
            if (openRefundId) {
                const targetRefund = fetchedRefunds.find(r => r.refundId === openRefundId || r._id === openRefundId);
                if (targetRefund) {
                    // Slight delay to ensure state sets properly
                    setTimeout(() => openUpdateModal(targetRefund), 100);
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            }

            // Fetch summary stats
            const statsResponse = await api.get(
                `/api/v1/admin/refunds?limit=1000`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            const allRefunds = statsResponse.data.data.data || [];
            setPendingCount(allRefunds.filter(r => r.status === "pending").length);
            setTotalAmount(allRefunds.reduce((acc, curr) => acc + (curr.amount || 0), 0));
        } catch (error) {
            console.error('Error fetching refunds:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRefunds();
    }, [currentPage, statusFilter]);

    const handleExport = async () => {
        try {
            const statusParam = statusFilter ? `?status=${statusFilter}` : "";
            const response = await api.get(`/api/v1/admin/refunds/export${statusParam}`, {
                responseType: 'blob',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `refunds_${statusFilter || 'all'}_export.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Error exporting refunds:', error);
            alert('Failed to export refunds.');
        }
    };

    const openUpdateModal = (refund) => {
        setSelectedRefund(refund);
        setModalStatus(refund.status);
        setModalComment(refund.comment || "");
        setIsModalOpen(true);
    };

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        if (!selectedRefund) return;
        setModalSubmitting(true);
        try {
            await api.patch(
                `/api/v1/admin/refunds/${selectedRefund._id}/status`,
                { status: modalStatus, comment: modalComment },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setIsModalOpen(false);
            setSelectedRefund(null);
            fetchRefunds();
        } catch (error) {
            console.error('Error updating refund status:', error);
            alert('Failed to update refund status. Please try again.');
        } finally {
            setModalSubmitting(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'processed': return '#2ecc71';
            case 'pending': return '#f39c12';
            case 'initiated': return '#3498db';
            case 'rejected': return '#e74c3c';
            default: return '#7f8c8d';
        }
    };

    const filteredRefunds = refunds.filter(refund => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const userName = refund.user ? `${refund.user.firstName || ''} ${refund.user.lastName || ''}`.toLowerCase() : '';
        const phone = refund.user?.phoneNumber ? refund.user.phoneNumber.toLowerCase() : '';
        const email = refund.user?.email ? refund.user.email.toLowerCase() : '';
        const holder = refund.bankDetails?.accountHolderName ? refund.bankDetails.accountHolderName.toLowerCase() : '';
        const bankName = refund.bankDetails?.bankName ? refund.bankDetails.bankName.toLowerCase() : '';
        return userName.includes(query) || 
               phone.includes(query) || 
               email.includes(query) || 
               holder.includes(query) || 
               bankName.includes(query);
    });

    return (
        <div className={styles.mainContainer}>
            <Sidebar />
            <div className={styles.userDetailsContent}>
                <Header onSearch={setSearchQuery} />

                <div className={styles.topSection}>
                    <div className={styles.card} style={{ flex: 1 }}>
                        <h3>Total Refund Requests</h3>
                        <p>{totalRefunds}</p>
                    </div>
                    <div className={styles.card} style={{ flex: 1 }}>
                        <h3>Pending Refunds</h3>
                        <p>{pendingCount}</p>
                    </div>
                    <div className={styles.card} style={{ flex: 1 }}>
                        <h3>Total Refund Amount</h3>
                        <p>₹{totalAmount.toLocaleString()}</p>
                    </div>
                </div>

                <div className={styles.searchBar} style={{ justifyContent: 'space-between' }}>
                    <div className={styles.buttonWrapper}>
                        <div className={styles.dropdownWrapper}>
                            <select
                                className={styles.csvDropdown}
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="initiated">Initiated</option>
                                <option value="processed">Processed</option>
                                <option value="rejected">Rejected</option>
                            </select>
                            <span className={styles.dropdownArrow}>▼</span>
                        </div>
                    </div>
                    <div className={styles.buttonWrapper} style={{ gap: '10px' }}>
                        <button className={styles.downloadButton} onClick={handleExport}>
                            Export CSV
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className={styles.loader}>Loading Refunds...</div>
                ) : (
                    <div className={styles.tableResponsive}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>User (Sender)</th>
                                    <th>Phone / Email</th>
                                    <th>Bank Details</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Comment</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRefunds.length > 0 ? (
                                    filteredRefunds.map((refund) => (
                                        <tr key={refund._id} className={styles.tableTr}>
                                            <td>
                                                {refund.user ? `${refund.user.firstName || ''} ${refund.user.lastName || ''}`.trim() : 'N/A'}
                                            </td>
                                            <td>
                                                <div>{refund.user?.phoneNumber || 'N/A'}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>{refund.user?.email || ''}</div>
                                            </td>
                                            <td>
                                                {refund.bankDetails ? (
                                                    <div style={{ fontSize: '0.85rem', textAlign: 'left' }}>
                                                        <div><strong>Holder:</strong> {refund.bankDetails.accountHolderName || 'N/A'}</div>
                                                        <div><strong>Bank:</strong> {refund.bankDetails.bankName || 'N/A'}</div>
                                                        <div><strong>A/C:</strong> {refund.bankDetails.accountNumber || 'N/A'}</div>
                                                        <div><strong>IFSC:</strong> {refund.bankDetails.ifscCode || 'N/A'}</div>
                                                    </div>
                                                ) : 'N/A'}
                                            </td>
                                            <td><strong>₹{refund.amount}</strong></td>
                                            <td>
                                                <span style={{
                                                    backgroundColor: getStatusColor(refund.status),
                                                    color: '#fff',
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 'bold',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {refund.status}
                                                </span>
                                            </td>
                                            <td>{refund.comment || '-'}</td>
                                            <td>
                                                <button
                                                    className={styles.downloadButton}
                                                    style={{ padding: '4px 8px', fontSize: '0.8rem', minWidth: 'auto', width: 'auto' }}
                                                    onClick={() => openUpdateModal(refund)}
                                                >
                                                    Update Status
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No refunds found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {filteredRefunds.length > 0 && (
                    <div className={styles.pagination}>
                        <div className={styles.paginationButtons}>
                            <button
                                className={styles.paginationButton}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                «
                            </button>
                            {Array.from({ length: totalPages || 1 }, (_, i) => (
                                <button
                                    key={i}
                                    className={`${styles.paginationButton} ${currentPage === i + 1 ? styles.paginationButtonActive : ""}`}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                className={styles.paginationButton}
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages || 1))}
                                disabled={currentPage >= (totalPages || 1)}
                            >
                                »
                            </button>
                        </div>
                    </div>
                )}

                {/* Refund Update Modal */}
                {isModalOpen && selectedRefund && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent} style={{ maxWidth: '400px', width: '100%' }}>
                            <h3>Update Refund Status</h3>
                            <form onSubmit={handleUpdateStatus} style={{ textAlign: 'left', marginTop: '15px' }}>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status</label>
                                    <select
                                        value={modalStatus}
                                        onChange={(e) => setModalStatus(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            borderRadius: '4px',
                                            border: '1px solid #ccc',
                                            backgroundColor: '#fff'
                                        }}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="initiated">Initiated</option>
                                        <option value="processed">Processed</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Remark</label>
                                    <textarea
                                        value={modalComment}
                                        onChange={(e) => setModalComment(e.target.value)}
                                        placeholder="Please add transaction details or rejection reason"
                                        rows="3"
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            borderRadius: '4px',
                                            border: '1px solid #ccc',
                                            resize: 'vertical'
                                        }}
                                    />
                                </div>
                                <div className={styles.modalActions} style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                    <button
                                        type="button"
                                        className={styles.cancelButton}
                                        onClick={() => setIsModalOpen(false)}
                                        disabled={modalSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={styles.confirmButton}
                                        style={{ backgroundColor: '#2ecc71' }}
                                        disabled={modalSubmitting}
                                    >
                                        {modalSubmitting ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Refunds;
