<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <!-- xxxxxxxxx 조회 조건에서 고객사,서비스명 제거 -->
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('customer') }}</span>
          <select v-model="custSeq" class="form-control">
            <option value="">전체</option>
            <option
              v-for="item in customerList"
              :key="item.custSeq"
              :value="item.custSeq"
              >{{ item.custNm }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('service') }}</span>
          <select
            v-model="svcCd"
            ref="svcCd"
            class="form-control"
            title="서비스"
            @change="fnGetDevClsList"
          >
            <option value="">전체</option>
            <option
              v-for="(svc, index) in svcCdList"
              :key="`svcCd-${index}`"
              :value="svc.svcCd"
            >{{ svc.svcCdNm }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('dev-cls') }}</span>
          <select
            v-model="devClsCd"
            class="form-control"
            title=""
            @change="fnChangeDevClsCd()"
          >
            <option value="">전체</option>
            <option
              v-for="(devCls, index) in devClsList"
              :key="`devCls-${index}`"
              :value="devCls.devClsCd"
            >{{ devCls.devClsNm }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('dev-mdl-nm') }}</span>
          <select v-model="devMdlCd" class="form-control" title="">
            <option value="">{{ $t('all') }}</option>
            <option
              v-for="(devMdl, index) in devMdlList"
              :key="`devMdlCd-${index}`"
              :value="devMdl.devMdlCd"
            >{{ devMdl.devMdlNm }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{
            $t('commuication-gubun')
          }}</span>
          <select v-model="tranCd" class="form-control">
            <option value="">전체</option>
            <option
              v-for="item in tranList"
              :key="item.key"
              :value="item.value"
              >{{ item.key }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('outserver-nm') }}</span>
          <input
            type="text"
            class="form-control"
            v-model="serverNm"
            @keyup.enter="fnGetList()"
          />
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="fnSearch()">
            {{ $t('search') }}
          </button>
          <button class="btn btn-info" type="button" @click="fnInitialize()">
            {{ $t('initializing') }}
          </button>
        </div>
      </div>
    </div>
    <div class="mb-2 btn-wrap text-right">
      <button
        type="button"
        class="btn btn-pink"
        data-toggle="modal"
        data-target="#modal-write"
        @click="fnAddPopup()"
      >
        {{ $t('create') }}
      </button>
      <button type="button" class="btn btn-pink" @click="fnExcellDown()">
        {{ $t('excel-download') }}
      </button>
        <button type="button" class="btn btn-pink" @click="memoryPopup('outif',$t('memory-sync'))">
        {{ $t('memory-sync') }}
      </button>
    </div>
    <jqgrid
      ref="grid"
      name="outSvrList"
      :colModels="colModelList"
      :colNames="colNameList"
      :dataList="dataList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      :multiselect="false"
      @onCellSelect="modifyPopup"
      @getDataList="fnGetList"
    >
    </jqgrid>
  </div>
</template>

<script>
import { requestApi, requestDownloadApi } from '@/api/ccp/requestApi'
import { getDevClsCdListBySvcCd, getSvcList } from '@/api/common/usrSvcDevice'
import Jqgrid from '@/components/Jqgrid'

