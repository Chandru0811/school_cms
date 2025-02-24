import { useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import api from "../../../config/URL";
import { Button } from "react-bootstrap";

function CenterEdit({ id, onSuccess, handleMenuClose }) {
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [open, setOpen] = useState(false);

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
      try {
        const response = await api.put(`center/update/${id}`, values, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          onSuccess();
          handleMenuClose();
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
      const response = await api.get(`center/${id}`);
      if (response?.data?.data) {
        formik.setValues(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch payment type details.");
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
    if (handleMenuClose) {
      handleMenuClose(); // Optional: Trigger parent menu close if applicable
    }
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
        Edit
      </span>

      <Dialog
        open={open} // Controlled by local state
        onClose={handleClose} // Trigger handleClose on dialog close
        fullWidth
        maxWidth="md"
      >
        <form
          onSubmit={formik.handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !formik.isSubmitting) {
              e.preventDefault();
            }
          }}
        >
          <DialogTitle>Edit Centre</DialogTitle>
          <DialogContent>
            <div className="container">
              <div className="row">
                <div className="col-md-6 col-12 mb-3">
                  <label className="form-label">
                    Name<span className="text-danger">*</span>
                  </label>
                  <input
                    className={`form-control ${formik.touched.name && formik.errors.name
                        ? "is-invalid"
                        : ""
                      }`}
                    {...formik.getFieldProps("name")}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="invalid-feedback">{formik.errors.name}</div>
                  )}
                </div>
                <div className="col-md-6 col-12 mb-3">
                  <label className="form-label">
                    Location<span className="text-danger">*</span>
                  </label>
                  <textarea
                    rows={5}
                    className={`form-control ${formik.touched.location && formik.errors.location
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
          </DialogContent>
          <DialogActions>
            <button
              type="button"
              className="btn btn-sm btn-back"
              onClick={handleClose}
              disabled={loadIndicator} // Disable close button during submission
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-button"
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

CenterEdit.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  handleMenuClose: PropTypes.func.isRequired,
  id: PropTypes.func.isRequired,
};

export default CenterEdit;
