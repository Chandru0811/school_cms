import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material";
import PropTypes from "prop-types";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { GoTrash } from "react-icons/go";
import DeleteChange from "../../../components/common/DeleteChange";
import { TbEdit } from "react-icons/tb";
import { FaPlus } from "react-icons/fa";

function Subscriptions() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const storedScreens = JSON.parse(
    localStorage.getItem("schoolCMS_Permissions") || "{}"
  );
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await api.get("subscriptions");
      setData(response.data.data);
    } catch (e) {
      toast.error("Error Fetching Data ", e?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
            {storedScreens?.data[13]?.can_edit === 1 && (
              <button
                className="btn edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/subscription/edit/${row.original.id}`);
                }}
              >
                <TbEdit style={{ color: "#4F46E5", fontSize: "16px" }} />
              </button>
            )}
            {storedScreens?.data[13]?.can_delete === 1 && (
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
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: "price",
        header: "Price",
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: "duration",
        header: "Duration",
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: "description",
        header: "Description",
        enableSorting: true,
        enableHiding: false,
      },
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

  return (
    <div className="container-fluid mb-4 px-0">
      <div className="d-flex justify-content-between align-items-center p-2 my-2">
        <div className="d-flex align-items-center">
          <span className="mx-3 table-heading">
            Subscription -&nbsp;
            <span className="table-subheading">List of Subscriptions</span>
          </span>
        </div>
        {storedScreens?.data[13]?.can_create === 1 && (
          <Link to="/subscription/add">
            <button type="button" className="btn btn-sm me-2 add-btn">
              <FaPlus fontSize={12} className="me-1" /> Add Subscription
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
                    id: !(
                      storedScreens?.data?.[3]?.can_edit === 0 &&
                      storedScreens?.data?.[3]?.can_delete === 0
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
                    fontSize: "13px",
                    fontWeight: 500,
                    fontFamily: "Urbanist",
                    textAlign: "center",
                  },
                }}
                muiTableBodyRowProps={({ row }) => ({
                  ...(storedScreens?.data?.[3]?.can_view === 1
                    ? {
                        onClick: () =>
                          navigate(`/subscription/view/${row.original.id}`),
                        style: { cursor: "pointer" },
                      }
                    : {}),
                  sx: {
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-in-out",
                    "&:hover": { backgroundColor: "#EAE9FC" },
                    "&.Mui-selected": { backgroundColor: "#EAE9FC !important" },
                  },
                })}
              />
            </ThemeProvider>
          </>
        )}
      </div>
      {deleteModalOpen && selectedId && (
        <DeleteChange
          path={`subscription/delete/${selectedId}`}
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

Subscriptions.propTypes = {
  row: PropTypes.func.isRequired,
  cell: PropTypes.func.isRequired,
};

export default Subscriptions;
