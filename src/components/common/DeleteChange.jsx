import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Dialog, DialogActions, DialogTitle, Slide } from "@mui/material";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";
import api from "../../config/URL";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

// eslint-disable-next-line react/prop-types
function DeleteChange({ path, onDeleteSuccess, onOpen, navigate }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleCloseDialog = () => {
    if (typeof onOpen === "function") onOpen();
    setDeleteDialogOpen(false);
    document.body.style.overflow = "";
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await api.delete(path);

      if (response.status === 200) {
        onDeleteSuccess();
        toast.success(response?.data?.message || "Deleted successfully!");
        handleCloseDialog();
        if (navigate) navigate();
      }
    } catch (error) {
      console.error("Delete error:", error);
      if (error.response) {
        if (error.response.status === 404) {
          toast.error("Avatar not found. It may have already been deleted.");
        } else if (error.response.status === 422) {
          const errors = error.response.data.errors;
          if (errors) {
            Object.keys(errors).forEach((key) => {
              errors[key].forEach((errorMsg) => {
                toast.error(errorMsg, {
                  icon: <FiAlertTriangle className="text-warning" />,
                });
              });
            });
          }
        } else {
          toast.error(error.response.data.message || "Error occurred.");
        }
      } else if (error.request) {
        toast.error("Server did not respond. Please try again.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={deleteDialogOpen}
      onClose={handleCloseDialog}
      TransitionComponent={Transition}
      keepMounted
      sx={{
        "& .MuiDialog-paper": {
          margin: "0 auto",
          top: "10%",
          position: "absolute",
        },
      }}
    >
      <DialogTitle>Are you sure you want to delete this record?</DialogTitle>
      <DialogActions>
        <Button
          onClick={handleCloseDialog}
          className="btn btn-secondary btn-sm"
        >
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          disabled={loading}
          className="btn btn-button"
        >
          {loading && (
            <span
              className="spinner-border spinner-border-sm button-spinner me-2 text-light"
              aria-hidden="true"
            ></span>
          )}
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DeleteChange.propTypes = {
  path: PropTypes.string.isRequired,
  onOpen: PropTypes.func.isRequired,
  onDeleteSuccess: PropTypes.func.isRequired,
};

export default DeleteChange;
