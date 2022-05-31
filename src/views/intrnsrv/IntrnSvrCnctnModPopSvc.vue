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
        <button @click="submit()" type="button" class="btn btn-pink">{{$t('modify')}}</button>
        <button @click="close()" type="button" class="btn btn-gray" data-dismiss="modal">{{$t('cancel')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import moment from 'moment'
import { getDevClsCdListBySvcCd, getSvcList } from '@/api/common/usrSvcDevice'

export default {
  name: 'intrnSvrCnctn-modify',
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
      devClsList: [],
      devMdlList: [],
      reportOptList: [],
      failureOptList: [],
      isSave: false,
      selectedCst: -1,
      selectedSvc: 'all',
      selectedDevMdl: 'all',
      selectedDevCls: 'all',
      today: null,
      colStatYn: 'N',
      colOutYn: 'N',
      colAccuYn: 'N',
      colSympYn: 'N',
      colDataSaveYn: 'N',
      colPassingYn: 'N',
      colOnlineYn: 'N',
      colDiagYn: 'N',
      checked: [],
      checkedName: [],
      selectOneList: [],
      svcCd: '',
      devClsCd: '',
      devMdlCd: '',
      svcCdList: []
    }
  },
  watch: {
    svcCd() {
      this.fnGetDevClsList()
    }
  },
  created () {
    this.fnCallSelectOne(this.data.idx.colSvrSeq)
    this.fnGetSvcCdList()
    this.getCustNmList()
  },
  methods: {
    fnGetSvcCdList() {
      getSvcList({ xMid: this.xMid })
        .then(data => {
          this.svcCdList = data
        })
        .catch(e => {
          console.error(e)
        })
    },
    fnGetDevClsList() {
      let context = this
      this.devClsList = []
      if (this.svcCd === '') {
        return false
      }
      getDevClsCdListBySvcCd({ xMid: this.xMid, svcCd: this.svcCd })
        .then(data => {
          this.devClsList = data.devClsList
          if (context.devClsCd) {
            // context.devClsCd = data.devClsList[0].devClsCd
          }
          if (this.devClsList.length > 0) {
            this.fnGetDevMdlList({ devClsCd: this.devClsCd })
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    fnGetDevMdlList() {
      let context = this
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
          this.devMdlList = data.data
          if (context.devMdlCd) {
            // context.devMdlCd = data.data[0].devMdlCd
          }
        }
      })
    },
    fnCallSelectOne(colSvrSeq) {
      const paramObj = {}
      paramObj.colSvrSeq = colSvrSeq

      requestApi({
        url: '/online/iotoutsvrreport/selectOneIotIntrnSvrCnctn',
        headers: {
          'X-MID': 'P20032'
        },
        method: 'post',
        data: paramObj,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.selectOneList = res.data.selectOneList[0]
            this.selectedCst = this.selectOneList.custSeq
            this.selectedSvc = this.selectOneList.svcCd
            this.selectedDevCls = this.selectOneList.devClsCd
            this.selectedDevMdl = this.selectOneList.devMdlCd
            this.svcCd = this.selectOneList.svcCd
            this.devClsCd = this.selectOneList.devClsCd
            this.devMdlCd = this.selectOneList.devMdlCd
            // this.fnGetSvcNm(this.selectOneList.custSeq, this.selectOneList.svcCd)  - XXXXXXXXX 서비스명 콤보박스 제거
            // this.fnGetDevCls(this.selectOneList.custSeq)
            // this.fnGetDevMdl(this.selectOneList.devClsCd)
            this.colPassingYn = this.selectOneList.colPassingYn
            this.colDataSaveYn = this.selectOneList.colDataSaveYn
            this.colSympYn = this.selectOneList.colSympYn
            this.colAccuYn = this.selectOneList.colAccuYn
            this.colStatYn = this.selectOneList.colStatYn
            this.colOutYn = this.selectOneList.colOutYn
            this.colOnlineYn = this.selectOneList.colOnlineYn
            this.colDiagYn = this.selectOneList.colDiagYn
          }
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
        /* XXXXXXXXX 서비스명 콤보박스 제거
        else if (this.selectedSvc === 'all') {
          valTitle = this.$t('select-svc-nm')
        } */
        this.alert(valTitle, 'warning')
        // return
      } else {
        this.confirm(this.$t('modifyYn'), this.fnCallUpdateApi)
      }
    },
    fnCallUpdateApi () {
      const reqData = {}
      this.today = moment().format('YYYYMMDD')

      reqData.colSvrSeq = this.data.idx.colSvrSeq
      reqData.custSeq = this.selectedCst
      reqData.svcCd = this.svcCd
      // XXXXXXXXX 서비스명은 유저정보에서 받아와야 함
      reqData.devClsCd = this.devClsCd
      reqData.devMdlCd = this.devMdlCd
      reqData.modDttm = this.today

      reqData.selectOneCustSeq = this.selectOneList.custSeq
      reqData.selectOneSvcCd = this.selectOneList.svcCd
      reqData.selectOneDevClsCd = this.selectOneList.devClsCd
      reqData.selectOneDevMdlCd = this.selectOneList.devMdlCd

      reqData.colPassingYn = this.colPassingYn
      reqData.colDataSaveYn = this.colDataSaveYn
      reqData.colSympYn = this.colSympYn
      reqData.colAccuYn = this.colAccuYn
      reqData.colOutYn = this.colOutYn
      reqData.colStatYn = this.colStatYn
      reqData.colOnlineYn = this.colOnlineYn
      reqData.colDiagYn = this.colDiagYn
      requestApi({
        url: '/online/iotoutsvrreport/updateIotIntrnSvrCnctn',
        headers: {
          'X-MID': 'P20032'
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            var result = res.data.result
            if (result === 'success') {
              this.callback()
              this.close()
              this.alert(this.$t('modify-success'), 'success')
            } else if (result === 'fail') {
              this.alert(this.$t('data-dupl'), 'warning')
            }
          }
        }
      })
    },
    getCustNmList() {
      // this.selectedSvc = this.selectedSvc  - XXXXXXXXX
      const paramObj = {}
      paramObj.svcCd = this.svcCd
      requestApi({
        url: '/online/iotoutsvrreport/cmnctSttsCustNmList',
        headers: {
          'X-MID': 'P20032'
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.customerList = res.data.cmnctSttsCustNmList
            this.dataObj.custSeq = res.data.cmnctSttsCustNmList[0].custSeq
            // this.dataObj.svcCd = res.data.cmnctSttsCustNmList[0].svcCd  - XXXXXXXXX
          }
        }
      })
    },
    /* XXXXXXXXX 서비스명 콤보박스 제거
    fnGetSvcNm(custSeq, svcCd) {
      const paramObj = {}
      paramObj.custSeq = custSeq

      requestApi({
        url: '/online/iotoutsvrreport/cmnctSttsSvcNmList',
        headers: {
          'X-MID': 'P20032'
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
    }, */
    fnGetDevCls(custSeq) {
      const paramObj = {}
      paramObj.custSeq = custSeq

      requestApi({
        url: '/online/iotoutsvrreport/cmnctSttsDevClsList',
        headers: {
          'X-MID': 'P20032'
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          console.log(res)
          if (res.result.status === '200' || res.result.status === '204') {
            this.devClsList = res.data.cmnctSttsDevClsList
            // this.dataObj.svcCd = res.data.cmnctSttsDevClsList[0].svcCd - XXXXXXXXX
            this.dataObj.devClsCd = res.data.cmnctSttsDevClsList[0].devClsCd
          }
        }
      })
    },
    fnGetDevMdl(devClsCd) {
      const paramObj = {}
      // paramObj.svcCd = svcCd    - XXXXXXXXX
      paramObj.devClsCd = devClsCd

      requestApi({
        url: '/online/iotoutsvrreport/cmnctSttsDevMdlList',
        headers: {
          'X-MID': 'P20032'
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
    },
    /* XXXXXXXXX
    fnChangeCustNm() {
      this.selectedSvc = 'all'
      this.selectedDevMdl = 'all'
      this.selectedDevCls = 'all'

      this.svcNmList = []
      this.devMdlList = []
      this.devClsList = []

      const paramObj = {}
      paramObj.custSeq = event.target.value

      if (event.target.value !== -1) {
        requestApi({
          url: '/online/iotoutsvrreport/cmnctSttsSvcNmList',
          headers: {
            'X-MID': 'P20032'
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
    },
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
            'X-MID': 'P20032'
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
    fnChangeDevCls(devClsCd) {
      this.selectedDevMdl = 'all'
      const paramObj = {}

      if (event.target.value !== 'all') {
        // paramObj.svcCd = this.dataObj.svcCd  - XXXXXXXXX 서비스명은 유저정보에서 받아야 함
        paramObj.devClsCd = this.selectedDevCls
      }

      requestApi({
        url: '/online/iotoutsvrreport/cmnctSttsDevMdlList',
        headers: {
          'X-MID': 'P20032'
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
