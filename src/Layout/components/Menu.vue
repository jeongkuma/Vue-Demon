<template>
  <div>
    <div class="gnb">
      <div class="menu-group">
        <ul class="groups-wrap">
          <li v-for="menu in treeMenus" :key="menu.menu_id" class="groups">
            <a v-if="hasChildren(menu)" href="javascript:;" class="btn-menu plus">{{menu.title}}</a>
            <router-link v-else :to="menu.href" @click="gotoUrl(menu.href, 0)" class="btn-menu">{{menu.title}}</router-link>
            <div v-if="hasChildren(menu)" class="cont">
              <ul>
                <li v-for="subMenu in menu.children" :key="subMenu.menu_id" class="sub-deps ">
                  <!-- <router-link :to="hasChildren(subMenu) ? '' : subMenu.href" @click.native="gotoUrl(subMenu, 1)" :class="hasChildren(subMenu) && 'sub-btn'" :disabled="firstLinkChk">{{subMenu.title}}</router-link> -->
                  <a @click="gotoUrl(subMenu, 1)" :class="hasChildren(subMenu) && 'sub-btn'">{{subMenu.title}}</a>
                  <div v-if="hasChildren(subMenu)" class="sub-cont">
                    <ul>
                      <li v-for="leafMenu in subMenu.children" :key="leafMenu.menu_id" class="sub-deps ">
                        <a @click="gotoUrl(leafMenu.href, 2)">{{leafMenu.title}}</a>
                        <!-- <router-link :to="leafMenu.href" @click.native="gotoUrl(leafMenu.href, 2)" :disabled="secondLinkChk">{{leafMenu.title}}</router-link> -->
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'

export default {
  name: 'LayoutMenu',
  data () {
    return {
      url: '',
      pageIndex: 0
    }
  },
  computed: {
    treeMenus () {
      return store.state.menu.treeMenus
    }
  },
  methods: {
    hasChildren (menuObj) {
      return menuObj && menuObj.children && menuObj.children.length > 0
    },
    getValidMenuUrl (parentMenu) {
      let returnUrl = ''
      let menus = null
      if (parentMenu.children && parentMenu.children.length) {
        menus = parentMenu.children
        for (let i = 0; i < menus.length; i++) {
          if (menus[i].href) {
            returnUrl = menus[i].href
            break
          } else if (menus[i].children && menus[i].children.length) {
            returnUrl = this.getValidMenuUrl(menus[i])
            if (returnUrl) {
              break
            }
          }
        }
      }
      return returnUrl
    },
    gotoUrl (subMenu, division) {
      let href = this.hasChildren(subMenu) ? '' : subMenu.href
      let context = this
      let url = href
      if (division === 1) {
        if (href) {
          setTimeout(() => {
            if (context.url === context.$route.path) {
              url = href + '?' + context.pageIndex++
            }
            context.$router.push(url)
            context.url = context.$route.path
          }, 100)
        }
      } else {
        setTimeout(() => {
          if (subMenu) {
            if (subMenu === context.$route.path) {
              url = subMenu + '?' + context.pageIndex++
            } else {
              url = subMenu
            }
            context.$router.push(url)
            context.url = context.$route.path
          }
        }, 100)
      }
    }
  }
}
</script>

<style lang="less">

</style>
