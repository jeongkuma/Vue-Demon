<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <span class="form-label mx-1">{{$t('api-name')}}</span>
          <input v-model="apiNm" type="text" class="form-control" @keyup.enter="fnSearch">
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{$t('uri')}}</span>
          <input v-model="apiUri" type="text" class="form-control" @keyup.enter="fnSearch">
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="fnSearch()">{{$t('search')}}</button>
          <button
            class="btn btn-info"
            type="button"
            @click="fnInitialize()"
          >{{$t('initializing')}}</button>
        </div>
      </div>
    </div>
    <div class="mb-2 text-right">
      <button
        type="button"
        class="btn btn-pink"
        data-toggle="modal"
        data-target="#modal-write"
        @click="fnShowAddPopup"
      >{{$t('registration')}}</button>
      <button type="button" class="btn btn-gray" @click="fnDeleteConfirm()">{{$t('delete')}}</button>
    </div>
    <jqgrid
      ref="grid"
      name="apiMgmt"
      :colModels="colModelData"
      :colNames="colNameData"
      :dataList="dataList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      @onCellSelect="fnShowModifyPopup"
      @getDataList="fnGetList"
    >
    </jqgrid>
  </div>
</template>

<script>
import Jqgrid from '@/components/Jqgrid'
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'ApiMgmtSvc',
  components: { Jqgrid },
  props: {},
  data() {
    return {
      apiNm: '',
      apiUri: '',
      currentPage: 1,
      displayRowCount: 15,
      totPage: 1,
      dataList: [],
      colNameData: [
        this.$t('api-name'),
        this.$t('uri'),
        this.$t('description'),
        this.$t('regUser'),
        this.$t('regDttm')
      ],
      colModelData: [
        { name: 'apiNm', index: 'apiNm', align: 'left', width: '200' },
        { name: 'apiUri', index: 'apiUri', align: 'left', width: '400' },
        { name: 'apiDesc', index: 'apiDesc', align: 'left', width: '500' },
        { name: 'regUserId', index: 'regUserId', align: 'left', width: '200' },
        { name: 'regDttm', index: 'regDttm', align: 'center', width: '300' }
      ]
    }
  },
  created() {},
  mounted() {
    this.fnGetList()
  },
  computed: {},
  methods: {
    fnGetList() {
      var paramObj = {
        apiNm: this.apiNm,
        apiUri: this.apiUri,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount
      }

      requestApi({
        url: '/online/com/api/getIotApi',
        headers: {
          'X-MID': 'P00079'
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.dataList = res.data.dataList
            this.totPage = res.data.page.totPage
          }
        }
      })
    },
    fnSearch() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitialize() {
      this.apiNm = ''
      this.apiUri = ''
    },
    fnShowAddPopup() {
      this.popup({
        component: () => import('@/views/env/program/ApiMgmtAddSvc'),
        title: this.$t('apiMgmt-regi'),
        width: '900',
        height: '500',
        data: {},
        callback: obj => {
          if (obj !== 'dimiss') {
            this.fnGetList()
          }
        }
      })
    },
    fnDeleteConfirm() {
      let rowIds = this.$refs.grid.getSelectionIndexs()
      if (rowIds.length === 0) {
        this.alert(this.$t('no-selected-row'), 'warning')
        return
      }
      this.confirm(this.$t('board-delete-confirm'), this.fnDeleteList)
    },
    fnDeleteList() {
      let rowIds = this.$refs.grid.getSelectionIndexs()
      let apiSeqList = []
      rowIds.forEach(id => {
        let data = this.dataList[id]
        apiSeqList.push(data.apiSeq)
      })
      let reqData = {
        apiSeqList: apiSeqList
      }
      requestApi({
        url: '/online/com/api/deleteIotApi',
        headers: {
          'X-MID': 'P00079'
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('del-success'), 'success')
            this.fnGetList()
          } else {
            this.alert(this.$t('del-fail'), 'error')
          }
        }
      })
    },
    fnShowModifyPopup: _.throttle(
      function(id) {
        let data = this.dataList[id]
        this.popup({
          component: () => import('@/views/env/program/ApiMgmtModifySvc'),
          title: this.$t('apiMgmt-mod'),
          width: '900',
          height: '500',
          data: {
            idx: data.apiSeq
          },
          callback: data => {
            this.fnGetList()
          }
        })
      },
      1000,
      { trailing: false }
    )
  }
}
</script>

<style lang="less" scoped>
</style>
