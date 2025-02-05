import { useState } from "react";
import { NavLink } from "react-router-dom";
import helperlogo from "../../assets/images/logo.webp";
import { BsBarChart } from "react-icons/bs";
import PropTypes from "prop-types";
import { IoSchoolOutline } from "react-icons/io5";
import { AiOutlineAppstore } from "react-icons/ai";
import { FaQuestionCircle, FaRegCommentDots, FaBook,  FaRegStar, FaBookOpen} from "react-icons/fa";



function AdminSidebar() {
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
        <div className="collapse navbar-collapse" id="sidebarCollapse">
          <ul className="navbar-nav">
            <li className="nav-item px-3">
              <NavLink
                className="nav-link"
                style={{ borderRadius: "5px" }}
                to="/dashboard"
              >
                <BsBarChart className="sidebar_icon" />
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item px-3">
              <NavLink
                className="nav-link"
                style={{ borderRadius: "5px" }}
                to="/center"
              >
                <AiOutlineAppstore  className="sidebar_icon" />
                Center
              </NavLink>
            </li>
            <li className="nav-item px-3">
              <NavLink
                className="nav-link"
                style={{ borderRadius: "5px" }}
                to="/grade"
              >
                <FaRegStar className="sidebar_icon" />
                Grade
              </NavLink>
            </li>
            <li className="nav-item px-3">
              <NavLink
                className="nav-link"
                style={{ borderRadius: "5px" }}
                to="/student"
              >
                <IoSchoolOutline className="sidebar_icon" />
                Student
              </NavLink>
            </li>
            <li className="nav-item px-3">
              <NavLink
                className="nav-link"
                style={{ borderRadius: "5px" }}
                to="/subject"
              >
                <FaBook   className="sidebar_icon" />
                Subject
              </NavLink>
            </li>
            <li className="nav-item px-3">
              <NavLink
                className="nav-link"
                style={{ borderRadius: "5px" }}
                to="/topic"
              >
                <FaBookOpen  className="sidebar_icon" />
                Topic
              </NavLink>
            </li>
            <li className="nav-item px-3">
              <NavLink
                className="nav-link"
                style={{ borderRadius: "5px" }}
                to="/question"
              >
                <FaQuestionCircle  className="sidebar_icon" />
                Question & Answer
              </NavLink>
            </li>
            <li className="nav-item px-3">
              <NavLink
                className="nav-link"
                style={{ borderRadius: "5px" }}
                to="/challenges"
              >
                <FaRegCommentDots  className="sidebar_icon" />
                Challenges
              </NavLink>
            </li>
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
