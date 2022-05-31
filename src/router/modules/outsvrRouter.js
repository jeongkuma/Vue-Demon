import RouterSection from '@/Layout/components/RouterSection'

export default {
  path: '/outsvr',
  name: 'outsvr-index',
  component: RouterSection,
  redirect: { name: 'OutSvrRtReportSvc' },
  children: [
    {
      path: 'outSvrRtReport',
      name: 'OutSvrRtReportSvc',
      component: () => import('@/views/outsvr/OutSvrRtReportSvc.vue')
    },
    {
      path: 'outSvrCmnctStts',
      name: 'OutSvrCmnctSttsSvc',
      component: () => import('@/views/outsvr/OutSvrCmnctSttsSvc.vue')
    }
  ]
}
