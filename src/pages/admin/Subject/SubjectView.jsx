import { Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";
import PropTypes from "prop-types";


function SubjectView({ show, setShow }) {
    const handleClose = () => {
      setShow(false);
    };
  
    return (
     <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
       <DialogTitle>View Subject</DialogTitle>
       <hr className="m-0"></hr>
       <DialogContent>
        <div className="row">
        <div className="col-md-6 col-12">
          <div className="row mt-3  mb-2">
            <div className="col-6 ">
              <p className="">Grade ID</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">:</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="row mt-3  mb-2">
            <div className="col-6 ">
              <p className="">Name</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">:</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="row mt-3  mb-2">
            <div className="col-6 ">
              <p className="">Description</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">:</p>
            </div>
          </div>
        </div>
        </div>
      </DialogContent>
      <hr className="m-0"></hr>
      <DialogActions className="mt-3">
        <button className="btn btn-sm btn-back" onClick={handleClose}>
          Back
        </button>
      </DialogActions>
        </Dialog>
    );
  }

  SubjectView.propTypes = {
    show: PropTypes.func.isRequired,
    setShow: PropTypes.func.isRequired,
  };
  
  export default SubjectView;
  