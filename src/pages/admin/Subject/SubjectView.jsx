import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import api from "../../../config/URL";
import { useEffect, useState } from "react";
import SubjectEdit from "./SubjectEdit";

function SubjectView({ show, setShow, id }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
const[editModal,setEditModal] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleEdit = () => {
    setEditModal(true); // Open edit modal when "Edit" button is clicked
  };
  const getSubjectData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`subject/${id}`);
      setData(response.data.data);
    } catch (e) {
      toast.error("Error Fetching Data ", e?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };
  const truncateText = (text, length = 30) =>
    text?.length > length ? text.substring(0, length) + "..." : text;

  useEffect(() => {
    if (show) {
      getSubjectData();
    }
  }, [id, show]);

  return (
    <>
    <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>View Subject</DialogTitle>
      <hr className="m-0"></hr>
      <DialogContent>
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-6 col-12">
              <div className="row mt-3  mb-2">
                <div className="col-6 ">
                  <p className="">Centre Name</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    :{" "}
                    {data.center_names
                      ? JSON.parse(data.center_names).join(", ")
                      : ""}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mt-3  mb-2">
                <div className="col-6 ">
                  <p className="">Grade</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    : {truncateText(data.grand_name)}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mt-3  mb-2">
                <div className="col-6 ">
                  <p className="">Name</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    : {truncateText(data.name)}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mt-3  mb-2">
                <div className="col-6 ">
                  <p>
                    Description
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm text-truncate">
                    :{truncateText(data.description)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
      <hr className="m-0"></hr>
      <DialogActions className="mt-3">
        <button className="btn btn-sm btn-back" onClick={handleClose}>
          Back
        </button>
        <button className="btn btn-sm btn-primary" onClick={handleEdit}>
            Edit
          </button>
      </DialogActions>
    </Dialog>
    {editModal && (
        <SubjectEdit
          id={id}
          show={editModal}
          setShow={setEditModal}
          onSuccess={getSubjectData} // Refresh data after successful edit
        />
      )}
    </>
  );
}

SubjectView.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
};

export default SubjectView;
