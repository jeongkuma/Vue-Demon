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
    <web-rtc-player :wsUri="wsUri" :rtspUri="rtspUri" :directions="directions" @control="fnControl" :useControl="useControl"></web-rtc-player>
  </div>
</template>

<script>
import { vpIntelligentRequest } from '@/api/ccp/vpIntelligentRequest'
import WebRtcPlayer from '@/components/WebRtcPlayer'

export default {
  name: 'IntelligentRealtimeVideo',
  components: { WebRtcPlayer },
  data() {
    return {
      xMid: 'P00001',
      device: '',
      deviceList: [],
      recoder: {},
      wsUri: '',
      rtspUri: null,
      directions: ['leftup', 'up', 'rightup', 'left', 'right', 'leftdown', 'down', 'rightdown']
    }
  },
  computed: {
    useControl() {
      return this.device && this.device.devicetype === 'PTZ'
    }
  },
  watch: {
    device() {
      if (!this.device.index) {
        this.fnClearDevice()
      } else {
        this.fnGetRecoder()
      }
    }
  },
  created() {
    this.fnGetPlayDeviceList()
  },
  mounted() {},
  methods: {
    fnGetPlayDeviceList() {
      vpIntelligentRequest({
        url: '/online/vpcom/intelligent/retrieveDeviceList',
        headers: { 'X-MID': this.xMid },
        method: 'post',
        data: {}
      }).then(res => {
        this.deviceList = res.data.response.devices.device
        this.device = this.deviceList[0]
      }).catch(e => {
        console.error('[IntelligentRealtimeVideo] fail to fnGetPlayDeviceList', e)
      })
    },
    fnClearDevice() {
      this.recoder = {}
      this.rtspUri = null
    },
    fnGetRecoder() {
      vpIntelligentRequest({
        url: '/online/vpcom/intelligent/retrieveRecoder',
        headers: { 'X-MID': this.xMid },
        method: 'post',
        data: {
          index: this.device.index
        }
      }).then(res => {
        // parameter로 index를 넘기지만
        // response에 index에 해당하는 recoder 정보만 주지 않는 경우를 대비하여 index로 재 검증
        let recoderList = res.data.Response.Recorders.Recorder
        this.recoder = recoderList.find(r => r.index.toString() === this.device.index.toString())

        this.fnGetRtspUri()
      }).catch(e => {
        console.error('[IntelligentRealtimeVideo] fail to fnGetPlayDeviceList', e)
      })
    },
    fnGetRtspUri() {
      if (!this.device || Object.keys(this.device).length === 0 || !this.recoder || Object.keys(this.recoder).length === 0) {
        console.error('undefined device or recorder info')
        return
      }
      this.rtspUri = `rtsp://${this.recoder.Address}:${this.recoder.Port}/${this.device.ch}/low`
    },
    fnControl(direction) {
      if (!this.device.index) {
        return
      }
      let reqData = {
        index: this.device.index,
        direction: direction,
        speed: 5
      }
      vpIntelligentRequest({
        url: '/online/vpcom/intelligent/controlPtz',
        headers: { 'X-MID': this.xMid },
        method: 'post',
        data: reqData
      }).then(res => {
        console.log('[IntelligentRealtimeVideo] success control')
      }).catch(e => {
        console.error('[IntelligentRealtimeVideo] fail to fnControl', e)
      })
    }
  }
}
</script>

<style></style>
