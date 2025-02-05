import * as yup from "yup";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
// import { useState } from "react";

function QuestionAdd() {
  const validationSchema = yup.object().shape({
    grade_id: yup.string().required("*Select a grade"),
    subject_id: yup.string().required("*Select a subject"),
    topic_id: yup.string().required("*Select a topic"),
    difficult_level: yup.string().required("*Select a difficult level"),
    ques_type: yup.array().min(1, "*Select at least one question type"),
  });

  const formik = useFormik({
    initialValues: {
      grade_id: "",
      subject_id: "",
      topic_id: "",
      difficult_level: "",
      ques_type: [],
      multiChoices: [{ id: Date.now(), value: "" }],
      hint:"",
      upload_file:"",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // setLoadIndicator(true);
      console.log("Form values:", values);
    },
  });

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    formik.setFieldValue(
      "ques_type",
      checked
        ? [...formik.values.ques_type, value]
        : formik.values.ques_type.filter((option) => option !== value)
    );
  };

  const addMutiChoice = () => {
    const newMutiChoice = { id: Date.now(), value: "" };
    formik.setFieldValue("multiChoices", [
      ...formik.values.multiChoices,
      newMutiChoice,
    ]);
  };

  const removeMultiChoice = (id) => {
    const updatedMultiChoices = formik.values.multiChoices.filter(
      (multiChoice) => multiChoice.id !== id
    );
    formik.setFieldValue("multiChoices", updatedMultiChoices);
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
            <Link to="/question" className="custom-breadcrumb">
              &nbsp;Question
            </Link>
          </li>
          <span className="breadcrumb-separator"> &gt; </span>
          <li className="breadcrumb-item active" aria-current="page">
            &nbsp;Question & Answer Add
          </li>
        </ol>
        <div className="d-flex justify-content-between align-items-center card_header p-2">
          <div className="d-flex align-items-center">
            <div className="d-flex">
              <div className="dot active"></div>
            </div>
            <span className="me-2 text-muted">
              &nbsp;
              <span className="database_name">Add Question & Answer</span>
            </span>
          </div>
          <div className="mb-3 d-flex justify-content-end">
            <Link to="/question" className="custom-breadcrumb">
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
                <option value="">Select School</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
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
                <div className="invalid-feedback">
                  {formik.errors.subject_id}
                </div>
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
              <div className="d-flex gap-3">
                <div className="form-check">
                  <input
                    type="radio"
                    name="difficult_level"
                    value="Easy"
                    className={`form-check-input ${
                      formik.touched.difficult_level &&
                      formik.errors.difficult_level
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={formik.values.difficult_level === "Easy"}
                  />
                  <label className="form-check-label">Easy</label>
                </div>

                <div className="form-check">
                  <input
                    type="radio"
                    name="difficult_level"
                    value="Medium"
                    className="form-check-input"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={formik.values.difficult_level === "Medium"}
                  />
                  <label className="form-check-label">Medium</label>
                </div>

                <div className="form-check">
                  <input
                    type="radio"
                    name="difficult_level"
                    value="Hard"
                    className="form-check-input"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={formik.values.difficult_level === "Hard"}
                  />
                  <label className="form-check-label">Hard</label>
                </div>
              </div>

              {formik.touched.difficult_level &&
                formik.errors.difficult_level && (
                  <div className="invalid-feedback d-block">
                    {formik.errors.difficult_level}
                  </div>
                )}
            </div>
            {/* Upload Div*/}
            <div className="col-md-6 col-12 mb-3">
              <label className="form-label">Upload File(Optional)</label>
              <input
                type="file"
                className={`form-control form-control-sm ${
                  formik.touched.upload_file && formik.errors.upload_file
                    ? "is-invalid"
                    : ""
                }`}
                {...formik.getFieldProps("upload_file")}
              ></input>
              {formik.touched.upload_file && formik.errors.upload_file && (
                <div className="invalid-feedback">
                  {formik.errors.upload_file}
                </div>
              )}
            </div>
            <div className="col-md-6 col-12 mb-3"></div>
            {/* Question Type */}
            <div className="col-md-6 col-12 mb-3">
              <div>
                <label className="form-label">
                  Question Type<span className="text-danger">*</span>
                </label>
              </div>

              {/* Checkboxes */}
              {[
                { id: "filled", label: "Filled" },
                { id: "closed", label: "Closed" },
                { id: "multiCheckbox", label: "Multi choice" },
                { id: "shortCheckbox", label: "Short Answer" },
                { id: "uploadCheckbox", label: "Upload" },
              ].map(({ id, label }) => (
                <div className="form-check form-check-inline" key={id}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={id}
                    value={id}
                    onChange={handleCheckboxChange}
                    checked={formik.values.ques_type.includes(id)}
                  />
                  <label className="form-check-label" htmlFor={id}>
                    {label}
                  </label>
                </div>
              ))}

              {/* Show validation error for checkboxes */}
              {formik.errors.ques_type && formik.touched.ques_type && (
                <div className="text-danger">{formik.errors.ques_type}</div>
              )}
            </div>
            <div className="col-md-6 col-12 mb-3">
              {/* Conditional Fields Based on Selected Checkboxes */}
              {formik.values.ques_type.includes("filled") && (
                <div className="mt-2">
                  <label className="form-label">Enter your answer:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your Question & Answer"
                  />
                </div>
              )}

              {formik.values.ques_type.includes("closed") && (
                <div className="mt-2">
                  <label className="form-label">Select Yes or No:</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="closedOption"
                        value="yes"
                      />
                      <label className="form-check-label">Yes</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="closedOption"
                        value="no"
                      />
                      <label className="form-check-label">No</label>
                    </div>
                  </div>
                </div>
              )}

              {formik.values.ques_type.includes("multiCheckbox") && (
                <>
                  <div className="mt-2">
                    <label className="form-label">Select Multi Choice:</label>
                    {formik.values.multiChoices.map((multiChoice, index) => (
                      <div
                        className="d-flex align-items-center"
                        key={multiChoice.id}
                      >
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name={`multiChoice[${index}].value`}
                          value={multiChoice.value}
                          onChange={(e) => {
                            const updatedMultiChoices = [
                              ...formik.values.multiChoices,
                            ];
                            updatedMultiChoices[index].value =
                              e.target.value.replace(/,/g, "");
                            formik.setFieldValue(
                              "multiChoices",
                              updatedMultiChoices
                            );
                          }}
                          placeholder={`Multi Choice ${index + 1}`}
                        />
                        {/* Render the delete button only if it's not the first multiChoice */}
                        {index > 0 && (
                          <button
                            type="button"
                            className="btn btn-light btn-sm ml-2"
                            onClick={() => removeMultiChoice(multiChoice.id)}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-sm btn-button mt-2"
                      onClick={addMutiChoice}
                    >
                      Add Multi Choice
                    </button>
                  </div>
                </>
              )}

              {formik.values.ques_type.includes("shortCheckbox") && (
                <div className="mt-2">
                  <label className="form-label">Short Answer</label>
                  <textarea className="form-control form-control-sm" rows={3} />
                </div>
              )}

              {formik.values.ques_type.includes("uploadCheckbox") && (
                <div className="mt-2">
                  <label className="form-label">Upload File:</label>
                  <input type="file" className="form-control form-control-sm" />
                </div>
              )}
            </div>
            {/* Question Type End */}
            <div className="col-md-6 col-12 mb-3">
              <label className="form-label">Hint(Optional)</label>
              <input
                type="text"
                className="form-control form-control-sm"
                {...formik.getFieldProps("hint")}
              ></input>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default QuestionAdd;
