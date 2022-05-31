<template>
  <div class="login-wrap" v-show="!loginStatus">
    <div class="login-box-wrap">
      <div class="login-box">
        <h1 class="logo">
          <a href=""><img src="@/assets/images/logo.png"/></a>
        </h1>
        <div class="inner">
          <div class="form-group">
            <input
              type="text"
              class="form-control"
              @keyup.enter="processLogin()"
              v-model="custLoginId"
              :placeholder="$t('cust-login-id')"
              :title="$t('cust-login-id')"
              maxlength="20"
            />
          </div>
          <div class="form-group">
            <input
              type="text"
              class="form-control"
              @keyup.enter="processLogin()"
              v-model="usrLoginId"
              :placeholder="$t('id')"
              :title="$t('id')"
              maxlength="20"
            />
          </div>
          <div class="form-group">
            <input
              type="password"
              class="form-control"
              @keyup.enter="processLogin()"
              v-model="usrPwd"
              :placeholder="$t('pw')"
              :title="$t('pw')"
            />
          </div>
          <span class="form-check">
            <label class="form-check-label" for="id-mem">
              <input
                class="form-check-input"
                type="checkbox"
                id="id-mem"
                v-model="saveId"
              />{{ $t('save-id') }}
              <span class="form-check-sign"></span>
            </label>
          </span>
          <button type="button" class="btn btn-pink wide" @click="validation()">
            {{ $t('login') }}
          </button>
        </div>
        <div class="login-util">
          <span
            ><a @click="findUsrIdPopup()">{{ $t('find-id') }}</a
            ><a @click="findUsrPwdPopup()">{{ $t('init-pw') }}</a></span
          >
        </div>
      </div>
    </div>
    <!-- 20190528 : 푸터 추가 -->
    <!-- footerWrap : S -->
    <div class="login-footer">
      <div class="footer">
        <span class="f-logo"
          ><img src="@/assets/images/footer_logo.png" alt="LG U+"
        /></span>
        <span class="f-name">{{ $t('footer-first') }}</span>
        <div class="f-info">
          <span class="pc-only inline">{{ $t('footer-second') }}</span
          >&nbsp;
          <span class="">{{ $t('footer-third') }}</span>
          <span class="">{{ $t('footer-forth') }}</span>
          <span class="">{{ $t('footer-fifth') }}</span>
          <span class="">
            <a
              href="http://www.ftc.go.kr/www/bizCommView.do?key=232&apv_perm_no=2015302015030200474&pageUnit=10&searchCnd=bup_nm&searchKrwd=%EC%97%98%EC%A7%80%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4&pageIndex=1"
              target="_blank"
              title="새창열림"
              ><u>{{ $t('footer-sixth') }}</u></a
            >
          </span>
          &nbsp;
          <span class="">
            <a href="javascript:;"
              ><u>{{ $t('footer-seventh') }}</u></a
            >
          </span>
          <span class="line-break"
            >{{ $t('footer-eighth')
            }}<span class="pc-only inline">{{ $t('footer-ninth') }}</span></span
          >
        </div>
      </div>
    </div>
    <!-- footerWrap : E -->
  </div>
</template>

<script>
import store from '@/store'
import router from '@/router'
import eventBus from '@/utils/eventBus'
import requestApi from '@/api/ccp/requestApi'
import { check } from '@/utils/checkVal'
import { setToken, setCustId, setUserId, setUserName } from '@/utils/cookie'
import envs from '@/envs'
import { getLanguage, setLanguage } from '@/i18n'

