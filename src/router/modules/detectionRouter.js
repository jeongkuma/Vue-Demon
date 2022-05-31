import RouterSection from '@/Layout/components/RouterSection'

export default {
  path: '/detection',
  name: 'detection-index',
  component: RouterSection,
  redirect: { name: 'DetectionReportSvc' },
  children: [
    {
      path: 'detectionReport',
      name: 'DetectionReportSvc',
      component: () => import('@/views/detection/DetectionReportSvc.vue')
    },
    {
      path: 'detectionsSmsSet',
      name: 'DetectionsSmsSetSvc',
      component: () => import('@/views/detection/DetectionsSmsSetSvc.vue')
    }
  ]
}
