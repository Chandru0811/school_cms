import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import api from "../../../config/URL";
import toast from "react-hot-toast";

function TopicView({ id, handleMenuClose }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});

  const getData = async () => {
    try {
      const response = await api.get(`topic/${id}`);
      setData(response.data.data);
    } catch (error) {
      toast.error("Error Fetching Data");
      console.error("Error fetching data:", error);
    }
  };

  const handleOpen = () => {
    getData();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (handleMenuClose) {
      handleMenuClose();
    }
  };

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
            <div className="col-md-6 col-12">
            <div className="row mt-3  mb-2">
                <div className="col-6 ">
                  <p className="">Centre Name</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.center_id}</p>
                </div>
              </div>
              <div className="row mt-3  mb-2">
                <div className="col-6 ">
                  <p className="">Subject</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.subject_name}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mt-3  mb-2">
                <div className="col-6 ">
                  <p className="">Name</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.name}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mt-3  mb-2">
                <div className="col-6 ">
                  <p className="">Description</p>
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
  handleMenuClose: PropTypes.func,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default TopicView;
