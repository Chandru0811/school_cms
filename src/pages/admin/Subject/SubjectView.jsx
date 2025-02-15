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

function SubjectView({ show, setShow ,id}) {
  const [data, setData] = useState({});

  const handleClose = () => {
    setShow(false);
  };
  const getSubjectData = async () => {
    try {
      const response = await api.get(`subject/${id}`);
      setData(response.data.data);
    } catch (e) {
      toast.error("Error Fetching Data ", e?.response?.data?.error);
    }
  };

  useEffect(() => {
    if (show) {
      getSubjectData();
    }
  }, [id, show]);

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>View Subject</DialogTitle>
      <hr className="m-0"></hr>
      <DialogContent>
        <div className="row">
          <div className="col-md-6 col-12">
            <div className="row mt-3  mb-2">
              <div className="col-6 ">
                <p className="">Centre Name</p>
              </div>
              <div className="col-6">
                <p className="text-muted text-sm">: {data.center_names}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-12">
            <div className="row mt-3  mb-2">
              <div className="col-6 ">
                <p className="">Grade</p>
              </div>
              <div className="col-6">
                <p className="text-muted text-sm">: {data.grade_id}</p>
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
  );
}

SubjectView.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
};

export default SubjectView;
