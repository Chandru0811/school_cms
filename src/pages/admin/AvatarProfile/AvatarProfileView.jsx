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
import ImageURL from "../../../config/ImageURL";

function AvatarProfileView({ show, setShow, id }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`admin/avatar/${id}`);
      setData(response.data.data);
    } catch (e) {
      toast.error(
        `Error Fetching Topic Data: ${e?.response?.data?.error || e.message}`
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (show) {
      getData();
    }
  }, [id, show]);

  const truncateText = (text, length = 30) =>
    text?.length > length ? text.substring(0, length) + "..." : text;

  return (
    <>
      <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>View Profile Avatar</DialogTitle>
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
                    <p className="view-label-text">Names</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value">
                      : {data.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-12">
                <div className="row mt-3 mb-2">
                  <div className="col-6">
                    <p className="view-label-text">Image</p>
                  </div>
                  <div className="col-6">
                    <p className="view-value">
                    :
                  <img
                    src={`${ImageURL.replace(/\/$/, "")}/${data?.image?.replace(
                      /^\//,
                      ""
                    )}`}
                    alt="Avatar"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "5px",
                    }}
                  />
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

AvatarProfileView.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default AvatarProfileView;
