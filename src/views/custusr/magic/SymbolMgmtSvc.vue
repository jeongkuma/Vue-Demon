<template>
  <div>
    <div class="search-box form-inline">
      <div class="form-group">
        <span class="form-label mx-1">{{ $t('symbol-name') }}</span>
        <input
          v-model="symNm"
          type="text"
          class="form-control"
          @keyup.enter="fnSearch"
        />
      </div>
      <div class="form-group">
        <span class="form-label mx-1">{{ $t('symbol-type') }}</span>
        <select v-model="symType" class="form-control">
          <option value="">{{ $t('select') }}</option>
          <option
            v-for="(cd, index) in symTypeList"
            :key="`symType-${index}`"
            :value="cd.cdId"
          >
            {{ cd.cdNm }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <button type="button" class="btn btn-info" @click="fnSearch">
          {{ $t('search') }}
        </button>
        <button type="button" class="btn btn-info" @click="fnInitialize">
          {{ $t('initializing') }}
        </button>
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
      name="symbol"
      :colModels="colModelData"
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
import { requestApi } from '@/api/ccp/requestApi'
import { getCommonCodeByParentCdId } from '@/api/common/code'

export default {
  name: 'SymbolMgmtSvc',
  components: { Jqgrid },
  data() {
    return {
      xMid: 'P20049',
      symNm: '',
      symType: '',
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      dataList: [],
      colNameList: [this.$t('symbol-name'), this.$t('symbol-type'), this.$t('regUser'), this.$t('regDttm')],
      colModelData: [
        { name: 'symNm', index: 'symNm', align: 'center', width: '100' },
        {
          name: 'symTypeNm',
          index: 'symTypeNm',
          align: 'center',
          width: '100'
        },
        { name: 'regUsrId', index: 'regUsrId', align: 'center', width: '100' },
        { name: 'regDttm', index: 'regDttm', align: 'center', width: '100' }
      ],
      symTypeList: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.fnGetSymTypeList()
  },
  mounted() {
    this.fnGetList()
  },
  methods: {
    fnGetSymTypeList() {
      getCommonCodeByParentCdId({ parentCdId: 'GN00000341' }).then(data => {
        this.symTypeList = data
      })
    },
    fnGetList() {
      let reqData = {
        symNm: this.symNm,
        symType: this.symType,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount
      }
      requestApi({
        url: '/online/iotsym/retrieveSymbolList',
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
    fnSearch() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitialize() {
      this.symNm = ''
      this.symType = ''
    },
    fnShowAddPopup() {
      this.popup({
        component: () => import('@/views/custusr/magic/SymbolAddModifySvc'),
        title: this.$t('symbol-registration'),
        width: 'wide',
        height: '650',
        data: {},
        callback: data => {
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
      let symSeqArr = []
      rowIds.forEach(id => {
        symSeqArr.push(this.dataList[id].symSeq)
      })
      requestApi({
        url: '/online/iotsym/deleteSymbol',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {
          symSeqArr: symSeqArr
        },
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
        component: () => import('@/views/custusr/magic/SymbolAddModifySvc'),
        title: this.$t('symbol-modify'),
        width: 'wide',
        height: '650',
        data: {
          symSeq: data.symSeq
        },
        callback: data => {
          this.fnGetList()
        }
      })
    }
  }
}
</script>

<style></style>
