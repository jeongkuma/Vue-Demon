<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-12">
          <span class="form-label w-44 lb-txt">{{$t('customer')}}</span>
          <select class="form-control" v-model="selectedCst" >
            <option value="-1">{{ $t('all') }}</option>
            <option v-for="item in customerList" v-bind:key="item.custSeq" :value="item.custSeq">{{ item.custNm }}</option>
          </select>
        </div>
      </div>
      <div class="form-row row" v-show="isAdmin">
        <div class="form-item col-sm-12">
          <span class="form-label w-44 lb-txt">{{$t('customer')}}</span>
          <select v-model="selectedCst" v-show="isAdmin" class="form-control" >
            <option value="">{{$t('all')}}</option>
            <option v-for="item in customerList" v-bind:Key="item.custSeq" :value="item.custSeq">{{item.custNm}}</option>
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-12">
          <span class="form-label w-44 lb-txt">{{$t('service')}}</span>
          <select v-model="svcCd" class="form-control" >
            <option v-for="(svc, index) in svcCdList" :key="`svcCd-${index}`" :value="svc.svcCd">{{ svc.svcCdNm }}</option>
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-12">
          <span class="form-label w-44 lb-txt">{{$t('dev-cls')}}</span>
          <select name="" class="form-control" v-model="devClsCd" @change="fnGetDevMdlList()">
            <option v-for="(devCls, index) in devClsList" :key="`devCls-${index}`" :value="devCls.devClsCd">{{ devCls.devClsNm }}</option>
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-12">
          <span class="form-label w-44 lb-txt">{{$t('dev-mdl')}}</span>
          <select name="" class="form-control" v-model="devMdlCd">
            <option v-for="(devMdl, index) in devMdlList" :key="`devMdlCd-${index}`" :value="devMdl.devMdlCd">{{ devMdl.devMdlNm }}</option>
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-10">
          <span class="form-label w-44 lb-txt">{{$t('col-passing-yn')}}</span>
          <div class="form-check">
            <label class="form-check-label"><input class="form-check-input" type="checkbox" v-model="colPassingYn" true-value="Y" false-value="N"><span class="form-check-sign"></span></label>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-10">
          <span class="form-label w-44 lb-txt">{{$t('col-data-save-yn')}}</span>
          <div class="form-check">
            <label class="form-check-label"><input class="form-check-input" type="checkbox"  v-model="colDataSaveYn" true-value="Y" false-value="N"><span class="form-check-sign"></span></label>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-10">
          <span class="form-label w-44 lb-txt">{{$t('col-symp-yn')}}</span>
          <div class="form-check">
            <label class="form-check-label"><input class="form-check-input" type="checkbox" v-model="colSympYn" true-value="Y" false-value="N"><span class="form-check-sign"></span></label>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-10">
          <span class="form-label w-44 lb-txt">{{$t('col-accu-yn')}}</span>
          <div class="form-check">
            <label class="form-check-label"><input class="form-check-input" type="checkbox" v-model="colAccuYn" true-value="Y" false-value="N"><span class="form-check-sign"></span></label>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-10">
          <span class="form-label w-44 lb-txt">{{$t('col-out-yn')}}</span>
          <div class="form-check">
            <label class="form-check-label"><input class="form-check-input" type="checkbox" v-model="colOutYn" true-value="Y" false-value="N"><span class="form-check-sign"></span></label>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-10">
          <span class="form-label w-44 lb-txt">{{$t('col-diag-yn')}}</span>
          <div class="form-check">
            <label class="form-check-label"><input class="form-check-input" type="checkbox" v-model="colDiagYn" true-value="Y" false-value="N"><span class="form-check-sign"></span></label>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center btn-wrap">
        <button @click="submit()" type="button" class="btn btn-pink">{{$t('registration')}}</button>
        <button @click="close()" type="button" class="btn btn-gray" data-dismiss="modal">{{$t('cancel')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import moment from 'moment'
import { getSvcList, getDevClsCdListBySvcCd } from '@/api/common/usrSvcDevice'

export default {
  name: 'intrnSvrCnctn-create',
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
      paramObj: { },
      isAdmin: false,
      dataObj: {},
      customerList: [],
      svcNmList: [],
      svcCdList: [],
      devClsList: [],
      devMdlList: [],
      isSave: false,
      selectedCst: -1,
      selectedSvc: 'all',
      selectedDevMdl: 'all',
      selectedDevCls: 'all',
      today: null,
      colOutYn: 'N',
      colAccuYn: 'N',
      colSympYn: 'N',
      colDataSaveYn: 'N',
      colPassingYn: 'N',
      colStatYn: 'N',
      colOnlineYn: 'N',
      colDiagYn: 'N',
      checked: [],
      checkedName: [],
      xMid: 'P20031',
      svcCd: '',
      devClsCd: '',
      devMdlCd: ''
    }
  },
  watch: {
    svcCd() {
      this.fnGetDevClsList()
    }
  },
  created () {
    this.getCustNmList()
    // this.fnGetDevCls() // XXXXXXXXX
    this.fnGetSvcCdList()
  },
  methods: {
    fnGetSvcCdList() {
      getSvcList({ xMid: this.xMid })
        .then(data => {
          this.svcCdList = data
          if (this.svcCdList.length > 0) {
            this.svcCd = this.svcCdList[0].svcCd
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    fnGetDevClsList() {
      this.devClsCd = ''
      this.devClsList = []
      if (this.svcCd === '') {
        return false
      }
      getDevClsCdListBySvcCd({ xMid: this.xMid, svcCd: this.svcCd })
        .then(data => {
          this.devClsList = data.devClsList
          if (this.devClsList.length > 0) {
            this.devClsCd = this.devClsList[0].devClsCd
            this.fnGetDevMdlList({ devClsCd: this.devClsCd })
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    fnGetDevMdlList() {
      this.devMdlCd = ''
      this.devMdlList = []

      if (this.devClsCd === '') {
        return false
      }

      let reqData = {
        svcCd: this.svcCd,
        devClsCd: this.devClsCd
      }
      requestApi({
        url: '/online/iotsdev/retrieveSvcDevMdlList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: data => {
          this.devMdlCd = data.data[0].devMdlCd
          this.devMdlList = data.data
        }
      })
    },
    submit() {
      let valTitle = ''

      if (this.selectedCst === -1 || this.svcCd === '' || this.devClsCd === 'all' || this.devMdlCd === 'all') {
        if (this.selectedCst === -1) {
          valTitle = this.$t('select-cust-nm')
        } else if (this.svcCd === '') {
          valTitle = this.$t('select-svc-nm')
        } else if (this.devClsCd === 'all') {
          valTitle = this.$t('select-dev-cls')
        } else if (this.devMdlCd === 'all') {
          valTitle = this.$t('select-dev-mdl')
        }
        this.alert(valTitle, 'warning')
        // return
      } else {
        this.confirm(this.$t('saveYn'), this.fnCallInsertApi)
      }
    },
    fnCallInsertApi () {
      const reqData = {}
      this.today = moment().format('YYYYMMDD')

      reqData.custSeq = this.selectedCst
      reqData.svcCd = this.svcCd
      reqData.devClsCd = this.devClsCd
      reqData.devMdlCd = this.devMdlCd
      reqData.regDttm = this.today

      reqData.colPassingYn = this.colPassingYn
      reqData.colDataSaveYn = this.colDataSaveYn
      reqData.colSympYn = this.colSympYn
      reqData.colAccuYn = this.colAccuYn
      reqData.colOutYn = this.colOutYn
      reqData.colStatYn = this.colStatYn
      reqData.colOnlineYn = this.colOnlineYn
      reqData.colDiagYn = this.colDiagYn

      requestApi({
        url: '/online/iotoutsvrreport/addIotIntrnSvrCnctn',
        headers: {
          'X-MID': 'P20031'
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            var result = res.data.result
            if (result === 'success') {
              this.callback()
              this.close()
              this.alert(this.$t('save-success'), 'success')
            } else if (result === 'fail') {
              this.alert(this.$t('data-dupl'), 'warning')
            }
          }
        }
      })
    },
    getCustNmList() {
      const paramObj = {}
      paramObj.svcCd = this.svcCd
      requestApi({
        url: '/online/iotoutsvrreport/cmnctSttsCustNmList',
        headers: {
          'X-MID': 'P20031'
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.customerList = res.data.cmnctSttsCustNmList
            this.dataObj.custSeq = res.data.cmnctSttsCustNmList[0].custSeq
            // this.dataObj.svcCd = res.data.cmnctSttsCustNmList[0].svcCd
          }
          // this.fnGetDevCls()
        }
      })
    },
    fnGetDevCls() {
      const paramObj = {}
      paramObj.custSeq = this.selectedCst

      requestApi({
        url: '/online/iotoutsvrreport/cmnctSttsDevClsList',
        headers: {
          'X-MID': 'P20031'
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          console.log(res)
          if (res.result.status === '200' || res.result.status === '204') {
            // this.devClsList = res.data.data
            this.devClsList = res.data.cmnctSttsDevClsList
            this.dataObj.devClsCd = this.devClsCd
          }
        }
      })
    },
    /* XXXXXXXXX 고객사명 변경 시 발생하는 이벤트 제거
    fnChangeCustNm() {
      // this.selectedSvc = 'all'
      this.selectedDevMdl = 'all'
      this.selectedDevCls = 'all'

      // this.svcNmList = []
      this.devMdlList = []
      this.devClsList = []

      const paramObj = {}
      paramObj.custSeq = event.target.value

      if (event.target.value !== -1) {
        requestApi({
          url: '/online/iotoutsvrreport/cmnctSttsSvcNmList',
          headers: {
            'X-MID': 'P20031'
          },
          method: 'post',
          data: paramObj,
          callback: res => {
            console.log(res)
            if (res.result.status === '200' || res.result.status === '204') {
              this.svcNmList = res.data.cmnctSttsSvcNmList
              this.dataObj.custSeq = res.data.cmnctSttsSvcNmList[0].custSeq
              this.dataObj.svcCd = res.data.cmnctSttsSvcNmList[0].svcCd
            }
          }
        })
      } else {
        this.svcNmList = []
        this.devMdlList = []
        this.devClsList = []
      }
    }, */
    /* XXXXXXXXX 서비스명 변경 시 발생하는 이벤트 제거
    fnChangeSvcNm() {
      this.selectedDevCls = 'all'
      this.selectedDevMdl = 'all'
      this.devMdlList = []
      this.devClsList = []

      const paramObj = {}

      if (event.target.value !== 'all') {
        paramObj.custSeq = this.dataObj.custSeq

        requestApi({
          url: '/online/iotoutsvrreport/cmnctSttsDevClsList',
          headers: {
            'X-MID': 'P20031'
          },
          method: 'post',
          data: paramObj,
          callback: res => {
            console.log(res)
            if (res.result.status === '200' || res.result.status === '204') {
              this.devClsList = res.data.cmnctSttsDevClsList
              this.dataObj.svcCd = res.data.cmnctSttsDevClsList[0].svcCd
              this.dataObj.devClsCd = res.data.cmnctSttsDevClsList[0].devClsCd
            }
          }
        })
      } else {
        this.devMdlList = []
        this.devClsList = []
      }
    }, */
    fnChangeDevCls() {
      this.selectedDevMdl = 'all'
      const paramObj = {}

      if (event.target.value !== 'all') {
        paramObj.svcCd = this.dataObj.svcCd
        paramObj.devClsCd = this.selectedDevCls
      }

      requestApi({
        url: '/online/iotoutsvrreport/cmnctSttsDevMdlList',
        headers: {
          'X-MID': 'P20031'
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          console.log(res)
          if (res.result.status === '200' || res.result.status === '204') {
            this.devMdlList = res.data.cmnctSttsDevMdlList
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
</style>
