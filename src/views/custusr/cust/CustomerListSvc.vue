<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <select
            id="searchCon"
            class="form-control mr-1"
            v-model="searchCon"
          >
            <option
              v-for="item in searchOpt"
              v-bind:Key="item.optVal"
              :value="item.optVal"
              selected
            >{{item.otpName}}</option>
          </select>
          <input
            type="text"
            class="form-control"
            v-model="searchVal"
            @keyup.enter="fnSearch()"
            :readonly="searchCon == 'all'"
          >
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{$t('cust-status')}}</span>
          <select name class="form-control" v-model="useYn">
            <option
              v-for="item in usingOpt"
              v-bind:Key="item.optVal"
              :value="item.optVal"
            >{{item.otpName}}</option>
          </select>
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
    <div class="mb-2 btn-wrap text-right">
      <button
        type="button"
        class="btn btn-pink"
        @click="fnShowAddPopup()"
      >{{$t('registration')}}</button>
      <button type="button" class="btn btn-pink" @click="fnRejoin()">{{$t('rejoin')}}</button>
      <button type="button" class="btn btn-gray" @click="fnDeleteRow()">{{$t('unregisterd')}}</button>
    </div>
    <jqgrid
      ref="grid"
      name="customerList"
      :colModels="colModelList"
      :colNames="colNameList"
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
  name: 'CustomerListSvc',
  components: { Jqgrid },
  props: {},
  data() {
    return {
      searchCon: 'all',
      searchVal: null,
      useYn: 'all',
      currentPage: 1,
      displayRowCount: 15,
      totPage: null,
      dataList: [],
      colNameList: [
        'custSeq',
        this.$t('cust-login-id'),
        this.$t('cust-nm'),
        this.$t('cust-type-nm'),
        this.$t('contact-number'),
        this.$t('cust-reg-no'),
        this.$t('cust-status'),
        this.$t('regUsrId'),
        this.$t('regDttm')
      ],
      colModelList: [
        { name: 'custSeq', index: 'custSeq', align: 'center', hidden: true },
        { name: 'custLoginId', index: 'custLoginId', align: 'left' },
        { name: 'custNm', index: 'custNm', align: 'left' },
        { name: 'custTypeNm', index: 'custTypeNm', align: 'center' },
        { name: 'custTelNo', index: 'custTelNo', align: 'center' },
        { name: 'custRegNo', index: 'custRegNo', align: 'center' },
        { name: 'useYn', index: 'useYn', align: 'center' },
        { name: 'regUsrId', index: 'regUsrId', align: 'center' },
        { name: 'regDttm', index: 'regDttm', align: 'center' }
      ],
      searchOpt: [
        { otpName: this.$t('all'), optVal: 'all' },
        { otpName: this.$t('contact-number'), optVal: 'ctn' },
        { otpName: this.$t('cust-nm'), optVal: 'custNm' }
      ],
      usingOpt: [
        { otpName: this.$t('all'), optVal: 'all' },
        { otpName: this.$t('registerd'), optVal: 'Y' },
        { otpName: this.$t('unregisterd'), optVal: 'N' }
      ]
    }
  },
  created() {
    this.fnGetList()
  },
  mounted() {
  },
  computed: {},
  watch: {
    searchCon() {
      if (this.searchCon === 'all') {
        this.searchVal = ''
      }
    }
  },
  methods: {
    fnGetList() {
      var reqData = {
        searchCon: this.searchCon,
        searchVal: this.searchVal,
        useYn: this.useYn,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount
      }
      requestApi({
        url: '/online/iotcust/retrieveIotCust',
        headers: {
          'X-MID': 'P00036'
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.currentPage = res.data.page.page
          this.totPage = res.data.page.totPage

          res.data.dataList.forEach(row => {
            row.useYn =
              row.useYn === 'Y'
                ? this.$t('registerd')
                : this.$t('unregisterd')
            if (row.regDttm.length > 19) {
              row.regDttm = row.regDttm.substr(0, 19)
            }
          })

          this.dataList = res.data.dataList
        }
      })
    },
    fnInitialize() {
      this.searchVal = null
      this.searchCon = 'all'
      this.useYn = 'all'
      // this.fnSearch()
    },
    fnSearch() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnDeleteRow() {
      let rowIds = this.$refs.grid.getSelectionIndexs()
      if (rowIds.length === 0) {
        this.alert(this.$t('no-selected-row'), 'warning')
        return
      }
      this.confirm(this.$t('cust-unregi-yn'), this.fnDeleteApi)
    },
    fnDeleteApi() {
      let rowIds = this.$refs.grid.getSelectionIndexs()
      let deleteSeq = []
      rowIds.forEach(id => {
        let data = this.dataList[id]
        deleteSeq.push(data.custSeq)
      })
      let reqData = {
        deleteSeq: deleteSeq,
        useYn: 'N'
      }
      requestApi({
        url: '/online/iotcust/deleteIotCust',
        headers: {
          'X-MID': 'P00036'
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('cust-unregi-success'), 'success')
            this.fnGetList()
          }
        }
      })
    },
    fnRejoin() {
      let rowIds = this.$refs.grid.getSelectionIndexs()
      if (rowIds.length === 0) {
        this.alert(this.$t('no-selected-row'), 'warning')
        return
      }
      this.confirm(this.$t('rejoin-check'), this.fnRejoinApi)
    },
    fnRejoinApi() {
      let rowIds = this.$refs.grid.getSelectionIndexs()
      let deleteSeq = []
      rowIds.forEach(id => {
        let data = this.dataList[id]
        deleteSeq.push(data.custSeq)
      })
      let reqData = {
        deleteSeq: deleteSeq,
        useYn: 'Y'
      }
      requestApi({
        url: '/online/iotcust/rejoinIotCust',
        headers: {
          'X-MID': 'P00036'
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('rejoin-success'), 'success')
            this.fnGetList()
          }
        }
      })
    },
    fnShowAddPopup: _.throttle(
      function() {
        this.popup({
          component: () => import('@/views/custusr/cust/CustomerAddSvc'),
          title: this.$t('cust-regi'),
          width: '900',
          height: '540',
          data: {},
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
    fnShowModifyPopup: _.throttle(
      function(id) {
        let data = this.dataList[id]

        this.popup({
          component: () => import('@/views/custusr/cust/CustomerModifySvc'),
          title: this.$t('cust-mod'),
          width: '900',
          height: '450',
          data: {
            custSeq: data.custSeq
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
