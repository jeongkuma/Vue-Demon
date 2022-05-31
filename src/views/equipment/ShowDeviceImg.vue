<template>
  <div>
    <div class="modal-body">
      <img :src="deviceImgPath" alt="">
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'ShowDeviceImg',
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
      deviceImgPath: '',
      xMid: 'P00006'
    }
  },
  created () {
    this.fnSearchPath()
  },
  mounted () {},
  methods: {
    fnSearchPath() {
      var paramObj = {}
      paramObj.entrDevSeq = this.data.devSeq
      requestApi({
        url: '/online/iotedevregi/searchDevImg',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            if (res.data.devImg === '') {
              this.alert(this.$t('no-devImg'), 'warning')
              this.callback()
              this.close()
            } else {
              this.deviceImgPath = res.data.devImg
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="less">

</style>
