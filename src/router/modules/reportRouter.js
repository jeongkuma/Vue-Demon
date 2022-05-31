import RouterSection from '@/Layout/components/RouterSection'

export default {
  path: '/report',
  name: 'report-index',
  component: RouterSection,
  redirect: { name: 'CollectorReportSvc' },
  children: [
    {
      path: 'collectorReport',
      name: 'CollectorReportSvc',
      component: () => import('@/views/report/CollectorReportSvc.vue')
    },
    {
      path: 'collectorReportMec',
      name: 'CollectorReportMec',
      component: () => import('@/views/report/CollectorReportMec.vue')
    },
    {
      path: 'collectorRealReport',
      name: 'CollectorRealReportSvc',
      component: () => import('@/views/report/CollectorRealReportSvc.vue')
    },
    {
      path: 'statusReport',
      name: 'StatusReportSvc',
      component: () => import('@/views/report/StatusReportSvc.vue')
    },
    {
      path: 'statusSmsReport',
      name: 'StatusSmsReportSvc',
      component: () => import('@/views/report/StatusSmsReportSvc.vue')
    },
    {
      path: 'smsHistoryReport',
      name: 'SmsHistoryReportSvc',
      component: () => import('@/views/report/SmsHistoryReportSvc.vue')
    },
    {
      path: 'actuatorReport',
      name: 'ActuatorReportSvc',
      component: () => import('@/views/report/ActuatorReportSvc.vue')
    },
    {
      path: 'loginReport',
      name: 'loginReportSvc',
      component: () => import('@/views/report/LoginReportSvc.vue')
    },
    {
      path: 'logReport',
      name: 'logReportSvc',
      component: () => import('@/views/report/LogReportSvc.vue')
    },
    {
      path: 'statOprReport',
      name: 'statOprReportSvc',
      component: () => import('@/views/report/StatOprReportSvc.vue')
    },
    {
      path: 'colSource',
      name: 'ColSourceSvc',
      component: () => import('@/views/report/ColSourceSvc.vue')
    }
  ]
}
