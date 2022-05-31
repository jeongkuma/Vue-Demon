<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <span class="form-control-static">{{$t('customer')}}</span>
          <select v-model="custSeq" class="form-control">
            <option value="">{{ $t('all')}}</option>
            <option
              v-for="item in customerList"
              :key="item.custSeq"
              :value="item.custSeq"
            >{{item.custNm}}</option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-control-static">{{$t('service')}}</span>
          <select v-model="svcCd" ref="svcCd" class="form-control" title="서비스">
            <option value="">{{ $t('all') }}</option>
            <option v-for="(svc, index) in svcCdList" :key="`svcCd-${index}`" :value="svc.svcCd">{{ svc.svcCdNm }}</option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-control-static">{{$t('dev-cls')}}</span>
          <select v-model="devClsCd" @change="fnGetDevMdlList(false)" class="form-control">
            <option value="">{{ $t('all')}}</option>
            <option
              v-for="item in unique(devClsList,'devClsCd')"
              :key="item.devClsCd"
              :value="item.devClsCd"
            >{{item.devClsCdNm}}</option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-control-static">{{$t('dev-mdl')}}</span>
          <select v-model="devMdlCd"  class="form-control">
            <option value="">{{ $t('all')}}</option>
            <option
              v-for="item in  unique(devMdlList,'devMdlCd')"
              :key="item.devMdlCd"
              :value="item.devMdlCd"
            >{{item.devMdlCdNm}}</option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-control-static">{{$t('commuication-gubun')}}</span>
          <select v-model="tranCd"  class="form-control">
            <option value="">{{ $t('all')}}</option>
            <option
              v-for="item in tranList"
              :key="item.key"
              :value="item.value"
            >{{item.key}}</option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-control-static">{{$t('outserver-nm')}}</span>
          <input
            type="text"
            class="form-control"
            v-model="serverNm"
            @keyup.enter="fnGetList()"
          />
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="search()">{{$t('search')}}</button>
          <button class="btn btn-info" type="button" @click="fnInitialize()">{{$t('initializing')}}</button>
        </div>
      </div>
    </div>
    <jqgrid
      ref="grid"
      name="outSvrMsgHist"
      :colModels="colModelList"
      :colNames="colNameList"
      :dataList="dataList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      :multiselect="false"
      @onCellSelect="modifyPopup"
      @getDataList="fnGetList"
    ></jqgrid>
  </div>
</template>

<script>
import { requestApi } from '@/api/ccp/requestApi'
import { getSvcList } from '@/api/common/usrSvcDevice'
import Jqgrid from '@/components/Jqgrid'

