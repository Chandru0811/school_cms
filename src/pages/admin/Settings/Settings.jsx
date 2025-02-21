import { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import School from "../School/School";
import Role from "../Role/Role";
import RolePermission from "./RolePermission";
import { Link } from "react-router-dom";

function Settings() {
  const [key, setKey] = useState("role");

  return (
    <div className="container-fluid mb-4 m-0 px-0">
      {" "}
      <ol
        className="breadcrumb my-3 text-sm d-flex align-items-center"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        <li>
          <Link to="/" className="custom-breadcrumb text-sm">
            Home
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active text-sm" aria-current="page">
          &nbsp;Settings
        </li>
      </ol>
      <div className="card">
        {/* <div className="d-flex justify-content-between align-items-center card_header mb-3 p-1">
          <div className="d-flex align-items-center">
            <div className="d-flex">
              <div className="dot active"></div>
            </div>
            <span className="me-2 text-muted text-sm">
              <span className="database_name">Settings</span>
            </span>
          </div>
        </div> */}
        <div className="container-fuild">
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3 ms-2"
          >
            {/* <Tab eventKey="school" title="School">
              <School />
            </Tab> */}
            <Tab eventKey="role" title="Role">
              <Role />
            </Tab>
            <Tab eventKey="role_permission" title="Role Permission">
              <RolePermission />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default Settings;
