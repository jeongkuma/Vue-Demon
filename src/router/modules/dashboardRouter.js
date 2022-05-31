import RouterSection from '@/Layout/components/RouterSection'

export default {
  path: '/dashboard',
  name: 'dasgboard_home',
  component: RouterSection,
  redirect: { name: 'DashboardSvc' },
  children: [
    {
      path: 'dashboard',
      name: 'DashboardSvc',
      component: () => import('@/views/dashboard/DashboardSvc.vue')
    }
  ]
}
