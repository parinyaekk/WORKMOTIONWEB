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
  // <div>
  //   <li className="nav-item dropdown no-caret mr-3 d-md-none">
  //     <a className="btn btn-icon btn-transparent-dark dropdown-toggle" id="searchDropdown" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i data-feather="search"></i></a>

  //     <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--fade-in-up" aria-labelledby="searchDropdown">
  //         <form className="form-inline mr-auto w-100">
  //             <div className="input-group input-group-joined input-group-solid">
  //                 <input className="form-control" type="text" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" />
  //                 <div className="input-group-append">
  //                     <div className="input-group-text"><i data-feather="search"></i></div>
  //                 </div>
  //             </div>
  //         </form>
  //     </div>
  //   </li>
  // </div>
  <Form className="main-navbar__search w-100 d-none d-md-flex d-lg-flex">
    <InputGroup seamless className="ml-3">
      <InputGroupAddon type="prepend">
        {/* <InputGroupText>
          <i className="material-icons">search</i>
        </InputGroupText> */}
      </InputGroupAddon>
      {/* <FormInput
        className="navbar-search"
        placeholder={t('Search')}
      /> */}
    </InputGroup>
  </Form>
);

export default translate()(NavbarSearch);