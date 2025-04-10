import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../config/URL";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import Modal from "react-bootstrap/Modal";
import ImageURL from "../../config/ImageURL";
import { FaBookmark } from "react-icons/fa";
import { HiOutlineLightBulb } from "react-icons/hi";
import { format } from "date-fns";
import { TbArrowForwardUpDouble } from "react-icons/tb";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoClose, IoPauseCircleOutline, IoPlay } from "react-icons/io5";
import icon2 from "../../assets/images/Icon (2).svg";
import { CiBookmark } from "react-icons/ci";

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
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [overallTimeLeft, setOverallTimeLeft] = useState(data.time_limit * 60);
  const [startTime, setStartTime] = useState(null);
  const [timeTakenDisplay, setTimeTakenDisplay] = useState("00:00:00");
  const [isPaused, setIsPaused] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [pausedTime, setPausedTime] = useState(0); // Total time paused in milliseconds
  const [pauseStartTime, setPauseStartTime] = useState(null);

  // Function to handle image click
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };
  // Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // const handlePauseClick = () => {
  //   setIsPaused(true);  // Pause the timer
  //   setShowResume(true);
  // };
  // // Function to resume the timer
  // const handlePauseClose = () => {
  //   setIsPaused(false); // Resume the timer
  //   setShowResume(false);
  // };

  const handlePauseClick = () => {
    setIsPaused(true); // Pause the timer
    setPauseStartTime(Date.now()); // Record the time when pause was clicked
    setShowResume(true);

    // Log the time when paused
    console.log("Timer paused at:", new Date().toLocaleTimeString());
  };

  const handlePauseClose = () => {
    if (pauseStartTime) {
      const pauseEndTime = Date.now();
      const currentPauseDuration = pauseEndTime - pauseStartTime;
      setPausedTime((prevPausedTime) => prevPausedTime + currentPauseDuration); // Add to total paused time

      // Log the time when resumed
      console.log("Timer resumed at:", new Date().toLocaleTimeString());
      console.log("Paused for (ms):", currentPauseDuration);
    }
    setIsPaused(false); // Resume the timer
    setPauseStartTime(null); // Reset pause start time
    setShowResume(false);
  };

  const parseTimeLimit = (timeLimit) => {
    const [hours, minutes, seconds] = timeLimit.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // const calculateTimeTaken = () => {
  //   if (!startTime) return "00:00:00";

  //   const endTime = Date.now(); // Current time when submission happens
  //   const timeTakenInSeconds = Math.floor((endTime - startTime) / 1000); // Convert to seconds

  //   // Format the time taken into HH:MM:SS
  //   const hours = Math.floor(timeTakenInSeconds / 3600);
  //   const minutes = Math.floor((timeTakenInSeconds % 3600) / 60);
  //   const seconds = timeTakenInSeconds % 60;

  //   return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  // };

  const calculateTimeTaken = () => {
    if (!startTime) return "00:00:00";

    const endTime = Date.now(); // Current time when submission happens
    const elapsedTime = endTime - startTime; // Total elapsed time in milliseconds
    const activeTime = elapsedTime - pausedTime; // Subtract paused time

    const timeTakenInSeconds = Math.floor(activeTime / 1000); // Convert to seconds

    // Format the time taken into HH:MM:SS
    const hours = Math.floor(timeTakenInSeconds / 3600);
    const minutes = Math.floor((timeTakenInSeconds % 3600) / 60);
    const seconds = timeTakenInSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

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
  // Calculate total time taken
  const timeTaken = calculateTimeTaken();
  console.log("taken::", timeTaken);

  const formik = useFormik({
    initialValues: {
      assessment_id: assignedId,
      question_id: [],
      answer: [],
    },
    onSubmit: async (values) => {
      // if (!validateAnswers()) {
      //   toast.error("Please answer questions before submitting.");
      //   return;
      // }

      setLoadIndicator(true);
      console.log("values", values);
      const formData = new FormData();
      formData.append("assessment_id", assignedId);

      formData.append("time_taken", timeTaken);

      // Sort the answers by question ID
      const sortedAnswers = Object.keys(answers)
        .sort((a, b) => a - b)
        .map((key) => ({
          question_id: key,
          answer: answers[key],
        }));

      // Include empty answers for time-up questions or unanswered questions
      data.questions.forEach((question) => {
        if (!answers[question.id]) {
          sortedAnswers.push({
            question_id: question.id,
            answer: { empty: true }, // Indicate that the answer is empty
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
          formData.append(`answer[${item.question_id}]`, ""); // Send empty answer for unanswered or time-up questions
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
          const { total_score, title } = data;
          const { score, rewards, time_taken } = response.data.data.student_attempt;
          const { validate, best_score, total_questions, total_attended_questions, total_correct_questions,
            total_wrong_questions, total_skipped_questions } = response.data.data;

          const queryParams = new URLSearchParams({
            id: assignedId,
            score: score ?? 0,
            rewards: rewards ?? "",
            totalScore: total_score ?? "",
            title: title ?? "",
            total_questions: total_questions ?? "",
            validate: validate ?? "",
            best_score: best_score ?? "",
            total_attended_questions: total_attended_questions ?? "",
            total_correct_questions: total_correct_questions ?? "",
            total_wrong_questions: total_wrong_questions ?? "",
            total_skipped_questions: total_skipped_questions ?? "",
            time_taken: time_taken ?? "",
          }).toString();

          if (score === null || score === 0) {
            navigate(`/successfull?id=${assignedId}`);
          } else {
            // navigate(`/successfull?score=${score}&rewards=${rewards}&id=${assignedId}
            //   &totalScore=${total_score}&total_questions=${total_questions}&total_attended_questions=
            //   ${total_attended_questions}&total_correct_questions`);
            navigate(`/successfull?${queryParams}`);
          }
        }
      } catch (e) {
        let errorMessage = "Error submitting assessment. Please try again.";

        if (e?.response?.status === 403) {
          errorMessage = "You do not have permission to access this page.";
        } else if (e?.response?.data?.errors) {
          errorMessage = Object.values(e.response.data.errors).flat().join("\n");
        } else if (e?.response?.data?.error) {
          errorMessage = e.response.data.error;
        } else if (e.message) {
          errorMessage = e.message;
        }
        toast.error(errorMessage);
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
        setQuestionCount(response.data.data.questions.length);
        const firstQuestion = response.data.data.questions[0];
        if (firstQuestion.time_limit && firstQuestion.time_limit > 0) {
          setTimeLeft(firstQuestion.time_limit);
        } else {
          setTimeLeft(null);
        }
      }
      // if (response.data.data.time_limit) {
      //   setOverallTimeLeft(response.data.data.time_limit);
      // }
      if (response.data.data.time_limit) {
        const totalSeconds = parseTimeLimit(response.data.data.time_limit);
        setOverallTimeLeft(totalSeconds);
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
          <div>
            <input
              type="text"
              className="form-control form-control-sm mb-5"
              placeholder="Your answer"
              value={answers[id]?.fillable || ""}
              onChange={(e) =>
                setAnswers({
                  ...answers,
                  [id]: { ...answers[id], fillable: e.target.value, skipped: false, hold: false },
                })
              }
              disabled={isDisabled}
              style={{
                border: "1px solid #4F46E5",
                borderRadius: "5px",
              }}
            />
            {currentQuestion.hint && (
              <div
                className="p-3 d-flex align-items-center"
                style={{
                  display: "inline-block",
                  width: "max-content",
                  minWidth: "10rem",
                  border: "1px solid #4F46E5",
                  borderRadius: "5px",
                }}
              >
                <HiOutlineLightBulb size={20} className="fw-bold me-2" style={{ color: "#4F46E5" }} />
                <span>
                  <strong className="dash-font" style={{ color: "#4F46E5" }}>Hint:</strong>
                  <span className="dash-font" style={{ color: "#000" }}> {currentQuestion.hint}</span>
                </span>
              </div>
            )}
          </div>
        );

      case "closed":
        return (
          <div>
            <label className="me-3">
              <input
                type="radio"
                className="form-check-input me-1 mb-5"
                name={`closed-${id}`}
                value="yes"
                checked={answers[id]?.closed === "yes"}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    [id]: { ...answers[id], closed: e.target.value, skipped: false, hold: false },
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
                    [id]: { ...answers[id], closed: e.target.value, skipped: false, hold: false },
                  })
                }
                disabled={isDisabled}
              />
              No
            </label>
            {currentQuestion.hint && (
              <div
                className="p-3 d-flex align-items-center"
                style={{
                  display: "inline-block",
                  width: "max-content",
                  minWidth: "10rem",
                  border: "1px solid #4F46E5",
                  borderRadius: "5px",
                }}
              >
                <HiOutlineLightBulb size={20} className="fw-bold me-2" style={{ color: "#4F46E5" }} />
                <span>
                  <strong className="dash-font" style={{ color: "#4F46E5" }}>Hint:</strong>
                  <span className="dash-font" style={{ color: "#000" }}> {currentQuestion.hint}</span>
                </span>
              </div>
            )}
          </div>
        );

      case "multichoice":
        return (
          <div>
            {options?.map((option, index) => {
              const isSelected = answers[id]?.multichoice?.includes(option);

              return (
                <p
                  key={index}
                  className={`p-3 d-flex align-items-center mb-4 fw-semibold dash-font fw-14 pe-4 ${isSelected ? "selected-option" : ""
                    }`}
                  style={{
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    gap: "1rem",
                    width: "max-content",
                    minWidth: "10rem",
                    border: isSelected ? "1px solid #4F46E5" : "1px solid #ccc",
                    backgroundColor: isSelected ? "#D4D2F9" : "transparent",
                    borderRadius: "13px",
                    opacity: isDisabled ? 0.6 : 1,
                    padding: "10px 15px",
                  }}
                  onClick={() => {
                    if (isDisabled) return;

                    const selectedOptions = answers[id]?.multichoice || [];
                    const updatedOptions = isSelected
                      ? selectedOptions.filter((item) => item !== option) // Deselect option
                      : [...selectedOptions, option]; // Select option

                    // Update answers state and remove skipped flag
                    setAnswers({
                      ...answers,
                      [id]: { multichoice: updatedOptions, skipped: false, hold: false },
                    });

                    setHasInteracted(true); // Mark the question as interacted with
                  }}
                >
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name={`multichoice-${id}`}
                    checked={isSelected}
                    onChange={() => { }} // No-op, handled by onClick
                    disabled={isDisabled}
                    onClick={(e) => e.stopPropagation()} // Prevent double trigger
                  />
                  <label
                    className="mb-0"
                    style={{
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      flex: 1,
                    }}
                  >
                    {option}
                  </label>
                </p>
              );
            })}
            {currentQuestion.hint && (
              <div
                className="p-3 d-flex align-items-center pe-4"
                style={{
                  display: "inline-block",
                  width: "max-content",
                  minWidth: "10rem",
                  border: "1px solid #4F46E5",
                  borderRadius: "5px",
                  marginTop: "4rem",
                }}
              >
                <HiOutlineLightBulb size={20} className="fw-bold me-2" style={{ color: "#4F46E5" }} />
                <span>
                  <strong className="dash-font" style={{ color: "#4F46E5" }}>Hint:</strong>
                  <span className="dash-font" style={{ color: "#000" }}> {currentQuestion.hint}</span>
                </span>
              </div>
            )}
          </div>
        );

      case "short_answer":
        return (
          <div>
            <textarea
              placeholder="For answer"
              rows={4}
              className="form-control form-control-sm mb-5"
              value={answers[id]?.short_answer || ""}
              onChange={(e) =>
                setAnswers({
                  ...answers,
                  [id]: { ...answers[id], short_answer: e.target.value, skipped: false, hold: false },
                })
              }
              disabled={isDisabled}
              style={{
                border: "1px solid #4F46E5",
                borderRadius: "5px",
              }}
            />
            {currentQuestion.hint && (
              <div
                className="p-3 d-flex align-items-center"
                style={{
                  display: "inline-block",
                  width: "max-content",
                  minWidth: "10rem",
                  border: "1px solid #4F46E5",
                  borderRadius: "5px",
                }}
              >
                <HiOutlineLightBulb size={20} className="fw-bold me-2" style={{ color: "#4F46E5" }} />
                <span>
                  <strong className="dash-font" style={{ color: "#4F46E5" }}>Hint:</strong>
                  <span className="dash-font" style={{ color: "#000" }}> {currentQuestion.hint}</span>
                </span>
              </div>
            )}
          </div>
        );

      case "upload":
        return (
          <div>
            {currentQuestion.upload && (
              <img
                src={`${ImageURL.replace(/\/$/, "")}/${currentQuestion.upload.replace(
                  /^\//,
                  ""
                )}`}
                alt="Question Upload"
                style={{ width: "100px", cursor: "pointer" }}
                onClick={() => handleImageClick(currentQuestion.upload)}
              />
            )}
            <input
              type="file"
              className="form-control form-control-sm mt-2 mb-5"
              accept="image/*"
              onChange={(e) =>
                setAnswers({
                  ...answers,
                  [id]: { ...answers[id], upload: e.target.files[0], skipped: false, hold: false },
                })
              }
              disabled={isDisabled}
              style={{
                border: "1px solid #4F46E5",
                borderRadius: "5px",
              }}
            />
            {currentQuestion.hint && (
              <div
                className="p-3 mt-5 d-flex align-items-center"
                style={{
                  display: "inline-block",
                  width: "max-content",
                  minWidth: "10rem",
                  border: "1px solid #4F46E5",
                  borderRadius: "5px",
                }}
              >
                <HiOutlineLightBulb size={20} className="fw-bold me-2" style={{ color: "#4F46E5" }} />
                <span>
                  <strong className="dash-font" style={{ color: "#4F46E5" }}>Hint:</strong>
                  <span className="dash-font" style={{ color: "#000" }}> {currentQuestion.hint}</span>
                </span>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    const heldQuestions = Object.keys(answers).filter(
      (key) => answers[key]?.hold === true
    );

    // if (heldQuestions.length > 0) {
    //   const firstHeldQuestionId = heldQuestions[0];
    //   const firstHeldQuestionIndex = data.questions.findIndex(
    //     (q) => q.id === firstHeldQuestionId
    //   );

    //   if (firstHeldQuestionIndex !== -1) {
    //     setCurrentQuestionIndex(firstHeldQuestionIndex);
    //     toast.error("Please address held questions before submitting.");
    //     return; // Prevent submission
    //   }
    // }

    // Calculate skipped and held questions count
    const skippedQuestions = Object.keys(answers).filter(
      (key) => answers[key]?.skipped === true
    ).length;

    const heldQuestionsCount = heldQuestions.length;

    // Show toast message with skipped and held questions count
    toast(
      `You have skipped ${skippedQuestions} question(s) and hold ${heldQuestionsCount} question(s).`, { icon: "⚠️" }
    );
    await formik.handleSubmit();
  };

  const handleNext = () => {
    const currentQuestionId = data.questions[currentQuestionIndex].id;

    // Check if the current question has been answered or interacted with
    if (
      (!answers[currentQuestionId] || Object.keys(answers[currentQuestionId]).length === 0) &&
      !hasInteracted
    ) {
      toast.error("Please select an answer");
      return;
    }

    // Reset interaction state for the next question
    setHasInteracted(false);

    // Proceed to the next question
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
      setHasInteracted(false); // Reset interaction state for the previous question
    }
  };

  const handleSkip = () => {
    const currentQuestionId = data.questions[currentQuestionIndex].id;

    // Mark the current question as skipped
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionId]: { skipped: true }, // Mark as skipped
    }));

    // Move to the next question
    if (currentQuestionIndex < data.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      const nextQuestion = data.questions[currentQuestionIndex + 1];
      if (nextQuestion.time_limit) {
        setTimeLeft(nextQuestion.time_limit - (timeSpentPerQuestion[nextQuestion.id] || 0));
      } else {
        setTimeLeft(null);
      }
      setHasInteracted(false); // Reset interaction state for the next question
    }
  };

  const handleHold = () => {
    const currentQuestionId = data.questions[currentQuestionIndex].id;

    // Mark the current question as held
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionId]: { hold: true },
    }));

    // Move to the next question
    if (currentQuestionIndex < data.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      const nextQuestion = data.questions[currentQuestionIndex + 1];
      if (nextQuestion.time_limit) {
        setTimeLeft(nextQuestion.time_limit - (timeSpentPerQuestion[nextQuestion.id] || 0));
      } else {
        setTimeLeft(null);
      }
      setHasInteracted(false); // Reset interaction state for the next question
    }
    console.log("hold question::", currentQuestionId)
  };

  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        const currentTime = Date.now();
        const timeTakenInSeconds = Math.floor((currentTime - startTime) / 1000);

        const hours = Math.floor(timeTakenInSeconds / 3600);
        const minutes = Math.floor((timeTakenInSeconds % 3600) / 60);
        const seconds = timeTakenInSeconds % 60;

        setTimeTakenDisplay(
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
        );
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [startTime]);

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
    if (overallTimeLeft > 0 && !isPaused) {
      const timer = setInterval(() => {
        setOverallTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (overallTimeLeft === 0) {
      // Notify the user about skipped and held questions
      const skippedQuestions = Object.keys(answers).filter(
        (key) => answers[key]?.skipped === true
      ).length;
      const heldQuestions = Object.keys(answers).filter(
        (key) => answers[key]?.hold === true
      ).length;

      if (skippedQuestions > 0 || heldQuestions > 0) {
        toast(
          `You have skipped ${skippedQuestions} question(s) and hold ${heldQuestions} question(s).`,
          { icon: "⚠️" }
        );
      }

      // Submit the assessment
      formik.handleSubmit();
    }
  }, [overallTimeLeft, isPaused]);

  useEffect(() => {
    getData();
  }, [assignedId]);

  useEffect(() => {
    if (data.time_limit) {
      setStartTime(Date.now());
    }
  }, [data]);

  if (!data?.questions || !data?.ques_id_with_type) return null;

  const quesIdWithType = JSON.parse(data.ques_id_with_type);
  const currentQuestion = data.questions[currentQuestionIndex];
  const matchedQues = quesIdWithType?.find((q) => q.id === currentQuestion?.id);
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

  const options = JSON.parse(currentQuestion?.options || "[]");

  return (
    <div className="container-fluid px-0">
      <div className="d-flex px-4 justify-content-between align-items-center  p-1 mb-4">
        <div className="d-flex align-items-center">
          {/* <div>
            <Link to={`/worksheet/view/${assignedId}`}>
              <button type="button" className="btn btn-sm add-btn">
                <MdKeyboardArrowLeft size={20} />
              </button>
            </Link>
            &nbsp;&nbsp;
          </div> */}
          <span className="mx-3 table-heading dash-font">
            {data.title} -&nbsp;
            <span className="dash-font table-subheading">
              Started at {format(new Date(), "hh:mm a")}
            </span>
          </span>
        </div>
        <div className="d-flex align-items-center">
          <button type="button" className="dash-font btn btn-sm add-btn"
            onClick={() => handlePauseClick()}>
            <IoPauseCircleOutline size={15} />&nbsp;
            Pause
          </button>
          &nbsp;&nbsp;
          &nbsp;&nbsp;
          <div className="">
            <Link to={`/worksheet/view/${assignedId}`}>
              <button type="button" className="dash-font btn btn-sm quit-btn">
                <IoClose size={15} />&nbsp;
                Quit
              </button>
            </Link>
            &nbsp;&nbsp;
          </div>
        </div>
      </div>
      <div className="row m-0">
        <div className="col-md-9 col-12">
          <div className="card p-4">
            <h4 className="text-primary dash-font fw-semibold">Question {currentQuestionIndex + 1} of {questionCount}</h4>
            <p className="fw-semibold dash-font fs-5 mb-7">
              {currentQuestion?.question}
            </p>

            <div className="mt-4 fw-semibold dash-font fw-14">
              {questionTypes?.map((quesType) =>
                renderInputField(quesType, currentQuestion?.id, options)
              )}
            </div>
            <div className="row mt-4 fw-semibold dash-font fw-14">
              <div className="col-md-6">
                {timeUpQuestions[currentQuestion?.id] && (
                  <div className="text-danger dash-font my-2">
                    Time's up! You can not answer this question.
                  </div>
                )}
              </div>
              <div className="col-md-6 text-end">
                {timeLeft !== null && <p className="text-danger dash-font">Time Left: {timeLeft} sec</p>}
              </div>
            </div>
            <div className="row mt-5">
              {/* Previous Button */}
              <div className="col-md-3 col-6 mb-2 d-flex align-items-center">
                {currentQuestionIndex !== 0 && (
                  <button
                    type="button"
                    className="dash-font btn btn-sm text-black btn-outline-secondary d-flex align-items-center"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                  >
                    <IoIosArrowBack className="me-1" />
                    Previous
                  </button>
                )}
              </div>

              {/* Skip Question Button */}
              <div className="col-md-3 col-6 mb-2 d-flex justify-content-center">
                {currentQuestionIndex === data.questions.length - 1 ? (
                  <></>
                ) : (
                  <>
                    <button
                      type="button"
                      className="dash-font btn btn-sm d-flex align-items-center text-black btn-outline-secondary"
                      onClick={handleSkip}
                    >
                      <TbArrowForwardUpDouble className="me-1" />
                      Skip Question
                    </button>
                  </>
                )}
              </div>

              <div className="col-md-3 col-6 mb-2 d-flex justify-content-center">
                {currentQuestionIndex === data.questions.length - 1 ? (
                  <></>
                ) : (
                  <>
                    <button
                      type="button"
                      className="dash-font btn btn-sm d-flex align-items-center text-black btn-outline-secondary"
                      onClick={handleHold}
                    >
                      <CiBookmark className="me-1" />
                      Hold Question
                    </button>
                  </>
                )}
              </div>

              {/* Next/Submit Button */}
              <div className="col-md-3 col-6 mb-2 d-flex justify-content-end">
                <button
                  type="button"
                  className={`dash-font btn btn-sm d-flex align-items-center add-btn`}
                  onClick={() =>
                    currentQuestionIndex === data.questions.length - 1 ? handleSubmit() : handleNext()
                  }
                  disabled={loadIndicator}
                >
                  {loadIndicator && (
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                  )}
                  {currentQuestionIndex === data.questions.length - 1 ? "Submit" : "Next Question"}
                  <IoIosArrowForward className="ms-1" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-12">
          <div className="card pagination-card h-100 p-3 d-flex flex-column justify-content-between">
            <div className="text-center mb-5">
              {data.time_limit !== null ?
                (<>
                  <div className="row">
                    <div className="col-md-5 col-12">
                      <img src={icon2} alt="" className="py-3 img-fluid ms-2 " />
                    </div>
                    <div className="col-md-7 col-12 py-3 text-end">
                      <p className="dash-font fw-12 fw-semibold">TIME LEFT</p>
                      {/* <p className="dash-font heading-color fw-bold">{data.time_limit} Mins</p> */}
                      <p className="dash-font heading-color fw-bold">
                        {/* {Math.floor(overallTimeLeft / 60)}:{overallTimeLeft % 60 < 10 ? `0${overallTimeLeft % 60}` : overallTimeLeft % 60} */}
                        {formatTime(overallTimeLeft)}
                      </p>
                      {/* <p className="dash-font fw-12 fw-semibold">TIME TAKEN</p>
                      <p className="dash-font heading-color fw-bold">
                        {timeTakenDisplay}
                      </p> */}
                    </div>
                  </div>
                </>) : null
              }

              <div className="d-flex flex-wrap justify-content-start mt-4">
                {Array.from({ length: questionCount }, (_, i) => {
                  const questionId = data.questions[i].id;
                  const isSkipped = answers[questionId]?.skipped;
                  const isHold = answers[questionId]?.hold;
                  const isAttended = answers[questionId] && !isSkipped;

                  return (
                    <button
                      key={i}
                      className={`dash-font btn btn-sm m-1 question-button ${currentQuestionIndex === i
                        ? "activequestion"
                        : isSkipped
                          ? "skip-question"
                          : isHold
                            ? "hold-question"
                            : isAttended
                              ? "attended-question"
                              : ""
                        }`}
                      onClick={() => {
                        setCurrentQuestionIndex(i);
                        const selectedQuestion = data.questions[i];
                        if (selectedQuestion.time_limit) {
                          setTimeLeft(
                            selectedQuestion.time_limit -
                            (timeSpentPerQuestion[selectedQuestion.id] || 0)
                          );
                        } else {
                          setTimeLeft(null);
                        }
                      }}
                    >
                      {isHold && <FaBookmark size={10} color="#FFDB43" className="bookmark-icon" />}
                      {/* <FaBookmark size={10} color="#FFDB43" className="bookmark-icon" /> */}
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* <div className="text-center d-flex flex-column align-items-center justify-content-center">
              <div className="dash-font fw-12 fw-semibold mb-3">
                <span className="" style={{ color: "#5D5D5D" }}>Click on the question number
                  sabove to view that question.</span>
              </div>
              <button
                className="dash-font fw-semibold fw-14 btn text-black"
                style={{ borderColor: "#4f46e5", background: "#FFFFFFCC" }}
              >
                <HiOutlineLightBulb size={20} className="fw-bold me-2" />
                <span className="mt-2">Request Hint (1)</span>
              </button>
            </div> */}
          </div>
        </div>

      </div>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={`${ImageURL.replace(/\/$/, "")}/${selectedImage.replace(
              /^\//,
              ""
            )}`}
            alt="Full Size"
            style={{ width: "100%" }}
          />
        </Modal.Body>
      </Modal>

      {/* Resume Model */}
      <Modal
        show={showResume}
        onHide={handlePauseClose}
        centered
        size="md"
        backdrop="static" // Prevent closing on outside click
        className="blurred-modal"
      >
        <Modal.Header>
          <Modal.Title>Resume Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="dash-font fw-bold">
            The question was paused. Do you want to resume the worksheet?
          </p>
          <div className="d-flex justify-content-end align-items-end">
            <button
              type="button"
              className="dash-font btn btn-sm add-btn me-3"
              onClick={handlePauseClose}
            >
              <IoPlay size={15} />&nbsp;
              Resume
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DoAssessment;