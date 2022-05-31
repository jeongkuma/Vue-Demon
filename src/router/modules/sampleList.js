import RouterSection from '@/Layout/components/RouterSection'

export default {
  path: '/sample',
  name: 'sample-index',
  component: RouterSection,
  redirect: { name: 'SampleSvc' },
  children: [
    {
      path: '',
      name: 'SampleSvc',
      component: () => import('@/views/sample/SampleSvc.vue')
    },
    {
      path: 'jqgrid',
      name: 'SampleJqgrid',
      component: () => import('@/views/sample/SampleJqgrid.vue')
    },
    {
      path: 'form',
      name: 'Form',
      component: () => import('@/views/sample/Form.vue')
    },
    {
      path: 'olmap',
      name: 'OlMap',
      component: () => import('@/views/sample/OlMap.vue')
    }
  ]
}
