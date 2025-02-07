import { useState } from "react";
import { NavLink } from "react-router-dom";
import helperlogo from "../../assets/images/logo.webp";
import PropTypes from "prop-types";
import {
  FaChartBar,
  FaRegFileAlt,
} from "react-icons/fa";
import { IoGiftOutline, IoLibraryOutline, IoTrophyOutline } from "react-icons/io5";


function StudentSideBar() {
  const [leadMenuOpen] = useState(false);

  const [activeSubmenu] = useState(null);

  return (
    <nav
      className="navbar show navbar-vertical navbar-expand-lg p-0 navbar-light border-bottom border-bottom-lg-0 border-end-lg"
      id="navbarVertical"
    >
      <div className="container-fluid">
        <button
          className="navbar-toggler mx-2 p-1"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarCollapse"
          aria-controls="sidebarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <NavLink
          className={`navbar-brand nav-logo logo_ats py-lg-2 px-lg-6 m-0 d-flex align-items-center justify-content-center gap-3 ${
            leadMenuOpen || activeSubmenu ? "active" : ""
          }`}
          to="/"
        >
          <img
            src={helperlogo}
            alt="deals"
            className="img-fluid sidebar-logo"
            style={{
              background: "#fff",
              borderRadius: "5px",
            }}
          />
        </NavLink>
        <div className="collapse navbar-collapse" id="sidebarCollapse">
          <ul className="navbar-nav">
            <li className="nav-item px-3">
              <NavLink
                className="nav-link"
                style={{ borderRadius: "5px" }}
                to="/dashboard"
              >
                <FaChartBar className="sidebar_icon" />
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item px-3">
              <NavLink
                className="nav-link"
                style={{ borderRadius: "5px" }}
                to="/worksheet"
              >
                <FaRegFileAlt className="sidebar_icon" />
                Worksheet
              </NavLink>
            </li>
            <li className="nav-item px-3">
              <NavLink
                className="nav-link"
                style={{ borderRadius: "5px" }}
                to="/homework"
              >
                <IoLibraryOutline className="sidebar_icon" />
                Homework
              </NavLink>
            </li>
            <li className="nav-item px-3">
              <NavLink
                className="nav-link"
                style={{ borderRadius: "5px" }}
                to="/challenges"
              >
                <IoTrophyOutline className="sidebar_icon" />
                Challenges
              </NavLink>
            </li>
            <li className="nav-item px-3">
              <NavLink
                className="nav-link"
                style={{ borderRadius: "5px" }}
                to="/rewards"
              >
                <IoGiftOutline className="sidebar_icon" />
                Rewards
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

StudentSideBar.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};
export default StudentSideBar;
