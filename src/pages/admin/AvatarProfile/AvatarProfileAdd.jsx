import { useFormik } from "formik";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import * as yup from "yup";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { FaPlus } from "react-icons/fa";

function AvatarProfileAdd({ onSuccess }) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .max(255, "*Name must not exceed 255 characters")
      .required("*Name is required"),
    image: yup.mixed().required("*Image is required"),
  });

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    formik.resetForm();
    setSelectedFile(null);
    setShow(false);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      image: null,
      default_male: 0,
      default_female: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("image", values.image);
        formData.append("default_male", values.default_male ? 1 : 0);
        formData.append("default_female", values.default_female ? 1 : 0);

        const response = await api.post("admin/avatar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.status === 200) {
          toast.success(response.data.message);
          if (onSuccess) onSuccess();
          handleClose();
          navigate("/avatar");
        } else {
          toast.error(response.data.message || "An unexpected error occurred.");
        }
      } catch (e) {
        console.error("Error Fetching Data:", e);
        toast.error(e?.response?.data?.error || "Error Fetching Data");
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  return (
    <>
      <div className="d-flex justify-content-end me-2">
        <button
          type="button"
          className="btn add-btn btn-sm d-flex align-items-center"
          onClick={handleShow}
        >
          <FaPlus fontSize={12} className="me-1" /> Add Avatar Profile
        </button>
      </div>

      <Modal show={show} onHide={handleClose} size="md">
        <Modal.Header closeButton>
          <Modal.Title>Add Avatar Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                Name<span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${
                  formik.touched.name && formik.errors.name ? "is-invalid" : ""
                }`}
                placeholder="Enter Name"
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="invalid-feedback">{formik.errors.name}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Default</label>
              <div className="d-flex gap-3">
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="Male"
                    name="default_gender"
                    value="1"
                    checked={formik.values.default_male === 1}
                    onChange={() => {
                      formik.setFieldValue("default_male", 1);
                      formik.setFieldValue("default_female", 0);
                    }}
                  />
                  <label className="form-check-label" htmlFor="Male">
                    Male
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="Female"
                    name="default_gender"
                    value="1"
                    checked={formik.values.default_female === 1}
                    onChange={() => {
                      formik.setFieldValue("default_female", 1);
                      formik.setFieldValue("default_male", 0);
                    }}
                  />
                  <label className="form-check-label" htmlFor="Female">
                    Female
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Image<span className="text-danger">*</span>
              </label>
              <input
                type="file"
                className={`form-control ${
                  formik.touched.image && formik.errors.image
                    ? "is-invalid"
                    : ""
                }`}
                accept="image/*"
                onChange={(event) => {
                  const file = event.currentTarget.files[0];
                  formik.setFieldValue("image", file || null);
                  setSelectedFile(file ? file.name : null);
                }}
              />
              {formik.touched.image && formik.errors.image && (
                <div className="invalid-feedback">{formik.errors.image}</div>
              )}
              {selectedFile && (
                <p className="mt-1 text-muted">Selected: {selectedFile}</p>
              )}
            </div>

            <div className="d-flex justify-content-end">
              <Button
                className="btn btn-secondary btn-sm me-2"
                onClick={handleClose}
              >
                Close
              </Button>
              <Button
                className="btn btn-primary btn-sm"
                type="submit"
                disabled={loadIndicator}
              >
                {loadIndicator && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  ></span>
                )}
                Submit
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

AvatarProfileAdd.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default AvatarProfileAdd;
