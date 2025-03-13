import * as yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import toast from "react-hot-toast";
import api from "../../../config/URL";
import PropTypes from "prop-types";
import { FiAlertTriangle, FiSave } from "react-icons/fi";
import { GoTrash } from "react-icons/go";
import { MdKeyboardArrowLeft } from "react-icons/md";

function EmployeeEdit() {
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState([]);
  const [centerList, setCenterList] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const validationSchema = yup.object().shape({
    center_id: yup
      .array()
      .min(1, "*Select at least one center")
      .required("*Select a center id"),
    role_id: yup.string().required("*Select a role"),
    name: yup.string().required("*Employee name is required"),
    email: yup
      .string()
      .email("*Email is Invalid")
      .required("*Employee email is required"),
    gender: yup.string().required("*Gender is required"),
    mobile: yup
      .string()
      .matches(
        /^(?:\d{8}|\d{10})$/,
        "*Mobile number must be either 8 or 10 digits"
      )
      .required("*Mobile number is required!"),
    //  password: yup
    //    .string()
    //    .required("*Employee password is required")
    //    .min(6, "*Password must be at least 6 characters"),
    //  password_confirmation: yup
    //    .string()
    //    .oneOf([yup.ref("password"), null], "*Passwords must match")
    //    .required("*Employee confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      center_id: [],
      role_id: "",
      name: "",
      email: "",
      mobile: "",
      gender: "",
      // password: "",
      // password_confirmation: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);

      const { created_by, updated_by, ...payload } = values;

      try {
        const response = await api.put(`employee/update/${id}`, payload);

        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/employee");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 422) {
          const errors = error.response.data.errors;
          if (errors) {
            Object.keys(errors).forEach((key) => {
              errors[key].forEach((errorMsg) => {
                toast(errorMsg, {
                  icon: <FiAlertTriangle className="text-warning" />,
                });
              });
            });
          }
        } else {
          toast.error("An error occurred while updating the record.");
        }
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const getEmployeeData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`employee/${id}`);
      const { data } = response.data;

      const parsedCenterIds = JSON.parse(data.center_id || "[]");
      const parsedCenterNames = JSON.parse(data.center_names || "[]");

      const selectedCenters = parsedCenterIds.map((id, index) => ({
        value: id,
        label: parsedCenterNames[index] || "",
      }));

      setSelectedCenter(selectedCenters);

      formik.setValues({
        ...data,
        center_id: selectedCenters.map((center) => center.value),
      });
    } catch (e) {
      toast.error("Error Fetching Data ", e?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

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
    getEmployeeData();
  }, [id]);

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
        {" "}
        <div className="d-flex justify-content-between align-items-center  p-1 mb-4">
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
              Update Employee -&nbsp;
              <span className="table-subheading">Update a Employee</span>
            </span>
          </div>
          <div className="my-2 d-flex align-items-center justify-content-between gap-5">
            <button
              type="button"
              className="btn view-delete-btn"
              onClick={() => {
                getEmployeeData();
              }}
            >
              <GoTrash className="trash-icon" /> &nbsp;&nbsp; Discard Changes
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
        <div className="card" style={{ border: "1px solid #dbd9d0" }}>
          <div className="d-flex justify-content-between px-5 my-2">
            <p className="view-header">Employee Info</p>
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
              <div className="row">
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5 d-flex">
                      <p className="view-label-text">Centre</p>{" "}
                      <span className="text-danger">*</span>
                    </div>
                    <div className="col-7">
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
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5 d-flex">
                      <p className="view-label-text">Role</p>{" "}
                      <span className="text-danger">*</span>
                    </div>
                    <div className="col-7">
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
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5 d-flex">
                      <p className="view-label-text"> Employee Name</p>{" "}
                      <span className="text-danger">*</span>
                    </div>
                    <div className="col-7">
                      <input
                        placeholder="Enter Text"
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
                        <div className="invalid-feedback">
                          {formik.errors.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5 d-flex">
                      <p className="view-label-text">Employee Email</p>{" "}
                      <span className="text-danger">*</span>
                    </div>
                    <div className="col-7">
                      <input
                        placeholder="Enter Text"
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
                        <div className="invalid-feedback">
                          {formik.errors.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5 d-flex">
                      <p className="view-label-text"> Employee Mobile</p>{" "}
                      <span className="text-danger">*</span>
                    </div>
                    <div className="col-7">
                      <input
                        placeholder="Enter Text"
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
                        <div className="invalid-feedback">
                          {formik.errors.mobile}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5">
                      <label className="form-label view-label-text">
                        Gender <span className="text-danger">*</span>
                      </label>
                    </div>
                    <div className="col-7 d-flex gap-3">
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
                          className="form-check-label view-label-text"
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
                          className="form-check-label view-label-text"
                          htmlFor="female"
                        >
                          Female
                        </label>
                      </div>
                    </div>
                    <div className="col-12 text-center mx-5">
                      {formik.touched.gender && formik.errors.gender && (
                        <div className="text-danger">
                          {formik.errors.gender}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default EmployeeEdit;
