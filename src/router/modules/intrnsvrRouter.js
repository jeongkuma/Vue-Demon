import RouterSection from '@/Layout/components/RouterSection'

export default {
  path: '/intrnsrv',
  name: 'intrnsrv-index',
  component: RouterSection,
  redirect: { name: 'IntrnSvrCnctnSvc' },
  children: [
    {
      path: 'intrnSvrCnctn',
      name: 'IntrnSvrCnctnSvc',
      component: () => import('@/views/intrnsrv/IntrnSvrCnctnSvc.vue')
    }
  ]
}
