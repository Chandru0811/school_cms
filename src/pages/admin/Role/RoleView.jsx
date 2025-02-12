import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
function RoleView({ show, setShow }) {
  const handleClose = () => {
    setShow(false);
  };

  const data = {
    centre_id: "SRDK",
    name: "Abi",
    description: "Maths",
    access: "Limited",
  };

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>View Role</DialogTitle>
      <hr className="m-0"></hr>
      <DialogContent>
        <div className="row">
          <div className="col-md-6 col-12 my-2">
            <div className="row">
              <div className="col-6">
                <p className="fw-medium text-sm">Centre</p>
              </div>
              <div className="col-6">
                <p className="text-muted text-sm">: {data.centre_id}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-12 my-2">
            <div className="row">
              <div className="col-6">
                <p className="fw-medium text-sm">Name</p>
              </div>
              <div className="col-6">
                <p className="text-muted text-sm">: {data.name}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-12 my-2">
            <div className="row">
              <div className="col-6">
                <p className="fw-medium text-sm">Description</p>
              </div>
              <div className="col-6">
                <p className="text-muted text-sm">: {data.description}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-12 my-2">
            <div className="row">
              <div className="col-6">
                <p className="fw-medium text-sm">Access</p>
              </div>
              <div className="col-6">
                <p className="text-muted text-sm">: {data.access}</p>
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

export default RoleView;
