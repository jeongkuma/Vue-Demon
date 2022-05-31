<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-12">
          <span class="form-label w-44 lb-txt">{{$t('division')}}</span>
          <select name class="form-control" v-model="dataObj.tranCd">
            <option v-for="item in tranList" v-bind:key="item.key" :value="item.value">{{item.key}}</option>
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-12">
          <span class="form-label w-44 lb-txt">{{$t('proxy-yn')}}</span>
          <select name class="form-control" v-model="dataObj.proxyYn">
            <option v-for="item in proxyList" v-bind:key="item.key" :value="item.value">{{item.key}}</option>
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-12">
          <span class="form-label w-44 lb-txt">{{$t('en-protocol')}}</span>
          <select name class="form-control" v-model="dataObj.protocol">
            <option v-for="item in protocolList" v-bind:key="item.cdId" :value="item.cdId">{{item.cdNm}}</option>
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-12">
          <span class="form-label w-44 lb-txt">{{$t('en-ip')}}</span>
          <input type="text" class="form-control" v-model="dataObj.ip"/>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-12">
          <span class="form-label w-44 lb-txt">{{$t('en-port')}}</span>
          <input type="text" class="form-control" v-model="dataObj.port"/>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-12">
          <span class="form-label w-44">{{$t('en-callback-protocol')}}</span>
          <select name class="form-control" v-model="dataObj.callBackProtocol">
            <option v-for="item in protocolList" v-bind:key="item.cdId" :value="item.cdId">{{item.cdNm}}</option>
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-12">
          <span class="form-label w-44">{{$t('en-callback-ip')}}</span>
          <input type="text" class="form-control" v-model="dataObj.callBackIp"/>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-12">
          <span class="form-label w-44">{{$t('en-callback-port')}}</span>
          <input type="text" class="form-control" v-model="dataObj.callBackPort"/>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-12">
          <span class="form-label w-44">{{$t('certen-key')}}</span>
          <input type="text" class="form-control" v-model="dataObj.custCertKey" v-if="this.dataObj.tranCd ==='GN00000236'"/>
          <input type="text" class="form-control" v-model="dataObj.certKey" v-else/>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-12">
          <span class="form-label w-44 lb-txt">{{$t('useYn')}}</span>
          <select name class="form-control" v-model="dataObj.useYn">
            <option v-for="item in useYnList" v-bind:key="item.key" :value="item.value">{{item.key}}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center btn-wrap">
        <button @click="fnAddOutSvr()" type="button" class="btn btn-pink">{{$t('registration')}}</button>
        <button
          @click="close()"
          type="button"
          class="btn btn-gray"
          data-dismiss="modal"
        >{{$t('cancel')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'outsvrIpinfo-create',
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
      paramObj: {},
      dataObj: {
        outSvrSeq: '',
        tranCd: 'GN00000236',
        proxyYn: 'Y',
        useYn: 'Y',
        protocol: '',
        ip: '',
        port: '',
        callBackProtocol: '',
        callBackIp: null,
        callBackPort: null,
        certKey: null,
        custCertKey: null
      },
      tranList: [
        { value: 'GN00000236', key: '송신' },
        { value: 'GN00000237', key: '수신' }
      ],
      useYnList: [
        { value: 'Y', key: '사용' },
        { value: 'N', key: '사용안함' }
      ],
      proxyList: [
        { value: 'Y', key: '사용' },
        { value: 'N', key: '사용안함' }
      ],
      // protocolList: [
      //   { value: 'GN00000233', key: 'HTTP' },
      //   { value: 'GN00000234', key: 'HTTPS' }
      // ],
      protocolList: [],
      customerList: [],
      svcList: [],
      reportOptList: [],
      failureOptList: [],
      xMid: 'P20043'
    }
  },
  created() {
    this.dataObj.certKey = this.data.certKey
    this.dataObj.outSvrSeq = this.data.outSvrSeq
    this.getStatusCdList()
  },
  mounted() {},
  computed: {},
  methods: {
    fnNumChk(num) {
      if (num !== null && num !== '') {
        return /^[0-9]*$/.test(num)
      } else {
        return true
      }
    },
    fnBlankCheck(content) {
      var blankPattern = /^\s+|\s+$/g
      if (content === undefined || content === null) {
        return false
      } else {
        if (content.replace(blankPattern, '') === '') {
          return false
        } else {
          return true
        }
      }
    },
    fnSpecialCharChk(char) {
      if (char !== null && char !== '') {
        return /[~!@#$%^&*()_+|<>?:{}]/.test(char)
      } else {
        return true
      }
    },
    fnAddOutSvr() {
      if (this.dataObj.ip === null || this.dataObj.ip === '') {
        this.alert(this.$t('validation-ip-null'), 'warning')
        return
      }
      if (this.dataObj.port === null || this.dataObj.port === '') {
        this.alert(this.$t('validation-port-null'), 'warning')
        return
      }
      if (this.dataObj.port.length > 5) {
        this.alert(this.$t('validation-port-length'), 'warning')
        return
      }
      if (this.dataObj.callBackPort != null) {
        if (this.dataObj.callBackPort.length > 5) {
          this.alert(this.$t('validation-callback-port'), 'warning')
          return
        }
      }
      if (!this.fnNumChk(this.dataObj.port)) {
        this.alert(this.$t('validation-port-num'), 'warning')
        return
      }
      if (!this.fnNumChk(this.dataObj.callBackPort)) {
        this.alert(this.$t('validation-callBackport-num'), 'warning')
        return
      }
      if (this.dataObj.tranCd === 'GN00000236') {
        this.dataObj.certKey = this.dataObj.custCertKey
      }
      if (!this.dataObj.certKey === null) {
        if (
          this.dataObj.certKey.length > 32 ||
          this.dataObj.custCertKey.length > 32
        ) {
          this.alert(this.$t('validation-cert-key'), 'warning')
          return
        }
      }
      this.confirm(this.$t('register-outsvrinfo'), this.confirmCallback)
    },
    confirmCallback() {
      requestApi({
        url: '/online/iotmanage/createoutsvrinfo',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: this.dataObj,
        callback: res => {
          if (
            res.result.status === '200' ||
            res.result.status === '204'
          ) {
            this.alert(this.$t('save-success'), 'success')
            this.callback()
            this.close()
          }
        }
      })
    },
    getStatusCdList() {
      var reqData = {}
      reqData.parentCdId = 'GN00000232'
      reqData.charSet = 'ko'
      requestApi({
        url: '/online/iotcmcd/retrieveIotByParentCmCdOnly',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.protocolList = res.data
            this.dataObj.protocol = res.data[0].cdId
            this.dataObj.callBackProtocol = res.data[0].cdId
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
</style>
