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
import TopicEdit from "./TopicEdit";

function TopicView({ show, setShow, id }) {
  const [data, setData] = useState({});
  const [centerList, setCenterList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const getTopicData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`topic/${id}`);
      setData(response.data.data);
    } catch (e) {
      toast.error(
        `Error Fetching Topic Data: ${e?.response?.data?.error || e.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // const getCenterList = async () => {
  //   try {
  //     const response = await api.get("centers/list");
  //     const centerNames = response.data.data.map((center) => ({
  //       name: center.name,
  //     }));
  //     setCenterList(centerNames);
  //   } catch (e) {
  //     toast.error(
  //       `Error Fetching Centers: ${e?.response?.data?.error || e.message}`
  //     );
  //   }
  // };

  useEffect(() => {
    if (show) {
      getTopicData();
      // getCenterList();
    }
  }, [id, show]);

  const truncateText = (text, length = 30) =>
    text?.length > length ? text.substring(0, length) + "..." : text;

  return (
    <>
      <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>View Topic</DialogTitle>
        <hr className="m-0" />
        <DialogContent>
          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="row">
              <div className="col-md-6 col-12">
                <div className="row mt-3 mb-2">
                  <div className="col-6">
                    <p className="view-label-text">Centre Names</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value">
                      :{" "}
                      {data.center_names
                        ? JSON.parse(data.center_names).join(", ")
                        : ""}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-12">
                <div className="row mt-3 mb-2">
                  <div className="col-6">
                    <p className="view-label-text">Subject Name</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value">
                      : {truncateText(data.subject_name)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-12">
                <div className="row mt-3 mb-2">
                  <div className="col-6">
                    <p className="view-label-text">Topic Name</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value">
                      : {truncateText(data.name)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-12">
                <div className="row mt-3 mb-2">
                  <div className="col-6">
                    <p className="view-label-text"> Description</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value text-truncate">
                      : {truncateText(data.description)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
        <hr className="m-0" />
        <DialogActions>
          <button className="btn btn-sm btn-back" onClick={handleClose}>
            Close
          </button>
          <button
            className="btn btn-sm btn-primary "
            type="submit"
            onClick={() => setShowEdit(true)}
          >
            update
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
