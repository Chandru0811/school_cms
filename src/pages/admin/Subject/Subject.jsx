import { useEffect, useMemo, useState } from "react";
import { ThemeProvider, createTheme, Menu, MenuItem, IconButton } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import SubjectAdd from "./SubjectAdd";
import SubjectEdit from "./SubjectEdit";
import SubjectView from "./SubjectView";


const Subject = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);
//   const [selectedId, setSelectedId] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setData([
        { id: 1,grade_id: "1", name: "GMTTV Hrs Sec School", description: "Mint" },
        { id: 2,grade_id: "2", name: "ST. Thomas Girls Hrs School", description: "Chennai" },
        { id: 3,grade_id: "3", name: "Govt Boys Hrs School", description: "Dubai" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const columns = useMemo(
    () => [
      { accessorFn: (row, index) => index + 1, header: "S.NO", size: 40 },
      {
        accessorKey: "id",
        header: "Actions",
        Cell: () => (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setMenuAnchor(e.currentTarget);
            //   setSelectedId(cell.getValue());
            }}
          >
            <MoreVertIcon />
          </IconButton>
        ),
      },
      { accessorKey: "grade_id", header: "Grade ID" },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "description", header: "Description" },
    ],
    []
  );

  const theme = createTheme();

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  return (
    <div className="container-fluid my-4 center">
      <div className="card vh-100 p-3">
        <div className="d-flex justify-content-end mb-3 px-2">
          <SubjectAdd />
        </div>
        {loading ? (
          <div className="loader-container text-center">Loading...</div>
        ) : (
          <ThemeProvider theme={theme}>
            <MaterialReactTable
              columns={columns}
              data={data}
              enableColumnActions={false}
              enableColumnFilters={false}
              enableDensityToggle={false}
              enableFullScreenToggle={false}
              initialState={{
                columnVisibility: {
                  createdBy: false,
                  createdAt: false,
                  updatedBy: false,
                  updatedAt: false,
                },
              }}
            />
          </ThemeProvider>
        )}

        <Menu
          id="action-menu"
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              setShowEdit(true);
              handleMenuClose();
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              setShowView(true);
              handleMenuClose();
            }}
          >
            View
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
        </Menu>

        <SubjectEdit show={showEdit} setShow={setShowEdit}/>
        <SubjectView show={showView} setShow={setShowView}/>
      </div>
    </div>
  );
};

export default Subject;
