import { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import School from "../School/School";
import Role from "../Role/Role";
import RolePermission from "./RolePermission";

function ControlledTabsExample() {
  const [key, setKey] = useState("home");

  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-3"
    >
      <Tab eventKey="school" title="School">
        <School />
      </Tab>
      <Tab eventKey="role" title="Role">
        <Role />
      </Tab>
      <Tab eventKey="role_permission" title="Role Permission">
        <RolePermission />
        {/* Test */}
      </Tab>
    </Tabs>
  );
}

export default ControlledTabsExample;
