<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <span class="form-label mx-1">서비스</span>
          <select v-model="svcCd" ref="svcCd" class="form-control" title="서비스">
            <option value="" >전체</option>
            <option v-for="(svc, index) in svcCdList" :key="`svcCd-${index}`" :value="svc.svcCd">{{ svc.svcCdNm }}</option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{$t('cust-nm')}}</span>
          <select class="form-control" v-model="selectedCust" >
            <option value=''>{{$t('all')}}</option>
            <option v-for="item in customerList" :key="item.custSeq" :value="item.custSeq">{{ item.custNm }}</option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('server-nm') }}</span>
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
import requestApi from '@/api/ccp/requestApi'
import { getSvcList } from '@/api/common/usrSvcDevice'
import Jqgrid from '@/components/Jqgrid'

export default {
  name: 'external-svr',
  components: {
    Jqgrid
  },
  props: {},
  data() {
    return {
      serverNm: null,
      colNameList: [
        '',
        this.$t('service'),
        this.$t('cust-nm'),
        this.$t('server-nm'),
        this.$t('en-protocol'),
        this.$t('en-ip'),
        this.$t('en-port'),
        this.$t('use-yn'),
        this.$t('en-cert-key'),
        this.$t('regDttm')
      ],
      colModelList: [
        { name: 'outSvrSeq', index: 'outSvrSeq', align: 'left', width: '150', hidden: true },
        { name: 'svcNm', index: 'svcNm', align: 'left', width: '100' },
        { name: 'custNm', index: 'custNm', align: 'left', width: '100' },
        { name: 'serverNm', index: 'serverNm', align: 'left', width: '100' },
        { name: 'protocolNm', index: 'protocolNm', align: 'left', width: '80' },
        { name: 'ip', index: 'ip', align: 'left', width: '80' },
        { name: 'port', index: 'port', align: 'left', width: '80' },
        { name: 'useYn', index: 'useYn', align: 'center', width: '80' },
        { name: 'certKey', index: 'certKey', align: 'left' },
        { name: 'regDttm', index: 'regDttm', align: 'left', width: '150' }
      ],
      dataList: [],
      selectedRow: [],
      currentPage: 1,
      displayRowCount: 15,
      totPage: 1,
      startPage: 1,
      selectedCust: '',
      customerList: [],
      localReader: {
        root: 'root',
        page: 'page',
        total: 'total',
        records: 'records'
      },
      svcCdList: [],
      svcCd: '',
      xMid: 'P20040'
    }
  },
  created() {
    this.fnGetSvcCdList()
    this.getCustNmList()
  },
  mounted() {
  },
  methods: {
    fnGetSvcCdList() {
      getSvcList({ xMid: this.xMid })
        .then((data) => {
          this.svcCdList = data
          if (this.svcCdList.length > 0) {
            this.svcCd = this.svcCdList[0].svcCd
          }
          this.fnGetList()
        })
        .catch((e) => {
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
          // console.log(res)
          if (res.result.status === '200' || res.result.status === '204') {
            this.customerList = res.data.cmnctSttsCustNmList
          }
        }
      })
    },
    fnSearch() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitialize() {
      this.svcCd = this.svcCdList[0].svcCd
      this.serverNm = ''
      this.selectedCust = ''
    },
    fnGetList() {
      var reqData = {}
      // 조회시에
      reqData.startPage = this.currentPage * this.displayRowCount
      reqData.currentPage = this.currentPage
      reqData.displayRowCount = this.displayRowCount
      reqData.serverNm = this.serverNm
      reqData.custSeq = this.selectedCust
      reqData.svcCd = this.svcCd
      requestApi({
        url: '/online/iotmanage/outsvrinfomlist',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.dataList = res.data.outSvrInfoMList
          this.totPage = res.data.page.totPage
          this.currentPage = res.data.page.page
        }
      })
    },
    fnAddPopup: _.throttle(
      function(object) {
        let params = {}
        params.svcCd = this.svcCd
        this.popup({
          component: () => import('@/views/manage/OutSvrAddSvc'),
          title: this.$t('externalSvr-create'),
          width: '800',
          height: '280',
          data: params,
          callback: data => {
            if (data !== 'dismiss') {
              this.fnGetList()
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
          component: () => import('@/views/manage/OutSvrModSvc'),
          title: this.$t('externalSvr-modify'),
          width: '800',
          height: '600',
          data: object,
          callback: data => {
            if (data !== 'dismiss') {
              this.fnGetList()
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
