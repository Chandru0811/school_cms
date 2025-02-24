import { useState } from "react";
import { NavLink } from "react-router-dom";
import helperlogo from "../../assets/images/logo.webp";
import PropTypes from "prop-types";
import {
  IoHelpCircleOutline,
  IoGridOutline,
  IoBarChart,
  IoTrophyOutline,
  IoGiftOutline,
  IoCardOutline,
  IoLibraryOutline,

} from "react-icons/io5"
import { PiStudentLight } from "react-icons/pi";
import { FaRegFileAlt } from "react-icons/fa";
import { LiaAwardSolid } from "react-icons/lia";
import { PiNotePencilDuotone } from "react-icons/pi";
import { SlBookOpen } from "react-icons/sl";
import { BsPerson } from "react-icons/bs";

function AdminSidebar() {
  // const navigate = useNavigate();

  // const handelLogOutClick = () => {
  //   handleLogout();
  //   navigate("/");
  // };
  const storedScreens = JSON.parse(localStorage.getItem("schoolCMS_Permissions") || "{}");

  const [leadMenuOpen] = useState(false);

  const [activeSubmenu] = useState(null);

  return (
    <nav
      className="navbar show navbar-vertical navbar-expand-lg p-0 navbar-light border-bottom border-bottom-lg-0 border-end-lg sidebar"
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
          <ul className="navbar-nav">
            <li className="nav-item px-3">
              <NavLink
                className="nav-link"
                style={{ borderRadius: "5px" }}
                to="/dashboard"
              >
                <IoBarChart className="sidebar_icon" />
                Dashboard
              </NavLink>
            </li>
            {storedScreens?.data[0]?.can_access === 1 &&
              <li className="nav-item px-3">
                <NavLink
                  className="nav-link"
                  style={{ borderRadius: "5px" }}
                  to="/center"
                >
                  <IoGridOutline className="sidebar_icon" />
                  Centre
                </NavLink>
              </li>
            }
            {storedScreens?.data[1]?.can_access === 1 &&
              <li className="nav-item px-3">
                <NavLink
                  className="nav-link"
                  style={{ borderRadius: "5px" }}
                  to="/employee"
                >
                  <BsPerson className="sidebar_icon" />
                  Employee
                </NavLink>
              </li>
            }
            {storedScreens?.data[2]?.can_access === 1 &&
              <li className="nav-item px-3">
                <NavLink
                  className="nav-link"
                  style={{ borderRadius: "5px" }}
                  to="/grade"
                >
                  <LiaAwardSolid className="sidebar_icon" />
                  Grade
                </NavLink>
              </li>
            }
            {storedScreens?.data[4]?.can_access === 1 &&
              <li className="nav-item px-3">
                <NavLink
                  className="nav-link"
                  style={{ borderRadius: "5px" }}
                  to="/subject"
                >
                  <SlBookOpen className="sidebar_icon" />
                  Subject
                </NavLink>
              </li>
            }
            {storedScreens?.data[5]?.can_access === 1 &&
              <li className="nav-item px-3">
                <NavLink
                  className="nav-link"
                  style={{ borderRadius: "5px" }}
                  to="/topic"
                >
                  <PiNotePencilDuotone className="sidebar_icon" />
                  Topic
                </NavLink>
              </li>
            }
            {storedScreens?.data[3]?.can_access === 1 &&
              <li className="nav-item px-3">
                <NavLink
                  className="nav-link"
                  style={{ borderRadius: "5px" }}
                  to="/student"
                >
                  <PiStudentLight className="sidebar_icon" />
                  Student
                </NavLink>
              </li>
            }
            {storedScreens?.data[6]?.can_access === 1 &&
              <li className="nav-item px-3">
                <NavLink
                  className="nav-link"
                  style={{ borderRadius: "5px" }}
                  to="/question"
                >
                  <IoHelpCircleOutline className="sidebar_icon" />
                  Question & Answer
                </NavLink>
              </li>
            }
            {storedScreens?.data[7]?.can_access === 1 &&
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
            }
            {storedScreens?.data[8]?.can_access === 1 &&
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
            }
            {storedScreens?.data[10]?.can_access === 1 &&
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
            }
            {storedScreens?.data[12]?.can_access === 1 &&
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
            }
            {/* {storedScreens?.data[15]?.can_access === 1 &&
              <li className="nav-item px-3">
                <NavLink
                  className="nav-link"
                  style={{ borderRadius: "5px" }}
                  to="/subscriptions"
                >
                  <IoCardOutline className="sidebar_icon" />
                  Subscriptions
                </NavLink>
              </li>
            } */}
            {/* <li className="nav-item px-3">
              <NavLink
                className="nav-link"
                style={{ borderRadius: "5px" }}
                to="/school"
              >
                <IoSchoolOutline className="sidebar_icon" />
                School
              </NavLink>
            </li>
            <li className="nav-item px-3">
              <NavLink
                className="nav-link"
                style={{ borderRadius: "5px" }}
                to="/role"
              >
                <IoSchoolOutline className="sidebar_icon" />
                Role
              </NavLink>
            </li> */}
          </ul>
          {/* <div className="ps-4 mt-auto w-100 mb-4">
            <div className="navbar-nav">
              <div className="nav-item">
                <button
                  to={"#"}
                  style={{ width: "100%" }}
                  className="nav-link ps-6 logout_button"
                  onClick={handelLogOutClick}
                >
                  <BiLogOut />
                  &nbsp;&nbsp; Logout
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </nav>
  );
}

AdminSidebar.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};
export default AdminSidebar;
