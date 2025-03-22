import { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { MultiSelect } from "react-multi-select-component";
import api from "../../../config/URL";
import { FaPlus } from "react-icons/fa";
import { Button, Modal, ModalBody } from "react-bootstrap";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { FiSave } from "react-icons/fi";

function TopicAdd({ onSuccess }) {
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState([]);
  const navigate = useNavigate();
  const [centerList, setCenterList] = useState([]);
  const [grades, setGrades] = useState([]);

  const validationSchema = yup.object().shape({
    center_id: yup
      .array()
      .min(1, "*Select at least one center")
      .required("*Select a center id"),
    grade_id: yup.string().required("*Select a subject"),
    name: yup
      .string()
      .max(255, "*Subject Name must not exceed 255 characters")
      .required("*Subject Name is required"),
  });

  const handleShow = () => {
    setShow(true);
    getCenterList();
    formik.resetForm();
  };

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
    setSelectedCenter([]);
  };

  const formik = useFormik({
    initialValues: {
      center_id: [],
      grade_id: "",
      name: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.post("subject", values);
        console.log(response.status);

        if (response.status === 200) {
          toast.success(response.data.message);
          onSuccess();
          handleClose();
          formik.resetForm();
          navigate("/subject");
        }
      } catch (e) {
        toast.error("Error Fetching Data ", e?.response?.data?.error);
      } finally {
        setLoadIndicator(false);
      }
    },
  });

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
    } catch (e) {
      console.error("Error Fetching Data", e);
      toast.error("Error Fetching Data", e?.response?.data?.error || e.message);
    }
  };

  useEffect(() => {
    getGradeList();
  }, [selectedCenter]);

  return (
    <>
      <button
        type="button"
        className="btn add-btn btn-sm d-flex align-items-center"
        onClick={handleShow}
      >
        <FaPlus fontSize={12} className="me-1" /> Add Subject
      </button>
    <Modal show={show} onHide={handleClose} size="md">
        <form
          onSubmit={formik.handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !formik.isSubmitting) {
              e.preventDefault();
            }
          }}
        >
          <Modal.Header closeButton className="justify-content-start gap-2">
          <div>
              <button
                type="button "
                className="btn btn-sm add-btn"
                onClick={handleClose}
              >
                <MdKeyboardArrowLeft size={20} />
              </button>
              &nbsp;&nbsp;
            </div>
            <Modal.Title>Subject Add</Modal.Title>
            <div className="d-flex gap-3 ms-auto">
              
              <Button
                className="btn add-btn button-spinner"
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
                <FiSave className="trash-icon" />
              </Button>
            </div>
          </Modal.Header>
          <ModalBody>
            <div className="row">
              <div className="col-12">
                <div className="row mb-4">
                  <div className="col-12 d-flex">
                    <p className="view-label-text">Centre Name</p>{" "}
                    <span className="text-danger">*</span>
                  </div>
                  <div className="col-12">
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
                      className={`form-multi-select border-1 rounded-1 ${
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
              <div className="col-12">
                <div className="row mb-4">
                  <div className="col-12 d-flex">
                    <p className="view-label-text">Grade</p>{" "}
                    <span className="text-danger">*</span>
                  </div>
                  <div className="col-12">
                    <select
                      className={`form-select  ${
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
              <div className="col-12">
                <div className="row mb-4">
                  <div className="col-12 d-flex">
                    <p className="view-label-text">Name</p>{" "}
                    <span className="text-danger">*</span>
                  </div>
                  <div className="col-12">
                    <input
                      placeholder="Enter Text"
                      type="text"
                      onKeyDown={(e) => e.stopPropagation()}
                      className={`form-control  ${
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
              <div className="col-12">
                <div className="row mb-4">
                  <div className="col-12 d-flex">
                    <p className="view-label-text">Description</p>
                  </div>
                  <div className="col-12">
                    <textarea
                      placeholder="Enter Text"
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
              </div>
            </div>
          </ModalBody>
        </form>
      </Modal>
    </>
  );
}

TopicAdd.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default TopicAdd;
