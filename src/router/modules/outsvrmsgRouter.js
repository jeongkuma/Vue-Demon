import RouterSection from '@/Layout/components/RouterSection'

export default {
  path: '/outsvrmsg',
  name: 'outsvrmsg-index',
  component: RouterSection,
  redirect: { name: 'OutSvrMsgSvc' },
  children: [
    {
      path: 'OutSvrMsgSvc',
      name: 'OutSvrMsgSvc',
      component: () => import('@/views/outsvrmsg/OutSvrMsgSvc.vue')
    },
    {
      path: 'OutSvrMsgHis',
      name: 'OutSvrMsgHis',
      component: () => import('@/views/outsvrmsg/OutSvrMsgHis.vue')
    }
  ]
}
