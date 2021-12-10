import React from "react";
import { Nav } from "shards-react";
import axios from "axios";
import SidebarNavItem from "./SidebarNavItem";
import { Store } from "../../../flux";

class SidebarNavItems extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ListData: [],
      navItems: Store.getSidebarItems(),
      User_Group: localStorage.getItem("User_Group"),
      APIUrl: global.config.variable.Url,
    };
    this.onChange = this.onChange.bind(this);
    // this.GetDataPermission = this.GetDataPermission.bind(this);
  }

  async componentWillMount() {
    //console.log(this.state.APIUrl);
    await this.GetDataPermission();
    await Store.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    Store.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({
      ...this.state,
      navItems: Store.getSidebarItems()
    });
  }
  
  async GetDataPermission() {
    await axios
       .post(`${this.state.APIUrl}Permission/GetDataPermission`)
      // .post(`${"https://localhost:44373/api/"}Permission/GetDataPermission`)
      //.post(`${"http://www.mostactive.info/"}Permission/GetDataPermission`)
      .then(response => {
        if (response.data.status == 0) {
          var Temp = [];
          Array.prototype.forEach.call(response.data.data, function (index) {
            var data = {
              id: index.id,
              user_group: index.user_group,
              menu_name: index.menu_name,
              fk_Menu_ID: index.fk_Menu_ID,
              permission: index.permission,
              active: index.is_Active
            };
            Temp.push(data);
          });
          this.setState({ ListData: Temp });
          let User_Group = localStorage.getItem("User_Group");
          let id = localStorage.getItem("id");
          let TempMenu = this.state.navItems;
          let TempMenu2 = [
            {
              title: 'Warranty',
            }
          ];
          this.setState({ navItems: [] });
          TempMenu[0]["items"] = [];
          let TempTopic = TempMenu[0]["items"];
          let TempPush = [];
          let TempPermission = Temp.filter(x => x.user_group == User_Group);
          
          if(TempPermission.filter(x => (x.menu_name == "Manage Menu".toLowerCase() || x.menu_name == "Manage Content".toLowerCase() ) && x.permission != "-").length > 0){
            TempTopic.push({
                      title: 'Interface',
                      htmlBefore: '<i class="material-icons">desktop_windows</i>',
                      open: false,
                      items: [],
                      });

            let TempSubTopic = TempMenu[0]["items"][TempTopic.length - 1]["items"];


            if(TempPermission.filter(x => x.menu_name == "Manage Menu".toLowerCase() && x.permission != "-").length > 0){
              TempSubTopic.push({
                      title: 'Manage Menu',
                      to: '/menu',
                    });
            }
            if(TempPermission.filter(x => x.menu_name == "Manage Content".toLowerCase() && x.permission != "-").length > 0){
              TempSubTopic.push({
                      title: 'Manage Content',
                      to: '/content',
                    });
            }
          }
          
          if(TempPermission.filter(x => (x.menu_name == "Manage Warranty Registration".toLowerCase() || x.menu_name == "Manage Warranty Product".toLowerCase() ) && x.permission != "-").length > 0){
            TempTopic.push({
                      title: "Warranty",
                      htmlBefore: '<i class="material-icons">av_timer</i>',
                      open: false,
                      items: [],
                      });

            let TempSubTopic = TempMenu[0]["items"][TempTopic.length - 1]["items"];


            if(TempPermission.filter(x => x.menu_name == "Manage Warranty Registration".toLowerCase() && x.permission != "-").length > 0){
              TempSubTopic.push({
                      title: 'Manage Warranty Registration',
                      to: '/warranty',
                    });
            }
            if(TempPermission.filter(x => x.menu_name == "Manage Warranty Product".toLowerCase() && x.permission != "-").length > 0){
              TempSubTopic.push({
                      title: 'Manage Warranty Product',
                      to: '/product',
                    });
            }
          }

          if(TempPermission.filter(x => (x.menu_name == "Manage Membership Registration".toLowerCase() || x.menu_name == "Manage Membership".toLowerCase() || x.menu_name == "Manage Membership Renew".toLowerCase() || x.menu_name == "Manage Membership Ignore".toLowerCase() ) && x.permission != "-").length > 0){
            TempTopic.push({
                      title: 'Membership',
                      htmlBefore: '<i class="material-icons">person</i>',
                      open: false,
                      items: [],
                      });

            let TempSubTopic = TempMenu[0]["items"][TempTopic.length - 1]["items"];


            if(TempPermission.filter(x => x.menu_name == "Manage Membership Registration".toLowerCase() && x.permission != "-").length > 0){
              TempSubTopic.push({
                      title: 'Manage Membership Registration',
                      to: '/customerregister',
                    });
            }
            if(TempPermission.filter(x => x.menu_name == "Manage Membership".toLowerCase() && x.permission != "-").length > 0){
              TempSubTopic.push({
                      title: 'Manage Membership',
                      to: '/customer',
                    });
            }
            if(TempPermission.filter(x => x.menu_name == "Manage Membership Renew".toLowerCase() && x.permission != "-").length > 0){
              TempSubTopic.push({
                      title: 'Manage Membership Renew',
                      to: '/customerrenew',
                    });
            }
            if(TempPermission.filter(x => x.menu_name == "Manage Membership Ignore".toLowerCase() && x.permission != "-").length > 0){
              TempSubTopic.push({
                      title: 'Manage Membership Ignore',
                      to: '/CustomerIgnore',
                    });
            }
          }

          if(TempPermission.filter(x => x.menu_name == "Manage Satisfaction".toLowerCase() && x.permission != "-").length > 0){
            TempTopic.push({
                      title: "Satisfaction",
                      htmlBefore: '<i class="material-icons">thumbs_up_down</i>',
                      open: false,
                      items: [{
                        title: 'Manage Satisfaction',
                        to: '/complacence',
                      }],
                      });
          }
          
          if(TempPermission.filter(x => (x.menu_name == "Manage Sparepart & Installation".toLowerCase() || x.menu_name == "Manage Model Sparepart".toLowerCase() || x.menu_name == "Manage Classified SparePart".toLowerCase() || x.menu_name == "Manage Model Installation".toLowerCase() || x.menu_name == "Manage Classified Installation".toLowerCase()) && x.permission != "-").length > 0){
            TempTopic.push({
              title: 'Sparepart & Installation',
              htmlBefore: '<i class="material-icons">inbox</i>',
              open: false,
              items: [],
            });

            let TempSubTopic = TempMenu[0]["items"][TempTopic.length - 1]["items"];


            if(TempPermission.filter(x => x.menu_name == "Manage Sparepart & Installation".toLowerCase() && x.permission != "-").length > 0){
              TempSubTopic.push({
                      title: 'Manage Sparepart & Installation',
                      to: '/sparepart',
                    });
            }
            if(TempPermission.filter(x => x.menu_name == "Manage Model Sparepart".toLowerCase() && x.permission != "-").length > 0){
              TempSubTopic.push({
                      title: 'Manage Model Sparepart',
                      to: '/modelsparepart',
                    });
            }
            if(TempPermission.filter(x => x.menu_name == "Manage Classified SparePart".toLowerCase() && x.permission != "-").length > 0){
              TempSubTopic.push({
                      title: 'Manage Classified SparePart',
                      to: '/classifiedsparepart',
                    });
            }
            if(TempPermission.filter(x => x.menu_name == "Manage Model Installation".toLowerCase() && x.permission != "-").length > 0){
              TempSubTopic.push({
                      title: 'Manage Model Installation',
                      to: '/modelinstallation',
                    });
            }
            if(TempPermission.filter(x => x.menu_name == "Manage Classified Installation".toLowerCase() && x.permission != "-").length > 0){
              TempSubTopic.push({
                      title: 'Manage Classified Installation',
                      to: '/classifiedinstallation',
                    });
            }
          }

          if(TempPermission.filter(x => (x.menu_name == "Service Membership Information".toLowerCase()) && x.permission != "-").length > 0){

            TempTopic.push({
              title: 'Service',
              htmlBefore: '<i class="material-icons">local_shipping</i>',
              open: false,
              items: [{
                title: 'Service Membership Information',
                to: '/serviceinformation',
              }],
            });
          }

          if(TempPermission.filter(x => (x.menu_name == "Manage Employee".toLowerCase() || x.menu_name == "Manage Permission".toLowerCase() ) && x.permission != "-").length > 0){
            
            TempTopic.push({
                      title: "Employee",
                      htmlBefore: '<i class="material-icons">assignment_ind</i>',
                      open: false,
                      items: [],
                      });

            let TempSubTopic = TempMenu[0]["items"][TempTopic.length - 1]["items"];


            if(TempPermission.filter(x => x.menu_name == "Manage Employee".toLowerCase() && x.permission != "-").length > 0){
              TempSubTopic.push({
                      title: 'Manage Employee',
                      to: '/employee',
                    });
            }
            if(TempPermission.filter(x => x.menu_name == "Manage Permission".toLowerCase() && x.permission != "-").length > 0){
              TempSubTopic.push({
                      title: 'Manage Permission',
                      to: '/permission',
                    });
            }
          }

          if(TempPermission.filter(x => (x.menu_name == "Manage Setting Send Email".toLowerCase()) && x.permission != "-").length > 0){
            TempTopic.push({
              title: 'Configuration',
              htmlBefore: '<i class="material-icons">settings</i>',
              open: false,
              items: [{
                title: 'Manage Setting Send Email',
                to: '/SettingSendMail',
              }],
            });
          }

          this.state.navItems = TempMenu;
          this.forceUpdate();
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const { navItems: items } = this.state;
    return (
      <div className="nav-wrapper">
        {items.map((nav, idx) => (
          typeof nav !== 'undefined' ? 
          <div key={idx}>
            {/* <h6 className="main-sidebar__nav-title">{nav.title}</h6> */}
            {typeof nav.items !== "undefined" && nav.items.length && (
              <Nav className="nav--no-borders flex-column">
                {nav.items.map((item, idx) => (
                  <SidebarNavItem key={idx} item={item} />
                ))}
              </Nav>
            )}
          </div>
          : ""
        ))}
      </div>
    )
  }
}

export default SidebarNavItems;
