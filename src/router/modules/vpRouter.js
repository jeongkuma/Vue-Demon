import RouterSection from '@/Layout/components/RouterSection'

export default {
  path: '/vp',
  name: 'vp-index',
  component: RouterSection,
  redirect: { name: 'VpUserMgmtSvc' },
  children: [
    {
      path: 'vpUserMgmt',
      name: 'VpUserMgmtSvc',
      component: () => import('@/views/vp/VpUserMgmtSvc.vue')
    },
    {
      path: 'vpDeviceMgmt',
      name: 'VpDeviceMgmtSvc',
      component: () => import('@/views/vp/VpDeviceMgmtSvc.vue')
    }
  ]
}
