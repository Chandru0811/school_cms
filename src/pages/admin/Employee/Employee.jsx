import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import { ThemeProvider, createTheme, IconButton } from "@mui/material";
import DeleteChange from "../../../components/common/DeleteChange";
import toast from "react-hot-toast";
import api from "../../../config/URL";
import { FaPlus } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { GoTrash } from "react-icons/go";
import userImage from "../../../assets/images/user_image.png";

function Employee() {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };

  const storedScreens = JSON.parse(
    localStorage.getItem("schoolCMS_Permissions") || "{}"
  );

  const getData = async () => {
    try {
      setLoading(true);
      const response = await api.get("employees");
      setData(response.data.data);
    } catch (e) {
      toast.error("Error Fetching Data", e?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "S.NO",
        enableSorting: true,
        enableHiding: false,
        size: 50,
        Cell: ({ cell }) => (
          <span className="table-cell-center">{cell.getValue()}</span>
        ),
      },
      {
        accessorKey: "name",
        header: "Employee Name",
        Cell: ({ row }) => (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src={row.original.image || userImage}
              alt={row.original.name}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <span>{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "role.name",
        header: "Role",
        Cell: ({ cell }) => (
          <span
            className="badge"
            style={{ backgroundColor: "#1FC16B1A", color: "#1FC16B" }}
          >
            {cell.getValue()}
          </span>
        ),
      },
      {
        accessorKey: "contact",
        header: "Contact",
        Cell: ({ row }) => (
          <div>
            <div className="mb-1">+{row.original.mobile}</div>
            <div style={{ color: "#4F46E5" }}>{row.original.email}</div>
          </div>
        ),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        enableSorting: false,
        Cell: ({ row }) => (
          <div className="actions-column">
            {storedScreens?.data[1]?.can_edit === 1 && (
              <button
                className="btn edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/employee/edit/${row.original.id}`);
                }}
              >
                <TbEdit style={{ color: "#4F46E5", fontSize: "16px" }} />
              </button>
            )}
            {storedScreens?.data[1]?.can_delete === 1 && (
              <button
                className="btn delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(row.original.id);
                }}
              >
                <GoTrash style={{ color: "#FB3748", fontSize: "16px" }} />
              </button>
            )}
          </div>
        ),
      },
      {
        accessorKey: "created_by.name",
        header: "Created By",
        enableSorting: true,
        enableHiding: false,
        Cell: ({ cell }) => cell.getValue() || " ",
      },
      {
        accessorKey: "updated_by.name",
        header: "Updated By",
        enableSorting: true,
        enableHiding: false,
        Cell: ({ cell }) => cell.getValue() || " ",
      },
    ],
    []
  );

  const theme = createTheme({
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: "#EAE9FC",
            fontWeight: "700",
            fontSize: "14px",
            color: "#4F46E5",
            textAlign: "center",
            textTransform: "capitalize",
            borderRight: "1px solid #E0E0E0",
          },
          root: {
            "&:last-child": {
              borderRight: "none",
            },
          },
        },
      },
      MuiTableSortLabel: {
        styleOverrides: {
          root: {
            marginLeft: "8px",
            "& svg": {
              color: "#4F46E5 !important",
            },
          },
        },
      },
    },
  });

  return (
    <div className="container-fluid mb-4 px-0 ">
      <div className="d-flex justify-content-between align-items-center p-2 my-2">
        <div className="d-flex align-items-center">
          <span className="mx-3 table-heading">
            Employees -&nbsp;
            <span className="table-subheading">List of Employees</span>
          </span>
        </div>
        {storedScreens?.data[1]?.can_create === 1 && (
          <Link to="/employee/add">
            <button
              type="button"
              className="btn btn-button btn-sm me-2 add-btn"
            >
              <FaPlus fontSize={12} className="me-1" /> Add Employee
            </button>
          </Link>
        )}
      </div>

      <div className="table-container my-2">
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
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
                  id: !(
                    storedScreens?.data?.[1]?.can_edit === 0 &&
                    storedScreens?.data?.[1]?.can_delete === 0
                  ),
                  working_hrs: false,
                  citizenship: false,
                  nationality: false,
                  created_by: false,
                  created_at: false,
                  updated_by: false,
                  updated_at: false,
                },
              }}
              muiTableHeadCellProps={{
                sx: {
                  backgroundColor: "#fff",
                  color: "#4F46E5 !important",
                  fontSize: "16px",
                  fontWeight: 500,
                  fontFamily: "Urbanist",
                  textAlign: "center",
                },
              }}
              muiTableBodyRowProps={({ row }) => ({
                onClick: () => navigate(`/employee/view/${row.original.id}`),
                sx: {
                  cursor: "pointer",
                  transition: "background-color 0.2s ease-in-out",
                  "&:hover": { backgroundColor: "#EAE9FC" },
                  "&.Mui-selected": { backgroundColor: "#EAE9FC !important" },
                },
              })}
            />
          </ThemeProvider>
        )}
      </div>

      {deleteModalOpen && selectedId && (
        <DeleteChange
          path={`employee/delete/${selectedId}`}
          onDeleteSuccess={() => {
            getData();
            setDeleteModalOpen(false);
          }}
          onOpen={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Employee;
