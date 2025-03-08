import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../../config/URL";
import PropTypes from "prop-types";
import ImageURL from "../../../config/ImageURL";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { GoTrash } from "react-icons/go";
import { TbEdit } from "react-icons/tb";
import DeleteChange from "../../../components/common/DeleteChange";

function RewardView() {
  const [data, setData] = useState({});
  const [centerList, setCenterList] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const storedScreens = JSON.parse(
    localStorage.getItem("schoolCMS_Permissions") || "{}"
  );

  // console.log("Image URL:", `${ImageURL}/${data.image}`);

  const getRewardData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`reward/${id}`);
      setData(response.data.data);
    } catch (e) {
      toast.error("Error Fetching Data ", e?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  // Function to Toggle Status
  const handleStatusToggle = async () => {
    try {
      const response = await api.post(`reward/status/${id}`);
      if (response.status === 200) {
        toast.success(response.data.message);
        setData((prevData) => ({
          ...prevData,
          active: prevData.active === 1 ? 0 : 1,
        }));
      }
    } catch (error) {
      toast.error("Error updating status!");
      console.error("Status Update Error:", error);
    }
  };

  const getCenterList = async () => {
    try {
      const response = await api.get("centers/list");
      const centerNames = response.data.data.map((center) => ({
        name: center.name,
      }));
      setCenterList(centerNames);
    } catch (e) {
      toast.error(
        `Error Fetching Centers: ${e?.response?.data?.error || e.message}`
      );
    }
  };

  useEffect(() => {
    getRewardData();
    getCenterList();
  }, [id]);
  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };
  return (
    <div className="container-fluid px-0">
      <div className="d-flex px-4 justify-content-between align-items-center  p-1 mb-4">
        <div className="d-flex align-items-center">
          <div>
            <Link to="/rewards">
              <button type="button " className="btn btn-sm add-btn">
                <MdKeyboardArrowLeft size={20} />
              </button>
            </Link>
            &nbsp;&nbsp;
          </div>
          <span className="mx-3 table-heading">
            Rewards Details -&nbsp;
            <span className="table-subheading">
              Details of Selected Rewards
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
              <GoTrash className="trash-icon" /> &nbsp;&nbsp; Delete Rewards
            </button>
          )}
        </div>
      </div>
      <div className="mx-4 card vh-100" style={{ border: "1px solid #dbd9d0" }}>
        <div
          className="card-header d-flex justify-content-between"
          style={{ marginBottom: "1px solid #F4F4F4" }}
        >
          <p className="view-header">Rewards Info</p>
          <div className="d-flex justify-content-end">
            <button
              className={`btn btn-sm ${
                data.active === 1 ? "btn-danger" : "btn-success"
              }`}
              onClick={handleStatusToggle}
            >
              {data.active === 1 ? "Deactivate" : "Activate"}
            </button>

            {storedScreens?.data[1]?.can_edit === 1 && (
              <button
                className="btn edit-btn ms-2"
                onClick={() => {
                  navigate(`/Rewards/edit/${id}`);
                }}
              >
                <TbEdit style={{ color: "#C0C0C0", fontSize: "16px" }} />
              </button>
            )}
          </div>
        </div>
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="container-fluid px-4">
            <div className="row pb-3">
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Center Name</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      : {centerList.map((center) => center.name).join(", ")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Name</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data.name}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Target Achieved</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      : {data.target_archieved}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Reward Type</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data.reward_type}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Reward Value</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data.reward_value}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium text-sm">Description</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm text-break">
                      : {data.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12 my-2">
                <div className="row">
                  <div className="col-3">
                    <p className="fw-medium text-sm">Image</p>
                  </div>
                  <div className="col-3 text-muted text-sm text-break">
                    :
                    <img
                      src={`${ImageURL.replace(
                        /\/$/,
                        ""
                      )}/${data?.image?.replace(/^\//, "")}`}
                      alt="Reward"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: "5px",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {deleteModalOpen && selectedId && (
          <DeleteChange
            path={`reward/delete/${id}`}
            onDeleteSuccess={() => {
              setDeleteModalOpen(false);
              navigate("/rewards");
            }}
            onClose={() => setDeleteModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

RewardView.propTypes = {
  id: PropTypes.number.isRequired,
};
export default RewardView;
