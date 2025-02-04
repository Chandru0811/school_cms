import { Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";
import Button from "react-bootstrap/Button";


function AnswerView({ show, setShow }) {
    const handleClose = () => {
      setShow(false);
    };
  
    return (
     <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
       <DialogTitle>View Answer</DialogTitle>
       <hr className="m-0"></hr>
       <DialogContent>
        <div className="row">
          <div className="col-md-6 col-12 mb-3">
            <strong>Question ID:</strong> 1
          </div>
          <div className="col-md-6 col-12 mb-3">
            <strong>Answer Type:</strong> 2
          </div>
          <div className="col-md-6 col-12 mb-3">
            <strong>Answer:</strong> Dummy Answer
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
  
  export default AnswerView;
  