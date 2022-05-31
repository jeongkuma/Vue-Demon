<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{$t('vpDeviceId')}}</span>
          <input v-model="dataObj.vpDeviceId" type="text" class="form-control" disabled/>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{$t('vpDeviceType')}}</span>
          <input :value="$t('smartPhone')" type="text" class="form-control" disabled/>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{$t('vpDeviceModel')}}</span>
          <input v-model="dataObj.vpDeviceModel" type="text" class="form-control" />
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{$t('vpDeviceVendor')}}</span>
          <input v-model="dataObj.vpDeviceVendor" type="text" class="form-control" />
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{$t('vpDeviceName')}}</span>
          <input v-model="dataObj.vpDeviceName" type="text" class="form-control" />
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{$t('vpDevicePhone')}}</span>
          <input v-model="dataObj.vpDevicePhone" type="text" class="form-control" />
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center btn-wrap">
        <button @click="insertIotVpDevice()" type="button" class="btn btn-pink" data-toggle="modal">{{$t('registration')}}</button>
        <button @click="close()" type="button" class="btn btn-gray" data-dismiss="modal">{{ $t('cancel') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { requestApi } from '@/api/ccp/requestApi'

export default {
  name: 'VpDeviceDetailSvc',
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
  data() {
    return {
      vpDeviceSeq: null,
      dataObj: {},
      xMid: 'P00335'
    }
  },
  created() {
  },
  mounted() {},
  computed: {
  },
  methods: {
    insertIotVpDevice() {
      requestApi({
        url: '/online/vpdevice/insertIotVpDevice',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: this.dataObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            let str = res.data.result ? 'success' : 'warning'
            this.alert(res.data.message, str)
            if (res.data.result) {
              this.callback()
              this.close()
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="less"></style>
