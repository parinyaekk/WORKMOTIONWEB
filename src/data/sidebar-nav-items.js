export default function () {
  return [
    {
      title: 'NavBar',
      items: [
        // {
        //   title: 'Dashboard',
        //   htmlBefore: '<i class="material-icons">home</i>',
        //   open: false,
        //   items: null,
        // },
        {
          title: 'HomePage',
          htmlBefore: '<i class="material-icons">desktop_windows</i>',
          open: false,
          items: [{
            title: 'Banner',
            to: '/Banner',
          }, {
            title: 'SEO Banner',
            to: '/SEO_Banner',
          }],
        },
        {
          title: 'Portfolio',
          htmlBefore: '<i class="material-icons">desktop_windows</i>',
          open: false,
          items: [{
            title: 'StartUp',
            to: '/StartUp',
          },{
            title: 'Fund',
            to: '/Fund',
          },{
            title: 'Partnership',
            to: '/Partnership',
          },{
            title: 'SEO Portfolio',
            to: '/SEO_Portfolio',
          },
          ],
        },
        {
          title: 'Team',
          htmlBefore: '<i class="material-icons">desktop_windows</i>',
          open: false,
          items: [{
            title: 'Team',
            to: '/Team',
          },{
            title: 'SEO Team',
            to: '/SEO_Team',
          },
          ],
        },
        {
          title: 'News',
          htmlBefore: '<i class="material-icons">desktop_windows</i>',
          open: false,
          items: [{
            title: 'News & Activity',
            to: '/News',
          },{
            title: 'SEO News',
            to: '/SEO_News',
          },
          ],
        },
        {
          title: 'Contact Us',
          htmlBefore: '<i class="material-icons">desktop_windows</i>',
          open: false,
          items: [{
            title: 'ContactDetail',
            to: '/ContactDetail',
          },{
            title: 'SEO ContactUs',
            to: '/SEO_ContactUs',
          },
          ],
        },
      ]
    }
  ];
}