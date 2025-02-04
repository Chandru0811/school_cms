import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import TopicAdd from "./TopicAdd";
import TopicEdit from "./TopicEdit";
import TopicView from "./TopicView";

const Topic = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setData([
        {
          id: 1,
          subject_id: "1",
          name:"Algebra Basics",
          description: "Test",
        },
        {
          id: 2,
          subject_id: "2",
          name:"Basics Maths",
          description: "Test 2",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "S.NO",
        size: 40,
      },
      
      {
        accessorKey: "id",
        header: "Actions",
        Cell: () => (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setMenuAnchor(e.currentTarget);
              // setSelectedId(cell.getValue());
            }}
          >
            <MoreVertIcon />
          </IconButton>
        ),
      },
      {
        accessorKey: "subject_id",
        header: "Subject ID",
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "description",
        header: "Description",
      },
    ],
    []
  );

  const theme = createTheme({});

  const handleMenuClose = () => setMenuAnchor(null);

  return (
    <div className="container-fluid my-4 center">
      <div className="card vh-100">
        <div className="d-flex justify-content-end mb-3 px-2 py-3">
          <TopicAdd/>
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

              muiTableBodyRowProps={() => ({
                  onClick: () => navigate(`/studentView`),
                  style: { cursor: "pointer" },
                })}
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

        <TopicEdit show={showEdit} setShow={setShowEdit}/>
        <TopicView show={showView} setShow={setShowView}/>
      </div>
    </div>
  );
};

export default Topic;
