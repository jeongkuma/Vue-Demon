<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <select id="searchCon" class="form-control mr-1" v-model="searchCon">
            <option v-for="item in searchOpt" v-bind:Key="item.optVal" :value="item.optVal">{{item.otpName}}</option>
          </select>
          <input type="text" class="form-control" v-model="searchVal" @keyup.enter="fnGetList()" :readonly="searchCon == 'all'">
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{$t('usrLckYn')}}</span>
          <select id="lockVal" class="form-control" v-model="usrLckYn" >
            <option v-for="item in lockOpt" v-bind:Key="item.optVal" :value="item.optVal">{{item.otpName}}</option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{$t('dormancy-chk')}}</span>
          <select id="sleepVal" class="form-control" v-model="usrSlpYn" >
            <option v-for="item in sleepOtp" v-bind:Key="item.optVal" :value="item.optVal">{{item.otpName}}</option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{$t('termsAgrYn')}}</span>
          <select id="agreeVal" class="form-control" v-model="termsAgrYn" >
            <option v-for="item in agreeOpt" v-bind:Key="item.optVal" :value="item.optVal">{{item.otpName}}</option>
          </select>
        </div>
        <div class="form-group" v-show="isAdmin">
          <span class="form-label mx-1">{{$t('custTypeCdId')}}</span>
          <select id="searchCon" class="form-control" v-model="custSeq" >
            <option v-for="item in custList" v-bind:Key="item.custSeq" :value="item.custSeq">{{item.custNm}}</option>
          </select>
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="fnSearch">{{$t('search')}}</button>
          <button class="btn btn-info" type="button" @click="fnInitialize">{{$t('initializing')}}</button>
        </div>
      </div>
    </div>
    <div class="mb-2 btn-wrap text-right">
      <button type="button" class="btn btn-pink" @click="fnShowAddAllPoup" :disabled="!isAdmin">{{$t('addAll')}}</button>
      <button type="button" class="btn btn-pink" @click="fnShowAddPopup" :disabled="!isAdmin">{{$t('registration')}}</button>
      <button type="button" class="btn btn-pink" @click="fnPwInit">{{$t('initPw')}}</button>
      <button type="button" class="btn btn-pink" @click="fnUnlock">{{$t('unlock')}}</button>
      <button type="button" class="btn btn-pink" @click="fnReleaseDmc">{{$t('unLockDormancy')}}</button>
      <button type="button" class="btn btn-pink" @click="fnRejoin">{{$t('rejoin')}}</button>
      <button type="button" class="btn btn-gray " @click="fnUnregi" >{{$t('unregisterd')}}</button>
    </div>
    <jqgrid
      ref="grid"
      name="usrSvc"
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
import requestApi from '@/api/ccp/requestApi'
import Jqgrid from '@/components/Jqgrid'

