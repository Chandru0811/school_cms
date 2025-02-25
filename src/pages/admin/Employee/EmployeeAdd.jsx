import * as yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";
import { useEffect, useState } from "react";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function EmployeeAdd() {
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState([]);
  const navigate = useNavigate();
  const [centerList, setCenterList] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const validationSchema = yup.object().shape({
    center_id: yup
      .array()
      .min(1, "*Select at least one center")
      .required("*Select a center id"),
    role_id: yup.string().required("*Select a role"),
    name: yup.string().required("*Employee name is required"),
    email: yup.string().email("*Email is Invlaid").required("*Employee email is required"),
    mobile: yup.string()
    .matches(/^(?:\d{8}|\d{10})$/, "*Mobile number must be either 8 or 10 digits")
    .required("*Mobile number is required!"),  
    password: yup
      .string()
      .required("*Employee password is required")
      .min(6, "*Password must be at least 6 characters"),
    password_confirmation: yup
      .string()
      .oneOf([yup.ref("password"), null], "*Passwords must match")
      .required("*Employee confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      center_id: [],
      role_id: "",
      name: "",
      email: "",
      mobile: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      setLoadIndicator(true);
      try {
        const response = await api.post("employee", values);
        console.log(response.status);

        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/employee");
        }
      } catch (e) {
        if (e?.response?.data?.error) {
          Object.values(e.response.data.error).forEach((errorMessages) => {
            errorMessages.forEach((errorMessage) => {
              toast.error(errorMessage);
            });
          });
        } else {
          toast.error("Error Fetching Data");
        }
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const getCenterList = async () => {
    try {
      const response = await api.get("centers/list");
      const formattedCenters = response.data.data.map((center) => ({
        value: center.id,
        label: center.name,
      }));

      setCenterList(formattedCenters);
    } catch (e) {
      toast.error("Error Fetching Data ", e?.response?.data?.error);
    }
  };

  const getRoleList = async () => {
    try {
      const response = await api.get("admin/roles/list");
      const formattedRoles = response.data.data.map((role) => ({
        value: role.id,
        label: role.name,
      }));

      setRoles(formattedRoles);
    } catch (e) {
      toast.error("Error Fetching Data ", e?.response?.data?.error);
    }
  };
  useEffect(() => {
    getCenterList();
    getRoleList();
  }, []);
  return (
    <div className="container p-3">
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !formik.isSubmitting) {
            e.preventDefault();
          }
        }}
      >
        <ol
          className="breadcrumb my-3 text-sm"
          style={{ listStyle: "none", padding: 0, margin: 0 }}
        >
          <li>
            <Link to="/" className="custom-breadcrumb">
              Home
            </Link>
            <span className="breadcrumb-separator"> &gt; </span>
          </li>
          <li className="breadcrumb-item active text-sm" aria-current="page">
            <Link to="/employee" className="custom-breadcrumb">
              &nbsp;Employee
            </Link>
          </li>
          <span className="breadcrumb-separator"> &gt; </span>
          <li className="breadcrumb-item active text-sm" aria-current="page">
            &nbsp;Employee Add
          </li>
        </ol>
        <div className="card" style={{ border: "1px solid #dbd9d0" }}>
          <div className="d-flex px-4 justify-content-between align-items-center card_header p-1 mb-4">
            <div className="d-flex align-items-center">
              <div className="d-flex">
                <div className="dot active"></div>
              </div>
              <span className="me-2 text-muted">Add Employee</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/employee">
                <button type="button " className="btn btn-sm btn-back">
                  Back
                </button>
              </Link>
              &nbsp;&nbsp;
              <button
                type="submit"
                className="btn btn-button btn-sm"
                disabled={loadIndicator}
              >
                {loadIndicator && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  ></span>
                )}
                Save
              </button>
            </div>
          </div>
          <div className="container-fluid px-4">
            <div className="row">
              <div className="col-md-6 col-12 mb-4">
                <label className="form-label">
                  Centre<span className="text-danger">*</span>
                </label>
                <MultiSelect
                  options={centerList}
                  value={selectedCenter}
                  onChange={(selected) => {
                    setSelectedCenter(selected);
                    formik.setFieldValue(
                      "center_id",
                      selected.map((option) => option.value)
                    );
                  }}
                  labelledBy="Select Service"
                  className={`form-multi-select form-multi-select-sm ${
                    formik.touched.center_id && formik.errors.center_id
                      ? "is-invalid"
                      : ""
                  }`}
                />
                {formik.touched.center_id && formik.errors.center_id && (
                  <div className="invalid-feedback">
                    {formik.errors.center_id}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Role<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${
                    formik.touched.role_id && formik.errors.role_id
                      ? "is-invalid"
                      : ""
                  }`}
                  value={formik.values.role_id} // Ensure it's bound to formik values
                  onChange={(e) =>
                    formik.setFieldValue("role_id", e.target.value)
                  }
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>

                {formik.touched.role_id && formik.errors.role_id && (
                  <div className="invalid-feedback">
                    {formik.errors.role_id}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Employee Name<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.name && formik.errors.name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("name")}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="invalid-feedback">{formik.errors.name}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Employee Email<span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.email && formik.errors.email
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="invalid-feedback">{formik.errors.email}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Employee Mobile<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.mobile && formik.errors.mobile
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("mobile")}
                />
                {formik.touched.mobile && formik.errors.mobile && (
                  <div className="invalid-feedback">{formik.errors.mobile}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Password<span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    onKeyDown={(e) => e.stopPropagation()}
                    className={`form-control form-control-sm ${
                      formik.touched.password && formik.errors.password
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("password")}
                  />
                  <span
                    className="input-group-text iconInputBackground"
                    id="basic-addon1"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer", borderRadius: "3px" }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <div className="text-danger">
                    {formik.errors.password}
                  </div>
                )}
              </div>

              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Confirm Password<span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    onKeyDown={(e) => e.stopPropagation()}
                    className={`form-control form-control-sm ${
                      formik.touched.password_confirmation &&
                      formik.errors.password_confirmation
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("password_confirmation")}
                  />
                  <span
                    className="input-group-text iconInputBackground"
                    id="basic-addon1"
                    onClick={toggleConfirmPasswordVisibility}
                    style={{ cursor: "pointer", borderRadius: "3px" }}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {formik.touched.password_confirmation &&
                  formik.errors.password_confirmation && (
                    <div className="text-danger">
                      {formik.errors.password_confirmation}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EmployeeAdd;
