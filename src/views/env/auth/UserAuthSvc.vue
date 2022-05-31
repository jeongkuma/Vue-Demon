<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <span class="form-label mx-1">{{$t('grade')}}</span>
          <select v-model="roleType" class="form-control">
            <option value="all">{{$t('all')}}</option>
            <option
              v-for="roleCd in roleCdList"
              :key="roleCd.roleCdId"
              :value="roleCd.roleCdId"
            >{{roleCd.roleCdNm}}</option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{$t('menu-name')}}</span>
          <input type="text" class="form-control" v-model="inputValue" @keyup.enter="fnSearch">
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="fnSearch()">{{$t('search')}}</button>
          <button class="btn btn-info" type="button" @click="fnInitialize()">{{$t('initializing')}}</button>
        </div>
      </div>
    </div>
    <div class="mb-2 text-right">
      <button
        type="button"
        class="btn btn-pink"
        @click="fnShowAddPopup()"
      >{{$t('menu-authority-management')}}</button>
      <button type="button" class="btn btn-gray" @click="fnDeleteConfirm()">{{$t('delete')}}</button>
    </div>
    <jqgrid
      ref="grid"
      name="roleMap"
      :colModels="colModelData"
      :colNames="colNameData"
      :dataList="roleMapList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      @getDataList="fnGetList"
    >
    </jqgrid>
  </div>
</template>

<script>
import Jqgrid from '@/components/Jqgrid'
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'UsrAuthSvc',
  components: { Jqgrid },
  props: {},
  data() {
    return {
      roleType: 'all',
      inputValue: null,
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      roleMapList: [],
      colNameData: [this.$t('grade'), this.$t('menu'), this.$t('regDttm')],
      colModelData: [
        { name: 'roleCdNm', index: 'roleCdNm', align: 'left', width: '120' },
        { name: 'menuProgNm', index: 'menuProgNm', align: 'left', width: '120' },
        { name: 'regDttm', index: 'regDttm', align: 'center', width: '120' }
      ],
      roleCdList: null,
      selectedRow: []
    }
  },
  created() {
    this.fnGetList()
  },
  mounted() {
  },
  methods: {
    fnSearch() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitialize() {
      this.roleType = 'all'
      this.inputValue = null
      // this.fnSearch()
    },
    fnGetList() {
      var reqData = {
        parentRoleCd: 'GN00000002',
        roleType: this.roleType,
        inputValue: this.inputValue,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount
      }

      requestApi({
        url: '/online/iotrolemap/retrieveIotRoleMapList',
        headers: {
          'X-MID': 'P00062'
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.totPage = res.data.page.totPage
          this.currentPage = res.data.page.page
          this.roleMapList = res.data.roleMapList
          this.roleCdList = res.data.roleCdList // 등급 리스트
        }
      })
    },
    fnShowAddPopup() {
      this.popup({
        component: () => import('@/views/env/auth/ManageMenuSvc'),
        title: this.$t('manage-menu'),
        width: '500',
        height: '880',
        data: {
          roleList: this.roleCdList
        },
        callback: data => {
          this.fnGetList()
        }
      })
    },
    fnDeleteConfirm() {
      let idArr = this.$refs.grid.getSelectionIndexs()
      if (idArr.length === 0) {
        this.alert(this.$t('lead-check-role'), 'warning')
        return
      }

      this.confirm(this.$t('delete-role-confirm'), this.fnDelete)
    },
    fnDelete() {
      let idArr = this.$refs.grid.getSelectionIndexs()
      let roleSeqList = []
      idArr.forEach(id => {
        let data = this.roleMapList[id]
        roleSeqList.push(data.roleSeq)
      })
      var reqData = {
        roleSeqList: roleSeqList
      }
      requestApi({
        url: '/online/iotrolemap/deleteIotRoleMap',
        headers: {
          'X-MID': 'P00062'
        },
        method: 'post',
        data: reqData,
        callback: data => {
          this.alert(this.$t('del-success'), 'success')
          this.fnGetList(true)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
