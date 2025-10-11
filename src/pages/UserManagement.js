import React, { useEffect, useState } from 'react';
import Sidebar from "../Components/Sidebar";
import Header from "./Header";
import styles from "./Styles/UserDetails.module.css";
import api from '../Services/Api';
import {
  exportTableToExcel,
  exportTableToPDF,
  exportTableToCSV,
} from './Utils/download';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [modalLoading, setModalLoading] = useState(false);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [totalUsers, setTotalUsers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const usersPerPage = 5;

    const [selectedFormat, setSelectedFormat] = useState('CSV');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/api/v1/admin/manageUsers?page=${currentPage}&limit=${usersPerPage}&search=${searchQuery}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setUsers(response.data.data);
                setTotalUsers(response.data.totalCount);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };
        
        const delayDebounce = setTimeout(fetchUsers, 300); 

        return () => clearTimeout(delayDebounce);
    }, [currentPage, searchQuery]);

    // Handler to open the modal and fetch the selected user's full details
    const handleViewDetailsClick = async (userToView) => {
        setIsModalOpen(true);
        setModalLoading(true);
        try {
            const response = await api.get(`/api/v1/admin/userDetails/${userToView._id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSelectedUser(response.data); 
        } catch (error) {
            console.error("Failed to fetch user details:", error);
            setSelectedUser(null); 
        } finally {
            setModalLoading(false);
        }
    };


    const handleDeleteConfirm = async () => {
        if (!selectedUser?.user?._id) return;
        if (window.confirm("Are you sure you want to permanently delete this user and all their associated data?")) {
            try {
                await api.delete(`/api/v1/admin/deleteUser/${selectedUser.user._id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                
                setUsers(users.filter((u) => u._id !== selectedUser.user._id));
                setTotalUsers(prev => prev - 1);
                handleModalClose();

            } catch (error) {
                console.error('Error deleting user:', error);
                alert("Failed to delete user. Please try again.");
            }
        }
    };

    // Handler to close the modal and reset state
    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleDownload = () => {
        const tableId = 'user-table';
        if (selectedFormat === 'CSV') {
            exportTableToCSV(tableId, users, 'user_data.csv');
        } else if (selectedFormat === 'Excel') {
            exportTableToExcel(tableId, 'Users', 'user_data.xlsx');
        } else if (selectedFormat === 'PDF') {
            exportTableToPDF(tableId, 'User Data', 'user_data.pdf');
        }
    };
    return (
        <div className={styles.mainContainer}>
            <Sidebar />
            <div className={styles.userDetailsContent}>
                <Header onSearch={setSearchQuery} />

                <div className={styles.topSection}>
                    <div className={styles.card}>
                        <h3>Total Users</h3>
                        <p>{totalUsers}</p>
                    </div>
                </div>

                <div className={styles.searchBar}>
                    <div className={styles.buttonWrapper}>
                        <div className={styles.dropdownWrapper}>
                            <select
                                className={styles.csvDropdown}
                                value={selectedFormat}
                                onChange={(e) => setSelectedFormat(e.target.value)}
                            >
                                <option value="CSV">CSV</option>
                                <option value="Excel">Excel</option>
                                <option value="PDF">PDF</option>
                            </select>
                            <span className={styles.dropdownArrow}>▼</span>
                        </div>
                        <button className={styles.downloadButton} onClick={handleDownload}>
                            Download
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className={styles.loader}>Loading...</div>
                ) : (
                    <table id="user-table" className={styles.table}>
                        <thead>
                            <tr>
                                <th>Traveller</th>
                                <th>Phone Number</th>
                                <th>Email</th>
                                <th>Total Rating</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className={styles.tableTr}>
                                    <td>{`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A'}</td>
                                    <td>{user.phoneNumber || "N/A"}</td>
                                    <td>{user.email || "N/A"}</td>
                                    <td>{user.totalRating || 0}</td>
                                    <td>
                                        <button className={styles.actionButton} onClick={() => handleViewDetailsClick(user)}>
                                            <span className={styles.editIcon}>👁️</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

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

                {isModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            {modalLoading ? (
                                <div className={styles.loader}>Loading Details...</div>
                            ) : selectedUser ? (
                                <>
                                    <h3>User Details</h3>
                                    <div className={styles.driverInfo}>
                                        <p><strong>Name:</strong> {`${selectedUser.user?.firstName || ''} ${selectedUser.user?.lastName || ''}`.trim() || 'N/A'}</p>
                                        <p><strong>Email:</strong> {selectedUser.user?.email || "N/A"}</p>
                                        <p><strong>Phone:</strong> {selectedUser.user?.phoneNumber || "N/A"}</p>
                                        <p><strong>Total Rating:</strong> {selectedUser.user?.totalRating || 0}</p>
                                        <p><strong>User ID:</strong> {selectedUser.user?._id || "N/A"}</p>
                                    </div>

                                    <h3 className={styles.travelHistoryHeader}>Travel History ({selectedUser.travels?.length || 0})</h3>
                                    <div className={styles.travelHistory}>
                                        {selectedUser.travels && selectedUser.travels.length > 0 ? (
                                            selectedUser.travels.map((travel) => (
                                                <div key={travel._id} className={styles.travelCard}>
                                                    <div className={styles.travelHeader}>
                                                        <span className={styles.travelId}>Trip ID: ...{String(travel._id).slice(-10)}</span>
                                                        <span className={`${styles.status} ${styles[travel.status]}`}>
                                                            {travel.status.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className={styles.travelDetails}>
                                                        <p><strong>From:</strong> {travel.fromAddress.city}, {travel.fromAddress.state}</p>
                                                        <p><strong>To:</strong> {travel.toAddress.city}, {travel.toAddress.state}</p>
                                                        <p><strong>Vehicle:</strong> {travel.modeOfTravel} ({travel.vehicleNumber || 'N/A'})</p>
                                                        <p>
                                                          <strong>Scheduled:</strong> {new Date(travel.expectedStartDate).toLocaleString()} - {new Date(travel.expectedEndDate).toLocaleString()}
                                                        </p>
                                                        <p><strong>Consignments:</strong> {travel.consignmentDetails?.length || 0}</p>
                                                    </div>
                                                    
                                                    {/* --- THIS IS THE NEWLY ADDED SECTION --- */}
                                                    {travel.consignmentDetails && travel.consignmentDetails.length > 0 && (
                                                        <div className={styles.consignments}>
                                                            <h4>Consignment Details:</h4>
                                                            {travel.consignmentDetails.map((consignment) => (
                                                                <div key={consignment._id} className={styles.consignment}>
                                                                    <p><strong>ID:</strong> ...{String(consignment._id).slice(-12)}</p>
                                                                    <p><strong>Status:</strong> {consignment.status}</p>
                                                                    <p><strong>Weight:</strong> {consignment.weight} {consignment.weightUnit}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className={styles.noTravels}>No travel history found</p>
                                        )}
                                    </div>

                                    <div className={styles.modalActions}>
                                        <button className={styles.confirmButton} onClick={handleDeleteConfirm}>Delete User</button>
                                        <button className={styles.cancelButton} onClick={handleModalClose}>Close</button>
                                    </div>
                                </>
                            ) : <p>Could not load user details. An error may have occurred.</p>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;

