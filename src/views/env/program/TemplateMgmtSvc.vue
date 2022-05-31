<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <span class="form-control-static">{{ $t('prog-name') }}</span>
        </div>
        <div class="form-group">
          <input
            type="text"
            class="form-control"
            placeholder
            title="검색어 입력"
            v-model="progNm"
          />
        </div>
        <div class="form-group">
          <span class="form-control-static">{{ $t('template-name') }}</span>
        </div>
        <div class="form-group">
          <input
            type="text"
            class="form-control"
            placeholder
            title="검색어 입력"
            v-model="tmplCdNm"
          />
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="search">
            {{ $t('search') }}
          </button>
          <button
            class="btn btn-info"
            type="button"
            @click="fnInitializeSearch"
          >
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
  name: 'TemplateMgmtSvc',
  components: { Jqgrid },
  data() {
    return {
      xMid: 'P00085',
      tmplCdNm: '',
      progNm: '',
      currentPage: 1,
      displayRowCount: 15,
      totPage: 1,
      dataList: [],
      colNameData: [
        this.$t('prog-name'),
        this.$t('template-name'),
        this.$t('regUser'),
        this.$t('regDttm')
      ],
      colModelData: [
        { name: 'progNm', index: 'progNms', align: 'left', width: '150' },
        { name: 'tmplCdNm', index: 'tmplCdNm', align: 'left', width: '200' },
        { name: 'regUsrId', index: 'regUsrId', align: 'left', width: '200' },
        { name: 'regDttm', index: 'regDttm', align: 'center', width: '300' }
      ]
    }
  },
  created() {
    this.fnGetList()
  },
  mounted() {},
  computed: {},
  methods: {
    fnGetList() {
      let reqData = {
        progNm: this.progNm,
        tmplCdNm: this.tmplCdNm,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount
      }
      requestApi({
        url: '/online/com/tmpl/getIotTmpl',
        headers: {
          'X-MID': this.xMid
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
    search() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitializeSearch() {
      this.tmplCdNm = ''
      this.progNm = ''
    },
    fnShowAddPopup() {
      this.popup({
        component: () => import('@/views/env/program/TemplateMgmtAddSvc'),
        title: this.$t('template-regi'),
        width: '700',
        height: '470',
        data: {},
        callback: res => {
          this.fnGetList()
        }
      })
    },
    fnShowModifyPopup(id, index, contents, event) {
      let data = this.dataList[id]
      this.popup({
        component: () => import('@/views/env/program/TemplateMgmtModifySvc'),
        title: this.$t('template-mod'),
        width: '700',
        height: '470',
        data: {
          idx: data.tmplSeq
        },
        callback: obj => {
          this.fnGetList()
        }
      })
    },
    fnDeleteConfirm() {
      let idArr = this.$refs.grid.getSelectionIndexs()
      if (idArr.length === 0) {
        this.alert(this.$t('no-selected-row'), 'warning')
        return
      }
      this.confirm(this.$t('delYn'), this.fnDelete)
    },
    fnDelete() {
      let idArr = this.$refs.grid.getSelectionIndexs()
      let rowNum = this.$refs.grid.getGridReccount()
      let tmplSeqList = []
      idArr.forEach(id => {
        tmplSeqList.push(this.dataList[id].tmplSeq)
      })
      requestApi({
        url: '/online/com/tmpl/deleteIotTmpl',
        headers: {
          'X-MID': 'P00085'
        },
        method: 'post',
        data: { tmplSeqList },
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('del-success'), 'success')
            // 삭제시 마지막 페이지 계산
            // 삭제했을 경우 마지막 페이지 이면서 행의 수가 없으면 마지막페이지가 아닌 바로 전 페이지로 이동
            if (this.currentPage === this.totPage) {
              if (parseInt(rowNum) === tmplSeqList.length) {
                if (this.currentPage !== 1) {
                  this.currentPage = this.currentPage - 1
                }
              }
            }
            this.fnGetList()
          } else {
            this.alert(this.$t('del-fail'))
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
