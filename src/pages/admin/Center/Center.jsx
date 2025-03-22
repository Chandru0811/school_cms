import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFullScreenButton,
} from "material-react-table";
import { ThemeProvider, Tooltip, createTheme } from "@mui/material";
import PropTypes from "prop-types";
import CenterAdd from "./CenterAdd";
import api from "../../../config/URL";
import { GoTrash } from "react-icons/go";
import CenterEdit from "./CenterEdit";
import DeleteChange from "../../../components/common/DeleteChange";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CiFilter } from "react-icons/ci";
import { LuPrinter } from "react-icons/lu";
import { MdOutlineCloudDownload } from "react-icons/md";

function Center() {
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const storedScreens = JSON.parse(
    localStorage.getItem("schoolCMS_Permissions") || "{}"
  );
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
      { accessorKey: "name", header: "Name" },
      {
        accessorKey: "actions",
        header: "Actions",
        enableSorting: false,
        Cell: ({ row }) => (
          <div className="actions-column">
            {storedScreens?.data[0]?.can_edit === 1 && (
              <button
                className="btn edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <CenterEdit onSuccess={fetchData} id={row.original.id} />
              </button>
            )}
            {storedScreens?.data[0]?.can_delete === 1 && (
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
      // { accessorKey: "school_id", header: "School ID" },
      {
        accessorKey: "location",
        header: "Location",
        Cell: ({ cell }) => (
          <span className="truncate-text" title={cell.getValue()}>
            {cell.getValue()}
          </span>
        ),
      },
      {
        accessorKey: "created_by",
        header: "Created By",
        Cell: ({ row }) => row.original.created_by?.name || " ",
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`centers`);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  return (
    <div className="container-fluid mb-4 px-0">
      <div className="d-flex justify-content-between align-items-center p-2 my-2">
        <div className="d-flex align-items-center">
          <span className="mx-3 table-heading">
            Centre -&nbsp;
            <span className="table-subheading">List of Centre</span>
          </span>
        </div>
        {storedScreens?.data[0]?.can_create === 1 && (
          <CenterAdd onSuccess={fetchData} />
        )}
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
                    id: !(
                      storedScreens?.data?.[0]?.can_edit === 0 &&
                      storedScreens?.data?.[0]?.can_delete === 0
                    ),
                    working_hrs: false,
                    citizenship: false,
                    nationality: false,
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
                muiTableBodyRowProps={() => ({
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
                    {/* Full Screen Button */}
                    <MRT_ToggleFullScreenButton
                      table={table}
                      sx={{
                        backgroundColor: "#FCFCFC",
                        borderRadius: "5px",
                        color: "#4F46E5",
                        padding: "6px",
                      }}
                    />

                    {/* Download Data Button */}
                    <Tooltip title="Download Data">
                      <span
                        style={{
                          backgroundColor: "#FCFCFC",
                          borderRadius: "5px",
                          padding: "6px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F0F0F0")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FCFCFC")}
                      >
                        <MdOutlineCloudDownload
                          size={20}
                          color="#4F46E5"
                          disabled={table.getRowModel().rows.length === 0}
                          onClick={() => handleExportRows(table.getRowModel().rows)}
                        />
                      </span>
                    </Tooltip>

                    {/* Print Button */}
                    <Tooltip title="Print">
                      <span
                        style={{
                          backgroundColor: "#FCFCFC",
                          borderRadius: "5px",
                          padding: "6px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F0F0F0")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FCFCFC")}
                      >
                        <LuPrinter
                          size={20}
                          color="#4F46E5"
                          onClick={() => window.print()}
                        />
                      </span>
                    </Tooltip>

                    {/* Show/Hide Columns Button */}
                    <MRT_ShowHideColumnsButton
                      table={table}
                      sx={{
                        backgroundColor: "#FCFCFC",
                        borderRadius: "5px",
                        color: "#4F46E5",
                        padding: "6px",
                      }}
                    />

                    {/* Toggle Filters Button */}
                    <Tooltip title="Toggle Filters">
                      <span
                        style={{
                          backgroundColor: "#FCFCFC",
                          borderRadius: "5px",
                          padding: "6px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F0F0F0")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FCFCFC")}
                        onClick={() => {
                          table.setShowColumnFilters((prev) => !prev);
                        }}
                      >
                        <CiFilter
                          size={20}
                          color="#4F46E5"
                        />
                      </span>
                    </Tooltip>
                  </div>
                  </div>
                )}
              />
            </ThemeProvider>
          </>
        )}
        {deleteModalOpen && selectedId && (
          <DeleteChange
            path={`center/delete/${selectedId}`}
            onDeleteSuccess={() => {
              fetchData();
              setDeleteModalOpen(false);
            }}
            onOpen={() => setDeleteModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

Center.propTypes = {
  row: PropTypes.func.isRequired,
  cell: PropTypes.func.isRequired,
};

export default Center;
