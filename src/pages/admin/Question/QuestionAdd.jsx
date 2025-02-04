import { useState } from "react";
import Button from "react-bootstrap/Button";
import * as yup from "yup";
import { useFormik } from "formik";
import { Link } from "react-router-dom";

function QuestionAdd() {
  const [loadIndicator, setLoadIndicator] = useState(false);

  const validationSchema = yup.object().shape({
    grade_id: yup.string().required("*Select a grade"),
    subject_id: yup.string().required("*Select a subject"),
    topic_id: yup.string().required("*Select a topic"),
    difficult_level: yup.string().required("*Select a difficult level"),
  });

  const formik = useFormik({
    initialValues: {
      grade_id: "",
      subject_id: "",
      topic_id: "",
      difficult_level: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log("Form values:", values);
      setTimeout(() => setLoadIndicator(false),); 
    },
  });

  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4>Add Question</h4>
              </div>
              <div className="card-body">
                    <form
                      onSubmit={formik.handleSubmit}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !formik.isSubmitting) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <div className="row">
                        <div className="col-md-6 col-12 mb-3">
                          <label className="form-label">
                            Grade<span className="text-danger">*</span>
                          </label>
                          <select
                            className={`form-select form-select-sm ${
                              formik.touched.grade_id && formik.errors.grade_id
                                ? "is-invalid"
                                : ""
                            }`}
                            {...formik.getFieldProps("grade_id")}
                          >
                            <option value="">Select Grade</option>
                            <option value="1">Grade 1</option>
                            <option value="2">Grade 2</option>
                            <option value="3">Grade 3</option>
                          </select>
                          {formik.touched.grade_id && formik.errors.grade_id && (
                            <div className="invalid-feedback">{formik.errors.grade_id}</div>
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
                            <div className="invalid-feedback">{formik.errors.subject_id}</div>
                          )}
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                          <label className="form-label">
                            Topic<span className="text-danger">*</span>
                          </label>
                          <select
                            className={`form-select form-select-sm ${
                              formik.touched.topic_id && formik.errors.topic_id
                                ? "is-invalid"
                                : ""
                            }`}
                            {...formik.getFieldProps("topic_id")}
                          >
                            <option value="">Select Topic</option>
                            <option value="algebra">Algebra</option>
                            <option value="geometry">Geometry</option>
                            <option value="physics">Physics</option>
                          </select>
                          {formik.touched.topic_id && formik.errors.topic_id && (
                            <div className="invalid-feedback">{formik.errors.topic_id}</div>
                          )}
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                          <label className="form-label">
                          Difficult Level<span className="text-danger">*</span>
                          </label>
                          <select
                            className={`form-select form-select-sm ${
                              formik.touched.difficult_level && formik.errors.difficult_level
                                ? "is-invalid"
                                : ""
                            }`}
                            {...formik.getFieldProps("difficult_level")}
                          >
                            <option value="">Select a Difficult Level</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                          </select>
                          {formik.touched.difficult_level && formik.errors.difficult_level && (
                            <div className="invalid-feedback">{formik.errors.difficult_level}</div>
                          )}
                        </div>
                      </div>

                        <div className="d-flex justify-content-end">
                        <Button className="btn btn-sm btn-border bg-light text-dark">
                          <Link to="/question" className="text-decoration-none text-dark">
                            Back
                          </Link>
                        </Button>
                        <Button type="submit" className="btn btn-primary btn-sm ms-2" disabled={loadIndicator}>
                          {loadIndicator && (
                            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                          )}
                          Submit
                        </Button>
                        </div>
                    </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default QuestionAdd;
