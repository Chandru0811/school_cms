import * as yup from "yup";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { useState } from "react";

function HomeworkAdd() {
  const options = [
    { value: "1", label: "All" },
    { value: "2", label: "One" },
    { value: "3", label: "Two" },
    { value: "4", label: "Three" },
    { value: "5", label: "Four" },
  ];
  const [isOpen, setIsOpen] = useState(false);

  const validationSchema = yup.object().shape({
    student_id: yup.string().required("*Student id is required"),
    difficult_type: yup.string().required("*Select a deifficult type"),
    grade_id: yup.string().required("*Select a grade id"),
    due_date: yup.string().required("*Due date is required"),
    ques_type: yup.string().required("*Select a question type"),
   
    target_score: yup
      .number()
      .typeError("*Target Score must be a number")
      .required("*Target Score field is required")
      .positive("*Target Score must be a positive number")
      .integer("*Target Score must be an integer"),
  });

  const formik = useFormik({
    initialValues: {
      student_id: "",
      difficult_type: "",
      grade_id: "",
      due_date:"",
      target_score: "",
      difficult_level: "",
      question: "",
      ques_type: "",

    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // setLoadIndicator(true);
      console.log("Form values:", values);
    },
  });

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    let selectedValues = [...formik.values.question];

    if (checked) {
      selectedValues.push(value);
    } else {
      selectedValues = selectedValues.filter((item) => item !== value);
    }

    formik.setFieldValue("question", selectedValues);
  };

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
            <Link to="/homework" className="custom-breadcrumb">
              &nbsp;Homework
            </Link>
          </li>
          <span className="breadcrumb-separator"> &gt; </span>
          <li className="breadcrumb-item active" aria-current="page">
            &nbsp;Homework Add
          </li>
        </ol>
        <div className="d-flex justify-content-between align-items-center card_header p-2">
          <div className="d-flex align-items-center">
            <div className="d-flex">
              <div className="dot active"></div>
            </div>
            <span className="me-2 text-muted">
              &nbsp;
              <span className="database_name">Add Homework</span>
            </span>
          </div>
          <div className="mb-3 d-flex justify-content-end">
            <Link to="/homework" className="custom-breadcrumb">
              <button
                type="button"
                className="btn btn-sm btn-back me-2"
                style={{ fontWeight: "600px !important" }}
              >
                Back
              </button>
            </Link>
            <button
              type="submit"
              className="btn btn-button btn-sm me-2"
              style={{ fontWeight: "600px !important" }}
            >
              Save
            </button>
          </div>
        </div>
        <div className="card p-3">
          <div className="row gx-3 p-3">
            <div className="col-md-6 col-12 mb-3">
              <label className="form-label">
                Student List<span className="text-danger">*</span>
              </label>
              <input
                className={`form-control form-control-sm ${
                  formik.touched.student_id && formik.errors.student_id ? "is-invalid" : ""
                }`}
                {...formik.getFieldProps("student_id")}
              />
              {formik.touched.student_id && formik.errors.student_id && (
                <div className="invalid-feedback">{formik.errors.student_id}</div>
              )}
            </div>
            <div className="col-md-6 col-12 mb-3">
              <label className="form-label">
                Grade<span className="text-danger">*</span>
              </label>
              <select
                className={`form-select form-select-sm ${
                  formik.touched.grade_id && formik.errors.grade_id ? "is-invalid" : ""
                }`}
                {...formik.getFieldProps("grade_id")}
              >
                <option value="">Select Grade</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
              {formik.touched.grade_id && formik.errors.grade_id && (
                <div className="invalid-feedback">{formik.errors.grade_id}</div>
              )}
            </div>
            <div className="col-md-6 col-12 mb-3">
              <label className="form-label">
                Difficult Type<span className="text-danger">*</span>
              </label>
              <select
                className={`form-select form-select-sm ${
                  formik.touched.difficult_type && formik.errors.difficult_type
                    ? "is-invalid"
                    : ""
                }`}
                {...formik.getFieldProps("difficult_type")}
              >
                <option value="">Select Subject</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              {formik.touched.difficult_type && formik.errors.difficult_type && (
                <div className="invalid-feedback">
                  {formik.errors.difficult_type}
                </div>
              )}
            </div>
            <div className="col-md-6 col-12 mb-3">
              <label className="form-label">
                Due Date<span className="text-danger">*</span>
              </label>
              <input 
              type="date"
                className={`form-control form-control-sm ${
                  formik.touched.due_date && formik.errors.due_date
                    ? "is-invalid"
                    : ""
                }`}
                {...formik.getFieldProps("due_date")}
             / >
                
              {formik.touched.due_date && formik.errors.due_date && (
                <div className="invalid-feedback">
                  {formik.errors.due_date}
                </div>
              )}
            </div>
            <div className="col-md-6 col-12 mb-3">
              <label className="form-label">Total Score</label>
              <span className="text-danger">*</span>
              <input
                type="text"
                className={`form-control form-control-sm ${
                  formik.touched.target_score && formik.errors.target_score
                    ? "is-invalid"
                    : ""
                }`}
                {...formik.getFieldProps("target_score")}
              />
              {formik.touched.target_score && formik.errors.target_score && (
                <div className="invalid-feedback">
                  {formik.errors.target_score}
                </div>
              )}
            </div>
            <div className="col-md-6 col-12 mb-3">
              <div>
                <label className="form-label">Question</label>
              </div>
              <div className="dropdown">
                <button
                  type="button"
                  className={`form-control form-control-sm dropdown-toggle ${
                    formik.touched.question && formik.errors.question
                      ? "is-invalid"
                      : ""
                  }`}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {formik.values.question.length > 0
                    ? options
                        .filter((opt) =>
                          formik.values.question.includes(opt.value)
                        )
                        .map((opt) => opt.label)
                        .join(", ")
                    : "Select options"}
                </button>

                {isOpen && (
                  <ul className="dropdown-menu show">
                    {options.map((option) => (
                      <li key={option.value} className="dropdown-item">
                        <input
                          type="checkbox"
                          value={option.value}
                          checked={formik.values.question.includes(
                            option.value
                          )}
                          onChange={handleCheckboxChange}
                          className="form-check-input me-2"
                        />
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {formik.touched.question && formik.errors.question && (
                <div className="invalid-feedback d-block">
                  {formik.errors.question}
                </div>
              )}
            </div>
            <div className="col-md-6 col-12 mb-3">
              <label className="form-label">
                Question Type<span className="text-danger">*</span>
              </label>
              <select
                className={`form-select form-select-sm ${
                  formik.touched.ques_type && formik.errors.ques_type
                    ? "is-invalid"
                    : ""
                }`}
                {...formik.getFieldProps("ques_type")}
              >
                <option value="">Select Question Type</option>
                <option value="All">All</option>
                <option value="Filled">Filled</option>
                <option value="Closed">Closed</option>
                <option value="multiChoice">Multi Choice</option>
                <option value="shortAnswer">Short Answer</option>
                <option value="Upload">Upload</option>
              </select>
              {formik.touched.ques_type && formik.errors.ques_type && (
                <div className="invalid-feedback">
                  {formik.errors.ques_type}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default HomeworkAdd;
