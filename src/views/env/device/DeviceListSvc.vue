<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <!-- 서비스 -->
        <div class="form-group">
          <span class="form-control-static">{{ $t('service') }}</span>
          <select
            v-model="svcCd"
            ref="svcCd"
            class="form-control"
            title="서비스"
          >
            <option value="">{{ $t('all') }}</option>
            <option
              v-for="(svc, index) in svcCdList"
              :key="`svcCd-${index}`"
              :value="svc.svcCd"
              >{{ svc.svcCdNm }}</option
            >
          </select>
        </div>
        <!-- 장비유형 -->
        <div class="form-group">
          <span class="form-control-static">{{ $t('dev-cls') }}</span>
          <select v-model="devClsCd" class="form-control" title="장비유형">
            <option value="">{{ $t('all') }}</option>
            <option
              v-for="(devCls, index) in devClsList"
              :key="`devCls-${index}`"
              :value="devCls.devClsCd"
              >{{ devCls.devClsNm }}</option
            >
          </select>
        </div>
        <!-- 장비유형, 모델, 사용여부, 제조사 -->
        <div class="form-group">
          <select v-model="searchType" name="" class="form-control">
            <option value="devMdlNm">{{ $t('dev-mdl-nm') }}</option>
            <option value="devClsCdNm">{{ $t('dev-type') }}</option>
            <option value="vendorNm">{{ $t('manufacturer') }}</option>
          </select>
        </div>
        <!-- 검색어 -->
        <div class="form-group">
          <input
            v-model="searchText"
            type="text"
            class="form-control"
            placeholder=""
            @keyup.enter="searchDev(true)"
          />
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="search()">
            {{ $t('search') }}
          </button>
          <button
            class="btn btn-info"
            type="button"
            @click="fnInitializeSeach()"
          >
            {{ $t('initializing') }}
          </button>
        </div>
      </div>
    </div>
    <div class="mb-2 text-right">
      <button @click="fnExcelUpload" type="button" class="btn btn-pink rounded">
        {{ $t('addAll') }}
      </button>
      <button @click="fnDeviceDetail()" type="button" class="btn btn-pink">
        {{ $t('registration') }}
      </button>
      <button @click="fnDeviceCopy" type="button" class="btn btn-pink">
        {{ $t('copy') }}
      </button>
      <button @click="fnDeviceDelete" type="button" class="btn btn-gray ">
        {{ $t('delete') }}
      </button>
      <button @click="excelDownload" type="button" class="btn btn-pink">
        {{ $t('excel-download') }}
      </button>
    </div>
    <jqgrid
      ref="grid"
      name="device"
      :colModels="colModelData"
      :colNames="colNameData"
      :dataList="devList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      @onCellSelect="fnDeviceDetail"
      @getDataList="fnGetList"
    >
    </jqgrid>
  </div>
</template>

<script>
import moment from 'moment'
import Jqgrid from '@/components/Jqgrid'
import { requestApi, requestDownloadApi } from '@/api/ccp/requestApi'
import { getSvcList, getDevClsCdListBySvcCd } from '@/api/common/usrSvcDevice'

