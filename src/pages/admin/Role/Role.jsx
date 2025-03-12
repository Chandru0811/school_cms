import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFullScreenButton,
} from "material-react-table";
import { LuPrinter } from "react-icons/lu";
import { MdOutlineCloudDownload } from "react-icons/md";
import { CiFilter } from "react-icons/ci";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ThemeProvider, Tooltip, createTheme } from "@mui/material";
import PropTypes from "prop-types";
import RoleAdd from "./RoleAdd";
import RoleEdit from "./RoleEdit";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { GoTrash } from "react-icons/go";
import DeleteChange from "../../../components/common/DeleteChange";

function Role() {
  const [selectedId, setSelectedId] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };
  const handleExportRows = (rows) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save("mrt-pdf-example.pdf");
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
              className="edit-btn"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <RoleEdit id={row.original.id} onSuccess={getData} />
            </button>
            {/* )}  */}
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
            border: "1px solid #E0E0E0",
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
            color: "#4F46E5 !important", // Default color
            "&:hover": {
              color: "#3B3BBF !important", // Hover color
            },
            "&.Mui-active": {
              color: "#2C2C9D !important", // Active (sorted) color
            },
            "& .MuiTableSortLabel-icon": {
              color: "#4F46E5 !important", // Sort icon color
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
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "500px" }}
          >
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <ThemeProvider theme={theme}>
              <MaterialReactTable
                columns={columns}
                data={data}
                enableColumnActions={false}
                enableDensityToggle={false}
                enableColumnFilters={true}
                enableFullScreenToggle={true}
                initialState={{
                  pagination: { pageSize: 50, pageIndex: 0 },
                  showGlobalFilter: true,
                  showColumnFilters: false,
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
                    // setShowView(true);
                  },
                  sx: {
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-in-out",
                    "&:hover": { backgroundColor: "#EAE9FC" },
                    "&.Mui-selected": { backgroundColor: "#EAE9FC !important" },
                  },
                })}
                renderTopToolbar={({ table }) => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "15px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <MRT_GlobalFilterTextField
                        table={table}
                        placeholder="Search..."
                        className="custom-global-filter"
                      />
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <MRT_ToggleFullScreenButton
                        table={table}
                        style={{ color: "#4F46E5" }}
                      />
                      <Tooltip title="Download Data">
                        <span>
                          <MdOutlineCloudDownload
                            size={20}
                            color="#4F46E5"
                            className="mt-3 m-2"
                            disabled={table.getRowModel().rows.length === 0}
                            onClick={() =>
                              handleExportRows(table.getRowModel().rows)
                            }
                          />
                        </span>
                      </Tooltip>
                      <Tooltip title="Print">
                        <span>
                          <LuPrinter
                            size={20}
                            color="#4F46E5"
                            className="mt-3 m-2"
                            onClick={() => window.print()}
                          />
                        </span>
                      </Tooltip>

                      <MRT_ShowHideColumnsButton
                        table={table}
                        style={{ color: "#4F46E5" }}
                      />
                      <Tooltip title="Toggle Filters">
                        <span>
                          <CiFilter
                            size={20}
                            color="#4F46E5"
                            className="mt-3 m-2 cursor-pointer"
                            onClick={() => {
                              table.setShowColumnFilters((prev) => !prev);
                            }}
                          />
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                )}
              />
            </ThemeProvider>

            {/* <RoleView show={showView} setShow={setShowView} id={selectedId} /> */}
          </>
        )}

        {deleteModalOpen && selectedId && (
          <DeleteChange
            path={`admin/role/delete/${selectedId}`}
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
