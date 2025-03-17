import { Link, useNavigate, useParams } from "react-router-dom";
import {
  MdChevronRight,
  MdKeyboardArrowLeft,
  MdOutlineCloudDownload,
} from "react-icons/md";
import { useEffect, useState } from "react";
import icon2 from "../../../assets/images/Icon (2).svg";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import retry from "../../../assets/images/retry-icon.svg";

const AttemptView = () => {
  const [data, setData] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`attempt/view/${id}`);
      if (response.status === 200) {
        setData(response.data.data);
      }
    } catch (e) {
      const errorMessage =
        e?.response?.data?.error || "Error Fetching Data. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, [id]);
  return (
    <div className="container-lg container-fluid px-1 px-md-5 px-xl-1">
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
        <>
          <div className="d-flex px-4 justify-content-between align-items-center  p-1 mb-4">
            <div className="d-flex align-items-center">
              <div>
                <Link to="/worksheet">
                  <button type="button " className="btn btn-sm add-btn">
                    <MdKeyboardArrowLeft size={20} />
                  </button>
                </Link>
                &nbsp;&nbsp;
              </div>
              <span className="mx-3 table-heading">
                Worksheet Name -&nbsp;
                <span className="table-subheading">Attempt Result</span>
              </span>
            </div>
          </div>
          <div className="row m-0 ">
            <div className="col-md-8 col-xl-9 col-12 pe-md-2 ps-md-1 px-0 mt-3 mt-md-0  order-1 order-md-0">
              <div className="row m-0 card px-5 py-3 ">
               <div className=" ans-card view-scroll"> {data.map((question, index) => (
                  <div
                    id={question.id}
                    className="col-12 p-3 bottom-border "
                    key={index}
                  >
                    <small className="text-color fw-semibold">{`Question ${
                      index + 1
                    } of ${data?.length}`}</small>
                    <p className="fs-5  fw-semibold">{question.question}</p>
                    <div className="row g-4 mt-5">
                      {JSON.parse(question.options).map((option, idx) => {
                        const correctAnswer = JSON.parse(
                          question.answer
                        ).multichoice;
                        return (
                          <label
                            key={idx + 1}
                            className={`d-block mt-0 rounded ans-radio-label ${
                              option === correctAnswer ? "checked" : ""
                            } ${
                              question.answer_result === "correct"
                                ? "correct"
                                : question.answer_result === "skipped"
                                ? "skipped"
                                : question.answer_result === "wrong" &&
                                  option === question.student_answer
                                ? "wrong"
                                : ""
                            }`}
                          >
                            <input
                              type="radio" disabled
                              name={`question-${question.id}`}
                              value={option}
                              className={`form-check-input ans-radio-input ${
                                question.answer_result === "correct"
                                  ? " correct"
                                  : question.answer_result === "wrong"
                                  ? " wrong"
                                  : question.answer_result === "skipped"
                                  ? " skipped"
                                  : ""
                              }`}
                              checked={option === correctAnswer}
                              readOnly
                            />
                            {option}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              </div>
            </div>
            <div className="col-md-4 col-xl-3 col-12 ps-md-2 pe-md-1 px-0  order-0 order-md-1 ">
              <div className="row m-0 card px-2 py-3 h-100 ans-card-2 ">
                <div className="col-12 d-flex flex-column justify-content-between h-100 pb-3 align-items-center">
                  <div className="">
                    <div className="d-flex flex-wrap justify-content-start align-items-center gap-xl-5 gap-3 bottom-border">
                      <div className=" ">
                        <img
                          src={icon2}
                          alt=""
                          className="ms-xl-2 py-3"
                          style={{
                            minWidth: "50px",
                            minHeight: "auto",
                          }}
                        />
                      </div>
                      <div className="py-3">
                        <p className="dash-font text-muted fw-semibold mb-0">
                          TIME TAKEN
                        </p>
                        <p
                          className="dash-font heading-color fw-bold"
                          // style={{ fontSize: "14px" }}
                        >
                          15:00 Mins
                        </p>
                      </div>
                    </div>
                    <div className="d-flex mt-5 flex-wrap justify-content-start align-items-center gap-3">
                      {data?.map((question, index) => (
                        <>
                          <button
                            type="button"
                            className={`answer-view-btn ${
                              question.answer_result === "correct"
                                ? "correct"
                                : question.answer_result === "wrong"
                                ? "wrong"
                                : "skipped"
                            }`}
                          >
                            {index + 1}
                          </button>
                        </>
                      ))}
                    </div>
                  </div>
                  <div className="px-2">
                    <p
                      className="fw-semibold mb-0"
                      style={{ color: "#4F46E5", fontSize: "18px",lineHeight: "1.2", }}
                    >
                      Next Up:{" "}
                    </p>
                    <p
                      className="fw-semibold mb-2"
                      style={{ color: "#4F46E5", fontSize: "18px" }}
                    >
                      Beat your last score! 💪
                    </p>
                    <div>
                      <small
                        className=""
                        style={{
                          display: "block",
                          lineHeight: "1.5",
                        }}
                      >
                        Review & Retry: Focus on Functions of plant parts and
                        Planets:Jupiter.
                      </small>
                    </div>
                    <button type="button" className="rty-btn w-100 mt-4">
                      <img src={retry} alt=".." /> Retry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AttemptView;
