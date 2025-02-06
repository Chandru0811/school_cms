import { Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";


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
        <div className="col-md-6 col-12">
          <div className="row mt-3  mb-2">
            <div className="col-6 ">
              <p className="">Question ID</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">:</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="row mt-3  mb-2">
            <div className="col-6 ">
              <p className="">Answer Type</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">:</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="row mt-3  mb-2">
            <div className="col-6 ">
              <p className="">Answer</p>
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
        <button className="btn btn-sm btn-back bg-light text-dark" onClick={handleClose}>
          Back
        </button>
      </DialogActions>
        </Dialog>
    );
  }
  
  export default AnswerView;
  