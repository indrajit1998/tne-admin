// import React from "react";
// import {
//   FaHome,
//   FaMoneyBillAlt,
//   FaUserAlt, 
//   FaMoneyBillWave,
//   FaFileAlt,
//   FaUsers
// } from "react-icons/fa";
// import { Link, useLocation } from "react-router-dom"; // Import useLocation for current route
// import styles from "../pages/Styles/Sidebar.module.css";

// const Sidebar = () => {
//   const location = useLocation();

//   return (
//     <div className={styles.sidebar} style={{ borderRight: "2px solid grey" }}>
//       <div className={styles.sidebarLogo}>
//         <div className={styles.logo}>Travel & Earn</div>
//       </div>
//       <ul className={styles.sidebarMenu}>
//         <li className={styles.sidebarMenuItem}>
//           <Link
//             to="/dashboard"
//             className={`${styles.sidebarLink} ${
//               location.pathname === "/dashboard" ? styles.sidebarLinkActive : ""
//             }`}
//           >
//             <FaHome className={styles.sidebarIcon} /> Dashboard
//           </Link>
//         </li>
//         <li className={styles.sidebarMenuItem}>
//           <Link
//             to="/user-management"
//             className={`${styles.sidebarLink} ${
//               location.pathname === "/user-management" ? styles.sidebarLinkActive : ""
//             }`}
//           >
//             <FaUserAlt className={styles.sidebarIcon} /> User Management
//           </Link>
//         </li>
//         <li className={styles.sidebarMenuItem}>
//           <Link
//             to="/management"
//             className={`${styles.sidebarLink} ${
//               location.pathname === "/management" ? styles.sidebarLinkActive : ""
//             }`}
//           >
//             <FaUserAlt className={styles.sidebarIcon} /> Management
//           </Link>
//         </li>
//         <li className={styles.sidebarMenuItem}>
//           <Link
//             to="/sales-dashboard"
//             className={`${styles.sidebarLink} ${
//               location.pathname === "/sales-dashboard" ? styles.sidebarLinkActive : ""
//             }`}
//           >
//             <FaUserAlt className={styles.sidebarIcon} /> Sales Dashboard
//           </Link>
//         </li>
//         {/* <li className={styles.sidebarMenuItem}>
//           <Link
//             to="/logistics-dashboard"
//             className={`${styles.sidebarLink} ${
//               location.pathname === "/logistics-dashboard" ? styles.sidebarLinkActive : ""
//             }`}
//           >
//             <FaMoneyBillAlt className={styles.sidebarIcon} /> Tracking
//           </Link>
//         </li> */}
//         <li className={styles.sidebarMenuItem}>
//           <Link
//             to="/priceControl"
//             className={`${styles.sidebarLink} ${
//               location.pathname === "/priceControl" ? styles.sidebarLinkActive : ""
//             }`}
//           >
//             <FaMoneyBillWave className={styles.sidebarIcon} /> Pricing Control
//           </Link>
//         </li>
//         <li className={styles.sidebarMenuItem}>
//           <Link
//             to="/reports"
//             className={`${styles.sidebarLink} ${
//               location.pathname === "/reports" ? styles.sidebarLinkActive : ""
//             }`}
//           >
//             <FaFileAlt className={styles.sidebarIcon} /> Reports
//           </Link>
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;

// {
//   /* <div className="sidebar">
//   <div className="sidebar-logo">
//     <div className="logo">Tracking</div>
//   </div>
//   <ul className="sidebar-menu">
//     <li>
//       <Link
//         to="/dashboard"
//         className={`sidebar-link ${
//           location.pathname === "/dashboard" ? "active" : ""
//         }`}
//       >
//         <FaHome className="sidebar-icon" /> Dashboard
//       </Link>
//     </li>

