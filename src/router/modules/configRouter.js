import RouterSection from '@/Layout/components/RouterSection'

export default {
  path: '/env',
  name: 'env-index',
  component: RouterSection,
  redirect: { name: 'SvcMgmtSvc' },
  children: [
    {
      path: 'svcMgmt/svcMgmt',
      name: 'SvcMgmtSvc',
      component: () => import('@/views/env/svcMgmt/SvcMgmtSvc.vue')
    },
    {
      path: 'commoncode/commoncodeMgmt',
      name: 'CommoncodeMgmtSvc',
      component: () => import('@/views/env/commoncode/CmCdMgmtSvc.vue')
    },
    {
      path: 'device/deviceList',
      name: 'DeviceListSvc',
      component: () => import('@/views/env/device/DeviceListSvc.vue')
    },
    {
      path: 'device/deviceRule',
      name: 'DeviceRuleSvc',
      component: () => import('@/views/env/device/DeviceRuleSvc.vue')
    },
    {
      path: 'program/api/apiMgmt',
      name: 'ApiMgmtSvc',
      component: () => import('@/views/env/program/ApiMgmtSvc.vue')
    },
    {
      path: 'program/prog/progMgmt',
      name: 'ProgMgmtSvc',
      component: () => import('@/views/env/program/ProgMgmtSvc.vue')
    },
    {
      path: 'program/temp/templateMgmt',
      name: 'TemplateMgmtSvc',
      component: () => import('@/views/env/program/TemplateMgmtSvc.vue')
    },
    {
      path: 'program/temp/jqgridTemplateMgmt',
      name: 'JqgridTemplateMgmtSvc',
      component: () => import('@/views/env/program/JqgridTemplateMgmtSvc.vue')
    },
    {
      path: 'program/menu/menuMgmt',
      name: 'MenuMgmtSvc',
      component: () => import('@/views/env/program/MenuMgmtSvc.vue')
    },
    {
      path: 'auth/userAuth',
      name: 'UserAuthSvc',
      component: () => import('@/views/env/auth/UserAuthSvc.vue')
    },
    {
      path: 'msgTest',
      name: 'MsgTestSvc',
      component: () => import('@/views/env/msgTest/MsgTestSvc')
    }
  ]
}
