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
            title: 'Test',
            to: '/Test',
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
          },
          ],
        },
      ]
    }
  ];
}