//     <li>
//       <Link
//         to="/payments"
//         className={`sidebar-link ${
//           location.pathname === "/payments" ? "active" : ""
//         }`}
//       >
//         <FaMoneyBillAlt className="sidebar-icon" /> Customer Management
//       </Link>
//     </li>
//     <li>
//       <Link
//         to="/payments"
//         className={`sidebar-link ${
//           location.pathname === "/payments" ? "active" : ""
//         }`}
//       >
//         <FaMoneyBillAlt className="sidebar-icon" /> Management
//       </Link>
//     </li>
//     <li>
//       <Link
//         to="/payments"
//         className={`sidebar-link ${
//           location.pathname === "/payments" ? "active" : ""
//         }`}
//       >
//         <FaMoneyBillAlt className="sidebar-icon" /> Support
//       </Link>
//     </li>
//     <li>
//       <Link
//         to="/payments"
//         className={`sidebar-link ${
//           location.pathname === "/payments" ? "active" : ""
//         }`}
//       >
//         <FaMoneyBillAlt className="sidebar-icon" /> Payments
//       </Link>
//     </li>
//   </ul>
// </div>; */
// }

import React from "react";
import {
  FaHome,
  FaMoneyBillAlt,
  FaUserAlt,
  FaMoneyBillWave,
  FaFileAlt,
  FaUsers,
  FaHeadset // Added for Support
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import styles from "../pages/Styles/Sidebar.module.css";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className={styles.sidebar} style={{ borderRight: "2px solid grey" }}>
      <div className={styles.sidebarLogo}>
        <div className={styles.logo}>Travel & Earn</div>
      </div>
      <ul className={styles.sidebarMenu}>
        <li className={styles.sidebarMenuItem}>
          <Link
            to="/dashboard"
            className={`${styles.sidebarLink} ${
              location.pathname === "/dashboard" ? styles.sidebarLinkActive : ""
            }`}
          >
            <FaHome className={styles.sidebarIcon} /> Dashboard
          </Link>
        </li>
        <li className={styles.sidebarMenuItem}>
          <Link
            to="/user-management"
            className={`${styles.sidebarLink} ${
              location.pathname === "/user-management" ? styles.sidebarLinkActive : ""
            }`}
          >
            <FaUserAlt className={styles.sidebarIcon} /> User Management
          </Link>
        </li>
        <li className={styles.sidebarMenuItem}>
          <Link
            to="/management"
            className={`${styles.sidebarLink} ${
              location.pathname === "/management" ? styles.sidebarLinkActive : ""
            }`}
          >
            <FaUserAlt className={styles.sidebarIcon} /> Management
          </Link>
        </li>
        <li className={styles.sidebarMenuItem}>
          <Link
            to="/sales-dashboard"
            className={`${styles.sidebarLink} ${
              location.pathname === "/sales-dashboard" ? styles.sidebarLinkActive : ""
            }`}
          >
            <FaUserAlt className={styles.sidebarIcon} /> Sales Dashboard
          </Link>
        </li>
        <li className={styles.sidebarMenuItem}>
          <Link
            to="/priceControl"
            className={`${styles.sidebarLink} ${
              location.pathname === "/priceControl" ? styles.sidebarLinkActive : ""
            }`}
          >
            <FaMoneyBillWave className={styles.sidebarIcon} /> Pricing Control
          </Link>
        </li>
        <li className={styles.sidebarMenuItem}>
          <Link
            to="/reports"
            className={`${styles.sidebarLink} ${
              location.pathname === "/reports" ? styles.sidebarLinkActive : ""
            }`}
          >
            <FaFileAlt className={styles.sidebarIcon} /> Reports
          </Link>
        </li>

        {/* --- ADDED FEEDBACK AND SUPPORT TABS --- */}
        <li className={styles.sidebarMenuItem}>
          <Link
            to="/feedback"
            className={`${styles.sidebarLink} ${
              location.pathname === "/feedback" ? styles.sidebarLinkActive : ""
            }`}
          >
            <FaUsers className={styles.sidebarIcon} /> Feedback
          </Link>
        </li>
        <li className={styles.sidebarMenuItem}>
          <Link
            to="/contact"
            className={`${styles.sidebarLink} ${
              location.pathname === "/contact" ? styles.sidebarLinkActive : ""
            }`}
          >
            <FaHeadset className={styles.sidebarIcon} /> Contact
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
