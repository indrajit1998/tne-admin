import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import Header from "./Header";
import styles from "./Styles/Dashboard.module.css";
import api from '../Services/Api';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    
    // State for transactions and pagination
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const transactionsPerPage = 10;
    
    // State for search (can be used for transactions later if needed)
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const response = await api.get("/api/v1/admin/getDashboardStats", {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.data && response.data.data) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            }
        };
        fetchDashboardStats();
    }, []);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await api.get(`/api/v1/admin/getTransactionHistory?page=${currentPage}&limit=${transactionsPerPage}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.data) {
                    setTransactionHistory(response.data.data || []);
                    setTotalTransactions(response.data.total || 0);
                    setTotalPages(response.data.totalPages || 1);
                }
            } catch (error) {
                console.error("Failed to fetch transaction history:", error);
            }
        };
        
        const delayDebounce = setTimeout(fetchTransactions, 300);
        return () => clearTimeout(delayDebounce);
    }, [currentPage]); 
    const {
        totalUsers = 0,
        totalEarnings = 0,
        totalTravel = 0,
        totalRequests = 0,
        totalAccepted = 0,
        totalCancelled = 0,
        totalPending = 0,
        totalDelivered = 0,
        totalConsignments = 0,
        totalFeedback = 0,
        totalSupport = 0,
        daily = {},
        monthly = {}
    } = stats || {}; 

    const allCards = [
        { title: "Total Travel", value: totalTravel },
        { title: "Total Consignments", value: totalConsignments },
        { title: "Total Requests", value: totalRequests },
        { title: "Accepted Requests", value: totalAccepted },
        { title: "Pending Requests", value: totalPending },
        { title: "Cancelled Requests", value: totalCancelled },
        { title: "Delivered", value: totalDelivered },
        { title: "Feedback", value: totalFeedback },
        { title: "Support Tickets", value: totalSupport },
        { title: "Daily Requests", value: daily.totalRequests ?? 0 },
        { title: "Daily Accepted", value: daily.accepted ?? 0 },
        { title: "Daily Delivered", value: daily.delivered ?? 0 },
        { title: "Monthly Requests", value: monthly.totalRequests ?? 0 },
        { title: "Monthly Accepted", value: monthly.accepted ?? 0 },
        { title: "Monthly Delivered", value: monthly.delivered ?? 0 },
    ];

    return (
        <div className={styles.dashboardContainer}>
            <Sidebar />
            <div className={styles.dashboardContent}>
                <Header onSearch={setSearchQuery} />

                <div className={styles.topSection}>
                    <div className={styles.card}>
                        <h3>Total Users</h3>
                        <p>{totalUsers}</p>
                    </div>
                    <div className={styles.card}>
                        <h3>Total Earnings</h3>
                        <p>₹{totalEarnings.toFixed(2)}</p>
                    </div>
                    {allCards.map((card, idx) => (
                        <div className={styles.card} key={idx}>
                            <h3>{card.title}</h3>
                            <p>{card.value ?? 0}</p>
                        </div>
                    ))}
                </div>

                <div className={styles.transactionSection}>
                    <h3>Recent Transactions</h3>
                    <div className={styles.transactions}>
                        <div className={styles.transactionHeader}>
                            <p><strong>Customer Name</strong></p>
                            <p><strong>Transaction ID</strong></p>
                            <p><strong>Status</strong></p>
                            <p><strong>Amount</strong></p>
                        </div>
                        {transactionHistory.length > 0 ? transactionHistory.map((transaction) => (
                            <div key={transaction._id} className={styles.transactionItem}>
                                <p>{`${transaction.userId?.firstName || ''} ${transaction.userId?.lastName || 'N/A'}`}</p>
                                <p>{transaction.razorpayPaymentId || 'N/A'}</p>
                                <p className={styles[transaction.status]}>{transaction.status}</p>
                                <p>₹{transaction.amount?.toFixed(2)}</p>
                            </div>
                        )) : <p className={styles.noTransactions}>No transactions found.</p>}
                    </div>
                </div>

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
            </div>
        </div>
    );
};

export default Dashboard;
