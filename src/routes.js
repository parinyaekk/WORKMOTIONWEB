import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";
import { Layout_Login } from "./layouts/Layout_Login";

import Login from "./views/Login";
import Banner from "./views/Banner";
import Test from "./views/Test";

export default [
  
  {
    path: "/",
    exact: true,
    layout: Layout_Login,
    component: () => <Redirect to="/Login" />
  },
  {
    path: "/Login",
    layout: Layout_Login,
    component: Login
  },
  {
    path: "/Banner",
    layout: DefaultLayout,
    component: Banner
  },
  {
    path: "/Test",
    layout: DefaultLayout,
    component: Test
  },
];