export default {
  name: 'outsvrmsg-list',
  components: {
    Jqgrid
  },
  props: {},
  data() {
    return {
      custSeq: '',
      serverNm: null,
      devClsCd: '',
      devMdlCd: '',
      tranCd: '',
      isSearch: false,
      colNameList: [
        '',
        '',
        this.$t('cust-nm'),
        this.$t('svc_nm'),
        this.$t('dev-cls'),
        this.$t('dev-mdl'),
        this.$t('outserver-nm'),
        this.$t('commuication-gubun'),
        this.$t('uri'),
        this.$t('regDttm')
      ],
      colModelList: [
        {
          name: 'outMsgSetHSeq',
          index: 'outMsgSetHSeq',
          align: 'left',
          width: '150',
          hidden: true
        },
        {
          name: 'outMsgSetSeq',
          index: 'outMsgSetSeq',
          align: 'left',
          width: '150',
          hidden: true
        },
        { name: 'custNm', index: 'custNm', align: 'left', width: '150' },
        { name: 'svcNm', index: 'svcNm', align: 'left', width: '150' },
        { name: 'devClsCdNm', index: 'devClsCdNm', align: 'left', width: '80' },
        { name: 'devMdlCdNm', index: 'devMdlCdNm', align: 'left', width: '80' },
        { name: 'serverNm', index: 'serverNm', align: 'left', width: '80' },
        { name: 'tranCdNm', index: 'tranCdNms', align: 'left' },
        { name: 'uri', index: 'uri', align: 'left', width: '150' },
        { name: 'regDttm', 'index': 'regDttm', 'align': 'center' }
      ],
      tranList: [
        { value: 'GN00000236', key: '송신' },
        { value: 'GN00000237', key: '수신' }
      ],
      dataList: [],
      customerList: [],
      selectedRow: [],
      currentPage: 1,
      displayRowCount: 15,
      totPage: 1,
      startPage: 1,
      outSvrSeq: '',
      svcCdList: [],
      devClsList: [],
      devMdlList: [],
      svcCd: '',
      xMid: 'P40043'
    }
  },
  watch: {
    svcCd() {
      this.fnGetDevClsList()
    }
  },
  computed: {
    unique() {
      return function(arr, key) {
        var output = []
        var usedKeys = {}
        for (var i = 0; i < arr.length; i++) {
          if (!usedKeys[arr[i][key]]) {
            usedKeys[arr[i][key]] = true
            output.push(arr[i])
          }
        }
        return output
      }
    }
  },
  async created() {
    this.fnGetCustList()
    await this.fnGetSvcCdList()
    this.fnGetList()
  },
  mounted() {
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
      const paramObj = {}
      paramObj.svcCd = this.svcCd

      requestApi({
        url: '/online/outsvrmsg/getDevClsInfo',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.devClsList = res.data.data
            this.fnGetDevMdlList()
          }
        }
      })
    },
    fnGetDevMdlList() {
      if (!this.devClsCd || this.devClsCd === '') {
        this.devMdlCd = ''
        this.devMdlList = []
        return
      }
      const paramObj = {
        svcCd: this.svcCd,
        devClsCd: this.devClsCd
      }
      requestApi({
        url: '/online/outsvrmsg/getDevMdlInfo',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.devMdlList = res.data.data
            this.devMdlCd = '' // XXXXXXXXX 장비 유형 콤보박스 변경 시 장비 모델 콤보박스 전체로 설정
          }
        }
      })
    },
    search() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitialize() {
      this.serverNm = ''
      this.custSeq = ''
      this.tranCd = ''
      this.currentPage = 1
      this.svcCd = this.svcCdList[0].svcCd
      this.devClsCd = ''
      this.devMdlCd = ''
    },
    fnGetList() {
      let reqData = {}
      // 조회시에
      // reqData.startPage = this.currentPage * this.displayRowCount
      reqData.currentPage = this.currentPage
      reqData.displayRowCount = this.displayRowCount
      if (this.custSeq !== '') {
        reqData.custSeq = this.custSeq
      }
      if (this.devClsCd !== '') {
        reqData.devClsCd = this.devClsCd
      }
      if (this.devMdlCd !== '') {
        reqData.devMdlCd = this.devMdlCd
      }
      if (this.tranCd !== '') {
        reqData.tranCd = this.tranCd
      }
      reqData.serverNm = this.serverNm
      reqData.svcCd = this.svcCd
      requestApi({
        url: '/online/outsvrmsg/outsvrmsghlist',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.dataList = res.data.outSvrMsgHList
          this.totPage = res.data.page.totPage
          this.currentPage = res.data.page.page
        }
      })
    },
    fnGetCustList() {
      const paramObj = {}
      paramObj.svcCd = this.svcCd
      requestApi({
        url: '/online/iotoutsvrreport/cmnctSttsCustNmList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.customerList = res.data.cmnctSttsCustNmList
          }
        }
      })
    },
    modifyPopup: _.throttle(
      function(id, index, contents, event) {
        let object = this.dataList[id]
        this.popup({
          component: () => import('@/views/outsvrmsg/OutSvrMsgSetHSvc'),
          title: this.$t('outsvrmsgh-list'),
          width: '900',
          height: '700',
          data: object,
          callback: data => {}
        })
      },
      1000,
      { trailing: false }
    )
  }
}
</script>

<style lang="less">
</style>
