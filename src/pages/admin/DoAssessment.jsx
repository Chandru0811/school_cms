import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../config/URL";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";

const DoAssessment = () => {
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const location = useLocation();
  const [loadIndicator, setLoadIndicator] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const assignedId = queryParams.get("assignedId");
  console.log("assesmentID:", assignedId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timeSpentPerQuestion, setTimeSpentPerQuestion] = useState({});
  const [timeUpQuestions, setTimeUpQuestions] = useState({});

  const validateAnswers = () => {
    if (!data.questions) return false;

    for (let i = 0; i < data.questions.length; i++) {
      const question = data.questions[i];
      // Skip validation if the question's time is up
      if (!timeUpQuestions[question.id] && !answers[question.id]) {
        return false;
      }
    }
    return true;
  };

  const formik = useFormik({
    initialValues: {
      assessment_id: assignedId,
      question_id: [],
      answer: [],
    },
    onSubmit: async (values) => {
      if (!validateAnswers()) {
        toast.error("Please answer questions before submitting.");
        return;
      }

      setLoadIndicator(true);
      console.log("values", values);
      const formData = new FormData();
      formData.append("assessment_id", assignedId);

      // Sort the answers by question ID
      const sortedAnswers = Object.keys(answers)
        .sort((a, b) => a - b)
        .map((key) => ({
          question_id: key,
          answer: answers[key],
        }));

      // Include empty answers for time-up questions
      data.questions.forEach((question) => {
        if (timeUpQuestions[question.id] && !answers[question.id]) {
          sortedAnswers.push({
            question_id: question.id,
            answer: { empty: true }, // Indicate that the answer is empty due to time-up
          });
        }
      });

      sortedAnswers.forEach((item) => {
        formData.append(`question_id[${item.question_id}]`, item.question_id);
        if (item.answer.upload) {
          formData.append(`answer[${item.question_id}]`, item.answer.upload);
        } else if (item.answer.fillable) {
          formData.append(`answer[${item.question_id}]`, item.answer.fillable);
        } else if (item.answer.closed) {
          formData.append(`answer[${item.question_id}]`, item.answer.closed);
        } else if (item.answer.multichoice) {
          formData.append(`answer[${item.question_id}]`, item.answer.multichoice);
        } else if (item.answer.short_answer) {
          formData.append(`answer[${item.question_id}]`, item.answer.short_answer);
        } else if (item.answer.empty) {
          formData.append(`answer[${item.question_id}]`, "Not attend Question"); // Send empty answer for time-up questions
        }
      });

      try {
        const response = await api.post("worksheet/assessment", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          toast.success(response.data.message);
          navigate(`/worksheet/view/${assignedId}`);
        }
      } catch (e) {
        console.error("Error Fetching Data", e);
        toast.error("Error Fetching Data", e?.response?.data?.error || e.message);
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const getData = async () => {
    try {
      const response = await api.get(`worksheet/assessment/${assignedId}`);
      setData(response.data.data);
      if (response.data.data.questions && response.data.data.questions.length > 0) {
        const firstQuestion = response.data.data.questions[0];
        if (firstQuestion.time_limit && firstQuestion.time_limit > 0) {
          setTimeLeft(firstQuestion.time_limit);
        } else {
          setTimeLeft(null);
        }
      }
    } catch (e) {
      const errorMessage =
        e?.response?.data?.error || "Error Fetching Data. Please try again.";
      toast.error(errorMessage);
    }
  };

  const renderInputField = (quesType, id, options) => {
    const isDisabled = timeUpQuestions[id];

    switch (quesType) {
      case "fillable":
        return (
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Your answer"
            value={answers[id]?.fillable || ""}
            onChange={(e) =>
              setAnswers({
                ...answers,
                [id]: { ...answers[id], fillable: e.target.value },
              })
            }
            disabled={isDisabled}
          />
        );

      case "closed":
        return (
          <div>
            <label className="me-3">
              <input
                type="radio"
                className="form-check-input me-1"
                name={`closed-${id}`}
                value="yes"
                checked={answers[id]?.closed === "yes"}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    [id]: { ...answers[id], closed: e.target.value },
                  })
                }
                disabled={isDisabled}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                className="form-check-input me-1"
                name={`closed-${id}`}
                value="no"
                checked={answers[id]?.closed === "no"}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    [id]: { ...answers[id], closed: e.target.value },
                  })
                }
                disabled={isDisabled}
              />
              No
            </label>
          </div>
        );

      case "multichoice":
        return (
          <div>
            {options.map((option, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  name={`multichoice-${id}`}
                  checked={answers[id]?.multichoice === option}
                  onChange={(e) => {
                    setAnswers({
                      ...answers,
                      [id]: { ...answers[id], multichoice: option },
                    });
                  }}
                  disabled={isDisabled}
                />
                <label className="ms-2">{option}</label>
              </div>
            ))}
          </div>
        );

      case "short_answer":
        return (
          <textarea
            placeholder="Your answer"
            rows={4}
            className="form-control form-control-sm"
            value={answers[id]?.short_answer || ""}
            onChange={(e) =>
              setAnswers({
                ...answers,
                [id]: { ...answers[id], short_answer: e.target.value },
              })
            }
            disabled={isDisabled}
          />
        );

      case "upload":
        return (
          <input
            type="file"
            className="form-control form-control-sm"
            onChange={(e) =>
              setAnswers({
                ...answers,
                [id]: { ...answers[id], upload: e.target.files[0] },
              })
            }
            disabled={isDisabled}
          />
        );

      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < data.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      const nextQuestion = data.questions[currentQuestionIndex + 1];
      if (nextQuestion.time_limit) {
        setTimeLeft(nextQuestion.time_limit - (timeSpentPerQuestion[nextQuestion.id] || 0));
      } else {
        setTimeLeft(null);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      const previousQuestion = data.questions[currentQuestionIndex - 1];
      if (previousQuestion.time_limit) {
        setTimeLeft(previousQuestion.time_limit - (timeSpentPerQuestion[previousQuestion.id] || 0));
      } else {
        setTimeLeft(null);
      }
    }
  };

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setTimeSpentPerQuestion((prev) => ({
          ...prev,
          [data.questions[currentQuestionIndex].id]: (prev[data.questions[currentQuestionIndex].id] || 0) + 1,
        }));
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setTimeUpQuestions((prev) => ({
        ...prev,
        [data.questions[currentQuestionIndex].id]: true,
      }));
    }
  }, [timeLeft, currentQuestionIndex]);

  useEffect(() => {
    getData();
  }, [assignedId]);

  if (!data?.questions || !data?.ques_id_with_type) return null;

  const quesIdWithType = JSON.parse(data.ques_id_with_type);
  const currentQuestion = data.questions[currentQuestionIndex];
  const matchedQues = quesIdWithType.find((q) => q.id === currentQuestion.id);
  let questionTypes = [];
  if (matchedQues) {
    try {
      questionTypes = Array.isArray(matchedQues.questype)
        ? matchedQues.questype
        : [matchedQues.questype];
    } catch (e) {
      questionTypes = [matchedQues.questype];
    }
  }

  const options = JSON.parse(currentQuestion.options || "[]");

  return (
    <section>
      <div className="container-fluid">
        <div className="row" style={{ background: "white" }}>
          <div className="col-md-2 col-12"></div>
          <div
            className="col-md-8 col-12 d-flex align-items-center justify-content-center flex-column"
            style={{ minHeight: "80vh" }}
          >
            <h4 className="text-center my-4">Worksheet</h4>
            <div
              className="card custom-card p-3 m-5 d-flex flex-column"
              style={{ width: "100%", minHeight: "50vh" }}
            >
              <p className="mb-3">
                <strong>Question:</strong> {currentQuestion.question}
              </p>
              <div className="p-2 flex-grow-1">
                {questionTypes.map((quesType) =>
                  renderInputField(quesType, currentQuestion.id, options)
                )}
                {timeUpQuestions[currentQuestion.id] && (
                  <div className="text-danger my-2">
                    Time's up! You can not answer this question.
                  </div>
                )}
              </div>
              <div className="d-flex align-items-center justify-content-between mt-auto ms-auto">
                {currentQuestionIndex !== 0 &&
                  <button
                    type="button"
                    className="btn btn-sm btn-light"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </button>}

                {timeLeft !== null && <p className="text-danger">Time Left: {timeLeft} sec</p>}

                <button
                  type="button"
                  className={`btn btn-sm ${currentQuestionIndex === data.questions.length - 1 ? "btn-primary" : "btn-secondary"
                    }`}
                  onClick={() =>
                    currentQuestionIndex === data.questions.length - 1 ? formik.handleSubmit() : handleNext()
                  }
                  disabled={loadIndicator}
                >
                  {loadIndicator && (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      aria-hidden="true"
                    ></span>
                  )}
                  {currentQuestionIndex === data.questions.length - 1 ? "Submit" : "Next"}
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-2 col-12"></div>
        </div>
      </div>
    </section>
  );
};

export default DoAssessment;