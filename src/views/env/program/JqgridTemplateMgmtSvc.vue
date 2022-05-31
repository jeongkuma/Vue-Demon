<template>
  <div>
    <div class="search-box">
      <div class="form-inline">
        <div class="form-group">
          <span class="form-label mx-1">{{$t('prog-name')}}</span>
          <input type="text" class="form-control" placeholder="" title="검색어 입력" v-model="progNm">
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{$t('template-name')}}</span>
          <input type="text" class="form-control" placeholder="" title="검색어 입력" v-model="tmplCdNm">
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="search">{{$t('search')}}</button>
          <button class="btn btn-info" type="button" @click="fnInitializeSearch">{{$t('initializing')}}</button>
        </div>
      </div>
    </div>
    <div class="mb-2 text-right">
      <button type="button" class="btn btn-pink" @click="fnShowAddPopup">{{$t('registration')}}</button>
      <button type="button" class="btn btn-gray" @click="fnDeleteConfirm">{{$t('delete')}}</button>
    </div>
    <jqgrid
      ref="grid"
      name="tmplMgmt"
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
import { requestApi } from '@/api/ccp/requestApi'

export default {
  name: 'JqgridTemplateMgmtSvc',
  components: { Jqgrid },
  data() {
    return {
      xMid: 'P00071',
      progNm: '',
      tmplCdNm: '',
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      dataList: [],
      colNameData: [this.$t('prog-name'), this.$t('template-name'), this.$t('regUser'), this.$t('regDttm')],
      colModelData: [
        { name: 'progNm', index: 'progNms', align: 'left', width: '150' },
        { name: 'tmplCdNm', index: 'tmplCdNm', align: 'left', width: '200' },
        { name: 'regUsrId', index: 'regUsrId', align: 'left', width: '200' },
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
        tmplCdNm: this.tmplCdNm,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount
      }
      requestApi({
        url: '/online/com/tmpl/getIotJqgridTmpl',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.dataList = res.data.dataList
            this.totPage = res.data.page.totPage
          }
        }
      })
    },
    search() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitializeSearch() {
      this.progNm = ''
      this.tmplCdNm = ''
    },
    fnShowAddPopup() {
      this.popup({
        component: () => import('@/views/env/program/JqgridTemplateMgmtAddSvc'),
        title: this.$t('jqGridtemplate-regi'),
        width: '900',
        height: '700',
        data: {},
        callback: (obj) => {
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
      this.confirm(this.$t('delYn'), this.fnDelete)
    },
    fnDelete() {
      let rowIds = this.$refs.grid.getSelectionIndexs()
      let tmplSeqList = []

      rowIds.forEach(id => {
        let data = this.dataList[id]
        tmplSeqList.push(data.tmplSeq)
      })

      let reqData = {
        tmplSeqList: tmplSeqList
      }

      requestApi({
        url: '/online/com/tmpl/deleteIotTmpl',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('del-success'), 'success')
            this.fnGetList()
          } else {
            this.alert(this.$t('del-fail'))
          }
        }
      })
    },
    fnShowModifyPopup(id) {
      let data = this.dataList[id]
      this.popup({
        component: () => import('@/views/env/program/JqgridTemplateMgmtModifySvc'),
        title: this.$t('jqGridtemplate-mod'),
        width: '900',
        height: '700',
        data: {
          tmplSeq: data.tmplSeq
        },
        callback: (obj) => {
          if (obj !== 'dimiss') {
            this.fnGetList()
          }
        }
      })
    }
  }
}
</script>

<style></style>
