import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

import MainNavbar from "../components/layout/MainNavbar/MainNavbar";
import MainSidebar from "../components/layout/MainSidebar/MainSidebar";
import MainFooter from "../components/layout/MainFooter";

const LayoutClean = ({ children, noSidebar, noNavbar, noFooter }) => (
    <Row>
      {!noSidebar && <MainSidebar />}
      <Col
        className="main-content p-0 bg-primary"
        lg={{ size: 12 }}
        md={{ size: 12 }}
        sm="12"
        tag="main"
      >
        {!noNavbar && <MainNavbar />}
        {children}
        {!noFooter && <MainFooter />}
      </Col>
    </Row>
);

LayoutClean.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noSidebar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool
};

LayoutClean.defaultProps = {
  noNavbar: true,
  noSidebar: true,
  noFooter: true
};

export default LayoutClean;
