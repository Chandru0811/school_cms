import { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";

function AddTopic({ id, show, setShow, onSuccess }) {
  const navigate = useNavigate();
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [centerList, setCenterList] = useState([]);

  const handleClose = () => setShow(false);

  const validationSchema = yup.object().shape({
    topic_name: yup.string().required("*Select a subject"),
  });

  const formik = useFormik({
    initialValues: {
      center_id: [],
      grade_id: "",
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
          center_id: values.center_id,
          subject_id: values.subject_id, 
        };
        delete payload.topic_name;

        const response = await api.post("topic", payload);
        if (response.status === 200) {
          toast.success(response.data.message);
          onSuccess();
          handleClose();
          formik.resetForm();
          navigate("/topic");
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

      const centerIds = JSON.parse(response.data.data.center_id);

      formik.setFieldValue("center_id", centerIds || []);
      formik.setFieldValue("grade_id", response.data.data.grade_id || "");
      formik.setFieldValue("subject_id", response.data.data.id || ""); 
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
      <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
        <form
          onSubmit={formik.handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        >
          <DialogTitle>Add Topic</DialogTitle>
          <hr className="m-0" />
          <DialogContent>
            {loading ? (
              <div className="loader-container">
                <div className="loader"></div>
              </div>
            ) : (
              <div className="row">
                <div className="col-md-6 col-12 mb-3">
                  <label className="form-label">
                    Centre Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={data.center_names ? JSON.parse(data.center_names).join(", ") : ""}
                    readOnly
                  />
                </div>

                <div className="col-md-6 col-12 mb-3">
                  <label className="form-label">
                    Grade<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={data.grand_name || ""}
                    readOnly
                  />
                </div>

                <div className="col-md-6 col-12 mb-3">
                  <label className="form-label">
                    Subject Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={data.name}
                    readOnly
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="invalid-feedback">{formik.errors.name}</div>
                  )}
                </div>

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
          </DialogContent>
          <hr className="m-0" />
          <DialogActions className="mt-3">
            <button
              className="btn btn-sm btn-back"
              onClick={handleClose}
              type="button"
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

AddTopic.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  id: PropTypes.number,
  onSuccess: PropTypes.func.isRequired,
};

export default AddTopic;