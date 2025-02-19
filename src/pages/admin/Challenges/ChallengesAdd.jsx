import * as yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../config/URL";

function ChallengesAdd() {
  const navigate = useNavigate();
  const [selectedCenter, setSelectedCenter] = useState([]);
  const [centerList, setCenterList] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loadIndicator, setLoadIndicator] = useState(false);


  const validationSchema = yup.object().shape({
    center_id: yup
      .array()
      .of(yup.string().required("*Select at least one centre"))
      .min(1, "*Select at least one centre")
      .required("*Select a centre name"),
    grade_id: yup.string().required("*Select a grade"),
    subject_id: yup.string().required("*Select a subject"),
    topic_id: yup.string().required("*Select a topic"),
    difficult_level: yup.string().required("*Select a difficult level"),
    title: yup.string().required("*Title is required"),
    time_limit: yup
      .string()
      .matches(/^\d+$/, "*Time limit must be a number")
      .required("*Time limit is required"),
    ques_type: yup
      .array()
      .min(1, "*Select at least one question type")
      .required("*Select a question type"),
    // multiChoices: yup.array().of(
    //   yup.object().shape({
    //     value: yup.string().required("*Multi choice value is required"),
    //   })
    // ),
    // filledAnswer: yup.string().required("*Field is required"),
    // closedOption: yup.string().required("*Select a one option"),
    // shortAnswer: yup.string().required("*Field is required"),
    // checkUploadFile: yup.string().required("*Please upload a file"),
  });

  const formik = useFormik({
    initialValues: {
      center_id: [],
      grade_id: "",
      subject_id: "",
      topic_id: "",
      difficult_level: "",
      title: "",
      description: "",
      time_limit: "",
      ques_type: [],
      answer: [],
      answer_upload: null,
      options: [
        { id: Date.now(), value: "" },
        { id: Date.now() + 1, value: "" },
      ],
      hint: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("values:", values)
      setLoadIndicator(true);
      try {
        const formData = new FormData();
        const fieldsToConvert = ["center_id", "ques_type"];

        fieldsToConvert.forEach((field) => {
          if (Array.isArray(values[field])) {
            values[field].forEach((item) => {
              formData.append(`${field}[]`, item);
            });
          } else {
            formData.append(`${field}[]`, values[field]);
          }
        });

        formData.append("grade_id", values.grade_id);
        formData.append("subject_id", values.subject_id);
        formData.append("topic_id", values.topic_id);
        formData.append("difficult_level", values.difficult_level);
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("time_limit", values.time_limit);
        formData.append("hint", values.hint);

        let multichoiceAdded = false; // Flag to prevent duplicates

        values.answer.forEach((ans) => {
          if (ans.fillable) {
            formData.append("answer[fillable]", ans.fillable);
          }
          if (ans.multichoice && !multichoiceAdded) {
            formData.append("answer[multichoice]", ans.multichoice);
            multichoiceAdded = true; // Ensure it's added only once
          }
          if (ans.short_answer) {
            formData.append("answer[short_answer]", ans.short_answer);
          }
          if (ans.closed) {
            formData.append("answer[closed]", ans.closed);
          }
        });

        if (values.answer_upload) {
          formData.append("answer[answer_upload]", values.answer_upload, values.answer_upload.name);
        }

        values.options.forEach((option) => {
          if (option.value.trim()) {
            formData.append("options[]", option.value.trim());
          }
        });

        // Log FormData entries for debugging
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }

        const response = await api.post("challenge", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/challenges");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage);
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
      console.log("center", formattedCenters)
      setCenterList(formattedCenters);
    } catch (e) {
      toast.error("Error Fetching Data ", e?.response?.data?.error);
    }
  };

  const getSubjectList = async () => {
    try {
      const response = await api.get("subjects/list");
      console.log(response);
      const formattedSubjects = response.data?.data?.map((subject) => ({
        value: subject.id,
        label: subject.name,
      }));

      setSubjects(formattedSubjects);
    } catch (e) {
      console.error("Error Fetching Data", e);
      toast.error("Error Fetching Data", e?.response?.data?.error || e.message);
    }
  };

  const getGradeList = async () => {
    try {
      const response = await api.get("grades/list");
      console.log(response);
      const formattedGrades = response.data?.data?.map((grade) => ({
        value: grade.id,
        label: grade.name,
      }));

      setGrades(formattedGrades);
    } catch (e) {
      console.error("Error Fetching Data", e);
      toast.error("Error Fetching Data", e?.response?.data?.error || e.message);
    }
  };

  const topicList = async () => {
    try {
      const response = await api.get("topics/list");
      console.log(response);
      const formattedTopics = response.data?.data?.map((topics) => ({
        value: topics.id,
        label: topics.name,
      }));

      setTopics(formattedTopics);
    } catch (e) {
      console.error("Error Fetching Data", e);
      toast.error("Error Fetching Data", e?.response?.data?.error || e.message);
    }
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      formik.setFieldValue("ques_type", [...formik.values.ques_type, value]);
      if (value === "multichoice" && formik.values.options.length < 2) {
        formik.setFieldValue("options", [
          { id: Date.now(), value: "" },
          { id: Date.now() + 1, value: "" },
        ]);
      }
    } else {
      formik.setFieldValue(
        "ques_type",
        formik.values.ques_type.filter((option) => option !== value)
      );
      if (value === "multichoice") {
        formik.setFieldValue("options", []);
      }
    }
  };

  const addMultiChoice = () => {
    formik.setFieldValue("options", [
      ...formik.values.options,
      { id: Date.now(), value: "" },
    ]);
  };

  const removeMultiChoice = (id) => {
    const updatedMultiChoices = formik.values.options.filter(
      (multiChoice) => multiChoice.id !== id
    );
    formik.setFieldValue("options", updatedMultiChoices);
  };

  useEffect(() => {
    getCenterList();
    getSubjectList();
    getGradeList();
    topicList();
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
          className="breadcrumb my-3"
          style={{ listStyle: "none", padding: 0, margin: 0 }}
        >
          <li>
            <Link to="/" className="custom-breadcrumb text-sm">
              Home
            </Link>
            <span className="breadcrumb-separator"> &gt; </span>
          </li>
          <li className="breadcrumb-item active text-sm" aria-current="page">
            <Link to="/challenges" className="custom-breadcrumb">
              &nbsp;Challenges
            </Link>
          </li>
          <span className="breadcrumb-separator"> &gt; </span>
          <li className="breadcrumb-item active text-sm" aria-current="page">
            &nbsp;Challenges Add
          </li>
        </ol>
        <div className="card" style={{ border: "1px solid #dbd9d0" }}>
          <div className="d-flex px-4 justify-content-between align-items-center card_header p-1 mb-4">
            <div className="d-flex align-items-center">
              <div className="d-flex">
                <div className="dot active"></div>
              </div>
              <span className="me-2 text-muted text-sm">
                Add Challenges
              </span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/challenges">
                <button type="button " className="btn btn-sm btn-back">
                  Back
                </button>
              </Link>
              &nbsp;&nbsp;
              <button
                type="submit"
                className="btn btn-button btn-sm me-2"
                style={{ fontWeight: "600px !important" }}
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
                  Centre Name<span className="text-danger">*</span>
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
                  labelledBy="Select Center"
                  className={`form-multi-select form-multi-select-sm ${formik.touched.center_id && formik.errors.center_id
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
                  Grade<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${formik.touched.grade_id && formik.errors.grade_id
                    ? "is-invalid"
                    : ""
                    }`}
                  {...formik.getFieldProps("grade_id")}
                >
                  <option value=""></option>
                  {grades.map((grade) => (
                    <option key={grade.value} value={grade.value}>
                      {grade.label}
                    </option>
                  ))}
                </select>
                {formik.touched.grade_id && formik.errors.grade_id && (
                  <div className="invalid-feedback">
                    {formik.errors.grade_id}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Subject<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${formik.touched.subject_id && formik.errors.subject_id
                    ? "is-invalid"
                    : ""
                    }`}
                  {...formik.getFieldProps("subject_id")}
                >
                  <option value=""></option>
                  {subjects.map((subject) => (
                    <option key={subject.value} value={subject.value}>
                      {subject.label}
                    </option>
                  ))}
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
                  className={`form-select form-select-sm ${formik.touched.topic_id && formik.errors.topic_id
                    ? "is-invalid"
                    : ""
                    }`}
                  {...formik.getFieldProps("topic_id")}
                >
                  <option value="">Select Topic</option>
                  {topics.map((topic) => (
                    <option key={topic.value} value={topic.value}>
                      {topic.label}
                    </option>
                  ))}
                </select>
                {formik.touched.topic_id && formik.errors.topic_id && (
                  <div className="invalid-feedback">
                    {formik.errors.topic_id}
                  </div>
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
                      className="form-check-input"
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
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Challenges Title</label>
                <span className="text-danger">*</span>
                <input
                  type="text"
                  className={`form-control form-control-sm ${formik.touched.title && formik.errors.title
                    ? "is-invalid"
                    : ""
                    }`}
                  {...formik.getFieldProps("title")}
                ></input>
                {formik.touched.title && formik.errors.title && (
                  <div className="invalid-feedback">
                    {formik.errors.title}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Challanges Description</label>
                <textarea
                  rows={5}
                  className={`form-control ${formik.touched.description && formik.errors.description
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
                  Time Limit<span className="text-danger">*</span>
                </label>
                <input
                  className={`form-control form-control-sm ${formik.touched.time_limit && formik.errors.time_limit
                      ? "is-invalid"
                      : ""
                    }`}
                  {...formik.getFieldProps("time_limit")}
                />
                {formik.touched.time_limit && formik.errors.time_limit && (
                  <div className="invalid-feedback">
                    {formik.errors.time_limit}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div>
                  <label className="form-label">
                    Question Type<span className="text-danger">*</span>
                  </label>
                </div>
                {[
                  { id: "fillable", label: "fillable" },
                  { id: "closed", label: "Closed" },
                  { id: "multichoice", label: "Multi choice" },
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

                {formik.errors.ques_type && formik.touched.ques_type && (
                  <div className="text-danger">{formik.errors.ques_type}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                {/* Conditional Fields Based on Selected Checkboxes */}
                {formik.values.ques_type.includes("fillable") && (
                  <div className="mt-2">
                    <label className="form-label">Enter your answer:</label>
                    <input
                      type="text"
                      placeholder="Your Question & Answer"
                      className={`form-control form-control-sm ${formik.touched.answer?.[0]?.fillable && formik.errors.answer?.[0]?.fillable
                        ? "is-invalid"
                        : ""
                        }`}
                      name="answer"
                      value={formik.values.answer[0]?.fillable || ""}
                      onChange={(e) => {
                        const updatedAnswer = [{ ...formik.values.answer[0], fillable: e.target.value }];
                        formik.setFieldValue("answer", updatedAnswer);
                      }}
                    />
                    {formik.touched.answer?.[0]?.fillable && formik.errors.answer?.[0]?.fillable && (
                      <div className="text-danger">{formik.errors.answer[0]?.fillable}</div>
                    )}
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
                          name="closed"
                          value="yes"
                          onChange={(e) => {
                            // Create or update the first object in the answer array with closed value
                            const currentAnswer = formik.values.answer?.[0] || {};
                            formik.setFieldValue("answer", [
                              { ...currentAnswer, closed: e.target.value },
                            ]);
                          }}
                          onBlur={formik.handleBlur}
                          checked={formik.values.answer?.[0]?.closed === "yes"}
                        />
                        <label className="form-check-label" htmlFor="closedYes">
                          Yes
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="closed"
                          value="no"
                          onChange={(e) => {
                            const currentAnswer = formik.values.answer?.[0] || {};
                            formik.setFieldValue("answer", [
                              { ...currentAnswer, closed: e.target.value },
                            ]);
                          }}
                          onBlur={formik.handleBlur}
                          checked={formik.values.answer?.[0]?.closed === "no"}
                        />
                        <label className="form-check-label" htmlFor="closedNo">
                          No
                        </label>
                      </div>
                    </div>
                    {formik.touched.answer?.[0]?.closed && formik.errors.answer?.[0]?.closed && (
                      <div className="invalid-feedback d-block">
                        {formik.errors.answer[0]?.closed}
                      </div>
                    )}
                  </div>
                )}
                {formik.values.ques_type.includes("multichoice") && (
                  <div className="mt-2">
                    <label className="form-label">Select Multi Choice:</label>
                    {formik.values.options.map((multiChoice, index) => (
                      <div
                        key={multiChoice.id}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <input
                          type="checkbox"
                          className="form-check-input mb-2"
                          name={`options[${index}].selected`}
                          id={`multiChoice-${index}`}
                          checked={multiChoice.selected || false}
                          onChange={() => {
                            let updatedOptions = [...formik.values.options];
                            let updatedAnswers = [...formik.values.answer];

                            if (multiChoice.selected) {
                              updatedAnswers = updatedAnswers.filter((ans) => ans.multichoice !== multiChoice.value);
                            } else {
                              updatedAnswers.push({ fillable: "", multichoice: multiChoice.value, short_answer: "", closed: "" });
                            }
                            updatedOptions[index] = {
                              ...multiChoice,
                              selected: !multiChoice.selected,
                            };
                            formik.setFieldValue("options", updatedOptions);
                            formik.setFieldValue("answer", updatedAnswers);
                          }}
                          aria-label="Multi Choice"
                        />
                        &nbsp; &nbsp;
                        <div className="input-group mb-2">
                          <input
                            type="text"
                            className={`form-control form-control-sm ${formik.errors.options &&
                              formik.touched.options &&
                              formik.errors.options[index]?.value
                              ? "is-invalid"
                              : ""
                              }`}
                            name={`options[${index}].value`}
                            value={multiChoice.value}
                            onChange={(e) => {
                              let updatedOptions = [...formik.values.options];
                              updatedOptions[index].value = e.target.value.replace(/,/g, "");

                              // Update answer array if selected
                              let updatedAnswers = [...formik.values.answer];
                              if (multiChoice.selected) {
                                updatedAnswers = updatedAnswers.map((ans) =>
                                  ans.multichoice === multiChoice.value
                                    ? { ...ans, multichoice: e.target.value.replace(/,/g, "") }
                                    : ans
                                );
                              }

                              formik.setFieldValue("options", updatedOptions);
                              formik.setFieldValue("answer", updatedAnswers);
                            }}
                            placeholder={`Multi Choice ${index + 1}`}
                          />
                          {index > 1 && (
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => {
                                let updatedOptions = formik.values.options.filter((opt) => opt.id !== multiChoice.id);
                                let updatedAnswers = formik.values.answer.filter((ans) => ans.multichoice !== multiChoice.value);

                                formik.setFieldValue("options", updatedOptions);
                                formik.setFieldValue("answer", updatedAnswers);
                              }}
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                        {formik.errors.options &&
                          formik.touched.options &&
                          formik.errors.options[index]?.value && (
                            <div className="text-danger mt-1">
                              {formik.errors.options[index]?.value}
                            </div>
                          )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-primary btn-sm mt-2"
                      onClick={() => {
                        formik.setFieldValue("options", [
                          ...formik.values.options,
                          { id: Date.now(), value: "", selected: false },
                        ]);
                      }}
                    >
                      Add Multi Choice
                    </button>
                  </div>
                )}
                {formik.values.ques_type.includes("shortCheckbox") && (
                  <div className="mt-2">
                    <label className="form-label">Short Answer</label>
                    <textarea
                      rows={3}
                      className={`form-control ${formik.touched.short_answer && formik.errors.short_answer
                        ? "is-invalid"
                        : ""
                        }`}
                      name="short_answer"
                      value={formik.values.short_answer}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.short_answer &&
                      formik.errors.short_answer && (
                        <div className="text-danger">
                          {formik.errors.short_answer}
                        </div>
                      )}
                  </div>
                )}
                {formik.values.ques_type.includes("uploadCheckbox") && (
                  <div className="mt-2">
                    <label className="form-label">Answer Upload</label>
                    <input
                      type="file"
                      className={`form-control form-control-sm ${formik.touched.answer_upload &&
                        formik.errors.answer_upload
                        ? "is-invalid"
                        : ""
                        }`}
                      name="answer_upload"
                      accept="image/*"
                      value={formik.values.answer_upload}
                      onChange={(event) => {
                        formik.setFieldValue("answer_upload", event.currentTarget.files[0]);
                      }}
                    />
                    {formik.touched.answer_upload &&
                      formik.errors.answer_upload && (
                        <div className="text-danger">
                          {formik.errors.answer_upload}
                        </div>
                      )}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Hint</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  {...formik.getFieldProps("hint")}
                ></input>
              </div>
            </div>
          </div>
        </div>
      </form >
    </div >
  );
}

export default ChallengesAdd;