export default {
  name: 'UserListSvc',
  components: { Jqgrid },
  data () {
    return {
      searchCon: 'all',
      searchVal: '',
      usrLckYn: 'all',
      usrSlpYn: 'all',
      termsAgrYn: '',
      custSeq: 'all',
      orderCol: '',
      orderStd: '',
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      dataList: [],
      colNameData: [this.$t('customer-name'), this.$t('id'), this.$t('user-name'), this.$t('user-role'), this.$t('contact-number'), this.$t('email'), this.$t('usrLckYn'), this.$t('dormancy-chk'), this.$t('usr-status'), this.$t('termsAgrYn'), this.$t('termsAgree-dttm'), this.$t('reg-user-id'), this.$t('regDttm')],
      colModelData: [
        { name: 'custNm', index: 'custNm', align: 'left' },
        { name: 'usrLoginId', index: 'usrLoginId', align: 'left' },
        { name: 'usrNm', index: 'usrNm', align: 'center' },
        { name: 'roleCdNm', index: 'roleCdNm', align: 'center' },
        { name: 'usrPhoneNo', index: 'usrPhoneNo', align: 'center' },
        { name: 'usrEmail', index: 'usrEmail', align: 'left' },
        { name: 'usrLckYn', index: 'usrLckYn', align: 'center' },
        { name: 'usrSlpYn', index: 'usrSlpYn', align: 'center' },
        { name: 'useYn', index: 'useYn', align: 'center' },
        { name: 'termsAgrYn', index: 'termsAgrYn', align: 'center' },
        { name: 'termsAgrDttm', index: 'termsAgrDttm', align: 'center' },
        { name: 'regUsrId', index: 'regUsrId', align: 'left' },
        { name: 'regDttm', index: 'regDttm', align: 'center' }
      ],
      dataObject: {},
      searchOpt: [
        { otpName: this.$t('all'), optVal: 'all' },
        { otpName: this.$t('id'), optVal: 'id' },
        { otpName: this.$t('user-name'), optVal: 'usrNm' },
        { otpName: this.$t('contact-number'), optVal: 'usrPhoneNo' }
      ],
      sleepOtp: [
        { otpName: this.$t('all'), optVal: 'all' },
        { otpName: this.$t('dormancy'), optVal: '1' },
        { otpName: this.$t('normal'), optVal: '0' }
      ],
      lockOpt: [
        { otpName: this.$t('all'), optVal: 'all' },
        { otpName: this.$t('lock'), optVal: '1' },
        { otpName: this.$t('normal'), optVal: '0' }
      ],
      agreeOpt: [
        { otpName: this.$t('all'), optVal: '' },
        { otpName: this.$t('agree'), optVal: '0' },
        { otpName: this.$t('disagree'), optVal: '1' }
      ],
      modifyFlag: false,
      deleteFlag: false,
      deleteAPI: '/online/iotusr/deleteIotUsr',
      retrieveAPI: '',
      updateUsrInfoAPI: '',
      retrieveIotCustListAPI: '/online/iotcust/retrieveIotCustSelect',
      custList: [],
      roleCdId: ''
    }
  },
  created () {},
  mounted () {
    this.fnGetList()
  },
  computed: {
    isAdmin() {
      // GN00000038: 공통관리자, GN00000033: 서비스 담당자, GN00000034: 사업팀 담당자
      return this.roleCdId === 'GN00000038' || this.roleCdId === 'GN00000033' || this.roleCdId === 'GN00000034'
    }
  },
  watch: {
    searchCon() {
      if (this.searchCon === 'all') {
        this.searchVal = ''
      }
    }
  },
  methods: {
    fnGetList() {
      let reqData = {
        searchCon: this.searchCon,
        searchVal: this.searchVal,
        usrLckYn: this.usrLckYn,
        usrSlpYn: this.usrSlpYn,
        termsAgrYn: this.termsAgrYn,
        // orderCol: this.orderCol,
        // orderStd: this.orderStd,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount
      }
      if (this.isAdmin) {
        reqData.custSeq = this.custSeq
      }

      requestApi({
        url: '/online/iotusr/retrieveIotUsr',
        headers: {
          'X-MID': 'P00041'
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          this.dataList = res.data.dataList
          this.totPage = res.data.page.totPage
          this.currentPage = res.data.page.page

          this.roleCdId = res.data.roleCdid
          if (res.data.custList) {
            this.custList = []
            this.custList.push({ custNm: this.$t('all'), custSeq: 'all' })
            res.data.custList.forEach(custObj => {
              this.custList.push(custObj)
            })
          }
        }
      })
    },
    fnSearch() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitialize() {
      this.searchCon = 'all'
      this.searchVal = ''
      this.usrLckYn = 'all'
      this.usrSlpYn = 'all'
      this.termsAgrYn = ''
      this.custSeq = 'all'
      this.orderCol = ''
      this.orderStd = ''
      // this.fnSearch()
    },
    fnShowAddAllPoup() {
      this.popup({
        component: () => import('@/views/custusr/user/UserUploadAddSvc'),
        title: this.$t('addAll'),
        width: '500',
        height: '250',
        data: {
          idx: this.custSeq
        },
        callback: (data) => {
          this.fnGetList()
        }
      })
    },
    fnShowAddPopup() {
      this.popup({
        component: () => import('@/views/custusr/user/UserAddSvc'),
        title: this.$t('user-add'),
        width: '900',
        height: '730',
        data: {
          idx: this.custSeq
        },
        callback: (data) => {
          this.fnGetList()
        }
      })
    },
    fnPwInit() {
      if (!this.fnValidateSelectRow()) {
        return
      }
      this.confirm(this.$t('pw-init-check')).then(() => {
        this.fnUpdateData('pwd')
      })
    },
    fnUnlock() {
      if (!this.fnValidateSelectRow()) {
        return
      }
      this.confirm(this.$t('unlock-check')).then(() => {
        this.fnUpdateData('lck')
      })
    },
    fnReleaseDmc() {
      if (!this.fnValidateSelectRow()) {
        return
      }
      this.confirm(this.$t('pw-init-check')).then(() => {
        this.fnUpdateData('slp')
      })
    },
    fnRejoin() {
      if (!this.fnValidateSelectRow()) {
        return
      }
      this.confirm(this.$t('pw-init-check')).then(() => {
        this.fnUpdateData('rejoin')
      })
    },
    fnUnregi() {
      if (!this.fnValidateSelectRow()) {
        return
      }
      this.confirm(this.$t('pw-init-check')).then(() => {
        this.fnUpdateData('unregi')
      })
    },
    fnUpdateData(arrType) {
      let rowIds = this.$refs.grid.getSelectionIndexs()
      let usrSeqArr = []
      rowIds.forEach(id => {
        let data = this.dataList[id]
        usrSeqArr.push(data.usrSeq)
      })

      let reqData = {
        usrSeqArr: usrSeqArr,
        arrType: arrType
      }
      requestApi({
        url: '/online/iotusr/updateIotUsrInfo',
        headers: {
          'X-MID': 'P00041'
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('change-success'), 'success')
            this.fnGetList()
          }
        }
      })
    },
    fnValidateSelectRow() {
      let rowIds = this.$refs.grid.getSelectionIndexs()
      if (rowIds.length === 0) {
        this.alert(this.$t('no-selected-row'), 'warning')
        return false
      }
      return true
    },
    fnShowModifyPopup: _.throttle(
      function(id) {
        let data = this.dataList[id]
        this.popup({
          component: () => import('@/views/custusr/user/UserModifySvc'),
          title: this.$t('user-modify'),
          width: '900',
          height: '750',
          data: {
            idx: data
          },
          callback: (data) => {
            this.fnGetList()
          }
        })
      }
      , 1000
      , { 'trailing': false }
    )
  }
}
</script>

<style lang="less" scoped>
</style>
