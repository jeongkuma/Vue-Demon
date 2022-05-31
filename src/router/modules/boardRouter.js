import RouterSection from '@/Layout/components/RouterSection'

export default {
  path: '/board',
  name: 'board-index',
  component: RouterSection,
  redirect: { name: 'NotiSvc' },
  children: [
    {
      path: 'noti',
      name: 'NotiSvc',
      component: () => import('@/views/board/noti/NotiSvc.vue')
    },
    {
      path: 'userNoti',
      name: 'UserNotiSvc',
      component: () => import('@/views/board/noti/UserNotiSvc.vue')
    },
    {
      path: 'post',
      name: 'PostSvc',
      component: () => import('@/views/board/post/PostSvc.vue')
    },
    {
      path: 'faq',
      name: 'FaqSvc',
      component: () => import('@/views/board/faq/FaqSvc.vue')
    },
    {
      path: 'lib',
      name: 'LibSvc',
      component: () => import('@/views/board/lib/LibSvc.vue')
    },
    {
      path: 'userFaq',
      name: 'UserFaqSvc',
      component: () => import('@/views/board/faq/UserFaqSvc.vue')
    }
  ]
}
