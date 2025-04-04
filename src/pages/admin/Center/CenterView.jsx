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
import CenterEdit from "./CenterEdit";

function CenterView({ id, handleMenuClose, show, setShow }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await api.get(`center/${id}`);
      setData(response.data.data);
    } catch (error) {
      toast.error("Error Fetching Data");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
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
      {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
            >
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
          <>
            <div className="container">
              <div className="row">
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start">
                      <p className="text-sm">Name</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {truncateText(data.name)}
                      </p>
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
          </>
        )}
      </DialogContent>
      <hr className="m-0" />
      <DialogActions className="mt-3">
        <button className="btn btn-sm btn-back" onClick={handleClose}>
          Back
        </button>
        <button className="btn btn-sm btn-primary" type="button">
          <CenterEdit
            onSuccess={getData}
            id={id}
            handleMenuClose={handleClose}
          />
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
