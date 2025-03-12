import { useState, useEffect } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { Modal, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import api from "../../../config/URL";
import { TbEdit } from "react-icons/tb";
import ImageURL from "../../../config/ImageURL";

function AvatarProfileEdit({ id, onSuccess }) {
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [avatarImage, setAvatarImage] = useState(null);

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .max(255, "*Name must not exceed 255 characters")
      .required("*Name is required"),
    image: yup.mixed().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      default_male: "",
      default_female: "",
      image: null,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("name", values.name);
        formData.append("default_male", values.default_male ? 1 : 0);
        formData.append("default_female", values.default_female ? 1 : 0);

        if (values.image && values.image instanceof File) {
          formData.append("image", values.image);
        }

        const response = await api.post(`admin/avatar/update/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data.success) {
          onSuccess();
          toast.success(
            response.data.message || "Avatar profile updated successfully!"
          );
          handleClose();
        } else {
          toast.error(
            response.data.message || "Failed to update avatar profile."
          );
        }
      } catch (error) {
        console.error("Update Error:", error.response);
        toast.error(
          error.response?.data?.message || "An error occurred while updating."
        );
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const getData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`admin/avatar/${id}`);
      if (response?.data?.data) {
        formik.setValues({
          name: response.data.data.name,
          default_male: response.data.data.default_male === 1,
          default_female: response.data.data.default_female === 1,
          image: null,
        });
        setAvatarImage(response.data.data.image || null);
      }
    } catch (error) {
      toast.error("Failed to fetch avatar details.");
    } finally {
      setLoading(false);
    }
  };

  const handleShow = () => {
    setLoadIndicator(false);
    getData();
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
    setSelectedFile(null);
    setAvatarImage(null);
    setLoadIndicator(false);
  };

  return (
    <>
      <span onClick={handleShow} style={{ cursor: "pointer" }}>
        <TbEdit style={{ color: "#4F46E5", fontSize: "16px" }} />
      </span>

      <Modal show={show} onHide={handleClose} size="md">
        <Modal.Header>
          <Modal.Title>Edit Avatar Profile</Modal.Title>
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
              <small>Update</small>
            </Button>
          </div>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "500px" }}
            >
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-3">
                <label className="form-label">
                  Name<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.name && formik.errors.name
                      ? "is-invalid"
                      : ""
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
            </form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

AvatarProfileEdit.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default AvatarProfileEdit;
