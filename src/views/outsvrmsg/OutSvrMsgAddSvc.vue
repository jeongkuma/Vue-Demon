<template>
  <div>
    <div class="modal-body">
      <div class="mb-1">
        <span class="lb-txt">기본 정보</span>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-4 col-md-4 col-lg-4">
          <span class="form-label w-32">{{$t('outserver-nm')}}</span>
          <select v-model="dataObj.outSvrSeq" class="form-control">
            <option v-for="(item, index) in outSvrList" :key="'key' + index" :value="item.outSvrSeq">{{item.serverNm}}</option>
          </select>
        </div>
        <div class="form-item col-sm-4 col-md-4 col-lg-4">
          <span class="form-label w-32">{{$t('customer')}}</span>
          <input type="text" class="form-control" v-model="dataObj.custNm" disabled/>
        </div>
        <div class="form-item col-sm-4 col-md-4 col-lg-4">
          <span class="form-label w-32">{{$t('svcNm')}}</span>
          <input type="text" class="form-control" v-model="dataObj.svcNm" disabled/>
        </div>
        <div class="form-item col-sm-4 col-md-4 col-lg-4">
          <span class="form-label w-32">{{$t('dev-cls')}}</span>
          <select v-model="dataObj.devClsCd" @change="fnGetDevMdlList(false)" class="form-control">
            <option v-for="item in unique(devClsList,'devClsCd')" v-bind:key="item.devClsCd" v-bind:value="item.devClsCd">{{item.devClsCdNm}}</option>
          </select>
        </div>
        <div class="form-item col-sm-4 col-md-4 col-lg-4">
          <span class="form-label w-32">{{$t('dev-mdl')}}</span>
          <select v-model="dataObj.devMdlCd" class="form-control">
            <option v-for="item in unique(devMdlList,'devMdlCd')" v-bind:key="item.devMdlCd" v-bind:value="item.devMdlCd">{{item.devMdlCdNm}}</option>
          </select>
        </div>
      </div>
      <div class="mb-1 mt-3">
        <span class="lb-txt">전문 정보</span>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-4 col-md-4 col-lg-4">
          <span class="form-label w-32">{{$t('commuication-gubun')}}</span>
          <select v-model="dataObj.tranCd" class="form-control">
            <option v-for="item in tranList" v-bind:key="item.key" v-bind:value="item.value">{{item.key}}</option>
          </select>
        </div>
        <div class="form-item col-sm-4 col-md-4 col-lg-4">
          <span class="form-label w-32">ByPass</span>
          <div class="form-check">
            <label class="form-check-label"><input class="form-check-input" type="checkbox" v-model="dataObj.byPassYn" true-value="Y" false-value="N"><span class="form-check-sign"></span></label>
          </div>
        </div>
      </div>
      <div class="form-row row" v-if="this.dataObj.tranCd === 'GN00000236'">
        <div class="form-item col-lg-4">
          <span class="form-label w-32">실패 시</span>
          <div class="form-inline">
            <div class="input-group">
              <input type="text" class="form-control" v-model="dataObj.retryMin" style="width: 50px;"/>
              <span class="bold pl-1">분 후 재시도</span>
            </div>
          </div>
        </div>
        <div class="form-item col-lg-8">
          <span class="form-label w-32">실패 시 다음날</span>
          <div class="form-inline">
            <div class="input-group">
              <input type="text" class="form-control" v-model="dataObj.retryT" style="width: 50px;"/>
              <span class="bold px-1">시</span>
              <input type="text" class="form-control" v-model="dataObj.retryM" style="width: 50px;"/>
              <span class="bold pl-1">분에 재시도</span>
            </div>
          </div>
        </div>
      </div>
      <div class="form-row mt-3">
        <div class="md-width-100 width-30 pl-1 pr-1">
          <div v-show="this.dataObj.tranCd === 'GN00000236'">
            <div class="mb-1">
              <span class="lb-txt">수집 속성 정보</span>
            </div>
            <jqgrid
              ref="grid"
              name="dataListSend"
              :colModels="colModelList"
              :colNames="colNameList"
              :dataList="outMsgSendInfoList"
              :width="300"
              :multiselect="false"
              @getDataList="fnGetOutMsgSendInfoList"
            >
            </jqgrid>
          </div>
          <div v-show="this.dataObj.tranCd === 'GN00000237'">
            <div class="mb-1">
              <span class="lb-txt">제어 속성 정보</span>
            </div>
            <jqgrid
              ref="grid"
              name="dataListReceive"
              :colModels="colModelList"
              :colNames="colNameList"
              :dataList="outMsgRecieveInfoList"
              :width="300"
              :multiselect="false"
              @getDataList="fnGetOutMsgRecieveInfoList"
            >
            </jqgrid>
          </div>
        </div>
        <div class="width-70 md-width-100 pl-1 pr-1">
          <div>
            <div class="form-row row">
              <div class="form-item col-sm-12">
                <span class="form-label w-32">제휴사 URI</span>
                <input type="text" class="form-control" v-model="dataObj.uri" />
              </div>
            </div>
            <div class="form-row row">
              <div class="form-item col-sm-12">
                <span class="form-label w-32">METHOD</span>
                <select name class="form-control" v-model="dataObj.medth">
                  <option v-for="item in methodList" v-bind:key="item.key" :value="item.value">{{item.key}}</option>
                </select>
              </div>
            </div>
            <div class="form-row row">
              <div class="form-item col-sm-12">
                <span class="form-label w-32">HEADER</span>
                <textarea class="form-control" cols="50" rows="4" v-model="dataObj.heads" v-if="this.dataObj.tranCd === 'GN00000236'"/>
                <textarea class="form-control" cols="50" rows="4" v-model="dataObj.headr" v-else disabled/>
              </div>
            </div>
            <div class="form-row row">
              <div class="form-item col-sm-12">
                <span class="form-label w-32">BODY</span>
                <textarea class="form-control" cols="50" rows="5" v-model="dataObj.bodys" v-if="this.dataObj.byPassYn === 'Y'" disabled/>
                <textarea class="form-control" cols="50" rows="5" v-model="dataObj.bodys" v-else/>
              </div>
            </div>
            <div class="form-row row">
              <div class="form-item col-sm-12">
                <span class="form-label w-32">외부 G/W Callback</span>
                <input type="text" class="form-control" v-model="dataObj.callBackUri" />
              </div>
            </div>
            <div class="form-row row">
              <div class="form-item col-sm-12">
                <span class="form-label w-32">METHOD</span>
                <select name class="form-control" v-model="dataObj.callBackMedth">
                  <option v-for="item in methodList" v-bind:key="item.key" :value="item.value">{{item.key}}</option>
                </select>
              </div>
            </div>
            <div class="form-row row">
              <div class="form-item col-sm-12">
                <span class="form-label w-32">HEADER</span>
                <textarea class="form-control" cols="50" rows="4" v-model="dataObj.callBackHeads"  v-if="this.dataObj.tranCd === 'GN00000236'" disabled/>
                <textarea class="form-control" cols="50" rows="4" v-model="dataObj.callBackHeadr" v-else disabled/>
              </div>
            </div>
            <div class="form-row row">
              <div class="form-item col-sm-12">
                <span class="form-label w-32">BODY</span>
                <textarea class="form-control" cols="50" rows="5" v-model="dataObj.callBackBodys" v-if="this.dataObj.tranCd === 'GN00000236'" disabled/>
                <textarea class="form-control" cols="50" rows="5" v-model="dataObj.callBackBodyr" v-else disabled/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center btn-wrap">
        <button @click="fnAddDuplication()" type="button" class="btn btn-pink">{{$t('registration')}}</button>
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
import { getSvcList } from '@/api/common/usrSvcDevice'
import Jqgrid from '@/components/Jqgrid'

