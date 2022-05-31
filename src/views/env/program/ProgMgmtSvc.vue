<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('prog-name') }}</span>
          <input
            v-model="progNm"
            type="text"
            class="form-control"
            placeholder
            title="검색어 입력"
            @keyup.enter="fnSearch"
          />
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('router-path') }}</span>
          <input
            v-model="uiPath"
            type="text"
            class="form-control"
            placeholder
            title="검색어 입력"
            @keyup.enter="fnSearch"
          />
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="fnSearch">
            {{ $t('search') }}
          </button>
          <button class="btn btn-info" type="button" @click="fnInitialize">
            {{ $t('initializing') }}
          </button>
        </div>
      </div>
    </div>
    <div class="mb-2 text-right">
      <button type="button" class="btn btn-pink" @click="fnShowAddPopup">
        {{ $t('registration') }}
      </button>
      <button type="button" class="btn btn-gray" @click="fnDeleteConfirm">
        {{ $t('delete') }}
      </button>
    </div>
    <jqgrid
      ref="grid"
      name="progMgmt"
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
  name: 'ProgMgmtSvc',
  components: { Jqgrid },
  data() {
    return {
      progNm: '',
      uiPath: '',
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      dataList: [],
      colNameData: [
        this.$t('prog-id'),
        this.$t('prog-name'),
        this.$t('router-path'),
        this.$t('useYn'),
        this.$t('regUser'),
        this.$t('regDttm')
      ],
      colModelData: [
        { name: 'progId', index: 'progId', align: 'center', width: '100' },
        { name: 'progNm', index: 'progNm', align: 'left', width: '300' },
        { name: 'uiPath', index: 'uiPath', align: 'left', width: '300' },
        { name: 'useYn', index: 'useYn', align: 'center', width: '100' },
        { name: 'regUsrId', index: 'regUsrId', align: 'center', width: '200' },
        { name: 'regDttm', index: 'regDttm', align: 'center', width: '300' }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.fnGetList()
  },
  methods: {
    fnGetList() {
      let reqData = {
        progNm: this.progNm,
        uiPath: this.uiPath,
        currentPage: 1,
        displayRowCount: 15
      }
      requestApi({
        url: '/online/com/prog/getIotProg',
        headers: {
          'X-MID': 'P00082'
        },
        method: 'post',
        data: reqData,
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
      this.progNm = ''
      this.uiPath = ''
    },
    fnShowAddPopup() {
      this.popup({
        component: () => import('@/views/env/program/ProgMgmtAddSvc'),
        title: this.$t('prog-regi'),
        width: '700',
        height: '360',
        data: {},
        callback: obj => {
          this.fnGetList()
        }
      })
    },
    fnDeleteConfirm() {
      let rowIds = this.$refs.grid.getSelectionIndexs()
      if (rowIds.length === 0) {
        this.alert(this.$t('no-selected-row'))
        return
      }
      this.confirm(this.$t('board-delete-confirm'), this.fnDelete)
    },
    fnDelete() {
      let rowIds = this.$refs.grid.getSelectionIndexs()
      let progSeqList = []
      rowIds.forEach(id => {
        let data = this.dataList[id]
        progSeqList.push(data.progSeq)
      })
      let reqData = {
        progSeqList: progSeqList
      }
      requestApi({
        url: '/online/com/prog/deleteIotProg',
        headers: {
          'X-MID': 'P00082'
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
    },
    fnShowModifyPopup(id) {
      let data = this.dataList[id]
      this.popup({
        component: () => import('@/views/env/program/ProgMgmtModifySvc'),
        title: this.$t('prog-mod'),
        width: '700',
        height: '360',
        data: {
          idx: data.progSeq
        },
        callback: obj => {
          this.fnGetList()
        }
      })
    }
  }
}
</script>

<style></style>
