import * as yup from "yup";
import { useFormik } from "formik";
import { Link,  } from "react-router-dom";
function StudentEdit() {
  const validationSchema = yup.object().shape({
    center_name: yup.string().required("*Center Name is required"),
    student_first_name: yup.string().required("*Student Name is required"),
    student_email: yup.string().required("*Student Email is required"),
    student_mobile: yup.string().required("*Student Mobile is required"),
    parent_name: yup.string().required("*Parent Name is required"),
    parent_email: yup.string().required("*Parent Email is required"),
    parent_number: yup.string().required("*Parent Number is required"),
    grader_list: yup.string().required("*Grader List is required"),
    roll_no: yup.string().required("*Roll Number is required"),
    admission_no: yup.string().required("*Admission Number is required"),
  });

  const formik = useFormik({
    initialValues: {
      center_name: "School A",
      student_first_name: "Sumaiya",
      student_last_name: "M",
      student_middle_name: "",
      student_email: "sumaiya@gmali.com",
      student_mobile: "8608163189",
      parent_name: "Sulaiga",
      parent_email: "sulaiga@gmail.com",
      parent_number: "7092163189",
      grader_list: "School A",
      roll_no: "12",
      admission_no: "1234",
      admission_date: new Date().toISOString().split("T")[0], 
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // setLoadIndicator(true);
      console.log("Form values:", values);
    },
  });

  return (
    <div className="container card p-3">
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !formik.isSubmitting) {
            e.preventDefault();
          }
        }}
      >
            <ol
              className="breadcrumb my-3"
              style={{ listStyle: "none", padding: 0, margin: 0 }}
            >
              <li>
                <Link to="/" className="custom-breadcrumb">
                  Home
                </Link>
                <span className="breadcrumb-separator"> &gt; </span>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
              <Link to="/student" className="custom-breadcrumb">
                &nbsp;Student
                </Link>
              </li>
              <span className="breadcrumb-separator"> &gt; </span>
              <li className="breadcrumb-item active" aria-current="page">
                &nbsp;Student Edit
              </li>
            </ol>
            <div className="d-flex justify-content-between align-items-center card_header p-2">
          <div className="d-flex align-items-center">
            <div className="d-flex">
              <div className="dot active"></div>
            </div>
            <span className="me-2 text-muted">&nbsp;
              <span className="database_name">Edit Student</span>
            </span>
          </div>
          <div className="mb-3 d-flex justify-content-end">
          <Link to="/student" className="custom-breadcrumb">
          <button
              type="button"
              className="btn btn-sm btn-back me-2"
              style={{ fontWeight: "600px !important" }} >
               Back
            </button>
            </Link>
            <button
              type="submit"
              className="btn btn-button btn-sm me-2"
              style={{ fontWeight: "600px !important" }}
            >Update
            </button>
        </div>
        </div>
        <div className="card p-3">
        <div className="row gx-3 p-3">       
          <div className="col-md-6 col-12 mb-3">
            <label className="form-label">
              Center Name<span className="text-danger">*</span>
            </label>
            <select
              className={`form-select form-select-sm ${
                formik.touched.center_name && formik.errors.center_name
                  ? "is-invalid"
                  : ""
              }`}
              {...formik.getFieldProps("center_name")}
            >
              <option value="">Select School</option>
              <option value="School A">School A</option>
              <option value="School B">School B</option>
              <option value="School C">School C</option>
            </select>
            {formik.touched.center_name && formik.errors.center_name && (
              <div className="invalid-feedback">
                {formik.errors.center_name}
              </div>
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
            <label className="form-label">
              Student Middle Name
            </label>
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
            <label className="form-label">
              Student Last Name
            </label>
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
            {formik.touched.student_email && formik.errors.student_email && (
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
                formik.touched.student_mobile && formik.errors.student_mobile
                  ? "is-invalid"
                  : ""
              }`}
              {...formik.getFieldProps("student_mobile")}
            />
            {formik.touched.student_mobile && formik.errors.student_mobile && (
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
            {formik.touched.parent_number && formik.errors.parent_number && (
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
              <div className="invalid-feedback">{formik.errors.roll_no}</div>
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
            <label className="form-label">
              Admission Date
            </label>
            <input
              type="date"
              onKeyDown={(e) => e.stopPropagation()}
              className={`form-control form-control-sm ${
                formik.touched.admission_date && formik.errors.admission_date
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
      </form>
    </div>
  );
}

export default StudentEdit;
