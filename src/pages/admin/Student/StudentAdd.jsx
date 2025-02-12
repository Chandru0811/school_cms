import * as yup from "yup";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { useState } from "react";
import { MultiSelect } from "react-multi-select-component";


function StudentAdd() {
    const [selectedServices, setSelectedServices] = useState([]);
  
    const serviceOption = [
      { value: "1", label: "SRDK" },
      { value: "2", label: "KVM" },
      { value: "3", label: "KCS" },
      { value: "4", label: "PAK" },
    ];

  const validationSchema = yup.object().shape({
    center_id: yup.string().required("*Select a center name"),
    role: yup.string().required("*Select a role"),
    student_first_name: yup
      .string()
      .required("*Student first name is required"),
    student_email: yup.string().required("*Student email is required"),
    student_mobile: yup.string().required("*Student mobile is required"),
    parent_name: yup.string().required("*Parent name is required"),
    parent_email: yup.string().required("*Parent email is required"),
    parent_number: yup.string().required("*Parent number is required"),
    grader_list: yup.string().required("*Grader list is required"),
    roll_no: yup.string().required("*Roll number is required"),
    admission_no: yup.string().required("*Admission number is required"),
  });

  const formik = useFormik({
    initialValues: {
      center_id: "",
      role: "",
      student_first_name: "",
      student_last_name: "",
      student_middle_name: "",
      student_email: "",
      student_mobile: "",
      parent_name: "",
      parent_email: "",
      parent_number: "",
      grader_list: "",
      roll_no: "",
      admission_no: "",
      admission_date: new Date().toISOString().split("T")[0],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // setLoadIndicator(true);
      console.log("Form values:", values);
    },
  });

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
            <Link to="/student" className="custom-breadcrumb">
              &nbsp;Student
            </Link>
          </li>
          <span className="breadcrumb-separator"> &gt; </span>
          <li className="breadcrumb-item active text-sm" aria-current="page">
            &nbsp;Student Add
          </li>
        </ol>
        <div className="card" style={{ border: "1px solid #dbd9d0" }}>
          <div className="d-flex px-4 justify-content-between align-items-center card_header p-1 mb-4">
            <div className="d-flex align-items-center">
              <div className="d-flex">
                <div className="dot active"></div>
              </div>
              <span className="me-2 text-muted">Add Student</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/student">
                <button type="button " className="btn btn-sm btn-back">
                  Back
                </button>
              </Link>
              &nbsp;&nbsp;
              <button
                type="submit"
                className="btn btn-button btn-sm me-2"
                style={{ fontWeight: "600px !important" }}
              >
                Save
              </button>
            </div>
          </div>
          <div className="container-fluid px-4">
            <div className="row">
              <div className="col-md-6 col-12 mb-4">
                <label className="form-label">
                  Centre Name<span className="text-danger">*</span>
                </label>
                <MultiSelect
                  options={serviceOption}
                  value={selectedServices}
                  onChange={(selected) => {
                    setSelectedServices(selected);
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
                    formik.touched.role && formik.errors.role
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("role")}
                >
                  <option value="">Select Role</option>
                  <option value="School A">School A</option>
                  <option value="School B">School B</option>
                  <option value="School C">School C</option>
                </select>
                {formik.touched.role && formik.errors.role && (
                  <div className="invalid-feedback">{formik.errors.role}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Student First Name<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.student_first_name &&
                    formik.errors.student_first_name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("student_first_name")}
                />
                {formik.touched.student_first_name &&
                  formik.errors.student_first_name && (
                    <div className="invalid-feedback">
                      {formik.errors.student_first_name}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Student Middle Name</label>
                <input
                  type="text"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.student_middle_name &&
                    formik.errors.student_middle_name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("student_middle_name")}
                />
                {/* {formik.touched.student_middle_name &&
              formik.errors.student_middle_name && (
                <div className="invalid-feedback">
                  {formik.errors.student_middle_name}
                </div>
              )} */}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Student Last Name</label>
                <input
                  type="text"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.student_last_name &&
                    formik.errors.student_last_name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("student_last_name")}
                />
                {/* {formik.touched.student_last_name &&
              formik.errors.student_last_name && (
                <div className="invalid-feedback">
                  {formik.errors.student_last_name}
                </div>
              )} */}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Student Email<span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.student_email && formik.errors.student_email
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("student_email")}
                />
                {formik.touched.student_email &&
                  formik.errors.student_email && (
                    <div className="invalid-feedback">
                      {formik.errors.student_email}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Student Mobile<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.student_mobile &&
                    formik.errors.student_mobile
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("student_mobile")}
                />
                {formik.touched.student_mobile &&
                  formik.errors.student_mobile && (
                    <div className="invalid-feedback">
                      {formik.errors.student_mobile}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Parent Name<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.parent_name && formik.errors.parent_name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("parent_name")}
                />
                {formik.touched.parent_name && formik.errors.parent_name && (
                  <div className="invalid-feedback">
                    {formik.errors.parent_name}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Parent Email<span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.parent_email && formik.errors.parent_email
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("parent_email")}
                />
                {formik.touched.parent_email && formik.errors.parent_email && (
                  <div className="invalid-feedback">
                    {formik.errors.parent_email}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Parent Mobile Number<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.parent_number && formik.errors.parent_number
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("parent_number")}
                />
                {formik.touched.parent_number &&
                  formik.errors.parent_number && (
                    <div className="invalid-feedback">
                      {formik.errors.parent_number}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Grader List<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${
                    formik.touched.grader_list && formik.errors.grader_list
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("grader_list")}
                >
                  <option value="">Select School</option>
                  <option value="School A">School A</option>
                  <option value="School B">School B</option>
                  <option value="School C">School C</option>
                </select>
                {formik.touched.grader_list && formik.errors.grader_list && (
                  <div className="invalid-feedback">
                    {formik.errors.grader_list}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Roll Number<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.roll_no && formik.errors.roll_no
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("roll_no")}
                />
                {formik.touched.roll_no && formik.errors.roll_no && (
                  <div className="invalid-feedback">
                    {formik.errors.roll_no}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Admission Number<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.admission_no && formik.errors.admission_no
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("admission_no")}
                />
                {formik.touched.admission_no && formik.errors.admission_no && (
                  <div className="invalid-feedback">
                    {formik.errors.admission_no}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Admission Date</label>
                <input
                  type="date"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.admission_date &&
                    formik.errors.admission_date
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("admission_date")}
                />
                {/* {formik.touched.admission_date && formik.errors.admission_date && (
              <div className="invalid-feedback">
                {formik.errors.admission_date}
              </div>
            )} */}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default StudentAdd;
