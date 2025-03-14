import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { TbEdit } from "react-icons/tb";
import { GoTrash } from "react-icons/go";
import { MdKeyboardArrowLeft } from "react-icons/md";
import DeleteChange from "../../../components/common/DeleteChange";
// import PropTypes from "prop-types";

function QustionView() {
  const [data, setData] = useState({});
  const { id } = useParams();
  const [centerList, setCenterList] = useState([]);
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

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };

  return (
    <div className="container-fluid px-0">
      <div className="d-flex px-4 justify-content-between align-items-center  p-1 mb-4">
        <div className="d-flex align-items-center">
          <div>
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
        <div className="my-2 d-flex align-items-center">
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
      <div className="mx-4 card vh-100" style={{ border: "1px solid #dbd9d0" }}>
        <div
          className="card-header d-flex justify-content-between"
          style={{ marginBottom: "1px solid #F4F4F4" }}
        >
          <p className="view-header">Question Info</p>
          <div className="d-flex justify-content-end">
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
                    <p className="view-label-text">Centre</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value">
                      {" "}
                      {centerFind(data.question?.center_id) || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Grade</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value"> {data.question?.grand_name}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Subject</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value"> {data.question?.subject_name}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Topic</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value"> {data.question?.topic_name}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Question Type</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value">
                      {data.question?.ques_type
                        ? JSON.parse(data.question?.ques_type).join(", ")
                        : ""}
                    </p>{" "}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Question</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value"> {data.question?.question}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Options</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value">
                      {data.question?.options
                        ? Object.values(JSON.parse(data.question.options)).join(
                            ", "
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Difficulty Level</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value">
                      {" "}
                      {data.question?.difficult_level}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Hint</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value"> {data.question?.hint}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="view-label-text">Answer Type</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value">
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
                    <p className="view-label-text">Answer</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value">
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
