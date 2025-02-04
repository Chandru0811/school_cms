import { Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";
import Button from "react-bootstrap/Button";


function TopicView({ show, setShow }) {
    const handleClose = () => {
      setShow(false);
    };
  
    return (
     <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
       <DialogTitle>View Topic</DialogTitle>
       <hr className="m-0"></hr>
       <DialogContent>
        <div className="row">
          <div className="col-md-6 col-12 mb-3">
            <strong>Subject ID:</strong> 4
          </div>
          <div className="col-md-6 col-12 mb-3">
            <strong>Name:</strong> Algebra Basics
          </div>
          <div className="col-md-6 col-12 mb-3">
            <strong>Description:</strong> Dummy Description
          </div>
        </div>
      </DialogContent>
      <hr className="m-0"></hr>
      <DialogActions className="mt-3">
        <Button className="btn btn-sm btn-border bg-light text-dark" onClick={handleClose}>
          Back
        </Button>
      </DialogActions>
        </Dialog>
    );
  }
  
  export default TopicView;
  