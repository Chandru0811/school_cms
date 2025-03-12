import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../../config/URL";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormik } from "formik";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import * as yup from "yup";
import PropTypes from "prop-types";
import ImageURL from "../../../config/ImageURL";
import userImage from "../../../assets/images/user_profile.svg";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { GoTrash } from "react-icons/go";
import { TbEdit } from "react-icons/tb";
import DeleteChange from "../../../components/common/DeleteChange";

function SchoolView() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    formik.resetForm();
    setShow(false);
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      password_confirmation: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const userId = data.users[0].id;
        const response = await api.post(
          `superAdmin/change/password/${userId}`,
          values
        );
        if (response.status === 200) {
          toast.success("Password changed successfully!");
          handleClose();
          formik.resetForm();
          navigate("/");
        }
      } catch (e) {
        toast.error("Error changing password", e?.response?.data?.error);
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const getData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`superAdmin/school/${id}`);
      setData(response.data.data);
    } catch (error) {
      toast.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to Toggle Status
  const handleStatusToggle = async () => {
    try {
      const response = await api.post(`superAdmin/school/status/${id}`);
      if (response.status === 200) {
        toast.success(response.data.message);
        setData((prevData) => ({
          ...prevData,
          active: prevData.active === 1 ? 0 : 1,
        }));
      }
    } catch (error) {
      toast.error("Error updating status!");
      console.error("Status Update Error:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-fluid px-0">
      <div className="d-flex px-4 justify-content-between align-items-center  p-1 mb-4">
        <div className="d-flex align-items-center">
          <div>
            <Link to="/school">
              <button type="button " className="btn btn-sm add-btn">
                <MdKeyboardArrowLeft size={20} />
              </button>
            </Link>
            &nbsp;&nbsp;
          </div>
          <span className="mx-3 table-heading">
            School Details -&nbsp;
            <span className="table-subheading">Details of Selected School</span>
          </span>
        </div>
        <div className="my-2 d-flex align-items-center">
          <button
            className="btn view-delete-btn"
            onClick={() => {
              handleDeleteClick(id);
            }}
          >
            <GoTrash className="trash-icon" /> &nbsp;&nbsp; Delete School
          </button>
        </div>
      </div>
      <div className="mx-4 card vh-100" style={{ border: "1px solid #dbd9d0" }}>
        <div
          className="card-header d-flex justify-content-between"
          style={{ marginBottom: "1px solid #F4F4F4" }}
        >
          <p className="view-header">School Info</p>
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-sm add-btn"
              onClick={handleShow}
            >
              Change Password
            </button>
            &nbsp;&nbsp;
            <button
              className={`btn btn-sm ${
                data.active === 1 ? "btn-danger" : "btn-success"
              }`}
              onClick={handleStatusToggle}
            >
              {data.active === 1 ? "Deactivate" : "Activate"}
            </button>
            &nbsp;&nbsp;
            <button
              type="button"
              className="btn btn-sm edit-btn"
              onClick={() => navigate(`/school/edit/${id}`)}
            >
              <TbEdit style={{ color: "#C0C0C0", fontSize: "16px" }} />
            </button>
          </div>
        </div>
        {/* Modal for Changing Password */}
        <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth>
          <form onSubmit={formik.handleSubmit}>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
              <div className="row">
                {/* New Password Field */}
                <div className="text-center">
                  <p>{data?.users?.[0]?.email || "No email available"}</p>
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label">
                    New Password<span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"} // Toggle between text and password
                      className={`form-control form-control-sm ${
                        formik.touched.password && formik.errors.password
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
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-danger text-start">
                      {formik.errors.password}
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="col-12 mb-3">
                  <label className="form-label">
                    Confirm Password<span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"} // Toggle between text and password
                      className={`form-control form-control-sm ${
                        formik.touched.password_confirmation &&
                        formik.errors.password_confirmation
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("password_confirmation")}
                    />
                    <button
                      type="button"
                      className="input-group-text"
                      onClick={toggleConfirmPasswordVisibility} // Toggle visibility
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
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
            </DialogContent>
            <DialogActions>
              <button
                type="button"
                className="btn btn-sm btn-back"
                onClick={handleClose}
              >
                Cancel
              </button>
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
            </DialogActions>
          </form>
        </Dialog>
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "500px" }}
          >
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="container-fluid px-4">
            <div className="row pb-3">
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">School Name</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value"> {data.name}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">School Location</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value"> {data.location}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Admin Name</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value"> {data.users[0].name}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Admin Email</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value"> {data.users[0].email}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Admin Mobile</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value"> {data.users[0].mobile}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Admin Avatar</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value">
                      {" "}
                      &nbsp;&nbsp;
                      <img
                        src={
                          data.users[0].avatar &&
                          typeof data.users[0].avatar === "string"
                            ? `${ImageURL.replace(
                                /\/$/,
                                ""
                              )}/${data.users[0].avatar.replace(/^\//, "")}`
                            : userImage
                        }
                        alt="Admin Avatar"
                        style={{
                          maxWidth: "100px",
                          height: "auto",
                          borderRadius: "5px",
                        }}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {deleteModalOpen && selectedId && (
        <DeleteChange
          path={`superAdmin/school/delete/${id}`}
          onDeleteSuccess={() => {
            setDeleteModalOpen(false);
            navigate("/student");
          }}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}

SchoolView.propTypes = {
  id: PropTypes.number.isRequired,
};

export default SchoolView;
