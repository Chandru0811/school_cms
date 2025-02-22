import { useEffect, useRef, useState } from "react";
import user from "../../assets/images/user_profile.svg";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import PropTypes from "prop-types";
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { GoPencil } from "react-icons/go";
import { Modal } from "react-bootstrap";
import userImage from "../../assets/images/user_image.png";
import api from "../../config/URL";
import { useFormik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as yup from "yup";
import toast from "react-hot-toast";

function AdminHeader({ handleLogout }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user_name = localStorage.getItem("schoolCMS_name");
  const dropdownRef = useRef(null);
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePasswordClick = () => {
    setIsChangingPassword(true);
    formik.resetForm();
    };

  const handleCancel = () => {
    formik.resetForm();
    setIsChangingPassword(false);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const validationSchema = yup.object().shape({
    password: yup
      .string()
      .min(8, "*Password must be at least 8 characters")
      .required("*Password is required"),
    password_confirmation: yup
      .string()
      .oneOf([yup.ref("password"), null], "*Passwords must match")
      .required("*Confirm your password"),
  });

  const handleClose = () => {
    formik.resetForm();
    setShow(false);}
  const handleShow = () => setShow(true);

  const formik = useFormik({
    initialValues: {
      password: "",
      password_confirmation: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.post("change/password", values);
        if (response.status === 200) {
          toast.success("Password changed successfully!");
          formik.resetForm();
          handleCancel();
        }
      } catch (e) {
        toast.error("Error changing password", e?.response?.data?.error);
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const handelLogOutClick = () => {
    handleLogout();
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get(`profile`);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <header
      className="border-bottom py-3 sticky-top"
      style={{ backgroundColor: "#fff" }}
    >
      <div className="container-fluid">
        <div className="mb-npx">
          <div className="row align-items-center">
            <div className="col-sm-6 col-12 mb-4 mb-sm-0 admin-settings"></div>
            <div className="col-sm-6 col-12 text-sm-end">
              <div className="mx-n1 position-relative" ref={dropdownRef}>
                <span style={{ cursor: "pointer" }} onClick={toggleDropdown}>
                  {/* <FaBell className="me-3" style={{ color: "#8b99b5" }} /> */}
                  <img
                    src={user}
                    className="img-fluid header-user"
                    alt="User"
                    width={40}
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title="Shop"
                    style={{ cursor: "pointer" }}
                  />
                  <span
                    style={{
                      marginLeft: "8px",
                      fontWeight: "500",
                    }}
                  >
                    {user_name}
                  </span>
                  <IoIosArrowDown
                    style={{ fontSize: "16px" }}
                    className={`ms-1 ${isDropdownOpen ? "rotate-icon" : ""}`}
                  />
                </span>

                {isDropdownOpen && (
                  <div className="dropdown-menu show position-absolute end-0 mt-2">
                    <div
                      className="dropdown-item"
                      style={{
                        borderBottom: "1px solid #ddd",
                        paddingBottom: "8px",
                      }}
                    >
                      <span style={{ color: "#bfbebb" }}>
                        Signed in as
                        <br />
                      </span>
                      <span>{user_name}</span>
                    </div>
                    <Link
                      to="/home"
                      className="dropdown-item d-flex align-items-center"
                    >
                      <IoHomeOutline className="me-2" />
                      <span>Home</span>
                    </Link>
                    <Link
                      className="dropdown-item d-flex align-items-center"
                      onClick={handleShow} // Open modal when clicked
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex w-100">
                        <GoPencil className="me-2" />
                        <span>Profile</span>
                      </div>
                    </Link>
                    <Link
                      to="/settings"
                      className="dropdown-item d-flex align-items-center"
                    >
                      <IoSettingsOutline className="me-2" />
                      <span>Settings</span>
                    </Link>
                    <Link
                      className="dropdown-item d-flex align-items-center"
                      onClick={handelLogOutClick}
                      style={{
                        borderTop: "1px solid #ddd",
                      }}
                    >
                      <TbLogout2 className="me-2" />
                      <span>Logout</span>
                    </Link>
                  </div>
                )}

                <Modal show={show} onHide={handleClose} centered>
                  <Modal.Body className="text-center position-relative">
                    {/* Close button at the top-right */}
                    <button
                      onClick={handleClose}
                      className="btn-close position-absolute"
                      style={{
                        top: "10px",
                        right: "10px",
                        zIndex: "10",
                      }}
                    ></button>

                    {!isChangingPassword ? (
                      <>
                        {/* Profile information displayed */}
                        <div className="d-flex flex-column justify-content-center align-items-center">
                          {/* Profile image and edit button */}
                          <div className="position-relative d-inline-block mb-4">
                            <img
                              src={userImage}
                              alt="User Profile"
                              className="img-fluid rounded-circle"
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                              }}
                            />
                            <button
                              className="btn btn-sm btn-button position-absolute"
                              style={{
                                top: "6px",
                                right: "-15px",
                                transform: "translate(-50%, -50%)",
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                padding: "0",
                              }}
                            >
                              <GoPencil />
                            </button>
                          </div>

                          <button
                            type="button"
                            className="btn btn-sm btn-button mb-3"
                            onClick={handleChangePasswordClick}
                          >
                            Change Password
                          </button>
                        </div>

                        {/* User details displayed */}

                        {/* <div className="d-flex justify-content-center align-items-center">
                          <div>

                          </div>
                        </div> */}
                        <div className="row pb-2 justify-content-center">
                          <div className="col-6 p-0 text-center">
                            <p className="text-muted text-sm">{data.name}</p>
                          </div>
                        </div>
                        <div className="row pb-2 justify-content-center">
                          <div className="col-6 p-0 text-center">
                            <p className="text-muted text-sm">{data.email}</p>
                          </div>
                        </div>
                        <div className="row pb-2 justify-content-center">
                          <div className="col-6 p-0 text-center">
                            <p className="text-muted text-sm">{data.mobile}</p>
                          </div>
                        </div>
                        <div className="row pb-2 justify-content-center">
                          <div className="col-6 p-0 text-center">
                            <p className="text-muted text-sm">
                              {data?.school?.name}
                            </p>
                          </div>
                        </div>
                        <div className="row pb-2 justify-content-center">
                          <div className="col-6 p-0 text-center">
                            <p className="text-muted text-sm">
                              {data?.school?.location}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <form onSubmit={formik.handleSubmit}>
                      <div className="text-center">
                        <p>{data.email}</p>
                      </div>
                        <div className="row py-4">
                          {/* New Password Field */}
                          <div className="col-12 mb-3">
                          <div className="text-start">
                            <label className="form-label">
                              New Password
                              <span className="text-danger">*</span>
                            </label>
                            </div>
                            <div className="input-group">
                              <input
                                type={showPassword ? "text" : "password"}
                                className={`form-control form-control-sm ${
                                  formik.touched.password &&
                                  formik.errors.password
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps("password")}
                              />
                              <button
                                type="button"
                                className="input-group-text"
                                onClick={togglePasswordVisibility} // Toggle visibility
                              >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                              </button>
                            </div>
                            {formik.touched.password &&
                              formik.errors.password && (
                                <div className="text-danger text-start">
                                  {formik.errors.password}
                                </div>
                              )}
                          </div>

                          {/* Confirm Password Field */}
                          <div className="col-12 mb-3">
                          <div className="text-start">
                            <label className="form-label">
                              Confirm Password
                              <span className="text-danger">*</span>
                            </label>
                            </div>
                            <div className="input-group">
                              <input
                                type={showConfirmPassword ? "text" : "password"} // Toggle between text and password
                                className={`form-control form-control-sm ${
                                  formik.touched.password_confirmation &&
                                  formik.errors.password_confirmation
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  "password_confirmation"
                                )}
                              />
                              <button
                                type="button"
                                className="input-group-text"
                                onClick={toggleConfirmPasswordVisibility} // Toggle visibility
                              >
                                {showConfirmPassword ? (
                                  <FaEyeSlash />
                                ) : (
                                  <FaEye />
                                )}
                              </button>
                            </div>
                            {formik.touched.password_confirmation &&
                              formik.errors.password_confirmation && (
                                <div className="text-danger text-start">
                                  {formik.errors.password_confirmation}
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="d-flex justify-content-end align-items-center">
                          <button
                            type="button"
                            className="btn btn-sm btn-back"
                            onClick={handleCancel} // Cancel and go back to user details
                          >
                            Cancel
                          </button>
                          &nbsp;&nbsp;
                          <button
                            type="submit"
                            className="btn btn-sm btn-button"
                            disabled={loadIndicator}
                          >
                            {loadIndicator && (
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                aria-hidden="true"
                              ></span>
                            )}
                            Submit
                          </button>
                        </div>
                      </form>
                    )}
                  </Modal.Body>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

AdminHeader.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

export default AdminHeader;
