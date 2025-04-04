import { useState } from "react";
import { NavLink } from "react-router-dom";
import helperlogo from "../../assets/images/logo.webp";
import PropTypes from "prop-types";
import {
  IoGridOutline,
  IoTrophyOutline,
  IoGiftOutline,
  IoLibraryOutline,

} from "react-icons/io5"
import { PiStudentLight } from "react-icons/pi";
import { LiaAwardSolid } from "react-icons/lia";
import { SlBookOpen } from "react-icons/sl";
import { BsPerson } from "react-icons/bs";
import { RiHome6Line } from "react-icons/ri";
import { FiBell } from "react-icons/fi";
import { AiOutlineEdit } from "react-icons/ai";

function AdminSidebar() {
  // const navigate = useNavigate();

  // const handelLogOutClick = () => {
  //   handleLogout();
  //   navigate("/");
  // };
  const storedScreens = JSON.parse(localStorage.getItem("schoolCMS_Permissions") || "{}");
  const schoolCMS_role = localStorage.getItem("schoolCMS_role");
  const schoolCMS_studentid = localStorage.getItem("schoolCMS_studentid");
  const schoolCMS_access = localStorage.getItem("schoolCMS_access");
  console.log("access , studid::", schoolCMS_studentid, schoolCMS_access)
  console.log("access , studid::",  schoolCMS_studentid === "null")
  const [leadMenuOpen] = useState(false);

  const [activeSubmenu] = useState(null);

  return (
    <nav
      className="navbar show navbar-vertical max-h-screen overflow-y-auto navbar-expand-lg p-0 navbar-light border-bottom border-bottom-lg-0 border-end-lg"
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
          className={`navbar-brand nav-logo logo_ats py-lg-2 px-lg-6 m-0 d-flex align-items-center justify-content-center gap-3 ${leadMenuOpen || activeSubmenu ? "active" : ""
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
          <div className="ms-5 me-5 my-3">
            <div className="mb-2">
              <p className="sidebar-heading">DASHBOARD</p>
              <NavLink
                to={
                  schoolCMS_access === "Full Access"
                    ? "/dashboard"
                    : schoolCMS_access === "Limited Access" && schoolCMS_studentid === "null"
                      ? "/studentdash"
                      : schoolCMS_access === "Limited Access"
                        ? "/parentdash"
                        : "/dashboard"
                }
                className={({ isActive }) => `sidebar-navlink ${isActive ? "active" : ""}`}
              >
                <RiHome6Line className="sidebar_icon" size={17} />
                <p>Home</p>
              </NavLink>
            </div>
            <div className="mb-2">
              <p className="sidebar-heading fw-semibold">ADMINISTRATION</p>
              {storedScreens?.data[0]?.can_access === 1 && (
                <NavLink
                  className={({ isActive }) =>
                    `sidebar-navlink ${isActive ? "active" : ""}`
                  }
                  to="/centre"
                >
                  <IoGridOutline className="sidebar_icon" size={17} />
                  <p>Centre</p>
                </NavLink>
              )}{" "}
              {storedScreens?.data[13]?.can_access === 1 && (
                <NavLink
                  className={({ isActive }) =>
                    `sidebar-navlink ${isActive ? "active" : ""}`
                  }
                  to="/subscription"
                >
                  <FiBell />
                  <p>Subscription</p>
                </NavLink>
              )}
            </div>

            <div className="mb-2">
              <p className="sidebar-heading">ACADEMIC</p>
              {storedScreens?.data[2]?.can_access === 1 && (
                <NavLink
                  className={({ isActive }) =>
                    `sidebar-navlink ${isActive ? "active" : ""}`
                  }
                  to="/grade"
                >
                  <LiaAwardSolid className="sidebar_icon" size={17} />
                  <p>Classes/Grades</p>
                </NavLink>
              )}
              {storedScreens?.data[4]?.can_access === 1 && (
                <NavLink
                  className={({ isActive }) =>
                    `sidebar-navlink ${isActive ? "active" : ""}`
                  }
                  to="/subject"
                >
                  <SlBookOpen className="sidebar_icon" size={17} />
                  <p>Subject & Topics</p>
                </NavLink>
              )}
              {storedScreens?.data[3]?.can_access === 1 && (
                <NavLink
                  className={({ isActive }) =>
                    `sidebar-navlink ${isActive ? "active" : ""}`
                  }
                  to="/student"
                >
                  <PiStudentLight className="sidebar_icon" size={17} />
                  <p>Students</p>
                </NavLink>
              )}
            </div>
            <div className="mb-2">
              <p className="sidebar-heading">STAFF</p>
              {storedScreens?.data[1]?.can_access === 1 && (
                <NavLink
                  className={({ isActive }) =>
                    `sidebar-navlink ${isActive ? "active" : ""}`
                  }
                  to="/employee"
                >
                  <BsPerson className="sidebar_icon" size={17} />
                  <p>Employees</p>
                </NavLink>
              )}
            </div>
            <div className="mb-2">
              <p className="sidebar-heading">STUDY MATERIALS</p>
              {storedScreens?.data[6]?.can_access === 1 && (
                <NavLink
                  className={({ isActive }) =>
                    `sidebar-navlink ${isActive ? "active" : ""}`
                  }
                  to="/question"
                >
                  <IoTrophyOutline className="sidebar_icon" size={17} />
                  <p>Questions & Answer</p>
                </NavLink>
              )}
              {storedScreens?.data[7]?.can_access === 1 && (
                <NavLink
                  className={({ isActive }) =>
                    `sidebar-navlink ${isActive ? "active" : ""}`
                  }
                  to="/challenges"
                >
                  <IoTrophyOutline className="sidebar_icon" size={17} />
                  <p>Challenges & Quizzes</p>
                </NavLink>
              )}
              {storedScreens?.data[8]?.can_access === 1 && (
                <NavLink
                  className={({ isActive }) =>
                    `sidebar-navlink ${isActive ? "active" : ""}`
                  }
                  to="/worksheet"
                >
                  <AiOutlineEdit />
                  <p>Study Materials</p>
                </NavLink>
              )}
              {storedScreens?.data[10]?.can_access === 1 && (
                <NavLink
                  className={({ isActive }) =>
                    `sidebar-navlink ${isActive ? "active" : ""}`
                  }
                  to="/homework"
                >
                  <IoLibraryOutline className="sidebar_icon" size={17} />
                  <p>Assignments & Homeworks</p>
                </NavLink>
              )}
            </div>
            <div className="mb-2">
              <p className="sidebar-heading">ENGAGEMENT</p>
              {storedScreens?.data[12]?.can_access === 1 && (
                <NavLink
                  className={({ isActive }) =>
                    `sidebar-navlink ${isActive ? "active" : ""}`
                  }
                  to="/rewards"
                >
                  <IoGiftOutline className="sidebar_icon" size={17} />
                  <p>Rewards</p>
                </NavLink>
              )}
            </div>

            <div className="mb-2">
              {schoolCMS_role == 2 && (
                <NavLink
                  className={({ isActive }) =>
                    `sidebar-navlink ${isActive ? "active" : ""}`
                  }
                  to="/settings"
                >
                  <BsPerson className="sidebar_icon" size={17} />
                  <p>Settings</p>
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

AdminSidebar.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};
export default AdminSidebar;
