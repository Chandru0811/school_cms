import PropTypes from "prop-types";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import GradeEdit from "./GradeEdit";
import { Button, Modal } from "react-bootstrap";

function GradeView({ show, setShow, id }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const handleClose = () => {
    setShow(false);
  };
  const getGradeData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`grade/${id}`);
      setData(response.data.data);
    } catch (e) {
      toast.error("Error Fetching Data ", e?.response?.data?.error);
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
      getGradeData();
      // getCenterList();
    }
  }, [id, show]);

  const truncateText = (text, length = 30) =>
    text?.length > length ? text.substring(0, length) + "..." : text;

  return (
  <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header>
        <Modal.Title>Grade View</Modal.Title>
        <div className="d-flex gap-3">
          <Button
            className="btn btn-secondary btn-sm py-0"
            onClick={handleClose}
          >
            Close
          </Button>
          <button className="rounded-1">
            <GradeEdit id={id} onSuccess={getGradeData} />
          </button>
        </div>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
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
                  <p className="text-muted text-sm">
                    : {truncateText(data.name)}
                  </p>
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
        )}
      </Modal.Body>
    </Modal>
  );
}

GradeView.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
};

export default GradeView;
