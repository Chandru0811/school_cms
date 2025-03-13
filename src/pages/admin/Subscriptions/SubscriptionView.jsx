import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { GoTrash } from "react-icons/go";
import { TbEdit } from "react-icons/tb";
import DeleteChange from "../../../components/common/DeleteChange";

function SubscriptionView() {
  const [data, setData] = useState({});
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();
  const storedScreens = JSON.parse(
    localStorage.getItem("schoolCMS_Permissions") || "{}"
  );
  const getSubscriptionData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`subscription/${id}`);
      setData(response.data.data);
    } catch (e) {
      const errorMessage =
        e?.response?.data?.error || "Error Fetching Data. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to Toggle Status
  const handleStatusToggle = async () => {
    try {
      const response = await api.post(`subscription/status/${id}`);
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
  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };
  useEffect(() => {
    getSubscriptionData();
  }, [id]);

  return (
    <div className="container-fluid px-0">
      <div className="d-flex px-4 justify-content-between align-items-center  p-1 mb-4">
        <div className="d-flex align-items-center">
          <div>
            <Link to="/subscription">
              <button type="button " className="btn btn-sm add-btn">
                <MdKeyboardArrowLeft size={20} />
              </button>
            </Link>
            &nbsp;&nbsp;
          </div>
          <span className="mx-3 table-heading">
            Subscription -&nbsp;
            <span className="table-subheading">
              Details of Selected Subscription
            </span>
          </span>
        </div>
        <div className="my-2 d-flex align-items-center">
          {storedScreens?.data[13]?.can_delete === 1 && (
            <button
              className="btn view-delete-btn"
              onClick={() => {
                handleDeleteClick(id);
              }}
            >
              <GoTrash className="trash-icon" /> &nbsp;&nbsp; Delete
              Subscription
            </button>
          )}
        </div>
      </div>
      <div className="mx-4 card vh-100" style={{ border: "1px solid #dbd9d0" }}>
        <div
          className="card-header d-flex justify-content-between"
          style={{ marginBottom: "1px solid #F4F4F4" }}
        >
          <p className="view-header">Subscription Info</p>

          <div className="d-flex gap-3">
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
                  navigate(`/subscription/edit/${id}`);
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
          <>
            <div className="container-fluid px-4">
              <div className="row pb-3">
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="view-label-text">Grade</p>
                    </div>
                    <div className="col-6">
                      <p className="view-value"> {data.grand_name}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="view-label-text">Worksheets</p>
                    </div>
                    <div className="col-6">
                      <p className="view-value">
                        {data.worksheets_names
                          ? JSON.parse(data.worksheets_names).join(", ")
                          : ""}
                      </p>{" "}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="view-label-text">Name</p>
                    </div>
                    <div className="col-6">
                      <p className="view-value"> {data.name}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="view-label-text">Price</p>
                    </div>
                    <div className="col-6">
                      <p className="view-value">{data.price}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="view-label-text">Duration</p>
                    </div>
                    <div className="col-6">
                      <p className="view-value">{data.duration}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="view-label-text">Description</p>
                    </div>
                    <div className="col-6">
                      <p className="view-value">{data.description}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6col-12 my-2">
                <div className="row">
                  <div className="col-3">
                    <p className="view-label-text">Detail</p>
                  </div>
                  <div className="col-9">
                    <p
                      className="view-value"
                      dangerouslySetInnerHTML={{ __html: data.details }}
                    ></p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {deleteModalOpen && selectedId && (
          <DeleteChange
            path={`subscription/delete/${id}`}
            onDeleteSuccess={() => {
              setDeleteModalOpen(false);
              navigate("/subscription");
            }}
            onClose={() => setDeleteModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

SubscriptionView.propTypes = {
  id: PropTypes.number.isRequired,
};

export default SubscriptionView;
