import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";

function SchoolView({ show, setShow }) {
  const handleClose = () => {
    setShow(false);
  };

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>View School</DialogTitle>
      <hr className="m-0"></hr>
      <DialogContent>
        <div className="row">
          <div className="col-md-6 col-12 mb-3">
            <strong>School Name:</strong> Girls Hrs Sec School
          </div>
          <div className="col-md-6 col-12 mb-3">
            <strong>Location:</strong> Chennai
          </div>
        </div>
      </DialogContent>
      <hr className="m-0"></hr>
      <DialogActions className="mt-3">
        <Button className="btn btn-sm btn-back" onClick={handleClose}>
          Back
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SchoolView.propTypes = {
  show: PropTypes.func.isRequired,
  setShow: PropTypes.func.isRequired,
};

export default SchoolView;
