import { useFormik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";

function ChallengesEdit() {
  const validationSchema = Yup.object({
    subject_topic: Yup.string().required("*Subject topic is required"),
    type: Yup.string().required("*Select a type"),
    answer_type: Yup.string().required("*Select a answer type"),
    title: Yup.string().required("*Challenged title is required"),
    level: Yup.string().required("*Select a level"),
    solution: Yup.string().required("*Solution is required"),
    time_limit: Yup.string().required("*Time limit is required"),
    description: Yup.string()
      .notRequired("*Description is a required field")
      .max(250, "*The maximum length is 250 characters"),
    challenges_diagram: Yup.string().required(
      "*Select a challenges diagram file"
    ),
  });

  const formik = useFormik({
    initialValues: {
      subject_topic: "",
      type: "",
      title: "",
      level: "",
      solution: "",
      time_limit: "",
      hint: "",
      description: "",
      answer_type: "",
      challenges_diagram: "",
    },
    validationSchema: validationSchema,
    onSubmit: async () => {},
    validateOnChange: false,
    validateOnBlur: true,
  });

  return (
    <div className="container-fluid px-0">
      <ol
        className="breadcrumb my-3 d-flex align-items-center"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        <li>
          <Link to="/" className="custom-breadcrumb text-sm">
            Home
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/challenges" className="custom-breadcrumb text-sm">
            &nbsp;Challenges
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active text-sm" aria-current="page">
          &nbsp;Challenges Edit
        </li>
      </ol>
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !formik.isSubmitting) {
            e.preventDefault();
          }
        }}
      >
        <div className="card">
          <div className="d-flex justify-content-between align-items-center card_header p-2">
            <div className="d-flex align-items-center">
              <div className="d-flex">
                <div className="dot active"></div>
              </div>
              <span className="me-2 text-muted text-sm">Edit Challenges</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/challenges">
                <button type="button " className="btn btn-sm btn-back">
                  Back
                </button>
              </Link>
              &nbsp;&nbsp;
              <button type="submit" className="btn btn-sm btn-button">
                Update
              </button>
            </div>
          </div>
          <div className="container-fluid px-4">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Subject Topic<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control form-control-sm ${
                    formik.touched.subject_topic && formik.errors.subject_topic
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("subject_topic")}
                />
                {formik.touched.subject_topic &&
                  formik.errors.subject_topic && (
                    <div className="invalid-feedback">
                      {formik.errors.subject_topic}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Level<span className="text-danger">*</span>
                </label>
                <select
                  aria-label="Default select example"
                  className={`form-select form-select-sm ${
                    formik.touched.level && formik.errors.level
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("level")}
                >
                  <option value=""></option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                {formik.touched.level && formik.errors.level && (
                  <div className="invalid-feedback">{formik.errors.level}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Type<span className="text-danger">*</span>
                </label>
                <select
                  aria-label="Default select example"
                  className={`form-select form-select-sm ${
                    formik.touched.type && formik.errors.type
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("type")}
                >
                  <option value=""></option>
                  <option value="English">English</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Maths">Maths</option>
                </select>
                {formik.touched.type && formik.errors.type && (
                  <div className="invalid-feedback">{formik.errors.type}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Challenges Title<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control form-control-sm ${
                    formik.touched.title && formik.errors.title
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("title")}
                />
                {formik.touched.title && formik.errors.title && (
                  <div className="invalid-feedback">{formik.errors.title}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Challanges Description</label>
                <textarea
                  rows={5}
                  className={`form-control ${
                    formik.touched.description && formik.errors.description
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("description")}
                  maxLength={825}
                />
                {formik.touched.description && formik.errors.description && (
                  <div className="invalid-feedback">
                    {formik.errors.description}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Challenges Diagram<span className="text-danger">*</span>
                </label>
                <input
                  type="file"
                  className={`form-control form-control-sm ${
                    formik.touched.Challenges_diagram &&
                    formik.errors.Challenges_diagram
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("Challenges_diagram")}
                />
                {formik.touched.Challenges_diagram &&
                  formik.errors.Challenges_diagram && (
                    <div className="invalid-feedback">
                      {formik.errors.Challenges_diagram}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Answer Type<span className="text-danger">*</span>
                </label>
                <select
                  aria-label="Default select example"
                  className={`form-select form-select-sm ${
                    formik.touched.answer_type && formik.errors.answer_type
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("answer_type")}
                >
                  <option value=""></option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                {formik.touched.answer_type && formik.errors.answer_type && (
                  <div className="invalid-feedback">
                    {formik.errors.answer_type}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Time Limit<span className="text-danger">*</span>
                </label>
                <select
                  aria-label="Default select example"
                  className={`form-select ${
                    formik.touched.time_limit && formik.errors.time_limit
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("time_limit")}
                >
                  <option value=""></option>
                  <option value="15">15 mins</option>
                  <option value="30">30 mins</option>
                  <option value="45">45 mins</option>
                </select>
                {formik.touched.time_limit && formik.errors.time_limit && (
                  <div className="invalid-feedback">
                    {formik.errors.time_limit}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Hint</label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.hint && formik.errors.hint
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("hint")}
                />
                {formik.touched.hint && formik.errors.hint && (
                  <div className="invalid-feedback">{formik.errors.hint}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Solution<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.solution && formik.errors.solution
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("solution")}
                />
                {formik.touched.solution && formik.errors.solution && (
                  <div className="invalid-feedback">
                    {formik.errors.solution}
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

export default ChallengesEdit;
