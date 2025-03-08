import { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material";
import PropTypes from "prop-types";
import SubjectAdd from "./SubjectAdd";
import SubjectEdit from "./SubjectEdit";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import AddTopic from "../../admin/Subject/AddTopic";
import { GoTrash } from "react-icons/go";
import DeleteChange from "../../../components/common/DeleteChange";
import { useNavigate } from "react-router-dom";

function Subject() {
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const storedScreens = JSON.parse(
    localStorage.getItem("schoolCMS_Permissions") || "{}"
  );

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
            <button
              className="btn edit-btn"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <AddTopic id={selectedId} onSuccess={getData} />
            </button>
            {storedScreens?.data[4]?.can_edit === 1 && (
              <button
                className="btn edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <SubjectEdit onSuccess={getData} id={row.original.id} />
              </button>
            )}
            {storedScreens?.data[4]?.can_delete === 1 && (
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
      { accessorKey: "name", header: "Name" },
      {
        accessorKey: "centers",
        header: "Center Name",
        Cell: ({ cell }) => cell.getValue()?.join(", ") || "",
      },
      { accessorKey: "grade.name", header: "Grade" },
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
    try {
      setLoading(true);
      const response = await api.get("subjects");
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

  return (
    <div className="container-fluid mb-4 px-0">
      <div className="d-flex justify-content-between align-items-center p-2 my-2">
        <div className="d-flex align-items-center">
          <span className="mx-3 table-heading">
            Subject -&nbsp;
            <span className="table-subheading">List of Subject</span>
          </span>
        </div>
        {storedScreens?.data[4]?.can_create === 1 && (
          <SubjectAdd onSuccess={getData} />
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
                      storedScreens?.data?.[4]?.can_edit === 0 &&
                      storedScreens?.data?.[4]?.can_delete === 0
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
                  sx: {
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-in-out",
                    "&:hover": { backgroundColor: "#EAE9FC" },
                    "&.Mui-selected": { backgroundColor: "#EAE9FC !important" },
                  },
                  ...(storedScreens?.data?.[5]?.can_view === 1
                    ? {
                        style: { cursor: "pointer" },
                        onClick: () => {
                          setSelectedId(row.original.id);
                          navigate(`/subject/view/${row.original.id}`);
                        },
                      }
                    : {}),
                })}
              />
            </ThemeProvider>
            {deleteModalOpen && selectedId && (
              <DeleteChange
                path={`subjects/delete/${selectedId}`}
                onDeleteSuccess={() => {
                  getData();
                  setDeleteModalOpen(false);
                }}
                onOpen={() => setDeleteModalOpen(false)}
              />
            )}
            {/* <SubjectView
              show={showView}
              setShow={setShowView}
              id={selectedId}
            /> */}

            {/* <AddTopic
              show={showAddTopic}
              setShow={setShowAddTopic}
              id={selectedId}
              onSuccess={getData}
            /> */}
          </>
        )}
      </div>
    </div>
  );
}

Subject.propTypes = {
  row: PropTypes.func.isRequired,
  cell: PropTypes.func.isRequired,
};

export default Subject;
