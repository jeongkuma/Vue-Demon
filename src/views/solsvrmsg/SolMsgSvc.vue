<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('msg-nm') }}</span>
          <input
            type="text"
            class="form-control"
            style="width: 250px;"
            v-model="dataObj.msgNm"
          />
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('useYn') }}</span>
          <select name class="form-control" v-model="dataObj.useYn">
              <option
              v-for="item in useYnList"
              v-bind:key="item.key"
              :value="item.value"
              >{{ item.key }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="search()">
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
      <button type="button" class="btn btn-pink" @click="memoryPopup('solution',$t('memory-sync'))">
        {{ $t('memory-sync') }}
      </button>
      <button type="button" class="btn btn-gray" @click="deleteConfirm">
        {{ $t('delete') }}
      </button>
    </div>
    <jqgrid
      ref="grid"
      name="solMsgSvc"
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
import { requestApi, requestDownloadApi } from '@/api/ccp/requestApi'
import Jqgrid from '@/components/Jqgrid'

export default {
  name: 'solsvrmsg-list',
  components: {
    Jqgrid
  },
  props: {},
  data() {
    return {
      isSearch: false,
      colNameList: [
        '',
        this.$t('msg-nm'),
        this.$t('useYn'),
        this.$t('regDttm')
      ],
      colModelList: [
        {
          name: 'solMsgMSeq',
          index: 'solMsgMSeq',
          align: 'left',
          width: '150',
          hidden: true
        },
        { name: 'msgNm', index: 'msgNm', align: 'left', width: '100' },
        { name: 'useYn', index: 'useYn', align: 'center', width: '100' },
        { name: 'regDttm', index: 'regDttm', align: 'center', width: '100' }
      ],
      useYnList: [
        { value: '', key: '전체' },
        { value: 'Y', key: '사용' },
        { value: 'N', key: '사용안함' }
      ],
      dataList: [],
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
      dataObj: {
        useYn: 'Y',
        certKey: null,
        msgNm: '',
        svcCd: ''
      },
      isFirst: true,
      xMid: 'P30060'
    }
  },
  created() {
    this.search()
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    search() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitialize() {
      this.dataObj.msgNm = ''
      this.dataObj.useYn = 'Y'
    },
    fnGetList() {
      let reqData = {}

      reqData.currentPage = this.currentPage
      reqData.displayRowCount = this.displayRowCount
      reqData.msgNm = this.dataObj.msgNm
      reqData.useYn = this.dataObj.useYn

      requestApi({
        url: '/online/solsvrmsg/retrieveSolMsgList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.dataList = res.data.solSvrMsgList
          this.totPage = res.data.page.totPage
          this.currentPage = res.data.page.page
        }
      })
    },
    fnExcellDown() {
      let reqData = {}
      reqData.currentPage = this.currentPage
      reqData.displayRowCount = this.displayRowCount
      reqData.msgNm = this.dataObj.msgNm
      reqData.useYn = this.dataObj.useYn

      requestDownloadApi({
        url: '/online/solsvrmsg/retrieveSolMsgExcel',
        headers: {
          'X-MID': this.xMid
        },
        data: reqData,
        callback: data => {}
      })
    },
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
          if (res !== 'dismiss') {}
        }
      })
    },
    fnAddPopup: _.throttle(
      function() {
        let params = {}
        this.popup({
          component: () => import('@/views/solsvrmsg/SolMsgAddSvc'),
          title: this.$t('solsvrmsg-create'),
          width: '900',
          height: '500',
          data: params,
          callback: (data) => {
            if (data !== 'dimiss') {
              this.fnGetList()
            }
          }
        })
      },
      1000, { trailing: false }
    ),
    modifyPopup: _.throttle(
      function (id, index, contents, event) {
        let object = this.dataList[id]
        // console.log(param)
        this.popup({
          component: () => import('@/views/solsvrmsg/SolMsgModSvc'),
          title: this.$t('solsvrmsg-modify'),
          width: '900',
          height: '600',
          data: object,
          callback: (data) => {
            if (data !== 'dismiss') {
              this.fnGetList()
            }
          }
        })
      },
      1000,
      { trailing: false }
    ),
    deleteConfirm() {
      let rowIds = this.$refs.grid.getSelectionIndexs()
      if (rowIds.length === 0) {
        this.alert(this.$t('lead-check-role'), 'warning')
        return false
      }
      this.confirm(this.$t('delYn'), this.deleteApi)
    },
    deleteApi() {
      let reqData = {}
      reqData.deleteList = []
      let rowIds = this.$refs.grid.getSelectionIndexs()
      rowIds.forEach(row => {
        reqData.deleteList.push(this.dataList[row].solMsgMSeq)
      })
      requestApi({
        url: '/online/solsvrmsg/deleteSolMsg',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
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

<style lang="less"></style>
