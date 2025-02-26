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
import CenterAdd from "./CenterAdd";
import CenterEdit from "./CenterEdit";
import CenterView from "./CenterView";
import api from "../../../config/URL";

function Center() {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [showView, setShowView] = useState(false);
  const [data, setData] = useState([]);
  const storedScreens = JSON.parse(
    localStorage.getItem("schoolCMS_Permissions") || "{}"
  );

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
      // { accessorKey: "school_id", header: "School ID" },
      { accessorKey: "name", header: "Name" },
      {
        accessorKey: "location",
        header: "Location",
        Cell: ({ cell }) => (
          <span className="truncate-text" title={cell.getValue()}>
            {cell.getValue()}
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
  useEffect(() => {
    if (storedScreens?.data[0]?.can_edit === 0 && storedScreens?.data[0]?.can_delete === 0) {
      const targetTds = document.querySelectorAll('td[data-index="1"],th[data-index="1"]'); 
      targetTds.forEach(td => {
        td.textContent = "";
      });
    }
  }, [storedScreens]);

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

  const handleMenuClose = () => setMenuAnchor(null);

  return (
    <div className="container-fluid mb-4 px-0">
      <ol
        className="breadcrumb my-2 d-flex align-items-center"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        <li>
          <Link to="/" className="custom-breadcrumb text-sm">
            Home
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active text-sm" aria-current="page">
          &nbsp;Centre
        </li>
      </ol>
      <div className="card">
        <div className="d-flex justify-content-between align-items-center card_header p-1 py-2 mb-3">
          <div className="d-flex align-items-center">
            <div className="d-flex">
              <div className="dot active"></div>
            </div>
            <span className="me-2 text-muted text-sm">
              This database shows the list of&nbsp;
              <span className="database_name">Centre</span>
            </span>
          </div>
          {storedScreens?.data[0]?.can_create === 1 && (
            <CenterAdd onSuccess={fetchData} />
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
                    working_hrs: false,
                    citizenship: false,
                    nationality: false,
                    created_by: false,
                    created_at: false,
                    updated_by: false,
                    updated_at: false,
                  },
                }}
                muiTableBodyRowProps={({ row }) => ({
                  style: { cursor: "pointer" },
                  onClick: () => {
                    setSelectedId(row.original.id);
                    setShowView(true);
                  },
                })}
              />
            </ThemeProvider>
            
            <Menu
              id="action-menu"
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
            >
              {storedScreens?.data[0]?.can_edit === 1 && (
                <MenuItem>
                  <CenterEdit
                    onSuccess={fetchData}
                    id={selectedId}
                    handleMenuClose={handleMenuClose}
                  />
                </MenuItem>
              )}
            {storedScreens?.data[0]?.can_delete === 1 && (  <MenuItem>
                <Delete
                  path={`/center/delete/${selectedId}`}
                  onDeleteSuccess={fetchData}
                  onOpen={handleMenuClose}
                />
              </MenuItem>)}
            </Menu>
            {storedScreens?.data[0]?.can_view === 1 && (
              <CenterView
                show={showView}
                setShow={setShowView}
                id={selectedId}
              />
            )}
          </>
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
