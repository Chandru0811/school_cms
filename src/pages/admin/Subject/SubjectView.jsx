import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { MaterialReactTable } from "material-react-table";
import {
  IconButton,
  Menu,
  MenuItem,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import api from "../../../config/URL";
import PropTypes from "prop-types";
import TopicEdit from "../Topic/TopicEdit";
import TopicView from "../Topic/TopicView";
import TopicAdd from "../Topic/TopicAdd";
import SubjectEdit from "./SubjectEdit";
import { GoTrash } from "react-icons/go";
import { MdKeyboardArrowLeft } from "react-icons/md";
import DeleteChange from "../../../components/common/DeleteChange";

function SubjectView() {
  const [showView, setShowView] = useState(false);
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const storedScreens = JSON.parse(
    localStorage.getItem("schoolCMS_Permissions") || "{}"
  );

  const getData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`subject/${id}`);
      setData(response.data.data);
    } catch (e) {
      toast.error("Error Fetching Data ", e?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const theme = createTheme({
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            color: "#535454 !important",
            backgroundColor: "#e6edf7 !important",
            fontWeight: "400 !important",
            fontSize: "13px !important",
            textAlign: "center !important",
          },
        },
      },
    },
  });

  const columns = useMemo(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "S.NO",
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
            {storedScreens?.data[5]?.can_edit === 1 && (
              <button
                className="btn edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <TopicEdit id={row.original.id} onSuccess={getData} />
              </button>
            )}
            {storedScreens?.data[5]?.can_delete === 1 && (
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
        header: "Topic Name",
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: "description",
        header: "Description",
        Cell: ({ cell }) => (
          <span className="truncate-text" title={cell.getValue()}>
            {cell.getValue()}
          </span>
        ),
      },
      {
        accessorKey: "grade.name",
        header: "Grade",
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: "subject.name",
        header: "Subject",
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: "created_by.name",
        header: "Created By",
        enableSorting: true,
        enableHiding: false,
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
      },
      {
        accessorKey: "updated_at",
        header: "Updated At",
        Cell: ({ cell }) => cell.getValue()?.substring(0, 10) || "",
      },
    ],
    []
  );

  const truncateText = (text, length = 30) =>
    text?.length > length ? text.substring(0, length) + "..." : text;

  useEffect(() => {
    getData();
  }, [id]);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };

  return (
    <div className="container-fluid px-0 vh-100 mb-4">
      <div className="d-flex px-4 justify-content-between align-items-center  p-1 mb-4">
        <div className="d-flex align-items-center">
          <div>
            <Link to="/subject">
              <button type="button " className="btn btn-sm add-btn">
                <MdKeyboardArrowLeft size={20} />
              </button>
            </Link>
            &nbsp;&nbsp;
          </div>
          <span className="mx-3 table-heading">
            Subject Details -&nbsp;
            <span className="table-subheading">
              Details of Selected Subject
            </span>
          </span>
        </div>
        <div className="my-2 d-flex align-items-center">
          {storedScreens?.data[4]?.can_delete === 1 && (
            <button
              className="btn view-delete-btn"
              onClick={() => {
                handleDeleteClick(id);
              }}
            >
              <GoTrash className="trash-icon" /> &nbsp;&nbsp; Delete Subject
            </button>
          )}
        </div>
      </div>
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
        <div
          className="mx-4 card vh-100"
          style={{ border: "1px solid #dbd9d0" }}
        >
          <div
            className="card-header d-flex justify-content-between"
            style={{ marginBottom: "1px solid #F4F4F4" }}
          >
            <p className="view-header">Subject Info</p>
            {storedScreens?.data[4]?.can_edit === 1 && (
              <button
                className="btn edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <SubjectEdit onSuccess={getData} id={id} />
              </button>
            )}
          </div>
          <>
            <div className="container-fluid px-4 mb-5">
              <div className="row pb-3">
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="view-label-text">Centre</p>
                    </div>
                    <div className="col-6">
                      <p className="view-value">
                        {JSON.parse(data?.subject?.center_names)?.[0]}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="view-label-text">Grade</p>
                    </div>
                    <div className="col-6">
                      <p className="view-value">{data?.subject?.grand_name}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="view-label-text">Name</p>
                    </div>
                    <div className="col-6">
                      <p className="view-value">
                        {truncateText(data?.subject?.name)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="view-label-text">Description</p>
                    </div>
                    <div className="col-6">
                      <p className="view-value">
                        {truncateText(data?.subject?.description)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end me-2">
                {storedScreens?.data[5]?.can_create === 1 && (
                  <TopicAdd
                    show={showAddTopic}
                    setShow={setShowAddTopic}
                    id={id}
                    onSuccess={getData}
                  />
                )}
              </div>
              <ThemeProvider theme={theme}>
                <MaterialReactTable
                  columns={columns}
                  data={data.topics || []}
                  enableColumnActions={false}
                  enableColumnFilters={false}
                  enableDensityToggle={false}
                  enableFullScreenToggle={false}
                  initialState={{
                    pagination: { pageSize: 50, pageIndex: 0 },
                    columnVisibility: {
                      id: !(
                        storedScreens?.data?.[5]?.can_edit === 0 &&
                        storedScreens?.data?.[5]?.can_delete === 0
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
                      "&.Mui-selected": {
                        backgroundColor: "#EAE9FC !important",
                      },
                    },
                    ...(storedScreens?.data?.[5]?.can_view === 1
                      ? {
                          style: { cursor: "pointer" },
                          onClick: () => {
                            setSelectedId(row.original.id);
                            setShowView(true);
                          },
                        }
                      : {}),
                  })}

                  // muiTableBodyRowProps={({ row }) => ({
                  //   onClick: () => navigate(`/topic/view/${row.original.id}`),
                  //   style: { cursor: "pointer" },
                  // })}
                />
              </ThemeProvider>

              <TopicView
                show={showView}
                setShow={setShowView}
                id={selectedId}
              />
            </div>
          </>
        </div>
      )}
      {deleteModalOpen && selectedId && (
        <DeleteChange
          path={`subject/delete/${selectedId}`}
          onDeleteSuccess={() => {
            getData();
            setDeleteModalOpen(false);
            navigate("/subject");
          }}
          onOpen={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}

SubjectView.propTypes = {
  row: PropTypes.func.isRequired,
  cell: PropTypes.func.isRequired,
};

export default SubjectView;
