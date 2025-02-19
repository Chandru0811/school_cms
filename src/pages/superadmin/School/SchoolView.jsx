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

function SchoolView() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const validationSchema = yup.object().shape({
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    password_confirmation: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm your password"),
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
        toast.success("Status updated successfully!");
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

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-fluid px-0">
      <ol
        className="breadcrumb my-2 d-flex align-items-center"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        <li>
          <Link to="/" className="custom-breadcrumb text-sm">
            Home
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/school" className="custom-breadcrumb text-sm">
            &nbsp;School
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active text-sm" aria-current="page">
          &nbsp;School View
        </li>
      </ol>
      <div className="card vh-100" style={{ border: "1px solid #dbd9d0" }}>
        <div className="d-flex px-4 justify-content-between align-items-center card_header p-2">
          <div className="d-flex align-items-center">
            <div className="d-flex">
              <div className="dot active"></div>
            </div>
            <span className="me-2 text-muted text-sm">View School</span>
          </div>
          <div className="my-2 pe-3 d-flex align-items-center">
            <Link to="/school">
              <button type="button " className="btn btn-sm btn-back">
                Back
              </button>
            </Link>
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
              className="btn btn-sm btn-button"
              onClick={handleShow}
            >
              Change Password
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
                    <div className="invalid-feedback">
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
                      <div className="invalid-feedback">
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
          <div className="loader-container">
            <div className="loader">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        ) : (
          <div className="container-fluid px-4">
            <div className="row pb-3">
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">School Name</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data.name}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">School Location</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data.location}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Admin Name</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data.users[0].name}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Admin Email</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      : {data.users[0].email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Admin Mobile</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      : {data.users[0].mobile}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

SchoolView.propTypes = {
  id: PropTypes.number.isRequired,
};

export default SchoolView;
