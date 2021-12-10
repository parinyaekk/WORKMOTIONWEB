import React from "react";
import { Nav } from "shards-react";
//import NavbarLang from "./NavbarLang";
import Notifications from "./Notifications";
import UserActions from "./UserActions";

export default () => (
  <Nav navbar className="border-left flex-row">
    {/* <NavbarLang /> */}
    {/* <Notifications /> */}
    <UserActions />
  </Nav>
);
