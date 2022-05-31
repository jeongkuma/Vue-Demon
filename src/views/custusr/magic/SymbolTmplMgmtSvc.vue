<template>
  <div>
    <div class="search-box form-inline">
      <div class="form-group">
        <span class="form-label mx-1">{{$t('service')}}</span>
        <select v-model="svcCd" class="form-control">
          <option value="">{{ $t('all') }}</option>
          <option v-for="(svc, index) in svcCdList" :key="`svcCd-${index}`" :value="svc.svcCd">{{ svc.svcCdNm }}</option>
        </select>
      </div>
      <div class="form-group">
        <span class="form-label mx-1">{{$t('dev-cls')}}</span>
        <select v-model="devClsCd" class="form-control">
          <option value="">{{$t('all')}}</option>
          <option v-for="devCls in devClsList" :key="'devCls'+devCls.devClsCd" :value="devCls.devClsCd">{{ devCls.devClsNm }}</option>
        </select>
      </div>
      <div class="form-group">
        <span class="form-label mx-1">{{$t('dev-mdl-nm')}}</span>
        <select v-model="devMdlCd" class="form-control">
          <option value="" >{{$t('all')}}</option>
          <option v-for="devMdl in devMdlList" v-bind:key="devMdl.devMdlCd" :value="devMdl.devMdlCd">{{devMdl.devMdlNm}}</option>
        </select>
      </div>
      <div class="form-group">
        <span class="form-label mx-1">{{$t('template-name')}}</span>
        <input v-model="tmplNm" type="text" class="form-control" @keyup.enter="fnSearch" />
      </div>
      <div class="form-group">
        <span class="form-label mx-1">{{$t('symbol')}}</span>
        <select v-model="symSeq" class="form-control">
          <option value="" >{{$t('all')}}</option>
          <option v-for="symbol in symbolList" v-bind:key="symbol.symSeq" :value="symbol.symSeq">{{symbol.symNm}}</option>
        </select>
      </div>
      <div class="form-group">
        <button type="button" class="btn btn-info" @click="fnSearch">{{ $t('search') }}</button>
        <button type="button" class="btn btn-info" @click="fnInitialize">
          {{ $t('initializing') }}
        </button>
      </div>
    </div>
    <div class="mb-2 text-right">
      <button type="button" class="btn btn-pink" @click="fnShowAddPopup">{{ $t('registration') }}</button>
      <button type="button" class="btn btn-gray" @click="fnDeleteConfirm">{{ $t('delete') }}</button>
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
import { getSvcList, getDevClsCdListBySvcCd, getDevMdlListByDevCls } from '@/api/common/usrSvcDevice'

export default {
  name: 'SymbolTmplMgntSvc',
  components: { Jqgrid },
  data() {
    return {
      xMid: 'P20051',
      svcCd: '',
      devClsCd: '',
      devMdlCd: '',
      tmplNm: '',
      symSeq: '',
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      dataList: [],
      colModelData: [
        { name: 'svcNm', index: 'svcNm', align: 'center' },
        { name: 'devClsCdNm', index: 'devClsCdNm', align: 'left' },
        { name: 'devMdlNm', index: 'devMdlNm', align: 'left' },
        { name: 'tmplNm', index: 'tmplNm', align: 'left' },
        { name: 'symNm', index: 'symNm', align: 'left' },
        { name: 'regUsrId', index: 'regUsrId', align: 'center' },
        { name: 'regDttm', index: 'regDttm', align: 'center' }
      ],
      colNameList: [
        this.$t('service'),
        this.$t('dev-cls'),
        this.$t('dev-mdl'),
        this.$t('template-name'),
        this.$t('symbol-name'),
        this.$t('regUser'),
        this.$t('regDttm')
      ],
      svcCdList: [],
      devClsList: [],
      devMdlList: [],
      symbolList: []
    }
  },
  computed: {},
  watch: {
    svcCd() {
      this.fnGetDevClsList()
    },
    devClsCd() {
      this.fnGetModelList()
    }
  },
  created() {
    this.fnGetSvcCdList()
    this.fnGetSymbolList()
  },
  mounted() {
    this.fnGetList()
  },
  methods: {
    // -------------------- 검색 옵션 조회
    fnGetSvcCdList() {
      getSvcList({ xMid: this.xMid })
        .then((data) => {
          this.svcCdList = data
        })
    },
    fnGetDevClsList() {
      // 선택값 초기화
      this.devClsCd = ''
      this.devClsList = []
      if (this.svcCd === '') {
        return false
      }
      getDevClsCdListBySvcCd({ svcCd: this.svcCd, xMid: this.xMid })
        .then((data) => {
          this.devClsList = data.devClsList
        })
    },
    fnGetModelList () {
      this.devMdlList = []
      this.devMdlCd = ''
      if (this.devClsCd === '') {
        return false
      }
      getDevMdlListByDevCls({ devClsCd: this.devClsCd }, this.xMid)
        .then(data => {
          this.devMdlList = data
        })
    },
    fnGetSymbolList() {
      // 별도의 API 만들지 않고 기존 심볼 조회 API 사용
      let reqData = {
        currentPage: 1,
        displayRowCount: 9999
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
            this.symbolList = res.data.dataList
          }
        }
      })
    },
    // -------------------- 목록 조회
    fnGetList() {
      let reqData = {
        svcCd: this.svcCd,
        devClsCd: this.devClsCd,
        devMdlCd: this.devMdlCd,
        tmplNm: this.tmplNm,
        symSeq: this.symSeq,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount
      }
      requestApi({
        url: '/online/iotsym/retrieveSymbolTmplList',
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
      this.svcCd = ''
      this.devClsCd = ''
      this.devMdlCd = ''
      this.tmplNm = ''
      this.symSeq = ''
    },
    // -------------------- 기능
    fnShowAddPopup() {
      this.popup({
        component: () => import('@/views/custusr/magic/SymbolTmplAddModifySvc'),
        title: this.$t('symbol-tmpl-registration'),
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
      let tmplSeqArr = []
      rowIds.forEach(id => {
        tmplSeqArr.push(this.dataList[id].tmplSeq)
      })
      requestApi({
        url: '/online/iotsym/deleteSymbolTmpl',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {
          tmplSeqArr: tmplSeqArr
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
        component: () => import('@/views/custusr/magic/SymbolTmplAddModifySvc'),
        title: this.$t('symbol-tmpl-modify'),
        width: 'wide',
        height: '650',
        data: {
          tmplSeq: data.tmplSeq
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
