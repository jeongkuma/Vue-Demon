import RouterSection from '@/Layout/components/RouterSection'

export default {
  path: '/solsvrmsg',
  name: 'solsvrmsg-index',
  component: RouterSection,
  redirect: { name: 'SolMsgSvc' },
  children: [
    {
      path: 'SolMsgSvc',
      name: 'SolMsgSvc',
      component: () => import('@/views/solsvrmsg/SolMsgSvc.vue')
    },
    {
      path: 'SolSvrMsgHis',
      name: 'SolSvrMsgHis',
      component: () => import('@/views/solsvrmsg/SolSvrMsgHis.vue')
    }
  ]
}
