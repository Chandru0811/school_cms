import * as yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../config/URL";
import { FiSave } from "react-icons/fi";
import { GoTrash } from "react-icons/go";
import { MdKeyboardArrowLeft } from "react-icons/md";

function ChallengesEdit() {
  const navigate = useNavigate();
  const [selectedCenter, setSelectedCenter] = useState([]);
  const [centerList, setCenterList] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const validationSchema = yup.object().shape({
    center_id: yup
      .array()
      .of(yup.string().required("*Select at least one centre"))
      .min(1, "*Select at least one centre")
      .required("*Select a centre name"),
    grade_id: yup.string().required("*Select a grade"),
    subject_id: yup.string().required("*Select a subject"),
    topic_id: yup.string().required("*Select a topic"),
    difficult_level: yup
      .string()
      .max(255, "*Difficult level must not exceed 255 characters")
      .required("*Select a difficult level"),
    uestion: yup
      .string()
      .max(255, "*Question must not exceed 255 characters")
      .required("*Question is required"),
    time_limit: yup
      .string()
      .matches(/^\d+$/, "*Time limit must be a number")
      .required("*Time limit is required"),
    ques_type: yup
      .array()
      .min(1, "*Select at least one question type")
      .required("*Select a question type"),
  });

  const formik = useFormik({
    initialValues: {
      center_id: [],
      grade_id: "",
      subject_id: "",
      topic_id: "",
      difficult_level: "",
      question: "",
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
      setLoadIndicator(true);
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
      formData.append("_method", "PUT");
      formData.append("grade_id", values.grade_id);
      formData.append("subject_id", values.subject_id);
      formData.append("topic_id", values.topic_id);
      formData.append("difficult_level", values.difficult_level);
      formData.append("question", values.question);
      formData.append("description", values.description);
      formData.append("time_limit", Number(values.time_limit));
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

      if (values.answer_upload instanceof File) {
        formData.append(
          "answer_upload",
          values.answer_upload,
          values.answer_upload.name
        );
      }

      values.options.forEach((option) => {
        if (option.value.trim()) {
          formData.append("options[]", option.value.trim());
        }
      });

      try {
        const response = await api.post(`challenge/update/${id}`, formData, {
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
  const getData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`challenge/${id}`);
      const { challenge, answer } = response.data.data;

      // Parse JSON strings
      const parsedCenterIds = JSON.parse(challenge.center_id);
      const parsedCenterNames = JSON.parse(challenge.center_names);
      const parsedQuesType = JSON.parse(challenge.ques_type);
      const parsedOptions = JSON.parse(challenge.options || "[]");
      const parsedAnswerType = JSON.parse(answer.answer_type);
      const parsedAnswer = JSON.parse(answer.answer);

      // Map selected centers
      const selectedCenters = parsedCenterIds.map((id, index) => ({
        value: id,
        label: parsedCenterNames[index] || "",
      }));
      const correctMultiChoiceAnswer = parsedAnswer.multichoice || "";

      // Map multi-choice options and set the selected one
      const initialMultiChoices = parsedOptions.map((option, index) => ({
        id: Date.now() + index,
        value: option.value || option,
        selected: (option.value || option) === correctMultiChoiceAnswer, // Mark selected option
      }));
      setSelectedCenter(selectedCenters);

      // Set initial values for the form
      formik.setValues({
        center_id: selectedCenters.map((center) => center.value),
        grade_id: challenge.grade_id,
        subject_id: challenge.subject_id,
        topic_id: challenge.topic_id,
        difficult_level: challenge.difficult_level,
        question: challenge.question,
        description: challenge.description,
        ques_type: parsedQuesType,
        options: initialMultiChoices,
        answer_upload: answer.answer_upload,
        hint: challenge.hint,
        time_limit: challenge.time_limit,
        answer: [
          {
            fillable: parsedAnswer.fillable || "",
            multichoice: parsedAnswer.multichoice || "",
            short_answer: parsedAnswer.short_answer || "",
            closed: parsedAnswer.closed || "",
          },
        ],
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
      toast.error(
        `Error Fetching Data: ${e?.response?.data?.error || e.message}`
      );
    }
  };

  const getGradeList = async () => {
    try {
      if (selectedCenter.length === 0) {
        setGrades([]);
        formik.setFieldValue("grade_id", "");
        return;
      }

      const centerIds = selectedCenter
        .map((center) => `center_id[]=${center.value}`)
        .join("&");
      const response = await api.get(`filter/grades?${centerIds}`);

      const formattedGrades = response.data?.data?.map((grade) => ({
        value: grade.id,
        label: grade.name,
      }));

      setGrades(formattedGrades);

      // Reset grade & subject if current values are no longer valid
      if (!formattedGrades.some((g) => g.value === formik.values.grade_id)) {
        formik.setFieldValue("grade_id", "");
        formik.setFieldValue("subject_id", "");
      }
    } catch (e) {
      toast.error(
        `Error Fetching Grades: ${e?.response?.data?.error || e.message}`
      );
    }
  };
  const getSubjectList = async () => {
    try {
      if (!formik.values.grade_id) {
        setSubjects([]);
        formik.setFieldValue("subject_id", "");
        return;
      }
      const response = await api.get(
        `filter/subjects?grade_id[]=${formik.values.grade_id}`
      );
      const formattedSubjects = response.data?.data?.map((subject) => ({
        value: subject.id,
        label: subject.name,
      }));
      setSubjects(formattedSubjects);
      if (
        !formattedSubjects.some((s) => s.value === formik.values.subject_id)
      ) {
        formik.setFieldValue("subject_id", "");
      }
    } catch (e) {
      toast.error(
        `Error Fetching Subjects: ${e?.response?.data?.error || e.message}`
      );
    }
  };
  const getTopicsList = async () => {
    try {
      if (!formik.values.subject_id) {
        setTopics([]);
        formik.setFieldValue("topic_id", "");
        return;
      }
      const response = await api.get(
        `filter/topics?subject_id[]=${formik.values.subject_id}`
      );
      const formattedTopics = response.data?.data?.map((topic) => ({
        value: topic.id,
        label: topic.name,
      }));
      setTopics(formattedTopics);
      if (!formattedTopics.some((s) => s.value === formik.values.topic_id)) {
        formik.setFieldValue("topic_id", "");
      }
    } catch (e) {
      toast.error(
        `Error Fetching Topics: ${e?.response?.data?.error || e.message}`
      );
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

  useEffect(() => {
    getData();
    getCenterList();
  }, []);

  useEffect(() => {
    if (selectedCenter.length > 0) {
      getGradeList();
    } else {
      setGrades([]);
      formik.setFieldValue("grade_id", "");
      formik.setFieldValue("subject_id", "");
      formik.setFieldValue("topic_id", "");
    }
  }, [selectedCenter]);

  useEffect(() => {
    if (formik.values.grade_id) {
      getSubjectList();
    } else {
      setSubjects([]);
      formik.setFieldValue("subject_id", "");
    }
  }, [formik.values.grade_id]);

  useEffect(() => {
    if (formik.values.subject_id) {
      getTopicsList();
    } else {
      setTopics([]);
      formik.setFieldValue("topic_id", "");
    }
  }, [formik.values.subject_id]);

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
        <div className="d-flex justify-content-between align-items-center  p-1 mb-4">
          <div className="d-flex align-items-center">
            <div>
              <Link to="/challenges">
                <button type="button" className="btn btn-sm add-btn p-1">
                  <MdKeyboardArrowLeft size={25} />
                </button>
              </Link>
              &nbsp;&nbsp;
            </div>
            <span className="mx-3 table-heading">
              Update Challenges -&nbsp;
              <span className="table-subheading">Update Challenges</span>
            </span>
          </div>
          <div className="my-2 d-flex align-items-center justify-content-between gap-5">
            <button
              type="button"
              className="btn view-delete-btn"
              onClick={() => {
                getData();
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
              <FiSave className="trash-icon" /> &nbsp;&nbsp; Save Challenges
            </button>
          </div>
        </div>
        <div className="card" style={{ border: "1px solid #dbd9d0" }}>
          <div className="d-flex justify-content-between px-5 my-2">
            <p className="view-header">Challenges Info</p>
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
                      <p className="view-label-text">Centre Name</p>{" "}
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
                          if (selected.length === 0) {
                            setGrades([]);
                            setSubjects([]);
                            formik.setFieldValue("grade_id", "");
                            formik.setFieldValue("subject_id", "");
                          }
                        }}
                        labelledBy="Select Center"
                        className={`form-multi-select form-multi-select-sm border-1 rounded-1 ${formik.touched.center_id && formik.errors.center_id
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
                      <p className="view-label-text">Grade</p>{" "}
                      <span className="text-danger">*</span>
                    </div>
                    <div className="col-7">
                      <select
                        className={`form-select form-select-sm ${formik.touched.grade_id && formik.errors.grade_id
                            ? "is-invalid"
                            : ""
                          }`}
                        value={formik.values.grade_id}
                        onChange={(e) =>
                          formik.setFieldValue("grade_id", e.target.value)
                        }
                      >
                        <option value="">Select grade</option>
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
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5 d-flex">
                      <p className="view-label-text">Subject</p>{" "}
                      <span className="text-danger">*</span>
                    </div>
                    <div className="col-7">
                      <select
                        className={`form-select form-select-sm ${formik.touched.subject_id && formik.errors.subject_id
                            ? "is-invalid"
                            : ""
                          }`}
                        value={formik.values.subject_id}
                        onChange={(e) =>
                          formik.setFieldValue("subject_id", e.target.value)
                        }
                      >
                        <option value="">Select Subject</option>
                        {subjects.map((subject) => (
                          <option key={subject.value} value={subject.value}>
                            {subject.label}
                          </option>
                        ))}
                      </select>
                      {formik.touched.subject_id &&
                        formik.errors.subject_id && (
                          <div className="invalid-feedback">
                            {formik.errors.subject_id}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5 d-flex">
                      <p className="view-label-text">Topic</p>{" "}
                      <span className="text-danger">*</span>
                    </div>
                    <div className="col-7">
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
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5 d-flex">
                      <p className="view-label-text"> Difficult Level</p>{" "}
                      <span className="text-danger">*</span>
                    </div>
                    <div className="col-7">
                      <div className="d-flex gap-3">
                        <div className="form-check">
                          <input
                            placeholder="Enter Text"
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
                            placeholder="Enter Text"
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
                            placeholder="Enter Text"
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
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5 d-flex">
                      <p className="view-label-text">Challenge Title</p>{" "}
                      <span className="text-danger">*</span>
                    </div>
                    <div className="col-7">
                      <input
                        placeholder="Enter Text"
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
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5 d-flex">
                      <p className="view-label-text">Challenge Descriptione</p>
                    </div>
                    <div className="col-7">
                      <textarea
                        rows={5}
                        className={`form-control ${formik.touched.description &&
                            formik.errors.description
                            ? "is-invalid"
                            : ""
                          }`}
                        {...formik.getFieldProps("description")}
                        maxLength={825}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5 d-flex">
                      <p className="view-label-text">Time Limit</p>{" "}
                      <span className="text-danger">*</span>
                    </div>
                    <div className="col-7">
                      <input
                        placeholder="Enter Text"
                        type="text"
                        className={`form-control form-control-sm ${formik.touched.time_limit && formik.errors.time_limit
                            ? "is-invalid"
                            : ""
                          }`}
                        {...formik.getFieldProps("time_limit")}
                        onInput={(e) =>
                          (e.target.value = e.target.value.replace(/\D/g, ""))
                        }
                      />
                      {formik.touched.time_limit &&
                        formik.errors.time_limit && (
                          <div className="invalid-feedback">
                            {formik.errors.time_limit}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5 d-flex">
                      <p className="view-label-text"> Question Type</p>{" "}
                      <span className="text-danger">*</span>
                    </div>
                    <div className="col-7">
                      {[
                        { id: "fillable", label: "Fillable" },
                        { id: "closed", label: "Closed" },
                        { id: "multichoice", label: "Multi choice" },
                        { id: "short_answer", label: "Short Answer" },
                        { id: "upload", label: "Answer Upload" },
                      ].map(({ id, label }) => (
                        <div className="form-check form-check-inline" key={id}>
                          <input
                            placeholder="Enter Text"
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
                        <div className="text-danger">
                          {formik.errors.ques_type}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 mb-3">
                  {/* Conditional Fields Based on Selected Checkboxes */}
                  {formik.values.ques_type.includes("fillable") && (
                    <div className="mt-2">
                      <label className="form-label">Enter your answer:</label>
                      <input
                        type="text"
                        placeholder="Your Question & Answer"
                        className={`form-control form-control-sm ${formik.touched.answer?.[0]?.fillable &&
                            formik.errors.answer?.[0]?.fillable
                            ? "is-invalid"
                            : ""
                          }`}
                        name="answer"
                        value={formik.values.answer[0]?.fillable || ""}
                        onChange={(e) => {
                          const updatedAnswer = [
                            {
                              ...formik.values.answer[0],
                              fillable: e.target.value,
                            },
                          ];
                          formik.setFieldValue("answer", updatedAnswer);
                        }}
                      />
                      {formik.touched.answer?.[0]?.fillable &&
                        formik.errors.answer?.[0]?.fillable && (
                          <div className="text-danger">
                            {formik.errors.answer[0]?.fillable}
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
                            name="closed"
                            value="yes"
                            onChange={(e) => {
                              // Create or update the first object in the answer array with closed value
                              const currentAnswer =
                                formik.values.answer?.[0] || {};
                              formik.setFieldValue("answer", [
                                { ...currentAnswer, closed: e.target.value },
                              ]);
                            }}
                            onBlur={formik.handleBlur}
                            checked={
                              formik.values.answer?.[0]?.closed === "yes"
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="closedYes"
                          >
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
                              const currentAnswer =
                                formik.values.answer?.[0] || {};
                              formik.setFieldValue("answer", [
                                { ...currentAnswer, closed: e.target.value },
                              ]);
                            }}
                            onBlur={formik.handleBlur}
                            checked={formik.values.answer?.[0]?.closed === "no"}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="closedNo"
                          >
                            No
                          </label>
                        </div>
                      </div>
                      {formik.touched.answer?.[0]?.closed &&
                        formik.errors.answer?.[0]?.closed && (
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
                                updatedAnswers = updatedAnswers.filter(
                                  (ans) => ans.multichoice !== multiChoice.value
                                );
                              } else {
                                updatedAnswers.push({
                                  fillable: "",
                                  multichoice: multiChoice.value,
                                  short_answer: "",
                                  closed: "",
                                });
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
                                updatedOptions[index].value =
                                  e.target.value.replace(/,/g, "");

                                // Update answer array if selected
                                let updatedAnswers = [...formik.values.answer];
                                if (multiChoice.selected) {
                                  updatedAnswers = updatedAnswers.map((ans) =>
                                    ans.multichoice === multiChoice.value
                                      ? {
                                        ...ans,
                                        multichoice: e.target.value.replace(
                                          /,/g,
                                          ""
                                        ),
                                      }
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
                                  let updatedOptions =
                                    formik.values.options.filter(
                                      (opt) => opt.id !== multiChoice.id
                                    );
                                  let updatedAnswers =
                                    formik.values.answer.filter(
                                      (ans) =>
                                        ans.multichoice !== multiChoice.value
                                    );

                                  formik.setFieldValue(
                                    "options",
                                    updatedOptions
                                  );
                                  formik.setFieldValue(
                                    "answer",
                                    updatedAnswers
                                  );
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
                  {formik.values.ques_type.includes("short_answer") && (
                    <div className="mt-2">
                      <label className="form-label">Short Answer</label>
                      <textarea
                        rows={3}
                        className={`form-control ${formik.touched.answer?.[0]?.short_answer &&
                            formik.errors.answer?.[0]?.short_answer
                            ? "is-invalid"
                            : ""
                          }`}
                        name="answer"
                        value={formik.values.answer[0]?.short_answer || ""}
                        onChange={(e) => {
                          const updatedAnswer = [
                            {
                              ...formik.values.answer[0],
                              short_answer: e.target.value,
                            },
                          ];
                          formik.setFieldValue("answer", updatedAnswer);
                        }}
                      />
                      {formik.touched.answer?.[0]?.short_answer &&
                        formik.errors.answer?.[0]?.short_answer && (
                          <div className="text-danger">
                            {formik.errors.answer[0]?.short_answer}
                          </div>
                        )}
                    </div>
                  )}
                  {formik.values.ques_type.includes("upload") && (
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
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          if (file) {
                            formik.setFieldValue("answer_upload", file);
                          }
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
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5 d-flex">
                      <p className="view-label-text">Hint</p>
                    </div>
                    <div className="col-7">
                      <input
                        placeholder="Enter Text"
                        type="text"
                        className="form-control form-control-sm"
                        {...formik.getFieldProps("hint")}
                      ></input>
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

export default ChallengesEdit;
