<template>
  <div>
    <div class="search-box">
      <div class="form-inline">
        <div class="form-group">
          <select v-model="searchType" class="form-control">
            <option value="all">{{$t('all')}}</option>
            <option value="subject">{{$t('title')}}</option>
            <option value="content">{{$t('content')}}</option>
            <option value="custLoginNm">{{$t('post-content')}}</option>
          </select>
        </div>
        <div class="form-group">
          <input v-model="inputValue" type="text" class="form-control" maxlength="100">
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
          <button class="btn btn-info" @click="fnInitialize" type="button">{{$t('initializing')}}</button>
        </div>
      </div>
    </div>
    <div class="mb-2 btn-wrap text-right">
      <button type="button" class="btn btn-pink" @click="fnShowAddPopup">{{$t('create')}}</button>
      <button type="button" class="btn btn-gray" @click="fnDeleteConfirm">{{$t('delete')}}</button>
    </div>
    <jqgrid
      ref="grid"
      name="post"
      :colModels="colModelData"
      :colNames="colNameData"
      :dataList="postList"
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
import DatetimePicker from '@/components/DatetimePicker'
import Jqgrid from '@/components/Jqgrid'
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'PostSvc',
  components: {
    Jqgrid,
    DatetimePicker
  },
  props: {},
  data() {
    return {
      xMid: 'P00024',
      searchType: 'all',
      inputValue: null,
      startDate: null,
      endDate: null,
      currentPage: 1,
      totPage: '',
      displayRowCount: 15,
      postList: [],
      colNameData: [
        this.$t('post-title'),
        this.$t('post-content'),
        this.$t('post-fileCnt')
      ],
      colModelData: [
        { name: 'subject', index: 'subject', align: 'left', width: '150' },
        { name: 'regUsrId', index: 'regUsrId', align: 'center' },
        { name: 'regDate', index: 'regDate', align: 'center' }
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
        searchStartDttm: this.startDate,
        searchEndDttm: this.endDate,
        selectedValue: this.searchType,
        inputValue: this.inputValue
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
        url: '/online/IotPostBoard/retrieveIotPostBoardList',
        headers: {
          'X-MID': this.xMid
        },
        data: reqData,
        method: 'post',
        callback: res => {
          this.postList = res.data.boardList
          this.totPage = res.data.page.totPage
          this.roleCdId = res.data.roleCdId
          this.loginId = res.data.loginId
        }
      })
    },
    fnSearch() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitialize() {
      this.searchType = 'all'
      this.inputValue = ''
      this.fnInitDate()
    },
    fnShowAddPopup() {
      this.popup({
        component: () => import('@/views/board/post/PostAddSvc'),
        title: this.$t('post-create'),
        width: '700',
        height: '480',
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
        if (selectedIds.filter(id => this.postList[id].regUsrId !== this.loginId).length > 0) {
          this.alert(this.$t('board-reject-delete-check'))
          return
        }
      }

      this.confirm(this.$t('board-delete-confirm'), this.fnDelete)
    },
    fnDelete() {
      let selectedIds = this.$refs.grid.getSelectionIndexs()
      let postSeqList = []
      selectedIds.forEach(id => {
        let data = this.postList[id]
        postSeqList.push(data.postSeq)
      })
      var reqData = {
        postSepList: postSeqList
      }
      requestApi({
        url: '/online/IotPostBoard/deleteIotMultiPostBoard',
        headers: {
          'X-MID': 'P00024'
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
      let post = this.postList[id]
      this.popup({
        component: () => import('@/views/board/post/PostModifySvc'),
        title: this.$t('post-modify'),
        width: '700',
        height: '480',
        data: {
          post: post
        },
        callback: data => {
          this.fnGetList()
        }
      })
    }
  }
}
</script>

<style lang="less">
</style>
