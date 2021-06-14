
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'maps', component: () => import('pages/Maps.vue') },
      {
        path: 'map/:title', name: "map", component: () => import('pages/Map.vue'),
      },
      { path: 'editor', component: () => import('pages/Editor.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
