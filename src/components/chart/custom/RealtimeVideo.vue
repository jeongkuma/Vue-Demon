<template>
  <div class="_dashboard-video">
    <div class="_dashboard-video-header">
      <select v-model="device" class="form-control">
        <option
          v-for="(device, index) in deviceList"
          :key="`device-${index}`"
          :value="device"
          >
          {{ device.name }}
        </option>
      </select>
    </div>
    <web-rtc-player :wsUri="wsUri" :rtspUri="rtspUri" @control="fnControl"></web-rtc-player>
  </div>
</template>

<script>
import { vpRealtimeRequest } from '@/api/ccp/vpRealtimeRequest'
import WebRtcPlayer from '@/components/WebRtcPlayer'

export default {
  name: 'RealtimeVideo',
  components: { WebRtcPlayer },
  data() {
    return {
      xMid: 'P00001',
      device: '',
      deviceList: [],
      wsUri: '',
      rtspUri: null
    }
  },
  computed: {},
  watch: {
    device() {
      if (!this.device.id) {
        this.clearDevice()
      } else {
        this.fnGetRtspUrl()
      }
    }
  },
  created() {
    this.fnInit()
  },
  mounted() {},
  methods: {
    // -------------------- 데이터 및 토큰 조회
    async fnInit() {
      this.fnGetPlayDeviceList()
    },
    fnGetPlayDeviceList() {
      vpRealtimeRequest({
        url: '/online/vpcom/realtime/retrieveBroadcastList',
        headers: { 'X-MID': this.xMid },
        method: 'post',
        data: {}
      }).then(res => {
        if (res.result.status === '200') {
          this.deviceList = res.data.device_groups[0].devices
          this.device = this.deviceList[0]
        }
      })
    },
    fnGetRtspUrl() {
      let reqData = {
        deviceId: this.device.id,
        jobId: 'job_1' // TODO: jobId 어떤 데이터 넘겨야하는지 확인 필요!!!!!
      }

      vpRealtimeRequest({
        url: '/online/vpcom/realtime/retreivePlayInfo',
        headers: { 'X-MID': this.xMid },
        method: 'post',
        data: reqData
      }).then(res => {
        if (res.result.status === '200' && parseInt(res.data.status) === 200) {
          this.rtspUri = res.data.rtspUrl
        } else {
          console.error('[RealtimeVideo] fail to fnGetRtspUrl ', res)
        }
      })
    },
    fnControl(direction) {
      if (!this.device.id) {
        return
      }
      // TODO: 파라미터 확인 필요!!!!!
      let reqData = {
        ptzControl: direction,
        ptzSpeed: 10
      }
      vpRealtimeRequest({
        url: '/online/vpcom/realtime/controlPtz',
        headers: { 'X-MID': this.xMid },
        method: 'post',
        data: reqData
      }).then(res => {
        if (res.result.status !== '200' || parseInt(res.data.status) !== 200) {
          console.error('[RealtimeVideo] fail to fnControl ', res)
        }
      })
    },
    clearDevice() {
      this.videoSrc = ''
    }
  }
}
</script>

<style lang="less" scoped>
</style>