export default {
  name: 'outsvrmsg-list',
  components: {
    Jqgrid
  },
  props: {},
  data() {
    return {
      custSeq: '',
      serverNm: null,
      devClsCd: '',
      devMdlCd: '',
      tranCd: '',
      isSearch: false,
      colNameList: [
        '',
        this.$t('cust-nm'),
        this.$t('service-name'),
        this.$t('dev-cls'),
        this.$t('dev-mdl'),
        this.$t('outserver-nm'),
        this.$t('commuication-gubun'),
        this.$t('uri'),
        this.$t('regDttm')
      ],
      colModelList: [
        {
          name: 'outMsgSetSeq',
          index: 'outMsgSetSeq',
          align: 'left',
          width: '150',
          hidden: true
        },
        { name: 'custNm', index: 'custNm', align: 'left', width: '80' },
        { name: 'svcNm', index: 'svcNm', align: 'left', width: '80' },
        { name: 'devClsCdNm', index: 'devClsCdNm', align: 'left', width: '80' },
        { name: 'devMdlCdNm', index: 'devMdlCdNm', align: 'left', width: '80' },
        { name: 'serverNm', index: 'serverNm', align: 'left', width: '80' },
        { name: 'tranCdNm', index: 'tranCdNm', align: 'left', width: '50' },
        { name: 'uri', index: 'uri', align: 'left', width: '150' },
        { name: 'regDttm', index: 'regDttm', align: 'left', width: '150' }
      ],
      tranList: [
        { value: 'GN00000236', key: '송신' },
        { value: 'GN00000237', key: '수신' }
      ],
      dataList: [],
      customerList: [],
      selectedRow: [],
      currentPage: 1,
      displayRowCount: 15,
      totPage: 1,
      startPage: 1,
      localReader: {
        root: 'root',
        page: 'page',
        total: 'total',
        records: 'records'
      },
      isFirst: true,
      outSvrSeq: '',
      devClsList: [],
      devMdlList: [],
      svcCdList: [],
      svcCd: '',
      xMid: 'P40040'
    }
  },
  watch: {},
  async created() {
    this.fnGetCustList()
    await this.fnGetSvcCdList()
    await this.fnGetDevClsList()
    this.fnGetList()
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
    fnGetCustList() {
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
    fnGetSvcCdList() {
      return new Promise((resolve, reject) => {
        getSvcList({ xMid: this.xMid })
          .then(data => {
            this.svcCdList = data
            if (this.svcCdList.length > 0) {
              this.svcCd = this.svcCdList[0].svcCd
            }
            resolve()
          })
          .catch(e => {
            reject(e)
          })
      })
    },
    fnGetDevClsList() {
      return new Promise((resolve, reject) => {
        if (this.svcCd === '') {
          this.devClsCd = ''
          this.devClsList = []
          return false
        }
        getDevClsCdListBySvcCd({ xMid: this.xMid, svcCd: this.svcCd })
          .then(data => {
            this.devClsList = data.devClsList
            if (this.devClsList.length > 0) {
              this.devClsCd = this.devClsList[0].devClsCd
              this.fnGetDevMdlList({ devClsCd: this.devClsCd })
            }
            resolve()
          })
          .catch(e => {
            reject(e)
          })
      })
    },
    fnChangeDevClsCd() {
      this.fnGetDevMdlList()
    },
    fnGetDevMdlList() {
      this.devMdlCd = ''
      this.devMdlList = []

      if (this.devClsCd === '') {
        return false
      }

      let reqData = {
        svcCd: this.svcCd,
        devClsCd: this.devClsCd
      }
      requestApi({
        url: '/online/iotsdev/retrieveSvcDevMdlList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: data => {
          this.devMdlList = data.data
        }
      })
    },
    fnSearch() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitCondition() {
      this.svcCd = this.svcCdList[0].svcCd
      this.devMdlCd = ''
      this.devMdlList = []
      this.serverNm = ''
      this.custSeq = ''
      this.tranCd = ''
      this.fnGetDevClsList()
    },
    fnInitialize() {
      this.currentPage = 1
      this.fnInitCondition()
    },
    fnGetList(isSearch) {
      var reqData = {}
      reqData.startPage = this.currentPage * this.displayRowCount
      reqData.currentPage = this.currentPage
      reqData.displayRowCount = this.displayRowCount

      if (this.custSeq) {
        reqData.custSeq = this.custSeq
      }
      if (this.tranCd) {
        reqData.tranCd = this.tranCd
      }
      reqData.serverNm = this.serverNm
      reqData.svcCd = this.svcCd
      reqData.devClsCd = this.devClsCd
      reqData.devMdlCd = this.devMdlCd
      requestApi({
        url: '/online/outsvrmsg/outsvrmsglist',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.dataList = res.data.outSvrMsgList
          this.totPage = res.data.page.totPage
          this.currentPage = res.data.page.page
        }
      })
    },
    fnExcellDown() {
      let reqData = {}

      if (this.custSeq) {
        reqData.custSeq = this.custSeq
      }
      if (this.devClsCd) {
        reqData.devClsCd = this.devClsCd
      }
      if (this.devMdlCd) {
        reqData.devMdlCd = this.devMdlCd
      }
      if (this.tranCd) {
        reqData.tranCd = this.tranCd
      }
      reqData.serverNm = this.serverNm

      requestDownloadApi({
        url: '/online/outsvrmsg/outsvrmsgExcelDown',
        headers: {
          'X-MID': this.xMid
        },
        callback: data => {},
        data: reqData
      })
    },
    fnAddPopup: _.throttle(
      function(object) {
        let params = {}
        this.popup({
          component: () => import('@/views/outsvrmsg/OutSvrMsgAddSvc'),
          title: this.$t('outsvrmsg-create'),
          width: '900',
          height: '900',
          data: params,
          callback: (data) => {
            if (data !== 'dimiss') {
              this.fnSearch()
            }
          }
        })
      },
      1000,
      { trailing: false }
    ),
    modifyPopup: _.throttle(
      function(id, index, contents, event) {
        let object = this.dataList[id]
        this.popup({
          component: () => import('@/views/outsvrmsg/OutSvrMsgModSvc'),
          title: this.$t('outsvrmsg-modify'),
          width: '900',
          height: '900',
          data: object,
          callback: (data) => {
            if (data !== 'dimiss') {
              this.fnSearch()
            }
          }
        })
      },
      1000,
      { trailing: false }
    ),
    memoryPopup(actionDiv, title) {
      this.popup({
        component: () => import('@/views/intrnsrv/InitalServerIpSelectPopup'),
        title: title,
        width: '300',
        height: '250',
        data: {
          actionDiv: actionDiv
        },
        callback: (res) => {
          if (res !== 'dismiss') {
          }
        }
      })
    }
  }
}
</script>

<style lang="less"></style>
