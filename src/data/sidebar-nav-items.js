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
          open: true,
          items: [{
            title: 'Banner',
            to: '/Banner',
          }, {
            title: 'Test',
            to: '/Test',
          }],
        }
      ]
    }
  ];
}