import { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import api from "../../../config/URL";
import { FaPlus } from "react-icons/fa";
import { Button, Modal } from "react-bootstrap";

function TopicAdd({ id, onSuccess }) {
  const navigate = useNavigate();
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [show, setShow] = useState(false);
  const [centerList, setCenterList] = useState([]);

  const validationSchema = yup.object().shape({
    topic_name: yup.string().required("*Select a Topic"),
  });

  const handleShow = () => {
    setShow(true);
    formik.resetForm();
  };

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      subject_id: "",
      topic_name: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Form Submitted", values);
      setLoadIndicator(true);
      try {
        const payload = {
          ...values,
          name: values.topic_name,
          subject_id: id,
        };
        delete payload.topic_name;

        const response = await api.post("topic", payload);
        if (response.status === 200) {
          toast.success(response.data.message);
          onSuccess();
          handleClose();
          formik.resetForm();
          // navigate(`subject/view/${id}`);
        }
      } catch (e) {
        toast.error(`Error: ${e?.response?.data?.error || e.message}`);
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const getSubjectData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`subject/${id}`);
      setData(response.data.data);
      formik.setFieldValue("subject_id", response.data.data.subject.id || "");
    } catch (e) {
      toast.error("Error Fetching Data", e?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const getCenterList = async () => {
    try {
      const response = await api.get("centers/list");
      const formattedCenters = response.data.data.map((center) => ({
        value: center.id,
        label: center.name,
      }));

      setCenterList(formattedCenters);
    } catch (e) {
      toast.error("Error Fetching Data ", e?.response?.data?.error);
    }
  };

  useEffect(() => {
    getSubjectData();
    getCenterList();
  }, []);

  return (
    <>
      <button
        type="button"
        className="btn add-btn btn-sm d-flex align-items-center"
        onClick={handleShow}
      >
        <FaPlus fontSize={12} className="me-1" /> Add Topic
      </button>
      <Modal show={show} onHide={handleClose} size="lg">
        <form
          onSubmit={formik.handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        >
          <Modal.Header>
            <Modal.Title>Topic Add</Modal.Title>
            <div className="d-flex gap-3">
              <Button
                className="btn btn-secondary btn-sm py-0"
                onClick={handleClose}
              >
                Close
              </Button>
              <Button
                className="btn add-btn "
                type="submit"
                disabled={loadIndicator}
                onClick={formik.handleSubmit}
              >
                {loadIndicator && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  ></span>
                )}
                <small>Submit</small>
              </Button>
            </div>
          </Modal.Header>
          <Modal.Body>
            {loading ? (
              <div className="loader-container">
                <div className="loader"></div>
              </div>
            ) : (
              <div className="row">
                <div className="col-md-6 col-12 mb-3">
                  <label className="form-label">
                    Topic Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-sm ${
                      formik.touched.topic_name && formik.errors.topic_name
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("topic_name")}
                  />
                  {formik.touched.topic_name && formik.errors.topic_name && (
                    <div className="invalid-feedback">
                      {formik.errors.topic_name}
                    </div>
                  )}
                </div>

                <div className="col-md-6 col-12 mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className={`form-control ${
                      formik.touched.description && formik.errors.description
                        ? "is-invalid"
                        : ""
                    }`}
                    rows="4"
                    {...formik.getFieldProps("description")}
                  />
                </div>
              </div>
            )}
          </Modal.Body>
        </form>
      </Modal>
    </>
  );
}

TopicAdd.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default TopicAdd;
