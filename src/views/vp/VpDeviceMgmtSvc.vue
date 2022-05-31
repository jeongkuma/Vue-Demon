<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('servMtServNm')}}</span>
          <select id="selectedValue" class="form-control" v-model="serverCd">
            <option value="">{{ $t('all')}}</option>
            <option v-for="item in serverList" v-bind:Key="item.cdId" :value="item.cdId">{{item.cdNm}}</option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{$t('vpDeviceId')}}</span>
          <input type="text" v-model="vpDeviceId" class="form-control" @keyup.enter="fnSearchList" >
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{$t('vpDeviceName')}}</span>
          <input type="text" v-model="vpDeviceName" class="form-control" @keyup.enter="fnSearchList">
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{$t('entityId')}}</span>
          <input type="text" v-model="entityId" class="form-control" @keyup.enter="fnSearchList">
        </div>
        <div class="form-group">
          <button
            class="btn btn-info input-group-addon"
            type="button"
            @click="fnSearchList()"
          >{{$t('search')}}</button>
          <button
            class="btn btn-info"
            type="button"
            @click="fnInitSchBoxList()"
          >{{$t('initializing')}}</button>
        </div>
      </div>
    </div>
    <div class="text-left float-left pt-3 pl-2"></div>
    <div class="mb-2 text-right">
      <button
        @click="addPopup()"
        type="button"
        class="btn btn-pink"
        data-toggle="modal"
        data-target="#modal-write"
      >{{$t('registration')}}</button>
      <button
        @click="syncPopup('device')"
        type="button"
        class="btn btn-gray"
        data-toggle="modal"
        data-target="#modal-write"
      >{{$t('synchronization')}}</button>
    </div>
    <jqgrid
      ref="grid"
      name="vpDeviceMgmt"
      :colModels="colModelData"
      :colNames="colNameData"
      :dataList="dataList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      :multiselect="false"
      @onCellSelect="detailPopup"
      @getDataList="getIotVpDeviceList"
    ></jqgrid>
  </div>
</template>

<script>
import { requestApi } from '@/api/ccp/requestApi'
import Jqgrid from '@/components/Jqgrid'
import { getCommonCodeByParentCdId } from '@/api/common/code'

