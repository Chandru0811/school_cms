import { useEffect, useRef, useState } from "react";
import user from "../../assets/images/user_profile.svg";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowDown, IoMdNotificationsOutline } from "react-icons/io";
import PropTypes from "prop-types";
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import { TbEdit, TbLogout2 } from "react-icons/tb";
import { GoMail, GoPencil } from "react-icons/go";
import { Modal } from "react-bootstrap";
import api from "../../config/URL";
import { useFormik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as yup from "yup";
import toast from "react-hot-toast";
import ImageURL from "../../config/ImageURL";

function AdminHeader({ handleLogout }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const user_name = localStorage.getItem("schoolCMS_name");
  const dropdownRef = useRef(null);
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [profiledata, setProfileData] = useState([]);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isprofile, setIsProfile] = useState(false);

  const schoolCMS_role = localStorage.getItem("schoolCMS_role");

  const handleChangePasswordClick = () => {
    setIsChangingPassword(true);
    formik.resetForm();
  };

  const handleCancel = () => {
    setIsProfile(false);
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
    setIsProfile(false);
    formik.resetForm();
    setIsChangingPassword(false);
    setShow(false);
  };

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

  const profileData = async () => {
    try {
      const response = await api.get(`avatars`);
      setProfileData(response.data.data);
      setIsProfile(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateAvatar = async () => {
    if (selectedAvatar && selectedAvatar !== data.avatar_id) {
      setLoadIndicator(true);
      try {
        const response = await api.post("avatar/update", { avatar_id: selectedAvatar });
        if (response.status === 200) {
          toast.success(response.data.message);
          fetchData();
          handleCancel();
        }
      } catch (error) {
        toast.error("Error updating avatar", error?.response?.data?.error);
      } finally {
        setLoadIndicator(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <header
      className="border-bottom py-3 sticky-top"
      style={{ backgroundColor: "#e0e7ff" }}
    >
      <div className="container-fluid">
        <div className="mb-npx">
          <div className="row align-items-center m-0">
            <div className="col-sm-6 col-12 mb-md-4 admin-settings"></div>
            <div className="col-sm-6 col-12 text-sm-end">
              <div className="mx-n1 position-relative" ref={dropdownRef}>
                <span className="me-5">
                  <GoMail size={25} />
                </span>
                <span className="me-5">
                  <IoMdNotificationsOutline size={25} />
                </span>
                <span style={{ cursor: "pointer" }} onClick={toggleDropdown}>
                  {/* <FaBell className="me-3" style={{ color: "#8b99b5" }} /> */}
                  {/* <img
                    src={user}
                    className="img-fluid header-user"
                    alt="User"
                    width={40}
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    style={{ cursor: "pointer" }}
                  /> */}
                  <img
                    src={
                      data?.avatar?.image
                        ? `${ImageURL.replace(/\/$/, "")}/${data?.avatar?.image.replace(/^\//, "")}`
                        : user
                    }
                    // alt="profile"
                    // style={{
                    //   width: "80px",
                    //   height: "80px",
                    //   borderRadius: "50%",
                    //   objectFit: "cover",
                    // }}
                    className="img-fluid header-user"
                    alt="User"
                    width={40}
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    style={{ cursor: "pointer", borderRadius: "50%", objectFit: "cover" }}
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
                      <GoPencil className="me-2" />
                      <span>Profile</span>
                    </Link>
                    {schoolCMS_role == 2 && (
                      <Link
                        to="/settings"
                        className="dropdown-item d-flex align-items-center"
                      >
                        <IoSettingsOutline className="me-2" />
                        <span>Settings</span>
                      </Link>
                    )}

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

                <Modal
                  show={show}
                  onHide={handleClose}
                  centered
                  backdrop="static"
                >
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
                              src={
                                data?.avatar?.image
                                  ? `${ImageURL.replace(/\/$/, "")}/${data?.avatar?.image.replace(/^\//, "")}`
                                  : user
                              }
                              alt="profile"
                              style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                            <button
                              className="btn edit-btn position-absolute d-flex align-items-center justify-content-center"
                              style={{
                                top: "8px",
                                right: "-20px",
                                transform: "translate(-50%, -50%)",
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                padding: "0",
                              }}
                              onClick={profileData}
                            >
                              <TbEdit style={{ color: "#4F46E5", fontSize: "16px" }} size={16} />
                            </button>
                          </div>
                        </div>

                        {isprofile ? (
                          <>
                            <div className="row py-4">
                              {profiledata.map((profile) => (
                                <div
                                  key={profile.id}
                                  className="col-2 text-center avatarImage"
                                  onClick={() => setSelectedAvatar(profile.id)}
                                >
                                  <img
                                    src={`${ImageURL.replace(/\/$/, "")}/${profile.image.replace(/^\//, "")}`}
                                    alt={profile.name}
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      borderRadius: "8px",
                                      objectFit: "cover",
                                      cursor: "pointer",
                                      border: selectedAvatar === profile.id ? "1.5px solid #4F46E5" : "none",
                                      padding: "5px",

                                    }}
                                  />
                                  <p className="text-muted text-sm">{profile.name}</p>
                                </div>
                              ))}
                            </div>
                            <div className="d-flex justify-content-end align-items-center">
                              <button type="button" className="btn btn-sm btn-back" onClick={handleCancel}>
                                Back
                              </button>
                              &nbsp;&nbsp;
                              <button
                                type="submit"
                                className="btn btn-sm btn-button"
                                disabled={loadIndicator}
                                onClick={updateAvatar}
                              >
                                {loadIndicator && (
                                  <span
                                    className="spinner-border spinner-border-sm me-2"
                                    aria-hidden="true"
                                  ></span>
                                )}
                                Update
                              </button>
                            </div>
                          </>
                        ) : (<>
                          <button
                            type="button"
                            className="btn btn-sm btn-button mb-3"
                            onClick={handleChangePasswordClick}
                          >
                            Change Password
                          </button>

                          <div className="row pb-2 justify-content-center">
                            <div className="col-6 text-start pe-2">
                              <p className="text-muted text-sm">Name</p>
                            </div>
                            <div className="col-6 text-start ps-2">
                              <p className="text-muted text-sm">: {data.name}</p>
                            </div>
                          </div>

                          <div className="row pb-2 justify-content-center">
                            <div className="col-6 text-start pe-2">
                              <p className="text-muted text-sm">Email</p>
                            </div>
                            <div className="col-6 text-start ps-2">
                              <p className="text-muted text-sm">: {data.email}</p>
                            </div>
                          </div>

                          <div className="row pb-2 justify-content-center">
                            <div className="col-6 text-start pe-2">
                              <p className="text-muted text-sm">Mobile</p>
                            </div>
                            <div className="col-6 text-start ps-2">
                              <p className="text-muted text-sm">
                                : {data.mobile}
                              </p>
                            </div>
                          </div>

                          <div className="row pb-2 justify-content-center">
                            <div className="col-6 text-start pe-2">
                              <p className="text-muted text-sm">School Name</p>
                            </div>
                            <div className="col-6 text-start ps-2">
                              <p className="text-muted text-sm">
                                : {data?.school?.name}
                              </p>
                            </div>
                          </div>

                          <div className="row pb-2 justify-content-center">
                            <div className="col-6 text-start pe-2">
                              <p className="text-muted text-sm">
                                School Location
                              </p>
                            </div>
                            <div className="col-6 text-start ps-2">
                              <p className="text-muted text-sm">
                                : {data?.school?.location}
                              </p>
                            </div>
                          </div>
                        </>
                        )}

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
                                className={`form-control form-control-sm ${formik.touched.password &&
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
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
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
                                className={`form-control form-control-sm ${formik.touched.password_confirmation &&
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
                                  <FaEye />
                                ) : (
                                  <FaEyeSlash />
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