export default {
  name: 'outsvrmsg-create',
  components: {
    Jqgrid
  },
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
      colNameList: [this.$t('param-key'), this.$t('cd-nm')],
      colModelList: [
        { name: 'paramKey', index: 'paramKey', align: 'left', width: '150', frozen: true },
        { name: 'cdNm', index: 'cdNm', align: 'left', width: '150' }
      ],
      dataObj: {
        svcCd: '',
        svcNm: '',
        custSeq: '',
        custNm: '',
        devClsCd: '',
        devMdlCd: '',
        outSvrSeq: '',
        tranCd: 'GN00000236',
        uri: '',
        medth: 'GN00000239',
        heads: 'content-type:#{content-type}\rx-apiversion:#{x-apiversion}\r\nx-auth:#{X-CERTKEY}\r\nx-logkey:#{x-logkey}\r\nx-commandtype:#{x-commandtype}\r\nx-lang:#{x-lang}\r\nx-channel:#{x-channel}\r\nx-uuid:#{x-uuid}\r\nx-vname:OUIF',
        headr: 'content-type:#{content-type}\rx-apiversion:#{x-apiversion}\r\nx-auth:#{X-CERTKEY}\r\nx-logkey:#{x-logkey}\r\nx-commandtype:#{x-commandtype}\r\nx-lang:#{x-lang}\r\nx-channel:#{x-channel}\r\nx-uuid:#{x-uuid}\r\nx-vname:OUIF',
        head: '',
        bodys: '"entityid":#{X-UUID}\r\n"model":"model"\r\n"con":#{con}',
        bodyr: '"entityid":#{X-UUID}\r\n"model":"model"\r\n"con":#{con}',
        body: '',
        callBackUri: '',
        callBackMedth: 'GN00000239',
        callBackHeads: this.$t('outsetmsg-cbheads-default'),
        callBackHeadr: this.$t('outsetmsg-cbheadr-default'),
        callBackHead: '',
        callBackBodys: this.$t('outsetmsg-cbbodys-default'),
        callBackBodyr: this.$t('outsetmsg-cbbodyr-default'),
        callBackBody: '',
        byPassYn: 'N',
        retryMin: '',
        retryTm: '',
        retryT: '',
        retryM: ''
      },
      tranList: [
        { value: 'GN00000236', key: '송신' },
        { value: 'GN00000237', key: '수신' }
      ],
      methodList: [
        { value: 'GN00000239', key: 'POST' },
        { value: 'GN00000240', key: 'PUT' }
      ],
      customerList: [],
      devClsList: [],
      devMdlList: [],
      outMsgSendInfoList: [],
      outMsgRecieveInfoList: [],
      reportOptList: [],
      failureOptList: [],
      isSave: false,
      isFirst: true,
      serverNmDuplChkFlag: false,
      isIssued: false,
      svcCdList: [],
      svcCd: '',
      xMid: 'P40041',
      outSvrList: [],
      outSvrInfo: {}
    }
  },
  watch: {
    svcCd() {
      this.fnGetDevClsList()
    },
    'dataObj.outSvrSeq' (newVal) {
      let list = this.outSvrList.filter(data => data.outSvrSeq === newVal)
      let obj = list[0]
      this.dataObj.outSvrSeq = obj.outSvrSeq
      this.dataObj.svcCd = obj.svcCd
      this.dataObj.svcNm = obj.svcNm
      this.dataObj.custSeq = obj.custSeq
      this.dataObj.custNm = obj.custNm
      this.svcCd = obj.svcCd
    }
  },
  created() {
    this.fnGetOutSvrList()
    this.fnGetOutMsgSendInfoList()
    this.fnGetOutMsgRecieveInfoList()
  },
  mounted() {
  },
  computed: {
    unique() {
      return function(arr, key) {
        var output = []
        var usedKeys = {}
        for (var i = 0; i < arr.length; i++) {
          if (!usedKeys[arr[i][key]]) {
            usedKeys[arr[i][key]] = true
            output.push(arr[i])
          }
        }
        return output
      }
    }
  },
  methods: {
    fnGetSvcCdList() {
      getSvcList({ xMid: this.xMid })
        .then(data => {
          this.svcCdList = data
          if (this.svcCdList.length > 0) {
            this.svcCd = this.svcCdList[0].svcCd
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    fnGetDevClsList() {
      const paramObj = {}
      paramObj.svcCd = this.svcCd

      requestApi({
        url: '/online/outsvrmsg/getDevClsInfo',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.devClsList = res.data.data
            this.dataObj.devClsCd = res.data.data[0].devClsCd
            this.fnGetDevMdlList()
          }
        }
      })
    },
    fnGetDevMdlList(isFirst) {
      const paramObj = {}
      if (isFirst) {
      } else {
        // paramObj.svcCd = this.dataObj.svcCd 유저정보에서 받아와야함
        paramObj.devClsCd = this.dataObj.devClsCd
      }

      requestApi({
        url: '/online/outsvrmsg/getDevMdlInfo',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          // console.log(res)
          if (res.result.status === '200' || res.result.status === '204') {
            this.devMdlList = res.data.data
            // XXXXXXXXX 장비 유형 콤보박스가 변경 될 때 장비 모델 콤보박스의 첫 번째 항목 선택 되도록 설정
            this.dataObj.devMdlCd = res.data.data[0].devMdlCd
          }
        }
      })
    },
    fnGetOutMsgSendInfoList() {
      const paramObj = {}

      requestApi({
        url: '/online/outsvrmsg/getOutMsgSendInfo',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          this.outMsgSendInfoList = res.data.data
        }
      })
    },
    fnGetOutMsgRecieveInfoList() {
      const paramObj = {}

      requestApi({
        url: '/online/outsvrmsg/getOutMsgRecieveInfo',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          this.outMsgRecieveInfoList = res.data.data
        }
      })
    },
    fnGetOutSvrList() {
      const paramObj = {}
      requestApi({
        url: '/online/outsvrmsg/retrieveOutSvrSetList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.outSvrList = res.data.data
            this.dataObj.outSvrSeq = res.data.data[0].outSvrSeq
            // this.dataObj.custSeq = res.data.data[0].custSeq
            // this.dataObj.svcCd = res.data.data[0].svcCd
            // this.dataObj.custNm = res.data.data[0].custNm
            // this.dataObj.svcNm = res.data.data[0].svcNm
            // this.svcCd = res.data.data[0].svcCd
          }
        }
      })
    },
    fnAddDuplication() {
      if (this.dataObj.custSeq < 0) {
        this.alert(this.$t('select-cust-nm'), 'warning')
        return
      }
      var reqData = {}
      reqData.custSeq = this.dataObj.custSeq
      reqData.svcCd = this.svcCd
      reqData.devClsCd = this.dataObj.devClsCd
      reqData.devMdlCd = this.dataObj.devMdlCd
      reqData.tranCd = this.dataObj.tranCd
      requestApi({
        url: '/online/outsvrmsg/retrieveDuplicatedAdd',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          // 중복체크 결과에 대한 헤더값 확인
          if (res.result.status === '200' || res.result.status === '204') {
            if (res.data === 1) {
              this.alert(this.$t('data-dupl'), 'warning')
            } else {
              this.fnAddOutSvr()
            }
          } else {
          }
        }
      })
    },
    fnAddOutSvr() {
      this.confirm(this.$t('register-outsvrmsg'), this.confirmCallback)
    },
    confirmCallback() {
      if (this.dataObj.devClsCd === -1) {
        this.alert(this.$t('request-device-select'), 'warning')
        return
      } else if (this.dataObj.devMdlCd === -1) {
        this.alert(this.$t('sms-dev-model-chk-msg'), 'warning')
        return
      } else if (this.dataObj.tranCd === -1) {
        this.alert(this.$t('trancd-blank-chk'), 'warning')
        return
      } else if (this.dataObj.uri === null || this.dataObj.uri === '') {
        this.alert(this.$t('uri-blank-chk'), 'warning')
        return
      } else if (this.dataObj.medth === null || this.dataObj.medth === '') {
        this.alert(this.$t('medth-blank-chk'), 'warning')
        return
      } else if ((this.dataObj.bodys === null || this.dataObj.bodys === '') && this.dataObj.byPassYn !== 'Y' && this.dataObj.tranCd !== 'GN00000237') {
        // this.alert(this.$t('medth-blank-chk'), 'warning')
        this.alert('BODY를 입력해 주세요', 'warning')
        return
      } else if (this.dataObj.outSvrSeq === '') {
        this.alert(this.$t('outserver-notInfo'), 'warning')
        return
      }

      const reqData = {}
      reqData.custSeq = this.dataObj.custSeq
      reqData.svcCd = this.svcCd
      reqData.devClsCd = this.dataObj.devClsCd
      reqData.devMdlCd = this.dataObj.devMdlCd
      reqData.outSvrSeq = this.dataObj.outSvrSeq
      reqData.tranCd = this.dataObj.tranCd
      reqData.uri = this.dataObj.uri
      reqData.medth = this.dataObj.medth
      if (this.dataObj.tranCd === 'GN00000236') {
        reqData.head = this.dataObj.heads
        reqData.body = this.dataObj.bodys
        reqData.callBackHead = this.dataObj.callBackHeads
        reqData.callBackBody = this.dataObj.callBackBodys
        reqData.byPassYn = this.dataObj.byPassYn

        if (reqData.byPassYn === 'Y') {
          if (this.dataObj.bodys === null || this.dataObj.bodys === '') {
            reqData.body = ' '
          }
        }

        reqData.retryMin = this.dataObj.retryMin
        if (this.dataObj.retryT < 10) {
          this.dataObj.retryT = 0 + this.dataObj.retryT
        }
        if (this.dataObj.retryM < 10) {
          this.dataObj.retryM = 0 + this.dataObj.retryM
        }
        reqData.retryTm = this.dataObj.retryT + this.dataObj.retryM
      } else {
        reqData.head = this.dataObj.headr
        reqData.body = this.dataObj.bodyr
        reqData.callBackHead = this.dataObj.callBackHeadr
        reqData.callBackBody = this.dataObj.callBackBodyr
        reqData.byPassYn = 'N'
        reqData.retryMin = null
        reqData.retryTm = null
      }
      reqData.callBackUri = this.dataObj.callBackUri
      reqData.callBackMedth = this.dataObj.callBackMedth

      requestApi({
        url: '/online/outsvrmsg/createoutsvrmsg',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          console.log(res)
          if (res.result.status === '200' || res.result.status === '204') {
            this.callback()
            this.isSave = true
            this.alert(this.$t('save-success'), 'success')
            this.close()
          } else {
            this.fnInitCondition()
          }
        }
      })
    },
    fnInitCondition() {
      this.dataObj.retryMin = ''
      this.dataObj.retryT = ''
      this.dataObj.retryM = ''
    }
  }
}
</script>

<style lang="less">
</style>
