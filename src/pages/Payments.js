import React, { useEffect, useState } from 'react';
import Sidebar from "../Components/Sidebar";
import Header from "./Header";
import styles from "./Styles/UserDetails.module.css";
import api from '../Services/Api';
import * as XLSX from 'xlsx';

const Payments = () => {
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPayouts, setTotalPayouts] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    
    // Stats
    const [pendingCount, setPendingCount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    // Payout Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPayout, setSelectedPayout] = useState(null);
    const [modalStatus, setModalStatus] = useState("pending");
    const [modalComment, setModalComment] = useState("");
    const [modalSubmitting, setModalSubmitting] = useState(false);


    const payoutsPerPage = 10;

    const fetchPayouts = async () => {
        setLoading(true);
        try {
            const statusParam = statusFilter ? `&status=${statusFilter}` : "";
            const response = await api.get(
                `/api/v1/admin/payouts?page=${currentPage}&limit=${payoutsPerPage}${statusParam}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            
            const resultData = response.data.data;
            setPayouts(resultData.data || []);
            setTotalPayouts(resultData.total || 0);
            setTotalPages(resultData.totalPages || 1);

            // Fetch summary stats
            const statsResponse = await api.get(
                `/api/v1/admin/payouts?limit=1000`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            const allPayouts = statsResponse.data.data.data || [];
            setPendingCount(allPayouts.filter(p => p.status === "pending").length);
            setTotalAmount(allPayouts.reduce((acc, curr) => acc + (curr.amount || 0), 0));
        } catch (error) {
            console.error('Error fetching payouts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayouts();
    }, [currentPage, statusFilter]);

    const handleExport = async () => {
        try {
            const statusParam = statusFilter ? `&status=${statusFilter}` : "";
            // Fetch the JSON list of payouts instead of CSV blob
            const response = await api.get(`/api/v1/admin/payouts?limit=10000${statusParam}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const payoutsData = response.data?.data?.data || [];
            
            // Build the data array for XLSX according to IDFC BLKPAY format
            const headers = [
                'Beneficiary Name', 'Beneficiary Account Number', 'IFSC', 'Transaction Type',
                'Debit Account Number', 'Transaction Date', 'Amount', 'Currency',
                'Beneficiary Email ID', 'Remarks', 'Custom Header – 1', 'Custom Header – 2',
                'Custom Header – 3', 'Custom Header – 4', 'Custom Header – 5'
            ];
            
            const instructions = [
                'Enter beneficiary name.\r\nMANDATORY',
                'Enter beneficiary account number. \r\nThis can be IDFC FIRST Bank account or other Bank account.\r\nMANDATORY',
                'Enter beneficiary bank IFSC code. Required only for Inter bank (NEFT/RTGS) payment.',
                'Enter payment type:\r\nIFT - Within Bank payment\r\nNEFT - Inter-Bank(NEFT) payment\r\nRTGS - Inter-Bank(RTGS) payment\r\nMANDATORY',
                'Enter debit account number. This should be IDFC FIRST Bank account only. User should have access to do transaction on this account',
                "Enter transaction value date. Should be today's date or future date.\r\nMANDATORY\r\nDD/MM/YYYY format",
                'Enter payment amount.\r\nMANDATORY',
                'Enter transaction currency. Should be INR only.\r\nMANDATORY',
                'Enter beneficiary email id\r\nOPTIONAL',
                'Enter remarks\r\nOPTIONAL',
                'Credit Advice:\r\nEnter Custom Info -1\r\nNote: Header label is editable in Row 1\r\nOPTIONAL',
                'Credit Advice:\r\nEnter Custom Info -2\r\nNote: Header label is editable in Row 1\r\nOPTIONAL',
                'Credit Advice:\r\nEnter Custom Info -3\r\nNote: Header label is editable in Row 1\r\nOPTIONAL',
                'Credit Advice:\r\nEnter Custom Info -4\r\nNote: Header label is editable in Row 1\r\nOPTIONAL',
                'Credit Advice:\r\nEnter Custom Info -5\r\nNote: Header label is editable in Row 1\r\nOPTIONAL'
            ];

            const date = new Date();
            const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
            
            const rows = payoutsData.map(payout => {
                const bankName = payout.bankDetails?.bankName?.toLowerCase() || '';
                const isIdfc = bankName.includes("idfc");
                // Rule: If IDFC then IFT, otherwise NEFT (RTGS if amount > 2L)
                const txnType = isIdfc ? "IFT" : (payout.amount >= 200000 ? "RTGS" : "NEFT");

                return [
                    payout.bankDetails?.accountHolderName || payout.user?.firstName || '',
                    payout.bankDetails?.accountNumber || '',
                    payout.bankDetails?.ifscCode || '',
                    txnType,
                    '', // Debit Account Number (to be filled by admin)
                    formattedDate,
                    payout.amount || 0,
                    'INR',
                    payout.user?.email || '',
                    `Payout ${payout._id}`,
                    '', '', '', '', ''
                ];
            });

            const worksheetData = [headers, instructions, ...rows];
            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "BulkPay");

            // Generate filename BLKPAY_YYYYMMDD.xlsx
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const fileName = `BLKPAY_${yyyy}${mm}${dd}.xlsx`;

            XLSX.writeFile(workbook, fileName);
            
        } catch (error) {
            console.error('Error exporting payouts:', error);
            alert('Failed to export payouts.');
        }
    };

    const openUpdateModal = (payout) => {
        setSelectedPayout(payout);
        setModalStatus(payout.status);
        setModalComment(payout.comment || "");
        setIsModalOpen(true);
    };

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        if (!selectedPayout) return;
        setModalSubmitting(true);
        try {
            await api.patch(
                `/api/v1/admin/payouts/${selectedPayout._id}/status`,
                { status: modalStatus, comment: modalComment },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setIsModalOpen(false);
            setSelectedPayout(null);
            fetchPayouts();
        } catch (error) {
            console.error('Error updating payout status:', error);
            alert('Failed to update payout status. Please try again.');
        } finally {
            setModalSubmitting(false);
        }
    };


    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return '#2ecc71';
            case 'pending': return '#f39c12';
            case 'initiated': return '#3498db';
            case 'rejected': return '#e74c3c';
            default: return '#7f8c8d';
        }
    };

    const filteredPayouts = payouts.filter(payout => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const userName = payout.user ? `${payout.user.firstName || ''} ${payout.user.lastName || ''}`.toLowerCase() : '';
        const phone = payout.user?.phoneNumber ? payout.user.phoneNumber.toLowerCase() : '';
        const email = payout.user?.email ? payout.user.email.toLowerCase() : '';
        const holder = payout.bankDetails?.accountHolderName ? payout.bankDetails.accountHolderName.toLowerCase() : '';
        const bankName = payout.bankDetails?.bankName ? payout.bankDetails.bankName.toLowerCase() : '';
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
                        <h3>Total Payout Requests</h3>
                        <p>{totalPayouts}</p>
                    </div>
                    <div className={styles.card} style={{ flex: 1 }}>
                        <h3>Pending Requests</h3>
                        <p>{pendingCount}</p>
                    </div>
                    <div className={styles.card} style={{ flex: 1 }}>
                        <h3>Total Payout Amount</h3>
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
                                <option value="paid">Paid</option>
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
                    <div className={styles.loader}>Loading Payouts...</div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Phone / Email</th>
                                <th>Bank Details</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Comment</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayouts.length > 0 ? (
                                filteredPayouts.map((payout) => (
                                    <tr key={payout._id} className={styles.tableTr}>
                                        <td>
                                            {payout.user ? `${payout.user.firstName || ''} ${payout.user.lastName || ''}`.trim() : 'N/A'}
                                        </td>
                                        <td>
                                            <div>{payout.user?.phoneNumber || 'N/A'}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>{payout.user?.email || ''}</div>
                                        </td>
                                        <td>
                                            {payout.bankDetails ? (
                                                <div style={{ fontSize: '0.85rem', textAlign: 'left' }}>
                                                    <div><strong>Holder:</strong> {payout.bankDetails.accountHolderName || 'N/A'}</div>
                                                    <div><strong>Bank:</strong> {payout.bankDetails.bankName || 'N/A'}</div>
                                                    <div><strong>A/C:</strong> {payout.bankDetails.accountNumber || 'N/A'}</div>
                                                    <div><strong>IFSC:</strong> {payout.bankDetails.ifscCode || 'N/A'}</div>
                                                </div>
                                            ) : 'N/A'}
                                        </td>
                                        <td><strong>₹{payout.amount}</strong></td>
                                        <td>
                                            <span style={{
                                                backgroundColor: getStatusColor(payout.status),
                                                color: '#fff',
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase'
                                            }}>
                                                {payout.status}
                                            </span>
                                        </td>
                                        <td>{payout.comment || '-'}</td>
                                        <td>
                                            <button
                                                className={styles.downloadButton}
                                                style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                                                onClick={() => openUpdateModal(payout)}
                                            >
                                                Update Status
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No payouts found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}

                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <div className={styles.paginationButtons}>
                            <button
                                className={styles.paginationButton}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                «
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
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
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage >= totalPages}
                            >
                                »
                            </button>
                        </div>
                    </div>
                )}

                {/* Payout Update Modal */}
                {isModalOpen && selectedPayout && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent} style={{ maxWidth: '400px', width: '100%' }}>
                            <h3>Update Payout Status</h3>
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
                                        <option value="paid">Paid</option>
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

export default Payments;
