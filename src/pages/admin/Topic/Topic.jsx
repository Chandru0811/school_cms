// Updated code for Topic Management
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
import TopicAdd from "./TopicAdd";
import TopicEdit from "./TopicEdit";
import TopicView from "./TopicView";
import api from "../../../config/URL";
import toast from "react-hot-toast";

function Topic() {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [data, setData] = useState([]);
  const storedScreens = JSON.parse(
    localStorage.getItem("schoolCMS_Permissions") || "{}"
  );
  const [loading, setLoading] = useState(true);

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
        accessorKey: "id",
        header: "",
        enableSorting: true,
        enableHiding: false,
        size: 20,
        Cell: ({ row }) => (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setMenuAnchor(e.currentTarget);
              setSelectedId(row.original.id);
            }}
          >
            <MoreVertIcon />
          </IconButton>
        ),
      },
      {
        accessorKey: "centers",
        enableSorting: true,
        enableHiding: false,
        header: "Centre Name",
        Cell: ({ cell }) => cell.getValue()?.join(", ") || "",
      },
      {
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: "subject.name",
        header: "Subject Name",
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
      MuiSwitch: {
        styleOverrides: {
          root: {
            "&.Mui-disabled .MuiSwitch-track": {
              backgroundColor: "#f5e1d0",
              opacity: 1,
            },
            "&.Mui-disabled .MuiSwitch-thumb": {
              color: "#eb862a",
            },
          },
          track: { backgroundColor: "#e0e0e0" },
          thumb: { color: "#eb862a" },
          switchBase: {
            "&.Mui-checked": { color: "#eb862a" },
            "&.Mui-checked + .MuiSwitch-track": { backgroundColor: "#eb862a" },
          },
        },
      },
    },
  });

  const handleMenuClose = () => setMenuAnchor(null);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await api.get("topics");
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

  return (
    <div className="container-fluid mb-4 px-0">
      <ol
        className="breadcrumb my-3 d-flex align-items-center"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        <li>
          <Link to="/" className="custom-breadcrumb text-sm">
            Home
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active text-sm" aria-current="page">
          &nbsp;Topic
        </li>
      </ol>
      <div className="card">
        <div className="d-flex justify-content-between align-items-center card_header p-2">
          <div className="d-flex align-items-center">
            <div className="d-flex">
              <div className="dot active"></div>
            </div>
            <span className="me-2 text-muted text-sm">
              This database shows the list of&nbsp;
              <span className="database_name">Topic</span>
            </span>
          </div>
          {storedScreens?.data[5]?.can_create === 1 && (
            <TopicAdd onSuccess={getData} />
          )}
        </div>
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
                    id:!(storedScreens?.data?.[5]?.can_edit === 0 && storedScreens?.data?.[5]?.can_delete === 0),
                    working_hrs: false,
                    citizenship: false,
                    nationality: false,
                    created_by: false,
                    created_at: false,
                    updated_by: false,
                    updated_at: false,
                  },
                }}
                muiTableBodyRowProps={({ row }) =>
                  storedScreens?.data[5]?.can_view === 1
                    ? {
                        style: { cursor: "pointer" },
                        onClick: () => {
                          setSelectedId(row.original.id);
                          setShowView(true);
                        },
                      }
                    : {}
                }
              />
            </ThemeProvider>
          </>
        )}
        <Menu
          id="action-menu"
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          {storedScreens?.data[5]?.can_edit === 1 && (
            <MenuItem
              onClick={() => {
                setShowEdit(true);
                handleMenuClose();
              }}
            >
              Edit
            </MenuItem>
          )}
          {storedScreens?.data[5]?.can_delete === 1 && (
            <MenuItem>
              <Delete
                path={`topic/delete/${selectedId}`}
                onDeleteSuccess={getData}
                onOpen={handleMenuClose}
              />
            </MenuItem>
          )}
        </Menu>
        <TopicEdit
          show={showEdit}
          setShow={setShowEdit}
          id={selectedId}
          onSuccess={getData}
        />
        <TopicView show={showView} setShow={setShowView} id={selectedId} />
      </div>
    </div>
  );
}

Topic.propTypes = {
  row: PropTypes.func.isRequired,
  cell: PropTypes.func.isRequired,
};

export default Topic;
