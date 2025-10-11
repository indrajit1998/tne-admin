import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from "../Components/Sidebar";
import Header from "./Header";
import styles from "./Styles/Contact.module.css";
import api from '../Services/Api';

const Contact = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [allRequests, setAllRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchSupportRequests = async () => {
            setLoading(true);
            try {
                const response = await api.get('/api/v1/admin/getSupportContacts');
                if (response.data && response.data.success) {
                    setAllRequests(response.data.data);
                } else {
                    setAllRequests([]);
                }
            } catch (error) {
                console.error("Failed to fetch support requests:", error);
                setAllRequests([]); 
            } finally {
                setLoading(false);
            }
        };

        fetchSupportRequests();
    }, []);

    const filteredRequests = useMemo(() => {
        if (!searchQuery) {
            return allRequests;
        }
        return allRequests.filter(item => 
            (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.phone && item.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.message && item.message.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery, allRequests]);

    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const paginatedRequests = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredRequests.slice(startIndex, startIndex + itemsPerPage);
    }, [currentPage, filteredRequests, itemsPerPage]);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    return (
        <div className={styles.mainContainer}>
            <Sidebar />
            <div className={styles.contentWrapper}>
                <Header onSearch={setSearchQuery} />
                <div className={styles.supportContent}>
                    <h1>Contact Requests</h1>
                    
                    <div className={styles.tableContainer}>
                        {loading ? (
                            <div className={styles.loader}>Loading Contact Requests...</div>
                        ) : (
                            <table className={styles.supportTable}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Phone Number</th>
                                        <th>Email</th>
                                        <th>Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedRequests.length > 0 ? (
                                        paginatedRequests.map(item => (
                                            <tr key={item._id}>
                                                <td>{(item.name || 'User Not Found').trim()}</td>
                                                <td>{item.phone || 'Not Available'}</td>
                                                <td>{item.email || 'Not Available'}</td>
                                                <td className={styles.messageCell}>{item.message || 'No message provided.'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className={styles.noResults}>
                                                {searchQuery ? "No requests found matching your search." : "No contact requests available."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className={styles.pagination}>
                        <div className={styles.paginationButtons}>
                            <button 
                                className={styles.paginationButton}
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                                disabled={currentPage === 1}
                            >
                                «
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`${styles.paginationButton} ${currentPage === i + 1 ? styles.activePage : ''}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button 
                                className={styles.paginationButton}
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                                disabled={currentPage >= totalPages}
                            >
                                »
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
