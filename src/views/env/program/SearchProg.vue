<template>
  <div>
    <div class="modal-body">
      <div class="form-inline">
        <div class="inline">
          <span class="form-control-static">{{$t('prog-name')}}</span>
          <input type="text" class="form-control" placeholder="" title="검색어 입력" v-model="searchProgNm" @keyup.enter="fnSearchList()">
          <button class="btn btn-info" type="button" @click="fnSearchList()">{{$t('search')}}</button>
          <button class="btn btn-info" type="button" @click="fnInitializing()">{{$t('initializing')}}</button>
        </div>
      </div>
      <div class="grid-container wide grid-scroll full-size">
        <div class="table-wrap y-scroll">
          <table class="table table-col">
            <caption>{{$t('cmCdSearchSrv')}}</caption>
            <colgroup>
              <col style="width:auto">
              <col style="width:auto">
              <col style="width:80px">
            </colgroup>
            <thead>
              <tr>
                <th v-for=" text in colNameData " v-bind:key="text" scope="col">{{text}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for=" item in dataList" v-bind:key="item.cdId">
                <td class="text-left">{{item.progNm}}</td>
                <td class="text-left">{{item.progId}}</td>
                <td><button @click="submit(item)" type="button" class="btn btn-info rounded btn-xs">{{$t('select')}}</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <pagination
          :currentPage.sync="pageInfo.currentPage"
          :rowCount.sync="pageInfo.rowCount"
          :totalPage="pageInfo.totalPage"
          :onPaging="pageInfo.callback"
          :rowCountArray="pageInfo.rowCountArray"
          ref="page"
        ></pagination>
      </div>
    </div>
    <div class="modal-footer">
      <div class="btn-wrap text-center">
        <button @click="close()" type="button" class="btn btn-gray" data-dismiss="modal">{{$t('close')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import Pagination from '@/components/Pagination'

export default {
  name: 'progSearchSrv',
  components: {
    Pagination
  },
  props: {
    data: Object,
    callback: {
      type: Function,
      required: true
    },
    close: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      colNameData: [this.$t('prog-name'), this.$t('prog-id'), this.$t('select')],
      dataList: [],
      searchProgNm: '',
      pageEventTriggerCount: 0,
      pageInfo: {
        currentPage: 1,
        totalPage: 1,
        rowCount: 5,
        rowCountArray: [5, 10, 15],
        callback: this.naviChange
      }
    }
  },
  created () {
    this.fnSearchList()
  },
  mounted () {},
  methods: {
    fnInitializing() {
      this.searchProgNm = ''
      this.pageInfo.currentPage = 1
      this.pageInfo.rowCount = 5
      this.pageEventTriggerCount = 0
      this.fnSearchList()
    },
    fnSearchList() {
      var paramObj = {}
      paramObj.progNm = this.searchProgNm
      paramObj.currentPage = this.pageInfo.currentPage
      paramObj.displayRowCount = this.pageInfo.rowCount
      requestApi({
        url: '/online/com/prog/getIotProg',
        headers: {
          'X-MID': 'P00061'
        },
        method: 'post',
        data: paramObj,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.dataList = res.data.dataList
            this.pageInfo.totalPage = res.data.page.totPage
          }
        }
      })
    },
    submit (obj) {
      this.callback(obj)
      this.close()
    },
    naviChange () {
      this.fnSearchList()
      this.pageEventTriggerCount++
    }
  }
}
</script>

<style lang="less">

</style>
