<template>
  <!-- contentsWrap : S -->
  <div id="contentsWrap">
    <!-- 상단 Title, Location -->
    <div class="page-info" v-show="usePageInfo">
      <h3 class="titH3">{{ menu.title }}</h3>
      <div class="location">
        <span
          v-for="(menu, index) in location"
          :key="`location-${index}`"
          :class="{ home: menu.menu_id === '#', last: index === location.length - 1 }">
          <a>{{ menu.title }}</a>
        </span>
      </div>
    </div>
    <router-view></router-view>
  </div>
  <!-- contentsWrap : E -->
</template>

<script>
import eventBus from '@/utils/eventBus'
export default {
  name: 'LayoutContents',
  components: {},
  data () {
    return {
      usePageInfo: true,
      useTitle: true,
      useLocation: true,
      menu: {},
      location: []
    }
  },
  created () {
    eventBus.$on('usePageInfo', usePageInfo => {
      this.usePageInfo = usePageInfo
    })
  },
  computed: {},
  watch: {
    '$route'() {
      this.menu = this.$store.state.menu.menus.find(m => m.href === this.$route.path) || {}
    },
    menu() {
      this.setLocation()
    }
  },
  methods: {
    setLocation() {
      let location = []

      if (Object.keys(this.menu).length > 0) {
        var menu = this.menu
        location.push(menu)
        while (menu != null && menu.prnt_menu_id !== '#') {
          menu = this.$store.state.menu.menus.find(m => m.menu_id === menu.prnt_menu_id)
          location.push(menu)
        }
        location.push({ menu_id: '#', title: '홈' })
      }

      this.location = location.reverse()
    }
  }
}
</script>

<style lang="less">

</style>
