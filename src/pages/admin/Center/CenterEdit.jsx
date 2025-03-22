import { useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import api from "../../../config/URL";
import { TbEdit } from "react-icons/tb";
import { Button, Modal } from "react-bootstrap";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { FiSave } from "react-icons/fi";

function CenterEdit({ id, onSuccess }) {
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .max(255, "*Name must not exceed 255 characters")
      .required("*Name is required"),

    location: yup
      .string()
      .max(255, "*Location must not exceed 255 characters")
      .required("*Location is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      location: "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      const { created_by, updated_by, ...filteredValues } = values;

      try {
        const response = await api.put(`center/update/${id}`, filteredValues, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          onSuccess();
          toast.success(
            response.data.message || "Payment type updated successfully!"
          );
        } else {
          toast.error(
            response.data.message || "Failed to update payment type."
          );
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "An error occurred while updating."
        );
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  // Fetch existing data
  const getData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`center/${id}`);
      if (response?.data?.data) {
        const { created_by, updated_by, ...filteredData } = response.data.data;
        formik.setValues(filteredData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch payment type details.");
    } finally {
      setLoading(false);
    }
  };

  // Open dialog and fetch data
  const handleOpen = () => {
    getData();
    setOpen(true); // Open the dialog
  };

  // Close dialog and reset form
  const handleClose = () => {
    setOpen(false); // Close the dialog
    formik.resetForm(); // Reset the form
  };

  return (
    // <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
    //   <form
    //     onSubmit={formik.handleSubmit}
    //     onKeyDown={(e) => {
    //       if (e.key === "Enter" && !formik.isSubmitting) {
    //         e.preventDefault();
    //       }
    //     }}
    //   >
    //     <DialogTitle>Edit Center</DialogTitle>
    //     <hr className="m-0"></hr>
    //     <DialogContent>
    //       <div className="row">
    //         <div className="col-md-6 col-12 mb-3">
    //           <label className="form-label">
    //             Name<span className="text-danger">*</span>
    //           </label>
    //           <input
    //             type="text"
    //             className={`form-control form-control-sm ${
    //               formik.touched.name && formik.errors.name
    //                 ? "is-invalid"
    //                 : ""
    //             }`}
    //             {...formik.getFieldProps("name")}
    //           />
    //           {formik.touched.name && formik.errors.name && (
    //             <div className="invalid-feedback">
    //               {formik.errors.name}
    //             </div>
    //           )}
    //         </div>
    //         <div className="col-md-6 col-12 mb-3">
    //           <label className="form-label">
    //             Location<span className="text-danger">*</span>
    //           </label>
    //           <textarea
    //             type="text"
    //             className={`form-control form-control-sm ${
    //               formik.touched.location && formik.errors.location
    //                 ? "is-invalid"
    //                 : ""
    //             }`}
    //             rows={4}
    //             {...formik.getFieldProps("location")}
    //           />
    //           {formik.touched.location && formik.errors.location && (
    //             <div className="invalid-feedback">{formik.errors.location}</div>
    //           )}
    //         </div>
    //       </div>
    //     </DialogContent>
    //     <hr className="m-0"></hr>
    //     <DialogActions className="mt-3">
    //       <button
    //         className="btn btn-sm btn-back"
    //         onClick={handleClose}
    //       >
    //         Cancel
    //       </button>
    //       <button
    //         type="submit"
    //         className="btn btn-button btn-sm"
    //         disabled={loadIndicator}
    //       >
    //         {loadIndicator && (
    //           <span
    //             className="spinner-border spinner-border-sm me-2"
    //             aria-hidden="true"
    //           ></span>
    //         )}
    //         Update
    //       </button>
    //     </DialogActions>
    //   </form>
    // </Dialog>

    <>
      <span
        onClick={handleOpen}
        style={{
          whiteSpace: "nowrap",
          cursor: "pointer",
        }}
      >
        <TbEdit style={{ color: "#4F46E5", fontSize: "16px" }} />
      </span>

      <Modal show={open} onHide={handleClose} size="md">
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
          <Modal.Title>Edit Centre</Modal.Title>
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
        <Modal.Body className="d-flex justify-content-center align-items-center">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <div className="container">
                <div className="row">
                  <div className="col-12 mb-4 px-0">
                    <label className="form-label mb-0" htmlFor="name">
                      Name
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      placeholder="Enter Text"
                      aria-label="Default select example"
                      className={`form-control ${
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
                  <div className="col-12 mb-4 px-0">
                    <label className="form-label mb-0" htmlFor="location">
                      Location
                      <span className="text-danger">*</span>
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Enter Text"
                      className={`form-control ${
                        formik.touched.location && formik.errors.location
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("location")}
                      maxLength={825}
                    />
                    {formik.touched.location && formik.errors.location && (
                      <div className="invalid-feedback">
                        {formik.errors.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

CenterEdit.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  handleMenuClose: PropTypes.func.isRequired,
  id: PropTypes.func.isRequired,
};

export default CenterEdit;
