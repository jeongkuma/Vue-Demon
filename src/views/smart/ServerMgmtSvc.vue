<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <select
            id="selectedValue"
            class="form-control"
            v-model="selectedValue"
          >
            <option
              v-for="item in searchOpt"
              v-bind:Key="item.optVal"
              :value="item.optVal"
            >{{item.optName}}</option>
          </select>
        </div>
        <div class="form-group">
          <input
            type="text"
            class="form-control"
            v-model="retrieveValue"
            @keyup.enter="fnSearchList()"
            :readonly="selectedValue == 'all'"
          >
        </div>
        <div class="form-group">
          <button
            class="btn btn-info input-group-addon"
            type="button"
            @click="fnSearchList()"
          >{{$t('search')}}</button>
          <button
            class="btn btn-info"
            type="button"
            @click="fnInitialize()"
          >{{$t('initializing')}}</button>
        </div>
      </div>
    </div>
    <div class="text-left float-left pt-3 pl-2"></div>
    <div class="mb-2 text-right">
      <button
        type="button"
        class="btn btn-pink"
        data-toggle="modal"
        data-target="#modal-write"
        @click="addPopup()"
      >{{$t('registration')}}</button>
      <button
        type="button"
        class="btn btn-gray"
        data-toggle="modal"
        data-target="#modal-write"
        @click="delPopup()"
      >{{$t('delete')}}</button>
      <!-- <button type="button" class="btn btn-gray ">{{$t('delete')}}</button> -->
    </div>
    <jqgrid
      ref="grid"
      name="serverMgmtSvc"
      :colModels="colModelList"
      :colNames="colNameList"
      :dataList="dataList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      @onCellSelect="modifyPopup"
      @getDataList="fnGetList"
    ></jqgrid>
  </div>
</template>

<script>
import { requestApi } from '@/api/ccp/requestApi'
import Cookies from 'js-cookie'
import Jqgrid from '@/components/Jqgrid'

export default {
  name: 'ServerMgmtSvc',
  components: {
    Jqgrid
  },
  props: {},
  data() {
    return {
      dataList: [],
      colNameList: [
        this.$t('row-num'),
        this.$t('servMtServNm'),
        this.$t('servMtUrlIp'),
        this.$t('servMtPort')
      ],
      colModelList: [
        { name: 'seq', index: 'seq', align: 'center', hidden: true },
        {
          name: 'serverNm',
          index: 'serverNm',
          align: 'center',
          width: '100px'
        },
        { name: 'urlIp', index: 'urlIp', align: 'left' },
        { name: 'port', index: 'port', align: 'left' }
      ],
      retrieveValue: '',
      searchOpt: window.smartCodeInfo[Cookies.get('LOCALE')].servMgmtSearchOpt,
      modifyFlag: false,
      currentPage: 1,
      displayRowCount: 15,
      totPage: null,
      pageNum: null,
      langSetArr: [],
      langSet: '',
      pageInfo: [],
      xMid: 'P00302'
    }
  },
  created() {
    this.selectedValue = ''
    this.retrieveValue = ''
    this.langSet = Cookies.get('LOCALE')
    this.fnSearchList()
  },
  mounted() {
  },
  computed: {},
  methods: {
    fnInitialize() {
      this.selectedValue = ''
      this.retrieveValue = ''
      // 현재 페이지 설정
      this.currentPage = 1
      // this.fnGetList()
    },
    fnChkYN() {
      var res = 'N'
      var rowid = $('input[name="ch"]:checked').val()
      if (rowid !== undefined) {
        res = 'Y'
      }
      return res
    },
    fnOnlyOneChk(rowid) {
      if ($('#ch' + rowid).prop('checked') === true) {
        $('#ch' + rowid).prop('checked', false)
      } else {
        // 체크활성시 모든체크 해제
        $('input[name="ch"]').prop('checked', false)
        $('#ch' + rowid).prop('checked', true)
      }
    },
    fnSearchList() {
      // 현재 페이지 설정
      this.currentPage = 1
      this.fnGetList()
    },
    fnGetList() {
      var reqData = {}

      reqData.currentPage = this.currentPage
      reqData.displayRowCount = this.displayRowCount
      reqData.searchCon = this.selectedValue
      reqData.searchVal = this.retrieveValue
      reqData.langSet = this.langSet

      requestApi({
        url: '/online/bscpctrl/getSvrInfoList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.pageNum = res.data.page.page
          this.totPage = res.data.page.totPage
          this.pageInfo = res.data.page
          this.dataList = res.data.dataList
        }
      })
    },
    addPopup: _.throttle(
      function() {
        this.popup({
          component: () => import('@/views/smart/ServerMgmtAddSvc'),
          title: this.$t('serverAddSrv'),
          width: '450',
          height: '300',
          data: {
            obj: { seq: '', serverNm: '', urlIp: '', port: '' }
          },
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
          component: () => import('@/views/smart/ServerMgmtAddSvc'),
          title: this.$t('serverModSrv'),
          width: '450',
          height: '300',
          data: {
            obj: object
          },
          callback: data => {
            if (data !== 'dismiss') {
              this.fnGetList()
              this.modifyFlag = true
            }
          }
        })
      },
      1000,
      { trailing: false }
    ),
    delPopup: _.throttle(
      function() {
        let rowIds = this.$refs.grid.getSelectionIndexs()
        if (rowIds.length === 0) {
          this.alert(this.$t('lead-check-role'), 'warning')
          return false
        }
        this.confirm(this.$t('delYn'), this.confirmDeleteAPI)
      },
      1000,
      { trailing: false }
    ),
    confirmDeleteAPI() {
      let reqData = {}
      reqData.seqList = []
      let rowIds = this.$refs.grid.getSelectionIndexs()
      rowIds.forEach(row => {
        reqData.seqList.push(this.dataList[row].seq)
      })

      requestApi({
        url: '/online/bscpctrl/deleteSvrInfoList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          // 삭제실패시 처리필요
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('del-success'), 'success')
            this.fnGetList()
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
