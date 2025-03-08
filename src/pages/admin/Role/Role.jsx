import { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import {
  ThemeProvider,
  createTheme,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import Delete from "../../../components/common/Delete";
import PropTypes from "prop-types";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import RoleAdd from "./RoleAdd";
import RoleEdit from "./RoleEdit";
import RoleView from "./RoleView";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { GoTrash } from "react-icons/go";
import { TbEdit } from "react-icons/tb";
import DeleteChange from "../../../components/common/DeleteChange";

function Role() {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };
  const columns = useMemo(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "S.NO",
        enableSorting: true,
        enableHiding: false,
        size: 40,
        cell: ({ cell }) => (
          <span style={{ textAlign: "center" }}>{cell.getValue()}</span>
        ),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        enableSorting: false,
        Cell: ({ row }) => (
          <div className="actions-column">
            {/* {storedScreens?.data[3]?.can_edit === 1 && ( */}
            <button
              className="btn edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/reward/edit/${row.original.id}`);
              }}
            >
              <TbEdit style={{ color: "#4F46E5", fontSize: "16px" }} />
            </button>
            {/* )} */}
            {/* {storedScreens?.data[3]?.can_delete === 1 && ( */}
            <button
              className="btn delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(row.original.id);
              }}
            >
              <GoTrash style={{ color: "#FB3748", fontSize: "16px" }} />
            </button>
            {/* )} */}
          </div>
        ),
      },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "description", header: "Description" },
      {
        accessorKey: "centers",
        header: "Center",
        Cell: ({ cell }) => cell.getValue()?.join(", ") || "",
      },
      { accessorKey: "access", header: "Access" },
      {
        accessorKey: "created_by.name",
        header: "Created By",
        enableSorting: true,
        enableHiding: false,
        Cell: ({ cell }) => cell.getValue() || " ",
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        Cell: ({ cell }) => cell.getValue()?.substring(0, 10),
      },
      {
        accessorKey: "updated_by",
        header: "Updated By",
        Cell: ({ cell }) => cell.getValue() || "",
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

  const getData = async () => {
    setLoading(true);
    try {
      const response = await api.get("admin/roles");
      setData(response.data.data);
    } catch (e) {
      if (e?.response?.status === 403) {
        toast.error("Don't have access to this page");
      } else {
        toast.error(e?.response?.data?.error);
        toast.error(e?.response?.data?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="container-fluid mb-4 px-0">
      <div className="d-flex justify-content-between align-items-center p-2 my-2">
        <div className="d-flex align-items-center">
          <span className="mx-3 table-heading">
            Settings -&nbsp;
            <span className="table-subheading">List of Settings</span>
          </span>
        </div>
        <RoleAdd onSuccess={getData} />
      </div>
      <div className="table-container my-2">
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <>
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
                    fontSize: "13px",
                    fontWeight: 500,
                    fontFamily: "Urbanist",
                    textAlign: "center",
                  },
                }}
                muiTableBodyRowProps={({ row }) => ({
                  style: { cursor: "pointer" },
                  onClick: () => {
                    setSelectedId(row.original.id);
                    setShowView(true);
                  },
                  sx: {
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-in-out",
                    "&:hover": { backgroundColor: "#EAE9FC" },
                    "&.Mui-selected": { backgroundColor: "#EAE9FC !important" },
                  },
                })}
              />
            </ThemeProvider>
            <RoleEdit
              show={showEdit}
              setShow={setShowEdit}
              id={selectedId}
              onSuccess={getData}
            />
            <RoleView show={showView} setShow={setShowView} id={selectedId} />
          </>
        )}

        {deleteModalOpen && selectedId && (
          <DeleteChange
            path={`role/delete/${selectedId}`}
            onDeleteSuccess={() => {
              getData();
              setDeleteModalOpen(false);
            }}
            onOpen={() => setDeleteModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

Role.propTypes = {
  row: PropTypes.func.isRequired,
  cell: PropTypes.func.isRequired,
};

export default Role;
