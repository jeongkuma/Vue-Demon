<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-10 col-lg-6">
          <span class="form-label w-28 lb-txt">{{ $t('service') }}</span>
          <select name="" class="form-control" v-model="dataObj.svcCd" disabled>
            <option
              v-for="(svc, index) in svcCdList"
              :key="`svcCd-${index}`"
              :value="svc.svcCd"
              >{{ svc.svcCdNm }}</option
            >
          </select>
        </div>
        <div class="form-item col-sm-10 col-lg-6">
          <span class="form-label w-28 lb-txt">{{ $t('customer') }}</span>
          <select
            name="custNm"
            class="form-control"
            v-model="dataObj.custSeq"
            disabled
          >
            <option
              v-for="item in customerList"
              v-bind:key="item.custSeq"
              :value="item.custSeq"
              >{{ item.custNm }}</option
            >
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-10 col-lg-6">
          <span class="form-label w-28 lb-txt">{{ $t('server-nm') }}</span>
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="dataObj.serverNm"
            />
            <button
              type="button"
              class="btn btn-gray input-group-button"
              @click="fnServerNmDuplication()"
            >
              {{ $t('duplication-check') }}
            </button>
          </div>
        </div>
        <div class="form-item col-sm-10 col-lg-6">
          <span class="form-label w-28 lb-txt">{{ $t('inExSplit') }}</span>
          <select name class="form-control" v-model="dataObj.inoutCd">
            <option
              v-for="item in inexList"
              v-bind:key="item.value"
              :value="item.value"
              >{{ item.key }}</option
            >
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-10 col-lg-6">
          <span class="form-label w-28 lb-txt">{{ $t('server-token') }}</span>
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="dataObj.certKey"
              readonly
            />
            <button
              type="button"
              class="btn btn-gray"
              @click="makeSvrToken()"
              :disabled="isIssued"
            >
              {{ $t('reissue') }}
            </button>
          </div>
        </div>
        <div class="form-item col-sm-10 col-lg-6">
          <span class="form-label w-28 lb-txt">{{ $t('useYn') }}</span>
          <select name class="form-control" v-model="dataObj.useYn">
            <option
              v-for="item in useYnList"
              v-bind:key="item.key"
              :value="item.value"
              >{{ item.key }}</option
            >
          </select>
        </div>
      </div>
      <div class="btn-wrap text-right mt-3">
        <button
          @click="fnExternalIPAddPopup()"
          type="button"
          class="btn btn-pink"
        >
          {{ $t('ip-add') }}
        </button>
      </div>
      <div class="flex flex-wrap mt-3">
        <div class="md-width-100 pl-1 pr-1">
          <jqgrid
            ref="grid"
            name="outSvrModList"
            :colModels="colModelList"
            :colNames="colNameList"
            :dataList="dataList"
            :width="600"
            @onCellSelect="modifyPopup"
            @getDataList="callModAPI"
          >
          </jqgrid>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center btn-wrap">
        <button @click="fnModOutSvr()" type="button" class="btn btn-pink">
          {{ $t('modify') }}
        </button>
        <button
          @click="close()"
          type="button"
          class="btn btn-gray"
          data-dismiss="modal"
        >
          {{ $t('cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import { getSvcList } from '@/api/common/usrSvcDevice'
import Jqgrid from '@/components/Jqgrid'

export default {
  name: 'externalSvr-modify',
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
      colNameList: [
        '',
        this.$t('division'),
        this.$t('en-proxy'),
        this.$t('en-protocol'),
        this.$t('en-ip'),
        this.$t('en-port'),
        this.$t('use-yn'),
        this.$t('certen-key')
      ],
      colModelList: [
        {
          name: 'outSvrInfoSeq',
          index: 'outSvrInfoSeq',
          align: 'left',
          width: '20',
          hidden: true
        },
        { name: 'tranCdNm', index: 'tranCdNm', align: 'left' },
        { name: 'proxyYn', index: 'proxyYn', align: 'left' },
        { name: 'protocolNm', index: 'protocolNm', align: 'left' },
        { name: 'ip', index: 'ip', align: 'left' },
        { name: 'port', index: 'port', align: 'left' },
        { name: 'useYn', index: 'useYn', align: 'left' },
        { name: 'certKey', index: 'certKey', align: 'left' }
      ],
      outSvrList: [
        {
          outSvrInfoSeq: '',
          proxyYn: '',
          protocol: '',
          ip: '',
          port: '',
          certKey: ''
        }
      ],
      dataObj: {
        outSvrInfoSeq: '',
        outSvrSeq: '',
        inoutCd: 'GN00000230',
        custSeq: '',
        svcCd: '',
        svcNm: '',
        useYn: 'Y',
        serverNm: null,
        certKey: null
      },
      customerList: [],
      inexList: [
        { value: 'GN00000230', key: '내부서비스' },
        { value: 'GN00000231', key: '외부서비스' }
      ],
      useYnList: [{ value: 'Y', key: '사용' }, { value: 'N', key: '사용안함' }],
      svcList: [],
      dataList: [],
      reportOptList: [],
      failureOptList: [],
      outsvrmOriginalObj: {},
      isSave: false,
      serverNmDuplChkFlag: false,
      isIssued: false,
      svcCdList: [],
      xMid: 'P20042'
    }
  },
  created() {
    this.fnSearchModifyData()
    this.getCustNmList()
    this.fnGetSvcCdList()
  },
  mounted() {},
  computed: {},
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
    getCustNmList() {
      const paramObj = {}
      paramObj.svcCd = this.svcCd

      requestApi({
        url: '/online/iotoutsvrreport/cmnctSttsCustNmList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.customerList = res.data.cmnctSttsCustNmList
          }
        }
      })
    },
    callModAPI() {
      var reqData = {}
      reqData.currentPage = 1
      reqData.startPage = 1
      reqData.displayRowCount = 15
      reqData.outSvrSeq = this.dataObj.outSvrSeq
      requestApi({
        url: '/online/iotmanage/outsvrinfolist',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.dataList = res.data.outSvrInfoList
          this.totPage = res.data.page.totPage
          this.currentPage = res.data.page.page
        }
      })
    },
    fnSearchModifyData() {
      const paramObj = {}
      paramObj.outSvrSeq = this.data.outSvrSeq

      requestApi({
        url: '/online/iotmanage/outsvrm',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          // console.log(res)
          if (res.result.status === '200' || res.result.status === '204') {
            this.dataObj.outSvrSeq = res.data.outSvrSeq
            this.dataObj.custSeq = res.data.custSeq
            this.dataObj.svcCd = res.data.svcCd
            this.dataObj.serverNm = res.data.serverNm
            this.dataObj.inoutCd = res.data.inoutCd
            this.dataObj.certKey = res.data.certKey
            this.dataObj.useYn = res.data.useYn
            this.callModAPI()
            // 수정시 변경값을 체크하기 위해서 원본 데이터 보관
            this.outsvrmOriginalObj = { ...this.dataObj }
          }
        }
      })
    },
    fnModOutSvr() {
      if (this.outsvrmOriginalObj.serverNm !== this.dataObj.serverNm) {
        if (this.serverNmDuplChkFlag === false) {
          this.alert(this.$t('svrnm-duplchk-msg'), 'warning')
          return
        }
      }
      this.confirm(this.$t('modify-outsvrm'), this.confirmCallback)
    },
    confirmCallback() {
      const reqData = {}
      reqData.outSvrSeq = this.dataObj.outSvrSeq
      reqData.serverNm = this.dataObj.serverNm
      reqData.inoutCd = this.dataObj.inoutCd
      reqData.certKey = this.dataObj.certKey
      reqData.useYn = this.dataObj.useYn
      reqData.svcCd = this.dataObj.svcCd
      requestApi({
        url: '/online/iotmanage/updateoutsvrm',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.isSave = true
            this.alert(this.$t('modify-success'), 'success')
            this.callback()
            this.close()
          }
        }
      })
    },
    fnSvcList() {
      const paramObj = {}
      paramObj.currentPage = 1
      paramObj.displayRowCount = 100000000
      paramObj.custSeq = this.customerList.custSeq

      requestApi({
        url: '/online/iotmanage/outsvrinfomlist',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          // console.log(res)
          if (res.result.status === '200' || res.result.status === '204') {
            this.svcList = res.data.outSvrInfoMList
            this.dataObj.svcCd = res.data.outSvrInfoMList[0].svcCd
          }
        }
      })
    },
    fnServerNmDuplication() {
      if (this.dataObj.serverNm == null || this.dataObj.serverNm === '') {
        this.alert(this.$t('server-name-write'), 'warning')
      } else {
        var reqData = {}
        reqData.custSeq = this.dataObj.custSeq
        reqData.serverNm = this.dataObj.serverNm
        requestApi({
          url: '/online/iotmanage/retrieveDuplicatedSvrNm',
          headers: {
            'X-MID': this.xMid
          },
          method: 'post',
          data: reqData,
          callback: res => {
            if (res.result.status === '200' || res.result.status === '204') {
              this.alert(res.data.msg, 'success')
              this.serverNmDuplChkFlag = true
            } else {
              this.serverNmDuplChkFlag = false
            }
          }
        })
      }
    },
    makeSvrToken() {
      var reqData = {}
      this.isIssued = true
      requestApi({
        url: '/online/iotmanage/makeissue',

        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          // console.log(res)
          // 중복체크 결과에 대한 헤더값 확인
          if (res.result.status === '200' || res.result.status === '204') {
            this.dataObj.certKey = res.data.certKey
          }
        }
      })
    },
    fnExternalIPDelete() {
      var rowid = $('#externalIpTb').jqGrid('getGridParam', 'selarrrow')
      if (typeof rowid !== 'undefined' && rowid.length > 0) {
        this.popup({
          width: '300',
          content: this.$t('selected-delete'),
          callback: status => {
            if (status) {
              this.fnDeleteList()
            }
          }
        })
      } else {
        this.alert(this.$t('unselected-delete'), 'warning')
      }
    },
    fnDeleteList() {
      var paramObj = {}
      // var tmpLength = this.selectedRowArr.length - 1
      let selectedRow = []
      const idArr = $('#externalIpTb').jqGrid('getGridParam', 'selarrrow')

      // console.log(rowNum, last, idArr)

      idArr.forEach(item => {
        selectedRow.push(this.dataList[parseInt(item) - 1].outSvrInfoSeq)
      })

      // paramObj.selectedRow = selectedRow
      paramObj.outsvrinfoSeqList = selectedRow

      requestApi({
        url: '/online/iotmanage/removeoutsvrinfo',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          this.selectedRow = []
          if (res.data === true) {
            this.alert(this.$t('del-success'), 'success')
            this.callModAPI()
          }
          // 삭제시 마지막 페이지 계산
          // 삭제했을 경우 마지막 페이지 이면서 행의 수가 없으면 마지막페이지가 아닌 바로 전 페이지로 이동
          // if (this.currentPage === last) {
          //   if (parseInt(rowNum) === parseInt(selectedRow.length)) {
          //     if (this.currentPage !== 1) {
          //       this.currentPage = this.currentPage - 1
          //     }
          //   }
          // }
        }
      })
    },
    fnExternalIPAddPopup() {
      let params = {}
      params.outSvrSeq = this.dataObj.outSvrSeq
      params.certKey = this.dataObj.certKey
      this.popup({
        component: () => import('@/views/manage/OutSvrInfoAddSvc'),
        title: this.$t('outsvrIpinfo-create'),
        width: '500',
        height: '560',
        data: params,
        callback: data => {
          this.callModAPI()
        }
      })
    },
    modifyPopup: _.throttle(
      function(id, index, contents, event) {
        let object = this.dataList[id]
        this.popup({
          component: () => import('@/views/manage/OutSvrInfoModSvc'),
          title: this.$t('outsvrIpinfo-modify'),
          width: '500',
          height: '560',
          data: object,
          callback: data => {
            if (data !== 'dismiss') {
              this.callModAPI()
            }
          }
        })
      },
      1000,
      { trailing: false }
    )
  }
}
</script>

<style lang="less"></style>
