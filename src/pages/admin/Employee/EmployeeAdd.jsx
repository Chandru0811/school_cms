import * as yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";
import { useEffect, useState } from "react";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { GoTrash } from "react-icons/go";
import { MdKeyboardArrowLeft } from "react-icons/md";

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
    email: yup
      .string()
      .email("*Email is Invlaid")
      .required("*Employee email is required"),
    gender: yup.string().required("*Gender is required"),
    mobile: yup
      .string()
      .matches(
        /^(?:\d{8}|\d{10})$/,
        "*Mobile number must be either 8 or 10 digits"
      )
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
      gender: "",
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
      const response = await api.get("roles/list/full_and_minimal");
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
    <div className="container p-3 common-fonts">
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !formik.isSubmitting) {
            e.preventDefault();
          }
        }}
      >
        {" "}
        <div className="d-flex justify-content-between align-items-center  flex-wrap p-2 my-2">
          <div className="d-flex align-items-center">
            <div>
              <Link to="/employee">
                <button type="button" className="btn btn-sm add-btn p-1">
                  <MdKeyboardArrowLeft size={25} />
                </button>
              </Link>
              &nbsp;&nbsp;
            </div>
            <span className="mx-3 table-heading">
              Add Employee -&nbsp;
              <span className="table-subheading">Add a new Employee</span>
            </span>
          </div>
          <div className="my-2 d-flex align-items-center justify-content-between gap-5">
            <button
              type="button"
              className="btn discard-btn"
              onClick={() => {
                formik.resetForm();
                formik.setErrors({});
                formik.setTouched({}, false);
              }}
            >
              <GoTrash className="trash-icon" />
            </button>
            <button
              type="submit"
              className="btn add-btn"
              disabled={loadIndicator}
            >
              {loadIndicator && (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                ></span>
              )}
              <FiSave className="trash-icon" /> &nbsp;&nbsp; Save Employee
            </button>
          </div>
        </div>
        <div className="card px-md-4 pt-4 pb-md-3" style={{ border: "1px solid #dbd9d0" }}>
          <div className="d-flex justify-content-between px-5 my-2">
            <p className="view-header">Employee Info</p>
          </div>
          <div className="container-fluid px-4">
            <div className="row  py-5">
              <div className="col-md-6 col-12 pe-xl-5">
                <div className="row mb-4">
                  <div className="col-xl-5 col-12 d-flex">
                    <p className="view-label-text">Centre</p>{" "}
                    <span className="text-danger">*</span>
                  </div>
                  <div className="col-xl-7 col-12">
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
                      className={`form-multi-select form-multi-select-sm border-1 rounded-1 ${
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
                </div>
              </div>
              <div className="col-md-6 col-12 ps-xl-5">
                <div className="row mb-4">
                  <div className="col-xl-5 col-12 d-flex">
                    <p className="view-label-text">Role</p>{" "}
                    <span className="text-danger">*</span>
                  </div>
                  <div className="col-xl-7 col-12">
                    <select
                      className={`form-select ${
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
                </div>
              </div>
              <div className="col-md-6 col-12 pe-xl-5">
                <div className="row mb-4">
                  <div className="col-xl-5 col-12 d-flex">
                    <p className="view-label-text"> Employee Name</p>{" "}
                    <span className="text-danger">*</span>
                  </div>
                  <div className="col-xl-7 col-12">
                    <input
                      placeholder="Enter Text"
                      type="text"
                      onKeyDown={(e) => e.stopPropagation()}
                      className={`form-control ${
                        formik.touched.name && formik.errors.name
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("name")}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div className="invalid-feedback">
                        {formik.errors.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 ps-xl-5">
                <div className="row mb-4">
                  <div className="col-xl-5 col-12 d-flex">
                    <p className="view-label-text">Employee Email</p>{" "}
                    <span className="text-danger">*</span>
                  </div>
                  <div className="col-xl-7 col-12">
                    <input
                      placeholder="Enter Text"
                      type="email"
                      onKeyDown={(e) => e.stopPropagation()}
                      className={`form-control ${
                        formik.touched.email && formik.errors.email
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("email")}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="invalid-feedback">
                        {formik.errors.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 pe-xl-5">
                <div className="row mb-4">
                  <div className="col-xl-5 col-12 d-flex">
                    <p className="view-label-text"> Employee Mobile</p>{" "}
                    <span className="text-danger">*</span>
                  </div>
                  <div className="col-xl-7 col-12">
                    <input
                      placeholder="Enter Text"
                      type="text"
                      onKeyDown={(e) => e.stopPropagation()}
                      className={`form-control ${
                        formik.touched.mobile && formik.errors.mobile
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("mobile")}
                    />
                    {formik.touched.mobile && formik.errors.mobile && (
                      <div className="invalid-feedback">
                        {formik.errors.mobile}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 ps-xl-5">
                <div className="row mb-4">
                  <div className="col-5">
                    <label className="form-label view-label-text">
                      Gender <span className="text-danger">*</span>
                    </label>
                  </div>
                  <div className="col-xl-7 col-12 d-flex gap-3">
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="male"
                        name="gender"
                        value="Male"
                        checked={formik.values.gender === "Male"}
                        onChange={formik.handleChange}
                      />
                      <label
                        className="form-check-label view-label-text ms-2 mt-1"
                        htmlFor="male"
                      >
                        Male
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="female"
                        name="gender"
                        value="Female"
                        checked={formik.values.gender === "Female"}
                        onChange={formik.handleChange}
                      />
                      <label
                        className="form-check-label view-label-text ms-2 mt-1"
                        htmlFor="female"
                      >
                        Female
                      </label>
                    </div>
                  </div>
                  <div className="col-12 text-center mx-5">
                    {formik.touched.gender && formik.errors.gender && (
                      <div className="text-danger">{formik.errors.gender}</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 pe-xl-5">
                <div className="row mb-4">
                  <div className="col-xl-5 col-12 d-flex">
                    <p className="view-label-text">Password</p>{" "}
                    <span className="text-danger">*</span>
                  </div>
                  <div className="col-xl-7 col-12">
                    <div className="input-group">
                      <input
                        placeholder="Enter Text"
                        type={showPassword ? "text" : "password"}
                        onKeyDown={(e) => e.stopPropagation()}
                        className={`form-control ${
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
                </div>
              </div>
              <div className="col-md-6 col-12 ps-xl-5">
                <div className="row mb-4">
                  <div className="col-xl-5 col-12 d-flex">
                    <p className="view-label-text">Confirm Password</p>{" "}
                    <span className="text-danger">*</span>
                  </div>
                  <div className="col-xl-7 col-12">
                    <div className="input-group">
                      <input
                        placeholder="Enter Text"
                        type={showConfirmPassword ? "text" : "password"}
                        onKeyDown={(e) => e.stopPropagation()}
                        className={`form-control ${
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
          </div>
        </div>
      </form>
    </div>
  );
}

export default EmployeeAdd;
