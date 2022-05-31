import Vue from 'vue'
import Toasted from 'vue-toasted'

Vue.use(Toasted, {
  duration: 4000,
  position: 'top-right',
  keepOnHover: true,
  theme: 'bubble'
})
