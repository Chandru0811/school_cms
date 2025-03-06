import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { MaterialReactTable } from "material-react-table";
import { IconButton, ThemeProvider, createTheme } from "@mui/material";
import api from "../../../config/URL";
import PropTypes from "prop-types";
import AddTopic from "./AddTopic";

function SubjectView() {
  const [data, setData] = useState({});
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);
  const [showAddTopic, setShowAddTopic] = useState(false);

  const getSubjectData = async () => {
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
    getSubjectData();
  }, [id]);

  return (
    <div className="container-fluid px-0 vh-100 mb-4">
      <ol
        className="breadcrumb my-2 px-2 d-flex align-items-center"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        <li>
          <Link to="/" className="custom-breadcrumb text-sm">
            Home
          </Link>
          <span className="breadcrumb-separator text-sm"> &gt; </span>
        </li>
        <li>
          <Link to="/subject" className="custom-breadcrumb text-sm">
            &nbsp;Subject
          </Link>
          <span className="breadcrumb-separator text-sm"> &gt; </span>
        </li>
        <li className="breadcrumb-item active text-sm" aria-current="page">
          &nbsp;Subject View
        </li>
      </ol>
      <div className="card" style={{ border: "1px solid #dbd9d0" }}>
        <div className="d-flex px-4 justify-content-between align-items-center card_header p-1 mb-4">
          <div className="d-flex align-items-center">
            <div className="d-flex">
              <div className="dot active"></div>
            </div>
            <span className="me-2 text-muted text-sm">View Subject</span>
          </div>
          <div className="my-2 pe-3 d-flex align-items-center">
            <Link to="/subject">
              <button type="button " className="btn btn-sm btn-back">
                Back
              </button>
            </Link>
          </div>
        </div>
        <>
          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="container-fluid px-4 mb-5">
              <div className="row pb-3">
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="fw-medium text-sm">Centre</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {truncateText(data?.subject?.center_id)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="fw-medium text-sm">Grade</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {truncateText(data?.subject?.grade_id)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="fw-medium text-sm">Name</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {truncateText(data?.subject?.name)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="fw-medium text-sm">Description</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {truncateText(data?.subject?.description)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
                <AddTopic
                  show={showAddTopic}
                  setShow={setShowAddTopic}
                  id={selectedId}
                />
              <ThemeProvider theme={theme}>
                <MaterialReactTable
                  columns={columns}
                  data={data.topics || []}
                  enableColumnActions={false}
                  enableColumnFilters={false}
                  enableDensityToggle={false}
                  enableFullScreenToggle={false}
                  // muiTableBodyRowProps={({ row }) => ({
                  //   onClick: () => navigate(`/topic/view/${row.original.id}`),
                  //   style: { cursor: "pointer" },
                  // })}
                />
              </ThemeProvider>
            </div>
          )}
        </>
      </div>
    </div>
  );
}

SubjectView.propTypes = {
  row: PropTypes.func.isRequired,
  cell: PropTypes.func.isRequired,
};

export default SubjectView;