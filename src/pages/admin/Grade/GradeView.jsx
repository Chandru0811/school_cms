import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import PropTypes from "prop-types";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

function GradeView({ show, setShow, id }) {
  const [data, setData] = useState({});
  const [centerList, setCenterList] = useState([]);

  const handleClose = () => {
    setShow(false);
  };
  const getGradeData = async () => {
    try {
      const response = await api.get(`grade/${id}`);
      setData(response.data.data);
    } catch (e) {
      toast.error("Error Fetching Data ", e?.response?.data?.error);
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
      getGradeData();
      getCenterList();
    }
  }, [id, show]);

  const truncateText = (text, length = 30) =>
    text?.length > length ? text.substring(0, length) + "..." : text;

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>View Grade</DialogTitle>
      <hr className="m-0"></hr>
      <DialogContent>
        <div className="row">
          <div className="col-md-6 col-12">
            <div className="row mt-3  mb-2">
              <div className="col-6 ">
                <p className="">Center</p>
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
                <p className="">Name</p>
              </div>
              <div className="col-6">
                <p className="text-muted text-sm">:{truncateText(data.name)}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-12">
            <div className="row mt-3  mb-2">
              <div className="col-6 ">
                <p className="">Description</p>
              </div>
              <div className="col-6">
                <p
                  className="text-muted text-sm text-truncate"
                  style={{ maxWidth: "200px" }}
                >
                  : {truncateText(data.description)}
                </p>{" "}
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

GradeView.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
};

export default GradeView;
