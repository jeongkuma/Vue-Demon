import RouterSection from '@/Layout/components/RouterSection'

export default {
  path: '/login',
  name: 'login-index',
  component: RouterSection,
  redirect: { name: 'login' },
  children: [
    {
      path: 'loginPage',
      name: 'login',
      component: () => import('@/Layout/components/Login.vue')
    }
  ]
}
