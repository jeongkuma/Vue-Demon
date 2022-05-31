<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{$t('server-nm')}}</span>
          <input v-model="dataObj.serverNm" type="text" class="form-control" readonly/>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{$t('vpDeviceId')}}</span>
          <input v-model="dataObj.vpDeviceId" type="text" class="form-control" readonly/>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{$t('vpDeviceType')}}</span>
          <input v-model="dataObj.vpDeviceType" type="text" class="form-control" readonly/>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{$t('vpDeviceModel')}}</span>
          <input v-model="dataObj.vpDeviceModel" type="text" class="form-control" readonly/>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{$t('vpDeviceVendor')}}</span>
          <input v-model="dataObj.vpDeviceVendor" type="text" class="form-control" readonly/>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{$t('vpDeviceName')}}</span>
          <input v-model="dataObj.vpDeviceName" type="text" class="form-control" readonly/>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{$t('vpDevicePhone')}}</span>
          <input v-model="dataObj.vpDevicePhone" type="text" class="form-control" readonly/>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{$t('dev-cls')}}</span>
          <input v-model="dataObj.devClsCd" type="text" class="form-control" readonly/>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{$t('dev-mdl')}}</span>
          <input v-model="dataObj.devMdlCd" type="text" class="form-control" readonly/>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{$t('ctn')}}</span>
          <input v-model="dataObj.ctn" type="text" class="form-control" readonly/>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{$t('entityId')}}</span>
          <input v-model="dataObj.entityId" type="text" class="form-control" readonly/>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{$t('regDttm')}}</span>
          <input v-model="dataObj.regDttm" type="text" class="form-control" readonly/>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{$t('useYn')}}</span>
          <input v-model="dataObj.vpDeviceStatus" type="text" class="form-control" readonly/>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center btn-wrap">
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
      xMid: 'P00334'
    }
  },
  created() {
    this.vpDeviceSeq = this.data.object.vpDeviceSeq
    this.getIotVpDeviceDetail()
  },
  mounted() {},
  computed: {
  },
  methods: {
    getIotVpDeviceDetail() {
      requestApi({
        url: '/online/vpdevice/getIotVpDeviceDetail',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: { vpDeviceSeq: this.vpDeviceSeq },
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.dataObj = res.data
          }
        }
      })
    }
  }
}
</script>

<style lang="less"></style>
