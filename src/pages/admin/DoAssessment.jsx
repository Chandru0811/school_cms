import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../config/URL";
import { useLocation } from "react-router-dom";


const DoAssessment = () => {
  const [data, setData] = useState({});
  const [answers, setAnswers] = useState({});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const assignedId = queryParams.get("assignedId");

  const getData = async () => {
    try {
      const response = await api.get(`worksheet/assessment/${assignedId}`);
      setData(response.data.data);
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
            <label>
              <input
                type="radio"
                className="form-check-input"
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
                className="form-check-input"
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
              <label key={index}>
                <input
                  type="checkbox"
                  value={option}
                  className="form-check-input mb-2"
                  checked={answers[id]?.multichoice?.includes(option) || false}
                  onChange={(e) => {
                    const selectedOptions = answers[id]?.multichoice || [];
                    const updatedOptions = e.target.checked
                      ? [...selectedOptions, option]
                      : selectedOptions.filter((opt) => opt !== option);
                    setAnswers({
                      ...answers,
                      [id]: { ...answers[id], multichoice: updatedOptions },
                    });
                  }}
                />
                {option}
              </label>
            ))}
          </div>
        );

      case "short_answer":
        return (
          <textarea
            placeholder="Your answer"
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

  useEffect(() => {
    getData();
  }, [assignedId]);

  if (!data?.questions || !data?.ques_id_with_type) return null;

  const quesIdWithType = JSON.parse(data.ques_id_with_type);

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
              {data.questions.map((question) => {
                const matchedQues = quesIdWithType.filter(
                  (q) => q.id === question.id
                );

                if (matchedQues.length === 0) return null;

                const questionTypes = JSON.parse(question.ques_type);
                const options = JSON.parse(question.options);

                return (
                  <div key={question.id} className="mb-4">
                    <p className="mb-3">
                      <strong>Question:</strong> {question.question}
                    </p>
                    {questionTypes.map((quesType) =>
                      renderInputField(quesType, question.id, options)
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-md-2 col-12"></div>
        </div>
      </div>
    </section>
  );
};

export default DoAssessment;