export default {
  name: 'VpDeviceMgmtSvc',
  components: {
    Jqgrid
  },
  props: {},
  data() {
    return {
      dataList: [],
      serverList: [],
      svcCd: '',
      svcCdList: [],
      devClsCd: 'all',
      devClsList: {},
      devMdlCd: 'all',
      devMdlList: {},
      serverCd: '',
      vpDeviceId: null,
      vpDeviceName: null,
      entityId: null,
      colNameData: [
        this.$t('row-num'),
        this.$t('server-nm'),
        this.$t('vpDeviceSeq'),
        this.$t('vpDeviceId'),
        this.$t('vpDeviceType'),
        this.$t('vpDeviceModel'),
        this.$t('vpDeviceVendor'),
        this.$t('vpDeviceName'),
        this.$t('vpDevicePhone'),
        this.$t('dev-cls'),
        this.$t('dev-mdl'),
        this.$t('entityId'),
        this.$t('deviceStatus'),
        this.$t('regDttm'),
        this.$t('modDttm')
      ],
      colModelData: [
        { name: 'seq', index: 'seq', align: 'center', hidden: true },
        { name: 'serverNm', index: 'serverNm', align: 'left' },
        {
          name: 'vpDeviceSeq',
          index: 'vpDeviceSeq',
          align: 'center',
          hidden: true
        },
        { name: 'vpDeviceId', index: 'vpDeviceId', align: 'left' },
        { name: 'vpDeviceType', index: 'vpDeviceType', align: 'left' },
        { name: 'vpDeviceModel', index: 'vpDeviceModel', align: 'left' },
        { name: 'vpDeviceVendor', index: 'vpDeviceVendor', align: 'left' },
        { name: 'vpDeviceName', index: 'vpDeviceName', align: 'left' },
        { name: 'vpDevicePhone', index: 'vpDevicePhone', align: 'center' },
        { name: 'devClsCd', index: 'devClsCd', align: 'left' },
        { name: 'devMdlCd', index: 'devMdlCd', align: 'left' },
        { name: 'entityId', index: 'entityId', align: 'left' },
        { name: 'vpDeviceStatus', index: 'vpDeviceStatus', align: 'center' },
        { name: 'regDttm', index: 'regDttm', align: 'center' },
        { name: 'modDttm', index: 'modDttm', align: 'center' }
      ],
      dataObj: {
        serverCd: '',
        svcCd: '',
        devClsCd: '',
        devMdlCd: '',
        vpDeviceId: '',
        currentPage: 1,
        displayRowCount: 15
      },
      currentPage: 1,
      displayRowCount: 15,
      totPage: null,
      pageNum: null,
      pageInfo: [],
      xMid: 'P00333'
    }
  },
  created() {
    this.getIotVpServerList()
    this.getIotVpDeviceList()
  },
  mounted() {
  },
  computed: {},
  methods: {
    getIotVpServerList () {
      getCommonCodeByParentCdId({ parentCdId: 'GN00000366' }).then(data => {
        this.serverList = data
      })
    },
    fnInitSchBoxList() {
      this.currentPage = 1
      this.serverCd = ''
      this.devClsCd = 'all'
      this.devMdlCd = 'all'
      this.devMdlList = {}
      this.vpDeviceId = null
      this.vpDeviceName = null
      this.entityId = null
      // this.getIotVpDeviceList()
    },
    getIotVpDeviceList() {
      this.dataObj.serverCd = this.serverCd
      this.dataObj.svcCd = this.svcCd
      this.dataObj.devClsCd = this.devClsCd
      this.dataObj.devMdlCd = this.devMdlCd
      this.dataObj.vpDeviceId = this.vpDeviceId
      this.dataObj.vpDeviceName = this.vpDeviceName
      this.dataObj.entityId = this.entityId
      this.dataObj.currentPage = this.currentPage
      this.dataObj.displayRowCount = this.displayRowCount
      requestApi({
        url: '/online/vpdevice/getIotVpDeviceList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: this.dataObj,
        callback: res => {
          this.pageNum = res.data.page.page
          this.totPage = res.data.page.totPage
          this.pageInfo = res.data.page
          this.dataList = res.data.dataList
        }
      })
    },
    detailPopup: _.throttle(
      function (id, index, contents, event) {
        let object = this.dataList[id]
        let param = {}
        param.object = object
        param.serverList = this.serverList
        this.popup({
          component: () => import('@/views/vp/VpDeviceDetailSvc'),
          title: this.$t('vpDeviceDetail'),
          width: '900',
          height: '440',
          data: param,
          callback: data => {}
        })
      },
      1000,
      { trailing: false }
    ),
    syncPopup: _.throttle(
      function(object) {
        let param = {}
        param.serverList = this.serverList
        param.gubun = object
        this.popup({
          component: () => import('@/views/vp/VpSyncSvc'),
          title: this.$t('vpDeviceSync'),
          width: '500',
          height: '220',
          data: param,
          callback: data => {}
        })
      },
      1000,
      { trailing: false }
    ),
    addPopup: _.throttle(
      function(object) {
        let param = {}
        param.serverList = this.serverList
        this.popup({
          component: () => import('@/views/vp/VpDeviceAddSvc'),
          title: this.$t('vpDeviceAdd'),
          width: '900',
          height: '280',
          data: param,
          callback: data => {
            if (data !== 'dismiss') {
              this.getIotVpDeviceList()
            }
          }
        })
      },
      1000,
      { trailing: false }
    ),
    fnSearchList() {
      // 검색시에 현재 페이지 설정
      this.currentPage = 1
      this.getIotVpDeviceList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
