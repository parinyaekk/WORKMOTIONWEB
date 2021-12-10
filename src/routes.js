import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";
import { Layout_Login } from "./layouts/Layout_Login";

// Route Views
import BlogOverview from "./views/BlogOverview";
// import UserProfileLite from "./views/UserProfileLite";
// import AddNewPost from "./views/AddNewPost";
// import Errors from "./views/Errors";
//import ComponentsOverview from "./views/ComponentsOverview";
import Tables from "./views/Tables";
import Content from "./views/Content";
import WarrantyList from "./views/WarrantyList";
// import FromWarranty from "./views/FromWarranty";
//import Login from "./views/AddContent";
//import BlogPosts from "./views/BlogPosts";
import Test from "./views/Test";
import TestFile from "./views/TestFile";
import Login from "./views/Login";
import Customer from "./views/Customer";
import TestLang from "./views/TestLang";
import Product from "./views/Product";
import Menu from "./views/Menu";
import ContentHead from "./views/ContentHead";
import ContentDetail from "./views/ContentDetail";
import AddContent from "./views/AddContent";
import Sparepart from "./views/Sparepart";
// import Installation from "./views/Installation";
import ServiceInformation from "./views/ServiceInformation";
import CalendarWork from "./views/CalendarWork";
import CustomerRegister from "./views/CustomerRegister";
import CustomerIgnore from "./views/CustomerIgnore";
import ModelSparepart from "./views/ModelSparepart";
import ModelInstallation from "./views/ModelInstallation";
import ClassifiedSparepart from "./views/ClassifiedSparepart";
import ClassifiedInstallation from "./views/ClassifiedInstallation";
import CustomerRenew from "./views/CustomerRenew";
import Employee from "./views/Employee";
import Permission from "./views/Permission";
import Complacence from "./views/Complacence";
import SettingSendMail from "./views/SettingSendMail";

export default [
  
  {
    path: "/",
    exact: true,
    layout: Layout_Login,
    component: () => <Redirect to="/Login" />
  },
  {
    path: "/tables",
    layout: DefaultLayout,
    component: Tables
  },
  // {
  //   path: "/FromWarranty",
  //   layout: DefaultLayout,
  //   component: FromWarranty
  // },
  {
    path: "/content",
    layout: DefaultLayout,
    component: Content
  },
  {
    path: "/dashboard",
    layout: DefaultLayout,
    component: BlogOverview
  },
  {
    path: "/customer",
    layout: DefaultLayout,
    component: Customer
  },
  {
    path: "/testlang",
    layout: DefaultLayout,
    component: TestLang
  },
  {
    path: "/product",
    layout: DefaultLayout,
    component: Product
  },
  {
    path: "/menu",
    layout: DefaultLayout,
    component: Menu
  },
  {
    path: "/contenthead",
    layout: DefaultLayout,
    component: ContentHead
  },
  {
    path: "/contentdetail",
    layout: DefaultLayout,
    component: ContentDetail
  },
  {
    path: "/sparepart",
    layout: DefaultLayout,
    component: Sparepart
  },
  // {
  //   path: "/installation",
  //   layout: DefaultLayout,
  //   component: Installation
  // },
  {
    path: "/serviceinformation",
    layout: DefaultLayout,
    component: ServiceInformation
  },
  {
    path: "/calendarwork",
    layout: DefaultLayout,
    component: CalendarWork
  },
  {
    path: "/customerregister",
    layout: DefaultLayout,
    component: CustomerRegister
  },
  {
    path: "/CustomerIgnore",
    layout: DefaultLayout,
    component: CustomerIgnore
  },
  {
    path: "/modelsparepart",
    layout: DefaultLayout,
    component: ModelSparepart
  },
  {
    path: "/modelinstallation",
    layout: DefaultLayout,
    component: ModelInstallation
  },
  {
    path: "/classifiedsparepart",
    layout: DefaultLayout,
    component: ClassifiedSparepart
  },
  {
    path: "/classifiedinstallation",
    layout: DefaultLayout,
    component: ClassifiedInstallation
  },
  {
    path: "/customerrenew",
    layout: DefaultLayout,
    component: CustomerRenew
  },
  {
    path: "/employee",
    layout: DefaultLayout,
    component: Employee
  },
  {
    path: "/complacence",
    layout: DefaultLayout,
    component: Complacence
  },
  {
    path: "/permission",
    layout: DefaultLayout,
    component: Permission
  },
  {
    path: "/settingsendmail",
    layout: DefaultLayout,
    component: SettingSendMail
  },
  // {
  //   path: "/user-profile-lite",
  //   layout: DefaultLayout,
  //   component: UserProfileLite
  // },
  // {
  //   path: "/add-new-post",
  //   layout: DefaultLayout,
  //   component: AddNewPost
  // },
  // {
  //   path: "/errors",
  //   layout: DefaultLayout,
  //   component: Errors
  // },
  // {
  //   path: "/components-overview",
  //   layout: DefaultLayout,
  //   component: ComponentsOverview
  // }, 
  // {
  //   path: "/blog-posts",
  //   layout: DefaultLayout,
  //   component: BlogPosts
  // }
  {
    path: "/AddContent",
    layout: DefaultLayout,
    component: AddContent
  },
  {
    path: "/warranty",
    layout: DefaultLayout,
    component: WarrantyList
  },
  {
    path: "/Login",
    layout: Layout_Login,
    component: Login
  },
  {
    path: "/Test",
    layout: DefaultLayout,
    component: Test
  },
  {
    path: "/TestFile",
    layout: DefaultLayout,
    component: TestFile
  },
];
