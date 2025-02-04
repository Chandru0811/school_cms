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

const Student = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setData([
        {
          id: 1,
          center_list: "SUB001",
          student_first_name: "Sumaiya",
          student_last_name: "Bee",
          email: "sumaiya@gmail.com",
          admission_no : 12,
          createdBy: "Admin",
          createdAt: "2024-01-01",
          updatedAt: "2024-02-01",
          updatedBy: "Moderator",
        },
        {
          id: 2,
          center_list: "SUB001",
          student_first_name: "Sumaiya",
          student_last_name: "Bee",
          email: "sumaiya@gmail.com",
          admission_no : 12,
          createdBy: "Admin",
          createdAt: "2024-01-01",
          updatedAt: "2024-02-01",
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
        accessorKey: "center_list",
        header: "Center List",
      },
      {
        accessorKey: "student_first_name",
        header: "Student Name",
      },
      {
        accessorKey: "student_last_name",
        header: "Last Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "admission_no",
        header: "Admission Number",
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
        <div className="d-flex justify-content-end mb-3 px-2 py-3">
          <Link to="/studentAdd">
            <button type="button" className="btn btn-primary btn-sm me-2">
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
          <MenuItem onClick={() => navigate(`/studentEdit`)}>
            Edit
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Student;
