import { Link, useNavigate, useParams } from "react-router-dom";
// import ChallengesAssign from "./ChallengesAssign";
import { useEffect, useState } from "react";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { TbEdit } from "react-icons/tb";
import { GoTrash } from "react-icons/go";
import { MdChevronRight, MdKeyboardArrowLeft } from "react-icons/md";
import DeleteChange from "../../../components/common/DeleteChange";

function ChallengesView() {
  const [data, setData] = useState({});
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`challenge/${id}`);
      setData(response.data.data);
    } catch (e) {
      const errorMessage =
        e?.response?.data?.error || "Error Fetching Data. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };

  useEffect(() => {
    getData();
  }, [id]);

  return (
    <div className="container-fluid px-0">
      <div className="d-flex px-md-4 flex-wrap justify-content-between align-items-start align-items-md-center  p-1 mb-4">
        <div className="d-flex align-items-center">
          <div>
            <Link to="/challenges">
              <button type="button " className="btn btn-sm add-btn">
                <MdKeyboardArrowLeft size={20} />
              </button>
            </Link>
            &nbsp;&nbsp;
          </div>
          <span className="mx-3 table-heading">
            Challenges Details -&nbsp;
            <span className="table-subheading">
              Details of Selected Challenges
            </span>
          </span>
        </div>
        <div className="my-md-2 d-flex align-items-center">
          <button
            className="btn view-delete-btn"
            onClick={() => {
              handleDeleteClick(id);
            }}
          >
            <GoTrash className="trash-icon" /> &nbsp; Delete Challenges
          </button>
        </div>
      </div>
      <div
        className="mx-md-4 card h-100 pb-5"
        style={{ border: "1px solid #dbd9d0" }}
      >
        {/* <div
          className="card-header d-flex justify-content-between"
          style={{ marginBottom: "1px solid #F4F4F4" }}
        >
          <p className="view-header">Challenges Info</p>
          <div className="d-flex justify-content-end">
            <button
              className="btn edit-btn ms-2"
              onClick={() => {
                navigate(`/challenges/edit/${id}`);
              }}
            >
              <TbEdit style={{ color: "#C0C0C0", fontSize: "16px" }} />
            </button>
          </div>
        </div> */}
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
              <div className="col-12 px-0 px-md-2">
                <small className="text-color fw-semibold">{`Chellange ID/Number ${1} `}</small>
                <p className="fs-5 mb-5 fw-semibold">
                  {data.challenge.question}
                </p>
                {JSON.parse(data.challenge.options).map((option, idx) => {
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
                        name={`question-${data.challenge.id}`}
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
              <div className="col-12 mt-md-5 pt-5 px-md-5 px-0">
                <div className="">
                  <div className="ques-desc-card mb-5">
                    <p className="">
                      <span>Explanation:</span>
                      {data.challenge.description}
                    </p>
                  </div>
                  <div className="ques-desc-card">
                    <p className="">
                      <span>Hint:</span>
                      {data.challenge.hint}
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
                        : &nbsp; {data.challenge?.subject_name || ""}{" "}
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-md-6 col-12">
                    <div className="row py-3">
                      <div className="col-xl-5 col-4">Topic</div>
                      <div className="col-xl-7 col-8 fw-semibold">
                        : &nbsp; {data.challenge?.topic_name || ""}{" "}
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-md-6 col-12">
                    <div className="row py-3">
                      <div className="col-xl-5 col-4">Type</div>
                      <div className="col-xl-7 col-8 fw-semibold">
                        : &nbsp; {JSON.parse(data?.challenge?.ques_type) || ""}{" "}
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-md-6 col-12">
                    <div className="row py-3">
                      <div className="col-xl-5 col-4">Difficulty</div>
                      <div className="col-xl-7 col-8 fw-semibold">
                        : &nbsp; {data.challenge.difficult_level || ""}{" "}
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-md-6 col-12">
                    <div className="row py-3">
                      <div className="col-xl-5 col-4">Created by</div>
                      <div className="col-xl-7 col-8 fw-semibold">
                        : &nbsp; {data.challenge?.created_by?.name || ""}{" "}
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-md-6 col-12">
                    <div className="row py-3">
                      <div className="col-xl-5 col-4">Created On</div>
                      <div className="col-xl-7 col-8 fw-semibold">
                        : &nbsp;{" "}
                        {data.challenge?.created_at
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
                      className={`success-btn ${data.previous_id === null ? "inActive" : ""}`}
                      onClick={() => {
                        navigate(`/challenges/view/${data.previous_id}`);
                      }}
                      disabled={data.previous_id === null}
                    >
                      <MdKeyboardArrowLeft />
                      Previous challenges
                    </button>
                </div>
                <div>
                  <button
                    type="button"
                    className="success-btn"
                    onClick={() => {
                      navigate(`/challenges/view/${data.next_id}`);
                    }}
                    disabled={data.next_id === null}
                  >
                    Next challenges <MdChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {deleteModalOpen && selectedId && (
        <DeleteChange
          path={`challenge/delete/${id}`}
          onDeleteSuccess={() => {
            setDeleteModalOpen(false);
            navigate("/challenges");
          }}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}

export default ChallengesView;
