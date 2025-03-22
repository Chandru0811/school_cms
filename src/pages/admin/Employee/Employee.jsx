/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import DeleteChange from "../../../components/common/DeleteChange";
import toast from "react-hot-toast";
import api from "../../../config/URL";
import { FaPlus } from "react-icons/fa";
import { TbArrowDown, TbSearch, TbArrowsSort, TbEdit } from "react-icons/tb";
import { GoTrash } from "react-icons/go";
import userImage from "../../../assets/images/user_profile.svg";
import ImageURL from "../../../config/ImageURL";

function Employee() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

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
  useEffect(() => {
    const tableInput = document.getElementsByClassName("css-12tjcea-MuiInputBase-input-MuiOutlinedInput-input")[0]; // Access the first element
    const inputCloseBtn = document.getElementsByClassName("css-elo8k2-MuiInputAdornment-root")[0]; // Access the first element

    console.log("tableInput", tableInput);
    console.log("inputCloseBtn", inputCloseBtn);

    const handleInputChange = () => {
      if (tableInput && inputCloseBtn) {
        if (tableInput.value.length > 0) {
          inputCloseBtn.style.display = "block"; // Show the close button
        } else {
          inputCloseBtn.style.display = "none"; // Hide the close button
        }
      }
    };

    // Add an event listener to the input field
    if (tableInput) {
      tableInput.addEventListener("input", handleInputChange);
    }

    // Cleanup the event listener on unmount
    return () => {
      if (tableInput) {
        tableInput.removeEventListener("input", handleInputChange);
      }
    };
  }, [document.getElementsByClassName("css-12tjcea-MuiInputBase-input-MuiOutlinedInput-input")[0]]); // Empty dependency array ensures this runs only once on mount

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
        Cell: ({ row }) => {
          const imageUrl = row.original.avatar?.image
            ? `${ImageURL.replace(
              /\/$/,
              ""
            )}/${row.original.avatar.image.replace(/^\//, "")}`
            : userImage;
          return (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img
                src={imageUrl}
                alt={row.original.name}
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
              <span>{row.original.name}</span>
            </div>
          );
        },
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
            <div className="mb-1">{row.original.mobile}</div>
            <div style={{ color: "#4F46E5" }}>{row.original.email}</div>
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
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "500px" }}
          >
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <ThemeProvider theme={theme}>
            <MaterialReactTable
              columns={columns}
              data={data}
              // icons={{
              //   ArrowDownwardIcon: (props) => <TbArrowsSort {...props} size={20} color="#4F46E5" />,
              //   SortIcon: (props) => <TbEdit {...props} size={20} color="#4F46E5" />,
              // }}
              displayColumnDefOptions={{
                'mrt-row-actions': {
                  size: 80,
                  grow: false,
                },
              }}
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
