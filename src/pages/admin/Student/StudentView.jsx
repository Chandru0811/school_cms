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
import { MdKeyboardArrowLeft } from "react-icons/md";
import { GoTrash } from "react-icons/go";
import { TbEdit } from "react-icons/tb";
import DeleteChange from "../../../components/common/DeleteChange";
import ImageURL from "../../../config/ImageURL";

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
  const [selectedId, setSelectedId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
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

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };

  return (
    <div className="container-fluid px-0">
      <div className="d-flex px-4 justify-content-between align-items-center  p-1 mb-4">
        <div className="d-flex align-items-center">
          <div>
            <Link to="/student">
              <button type="button " className="btn btn-sm add-btn">
                <MdKeyboardArrowLeft size={20} />
              </button>
            </Link>
            &nbsp;&nbsp;
          </div>
          <span className="mx-3 table-heading">
            Student Details -&nbsp;
            <span className="table-subheading">
              Details of Selected Student
            </span>
          </span>
        </div>
        <div className="my-2 d-flex align-items-center">
          {storedScreens?.data[1]?.can_delete === 1 && (
            <button
              className="btn view-delete-btn"
              onClick={() => {
                handleDeleteClick(id);
              }}
            >
              <GoTrash className="trash-icon" /> &nbsp;&nbsp; Delete Student
            </button>
          )}
        </div>
      </div>
      <div className="mx-4 card vh-100" style={{ border: "1px solid #dbd9d0" }}>
        <div
          className="card-header d-flex justify-content-between"
          style={{ marginBottom: "1px solid #F4F4F4" }}
        >
          <p className="view-header">Student Info</p>
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-sm add-btn"
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
                  className="btn btn-sm add-btn"
                  onClick={handleParentShow}
                >
                  Change Parent Password
                </button>
              </>
            )}
            {storedScreens?.data[1]?.can_edit === 1 && (
              <button
                className="btn edit-btn ms-2"
                onClick={() => {
                  navigate(`/student/edit/${id}`);
                }}
              >
                <TbEdit style={{ color: "#C0C0C0", fontSize: "16px" }} />
              </button>
            )}
          </div>
        </div>
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
                    <p className="view-label-text">Centre</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value"> {data.center_name}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Role</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value"> {data.role_name}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Student Profile</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value">
                      
                      {data?.student?.avatar.image ? (
                        <img
                          src={`${ImageURL.replace(
                            /\/$/,
                            ""
                          )}/${data.student.avatar.image.replace(/^\//, "")}`}
                          alt="Avatar"
                          style={{
                            maxWidth: "50%",
                            height: "auto",
                            borderRadius: "5px",
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Student First Name</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value"> {data.first_name}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Student Middle Name</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value"> {data.middle_name || "--"}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Student Last Name</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value"> {data.last_name}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Student Email</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value text-break">
                      {data?.student?.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Student Mobile Number</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value text-break">
                      {data?.student?.mobile}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Student Gender</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value text-break">
                       {data?.student?.gender}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Parent Name</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value text-break">{data?.parent_name}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Parent Email</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value text-break">
                      {data?.parent_email || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Parent Mobile Number</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value text-break">
                      {data?.parent_mobile || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Parent Profile</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value">
                      
                      {data?.parent?.avatar?.image ? (
                        <img
                          src={`${ImageURL.replace(
                            /\/$/,
                            ""
                          )}/${data.parent.avatar.image.replace(/^\//, "")}`}
                          alt="Avatar"
                          style={{
                            maxWidth: "50%",
                            height: "auto",
                            borderRadius: "5px",
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Parent Gender</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value text-break">
                       {data?.parent_gender || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Grade</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value"> {data.grade_name}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Subscriptions</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value">
                      :
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
                    className={`form-control form-control-sm ${
                      parentFormik.touched.password &&
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
                    className={`form-control form-control-sm ${
                      parentFormik.touched.password_confirmation &&
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

      {deleteModalOpen && selectedId && (
        <DeleteChange
          path={`student/delete/${id}`}
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

StudentView.propTypes = {
  id: PropTypes.number.isRequired,
};

export default StudentView;
