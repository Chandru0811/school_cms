import { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import PropTypes from "prop-types";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { TbEdit } from "react-icons/tb";

function TopicEdit({ id, onSuccess }) {
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState([]);
  const [centerList, setCenterList] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);

  const validationSchema = yup.object().shape({
    center_id: yup
      .array()
      .min(1, "*Select at least one center")
      .required("*Select a center id"),
    grade_id: yup.string().required("*Select a grade"),
    subject_id: yup.string().required("*Selected a subject"),
    name: yup.string().max(255, "*Topic Name must not exceed 255 characters").required("*Topic Name is required"),
  });

  const formik = useFormik({
    initialValues: {
      center_id: [],
      grade_id: "",
      subject_id: "",
      name: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.put(`topic/update/${id}`, values);
        if (response.status === 200) {
          toast.success(response.data.message);
          onSuccess();
          handleClose();
          // navigate("/topic");
        }
      } catch (e) {
        toast.error(
          `Error Fetching Data: ${e?.response?.data?.error || e.message}`
        );
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const getTopicData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`topic/${id}`);
      const { data } = response.data;
      const centerIds = JSON.parse(data.center_id).map(Number); // Parse and convert to numbers
      const selectedCenters = centerList.filter((center) =>
        centerIds.includes(center.value)
      );
      setSelectedCenter(selectedCenters);
      formik.setValues({
        center_id: centerIds,
        grade_id: data.grade_id || "",
        subject_id: data.subject_id || "",
        name: data.name || "",
        description: data.description || "",
      });
    } catch (e) {
      toast.error(
        `Error Fetching Data: ${e?.response?.data?.error || e.message}`
      );
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
      toast.error(`Error Fetching Data: ${e?.response?.data?.error || e.message}`);
    }
  };

  const getGradeList = async () => {
    try {
      if (selectedCenter.length === 0) {
        setGrades([]);
        formik.setFieldValue("grade_id", "");
        return;
      }

      const centerIds = selectedCenter.map(center => `center_id[]=${center.value}`).join("&");
      const response = await api.get(`filter/grades?${centerIds}`);

      const formattedGrades = response.data?.data?.map((grade) => ({
        value: grade.id,
        label: grade.name,
      }));

      setGrades(formattedGrades);

      // Reset grade & subject if current values are no longer valid
      if (!formattedGrades.some(g => g.value === formik.values.grade_id)) {
        formik.setFieldValue("grade_id", "");
        formik.setFieldValue("subject_id", "");
      }
    } catch (e) {
      toast.error(`Error Fetching Grades: ${e?.response?.data?.error || e.message}`);
    }
  };

  const getSubjectList = async () => {
    try {
      if (!formik.values.grade_id) {
        setSubjects([]);
        formik.setFieldValue("subject_id", "");
        return;
      }

      const response = await api.get(`filter/subjects?grade_id[]=${formik.values.grade_id}`);

      const formattedSubjects = response.data?.data?.map((subject) => ({
        value: subject.id,
        label: subject.name,
      }));

      setSubjects(formattedSubjects);

      if (!formattedSubjects.some(s => s.value === formik.values.subject_id)) {
        formik.setFieldValue("subject_id", "");
      }
    } catch (e) {
      toast.error(`Error Fetching Subjects: ${e?.response?.data?.error || e.message}`);
    }
  };

  useEffect(() => {
      getTopicData();
      getCenterList();

  }, [id]);

  useEffect(() => {
    if (selectedCenter.length > 0) {
      getGradeList();
    } else {
      setGrades([]);
      formik.setFieldValue("grade_id", "");
      formik.setFieldValue("subject_id", "");
    }
  }, [selectedCenter]);

  useEffect(() => {
    if (formik.values.grade_id) {
      getSubjectList();
    } else {
      setSubjects([]);
      formik.setFieldValue("subject_id", "");
    }
  }, [formik.values.grade_id]);

  const handleShow = () => {
    setShow(true);
    formik.resetForm();
  };

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };

  return (
    <>
      <span
        type="button"
        className=" d-flex align-items-center"
        onClick={handleShow}
      >
         <TbEdit style={{ color: "#4F46E5", fontSize: "16px" }} />
      </span>
      <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
        <form
          onSubmit={formik.handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !formik.isSubmitting) {
              e.preventDefault();
            }
          }}
        >
          <DialogTitle>Topic Edit</DialogTitle>
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
              Update
            </button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

TopicEdit.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default TopicEdit;