<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-3">
          <span class="form-label w-28 lb-txt">{{$t('msgGubun')}}</span>
          <select class="form-control" v-model="dataObj.tranCd" disabled>
            <option v-for="tranCd in tranCdList" :key="tranCd.cdId" :value="tranCd.cdId">{{ tranCd.cdNm }}</option>
          </select>
        </div>
        <div class="form-item col-sm-3">
          <span class="form-label w-28 lb-txt">{{$t('targetServer')}}</span>
          <select class="form-control" v-model="dataObj.targetSolSvrSeq" disabled>
            <option v-for="targetSolSvr in targetSolSvrList" :key="targetSolSvr.solSvrSeq" :value="targetSolSvr.solSvrSeq">{{ targetSolSvr.serverNm }}</option>
          </select>
        </div>
        <div class="form-item col-sm-3">
          <span class="form-label w-28 lb-txt">{{$t('protocol')}}</span>
          <select class="form-control" v-model="dataObj.protocol" disabled>
            <option v-for="protocol in protocolList" :key="protocol.cdId" :value="protocol.cdId">{{ protocol.cdNm }}</option>
          </select>
        </div>
        <div class="form-item col-sm-3">
          <span class="form-label w-28 lb-txt">{{$t('method')}}</span>
          <select class="form-control" v-model="dataObj.protocol" disabled>
            <option v-for="protocol in protocolList" :key="protocol.cdId" :value="protocol.cdId">{{ protocol.cdNm }}</option>
          </select>
        </div>
      </div>
      <div class="form-row row" v-if="dataObj.tranCd === 'GN00000337'">
        <div class="form-item col-sm-4 col-lg-6">
          <span class="form-label w-28 lb-txt">{{$t('mdlMtCycle')}}</span>
          <div class="form-inline">
            <div class="input-group">
              <input v-model="dataObj.cycle" type="text" class="form-control mr-2" maxlength="4" style="width: 50px;" disabled/>
              <select class="form-control" v-model="dataObj.cycleType" style="width: 100px;" disabled>
                <option v-for="cycleType in cycleTypeList" :key="cycleType.key" :value="cycleType.key">{{ cycleType.value }}</option>
              </select>
              <span class="form-label pl-2">{{$t('cycleDetail')}}</span>
            </div>
          </div>
        </div>
        <div class="form-item col-sm-4 col-lg-4">
          <span class="form-label w-28 lb-txt">{{$t('cycleDate')}}</span>
          <input v-model="dataObj.cycleDate" type="text" class="form-control" disabled/>
        </div>
      </div>
      <div class="form-row row" v-if="dataObj.tranCd === 'GN00000337'">
        <div class="form-item col-sm-3 col-lg-3">
          <span class="form-label w-28">{{$t('retryOnly')}}</span>
          <div class=" input-group">
            <input v-model="dataObj.retryMin" type="text" class="form-control" maxlength="4" disabled/>
            <span class="bold px-2">{{ $t('retryMin') }}</span>
          </div>
        </div>
        <div class="form-item col-sm-3 col-lg-3">
          <div class=" input-group">
            <input v-model="dataObj.retryCnt" type="text" class="form-control" maxlength="4" disabled/>
            <span class="bold px-2">{{ $t('retryCntOnly') }}</span>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-12 col-lg-12">
          <span class="form-label w-28">{{$t('uri')}}</span>
          <div class=" input-group">
            <input v-model="dataObj.uri" type="text" class="form-control" disabled/>
          </div>
        </div>
      </div>
      <div class="form-row row" v-if="dataObj.tranCd === 'GN00000236'">
        <div class="form-item col-sm-3 col-lg-3">
          <span class="form-label w-28">{{$t('useParsing')}}</span>
          <div class="form-check">
            <label class="form-check-label"><input class="form-check-input" type="checkbox" v-model="dataObj.parserYn" true-value="Y" false-value="N" disabled><span class="form-check-sign"></span></label>
          </div>
        </div>
        <div class="form-item col-sm-3 col-lg-3">
          <div class="input-group">
            <span class="bold px-2 lb-txt">{{ $t('asyncYn') }}</span>
            <select class="form-control" v-model="dataObj.asyncYn" disabled>
              <option v-for="asyncYn in asyncYnList" :key="asyncYn.key" :value="asyncYn.key">{{ asyncYn.value }}</option>
            </select>
          </div>
        </div>
        <div class="form-item col-sm-3 col-lg-3">
          <div class="input-group">
            <span class="bold px-2">{{ $t('retryOnly') }}</span>
            <input v-model="dataObj.retryMin" type="text" class="form-control" disabled/>
            <span class="bold px-2">{{ $t('retryMin') }}</span>
          </div>
        </div>
        <div class="form-item col-sm-3 col-lg-3">
          <div class="input-group">
            <input v-model="dataObj.retryCnt" type="text" class="form-control" disabled/>
            <span class="bold px-2">{{ $t('retryCntOnly') }}</span>
          </div>
        </div>
      </div>
      <div class="flex flex-wrap">
        <div class="md-width-100 width-50">
          <div class="form-item">
            <span class="form-label w-28">{{$t('header')}}</span>
            <textarea v-model="dataObj.head" rows="8" class="form-control" style="resize: none" disabled></textarea>
          </div>
          <div class="form-item">
            <span class="form-label w-28">{{$t('params')}}</span>
            <textarea v-model="dataObj.params" rows="8" class="form-control" style="resize: none" disabled></textarea>
          </div>
          <div class="form-item">
            <span class="form-label w-28">{{$t('body')}}</span>
            <textarea v-model="dataObj.body" rows="10" class="form-control" style="resize: none" disabled></textarea>
          </div>
        </div>
        <div class="md-width-100 width-50">
          <div class="form-item">
            <span class="form-label w-28">{{$t('response')}}</span>
            <textarea v-model="dataObj.response" rows="8" class="form-control" style="resize: none" disabled></textarea>
          </div>
          <div class="form-item">
            <span class="form-label w-28">사용 가능 속성</span>
            <div class="table-wrap auto">
              <table class="table table-col">
                <caption></caption>
                <colgroup>
                  <col style="width:100%">
                </colgroup>
                <thead>
                <tr>
                  <th>속성명</th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(msgMeta, idx) in msgMetaList" :key="'msgMeta'+idx" :value="msgMeta">
                  <td style="text-align: left">
                    {{ msgMeta }}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center btn-wrap">
        <button @click="close()" type="button" class="btn btn-gray" data-dismiss="modal">
          {{ $t('cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import { getCommonCodeByParentCdId } from '@/api/common/code'

export default {
  name: 'SolSvrMsgSetHSvc',
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
        solMsgInfoSeq: '',
        solMsgMSeq: '',
        targetSolSvrSeq: '',
        tranCd: '',
        asyncYn: '',
        protocol: '',
        uri: '',
        method: '',
        head: '',
        body: '',
        parserYn: '',
        params: '',
        response: '',
        retryMin: '',
        retryCnt: '',
        cycleType: '',
        cycle: '',
        useYn: '',
        msgNm: '',
        msgMeta: ''
      },
      tranCdList: [],
      targetSolSvrList: [],
      protocolList: [],
      methodList: [],
      useYnList: [
        { key: 'Y', value: '사용' },
        { key: 'N', value: '사용안함' }
      ],
      cycleTypeList: [
        { key: 'D', value: '일' },
        { key: 'H', value: '시' },
        { key: 'M', value: '분' }
      ],
      asyncYnList: [
        { key: 'Y', value: '비동기' },
        { key: 'N', value: '동기' }
      ],
      msgMetaList: [],
      xMid: 'P30071'
    }
  },
  watch: {
  },
  created() {
    this.dataObj = this.data
    this.msgMetaList = this.data.msgMeta.split(',')
    this.getTargetSolSvrList()
    this.getTranCdList()
    this.getProtocolList()
    this.getMethodList()
  },
  mounted() {},
  computed: {},
  methods: {
    retrieveSolMsgInfoDetail() {
      requestApi({
        url: '/online/solsvrmsg/retrieveSolMsgInfoDetail',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: this.dataObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.dataObj = res.data.dataObj
          }
        }
      })
    },
    getTargetSolSvrList() {
      let reqData = {}
      requestApi({
        url: '/online/solsvrmsg/retrieveTargetSolSvrList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.targetSolSvrList = res.data.targetSolSvrList
        }
      })
    },
    getTranCdList() {
      getCommonCodeByParentCdId({ xMid: this.xMid, parentCdId: 'GN00000235' }).then((data) => {
        this.tranCdList = data
      }).catch((e) => { console.error(e) })
    },
    getProtocolList() {
      getCommonCodeByParentCdId({ xMid: this.xMid, parentCdId: 'GN00000232' }).then((data) => {
        this.protocolList = data
      }).catch((e) => { console.error(e) })
    },
    getMethodList() {
      getCommonCodeByParentCdId({ xMid: this.xMid, parentCdId: 'GN00000238' }).then((data) => {
        this.methodList = data
      }).catch((e) => { console.error(e) })
    },
    chkValid() {
      if (!this.dataObj.uri) {
        this.alert(this.$t('uriValid'), 'warning')
        return
      }

      this.dataObj.msgMeta = this.msgMetaList.join(',')

      this.confirm(this.$t('modifySolMsgInfo'), this.updateSolMsgInfo)
    },
    updateSolMsgInfo() {
      requestApi({
        url: '/online/solsvrmsg/updateSolMsgInfo',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: this.dataObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('save-success'), 'success')
            this.callback(true)
          }
        }
      })
    }
  }
}
</script>

<style lang="less"></style>
