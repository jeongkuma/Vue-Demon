import RouterSection from '@/Layout/components/RouterSection'

export default {
  path: '/equipment',
  name: 'equipment-index',
  component: RouterSection,
  redirect: { name: 'StatusEquipSvc' },
  children: [
    {
      path: 'statusEquip',
      name: 'StatusEquipSvc',
      component: () => import('@/views/equipment/StatusEquipSvc.vue')
    },
    {
      path: 'statusActuator',
      name: 'statusActuatorSvc',
      component: () => import('@/views/equipment/StatusActuatorSvc.vue')
    }
  ]
}
