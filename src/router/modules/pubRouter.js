import RouterSection from '@/Layout/components/RouterSection'
export default {
  path: '/pub',
  name: 'pub-index',
  component: RouterSection,
  redirect: { name: 'PubMecDashboard' },
  children: [
    {
      path: 'mec/:type',
      name: 'PubMecDashboard',
      component: () => import('@/views/pub/PubMecDashboard.vue')
    }
  ]
}
