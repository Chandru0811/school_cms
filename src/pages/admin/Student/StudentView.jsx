import { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function StudentView() {
  const [data, setData] = useState({});
  const { id } = useParams();
  const [show, setShow] = useState(false);
  const [showParent, setShowParent] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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

  const validationParentSchema = yup.object().shape({
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

  const handleParentShow = () => {
    setShowParent(true);
  };

  const handleParentClose = () => {
    parentFormik.resetForm();
    setShowParent(false);
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
        const response = await api.post(
          `admin/change/password/${data.user_id}`,
          values
        );
        if (response.status === 200) {
          handleClose();
          toast.success("Password changed successfully!");
        }
      } catch (e) {
        toast.error("Error changing password", e?.response?.data?.error);
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const parentFormik = useFormik({
    initialValues: {
      password: "",
      password_confirmation: "",
    },
    validationSchema: validationParentSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.post(
          `admin/change/password/${data.parent_id}`,
          values
        ); // Use parent_id for password change
        if (response.status === 200) {
          toast.success("Parent password changed successfully!");
          handleParentClose();
        }
      } catch (e) {
        toast.error("Error changing parent password", e?.response?.data?.error);
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const getData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`student/${id}`);
      const studentData = response.data.data; // Get student data
      setData(studentData); // Set student data to state
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch student details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

  return (
    <div className="container-fluid px-0">
      <ol
        className="breadcrumb my-2 px-2  d-flex align-items-center"
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        <li className="d-flex align-items-center">
          <Link to="/" className="custom-breadcrumb text-sm">
            Home
          </Link>
          <span className="breadcrumb-separator mx-1"> &gt; </span>
        </li>
        <li className="d-flex align-items-center">
          <Link to="/student" className="custom-breadcrumb text-sm">
            &nbsp;Student
          </Link>
          <span className="breadcrumb-separator mx-1"> &gt; </span>
        </li>
        <li className="breadcrumb-item active text-sm" aria-current="page">
          &nbsp;Student View
        </li>
      </ol>
      <div className="card vh-100" style={{ border: "1px solid #dbd9d0" }}>
        <div className="d-flex px-4 justify-content-between align-items-center card_header p-1 mb-4">
          <div className="d-flex align-items-center">
            <div className="d-flex">
              <div className="dot active"></div>
            </div>
            <span className="me-2 text-muted">View Student</span>
          </div>
          <div className="my-2 pe-3 d-flex align-items-center">
            <Link to="/student">
              <button type="button " className="btn btn-sm btn-back">
                Back
              </button>
            </Link>
            &nbsp;&nbsp;
            <button
              type="button"
              className="btn btn-sm btn-button"
              onClick={handleShow}
            >
              Change Student Password
            </button>
            &nbsp;&nbsp;
            {data.parent_email === null ? (
              <></>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-sm btn-button"
                  onClick={handleParentShow}
                >
                  Change Parent Password
                </button>
              </>
            )}
            &nbsp;&nbsp;
            <button
              type="button"
              className="btn btn-sm btn-button"
              onClick={() => navigate(`/student/edit/${id}`)}
            >
              Edit
            </button>
          </div>
        </div>

        {/* Modal for Changing Student Password */}
        <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth>
          <form onSubmit={formik.handleSubmit}>
            <DialogTitle>Change Student Password</DialogTitle>
            <DialogContent>
              {/* Student password fields */}
              <div className="text-center">
                <p>{data.student?.email}</p>
              </div>
              <div className="row">
                <div className="col-12 mb-3">
                  <label className="form-label">
                    New Password<span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control form-control-sm ${formik.touched.password && formik.errors.password
                        ? "is-invalid"
                        : ""
                        }`}
                      {...formik.getFieldProps("password")}
                    />
                    <button
                      type="button"
                      className="input-group-text"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-danger">{formik.errors.password}</div>
                  )}
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label">
                    Confirm Password<span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className={`form-control form-control-sm ${formik.touched.password_confirmation &&
                        formik.errors.password_confirmation
                        ? "is-invalid"
                        : ""
                        }`}
                      {...formik.getFieldProps("password_confirmation")}
                    />
                    <button
                      type="button"
                      className="input-group-text"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {formik.touched.password_confirmation &&
                    formik.errors.password_confirmation && (
                      <div className="text-danger">
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

        {/* Modal for Changing Parent Password */}
        <Dialog
          open={showParent}
          onClose={handleParentClose}
          maxWidth="sm"
          fullWidth
        >
          <form onSubmit={parentFormik.handleSubmit}>
            <DialogTitle>Change Parent Password</DialogTitle>
            <DialogContent>
              {/* Parent password fields */}
              <div className="text-center">
                <p>{data.parent?.email}</p>
              </div>
              <div className="row">
                <div className="col-12 mb-3">
                  <label className="form-label">
                    New Password<span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control form-control-sm ${parentFormik.touched.password &&
                        parentFormik.errors.password
                        ? "is-invalid"
                        : ""
                        }`}
                      {...parentFormik.getFieldProps("password")}
                    />
                    <button
                      type="button"
                      className="input-group-text"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {parentFormik.touched.password &&
                    parentFormik.errors.password && (
                      <div className="text-danger">
                        {parentFormik.errors.password}
                      </div>
                    )}
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label">
                    Confirm Password<span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className={`form-control form-control-sm ${parentFormik.touched.password_confirmation &&
                        parentFormik.errors.password_confirmation
                        ? "is-invalid"
                        : ""
                        }`}
                      {...parentFormik.getFieldProps("password_confirmation")}
                    />
                    <button
                      type="button"
                      className="input-group-text"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {parentFormik.touched.password_confirmation &&
                    parentFormik.errors.password_confirmation && (
                      <div className="text-danger">
                        {parentFormik.errors.password_confirmation}
                      </div>
                    )}
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <button
                type="button"
                className="btn btn-sm btn-back"
                onClick={handleParentClose}
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
            <div className="loader"></div>
          </div>
        ) : (
          <div className="container-fluid px-4">
            <div className="row pb-3">
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Centre</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data.center_name}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Role</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data.role_name}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Student First Name</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data.first_name}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Student Middle Name</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data.middle_name || "--"}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Student Last Name</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data.last_name}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Student Email</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm text-break">
                      : {data?.student?.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Student Mobile Number</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm text-break">
                      : {data?.student?.mobile}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Parent Name</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm text-break">
                      : {data?.parent_name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Parent Email</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm text-break">
                      : {data?.parent_email || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Parent Mobile Number</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm text-break">
                      : {data?.parent_mobile || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Grade</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data.grade_name}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Subscriptions</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      :{"--"}
                      {data.subscriptions_names
                        ? JSON.parse(data.subscriptions_names).join(", ")
                        : ""}
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

StudentView.propTypes = {
  id: PropTypes.number.isRequired,
};

export default StudentView;
