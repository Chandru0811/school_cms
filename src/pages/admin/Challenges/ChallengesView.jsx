import { Link, useNavigate, useParams } from "react-router-dom";
// import ChallengesAssign from "./ChallengesAssign";
import { useEffect, useState } from "react";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { TbEdit } from "react-icons/tb";
import { GoTrash } from "react-icons/go";
import { MdKeyboardArrowLeft } from "react-icons/md";
import DeleteChange from "../../../components/common/DeleteChange";

function ChallengesView() {
  const [data, setData] = useState({});
  const { id } = useParams();
  const [centerList, setCenterList] = useState([]);
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

  const getCenterList = async () => {
    try {
      const response = await api.get("centers/list");
      setCenterList(response.data.data);
    } catch (e) {
      toast.error(
        `Error Fetching Centers: ${e?.response?.data?.error || e.message}`
      );
    }
  };
  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };

  useEffect(() => {
    getData();
    getCenterList();
  }, [id]);

  const centerFind = (name) => {
    const FName = [];
    try {
      const centerIds = JSON.parse(name);
      centerIds.forEach((id) => {
        const center = centerList.find((center) => center.id === id);
        if (center) {
          FName.push(center.name);
        }
      });
    } catch (error) {
      console.error("Invalid JSON format:", error);
    }
    return FName.join(", ");
  };

  return (
    <div className="container-fluid px-0">
      <div className="d-flex px-4 justify-content-between align-items-center  p-1 mb-4">
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
        <div className="my-2 d-flex align-items-center">
          <button
            className="btn view-delete-btn"
            onClick={() => {
              handleDeleteClick(id);
            }}
          >
            <GoTrash className="trash-icon" /> &nbsp;&nbsp; Delete Challenges
          </button>
        </div>
      </div>
      <div className="mx-4 card vh-100" style={{ border: "1px solid #dbd9d0" }}>
        <div
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
            <div className="row pb-3">
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Centre</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      : {centerFind(data.challenge?.center_id) || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Grade</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      : {data.challenge?.grand_name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Subject</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      : {data.challenge?.subject_name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Topic</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      : {data.challenge?.topic_name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Time Limit</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      : {data.challenge?.time_limit}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">challenge Type</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      {" "}
                      :{" "}
                      {data.challenge?.ques_type
                        ? JSON.parse(data.challenge?.ques_type).join(", ")
                        : ""}
                    </p>{" "}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Challenges Title</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      : {data.challenge?.title}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Options</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      : {data.challenge?.options}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Description</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      : {data.challenge?.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Difficulty Level</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      : {data.challenge?.difficult_level}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Hint</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      : {data.challenge?.hint}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Answer Type</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      {" "}
                      :{" "}
                      {data.answer?.answer_type
                        ? JSON.parse(data.answer?.answer_type).join(", ")
                        : ""}
                    </p>{" "}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Answer</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      :{" "}
                      {data.answer?.answer &&
                        Object.entries(JSON.parse(data.answer.answer))
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", ")}
                    </p>
                  </div>
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
