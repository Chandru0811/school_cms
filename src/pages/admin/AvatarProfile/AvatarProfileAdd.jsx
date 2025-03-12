import { useFormik } from "formik";
import { useCallback, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import * as yup from "yup";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { FaPlus } from "react-icons/fa";
import Cropper from "react-easy-crop";

function AvatarProfileAdd({ onSuccess }) {
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

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
    setShowCropper(false);
    setShow(false);
  };

  const getCroppedImg = async (imageSrc, croppedAreaPixels) => {
    const image = new Image();
    image.src = imageSrc;
  
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
  
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );
  
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        blob.name = 'cropped-image.jpeg';
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        formik.setFieldValue("image", croppedImage);
        setSelectedFile(croppedImage.name);
        setShowCropper(false);
      } catch (error) {
        console.error("Error cropping image:", error);
        toast.error("Error cropping image");
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
      setShowCropper(true);
    }
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
        <Modal.Header>
          <Modal.Title>Add Avatar Profile</Modal.Title>
          <div className="d-flex gap-3">
            <Button
              className="btn btn-secondary btn-sm py-0"
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              className="btn add-btn button-spinner"
              type="submit"
              disabled={loadIndicator}
              onClick={formik.handleSubmit}
            >
              {loadIndicator && (
                <span
                  className="spinner-border spinner-border-sm me-2 "
                  aria-hidden="true"
                ></span>
              )}
              <small>Submit</small>
            </Button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                Name<span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${formik.touched.name && formik.errors.name ? "is-invalid" : ""
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
                className={`form-control ${formik.touched.image && formik.errors.image
                  ? "is-invalid"
                  : ""
                  }`}
                accept="image/*"
                // onChange={(event) => {
                //   const file = event.currentTarget.files[0];
                //   formik.setFieldValue("image", file || null);
                //   setSelectedFile(file ? file.name : null);
                // }}
                onChange={handleFileChange}
              />
              {formik.touched.image && formik.errors.image && (
                <div className="invalid-feedback">{formik.errors.image}</div>
              )}
              {selectedFile && (
                <p className="mt-1 text-muted">Selected: {selectedFile}</p>
              )}
            </div>

            {showCropper && (
              <div className="crop-container" style={{ width: "300px", height: "200px", position: "relative" }}>
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  cropShape="rect"
                  showGrid={false}
                />
              </div>
            )}

            {showCropper && (
              <div className="d-flex justify-content-start mt-3 gap-2">
                <button type="button" className="btn btn-sm btn-primary mt-3" onClick={handleCrop}>Save</button>
                <button type="button" className="btn btn-sm btn-secondary mt-3" onClick={() => setShowCropper(false)}>Cancel</button>
              </div>
            )}
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
