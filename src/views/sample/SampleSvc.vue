<template>
  <div>
    <div>
      <button class="btn btn-pink" @click="fnAlert">알림</button>
      <button class="btn btn-pink" @click="fnConfirm">확인</button>
      <button class="btn btn-pink" @click="fnPopup">팝업</button>
    </div>
    <div class="mt-3">
      <div class="flex">
        <div class="width-50 md-width-100 pr-2 md-p-0">
          <h4 class="titH4">지능형 실시간 재생</h4>
          <div class="mt-3" style="height: 600px">
            <intelligent-realtime-video></intelligent-realtime-video>
          </div>
        </div>
        <div class="width-50 md-width-100 pr-2 md-p-0">
          <h4 class="titH4">실시간 재생</h4>
          <div class="mt-3" style="height: 600px">
            <!-- <realtime-video></realtime-video> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import RealtimeVideo from '@/components/chart/custom/RealtimeVideo'
import IntelligentRealtimeVideo from '@/components/chart/custom/IntelligentRealtimeVideo'

export default {
  name: 'SampleSvc',
  components: { RealtimeVideo, IntelligentRealtimeVideo },
  data() {
    return {
      wsUri: null,
      rtspUri: null
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    fnAlert() {
      this.alert('알림메시지').then(() => {
        // 콜백할 일이 있다면 여기에서 실행
      })
    },
    fnConfirm() {
      // 확인 사용 CASE1
      // 기존 방식 수용하기 위한 방법
      this.confirm('확인메시지', this.fnConfirmCallback)

      // 확인 사용 CASE2
      this.confirm('확인메시지')
        .then(() => {
          // 확인 버튼 클릭 시
        })
        .catch(() => {
          // 취소 버튼 클릭 시
        })
    },
    fnConfirmCallback() {
      // 확인 시 콜백
    },
    fnPopup() {
      this.popup({
        component: () => import('@/views/env/program/ApiMgmtAddSvc'),
        title: this.$t('apiMgmt-regi'),
        width: '900',
        height: '620',
        data: {},
        callback: obj => {}
      })
    }
  }
}
</script>

<style></style>
