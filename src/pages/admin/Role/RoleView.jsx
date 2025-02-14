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

function RoleView({ show, setShow, id }) {
  const [data, setData] = useState({});
  // console.log(data)
  const handleClose = () => {
    setShow(false);
  };
  const getRoleData = async () => {
    try {
      const response = await api.get(`admin/role/${id}`);
      setData(response.data.data);
    } catch (e) {
      toast.error("Error Fetching Data ", e?.response?.data?.error);
    }
  };

  useEffect(() => {
    if (show) {
      getRoleData();
    }
  }, [id, show]);

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>View Role</DialogTitle>
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
          <div className="col-md-6 col-12 my-2">
            <div className="row">
              <div className="col-6">
                <p className="fw-medium text-sm">Access</p>
              </div>
              <div className="col-6">
                <p className="text-muted text-sm">: {data.access}</p>
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
  );
}

RoleView.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
};

export default RoleView;
