import { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { MultiSelect } from "react-multi-select-component";
import { useNavigate } from "react-router-dom";
import { TbEdit } from "react-icons/tb";
import { Button, Modal, ModalBody } from "react-bootstrap";

function SubjectEdit({ id, onSuccess }) {
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCenter, setSelectedCenter] = useState([]);
  const [centerList, setCenterList] = useState([]);
  const [grades, setGrades] = useState([]);
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    center_id: yup
      .array()
      .min(1, "*Select at least one center")
      .required("*Select a center id"),
    grade_id: yup.string().required("*Selected a grade"),
    name: yup
      .string()
      .max(255, "*Subject Name must not exceed 255 characters")
      .required("*Subject Name is required"),
  });

  const formik = useFormik({
    initialValues: {
      center_id: [],
      grade_id: "",
      name: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.put(`subject/update/${id}`, values);
        if (response.status === 200) {
          toast.success(response.data.message);
          onSuccess();
          handleClose();
          navigate("/subject");
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

  const getSubjectData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`subject/${id}`);
      const { subject } = response.data.data;
      const parsedCenterIds = JSON.parse(subject.center_id);
      const parsedCenterNames = JSON.parse(subject.center_names);
      const selectedCenters = parsedCenterIds.map((id, index) => ({
        value: id,
        label: parsedCenterNames[index] || "",
      }));
      setSelectedCenter(selectedCenters);
      formik.setValues({
        center_id: selectedCenters.map((center) => center.value),
        grade_id: subject.grade_id || "",
        name: subject.name || "",
        description: subject.description || "",
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
      toast.error(
        `Error Fetching Data: ${e?.response?.data?.error || e.message}`
      );
    }
  };

  const getGradeList = async () => {
    try {
      if (selectedCenter.length === 0) {
        setGrades([]);
        return;
      }
      const centerIds = selectedCenter
        .map((center) => `center_id[]=${center.value}`)
        .join("&");
      const response = await api.get(`filter/grades?${centerIds}`);
      const formattedGrades = response.data?.data?.map((grade) => ({
        value: grade.id,
        label: grade.name,
      }));
      setGrades(formattedGrades);
      if (!formattedGrades.some((g) => g.value === formik.values.grade_id)) {
        formik.setFieldValue("grade_id", "");
      }
    } catch (e) {
      console.error("Error Fetching Data", e);
      toast.error(
        `Error Fetching Data: ${e?.response?.data?.error || e.message}`
      );
    }
  };

  useEffect(() => {
    getSubjectData();
    getCenterList();
  }, [id]);

  useEffect(() => {
    getGradeList();
  }, [selectedCenter]);

  const handleShow = () => {
    setShow(true);
    formik.resetForm();
  };

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
    setSelectedCenter([]);
  };

  return (
    <>
      <button
        type="button"
        className="d-flex align-items-center"
        onClick={handleShow}
      >
        <TbEdit style={{ color: "#4F46E5", fontSize: "16px" }} />
      </button>
      <Modal show={show} onHide={handleClose} size="lg">
        <form
          onSubmit={formik.handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !formik.isSubmitting) {
              e.preventDefault();
            }
          }}
        >
          <Modal.Header>
            <Modal.Title>Subject Edit</Modal.Title>
            <div className="d-flex gap-3">
              <Button
                className="btn btn-secondary btn-sm py-0"
                onClick={handleClose}
              >
                Close
              </Button>
              <Button
                className="btn add-btn button-spinner text-light"
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
                <small> Update</small>
              </Button>
            </div>
          </Modal.Header>
          <ModalBody>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5 d-flex">
                      <p className="view-label-text">Centre Name</p>{" "}
                      <span className="text-danger">*</span>
                    </div>
                    <div className="col-7">
                      <MultiSelect
                        options={centerList}
                        value={selectedCenter}
                        onChange={(selected) => {
                          setSelectedCenter(selected);
                          formik.setFieldValue(
                            "center_id",
                            selected.map((option) => option.value)
                          );
                        }}
                        labelledBy="Select Center"
                        className={`form-multi-select form-multi-select-sm border-1 rounded-1 mb-5${
                          formik.touched.center_id && formik.errors.center_id
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.center_id && formik.errors.center_id && (
                        <div className="invalid-feedback">
                          {formik.errors.center_id}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5 d-flex">
                      <p className="view-label-text">Grade</p>{" "}
                      <span className="text-danger">*</span>
                    </div>
                    <div className="col-7">
                      <select
                        className={`form-select form-select-sm ${
                          formik.touched.grade_id && formik.errors.grade_id
                            ? "is-invalid"
                            : ""
                        }`}
                        value={formik.values.grade_id}
                        onChange={(e) =>
                          formik.setFieldValue("grade_id", e.target.value)
                        }
                      >
                        <option value="">Select Grade</option>
                        {grades.map((grade) => (
                          <option key={grade.value} value={grade.value}>
                            {grade.label}
                          </option>
                        ))}
                      </select>
                      {formik.touched.grade_id && formik.errors.grade_id && (
                        <div className="invalid-feedback">
                          {formik.errors.grade_id}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5 d-flex">
                      <p className="view-label-text">Name</p>{" "}
                      <span className="text-danger">*</span>
                    </div>
                    <div className="col-7">
                      <input
                        placeholder="Enter Text"
                        type="text"
                        onKeyDown={(e) => e.stopPropagation()}
                        className={`form-control form-control-sm ${
                          formik.touched.name && formik.errors.name
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("name")}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <div className="invalid-feedback">
                          {formik.errors.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5 d-flex">
                      <p className="view-label-text">Description</p>
                    </div>
                    <div className="col-7">
                      <textarea
                        placeholder="Enter Text"
                        className={`form-control ${
                          formik.touched.description &&
                          formik.errors.description
                            ? "is-invalid"
                            : ""
                        }`}
                        rows="4"
                        {...formik.getFieldProps("description")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
        </form>
      </Modal>
    </>
  );
}

SubjectEdit.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default SubjectEdit;
