import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFullScreenButton,
} from "material-react-table";
import { ThemeProvider, createTheme, Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import api from "../../../config/URL";
import ImageURL from "../../../config/ImageURL";
import userImage from "../../../assets/images/user_image.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { TbEdit } from "react-icons/tb";
import { GoTrash } from "react-icons/go";
import { FaPlus } from "react-icons/fa";
import { MdOutlineCloudDownload } from "react-icons/md";
import { LuPrinter } from "react-icons/lu";
import { CiFilter } from "react-icons/ci";
import DeleteChange from "../../../components/common/DeleteChange";

function School() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();
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
            <button
              className="btn edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/school/edit/${row.original.id}`);
              }}
            >
              <TbEdit style={{ color: "#4F46E5", fontSize: "16px" }} />
            </button>
            <button
              className="btn delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(row.original.id);
              }}
            >
              <GoTrash style={{ color: "#FB3748", fontSize: "16px" }} />
            </button>
          </div>
        ),
      },
      {
        accessorKey: "name",
        enableHiding: false,
        Cell: ({ cell }) => (
          <span className="truncate-text" title={cell.getValue()}>
            {cell.getValue()}
          </span>
        ),
        header: "School Name",
      },
      {
        accessorKey: "users",
        header: "Admin Name",
        Cell: ({ row }) => {
          const admin = row.original.users?.[0];
          const imageUrl = admin?.avatar?.image
            ? `${ImageURL.replace(/\/$/, "")}/${admin.avatar.image.replace(
                /^\//,
                ""
              )}`
            : userImage;

          return admin ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img
                src={imageUrl}
                alt={admin.name}
                onError={(e) => {
                  console.error("Image failed to load:", imageUrl);
                  e.target.src = userImage;
                }}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <span>{admin.name}</span>
            </div>
          ) : (
            <span>No Admin</span>
          );
        },
      },
      {
        accessorFn: (row) => row.users?.[0]?.email,
        header: "Admin Email",
        enableHiding: false,
        size: 40,
      },
      {
        accessorKey: "active",
        header: "Status",
        Cell: ({ cell }) => (
          <span
            className={`badge ${
              cell.getValue() === 1 ? "bg-success" : "bg-warning"
            }`}
          >
            {cell.getValue() === 1 ? "Active" : "Inactive"}
          </span>
        ),
      },
      { accessorKey: "created_by", header: "Created By" },
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
        accessorKey: "updated_at",
        header: "Updated At",
        Cell: ({ cell }) => cell.getValue()?.substring(0, 10) || "",
      },
    ],
    []
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`superAdmin/schools`);
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
            School -&nbsp;
            <span className="table-subheading">List of School</span>
          </span>
        </div>
        <Link to="/school/add">
          <button type="button" className="btn btn-sm me-2 add-btn">
            <FaPlus fontSize={12} className="me-1" /> Add School
          </button>
        </Link>
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
                positionGlobalFilter="left"
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
                  onClick: () => navigate(`/school/view/${row.original.id}`),
                  style: { cursor: "pointer" },

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
          </>
        )}
        {deleteModalOpen && selectedId && (
          <DeleteChange
            path={`superAdmin/school/delete/${selectedId}`}
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

School.propTypes = {
  row: PropTypes.func.isRequired,
  cell: PropTypes.func.isRequired,
};

export default School;
