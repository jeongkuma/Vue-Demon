import RouterSection from '@/Layout/components/RouterSection'

export default {
  path: '/solsvr',
  name: 'solsvr-index',
  component: RouterSection,
  redirect: { name: 'SolSvrSvc' },
  children: [
    {
      path: 'solSvr',
      name: 'SolSvrSvc',
      component: () => import('@/views/solsvr/SolSvrSvc.vue')
    },
    {
      path: 'SolSvrRtReportSvc',
      name: 'SolSvrRtReportSvc',
      component: () => import('@/views/solsvrreport/SolSvrRtReportSvc.vue')
    }
  ]
}
