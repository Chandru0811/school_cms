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
import { MdKeyboardArrowLeft } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import DeleteChange from "../../../components/common/DeleteChange";
import { GoTrash } from "react-icons/go";
import { TbEdit } from "react-icons/tb";
import userImage from "../../../../src/assets/images/employee_image.png";

function EmployeeView() {
  const [data, setData] = useState({});
  const { id } = useParams();
  const [selectedId, setSelectedId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [centerList, setCenterList] = useState([]);
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };

  const storedScreens = JSON.parse(
    localStorage.getItem("schoolCMS_Permissions") || "{}"
  );

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
      <div className="d-flex px-4 justify-content-between align-items-center  p-1 mb-4">
        <div className="d-flex align-items-center">
          <div>
            <Link to="/employee">
              <button type="button " className="btn btn-sm add-btn">
                <MdKeyboardArrowLeft size={20} />
              </button>
            </Link>
            &nbsp;&nbsp;
          </div>
          <span className="mx-3 table-heading">
            Employee Details -&nbsp;
            <span className="table-subheading">
              Details of Selected Employees
            </span>
          </span>
        </div>
        <div className="my-2 pe-3 d-flex align-items-center">
          {/* <button
            type="button"
            className="btn btn-sm btn-button"
            onClick={handleShow}
          >
            Change Password
          </button>
          &nbsp;&nbsp; */}
          {/* <button
            type="button"
            className="btn btn-sm btn-button"
            onClick={() => navigate(`/employee/edit/${id}`)}
          >
            Edit
          </button> */}
          {storedScreens?.data[1]?.can_delete === 1 && (
            <button
              className="btn view-delete-btn"
              onClick={(e) => {
                handleDeleteClick(id); // Use id from useParams()
              }}
            >
              <GoTrash className="trash-icon" /> &nbsp;&nbsp; Delete Employee
            </button>
          )}
        </div>
      </div>
      <div className="mx-4 card vh-100" style={{ border: "1px solid #dbd9d0" }}>
        <div
          className="card-header d-flex justify-content-between mx-3"
          style={{ marginBottom: "1px solid #F4F4F4" }}
        >
          <p className="view-header">Personal Info</p>
          <div className="d-flex justify-content-end">
            {storedScreens?.data[1]?.can_edit === 1 && (
              <button
                className="btn edit-btn"
                onClick={(e) => {
                  navigate(`/employee/edit/${id}`);
                }}
              >
                <TbEdit style={{ color: "#C0C0C0", fontSize: "16px" }} />
              </button>
            )}
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
              <div className="col-md-2 col-12 my-2 d-flex align-items-center">
                <img
                  src={userImage}
                  alt="Profile"
                  className="img-fluid"
                  style={{
                    width: "300px",
                    height: "300px",
                    objectFit: "cover",
                    border: "1px solid #4F46E5",
                  }}
                />
              </div>

              <div className="col-md-5 col-12 my-2">
                <div className="row mb-4">
                  <div className="col-6">
                    <p className="view-label-text">Centre</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value">
                      {" "}
                      {data.center_names
                        ? JSON.parse(data.center_names).join(", ")
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-6">
                    <p className="view-label-text">Role</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value"> {data.role_name}</p>
                  </div>
                </div>
              </div>

              <div className="col-md-5 col-12 my-2">
                <div className="row mb-4">
                  <div className="col-6">
                    <p className="view-label-text">Employee Name</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value">{data.name}</p>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-6">
                    <p className="view-label-text">Employee Email</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value"> {data.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {deleteModalOpen && selectedId && (
        <DeleteChange
          path={`employee/delete/${id}`}
          onDeleteSuccess={() => {
            setDeleteModalOpen(false);
            navigate("/employee");
          }}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}

EmployeeView.propTypes = {
  id: PropTypes.number.isRequired,
};

export default EmployeeView;
