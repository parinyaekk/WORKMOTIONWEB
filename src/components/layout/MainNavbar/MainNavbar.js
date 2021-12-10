import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Container, Navbar } from "shards-react";

import NavbarSearch from "./NavbarSearch";
import NavbarNav from "./NavbarNav/NavbarNav";
import NavbarToggle from "./NavbarToggle";
// import NewNavbar from "./NewNavbar";
import { Activity, BarChart, FileText, LogOut, Menu, Search, Settings, UserPlus, Code, Book, Bell, Mail } from 'react-feather';

const MainNavbar = ({ layout, stickyTop }) => {
  const classes = classNames(
    "main-navbar",
    "bg-white",
    stickyTop && "sticky-top"
  );

  return (
       <div className={classes}>
            <Container className="p-0">
                <Navbar type="light" className="align-items-stretch flex-md-nowrap p-0">
                <NavbarSearch />
                <NavbarNav />
                <NavbarToggle />
                </Navbar>
            </Container>
        </div>
        // <nav class="topnav navbar navbar-expand shadow navbar-light bg-white" id="sidenavAccordion">
        //     <a class="navbar-brand" href="#">SB Admin Pro</a>
        //     <button class="btn btn-icon btn-transparent-dark order-1 order-lg-0 mr-lg-2" id="sidebarToggle" href="#"><Menu /></button>
        //     <ul class="navbar-nav align-items-center ml-auto">
        //         <li class="nav-item dropdown no-caret mr-2 dropdown-user">
        //             <a class="btn btn-icon btn-transparent-dark dropdown-toggle" id="navbarDropdownUserImage" href="javascript:void(0);" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img class="img-fluid" src="https://source.unsplash.com/QAB-WJcbgJk/60x60" /></a>
        //             <div class="dropdown-menu dropdown-menu-right border-0 shadow animated--fade-in-up" aria-labelledby="navbarDropdownUserImage">
        //                 <h6 class="dropdown-header d-flex align-items-center">
        //                     <img class="dropdown-user-img" src="https://source.unsplash.com/QAB-WJcbgJk/60x60" />
        //                     <div class="dropdown-user-details">
        //                         <div class="dropdown-user-details-name">Valerie Luna</div>
        //                         <div class="dropdown-user-details-email">vluna@aol.com</div>
        //                     </div>
        //                 </h6>
        //                 <div class="dropdown-divider"></div>
        //                 <a class="dropdown-item" href="#!">
        //                     <div class="dropdown-item-icon"><Settings /></div>
        //                     Account
        //                 </a>
        //                 <a class="dropdown-item" href="/">
        //                     <div class="dropdown-item-icon"><LogOut /></div>
        //                     Logout
        //                 </a>
        //             </div>
        //         </li>
        //     </ul>
        // </nav>
  );
};

MainNavbar.propTypes = {
  /**
   * The layout type where the MainNavbar is used.
   */
  layout: PropTypes.string,
  /**
   * Whether the main navbar is sticky to the top, or not.
   */
  stickyTop: PropTypes.bool
};

MainNavbar.defaultProps = {
  stickyTop: true
};

export default MainNavbar;
