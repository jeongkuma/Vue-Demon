<template>
  <div>
    <div class="modal-body">
      <div class="login-form text-center">
        <p class="mb-3">{{$t('notice-send-sms')}}<br>{{$t('lead-auth-check')}}</p>
        <div class="form-inline">
          <div class="form-group text-left">
            <span class="lb-txt">{{$t('auth-no')}}&nbsp;</span>
            <div class="input-group">
              <input type="text" class="form-control" :title="this.authNumber" v-model="authNo" maxlength="6">
              <button class="btn btn-info input-group-addon btn-sm" @click="retrySms()" type="button">{{request}}</button>
            </div>
          </div>
        </div>
          <p class="bold my-2">{{$t('eff-time')}}<span id="countdown"></span></p>
      </div>
    </div>
    <div class="modal-footer">
      <div class="btn-wrap text-center">
        <button type="button" class="btn btn-pink" @click="checkAuthNo()">{{$t('confirm')}}</button>
        <button type="button" class="btn btn-gray" @click="fnClose()">{{$t('close')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import moment from 'moment'
import router from '@/router'
import eventBus from '@/utils/eventBus'
import requestApi from '@/api/ccp/requestApi'
import { setToken, setCustId, setUserId, setUserName } from '@/utils/cookie'

export default {
  name: 'SmsAuth',
  props: {
    data: Object,
    callback: {
      type: Function,
      required: true
    },
    close: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      authNumber: this.$t('auth-no'),
      request: this.$t('request'),
      authNo: null,
      reqData: { custLoginId: null, usrLoginId: null, authCdId: 'GN00000058' }
    }
  },
  created () {
    this.requestAuthNo()
    this.fnCountdown()
  },
  mounted() {
  },
  beforeDestroy() {
    this.fnClose()
  },
  methods: {
    requestAuthNo () {
      requestApi({
        url: '/online/iotlogin/processIotReqAuthNo',
        headers: {
          'X-MID': 'P00054'
        },
        method: 'post',
        data: this.data,
        callback: (res) => {
          if (res.result.status !== '200') {
            this.close()
          }
        }
      })
    },
    checkAuthNo () {
      this.reqData = this.data
      this.reqData.authNo = this.authNo
      requestApi({
        url: '/online/iotlogin/processIotCheckUsrAuthNo',
        headers: {
          'X-MID': 'P00054'
        },
        method: 'post',
        data: this.reqData,
        callback: (res) => {
          if (res.result.status === '200') {
            if (res.data.authAccess === true && res.data.terms === false) {
              this.close()
              if (this.data.saveId === true) {
                this.setCookie('userId', this.reqData.usrLoginId, 'custId', this.reqData.custLoginId, 30)
              } else {
                this.deleteCookie()
              }
              setToken(res.data.auth)
              setCustId(this.reqData.custLoginId)
              setUserId(this.reqData.usrLoginId)
              setUserName(res.data.usrNm)
              eventBus.$emit('setThemeEventBus', null)
              store.dispatch('ProcessLogin', res.data.auth)
              store.dispatch('SetUserName', res.data.usrNm)
              store.dispatch('SetCommonHeader', { auth: res.data.auth })
              store.dispatch('GetMenus').then(() => {
                router.replace('/')

                // 타이밍이슈로 인해서 IE에서 메뉴기능이 작동하지 않아 setTimeout 코드 추가함.
                setTimeout(() => {
                  this.setMenuEvent()
                }, 100)
              })
            } else if (res.data.authAccess === true && res.data.terms === true) {
              this.termsAgreePopup(res.data.auth, res.data.usrNm)
            }
          }
        }
      })
    },
    termsAgreePopup(auth, usrNm) {
      this.popup({
        component: () => import('@/Layout/components/TermsAgr'),
        title: this.$t('usr-terms'),
        width: '900',
        height: '700',
        data: this.reqData,
        callback: (data) => {
          if (data === true) {
            this.close()
            setToken(auth)
            setCustId(this.reqData.custLoginId)
            setUserId(this.reqData.usrLoginId)
            setUserName(usrNm)
            eventBus.$emit('setThemeEventBus', null)
            store.dispatch('ProcessLogin', auth)
            store.dispatch('SetUserName', usrNm)
            store.dispatch('SetCommonHeader', { auth: auth })
            store.dispatch('GetMenus').then(() => {
              router.replace('/')

              // 타이밍이슈로 인해서 IE에서 메뉴기능이 작동하지 않아 setTimeout 코드 추가함.
              setTimeout(() => {
                this.setMenuEvent()
              }, 100)
            })
          } else {
            this.close()
          }
        }
      })
    },
    retrySms () {
      // this.retrySmsPopup()
      clearInterval(this.timer)
      this.fnCountdown()
      this.reqData = this.data
      this.authNo = ''
      this.request = this.$t('retry-sms')
      requestApi({
        url: '/online/iotlogin/processIotReqAuthNo',
        headers: {
          'X-MID': 'P00054'
        },
        method: 'post',
        data: this.reqData,
        callback: (res) => {
          if (res.result.status === '200') {
            if (res.data.sendYn === true) {
              this.alert(this.$t('retry-sms-auth-no'))
            }
          } else {
            this.close()
          }
        }
      })
    },
    fnCountdown () {
      var duration = moment.duration({
        'minutes': 3,
        'seconds': 0
      })
      var timestamp = new Date()
      var interval = 1
      this.timer = setInterval(function() {
        timestamp = new Date(timestamp.getTime() + interval * 1000)
        duration = moment.duration(duration.asSeconds() - interval, 'seconds')
        var min = duration.minutes()
        var sec = duration.seconds()
        sec -= 1
        if (min <= 0 && sec < 0) { // 분이 0분 미만일 때 클리어 인터벌
          return clearInterval(this.timer)
        }
        if (min < 10 && min.length !== 2) { // octal 처리(00분)
          min = '0' + min
        }
        if (sec < 0 && min !== 0) { // 1분이 지났을 때 초 59초로 복귀
          min -= 1
          sec = 59
        } else if (sec < 10 && sec.length !== 2) { // octal 처리(00초)
          sec = '0' + sec
        }
        $('#countdown').text(min + ':' + sec)
        // this.countdown = min + ':' + sec
        if (min === 0 && sec === 0) {
          clearInterval(this.timer)
        }
      }, 1000)
    },
    fnClose () {
      clearInterval(this.timer)
      this.close()
    },
    setMenuEvent () {
      var $gnb = $('#gnb .groups-wrap')
      var $gnbAnchor = $('#gnb .btn-menu')
      var $gnbDepth2Anchor = $('#gnb .sub-btn')
      var $gnbDepth2 = $('#gnb .cont')
      var $gnbDepth3 = $('#gnb .sub-cont')
      var $gnbBtnOpen = $('#allMenuOpen')
      var $gnbBtnClose = $('#closeAllmap')
      var $gnbBox = $('#gnb')
      var $blackBg = $('#dim')

      // GNB RemoveClass1
      var gnbRemoveClass1 = function () {
        $gnbAnchor.removeClass('active')
        $gnbDepth2.removeClass('active')
      }

      // GNB RemoveClass2
      var gnbRemoveClass2 = function () {
        $gnbDepth2Anchor.removeClass('active')
        $gnbDepth3.removeClass('active')
      }

      // 20190617 수정 : GNB click으로 변경
      // 1Dep
      $gnbAnchor.unbind('mouseenter')
      $gnb.unbind('mouseleave')
      $gnbAnchor.unbind('click')
      $gnbAnchor.bind('click', function (e) {
        if ($(this).siblings('div').hasClass('active')) {
          gnbRemoveClass1()
          $('#headerWrap').css('overflow', 'hidden')
        } else {
          gnbRemoveClass1()
          $(this).addClass('active')
          $(this).siblings('div').addClass('active')
          $('#headerWrap').css('overflow', 'visible')
        }
      })

      // 20190619 수정 : GNB mouseleave
      var windowSize = $(window).width()
      if (windowSize > 1025) {
        $gnbBox.bind('mouseleave', function () {
          $('#headerWrap').css('overflow', 'hidden')
          gnbRemoveClass1()
          $gnbAnchor.removeClass('hover')
        })
      }
      // 2Dep
      $gnbAnchor.siblings('div').siblings('a').addClass('plus')
      $gnbDepth2Anchor.unbind('click')
      $gnbDepth2Anchor.bind('click', function () {
        if ($(this).siblings('div').hasClass('active')) {
          gnbRemoveClass2()
        } else {
          gnbRemoveClass2()
          $(this).addClass('active')
          $(this).siblings('div').addClass('active')
        }
      })

      // 3Dep 있는 2Dep
      $gnbDepth2Anchor.siblings('div').siblings('a').addClass('plus')
      $gnbDepth2Anchor.siblings('div').siblings('a').bind('click', function (e) {
        var link = $.trim($(this).prop('href'))
        if (link.indexOf('intro') !== -1) {} else {
          e.preventDefault()
        }
      })

      // Menu Open
      $gnbBtnOpen.bind('click', function () {
        $gnbBox.addClass('active')
        $blackBg.addClass('active')
      })

      // Menu Close
      $gnbBtnClose.bind('click', function () {
        $gnbBox.removeClass('active')
        $blackBg.removeClass('active')
      })

      $blackBg.bind('click', function () {
        $gnbBox.removeClass('active')
        $blackBg.removeClass('active')
      })
      // 20190408 모바일 전체메뉴 링크 클릭 시 메뉴 닫음
      $('.mobile .gnb a').click(function() {
        if (!$(this).hasClass('plus')) {
          $('#gnb').removeClass('active')
          $('#dim').removeClass('active')
        }
      })

      // 20190725 gnb 메뉴 수정
      let menu = $('.groups-wrap')
      let checkLength = menu.find('.groups').length
      let maxlength = 5 //  개수분기
      let activeClass = 'maxWidth' // 활성화 클래스
      if (checkLength > maxlength) {
        menu.addClass(activeClass)
      }
    },
    deleteCookie () {
      document.cookie = 'userId =; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      document.cookie = 'custId =; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    },
    setCookie (usrIdKey, usrIdValue, custIdKey, custIdValue, exp) {
      var date = new Date()
      date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000)
      document.cookie = usrIdKey + '=' + usrIdValue + ',' + custIdKey + '=' + custIdValue + ';expires=' + date.toUTCString() + ';path=/'
    },
    getUsrCookie (key) {
      var cookie = document.cookie.split(',')
      var idCookie = cookie[0]
      var val = idCookie.match('(^|;) ?' + key + '=([^;]*)(;|$)')
      return val ? val[2] : null
    },
    getCustCookie (key) {
      var cookie = document.cookie.split(',')
      var custCookie = cookie[1]
      if (custCookie) {
        var val = custCookie.match('(^|;) ?' + key + '=([^;]*)(;|$)')
      }
      return val ? val[2] : null
    }
  }
}
</script>
<style scoped>
</style>
