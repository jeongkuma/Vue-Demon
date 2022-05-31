<template>
  <div>
    <div class="modal-body">
      <div class="search-box form-inline">
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('service') }}</span>
          <select v-model="svcCd" ref="svcCd" class="form-control" title="서비스" :disabled="isSelectedDev">
            <option v-for="(svc, index) in svcCdList" :key="`svcCd-${index}`" :value="svc.svcCd">{{ svc.svcCdNm }}</option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('dev-cls') }}</span>
          <select v-model="devClsCd" class="form-control" title="장비유형" :disabled="isSelectedDev">
            <option v-for="(devCls, index) in devClsList" :key="`devCls-${index}`" :value="devCls.devClsCd">
              {{devCls.devClsNm}}
            </option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('dev-mdl-nm') }}</span>
          <select v-model="devMdlCd" class="form-control" title="장비 모델" :disabled="isSelectedDev">
            <option v-for="(devMdl, index) in devMdlList" :key="`devMdlCd-${index}`" :value="devMdl.devMdlCd">
              {{devMdl.devMdlNm}}
            </option>
          </select>
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="search">{{$t('search')}}</button>
        </div>
      </div>
      <div class="form-check mb-1">
        <label
          for="allDevices"
          class="form-check-label"
          style="user-select: none; font-weight: normal"
        >
          <input
            v-model="flagAllDevices"
            type="checkbox"
            id="allDevices"
            class="form-check-input"
          />
          <span class="form-check-sign"></span> {{ $t('all-dev-mdl') }}
        </label>
      </div>
      <jqgrid
        ref="grid"
        name="device"
        :colModels="colModelData"
        :colNames="colNameList"
        :dataList="deviceList"
        :totalPage.sync="totPage"
        :currentPage.sync="currentPage"
        :rowNum.sync="displayRowCount"
        :width="859"
        @getDataList="fnGetList"
      >
      </jqgrid>
    </div>
    <div class="modal-footer">
      <div class="btn-wrap text-center">
        <button @click="fnSelectDevices()" type="button" class="btn btn-pink">
          {{ $t('select') }}
        </button>
        <button @click="fnClose()" type="button" class="btn btn-gray">
          {{ $t('cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Jqgrid from '@/components/Jqgrid'
import { requestApi } from '@/api/ccp/requestApi'
import { getSvcList, getDevClsCdListBySvcCd } from '@/api/common/usrSvcDevice'

export default {
  name: 'DetectionDevListPopupSvc',
  components: { Jqgrid },
  props: {
    data: {
      type: Object,
      required: true
    },
    callback: {
      type: Function,
      required: true
    },
    close: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      xMid: 'P00010',
      svcCd: '',
      devClsCd: '',
      devMdlCd: '',
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      totRow: 0,
      svcCdList: [],
      devClsList: [],
      devMdlList: [],
      deviceList: [],
      colNameList: ['서비스', '장비 유형', '장비 모델', 'CTN', '식별명', '설치주소'],
      colModelData: [
        { name: 'svcCdNm', index: 'svcCd', align: 'center', width: '50' },
        { name: 'devClsCdNm', index: 'devClsCdNm', align: 'center', width: '100' },
        { name: 'devMdlNm', index: 'devMdlNm', align: 'center', width: '100' },
        { name: 'ctn', index: 'ctn', align: 'center', width: '100' },
        { name: 'devUname', index: 'devUname', align: 'center', width: '100' },
        { name: 'instAddr', index: 'instAddr', align: 'left', width: '200' }
      ],
      flagAllDevices: false
    }
  },
  computed: {
    svcCdNm() {
      let svc = this.svcCdList.find((item) => item.svcCd === this.svcCd)
      return svc ? svc.svcCdNm : ''
    },
    devClsCdNm() {
      let devCls = this.devClsList.find((item) => item.devClsCd === this.devClsCd)
      return devCls ? devCls.devClsCd : ''
    },
    devMdlNm() {
      let devMdl = this.devMdlList.find((item) => item.devMdlCd === this.devMdlCd)
      return devMdl ? devMdl.devMdlNm : ''
    },
    isSelectedDev() {
      return this.data.svcCd !== '' && this.data.devClsCd !== '' && this.data.devMdlCd !== ''
    }
  },
  watch: {
    svcCd() {
      this.fnGetDevClsList()
    },
    devClsCd() {
      this.fnGetDevMdlList()
    }
  },
  created() {
    this.fnGetSvcCdList()
    this.fnInit()
  },
  mounted() {},
  methods: {
    fnInit() {
      if (this.isSelectedDev) {
        this.svcCd = this.data.svcCd
        this.devClsCd = this.data.devClsCd
        this.devMdlCd = this.data.devMdlCd
      }
    },
    // ----------------- 옵션 항목 조회
    fnGetSvcCdList() {
      getSvcList({ xMid: this.xMid })
        .then((data) => {
          this.svcCdList = data
          if (this.svcCdList.length > 0) {
            // props로 받은 svcCd 없는 경우만
            if (!this.isSelectedDev) {
              this.svcCd = this.svcCdList[0].svcCd
            }
          }
        })
        .catch((e) => {
          console.error(e)
        })
    },
    fnGetDevClsList() {
      // props로 받은 devClsCD 없는 경우만
      if (!this.isSelectedDev) {
        this.devClsCd = ''
      }
      this.devClsList = []
      if (this.svcCd === '') {
        return false
      }
      getDevClsCdListBySvcCd({ xMid: this.xMid, svcCd: this.svcCd })
        .then((data) => {
          this.devClsList = data.devClsList
          if (this.devClsList.length > 0) {
            if (!this.isSelectedDev) {
              this.devClsCd = this.devClsList[0].devClsCd
            }
          }
        })
        .catch((e) => {
          console.error(e)
        })
    },
    fnGetDevMdlList() {
      if (!this.isSelectedDev) {
        this.devMdlCd = ''
      }
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
        callback: (data) => {
          this.devMdlList = data.data
          if (!this.isSelectedDev) {
            this.devMdlCd = this.devMdlList[0].devMdlCd
          }
          this.search()
        }
      })
    },
    // ----------------- 목록 조회
    fnGetList() {
      let reqData = {
        svcCd: this.svcCd,
        devClsCd: this.devClsCd,
        devMdlCd: this.devMdlCd,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount
      }
      requestApi({
        url: '/online/iotedev/retrieveIotEDev',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          this.deviceList = res.data.dataList
          this.totPage = res.data.totPage
          this.currentPage = res.data.page
          this.totRow = res.data.totRow
        }
      })
    },
    search() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnSelectDevices() {
      let idArr = this.$refs.grid.getSelectionIndexs()
      if (!this.flagAllDevices && idArr.length === 0) {
        this.alert(this.$t('stat-act-device-null-alert'))
        return false
      }

      if (this.flagAllDevices && this.totRow === 0) {
        this.alert('선택할 장비가 없습니다.')
        return false
      }

      let deviceList = []
      if (!this.flagAllDevices) {
        for (let i = 0; i < idArr.length; i++) {
          let row = this.deviceList[idArr[i]]
          deviceList.push(row)
        }
      }

      this.callback({
        list: deviceList,
        count: this.totRow,
        svcCd: this.svcCd,
        svcCdNm: this.svcCdNm,
        devClsCd: this.devClsCd,
        devClsCdNm: this.devClsCdNm,
        devMdlCd: this.devMdlCd,
        devMdlNm: this.devMdlNm
      })
      this.close()
    },
    fnClose() {
      this.close()
    }
  }
}
</script>

<style></style>
