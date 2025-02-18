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

function TopicView({ show, setShow, id }) {
  const [data, setData] = useState({});
  const [centerList, setCenterList] = useState([]);

  const handleClose = () => {
    setShow(false);
  };

  const getTopicData = async () => {
    try {
      const response = await api.get(`topic/${id}`);
      setData(response.data.data);
    } catch (e) {
      toast.error(
        `Error Fetching Topic Data: ${e?.response?.data?.error || e.message}`
      );
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
    if (show) {
      getTopicData();
      getCenterList();
    }
  }, [id, show]);

  return (
    <>
      <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>View Topic</DialogTitle>
        <hr className="m-0" />
        <DialogContent>
          <div className="row">
            <div className="col-md-6 col-12">
              <div className="row mt-3 mb-2">
                <div className="col-6">
                  <p>Centre Names</p>
                </div>
                <div className="col-6">
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      : {centerList.map((center) => center.name).join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-12">
              <div className="row mt-3 mb-2">
                <div className="col-6">
                  <p>Grade</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.subject_name}</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-12">
              <div className="row mt-3 mb-2">
                <div className="col-6">
                  <p>Name</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.name}</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-12">
              <div className="row mt-3 mb-2">
                <div className="col-6">
                  <p>Description</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.description}</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <hr className="m-0" />
        <DialogActions>
          <button className="btn btn-sm btn-back" onClick={handleClose}>
            Close
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}

TopicView.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default TopicView;
