import RouterSection from '@/Layout/components/RouterSection'

export default {
  path: '/custusr',
  name: 'custusr-index',
  component: RouterSection,
  redirect: { name: 'CustomerListSvc' },
  children: [
    {
      path: 'cust/customerList',
      name: 'CustomerListSvc',
      component: () => import('@/views/custusr/cust/CustomerListSvc.vue')
    },
    {
      path: 'cust/organization',
      name: 'OrganizationSvc',
      component: () => import('@/views/custusr/cust/OrganizationSvc.vue')
    },
    {
      path: 'user/userList',
      name: 'UserListSvc',
      component: () => import('@/views/custusr/user/UserListSvc.vue')
    },
    {
      path: 'magic/component',
      name: 'ComponentSvc',
      component: () => import('@/views/custusr/magic/ComponentSvc.vue')
    },
    {
      path: 'magic/dashboardModify',
      name: 'DashboardModifySvc',
      component: () => import('@/views/custusr/magic/DashboardModifySvc.vue')
    },
    {
      path: 'magic/symbolMgmt',
      name: 'SymbolMgmtSvc',
      component: () => import('@/views/custusr/magic/SymbolMgmtSvc.vue')
    },
    {
      path: 'magic/symbolTmplMgmt',
      name: 'SymbolTmplMgntSvc',
      component: () => import('@/views/custusr/magic/SymbolTmplMgmtSvc.vue')
    },
    {
      path: 'magic/facilityMgmt',
      name: 'FacilityMgmtSvc',
      component: () => import('@/views/custusr/magic/FacilityMgmtSvc.vue')
    },
    {
      path: 'magic/facilityPosMgmt',
      name: 'FacilityPosMgmtSvc',
      component: () => import('@/views/custusr/magic/FacilityPosMgmtSvc.vue')
    }
  ]
}
