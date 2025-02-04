import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";

const Topic = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setData([
        {
          id: 1,
          subject_id: "SUB001",
          name: "Mathematics",
          description: "Basic Algebra and Geometry",
          createdBy: "Admin",
          createdAt: "2024-01-01",
          updatedAt: "2024-02-01",
          updatedBy: "Moderator",
        },
        {
          id: 2,
          subject_id: "SUB002",
          name: "Science",
          description: "Physics and Chemistry",
          createdBy: "Admin",
          createdAt: "2024-01-05",
          updatedAt: "2024-02-10",
          updatedBy: "Moderator",
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
        accessorKey: "subject_id",
        header: "Subject Id",
      },
      {
        accessorKey: "name",
        header: "Topic Name",
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "createdBy",
        header: "Created By",
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
      },
      {
        accessorKey: "updatedBy",
        header: "Updated By",
      },
      {
        accessorKey: "id",
        header: "Actions",
        Cell: ({ cell }) => (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setMenuAnchor(e.currentTarget);
              setSelectedId(cell.getValue());
            }}
          >
            <MoreVertIcon />
          </IconButton>
        ),
      },
    ],
    []
  );

  const theme = createTheme({});

  const handleMenuClose = () => setMenuAnchor(null);

  return (
    <div className="container-fluid my-4 center">
      <div className="card vh-100">
        <div className="d-flex justify-content-end mb-3 px-2">
          <Link to="/topic/add">
            <button type="button" className="btn btn-button btn-sm me-2">
              &nbsp; Add &nbsp;&nbsp; <i className="bx bx-plus"></i>
            </button>
          </Link>
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
          <MenuItem onClick={() => navigate(`/course/edit/${selectedId}`)}>
            Edit
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Topic;
