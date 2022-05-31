<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
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
      name="solSvrSvcList"
      :colModels="colModelList"
      :colNames="colNameList"
      :dataList="dataList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      :multiselect="false"
      @onCellSelect="modifyPopup"
      @getDataList="fnGetList"
    ></jqgrid>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import Jqgrid from '@/components/Jqgrid'

export default {
  name: 'sol-svr',
  components: {
    Jqgrid
  },
  props: {},
  data() {
    return {
      serverNm: null,
      svcCd: '',
      colNameList: [
        '',
        this.$t('server-nm'),
        this.$t('insol-cd'),
        this.$t('en-ip'),
        this.$t('en-port'),
        this.$t('use-yn'),
        this.$t('regDttm')
      ],
      colModelList: [
        { name: 'solSvrSeq', index: 'solSvrSeq', align: 'left', width: '150', hidden: true },
        { name: 'serverNm', index: 'serverNm', align: 'left', width: '100' },
        { name: 'insolNm', index: 'insolNm', align: 'center', width: '80' },
        { name: 'ip', index: 'ip', align: 'center', width: '80', editable: true, edittype: 'text' },
        { name: 'port', index: 'port', align: 'center', width: '80' },
        { name: 'useYn', index: 'useYn', align: 'center', width: '80' },
        { name: 'regDttm', index: 'regDttm', align: 'center', width: '150' }
      ],
      dataList: [],
      selectedRow: [],
      currentPage: 1,
      displayRowCount: 15,
      totPage: 1,
      svcCdList: [],
      localReader: {
        root: 'root',
        page: 'page',
        total: 'total',
        records: 'records'
      },
      xMid: 'P30050'
    }
  },
  created() {
    this.fnGetList()
  },
  mounted() {
  },
  methods: {
    fnSearch() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitialize() {
      this.serverNm = ''
      this.svcCd = ''
      // this.fnSearch()
    },
    fnGetList() {
      let reqData = {}

      reqData.currentPage = this.currentPage
      reqData.displayRowCount = this.displayRowCount
      reqData.serverNm = this.serverNm
      reqData.svcCd = this.svcCd

      requestApi({
        url: '/online/iotSolSvr/retrieveSolSvrList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.dataList = res.data.solSvrInfoMList
          this.totPage = res.data.page.totPage
          this.currentPage = res.data.page.page
        }
      })
    },
    fnAddPopup: _.throttle(
      function(object) {
        let params = {}
        this.popup({
          component: () => import('@/views/solsvr/SolSvrAddSvc'),
          title: this.$t('solSvr-create'),
          width: '900',
          height: '500',
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
          component: () => import('@/views/solsvr/SolSvrModSvc'),
          title: this.$t('solSvr-modify'),
          width: '900',
          height: '500',
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
