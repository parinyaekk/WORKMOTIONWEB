import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";
import { Layout_Login } from "./layouts/Layout_Login";

import Login from "./views/Login";
import Banner from "./views/Banner";
import StartUp from "./views/StartUp";
import Fund from "./views/Fund";
import Partnership from "./views/Partnership";
import News from "./views/News";
import Team from "./views/Team";
import ContactDetail from "./views/ContactDetail";
import SEO_Banner from "./views/SEO_Banner";
import SEO_Portfolio from "./views/SEO_Portfolio";
import SEO_Team from "./views/SEO_Team";
import SEO_News from "./views/SEO_News";
import SEO_ContactUs from "./views/SEO_ContactUs";
import Information from "./views/Information";
import LogSuccess from "./views/LogSuccess";
import LogException from "./views/LogException";
import Industries from "./views/Industries";
import Categories from "./views/Categories";
import StartUpOption from "./views/StartUpOption";
import HDYH from "./views/HDYH";

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
    path: "/StartUp",
    layout: DefaultLayout,
    component: StartUp
  },
  {
    path: "/Fund",
    layout: DefaultLayout,
    component: Fund
  },
  {
    path: "/Partnership",
    layout: DefaultLayout,
    component: Partnership
  },
  {
    path: "/News",
    layout: DefaultLayout,
    component: News
  },
  {
    path: "/Team",
    layout: DefaultLayout,
    component: Team
  },
  {
    path: "/ContactDetail",
    layout: DefaultLayout,
    component: ContactDetail
  },
  {
    path: "/SEO_Banner",
    layout: DefaultLayout,
    component: SEO_Banner
  },  
  {
    path: "/SEO_Portfolio",
    layout: DefaultLayout,
    component: SEO_Portfolio
  },  
  {
    path: "/SEO_Team",
    layout: DefaultLayout,
    component: SEO_Team
  },  
  {
    path: "/SEO_News",
    layout: DefaultLayout,
    component: SEO_News
  },  
  {
    path: "/SEO_ContactUs",
    layout: DefaultLayout,
    component: SEO_ContactUs
  },  
  {
    path: "/Information",
    layout: DefaultLayout,
    component: Information
  },  
  {
    path: "/LogSuccess",
    layout: DefaultLayout,
    component: LogSuccess
  },  
  {
    path: "/LogException",
    layout: DefaultLayout,
    component: LogException
  },  
  {
    path: "/Industries",
    layout: DefaultLayout,
    component: Industries
  },  
  {
    path: "/Categories",
    layout: DefaultLayout,
    component: Categories
  },  
  {
    path: "/StartUpOption",
    layout: DefaultLayout,
    component: StartUpOption
  },  
  {
    path: "/HDYH",
    layout: DefaultLayout,
    component: HDYH
  },  
];
