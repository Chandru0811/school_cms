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

function EmployeeView() {
  const [data, setData] = useState({});
  const { id } = useParams();
  const [centerList, setCenterList] = useState([]);
  const [show, setShow] = useState(false);
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
        const response = await api.post(`admin/change/password/${id}`, values);
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

  const getEmployeeData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`employee/${id}`);
      setData(response.data.data);
    } catch (e) {
      const errorMessage =
        e?.response?.data?.error || "Error Fetching Data. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // const getCenterList = async () => {
  //   try {

  //     const response = await api.get("centers/list");
  //     setCenterList(response.data.data);
  //   } catch (e) {
  //     toast.error(
  //       `Error Fetching Centers: ${e?.response?.data?.error || e.message}`
  //     );
  //   }
  // };

  useEffect(() => {
    getEmployeeData();
    // getCenterList();
  }, [id]);

  const centerFind = (name) => {
    const FName = [];
    try {
      const centerIds = JSON.parse(name);
      centerIds.forEach((id) => {
        const center = centerList.find((center) => center.id === id);
        if (center) {
          FName.push(center.name);
        }
      });
    } catch (error) {
      console.error("Invalid JSON format:", error);
    }
    return FName.join(", ");
  };

  return (
    <div className="container-fluid px-0">
      <ol
        className="breadcrumb my-2 px-2 d-flex align-items-center"
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
          <Link to="/employee" className="custom-breadcrumb text-sm">
            Employee
          </Link>
          <span className="breadcrumb-separator mx-1"> &gt; </span>
        </li>
        <li className="breadcrumb-item active text-sm" aria-current="page">
          Employee View
        </li>
      </ol>
      <div className="card vh-100" style={{ border: "1px solid #dbd9d0" }}>
        <div className="d-flex px-4 justify-content-between align-items-center card_header p-1 mb-4">
          <div className="d-flex align-items-center">
            <div className="d-flex">
              <div className="dot active"></div>
            </div>
            <span className="me-2 text-muted">View Employee</span>
          </div>
          <div className="my-2 pe-3 d-flex align-items-center">
            <Link to="/employee">
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
              Change Password
            </button>
            &nbsp;&nbsp; 
            <button
              type="button"
              className="btn btn-sm btn-button"
              onClick={() => navigate(`/employee/edit/${id}`)}
            >
              Edit
            </button>
          </div>
        </div>

        {/* Modal for Changing Password */}
        <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth>
          <form onSubmit={formik.handleSubmit}>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
              <>
                <div className="row">
                  {/* New Password Field */}
                  <div className="text-center">
                    <p>{data.email}</p>
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
                      <div className="text-danger">
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
                        <div className="text-danger">
                          {formik.errors.password_confirmation}
                        </div>
                      )}
                  </div>
                </div>
              </>
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
                    <p className="text-muted text-sm">
                    :{" "}
                    {data.center_names
                      ? JSON.parse(data.center_names).join(", ")
                      : ""}
                    </p>
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
                    <p className="fw-medium text-sm">Employee Name</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data.name}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Employee Email</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data.email}</p>
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

EmployeeView.propTypes = {
  id: PropTypes.number.isRequired,
};

export default EmployeeView;
