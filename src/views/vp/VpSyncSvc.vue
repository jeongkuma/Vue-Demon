<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-12 col-md-12 col-lg-12">
          <span class="form-label w-32">{{$t('servMtServNm')}}</span>
          <select class="form-control" v-model="serverCd">
            <option v-for="item in serverList" v-bind:Key="item.cdId" :value="item.cdId">{{item.cdNm}}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center btn-wrap">
        <button @click="processIotVpSync()" type="button" class="btn btn-pink">{{$t('synchronization')}}</button>
        <button @click="close()" type="button" class="btn btn-gray" data-dismiss="modal">{{$t('cancel')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'VpUserSyncSvc',
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
      serverList: [],
      serverCd: null,
      xMid: 'P00330',
      gubun: ''
    }
  },
  created () {
    this.serverList = this.data.serverList
    this.serverCd = this.data.serverList[0].cdId
    this.gubun = this.data.gubun
  },
  mounted () {},
  computed: {},
  methods: {
    processIotVpSync() {
      if (this.gubun === 'user') {
        this.processIotVpUserSync()
      } else {
        this.processIotVpDeviceSync()
      }
    },
    processIotVpUserSync () {
      requestApi({
        url: '/online/vpuser/processIotVpUserSync',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: { serverCd: this.serverCd },
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('success'), 'success')
            this.close()
          }
        }
      })
    },
    processIotVpDeviceSync () {
      requestApi({
        url: '/online/vpdevice/processIotVpDeviceSync',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: { serverCd: this.serverCd },
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('success'), 'success')
            this.close()
          }
        }
      })
    }
  }
}
</script>

<style lang="less">

</style>