export default {
  name: 'DeviceList',
  components: { Jqgrid },
  data() {
    return {
      xMid: 'P00065',
      svcCd: '',
      devClsCd: '',
      searchType: 'devMdlNm',
      searchText: '',
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      svcCdList: [],
      devClsList: [],
      devList: [],
      colNameData: [
        this.$t('service-code'),
        this.$t('device-seq'),
        this.$t('sDevice-seq'),
        '서비스',
        this.$t('device-type'),
        this.$t('model-code'),
        this.$t('dev-mdl-nm'),
        this.$t('manufacturer'),
        this.$t('regUser'),
        this.$t('regDttm')
      ],
      colModelData: [
        { name: 'svcCd', index: 'svcCd', align: 'center', hidden: true },
        { name: 'devSeq', index: 'devSeq', align: 'center', hidden: true },
        { name: 'sdevSeq', index: 'sdevSeq', align: 'center', hidden: true },
        {
          name: 'svcCdNm',
          index: 'svcCdNm',
          align: 'center',
          classes: 'noselect'
        },
        {
          name: 'devClsCdNm',
          index: 'devClsCdNm',
          align: 'left',
          classes: 'noselect'
        },
        {
          name: 'devMdlCd',
          index: 'devMdlCd',
          align: 'left',
          classes: 'noselect'
        },
        {
          name: 'devMdlNm',
          index: 'devMdlNm',
          align: 'left',
          classes: 'noselect'
        },
        {
          name: 'vendorNm',
          index: 'vendorNm',
          align: 'left',
          classes: 'noselect'
        },
        {
          name: 'regUsrId',
          index: 'regUsrId',
          align: 'center',
          classes: 'noselect'
        },
        {
          name: 'regDttm',
          index: 'regDttm',
          align: 'center',
          classes: 'noselect'
        }
      ],
      rowNum: 0,
      bundleExcelDevice: {
        // 장비 일괄등록 관련정보
        download: {
          url: '/online/iotdev/createIotPasteDevTemp',
          data: {},
          headers: {}
        },
        upload: {
          url: '/online/iotdev/createIotDevAll',
          data: {},
          headers: {}
        }
      }
    }
  },
  computed: {},
  watch: {
    svcCd() {
      this.fnGetDevClsList()
    }
  },
  async created() {
    await this.fnGetSvcCdList()
    this.fnGetList()
  },
  mounted() {},
  methods: {
    // 옵션
    fnGetSvcCdList() {
      return new Promise((resolve, reject) => {
        getSvcList({ xMid: this.xMid })
          .then(data => {
            this.svcCdList = data
            if (this.svcCdList.length > 0) {
              this.svcCd = this.svcCdList[0].svcCd
            }
            resolve()
          })
          .catch(e => {
            console.error(e)
            reject(e)
          })
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
        })
        .catch(e => {
          console.error(e)
        })
    },
    // --------------------- 리스트 데이터 조회
    fnGetList() {
      let reqData = {
        svcCd: this.svcCd,
        devClsCd: this.devClsCd === '' ? null : this.devClsCd,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount
      }

      if (this.searchText.trim() !== '') {
        if (this.searchType === 'devMdlNm') {
          // 모델명
          reqData.devMdlNm = this.searchText.trim()
        } else if (this.searchType === 'devClsCdNm') {
          // 장비 유형명
          reqData.devClsCdNm = this.searchText.trim()
        } else if (this.searchType === 'vendorNm') {
          // 제조사
          reqData.vendorNm = this.searchText.trim()
        }
      }
      requestApi({
        url: '/online/iotdev/retrieveIotDev',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: data => {
          data.data.boardList.forEach(rowData => {
            rowData.regDttm = moment(rowData.regDttm, 'YYYYMMDDHHmmss').format(
              'YYYY-MM-DD HH:mm:ss'
            )
          })

          this.devList = data.data.boardList
          this.totPage = data.data.page.totPage
          this.currentPage = data.data.page.page
        }
      })
    },
    search() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitializeSeach() {
      this.svcCd = this.svcCdList[0].svcCd
      this.devClsCd = ''
      this.searchType = 'devMdlNm'
      this.searchText = ''
    },
    // --------------------- 리스트 액션
    fnExcelUpload() {
      this.popup({
        component: () => import('@/components/BundleExcel'),
        title: this.$t('addAll'),
        width: '500',
        height: '250',
        data: this.bundleExcelDevice,
        callback: res => {
          if (res) {
            this.search()
          }
        }
      })
    },
    fnDeviceDetail: _.throttle(
      function(rowId) {
        let sdevSeq = null
        if (rowId) {
          let data = this.$refs.grid.getRowData(rowId)
          sdevSeq = data.sdevSeq
        }

        this.popup({
          component: () => import('@/views/env/device/DeviceCreateModifySvc'),
          title: this.$t('device-model-create-attr'),
          width: 'wide',
          height: '750',
          data: {
            sdevSeq: sdevSeq
          },
          callback: res => {
            if (res && res !== 'dismiss') {
              this.fnGetList()
            }
          }
        })
      },
      1000,
      { trailing: false }
    ),
    fnDeviceCopy: _.throttle(
      function() {
        let checkedList = this.$refs.grid.getSelectionIndexs()
        if (checkedList.length === 0) {
          this.alert(this.$t('alert-select-device-copy'))
          return
        }

        if (checkedList.length > 1) {
          this.alert(this.$t('alert-select-device-one'))
          return
        }

        let data = this.$refs.grid.getRowData(checkedList[0])

        this.popup({
          component: () => import('@/views/env/device/DeviceCopy'),
          title: this.$t('deviceCopy'),
          width: '500',
          height: '340',
          data: {
            sdevSeq: data.sdevSeq,
            svcCd: data.svcCd
          },
          callback: data => {
            if (data) {
              this.search()
            }
          }
        })
      },
      1000,
      { trailing: false }
    ),
    fnDeviceDelete() {
      let selectedRowIdList = this.$refs.grid.getSelectionIndexs()
      if (selectedRowIdList.length === 0) {
        this.alert(this.$t('alert-select-device-delete'))
        return
      }
      this.confirm(this.$t('delYn'), this.fnDeviceDeleteApi)
    },
    fnDeviceDeleteApi() {
      let selectedRowIdList = this.$refs.grid.getSelectionIndexs()
      let selectedDeviceList = []
      selectedRowIdList.forEach(id => {
        let data = this.$refs.grid.getRowData(id)
        this.sDevSeq = data.sdevSeq
        selectedDeviceList.push(this.sDevSeq)
      })
      requestApi({
        url: '/online/iotdev/deleteIotDev',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {
          item: selectedDeviceList
        },
        callback: data => {
          if (data.result.status === '200') {
            this.alert(this.$t('del-success'), 'success')
            this.search()
          }
        }
      })
    },
    excelDownload() {
      let reqData = {
        svcCd: this.svcCd,
        devClsCd: this.devClsCd === '' ? null : this.devClsCd,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount
      }

      if (this.searchText.trim() !== '') {
        if (this.searchType === 'devMdlNm') {
          // 모델명
          reqData.devMdlNm = this.searchText.trim()
        } else if (this.searchType === 'devClsCdNm') {
          // 장비 유형명
          reqData.devClsCdNm = this.searchText.trim()
        } else if (this.searchType === 'vendorNm') {
          // 제조사
          reqData.vendorNm = this.searchText.trim()
        }
      }
      requestDownloadApi({
        url: '/online/iotdev/createIotPasteDevAttr',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {}
      })
    }
  }
}
</script>

<style></style>
