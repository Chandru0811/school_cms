import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../config/URL";

function CenterView({ id, handleMenuClose, show, setShow }) {
  const [data, setData] = useState({});

  const getData = async () => {
    if (!id) return;
    try {
      const response = await api.get(`center/${id}`);
      setData(response.data.data);
    } catch (error) {
      toast.error("Error Fetching Data");
      console.error("Error fetching data:", error);
    }
  };

  const handleClose = () => {
    setShow(false);
    if (handleMenuClose) handleMenuClose();
  };

  useEffect(() => {
    if (show) getData();
  }, [id, show]);

  const truncateText = (text, length = 30) =>
    text?.length > length ? text.substring(0, length) + "..." : text;

  return (
    <Dialog open={show} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>View Centre</DialogTitle>
      <hr className="m-0"></hr>
      <DialogContent>
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start">
                  <p className="text-sm">Name</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {truncateText(data.name)}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start">
                  <p className="text-sm">Location</p>
                </div>
                <div className="col-6">
                  <p
                    className="text-muted text-sm text-truncate"
                    // style={{ maxWidth: "500px" }}
                  >
                    : {data.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <hr className="m-0" />
      <DialogActions className="mt-3">
        <button className="btn btn-sm btn-back" onClick={handleClose}>
          Back
        </button>
      </DialogActions>
    </Dialog>
  );
}

CenterView.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  handleMenuClose: PropTypes.func,
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
};

export default CenterView;
