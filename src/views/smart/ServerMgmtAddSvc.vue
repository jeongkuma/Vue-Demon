<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-12 col-md-12 col-lg-12">
          <span class="form-label w-32 lb-txt">{{$t('servMtServNm')}}</span>
          <div class=" input-group">
            <input v-model="dataObj.serverNm" type="text" class="form-control" @keyup.enter="fnSvNmDuplChk()" :readonly="dataObj.seq !== ''">
            <button type="button" class="btn btn-pink" @click="fnSvNmDuplChk()" :disabled="dataObj.seq !== ''">{{$t('duplication-check')}}</button>
          </div>
        </div>
        <div class="form-item col-sm-12 col-md-12 col-lg-12">
          <span class="form-label w-32 lb-txt">{{$t('servMtUrlIp')}}</span>
          <input v-model="dataObj.urlIp" type="text" class="form-control">
        </div>
        <div class="form-item col-sm-12 col-md-12 col-lg-12">
          <span class="form-label w-32 lb-txt">{{$t('servMtPort')}}</span>
          <input v-model="dataObj.port" type="text" class="form-control">
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button
          @click="submit()"
          type="button"
          class="btn btn-pink"
          v-if="dataObj.seq === ''"
        >{{$t('registration')}}</button>
        <button @click="submit()" type="button" class="btn btn-pink" v-else>{{$t('modify')}}</button>
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
import { requestApi } from '@/api/ccp/requestApi'
import Cookies from 'js-cookie'
export default {
  name: 'ServerMgmtAddSvc',
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
      dataObj: {
        seq: this.data.obj.seq,
        serverNm: this.data.obj.serverNm,
        urlIp: this.data.obj.urlIp,
        port: this.data.obj.port
      },
      serverNmPre: '',
      servNmDuplChkFlag: true
    }
  },
  watch: {},
  created() {
    this.langTxt = this.$t(Cookies.get('LOCALE'))
    // console.log(this.dataObj)
    // 수정건일때
    if (this.dataObj.seq !== '') {
      this.servNmDuplChkFlag = false
    }
  },
  mounted() {},
  methods: {
    fnSvNmDuplChk() {
      var reqData = {}

      if (this.dataObj.serverNm === '') {
        this.alert(this.$t('servMtServNmNulChk'), 'warning')
        return
      }

      reqData.serverNm = this.dataObj.serverNm
      requestApi({
        url: '/online/bscpctrl/dupSvrNm',
        headers: {
          'X-MID': 'P00302'
        },
        method: 'post',
        data: reqData,
        callback: res => {
          // 중복체크 결과에 대한 헤더값 확인
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(res.data.msg, 'success')
            this.servNmDuplChkFlag = false
            // 중복확인후 값변경시 다시 중복체크
            this.serverNmPre = this.dataObj.serverNm
          } else {
            this.servNmDuplChkFlag = true // 중복일떄
          }
        }
      })
    },
    fnCallApi(reqData, uri) {
      requestApi({
        url: uri,
        headers: {
          'X-MID': 'P00302'
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.callback()
            this.close()
            this.alert(this.$t('save-success'), 'success')
          }
        }
      })
    },
    confirmCallback() {
      var uri = '/online/bscpctrl/saveSvrInfoList'
      // 수정건일때
      if (this.dataObj.seq !== '') {
        uri = '/online/bscpctrl/updateSvrInfoList'
      }
      let reqData = this.dataObj
      if (reqData.port === '') {
        reqData.port = null
      }
      this.fnCallApi(reqData, uri)
    },
    submit() {
      // 중복확인후 값변경시 다시 중복체크(신규등록일때)
      if (
        this.serverNmPre !== this.dataObj.serverNm &&
        this.dataObj.seq === ''
      ) {
        this.servNmDuplChkFlag = true
      }

      if (this.servNmDuplChkFlag) {
        // 중복확인 메세지
        if (this.dataObj.serverNm === '') {
          this.alert(this.$t('servMtServNmNulChk'), 'warning')
          return
        }
        this.alert(this.$t('servMtServNmDupChk'), 'warning')
      } else {
        if (this.dataObj.serverNm === '') {
          this.alert(this.$t('servMtServNmNulChk'), 'warning')
          return
        }
        if (this.dataObj.urlIp === '') {
          this.alert(this.$t('servMtUrlIpNulChk'), 'warning')
          return
        }

        if (this.dataObj.port && !this.fnNumChk(this.dataObj.port)) {
          this.alert(this.$t('validation-port-num'), 'warning')
          return
        }

        // 저장여부 확인
        this.confirm(this.$t('saveYn'), this.confirmCallback)
      }
    },
    fnNumChk(num) {
      if (num !== null && num !== '') {
        return /^[0-9]*$/.test(num)
      } else {
        return true
      }
    }
  }
}
</script>
<style lang="less">
</style>
