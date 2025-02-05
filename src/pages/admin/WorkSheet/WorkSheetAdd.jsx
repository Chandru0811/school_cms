import * as yup from "yup";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { useState } from "react";

function WorkSheetAdd() {
  const options = [
    { value: "1", label: "All" },
    { value: "2", label: "One" },
    { value: "3", label: "Two" },
    { value: "4", label: "Three" },
    { value: "5", label: "Four" },
  ];
  const [isOpen, setIsOpen] = useState(false);

  const validationSchema = yup.object().shape({
    name: yup.string().required("*Select a title"),
    subject_id: yup.string().required("*Select a subject"),
    type: yup.string().required("*Select a type"),
    ques_type: yup.string().required("*Select a question type"),
    difficult_level: yup.string().required("*Select a difficult level"),
    questionType: yup.string().required("*Select a question type"),
    question: yup.string().required("*Select a question"),
    target_score: yup
      .number()
      .typeError("*Target Score must be a number")
      .required("*Target Score field is required")
      .positive("*Target Score must be a positive number")
      .integer("*Target Score must be an integer"),

    reward: yup
      .number()
      .typeError("*Reward must be a number")
      .required("*Reward field is required")
      .positive("*Reward must be a positive number")
      .integer("*Reward must be an integer"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      subject_id: "",
      type: "",
      difficult_level: "",
      ques_type: "",
      target_score: "",
      reward: "",
      question_id: "",
      question: "",
      questionType: "Challenge",
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
            <Link to="/worksheet" className="custom-breadcrumb">
              &nbsp;Work Sheet
            </Link>
          </li>
          <span className="breadcrumb-separator"> &gt; </span>
          <li className="breadcrumb-item active" aria-current="page">
            &nbsp;Work Sheet Add
          </li>
        </ol>
        <div className="d-flex justify-content-between align-items-center card_header p-2">
          <div className="d-flex align-items-center">
            <div className="d-flex">
              <div className="dot active"></div>
            </div>
            <span className="me-2 text-muted">
              &nbsp;
              <span className="database_name">Add Work Sheet</span>
            </span>
          </div>
          <div className="mb-3 d-flex justify-content-end">
            <Link to="/worksheet" className="custom-breadcrumb">
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
              <div className="d-flex gap-3">
                <div className="form-check">
                  <input
                    type="radio"
                    name="questionType"
                    value="Challenge"
                    className={`form-check-input ${
                      formik.touched.questionType && formik.errors.questionType
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={formik.values.questionType === "Challenge"} // Default checked
                  />
                  <label className="form-check-label">Challenge</label>
                </div>

                <div className="form-check">
                  <input
                    type="radio"
                    name="questionType"
                    value="Q/A"
                    className="form-check-input"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={formik.values.questionType === "Q/A"}
                  />
                  <label className="form-check-label">Q/A</label>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-12 mb-3">
              {formik.values.questionType === "Challenge" ? (
                <label className="form-label">
                  Challenged Title<span className="text-danger">*</span>
                </label>
              ) : formik.values.questionType === "Q/A" ? (
                <label className="form-label">
                  Q/A Title<span className="text-danger">*</span>
                </label>
              ) : null}

              <input
                className={`form-control form-control-sm ${
                  formik.touched.name && formik.errors.name ? "is-invalid" : ""
                }`}
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="invalid-feedback">{formik.errors.name}</div>
              )}
            </div>
            <div className="col-md-6 col-12 mb-3">
              {formik.values.questionType === "Challenge" ? (
                <label className="form-label">
                  Challenged Type<span className="text-danger">*</span>
                </label>
              ) : formik.values.questionType === "Q/A" ? (
                <label className="form-label">
                  Q/A Type<span className="text-danger">*</span>
                </label>
              ) : null}
              <select
                className={`form-select form-select-sm ${
                  formik.touched.type && formik.errors.type ? "is-invalid" : ""
                }`}
                {...formik.getFieldProps("type")}
              >
                <option value="">Select Type</option>
                <option value="Practical">Practical</option>
                <option value="Grammer">Grammer</option>
              </select>
              {formik.touched.type && formik.errors.type && (
                <div className="invalid-feedback">{formik.errors.type}</div>
              )}
            </div>
            <div className="col-md-6 col-12 mb-3">
              <label className="form-label">
                Subject<span className="text-danger">*</span>
              </label>
              <select
                className={`form-select form-select-sm ${
                  formik.touched.subject_id && formik.errors.subject_id
                    ? "is-invalid"
                    : ""
                }`}
                {...formik.getFieldProps("subject_id")}
              >
                <option value="">Select Subject</option>
                <option value="math">Mathematics</option>
                <option value="science">Science</option>
                <option value="history">History</option>
              </select>
              {formik.touched.subject_id && formik.errors.subject_id && (
                <div className="invalid-feedback">
                  {formik.errors.subject_id}
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
            <div className="col-md-6 col-12 mb-3">
              <div>
              <label className="form-label">
                Question
              </label>
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
              <label className="form-label">Traget Score</label>
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
              <label className="form-label">Reward</label>
              <span className="text-danger">*</span>
              <input
                type="text"
                className={`form-control form-control-sm ${
                  formik.touched.reward && formik.errors.reward
                    ? "is-invalid"
                    : ""
                }`}
                {...formik.getFieldProps("reward")}
              />
              {formik.touched.reward && formik.errors.reward && (
                <div className="invalid-feedback">{formik.errors.reward}</div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default WorkSheetAdd;