export default {
  name: 'Login',
  components: {},
  props: {},
  data() {
    return {
      localeList: envs.framework.supportLocales,
      selectedLocale: 'ko',
      loginStatus: false,
      saveId: false,
      custId: this.$t('cust-login-id'),
      usrId: this.$t('id'),
      usrPw: this.$t('pw'),
      custLoginId: null,
      usrLoginId: null,
      usrPwd: null,
      authCdId: 'GN00000058'
    }
  },
  created() {
    store.dispatch('SetClearMenus')
    this.loginStatus = store.state.user.token
    var returnUsrCookie = this.getUsrCookie('userId')
    var returnCustCookie = this.getCustCookie('custId')
    if (returnUsrCookie && returnCustCookie) {
      this.usrLoginId = returnUsrCookie
      this.custLoginId = returnCustCookie
      this.saveId = true
    }

    // 기존사용하던 다국어 설정 로딩
    this.selectedLocale = getLanguage()
  },
  mounted() {},
  computed: {
    isUseI18n() {
      return envs.framework.getI18nDataFromServer
    }
  },
  methods: {
    validation() {
      if (!check(this.custLoginId)) {
        this.alert(this.$t('cust-login-id') + this.$t('request-input'))
      } else if (!check(this.usrLoginId)) {
        this.alert(this.$t('id') + this.$t('request-input'))
      } else if (!check(this.usrPwd)) {
        this.alert(this.$t('pw') + this.$t('request-input'))
      } else {
        this.processLogin()
      }
    },
    changeLocale() {
      setLanguage(this.selectedLocale)
    },
    processLogin(secLogin) {
      $('*').css('cursor', 'wait')
      var reqData = {}
      reqData.custLoginId = this.custLoginId
      reqData.usrLoginId = this.usrLoginId
      reqData.usrPwd = btoa(unescape(encodeURIComponent(this.usrPwd)))
      reqData.authCdId = this.authCdId
      if (secLogin) {
        // this.reqData.secLogin = secLogin
        reqData.secLogin = secLogin
      }
      // this.reqData.usrPwd = btoa(unescape(encodeURIComponent(this.reqData.usrPwd)))
      requestApi({
        url: '/online/iotlogin/processIotLogin',
        headers: {
          'X-MID': 'P00049'
        },
        method: 'post',
        // data: this.reqData,
        data: reqData,
        callback: res => {
          $('*').css('cursor', '')
          if (res.result.status === '200') {
            if (res.data.changePwd !== undefined) {
              this.changePwdPopup(res.data.changePwd)
            } else if (res.data.termsAgree === false) {
              this.termsAgreeYnPopup()
            } else if (res.data.authUsr === true) {
              this.smsAuthPopup()
            } else if (res.data.access === true) {
              if (this.saveId === true) {
                this.setCookie(
                  'userId',
                  this.usrLoginId,
                  'custId',
                  this.custLoginId,
                  this.$t('cookie-period')
                )
                // 쿠키 보존 일자 하드코딩
              } else {
                this.deleteCookie()
              }
              setToken(res.data.auth)
              setCustId(this.custLoginId)
              setUserId(this.usrLoginId)
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
            }
          }
        }
      })
    },
    deleteCookie() {
      document.cookie = 'userId =; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      document.cookie = 'custId =; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    },
    setCookie(usrIdKey, usrIdValue, custIdKey, custIdValue, exp) {
      var date = new Date()
      date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000)
      document.cookie =
        usrIdKey +
        '=' +
        usrIdValue +
        ',' +
        custIdKey +
        '=' +
        custIdValue +
        ';expires=' +
        date.toUTCString() +
        ';path=/'
    },
    getUsrCookie(key) {
      var cookie = document.cookie.split(',')
      var idCookie = cookie[0]
      var val = idCookie.match('(^|;) ?' + key + '=([^;]*)(;|$)')
      return val ? val[2] : null
    },
    getCustCookie(key) {
      var cookie = document.cookie.split(',')
      var custCookie = cookie[1]
      if (custCookie) {
        var val = custCookie.match('(^|;) ?' + key + '=([^;]*)(;|$)')
      }
      return val ? val[2] : null
    },
    changePwdPopup(gubun) {
      var reqData = {}
      reqData.reason = gubun
      reqData.custLoginId = this.custLoginId
      reqData.usrLoginId = this.usrLoginId
      this.popup({
        component: () => import('@/Layout/components/ChangePwd'),
        title: this.$t('init-pw'),
        width: '500',
        height: '450',
        data: reqData,
        callback: data => {
          if (data === true && data !== 'dismiss') {
            this.processLogin(true)
          }
          if (data === false && data !== 'dismiss') {
            this.usrPwd = null
          }
        }
      })
    },
    termsAgreeYnPopup() {
      var reqData = {}
      reqData.custLoginId = this.custLoginId
      reqData.usrLoginId = this.usrLoginId
      this.popup({
        component: () => import('@/Layout/components/TermsAgr'),
        title: this.$t('usr-terms'),
        width: '900',
        height: '700',
        data: reqData,
        callback: data => {
          if (data === true) {
            this.processLogin(true)
          }
        }
      })
    },
    smsAuthPopup() {
      var reqData = {}
      reqData.saveId = this.saveId
      reqData.custLoginId = this.custLoginId
      reqData.usrLoginId = this.usrLoginId
      reqData.authCdId = this.authCdId
      this.popup({
        component: () => import('@/Layout/components/SmsAuth'),
        title: this.$t('sms-auth'),
        width: '500',
        height: '310',
        data: reqData,
        callback: data => {}
      })
    },
    findUsrIdPopup() {
      this.popup({
        component: () => import('@/Layout/components/FindUsrId'),
        title: this.$t('find-id'),
        width: '500',
        height: '330',
        data: {},
        callback: function(data) {}
      })
    },
    findUsrPwdPopup() {
      this.popup({
        component: () => import('@/Layout/components/FindUsrPwd'),
        title: this.$t('init-pw'),
        width: '500',
        height: '330',
        data: {},
        callback: function(data) {}
      })
    },
    setMenuEvent() {
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
      var gnbRemoveClass1 = function() {
        $gnbAnchor.removeClass('active')
        $gnbDepth2.removeClass('active')
      }

      // GNB RemoveClass2
      var gnbRemoveClass2 = function() {
        $gnbDepth2Anchor.removeClass('active')
        $gnbDepth3.removeClass('active')
      }

      // 20190617 수정 : GNB click으로 변경
      // 1Dep
      $gnbAnchor.unbind('mouseenter')
      $gnb.unbind('mouseleave')
      $gnbAnchor.unbind('click')
      $gnbAnchor.bind('click', function(e) {
        if (
          $(this)
            .siblings('div')
            .hasClass('active')
        ) {
          gnbRemoveClass1()
          $('#headerWrap').css('overflow', 'hidden')
        } else {
          gnbRemoveClass1()
          $(this).addClass('active')
          $(this)
            .siblings('div')
            .addClass('active')
          $('#headerWrap').css('overflow', 'visible')
        }
      })

      // 20190619 수정 : GNB mouseleave
      var windowSize = $(window).width()
      if (windowSize > 1025) {
        $gnbBox.bind('mouseleave', function() {
          $('#headerWrap').css('overflow', 'hidden')
          gnbRemoveClass1()
          $gnbAnchor.removeClass('hover')
        })
      }
      // 2Dep
      $gnbAnchor
        .siblings('div')
        .siblings('a')
        .addClass('plus')
      $gnbDepth2Anchor.unbind('click')
      $gnbDepth2Anchor.bind('click', function() {
        if (
          $(this)
            .siblings('div')
            .hasClass('active')
        ) {
          gnbRemoveClass2()
        } else {
          gnbRemoveClass2()
          $(this).addClass('active')
          $(this)
            .siblings('div')
            .addClass('active')
        }
      })

      // 3Dep 있는 2Dep
      $gnbDepth2Anchor
        .siblings('div')
        .siblings('a')
        .addClass('plus')
      $gnbDepth2Anchor
        .siblings('div')
        .siblings('a')
        .bind('click', function(e) {
          var link = $.trim($(this).prop('href'))
          if (link.indexOf('intro') !== -1) {
          } else {
            e.preventDefault()
          }
        })

      // Menu Open
      $gnbBtnOpen.bind('click', function() {
        $gnbBox.addClass('active')
        $blackBg.addClass('active')
      })

      // Menu Close
      $gnbBtnClose.bind('click', function() {
        $gnbBox.removeClass('active')
        $blackBg.removeClass('active')
      })

      $blackBg.bind('click', function() {
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>
