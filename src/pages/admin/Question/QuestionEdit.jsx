import * as yup from "yup";
import { useFormik } from "formik";
import { Link, useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../config/URL";

function QuestionEdit() {
  const [selectedCenter, setSelectedCenter] = useState([]);
  const [centerList, setCenterList] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [topics, setTopics] = useState([]);
  const { id } = useParams();


  const validationSchema = yup.object().shape({
    center_id: yup
      .array()
      .of(yup.string().required("*Select at least one centre"))
      .min(1, "*Select at least one centre")
      .required("*Select a centre name"),
    grade_id: yup.string().required("*Select a grade"),
    subject_id: yup.string().required("*Select a subject"),
    topic_id: yup.string().required("*Select a topic"),
    question: yup.string().required("*Question is required"),
    difficult_level: yup.string().required("*Select a difficult level"),
    ques_type: yup
      .array()
      .min(1, "*Select at least one question type")
      .required("*Select a question type"),
    multiChoices: yup.array().of(
      yup.object().shape({
        value: yup.string().required("*Multi choice value is required"),
      })
    ),
    filledAnswer: yup.string().required("*Field is required"),
    closedOption: yup.string().required("*Select a one option"),
    shortAnswer: yup.string().required("*Field is required"),
    checkUploadFile: yup.string().required("*Please upload a file"),
  });

  const formik = useFormik({
    initialValues: {
      center_id: "",
      grade_id: "",
      subject_id: "",
      topic_id: "",
      difficult_level: "",
      question: "",
      upload: null,
      ques_type: "",
      multiChoices: [
        { id: Date.now(), value: "" },
        { id: Date.now() + 1, value: "" },
      ],
      answer_upload: "",
      options: [],
      hint: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.post(`question/updated/${id}`, values);
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/question");
        }
      } catch (e) {
        toast.error("Error Fetching Data ", e?.response?.data?.error);
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const getData = async () => {
    try {
      const response = await api.get(`question/${id}`);
      const { data } = response.data;
      const parsedCenterIds = JSON.parse(data.center_id);
      const parsedCenterNames = JSON.parse(data.center_names);
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
    }
  };

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
      const formattedTopics = response.data?.data?.map((grade) => ({
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
      if (value === "multiCheckbox" && formik.values.multiChoices.length < 2) {
        formik.setFieldValue("multiChoices", [
          { id: Date.now(), value: "" },
          { id: Date.now() + 1, value: "" },
        ]);
      }
    } else {
      formik.setFieldValue(
        "ques_type",
        formik.values.ques_type.filter((option) => option !== value)
      );
      if (value === "multiCheckbox") {
        formik.setFieldValue("multiChoices", []);
      }
    }
  };

  const addMultiChoice = () => {
    formik.setFieldValue("multiChoices", [
      ...formik.values.multiChoices,
      { id: Date.now(), value: "" },
    ]);
  };

  const removeMultiChoice = (id) => {
    const updatedMultiChoices = formik.values.multiChoices.filter(
      (multiChoice) => multiChoice.id !== id
    );
    formik.setFieldValue("multiChoices", updatedMultiChoices);
  };

  useEffect(() => {
    getData();
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
            <Link to="/question" className="custom-breadcrumb">
              &nbsp;Question
            </Link>
          </li>
          <span className="breadcrumb-separator"> &gt; </span>
          <li className="breadcrumb-item active text-sm" aria-current="page">
            &nbsp;Question & Answer Edit
          </li>
        </ol>
        <div className="card" style={{ border: "1px solid #dbd9d0" }}>
          <div className="d-flex px-4 justify-content-between align-items-center card_header p-1 mb-4">
            <div className="d-flex align-items-center">
              <div className="d-flex">
                <div className="dot active"></div>
              </div>
              <span className="me-2 text-muted text-sm">
                Add Question & Answer
              </span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/question">
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
                <label className="form-label">Question</label>
                <span className="text-danger">*</span>
                <input
                  type="text"
                  className={`form-control form-control-sm ${formik.touched.question && formik.errors.question
                    ? "is-invalid"
                    : ""
                    }`}
                  {...formik.getFieldProps("question")}
                ></input>
                {formik.touched.question && formik.errors.question && (
                  <div className="invalid-feedback">
                    {formik.errors.question}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Upload File</label>
                <input
                  type="file"
                  className={`form-control form-control-sm ${formik.touched.upload_file && formik.errors.upload_file
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
              <div className="col-md-6 col-12 mb-3">
                <div>
                  <label className="form-label">
                    Question Type<span className="text-danger">*</span>
                  </label>
                </div>
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
                      placeholder="Your Question & Answer"
                      className={`form-control form-control-sm ${formik.touched.filledAnswer &&
                        formik.errors.filledAnswer
                        ? "is-invalid"
                        : ""
                        }`}
                      name="filledAnswer"
                      value={formik.values.filledAnswer}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.filledAnswer &&
                      formik.errors.filledAnswer && (
                        <div className="text-danger">
                          {formik.errors.filledAnswer}
                        </div>
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
                          name="closedOption"
                          value="yes"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.closedOption === "yes"}
                        />
                        <label className="form-check-label">Yes</label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="closedOption"
                          value="no"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.closedOption === "no"}
                        />
                        <label className="form-check-label">No</label>
                      </div>
                    </div>
                    {formik.touched.closedOption &&
                      formik.errors.closedOption && (
                        <div className="invalid-feedback d-block">
                          {formik.errors.closedOption}
                        </div>
                      )}
                  </div>
                )}
                {formik.values.ques_type.includes("multiCheckbox") && (
                  <div className="mt-2">
                    <label className="form-label">Select Multi Choice:</label>
                    {formik.values.multiChoices.map((multiChoice, index) => (
                      <div
                        key={multiChoice.id}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <input
                          type="checkbox"
                          className="form-check-input mb-2"
                          name="multiChoiseAnswer"
                          id="multiChoiseAnswer"
                          aria-label="Multi Choise"
                        />{" "}
                        &nbsp; &nbsp;
                        <div className="input-group mb-2">
                          <input
                            type="text"
                            className={`form-control form-control-sm ${formik.errors.multiChoices &&
                              formik.touched.multiChoices &&
                              formik.errors.multiChoices[index]?.value
                              ? "is-invalid"
                              : ""
                              }`}
                            name={`multiChoices[${index}].value`}
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
                          {index > 1 && (
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => removeMultiChoice(multiChoice.id)}
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                        {/* Validation message below the input group */}
                        {formik.errors.multiChoices &&
                          formik.touched.multiChoices &&
                          formik.errors.multiChoices[index]?.value && (
                            <div className="text-danger mt-1">
                              {formik.errors.multiChoices[index]?.value}
                            </div>
                          )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-primary btn-sm mt-2"
                      onClick={addMultiChoice}
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
                      className={`form-control ${formik.touched.shortAnswer && formik.errors.shortAnswer
                        ? "is-invalid"
                        : ""
                        }`}
                      name="shortAnswer"
                      value={formik.values.shortAnswer}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.shortAnswer &&
                      formik.errors.shortAnswer && (
                        <div className="text-danger">
                          {formik.errors.shortAnswer}
                        </div>
                      )}
                  </div>
                )}
                {formik.values.ques_type.includes("uploadCheckbox") && (
                  <div className="mt-2">
                    <label className="form-label">Upload File:</label>
                    <input
                      type="file"
                      className={`form-control form-control-sm ${formik.touched.checkUploadFile &&
                        formik.errors.checkUploadFile
                        ? "is-invalid"
                        : ""
                        }`}
                      name="checkUploadFile"
                      value={formik.values.checkUploadFile}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.checkUploadFile &&
                      formik.errors.checkUploadFile && (
                        <div className="text-danger">
                          {formik.errors.checkUploadFile}
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

export default QuestionEdit;
