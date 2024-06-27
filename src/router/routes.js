
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/index/IndexPage.vue') },
      // { path: 'users', component: () => import('pages/users/UsersPage') },
      // { path: 'style', component: () => import('pages/style/StylePage.vue') },
      // { path: 'tickets', component: () => import('pages/tickets/TicketPage.vue') },
      // { path: 'chat', component: () => import('pages/chat/ChatPage.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
