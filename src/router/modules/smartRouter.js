import RouterSection from '@/Layout/components/RouterSection'

export default {
  path: '/smart',
  name: 'smart-index',
  component: RouterSection,
  redirect: { name: 'ServerMgmtSvc' },
  children: [
    {
      path: 'serverMgmt',
      name: 'ServerMgmtSvc',
      component: () => import('@/views/smart/ServerMgmtSvc.vue')
    },
    {
      path: 'mdlMgmt',
      name: 'MdlMgmtSvc',
      component: () => import('@/views/smart/MdlMgmtSvc.vue')
    },
    {
      path: 'mdlMapMgmt',
      name: 'MdlMapMgmtSvc',
      component: () => import('@/views/smart/MdlMapMgmtSvc.vue')
    },
    {
      path: 'mdlMapHistMgmt',
      name: 'MdlMapHistMgmtSvc',
      component: () => import('@/views/smart/MdlMapHistMgmtSvc.vue')
    },
    {
      path: 'reqHisMgmt',
      name: 'ReqHisMgmtSvc',
      component: () => import('@/views/smart/ReqHisMgmtSvc.vue')
    }
  ]
}
