import { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { Link } from "react-router-dom";

function Profile() {
  const [key, setKey] = useState("school");

  return (
    <div className="container-fluid mb-4 px-0">
      {" "}
      <ol
        className="breadcrumb my-3"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        <li>
          <Link to="/" className="custom-breadcrumb">
            Home
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          &nbsp;Settings
        </li>
      </ol>
      <div className="card">
        <div className="d-flex justify-content-between align-items-center card_header mb-3 p-1">
          <div className="d-flex align-items-center">
            <div className="d-flex">
              <div className="dot active"></div>
            </div>
            <span className="me-2 text-muted">
              <span className="database_name">Settings</span>
            </span>
          </div>
        </div>
        <div className="container-fuild">
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3 ms-2"
          >
            <Tab eventKey="school" title="School">
              {/* <School /> */}
              Test
            </Tab>
            <Tab eventKey="center" title="Center">
              {/* <Role /> */}
              Test
            </Tab>
            <Tab eventKey="grade" title="Grade">
              {/* <RolePermission /> */}
              Test
            </Tab>
            <Tab eventKey="subject" title="Subject">
              {/* <RolePermission /> */}
              Test
            </Tab>
            <Tab eventKey="topics" title="Topics">
              {/* <RolePermission /> */}
              Test
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default Profile;
