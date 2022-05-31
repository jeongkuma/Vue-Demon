import RouterSection from '@/Layout/components/RouterSection'

export default {
  path: '/manage',
  name: 'manage-index',
  component: RouterSection,
  redirect: { name: 'OutSvrSvc' },
  children: [
    {
      path: 'outSvr',
      name: 'OutSvrSvc',
      component: () => import('@/views/manage/OutSvrSvc.vue')
    }
  ]
}
