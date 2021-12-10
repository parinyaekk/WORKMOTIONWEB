export default function () {
  return [
    {
      title: 'Warranty',
      items: [
        {
        title: 'Interface',
        htmlBefore: '<i class="material-icons">desktop_windows</i>',
        open: false,
        items: [{
          title: 'Manage Menu',
          to: '/menu',
        }, {
          title: 'Manage Content',
          to: '/content',
        }],
      }, {
        title: "Warranty",
        htmlBefore: '<i class="material-icons">av_timer</i>',
        open: false,
        items: [{
          title: 'Manage Warranty Registration',
          to: "/warranty",
        }, {
          title: 'Manage Warranty Product',
          to: '/product',
        }],
      }, {
        title: 'Membership',
        htmlBefore: '<i class="material-icons">person</i>',
        open: false,
        items: [{
          title: 'Manage Membership Registration',
          to: '/customerregister',
        }, {
          title: 'Manage Membership',
          to: '/customer',
        }, {
          title: 'Manage Membership Renew',
          to: '/customerrenew',
        }, {
          title: 'Manage Membership Ignore',
          to: '/CustomerIgnore',
        }],
      }, {
        title: 'Satisfaction',
        htmlBefore: '<i class="material-icons">thumbs_up_down</i>',
        open: false,
        items: [{
          title: 'Manage Satisfaction',
          to: '/complacence',
        }],
      }, {
        title: 'Sparepart & Installation',
        htmlBefore: '<i class="material-icons">inbox</i>',
        open: false,
        items: [{
          title: 'Manage Sparepart & Installation',
          to: '/sparepart',
        }, {
          title: 'Manage Model Sparepart',
          to: '/modelsparepart',
        }, {
          title: 'Manage Classified SparePart',
          to: '/classifiedsparepart',
        }, {
          title: 'Manage Model Installation',
          to: '/modelinstallation',
        }, {
          title: 'Manage Classified Installation',
          to: '/classifiedinstallation',
        }],
      }, {
        title: 'Service',
        htmlBefore: '<i class="material-icons">local_shipping</i>',
        open: false,
        items: [{
          title: 'Service Membership Information',
          to: '/serviceinformation',
        }],
      }, {
        title: 'Employee',
        htmlBefore: '<i class="material-icons">assignment_ind</i>',
        open: false,
        items: [{
          title: 'Manage Employee',
          to: '/employee',
        }, {
          title: 'Manage Permission',
          to: '/permission',
        }],
      }, {
        title: 'Configuration',
        htmlBefore: '<i class="material-icons">settings</i>',
        open: false,
        items: [{
          title: 'Manage Setting Send Email',
          to: '/SettingSendMail',
        }],
      }]
    }
  ];
}


    // {
    //   title: "Dashboard",
    //   to: "/dashboard",
    //   htmlBefore: '<i class="material-icons">donut_small</i>',
    //   htmlAfter: ""
    // },
    // {
    //   title: "Table",
    //   htmlBefore: '<i class="material-icons">table_chart</i>',
    //   to: "/tables",
    // },
    // {
    //   title: "Manage Warranty Registration",
    //   htmlBefore: '<i class="material-icons">verified_user</i>',
    //   to: "/warranty",
    // },
    // {
    //   title: "Manage Menu",
    //   htmlBefore: '<i class="material-icons">list</i>',
    //   to: "/menu",
    // },
    // {
    //   title: "Manage ContentHead",
    //   htmlBefore: '<i class="material-icons">perm_contact_calendar</i>',
    //   to: "/contenthead",
    // },
    // {
    //   title: "Manage Content",
    //   htmlBefore: '<i class="material-icons">ballot</i>',
    //   to: "/content",
    // },
    // {
    //   title: "Manage Sparepart & Installation",
    //   htmlBefore: '<i class="material-icons">inventory_2</i>',
    //   to: "/sparepart",
    // },
    // {
    //   title: "Manage Model Sparepart",
    //   htmlBefore: '<i class="material-icons">inventory_2</i>',
    //   to: "/modelsparepart",
    // },
    // {
    //   title: "Manage Classified SparePart",
    //   htmlBefore: '<i class="material-icons">inventory_2</i>',
    //   to: "/classifiedsparepart",
    // },
    // {
    //   title: "Manage Installation",
    //   htmlBefore: '<i class="material-icons">get_app</i>',
    //   to: "/installation",
    // },
    // {
    //   title: "Manage Model Installation",
    //   htmlBefore: '<i class="material-icons">get_app</i>',
    //   to: "/modelinstallation",
    // },
    // {
    //   title: "Manage Classified Installation",
    //   htmlBefore: '<i class="material-icons">get_app</i>',
    //   to: "/classifiedinstallation",
    // },
    // {
    //   title: "Manage Footer",
    //   htmlBefore: '<i class="material-icons">get_app</i>',
    //   to: "/managefooter",
    // },
    // {
    //   title: "Content Detail",
    //   htmlBefore: '<i class="material-icons">source</i>',
    //   to: "/contentdetail",
    // },
    // {
    //   title: "Manage Warranty Product",
    //   htmlBefore: '<i class="material-icons">production_quantity_limits</i>',
    //   to: "/product",
    // },
    // {
    //   title: "TestLang",
    //   htmlBefore: '<i class="material-icons">table_chart</i>',
    //   to: "/testlang",
    // },
    // {
    //   title: "Manage ContentHead",
    //   htmlBefore: '<i class="material-icons">perm_contact_calendar</i>',
    //   to: "/contenthead",
    // },
    // {
    //   title: "Manage Menu",
    //   htmlBefore: '<i class="material-icons">perm_contact_calendar</i>',
    //   to: "/menu",
    // },
    // {
    //   title: "Manage Membership Registration",
    //   htmlBefore: '<i class="material-icons">perm_contact_calendar</i>',
    //   to: "/customerregister",
    // },
    // {
    //   title: "Manage Membership Ignore",
    //   htmlBefore: '<i class="material-icons">perm_contact_calendar</i>',
    //   to: "/CustomerIgnore",
    // },
    // {
    //   title: "Manage Membership",
    //   htmlBefore: '<i class="material-icons">perm_contact_calendar</i>',
    //   to: "/customer",
    // },
    // {
    //   title: "Manage Membership Renew",
    //   htmlBefore: '<i class="material-icons">perm_contact_calendar</i>',
    //   to: "/customerrenew",
    // },
    // {
    //   title: "Service Membership Information",
    //   htmlBefore: '<i class="material-icons">perm_contact_calendar</i>',
    //   to: "/serviceinformation",
    // },
    // {
    //   title: "Manage Employee",
    //   htmlBefore: '<i class="material-icons">perm_contact_calendar</i>',
    //   to: "/employee",
    // },
    // {
    //   title: "Manage Satisfaction ",
    //   htmlBefore: '<i class="material-icons">perm_contact_calendar</i>',
    //   to: "/complacence",
    // },
    // {
    //   title: "Permission",
    //   htmlBefore: '<i class="material-icons">perm_contact_calendar</i>',
    //   to: "/permission",
    // },
    // {
    //   title: "Calendar",
    //   htmlBefore: '<i class="material-icons">perm_contact_calendar</i>',
    //   to: "/calendarwork",
    // },
    // {
    //   title: "Blog Posts",
    //   htmlBefore: '<i class="material-icons">vertical_split</i>',
    //   to: "/blog-posts",
    // },
    // {
    //   title: "Add New Post",
    //   htmlBefore: '<i class="material-icons">note_add</i>',
    //   to: "/add-new-post",
    // },
    // {
    //   title: "Forms & Components",
    //   htmlBefore: '<i class="material-icons">view_module</i>',
    //   to: "/components-overview",
    // },
    // {
    //   title: "User Profile",
    //   htmlBefore: '<i class="material-icons">person</i>',
    //   to: "/user-profile-lite",
    // },
    // {
    //   title: "Errors",
    //   htmlBefore: '<i class="material-icons">error</i>',
    //   to: "/errors",
    // }
