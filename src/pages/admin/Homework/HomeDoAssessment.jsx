import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import api from "../../../config/URL";

const HomeDoAssessment = () => {
  const [data, setData] = useState({});
  const [answers, setAnswers] = useState({});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const assignedId = queryParams.get("assignedId");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null); // Initialize as null
  const [timeSpent, setTimeSpent] = useState(0);

  const getData = async () => {
    try {
      const response = await api.get(`homework/assessment/${assignedId}`);
      setData(response.data.data);
      // Set the initial time limit for the first question if it exists
      if (response.data.data.questions && response.data.data.questions.length > 0) {
        const firstQuestion = response.data.data.questions[0];
        if (firstQuestion.time_limit) {
          setTimeLeft(firstQuestion.time_limit);
        }
      }
    } catch (e) {
      const errorMessage =
        e?.response?.data?.error || "Error Fetching Data. Please try again.";
      toast.error(errorMessage);
    }
  };

  const renderInputField = (quesType, id, options) => {
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
      // Set time limit for the next question if it exists
      if (nextQuestion.time_limit) {
        setTimeLeft(nextQuestion.time_limit);
      } else {
        setTimeLeft(null); // Hide timer if no time limit
      }
      setTimeSpent(0);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      const previousQuestion = data.questions[currentQuestionIndex - 1];
      // Set time limit for the previous question if it exists
      if (previousQuestion.time_limit) {
        setTimeLeft(previousQuestion.time_limit);
      } else {
        setTimeLeft(null); // Hide timer if no time limit
      }
      setTimeSpent(0);
    }
  };

  const handleSubmit = () => {
    console.log("Submitted Answers:", answers);
    // You can add an API call here to submit the answers to the server
  };

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setTimeSpent((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleNext(); // Automatically move to the next question when time runs out
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
      questionTypes = JSON.parse(matchedQues.ques_type);
    } catch (e) {
      questionTypes = Array.isArray(matchedQues.ques_type)
        ? matchedQues.ques_type
        : [matchedQues.ques_type];
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
              </div>
              <div className="d-flex align-items-center justify-content-between mt-auto">
                <button
                  type="button"
                  className="btn btn-sm btn-light"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </button>

                {timeLeft !== null && <span className="text-danger">Time Left: {timeLeft} sec</span>}

                <button
                  type="button"
                  className={`btn btn-sm ${currentQuestionIndex === data.questions.length - 1 ? "btn-primary" : "btn-secondary"
                    }`}
                  onClick={() =>
                    currentQuestionIndex === data.questions.length - 1 ? handleSubmit() : handleNext()
                  }
                >
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

export default HomeDoAssessment;