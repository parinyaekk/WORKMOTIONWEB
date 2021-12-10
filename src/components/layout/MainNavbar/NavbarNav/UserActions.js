import React from "react";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  NavItem,
  NavLink
} from "shards-react";
//
import { translate } from 'react-i18next';

export default class UserActions extends React.Component {

  async componentWillMount() {
    await this.setStateDefault();
  }

  async setStateDefault() {
    this.setState({full_name: localStorage.getItem('full_name') });
    this.forceUpdate();
}

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      full_name: null
    };

    this.toggleUserActions = this.toggleUserActions.bind(this);
  }

  RemovelocalStorage(){
    localStorage.removeItem("id");
    localStorage.removeItem("full_name");
    localStorage.removeItem("User_Group");
    localStorage.removeItem("CountNumber");
  }

  toggleUserActions() {
    this.setState({
      visible: !this.state.visible
    });
  }

  render() {
    return (
      <NavItem tag={Dropdown} caret toggle={this.toggleUserActions}>
        <DropdownToggle caret tag={NavLink} className="text-nowrap px-3">
          <img
            className="user-avatar rounded-circle mr-2"
            src={require("./../../../../images/avatars/Avatar.png")}
            alt="User Avatar"
          />{" "}
          <span className="d-none d-md-inline-block">{this.state.full_name}</span>
        </DropdownToggle>
        <Collapse tag={DropdownMenu} right small open={this.state.visible}>
          {/* <DropdownItem tag={Link} to="user-profile">
            <i className="material-icons">&#xE7FD;</i> Profile
          </DropdownItem>
          <DropdownItem tag={Link} to="edit-user-profile">
            <i className="material-icons">&#xE8B8;</i> Edit Profile
          </DropdownItem>
          <DropdownItem tag={Link} to="file-manager-list">
            <i className="material-icons">&#xE2C7;</i> Files
          </DropdownItem>
          <DropdownItem tag={Link} to="transaction-history">
            <i className="material-icons">&#xE896;</i> Transactions
          </DropdownItem>
          <DropdownItem divider /> */}
          <DropdownItem tag={Link} to="/" className="text-danger" onClick={() => this.RemovelocalStorage()}>
            <i className="material-icons text-danger">&#xE879;</i> Logout
          </DropdownItem>
        </Collapse>
      </NavItem>
    );
  }
};



// function Logout() {
//   window.location.href = "/login";
// }

// const UserActions = ({ t }) => (
//   <div className="text-nowrap px-3" style={{ marginTop: '3%' }}>
//     <img
//       className="user-avatar rounded-circle mr-2"
//       src={require("./../../../../images/avatars/Avatar.png")}
//       alt="User Avatar"
//     />{" "}
//     <span className="d-none d-md-inline-block">{t('Admin')}</span>
//       &nbsp;&nbsp;&nbsp;&nbsp;
//     <button className="btn btn-danger" onClick={Logout}>Logout </button>
//   </div>
// );

// export default translate()(UserActions);