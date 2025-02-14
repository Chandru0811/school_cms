import { useState, useEffect } from "react";

const questions = [
  { id: 1, question: "What is the capital of India?" },
  { id: 2, question: "Solve: 8 × 7 = ?" },
  { id: 3, question: "Who wrote 'Thirukural'?" },
  { id: 4, question: "What is H₂O commonly known as?" },
  { id: 5, question: "Name the largest planet in our solar system." },
];

const DoAssessment = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionStatus, setQuestionStatus] = useState(
    new Array(questions.length).fill(false)
  );

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setTimeSpent((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setQuestionStatus((prevStatus) => {
        const updatedStatus = [...prevStatus];
        updatedStatus[currentQuestionIndex] = true;
        return updatedStatus;
      });

      if (currentQuestionIndex < questions.length - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex((prev) => prev + 1);
          setTimeLeft(30);
          setTimeSpent(0);
        }, 1000);
      }
    }
  }, [timeLeft, currentQuestionIndex]);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeSpent(0);
      setTimeLeft(30);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setTimeSpent(0);
      setTimeLeft(30);
    }
  };

  return (
    <section>
      <div className="container-fluid">
        <div className="row" style={{ background: "white" }}>
          <div className="col-md-2 col-12"></div>
          <div
            className="col-md-8 col-12 d-flex align-items-center justify-content-center flex-column"
            style={{ minHeight: "80vh" }}
          >
            <h4 className="text-center my-5">Worksheet</h4>
            <div className="card custom-card p-3 m-5" style={{ width: "100%" }}>
              <p className="mb-3">
                <strong>Question {currentQuestionIndex + 1}</strong>:
              </p>
              <p className="mb-3">{questions[currentQuestionIndex].question}</p>
              <textarea
                className="form-control mb-3"
                placeholder={
                  questionStatus[currentQuestionIndex]
                    ? "Time out! You cannot answer this question."
                    : "Write your answer here..."
                }
                rows={4}
                disabled={questionStatus[currentQuestionIndex]} // Check if the question is disabled
              />
              <div className="d-flex justify-content-between mb-4">
                {questionStatus[currentQuestionIndex] ? (
                  <p></p>
                ) : (
                  <>
                    <p>
                      Time spent: <span className="text-muted">{timeSpent} sec</span>
                    </p>
                  </>
                )}
                <p className="text-danger">
                  {questionStatus[currentQuestionIndex]
                    ? "Time Out!"
                    : `Time left: ${timeLeft} sec`}
                </p>
              </div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <button
                  type="button"
                  className="btn btn-previous"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </button>
                &nbsp;&nbsp;
                <button
                  type="button"
                  className="btn btn-next"
                  onClick={handleNext}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-2 col-12"></div>
        </div>
      </div>
    </section >
  );
};

export default DoAssessment;
