import { useState } from "react";
import { NavLink } from "react-router-dom";
import helperlogo from "../../assets/images/logo.webp";
import { BsBarChart } from "react-icons/bs";
import PropTypes from "prop-types";
import { IoSchoolOutline } from "react-icons/io5";

function SuperAdminSidebar() {
  // const navigate = useNavigate();

  // const handelLogOutClick = () => {
  //   handleLogout();
  //   navigate("/");
  // };

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
        <div className="collapse navbar-collapse ms-5 me-5 my-3" id="sidebarCollapse">
          <div className="mb-2">
            <p className="sidebar-heading">DASHBOARD</p>
            <NavLink
              className={({ isActive }) =>
                `sidebar-navlink ${isActive ? "active" : ""}`
              }
              to="/dashboard"
            >
              <BsBarChart className="sidebar_icon" />
              <p>Home</p>
            </NavLink>
          </div>
          <div className="mb-2">
            <p className="sidebar-heading fw-semibold">School</p>
            <NavLink
              className={({ isActive }) =>
                `sidebar-navlink ${isActive ? "active" : ""}`
              }
              to="/school"
            >
              <IoSchoolOutline className="sidebar_icon" />
              Schools
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

SuperAdminSidebar.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};
export default SuperAdminSidebar;
