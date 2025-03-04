import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import api from "../../../config/URL";
import toast from "react-hot-toast";

function Question() {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const storedScreens = JSON.parse(localStorage.getItem("schoolCMS_Permissions") || "{}");
  const [loading, setLoading] = useState(true);


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
        accessorKey: "id",
        header: "",
        enableHiding: false,
        enableSorting: false,
        size: 20,
        Cell: ({ cell }) => (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setMenuAnchor(e.currentTarget);
              setSelectedId(cell.getValue());
            }}
          >
            <MoreVertIcon />
          </IconButton>
        ),
      },
      { accessorKey: "question", header: "Question" },
      { 
        accessorKey: "ques_type", 
        header: "Question Type",
        Cell: ({ cell }) => JSON.parse(cell.getValue() || "[]").join(", ") 
      },
      { accessorKey: "difficult_level", header: "Difficult Level" },
      { accessorKey: "topic.name", header: "Topic" },
      { 
        accessorKey: "centers", 
        header: "Centre Name",
        Cell: ({ cell }) => cell.getValue()?.join(", ") || ""
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
          track: {
            backgroundColor: "#e0e0e0",
          },
          thumb: {
            color: "#eb862a",
          },
          switchBase: {
            "&.Mui-checked": {
              color: "#eb862a",
            },
            "&.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#eb862a",
            },
          },
        },
      },
    },
  });

  const getData = async () => {
    try {
      setLoading(true);
      const response = await api.get("questions");
      setData(response.data.data);
    } catch (e) {
      toast.error("Error Fetching Data", e?.response?.data?.error);
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleMenuClose = () => setMenuAnchor(null);

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
          &nbsp;Question
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
              <span className="database_name">Question</span>
            </span>
          </div>
          {storedScreens?.data[6]?.can_create ===1&& (
          <Link to="/question/add">
            <button
              type="button"
              className="btn btn-button btn-sm me-2"
              style={{ fontWeight: "600px !important" }}
            >
              &nbsp; Add &nbsp;&nbsp; <i className="bi bi-plus-lg"></i>
            </button>
          </Link>
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
                  id:!(storedScreens?.data?.[6]?.can_edit === 0 && storedScreens?.data?.[6]?.can_delete === 0),
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
                storedScreens?.data[6]?.can_view ===1 
                  ? {
                      onClick: () =>
                        navigate(`/question/view/${row.original.id}`),
                      style: { cursor: "pointer" },
                    }
                  : {}
              }
            />
          </ThemeProvider>
          <Menu
            id="action-menu"
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
          {storedScreens?.data[6]?.can_edit === 1 && (
            <MenuItem onClick={() => navigate(`/question/edit/${selectedId}`)}>
              Edit
            </MenuItem>
          )}
          {storedScreens?.data[6]?.can_delete === 1 && (
            <MenuItem>
            <Delete
                  path={`question/delete/${selectedId}`}
                  onDeleteSuccess={getData}
                  onOpen={handleMenuClose}
                />
              {/* <Delete path={`/question/delete/${selectedId}`} onOpen={handleMenuClose} /> */}
            </MenuItem>)}
          </Menu>
        </>
      )}
      </div>
    </div>
  );
}

Question.propTypes = {
  row: PropTypes.func.isRequired,
  cell: PropTypes.func.isRequired,
};

export default Question;
