import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../../config/URL";

function TopicView({ show, setShow ,id }) {
  const [data, setData] = useState({});

  const handleClose = () => {
    setShow(false);
  };
  const getTopicData = async () => {
    try {
      const response = await api.get(`admin/topic/${id}`);
      setData(response.data.data);
    } catch (e) {
      toast.error("Error Fetching Data ", e?.response?.data?.error);
    }
  };

  useEffect(() => {
    if (show) {
      getTopicData();
    }
  }, [id, show]);


  return (
    <>
      <span
        onClick={handleOpen}
        style={{
          whiteSpace: "nowrap",
          cursor: "pointer",
        }}
      >
        View
      </span>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>View Topic</DialogTitle>
        <hr className="m-0"></hr>
        <DialogContent>
          <div className="row">
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Centre</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.center_names}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Subject</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.subject_names}</p>
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
                  <p className="fw-medium text-sm">Description</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.description}</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <hr className="m-0"></hr>
        <DialogActions className="mt-3">
          <button className="btn btn-sm btn-back" onClick={handleClose}>
            Back
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}

TopicView.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
};

export default TopicView;
