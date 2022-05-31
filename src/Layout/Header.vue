<template>
  <div id="headerWrap">
    <span class="pc-none top-allmenu"><a href="#" id="allMenuOpen">전체<span class="line"></span><span class="line"></span><span class="line"></span></a></span>
    <h1 class="logo">
      <a @click="goFirstMenu" id ="changeImage">
        <img :src="logo" />
      </a>
    </h1>
    <div class="mobile-allmenu" id="gnb" data-module="gnb">
      <div class="top-util">
        <ul class="utils">
          <li class="admin"><a @click="modifyUserInfo">{{userName}}</a></li>
          <li class="thema-setting pc-only inline">
            <a @click="setTheme('red')" class="red">red</a>
            <a @click="setTheme('blue')" class="blue">blue</a>
            <a @click="setTheme('green')" class="green">green</a>
          </li>
          <li class="logout"><a @click="logoutConfirm()"><span class="haze">LOGOUT</span></a></li>
          <li class="gnb-close"><a href="#" id="closeAllmap" title="전체메뉴 닫기"><span class="haze">닫기</span></a></li>
        </ul>
      </div>
      <layout-menu />
    </div>
    <div class="pc-none">
      <div class="thema-setting">
        <a @click="setTheme('red')" class="red">red</a>
        <a @click="setTheme('blue')" class="blue">blue</a>
        <a @click="setTheme('green')" class="green">green</a>
      </div>
    </div>
    <!-- common.js 에서 dim 사용 -->
    <div id="dim"></div>
  </div>
</template>

<script>
import store from '@/store'
import eventBus from '@/utils/eventBus'
import LayoutMenu from '@/Layout/components/Menu'
import requestApi from '@/api/ccp/requestApi'
import { isMobile } from '@/utils/check'
import logout from '@/api/ccp/logout'
import envs from '@/envs'
import ws from '@/utils/websocket'

export default {
  name: 'LayoutHeader',
  data () {
    return {
      userName: null,
      logo: null,
      test: '/assets/web.png',
      ws: {
        instance: null,
        topic: '/topic/tict-send-symp-uisvc'
      }
    }
  },
  components: {
    LayoutMenu
  },
  created () {
    this.userName = store.state.user.userName
    this.logo = ''
    this.retrieveLogo()
  },
  mounted () {
    this.connectWs()
  },
  beforeDestroy() {
    if (!this.ws.instance) {
      this.disconnectWs()
    }
  },
  methods: {
    goFirstMenu () {
      let firstHref = store.state.menu.firstHref
      this.$router.push(firstHref)
    },
    setTheme (theme) {
      eventBus.$emit('setThemeEventBus', theme)
    },
    retrieveLogo () {
      var reqData = {
        userPlatform: isMobile() ? 'M' : 'W'
      }
      requestApi({
        url: '/online/iotcust/retrieveIotLogo',
        headers: {
          'X-MID': 'P00088'
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          if (res.data.hasLogo === true) {
            var logo = res.data.logo
            this.logo = logo.filePath + '/' + logo.fileName
          } else {
            this.logo = 'assets/default.png'
          }
        }
      })
    },
    logoutConfirm () {
      this.confirm(this.$t('lead-logout'), logout)
    },
    modifyUserInfo: _.throttle(
      function () {
        this.popup({
          component: () => import('@/components/PasswordAuth'),
          title: this.$t('check-pw'),
          width: '300',
          height: '180',
          data: {},
          callback: function(data) {
            if (data === true) {
              this.popup({
                component: () => import('@/views/custusr/user/UserSvc'),
                title: this.$t('user-modify'),
                width: '700',
                height: '570',
                data: {
                  isPopup: true
                },
                callback: function(data) {}
              })
            }
          }
        })
      },
      1000, { 'trailing': false }
    ),
    // -------------------- 웹소켓으로 이상징후 알림 --------------------
    connectWs() {
      // eslint-disable-next-line
      this.ws.instance = new ws()
      this.ws.instance.connect(envs.websocket.url, {
        onconnect: this.onConnectWs,
        ondisconnect: this.onDisconnectWs,
        onmessage: this.onMessageWs
      })
    },
    disconnectWs() {
      this.ws.instance.disconnect()
    },
    subscribe() {
      this.ws.instance.subscribe(this.ws.topic)
    },
    unsubscribe() {
      this.ws.instance.unsubscribe(this.ws.topic)
    },
    onConnectWs() {
      console.log('[Websocket] connected Websocket')
      this.subscribe()
    },
    onMessageWs(frame) {
      console.log('[Websocket] received message', frame)
      if (frame.body) {
        try {
          let data = JSON.parse(frame.body)
          this.openMessage(data)
        } catch (error) {
          console.error(error)
        }
      }
    },
    onDisconnectWs() {
      console.log('[Websocket] disconnected websocket')
    },
    openMessage(data) {
      if (!data.E_DEV_DET_SET_SEQ) {
        return
      }

      // 로그인한 사용자에게 메시지 표시해야하는지 확인
      requestApi({
        url: '/online/iotedevdetsms/retrieveEDevDetSmsUsrByAuth',
        headers: {
          'X-MID': 'P00088'
        },
        method: 'post',
        data: { eDevDetSetSeq: data.E_DEV_DET_SET_SEQ },
        callback: (res) => {
          if (!res.data.usr) {
            return
          }

          // 권한이 있는 경우 알림
          this.$toasted.error(data.DET_MSG, {
            action: {
              text: '확인',
              onClick: (e, toastObject) => {
                this.confirmDetMessage(data)
                toastObject.goAway(0)
              }
            }
          })
        }
      }, {
        useLoading: false
      })
    },
    confirmDetMessage(data) {
      requestApi({
        url: '/online/iotedevdetsms/updateEdetMsg',
        headers: {
          'X-MID': 'P00088'
        },
        method: 'post',
        data: { detMsgSeq: data.DET_MSG_SEQ },
        callback: (res) => {}
      })
    }
  }
}
</script>

<style lang="less">
</style>
