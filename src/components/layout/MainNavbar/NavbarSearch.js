import React from "react";
import {
  Form,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormInput
} from "shards-react";
import { translate } from 'react-i18next';

const NavbarSearch = ({ t }) => (
  <Form className="main-navbar__search w-100 d-none d-md-flex d-lg-flex">
    <InputGroup seamless className="ml-3">
      <InputGroupAddon type="prepend">
      </InputGroupAddon>
    </InputGroup>
  </Form>
);

export default translate()(NavbarSearch);