import { useState, useEffect } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { Modal, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import api from "../../../config/URL";
import { TbEdit } from "react-icons/tb";

function AvatarProfileEdit({ id, onSuccess }) {
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [avatarImage, setAvatarImage] = useState(null);

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .max(255, "*Name must not exceed 255 characters")
      .required("*Name is required"),
    gender: yup
      .string()
      .oneOf(["default_male", "default_female"])
      .required("*Gender is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      gender: "",
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
        formData.append("default_male", values.gender === "default_male" ? 1 : 0);
        formData.append("default_female", values.gender === "default_female" ? 1 : 0);
    
        if (values.image) {
          formData.append("image", values.image);
        }
    
        const response = await api.post(`admin/avatar/update/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
    
        if (response.data.success) {  
          onSuccess();
          toast.success(response.data.message || "Avatar profile updated successfully!");
          handleClose();
        } else {
          toast.error(response.data.message || "Failed to update avatar profile.");
        }
      } catch (error) {
        console.error("Update Error:", error.response);  
        toast.error(error.response?.data?.message || "An error occurred while updating.");
      } finally {
        setLoadIndicator(false);
      }
    }
    
    
  });

  const getData = async () => {
    try {
      const response = await api.get(`admin/avatar/${id}`);
      if (response?.data?.data) {
        formik.setValues({
          name: response.data.data.name,
          gender: response.data.data.default_male ? "default_male" : "default_female",
          image: null,
        });

        setAvatarImage(response.data.data.image || null);
      }
    } catch (error) {
      toast.error("Failed to fetch avatar details.");
    }
  };

  const handleShow = () => {
    getData();
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
    setSelectedFile(null);
    setAvatarImage(null);
  };

  return (
    <>
      <span onClick={handleShow} style={{ cursor: "pointer" }}>
        <TbEdit style={{ color: "#4F46E5", fontSize: "16px" }} />
      </span>

      <Modal show={show} onHide={handleClose} size="md">
        <Modal.Header closeButton>
          <Modal.Title>Edit Avatar Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                Name<span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${formik.touched.name && formik.errors.name ? "is-invalid" : ""}`}
                placeholder="Enter Name"
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && <div className="invalid-feedback">{formik.errors.name}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">
                Gender<span className="text-danger">*</span>
              </label>
              <div className="d-flex gap-3">
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="male"
                    name="gender"
                    value="default_male"
                    checked={formik.values.gender === "default_male"}
                    onChange={formik.handleChange}
                  />
                  <label className="form-check-label" htmlFor="male">
                    Male
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="female"
                    name="gender"
                    value="default_female"
                    checked={formik.values.gender === "default_female"}
                    onChange={formik.handleChange}
                  />
                  <label className="form-check-label" htmlFor="female">
                    Female
                  </label>
                </div>
              </div>
              {formik.touched.gender && formik.errors.gender && <div className="text-danger mt-1">{formik.errors.gender}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">
                Image (Optional)
              </label>

              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(event) => {
                  const file = event.currentTarget.files[0];
                  formik.setFieldValue("image", file || null);
                  setSelectedFile(file ? file.name : null);
                  setAvatarImage(file ? URL.createObjectURL(file) : null);
                }}
              />

              {avatarImage && (
                <div className="mt-2">
                  <p className="text-muted">Current Image:</p>
                  <img src={avatarImage} alt="Avatar Preview" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                </div>
              )}
            </div>

            <div className="d-flex justify-content-end">
              <Button className="btn btn-secondary btn-sm me-2" onClick={handleClose}>Close</Button>
              <Button className="btn btn-primary btn-sm" type="submit" disabled={loadIndicator}>
                {loadIndicator && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>}
                Submit
              </Button>
            </div>
          </form>
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
