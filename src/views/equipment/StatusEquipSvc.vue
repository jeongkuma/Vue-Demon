<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <span class="form-control-static">{{$t('service')}}</span>
          <select v-model="svcCd" ref="svcCd" class="form-control" title="서비스" @change="fnGetDevClsList">
            <option value="">{{ $t('all') }}</option>
            <option v-for="(svc, index) in svcCdList" :key="`svcCd-${index}`" :value="svc.svcCd">{{ svc.svcCdNm }}</option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-control-static">{{$t('dev-cls')}}</span>
          <select v-model="devClsCd" ref="devClsType" class="form-control" title="장비 유형" @change="getModelList">
            <option value="all">{{$t('all')}}</option>
            <option v-for="devCls in devClsList" :key="'devCls'+devCls.devClsCd" :value="devCls.devClsCd">{{ devCls.devClsNm }}</option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-control-static">{{$t('dev-mdl-nm')}}</span>
          <select v-model="devMdlCd" ref="devMdlType" class="form-control" title="장비 모델">
            <option value="all" >{{$t('all')}}</option>
            <option v-for="devMdl in devMdlList" v-bind:key="devMdl.devMdlCd" :value="devMdl.devMdlCd">{{devMdl.devMdlNm}}</option>
          </select>
        </div>
        <div class="form-group">
          <select ref="searchType" v-model="searchType" class="form-control" title="검색 분류" >
            <option v-for="(item , index) in searchTypeList" :key="'item' + index" :value="item.value">{{ item.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <input type="text" v-model="searchKey" class="form-control" placeholder="" title="검색어 입력" @keyup.enter="search()">
        </div>
        <div class="form-group">
          <span class="form-control-static">{{ $t('duration-search') }}</span>
          <datetime-picker
            :isPair="true"
            :hour="false"
            :minute="false"
            :startDate.sync="startDate"
            :endDate.sync="endDate"
          ></datetime-picker>
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="search()">{{$t('search')}}</button>
          <button class="btn btn-info" type="button" @click="searchInit()">{{$t('initializing')}}</button>
        </div>
      </div>
    </div>
    <div class="mb-2 text-right">
      <button type="button" class="btn btn-pink" data-toggle="modal" data-target="#modal-write" @click="addPopup()">{{$t('registration')}}</button>
      <button type="button" class="btn btn-pink" data-toggle="modal" data-target="#modal-write" @click="batchRegistPopup()">{{$t('addAll')}}</button>
      <button type="button" class="btn btn-pink" data-toggle="modal" data-target="#modal-write" @click="excelDownLoad()">{{$t('excel-download')}}</button>
      <button type="button" class="btn btn-pink" data-toggle="modal" data-target="#modal-write" @click="showDevImg()">{{$t('device-img')}}</button>
    </div>
    <jqgrid
      ref="grid"
      name="statusEquip"
      :colModels="colModelList"
      :colNames="colNameList"
      :dataList="dataList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      @onCellSelect="modifyPopup"
      @getDataList="fnGetList"
    ></jqgrid>
  </div>
</template>

<script>
import moment from 'moment'
import DatetimePicker from '@/components/DatetimePicker'
import Jqgrid from '@/components/Jqgrid'
import { requestApi, requestDownloadApi } from '@/api/ccp/requestApi'
import { getSvcList, getDevClsCdListBySvcCd } from '@/api/common/usrSvcDevice'

export default {
  name: 'StatusSvc',
  components: {
    DatetimePicker,
    Jqgrid
  },
  props: {},
  data() {
    return {
      xMid: 'P00003',
      totPage: 1,
      svcCd: '',
      svcCdList: [],
      devClsCd: 'all',
      devClsList: {},
      devMdlCd: 'all',
      devMdlList: {},
      searchType: '',
      searchKey: null,
      searchTypeList: [
        { value: '', name: this.$t('search-type') },
        { value: 'entityId', name: this.$t('entity-id') },
        { value: 'ctn', name: this.$t('pin') + '(' + this.$t('ctn') + ')' },
        { value: 'usingNo', name: this.$t('using-no') },
        { value: 'devUname', name: this.$t('pin-nm') }
      ],
      retrieveValue: null,
      startDate: null,
      endDate: null,
      dataList: [],
      colNameList: [
        this.$t('service'),
        this.$t('dev-cls'),
        this.$t('dev-mdl'),
        this.$t('entityId'),
        this.$t('pin') + '(' + this.$t('ctn') + ')',
        this.$t('pin-nm'),
        this.$t('dev-status'),
        this.$t('using-no'),
        this.$t('inst-addr'),
        this.$t('building-type'),
        this.$t('inst-no'),
        this.$t('machine-no'),
        this.$t('dev-regi-dt'),
        this.$t('dev-inst-dt')
      ],
      colModelList: [
        { name: 'svcCdNm', index: 'svcCdNm', align: 'center' },
        { name: 'devClsCdNm', index: 'devClsCdNm', align: 'left' },
        { name: 'devMdlNm', index: 'devMdlNm', align: 'left' },
        { name: 'devUuid', index: 'devUuid', align: 'left', width: 200 },
        { name: 'ctn', index: 'left', align: 'center' },
        { name: 'devUname',
          index: 'devUname',
          cellattr: function(rowId, tv, rowObject, cm, rdata) {
            return 'style="word-break:break-all; text-align:left"'
          } },
        { name: 'statusNm', index: 'statusNm', align: 'center', width: 90 },
        { name: 'usingNo', index: 'usingNo', align: 'left' },
        { name: 'instAddr', index: 'instAddr', align: 'left', cellattr: 'colspan=2', width: 200 },
        { name: 'devBuildingType', index: 'devBuildingType', align: 'center', hidden: true },
        { name: 'instNo', index: 'instNo', align: 'center', width: 90 },
        { name: 'machineNo', index: 'machineNo', align: 'center', width: 90 },
        { name: 'devRegiDt', index: 'devRegiDt', align: 'center', width: 110 },
        { name: 'instDttm', index: 'instDttm', align: 'center', width: 110 }
      ],
      currentPage: 1,
      displayRowCount: 15,
      excelDownloadInfo: {
        // 엑셀 다운로드에 사용할 정보
        url: '/online/iotedevregi/downloadEntrDevList',
        data: {},
        headers: {
          'X-MID': 'P00003'
        }
      },
      uploadProp: {
        download: {
          url: '/online/iotedevregi/downSmplEDevElsx',
          data: {},
          headers: {
            'X-MID': 'P00003'
          }
        },
        upload: {
          url: '/online/iotedevregi/uploadBatchEntrDev',
          data: {},
          headers: {
            'X-MID': 'P00003'
          }
        }
      },
      chkOnce: 0
    }
  },
  watch: {},
  async created() {
    await this.fnGetSvcCdList()
    this.fnGetList()
  },
  mounted() {},
  computed: {},
  methods: {
    showDevImg() {
      let selectedRowArr = this.$refs.grid.getSelectionIndexs()
      if (selectedRowArr.length > 1) {
        this.alert(this.$t('alert-select-device-one'), 'warning')
        this.$refs.grid.resetSelection()
      } else if (selectedRowArr.length === 0) {
        this.alert(this.$t('no-selected-row'), 'warning')
      } else {
        let showDevNum = this.dataList[selectedRowArr[0]].entrDevSeq
        this.popup({
          component: () => import('@/views/equipment/ShowDeviceImg'),
          title: this.$t('dev-img'),
          width: '900',
          data: {
            devSeq: showDevNum
          },
          dismiss: res => {
            this.$refs.grid.resetSelection()
          }
        })
      }
    },
    fnGetSvcCdList() {
      return new Promise((resolve, reject) => {
        getSvcList({ xMid: this.xMid })
          .then(data => {
            this.svcCdList = data
            if (this.svcCdList.length > 0) {
              this.svcCd = this.svcCdList[0].svcCd
              this.fnGetDevClsList()
            }
            resolve()
          })
          .catch(e => {
            reject(e)
          })
      })
    },
    fnGetDevClsList() {
      // 선택값 초기화
      this.devClsCd = 'all'
      this.devClsList = []
      if (this.svcCd === '') {
        return false
      }
      getDevClsCdListBySvcCd({ xMid: this.xMid, svcCd: this.svcCd })
        .then(data => {
          this.devClsList = data.devClsList
          this.getModelList({ devClsCd: this.devClsCd })
        })
        .catch(e => {
          console.error(e)
        })
    },
    getModelList() {
      this.devMdlList = []
      this.devMdlCd = 'all'
      this.entrDevEntrAttbs = null
      if (this.devClsCd === '') {
        return false
      }
      let reqData = {
        devClsCd: this.devClsCd
      }
      requestApi({
        url: '/online/iotsdev/retrieveSvcDevMdlList',
        method: 'post',
        headers: {
          'X-MID': this.xMid
        },
        data: reqData,
        callback: res => {
          this.devMdlList = res.data
        }
      })
    },
    searchInit() {
      this.currentPage = 1
      this.svcCd = this.svcCdList[0].svcCd
      this.devClsCd = 'all'
      this.devMdlCd = 'all'
      this.devMdlList = []
      this.searchType = ''
      this.searchKey = null
      this.startDate = null
      this.endDate = null
      this.fnGetDevClsList()
    },
    fnGetList() {
      let searchData = {
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount,
        svcCd: this.svcCd,
        devClsCd: this.devClsCd,
        devMdlCd: this.devMdlCd,
        searchType: this.searchType,
        searchKey: this.searchKey
      }

      if (this.startDate && this.endDate) {
        searchData.startDate = moment(this.startDate).format('YYYY-MM-DD').toString()
        searchData.endDate = moment(this.endDate).format('YYYY-MM-DD').toString()
      }
      requestApi({
        url: '/online/iotedev/retrieveIotEDev',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: searchData,
        callback: res => {
          this.dataList = res.data.dataList
          this.totPage = res.data.totPage
          this.currentPage = res.data.page
        }
      })
    },
    search() {
      this.currentPage = 1
      this.fnGetList()
    },
    excelDownLoad() {
      let searchData = {
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount,
        svcCd: this.svcCd,
        devClsCd: this.devClsCd,
        devMdlCd: this.devMdlCd,
        searchType: this.searchType,
        searchKey: this.searchKey
      }

      if (this.startDate && this.endDate) {
        searchData.startDate = moment(this.startDate).format('YYYY-MM-DD').toString()
        searchData.endDate = moment(this.endDate).format('YYYY-MM-DD').toString()
      }
      requestDownloadApi({
        url: this.excelDownloadInfo.url,
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: searchData,
        callback: res => {}
      })
    },
    addPopup() {
      if (this.devClsList.length > 0) {
        this.popup({
          component: () => import('@/views/equipment/StatusEquipAddSvc'),
          title: this.$t('addDevice'),
          width: '900',
          height: '690',
          data: {
            devClsList: this.devClsList
          },
          callback: res => {
            if (res !== 'dismiss') {
              this.fnGetList()
            }
          }
        })
      } else {
        this.alert(this.$t('no-assigned-devices'), 'warning')
      }
    },
    modifyPopup: _.throttle(
      function(id, index, contents, event) {
        let object = this.dataList[id]
        this.popup({
          component: () => import('@/views/equipment/StatusEquipModifySvc'),
          title: this.$t('modDevice'),
          width: '900',
          height: '690',
          data: {
            entrDevSeq: object.entrDevSeq,
            devClsCd: object.devClsCd,
            devClsList: this.devClsList
          },
          callback: res => {
            this.fnGetList()
          }
        })
      },
      1000,
      { trailing: false }
    ),
    batchRegistPopup() {
      this.popup({
        component: () => import('@/components/BundleExcel'),
        title: this.$t('addAll'),
        width: '500',
        height: '250',
        data: this.uploadProp,
        callback: res => {
          this.searchInit()
        }
      })
    }
  },
  destroyed() {
    this.dataList = null
    this.colNameData = null
    this.colModelData = null
  }
}
</script>

<style lang="less" scoped>
</style>
