<template>
  <div>
    <div class="search-box">
      <div class="form-inline">
        <div class="form-group">
          <select v-model="searchType" class="form-control">
            <option value="all">{{$t('all')}}</option>
            <option value="subject">{{$t('library-search-title')}}</option>
            <option value="content">{{$t('library-content')}}</option>
          </select>
        </div>
        <div class="form-group">
          <input
            v-model="inputValue"
            type="text"
            class="form-control"
            maxlength="100"
            @keyup.enter="fnGetList"
          >
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{$t('duration-search')}}</span>
          <datetime-picker
            :isPair="true"
            :startDate.sync="startDate"
            :endDate.sync="endDate"
            :duration="{days:31}"
          ></datetime-picker>
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="fnSearch">{{$t('search')}}</button>
          <button class="btn btn-info" @click="fnInitialize()" type="button">{{$t('initializing')}}</button>
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
      >{{$t('create')}}</button>
      <button type="button" class="btn btn-gray" @click="fnDeleteConfirm">{{$t('delete')}}</button>
    </div>
    <jqgrid
      ref="grid"
      name="lib"
      :colModels="colModelData"
      :colNames="colNameData"
      :dataList="libList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      @onCellSelect="fnShowModifyPopup"
      @getDataList="fnGetList"
    ></jqgrid>
  </div>
</template>

<script>
import moment from 'moment'
import Jqgrid from '@/components/Jqgrid'
import DatetimePicker from '@/components/DatetimePicker'
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'LibSvc',
  components: {
    Jqgrid,
    DatetimePicker
  },
  props: {},
  data() {
    return {
      xMid: 'P00027',
      xApiversion: '1',
      searchType: 'all',
      inputValue: null,
      startDate: null,
      endDate: null,
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      libList: [],
      colNameData: [
        this.$t('library-title'),
        this.$t('library-fileCnt'),
        this.$t('library-regUserId'),
        this.$t('library-regDttm')
      ],
      colModelData: [
        { name: 'subject', index: 'subject', align: 'left', width: '250' },
        { name: 'fileCnt', index: 'fileCnt', align: 'center', width: '30' },
        { name: 'regUsrId', index: 'regUsrId', align: 'left', width: '100' },
        { name: 'regDttm', index: 'regDttm', align: 'center', width: '100' }
      ],
      roleCdId: null,
      loginId: null
    }
  },
  computed: {
    deletable() {
      return this.roleCdId === 'GN00000033'
    }
  },
  created() {},
  mounted() {
    this.fnInitDate()
    this.fnGetList()
  },
  methods: {
    fnInitDate() {
      this.startDate = moment()
        .subtract(3, 'months')
        .toDate()
      this.endDate = null
    },
    fnGetList() {
      let reqData = {
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount,
        selectedValue: this.searchType,
        inputValue: this.inputValue,
        searchStartDttm: this.startDate,
        searchEndDttm: this.endDate
      }
      if (this.inputValue) {
        if (this.searchType === 'all') {
          reqData.allSearch = this.inputValue
        } else if (this.searchType === 'subject') {
          reqData.subject = this.inputValue
        } else if (this.searchType === 'content') {
          reqData.content = this.inputValue
        }
      }
      if (!this.endDate) {
        reqData.searchEndDttm = '99991231'
      }
      requestApi({
        url: '/online/IotlibraryBoard/retrieveIotLibraryBoardList',
        headers: {
          'X-MID': this.xMid,
          'X-APIVERSION': this.xApiversion
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.roleCdId = res.data.roleCdId
          this.loginId = res.data.loginId
          this.libList = res.data.boardList
          this.totPage = res.data.page.totPage
          this.currentPage = res.data.page.page
        }
      })
    },
    fnSearch() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitialize() {
      this.searchType = 'all'
      this.inputValue = null
      this.fnInitDate()
    },
    fnShowAddPopup() {
      this.popup({
        component: () => import('@/views/board/lib/LibAddSvc'),
        title: this.$t('lib-create'),
        width: '700',
        height: '520',
        data: {},
        callback: data => {
          this.fnGetList()
        }
      })
    },
    fnDeleteConfirm() {
      let selectedIds = this.$refs.grid.getSelectionIndexs()
      if (selectedIds.length === 0) {
        this.alert(this.$t('board-delete-no-check'), 'warning')
        return
      }
      if (!this.deletable) {
        if (selectedIds.filter(id => this.libList[id].regUsrId !== this.loginId).length > 0) {
          this.alert(this.$t('board-reject-delete-check'))
          return
        }
      }
      this.confirm(this.$t('board-delete-confirm'), this.fnDelete)
    },
    fnDelete() {
      let selectedIds = this.$refs.grid.getSelectionIndexs()
      let libSeqList = []
      selectedIds.forEach(id => {
        let data = this.libList[id]
        libSeqList.push(data.libSeq)
      })
      var reqData = {
        libSepList: libSeqList
      }
      requestApi({
        url: '/online/IotlibraryBoard/deleteIotMultiLibraryBoard',
        headers: {
          'X-MID': this.xMid,
          'X-APIVERSION': this.xApiversion
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.alert(this.$t('del-success'), 'success')
          this.fnGetList()
        }
      })
    },
    fnShowModifyPopup(id) {
      let lib = this.libList[id]
      this.popup({
        component: () => import('@/views/board/lib/LibModifySvc'),
        title: this.$t('lib-modify'),
        width: '700',
        height: '480',
        data: {
          lib: lib
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
