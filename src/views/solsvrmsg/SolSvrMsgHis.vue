<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <span class="form-label mx-1">{{$t('msg-nm')}}</span>
          <input type="text" class="form-control" v-model="dataObj.msgNm" @keyup.enter="fnGetList()"/>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{$t('commuication-gubun')}}</span>
          <select class="form-control" v-model="dataObj.tranCd">
            <option value="">전체</option>
            <option v-for="tranCd in tranCdList" :key="tranCd.cdId" :value="tranCd.cdId">{{ tranCd.cdNm }}</option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ this.$t('targetServer') }}</span>
          <select class="form-control" v-model="dataObj.targetSolSvrSeq">
            <option value="">전체</option>
            <option v-for="targetSolSvr in targetSolSvrList" :key="targetSolSvr.solSvrSeq" :value="targetSolSvr.solSvrSeq">{{ targetSolSvr.serverNm }}</option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ this.$t('protocolKo') }}</span>
          <select class="form-control" v-model="dataObj.protocol">
            <option value="">전체</option>
            <option v-for="protocol in protocolList" :key="protocol.cdId" :value="protocol.cdId">{{ protocol.cdNm }}</option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ this.$t('methodKo') }}</span>
          <select class="form-control" v-model="dataObj.method">
            <option value="">전체</option>
            <option v-for="method in methodList" :key="method.cdId" :value="method.cdId">{{ method.cdNm }}</option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{$t('api-name')}}</span>
          <input type="text" class="form-control" v-model="dataObj.uri" @keyup.enter="fnGetList()"/>
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="search()">{{$t('search')}}</button>
          <button class="btn btn-info" type="button" @click="fnInitialize()">{{$t('initializing')}}</button>
        </div>
      </div>
    </div>
    <jqgrid
      ref="grid"
      name="solSvrMsgHisList"
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
import { getCommonCodeByParentCdId } from '@/api/common/code'
import Jqgrid from '@/components/Jqgrid'

export default {
  name: 'SolSvrMsgHis',
  components: {
    Jqgrid
  },
  props: {},
  data() {
    return {
      colNameList: [
        this.$t('msg-nm'),
        this.$t('msgGubun'),
        this.$t('targetServer'),
        this.$t('protocolKo'),
        this.$t('methodKo'),
        this.$t('api-name'),
        this.$t('modUsrId'),
        this.$t('modDttm'),
        this.$t('solMsgInfoHSeq')
      ],
      colModelList: [
        { name: 'msgNm', index: 'msgNm', align: 'left', width: '150' },
        { name: 'tranCdNm', index: 'tranCdNm', align: 'left', width: '150' },
        { name: 'targetSolSvrNm', index: 'targetSolSvrNm', align: 'left', width: '80' },
        { name: 'protocolNm', index: 'protocolNm', align: 'left', width: '80' },
        { name: 'methodNm', index: 'methodNm', align: 'left', width: '80' },
        { name: 'uri', index: 'uri', align: 'left' },
        { name: 'regUsrId', index: 'regUsrId', align: 'left', width: '150' },
        { name: 'regDttm', index: 'regDttm', align: 'left', width: '150' },
        { name: 'solMsgInfoHSeq', index: 'solMsgInfoHSeq', align: 'left', width: '150', hidden: true }
      ],
      tranList: [
        { value: 'GN00000236', key: '송신' },
        { value: 'GN00000237', key: '수신' },
        { value: 'GN00000337', key: 'polling' }
      ],
      dataList: [],
      customerList: [],
      selectedRow: [],
      currentPage: 1,
      displayRowCount: 15,
      totPage: 1,
      startPage: 1,
      tranCdList: [],
      targetSolSvrList: [],
      protocolList: [],
      methodList: [],
      dataObj: {
        msgNm: '',
        targetSolSvrSeq: '',
        tranCd: '',
        protocol: '',
        method: '',
        uri: ''
      },
      xMid: 'P30070'
    }
  },
  created() {
    this.getTargetSolSvrList()
    this.getTranCdList()
    this.getProtocolList()
    this.getMethodList()
    this.fnGetList()
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    getTargetSolSvrList() {
      let reqData = {}
      requestApi({
        url: '/online/solsvrmsg/retrieveTargetSolSvrList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.targetSolSvrList = res.data.targetSolSvrList
        }
      })
    },
    getTranCdList() {
      getCommonCodeByParentCdId({ xMid: this.xMid, parentCdId: 'GN00000235' }).then((data) => {
        this.tranCdList = data
      }).catch((e) => { console.error(e) })
    },
    getProtocolList() {
      getCommonCodeByParentCdId({ xMid: this.xMid, parentCdId: 'GN00000232' }).then((data) => {
        this.protocolList = data
      }).catch((e) => { console.error(e) })
    },
    getMethodList() {
      getCommonCodeByParentCdId({ xMid: this.xMid, parentCdId: 'GN00000238' }).then((data) => {
        this.methodList = data
      }).catch((e) => { console.error(e) })
    },
    search() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitialize() {
      this.dataObj.tranCd = ''
      this.dataObj.msgNm = ''
      this.dataObj.uri = ''
      this.dataObj.method = ''
      this.dataObj.targetSolSvrSeq = ''
      this.dataObj.protocol = ''
      // this.search()
    },
    fnGetList() {
      this.dataObj.currentPage = this.currentPage
      this.dataObj.startPage = this.currentPage
      this.dataObj.displayRowCount = this.displayRowCount
      requestApi({
        url: '/online/solsvrmsg/retrieveSolMsgInfoHistList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: this.dataObj,
        callback: res => {
          this.dataList = res.data.solSvrMsgInfoHistList
          this.totPage = res.data.page.totPage
          this.currentPage = res.data.page.page
        }
      })
    },
    modifyPopup: _.throttle(
      function(id, index, contents, event) {
        let object = this.dataList[id]
        this.popup({
          component: () => import('@/views/solsvrmsg/SolSvrMsgSetHSvc'),
          title: this.$t('solMsgInfoSetDetail'),
          width: '1000',
          height: '860',
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
