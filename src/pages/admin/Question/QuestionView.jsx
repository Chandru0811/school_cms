import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { TbEdit } from "react-icons/tb";
import { GoTrash } from "react-icons/go";
import { MdChevronRight, MdKeyboardArrowLeft } from "react-icons/md";
import DeleteChange from "../../../components/common/DeleteChange";
// import PropTypes from "prop-types";

function QustionView() {
  const [data, setData] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const storedScreens = JSON.parse(
    localStorage.getItem("schoolCMS_Permissions") || "{}"
  );

  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`question/${id}`);
      setData(response.data.data);
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

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };

  return (
    <div className="container-fluid px-0">
      <div className="d-flex px-md-4 justify-content-between align-items-center  p-1 mb-4">
        <div className="d-flex align-items-center">
          <div className="d-flex justify-content-center">
            <Link to="/question">
              <button type="button " className="btn btn-sm add-btn">
                <MdKeyboardArrowLeft size={20} />
              </button>
            </Link>
            &nbsp;&nbsp;
          </div>
          <span className="mx-3 table-heading">
            Question Details -&nbsp;
            <span className="table-subheading">
              Details of Selected Question
            </span>
          </span>
        </div>
        <div className="my-2 d-flex gap-2 align-items-center">
          {storedScreens?.data[6]?.can_edit === 1 && (
            <button
              className="btn edit-btn ms-2"
              onClick={() => {
                navigate(`/question/edit/${id}`);
              }}
            >
              <TbEdit style={{ color: "#C0C0C0", fontSize: "16px" }} />
            </button>
          )}
          {storedScreens?.data[1]?.can_delete === 1 && (
            <button
              className="btn view-delete-btn"
              onClick={() => {
                handleDeleteClick(id);
              }}
            >
              <GoTrash className="trash-icon" /> &nbsp;&nbsp; Delete Question
            </button>
          )}
        </div>
      </div>
      <div
        className="mx-md-4 card h-100 pb-5"
        style={{ border: "1px solid #dbd9d0" }}
      >
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
            <div className="row m-0 mt-5">
              <div className="col-12">
                <small className="text-color fw-semibold">{`Question ID/Number ${1} `}</small>
                <p className="fs-5 mb-5 fw-semibold">
                  {data.question.question}
                </p>
                {JSON.parse(data.question.options).map((option, idx) => {
                  const correctAnswer = JSON.parse(
                    data.answer.answer
                  ).multichoice;

                  return (
                    <label
                      key={idx}
                      className={`d-block mt-0 rounded quest-radio-label ${
                        option === correctAnswer ? "checked" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        disabled
                        name={`question-${data.question.id}`}
                        value={option}
                        className="form-check-input quest-radio-input"
                        checked={option === correctAnswer}
                        readOnly
                      />
                      {option}
                    </label>
                  );
                })}
              </div>
              <div className="col-12 mt-md-5 pt-5 px-5">
                <div className="">
                  <div className="ques-desc-card mb-5">
                    <p className="">
                      <span>Explanation:</span>
                      {data.question.description}
                    </p>
                  </div>
                  <div className="ques-desc-card">
                    <p className="">
                      <span>Hint:</span>
                      {data.question.hint}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12 mt-5 pt-5 px-0 px-md-2">
                <div
                  className="row pt-4"
                  style={{ borderTop: "1px solid #F4F4F4" }}
                >
                  <div className="col-xl-4 col-md-6 col-12">
                    <div className="row py-3">
                      <div className="col-xl-5 col-4">Subject</div>
                      <div className="col-xl-7 col-8 fw-semibold">
                        : &nbsp; {data.question?.subject_name || ""}{" "}
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-md-6 col-12">
                    <div className="row py-3">
                      <div className="col-xl-5 col-4">Topic</div>
                      <div className="col-xl-7 col-8 fw-semibold">
                        : &nbsp; {data.question?.topic_name || ""}{" "}
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-md-6 col-12">
                    <div className="row py-3">
                      <div className="col-xl-5 col-4">Type</div>
                      <div className="col-xl-7 col-8 fw-semibold">
                        : &nbsp; {JSON.parse(data?.question?.ques_type) || ""}{" "}
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-md-6 col-12">
                    <div className="row py-3">
                      <div className="col-xl-5 col-4">Difficulty</div>
                      <div className="col-xl-7 col-8 fw-semibold">
                        : &nbsp; {data.question.difficult_level || ""}{" "}
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-md-6 col-12">
                    <div className="row py-3">
                      <div className="col-xl-5 col-4">Created by</div>
                      <div className="col-xl-7 col-8 fw-semibold">
                        : &nbsp; {data.question?.created_by?.name || ""}{" "}
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-md-6 col-12">
                    <div className="row py-3">
                      <div className="col-xl-5 col-4">Created On</div>
                      <div className="col-xl-7 col-8 fw-semibold">
                        : &nbsp;{" "}
                        {data.question?.created_at
                          ?.split("T")[0]
                          ?.split("-")
                          ?.reverse()
                          .join("-") || ""}{" "}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-5 pt-5">
              <div className="col-12 d-flex justify-content-between align-items-center">
                <div>
                  <button
                    type="button"
                    className="success-btn"
                    onClick={() => {
                      navigate(`/question/view/${data.previous_id}`);
                    }}
                    disabled={data.previous_id === null}
                  >
                    <MdKeyboardArrowLeft />
                    Previous Question
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    className="success-btn"
                    onClick={() => {
                      navigate(`/question/view/${data.next_id}`);
                    }}
                    disabled={data.next_id === null}
                  >
                    Next Question <MdChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {deleteModalOpen && selectedId && (
        <DeleteChange
          path={`question/delete/${id}`}
          onDeleteSuccess={() => {
            setDeleteModalOpen(false);
            navigate("/question");
          }}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}
export default QustionView;
