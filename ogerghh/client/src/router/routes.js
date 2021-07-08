
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/dashboard.vue') },
      { path: 'navi', component: () => import('pages/navi.vue') }
    ]
  },

  {
    path: '/',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: 'ehhDetails',
        name: 'ehhDetails',
        props: true,
        component: () => import('pages/ehhDetails.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
