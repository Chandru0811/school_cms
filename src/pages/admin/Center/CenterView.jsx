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
import { Button } from "react-bootstrap";

function CenterView({ id, handleMenuClose }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});

  const getData = async () => {
    try {
      const response = await api.get(`center/${id}`);
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

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>View Centre</DialogTitle>
        <DialogContent>
          <div className="container">
            <div className="row">
              <div className="col-md-6 col-12">
                <div className="row mb-3">
                  <div className="col-6 d-flex justify-content-start">
                    <p className="text-sm">Name</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data.name}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-3">
                  <div className="col-6 d-flex justify-content-start">
                    <p className="text-sm">Location</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            className="btn btn-sm btn-border bg-light text-dark"
            onClick={handleClose}
          >
            Back
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

CenterView.propTypes = {
  handleMenuClose: PropTypes.func,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default CenterView;
