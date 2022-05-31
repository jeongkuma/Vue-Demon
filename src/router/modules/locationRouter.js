import RouterSection from '@/Layout/components/RouterSection'

export default {
  path: '/location',
  name: 'location-index',
  component: RouterSection,
  redirect: { name: 'LocationSvc' },
  children: [
    {
      path: '',
      name: 'locationSvc',
      component: () => import('@/views/location/LocationSvc.vue')
    },
    {
      path: 'facilityLocation',
      name: 'FacilityLocationSvc',
      component: () => import('@/views/location/FacilityLocationSvc.vue')
    }
  ]
}
