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
import { ThemeProvider, createTheme } from "@mui/material";
import PropTypes from "prop-types";
import AvatarProfileAdd from "./AvatarProfileAdd";
import api from "../../../config/URL";
import ImageURL from "../../../config/ImageURL";
import { GoTrash } from "react-icons/go";
import userImage from "../../../assets/images/user_profile.svg";
import AvatarProfileEdit from "./AvatarProfileEdit";
import DeleteChange from "../../../components/common/DeleteChange";
import { useNavigate } from "react-router-dom";
import AvatarProfileView from "./AvatarProfileView";

function AvatarProfile() {
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [data, setData] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);
  const storedScreens = JSON.parse(
    localStorage.getItem("schoolCMS_Permissions") || "{}"
  );
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
        Cell: ({ row }) => (
          <span style={{ textAlign: "center" }}>{row.index + 1}</span>
        ),
      },
      {
        accessorKey: "image",
        header: "Avatar",
        enableSorting: false,
        enableHiding: false,
        Cell: ({ cell }) => {
          const imagePath = cell.getValue();
          const imageUrl = imagePath ? `${ImageURL}${imagePath}` : userImage;

          return (
            <img
              src={imageUrl}
              alt="Avatar"
              style={{ width: 50, height: 50, borderRadius: "50%" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = userImage;
              }}
            />
          );
        },
      },
      { accessorKey: "name", header: "Name" },
      {
        accessorKey: "actions",
        header: "Actions",
        enableSorting: false,
        Cell: ({ row }) => {
          const { id, default_male, default_female } = row.original;

          return (
            <div className="actions-column">
              {storedScreens?.data[0]?.can_edit === 1 && (
                <button
                  className="btn edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <AvatarProfileEdit onSuccess={fetchData} id={id} />
                </button>
              )}
              {storedScreens?.data[0]?.can_delete === 1 &&
                default_male === 0 &&
                default_female === 0 && (
                  <button
                    className="btn delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(id);
                    }}
                  >
                    <GoTrash style={{ color: "#FB3748", fontSize: "16px" }} />
                  </button>
                )}
            </div>
          );
        },
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
      const response = await api.get(`admin/avatars`);
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
            Avatar -&nbsp;
            <span className="table-subheading">List of Avatar</span>
          </span>
        </div>
        {storedScreens?.data[0]?.can_create === 1 && (
          <AvatarProfileAdd onSuccess={fetchData} />
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
                  showGlobalFilter: true,
                  pagination: { pageSize: 50, pageIndex: 0 },
                  showColumnFilters: false,
                  columnVisibility: {
                    id: !(
                      storedScreens?.data?.[0]?.can_edit === 0 &&
                      storedScreens?.data?.[0]?.can_delete === 0
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
                // muiTableBodyRowProps={() => ({
                //   sx: {
                //     cursor: "pointer",
                //     transition: "background-color 0.2s ease-in-out",
                //     "&:hover": { backgroundColor: "#EAE9FC" },
                //     "&.Mui-selected": { backgroundColor: "#EAE9FC !important" },
                //   },
                // })}
                muiTableBodyRowProps={({ row }) => ({
                  onClick: () => {
                    setSelectedAvatarId(row.original.id);
                    setViewModalOpen(true);
                  },
                  style: { cursor: "pointer" },
                })}
                renderTopToolbar={({ table }) => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px",
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
                      <MdOutlineCloudDownload
                        size={20}
                        color="#4F46E5"
                        className="mt-3 m-2 "
                        disabled={table.getRowModel().rows.length === 0}
                        onClick={() =>
                          handleExportRows(table.getRowModel().rows)
                        }
                      />
                      <LuPrinter
                        size={20}
                        color="#4F46E5"
                        className="mt-3 m-2"
                        onClick={() => window.print()}
                      />

                      <MRT_ShowHideColumnsButton
                        table={table}
                        style={{ color: "#4F46E5" }}
                      />
                      <CiFilter
                        size={20}
                        color="#4F46E5"
                        className="mt-3 m-2 cursor-pointer"
                        onClick={() => {
                          table.setShowColumnFilters((prev) => !prev);
                        }}
                      />
                    </div>
                  </div>
                )}
              />
            </ThemeProvider>
          </>
        )}
        {deleteModalOpen && selectedId && (
          <DeleteChange
            path={`admin/avatar/delete/${selectedId}`}
            onDeleteSuccess={() => {
              fetchData();
              setDeleteModalOpen(false);
            }}
            onOpen={() => setDeleteModalOpen(false)}
          />
        )}
        {viewModalOpen && selectedAvatarId && (
          <AvatarProfileView
            show={viewModalOpen}
            setShow={setViewModalOpen}
            id={selectedAvatarId}
          />
        )}
      </div>
    </div>
  );
}

AvatarProfile.propTypes = {
  row: PropTypes.func.isRequired,
  cell: PropTypes.func.isRequired,
};

export default AvatarProfile;
