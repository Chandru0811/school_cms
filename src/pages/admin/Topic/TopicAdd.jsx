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

function TopicAdd({ onSuccess }) {
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
          subject_id: values.subject_id,
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
    if (show) {
      getSubjectData();
      getCenterList();
    }
  }, [show]);

  return (
    <>
      <button
        type="button"
        className="btn add-btn btn-sm d-flex align-items-center"
        onClick={handleShow}
      >
        <FaPlus fontSize={12} className="me-1" /> Add Topic
      </button>
      <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
        <form
          onSubmit={formik.handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !formik.isSubmitting) {
              e.preventDefault();
            }
          }}
        >
          <DialogTitle>Topic Add</DialogTitle>
          <hr className="m-0"></hr>
          <DialogContent>
            <div className="row">
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5">
                    <p className="view-label-text">Topic Name</p>
                  </div>
                  <div className="col-7">
                    <input
                    placeholder="Enter Text"
                      type="text"
                      onKeyDown={(e) => e.stopPropagation()}
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
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5">
                    <p className="view-label-text">Description</p>
                  </div>
                  <div className="col-7">
                    <textarea
                    placeholder="Enter Text"
                      className={`form-control ${
                        formik.touched.description && formik.errors.description
                          ? "is-invalid"
                          : ""
                      }`}
                      rows="3"
                      {...formik.getFieldProps("description")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
          <hr className="m-0"></hr>
          <DialogActions className="mt-3">
            <button
              type="button"
              className="btn btn-sm btn-back"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-button btn-sm"
              disabled={loadIndicator}
            >
              {loadIndicator && (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                ></span>
              )}
              Save
            </button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

TopicAdd.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default TopicAdd;
