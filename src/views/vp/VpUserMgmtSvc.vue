<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('servMtServNm') }}</span>
          <select
            id="selectedValue"
            class="form-control"
            v-model="dataObj.serverCd"
          >
            <option value="">{{ $t('all') }}</option>
            <option
              v-for="item in serverList"
              v-bind:Key="item.cdId"
              :value="item.cdId"
              >{{ item.cdNm }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('vpUserId') }}</span>
          <input
            type="text"
            class="form-control"
            v-model="dataObj.usrLoginId"
            maxlength="50"
            @keyup.enter="fnSearchList"
          />
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('vpUserNm') }}</span>
          <input
            type="text"
            class="form-control"
            v-model="dataObj.usrNm"
            maxlength="50"
            @keyup.enter="fnSearchList"
          />
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('iotId') }}</span>
          <input
            type="text"
            class="form-control"
            v-model="dataObj.iotUserId"
            maxlength="50"
            @keyup.enter="fnSearchList"
          />
        </div>
        <div class="form-group">
          <button
            class="btn btn-info input-group-addon"
            type="button"
            @click="fnSearchList()"
          >
            {{ $t('search') }}
          </button>
          <button
            class="btn btn-info"
            type="button"
            @click="fnInitSchBoxList()"
          >
            {{ $t('initializing') }}
          </button>
        </div>
      </div>
    </div>
    <div class="text-left float-left pt-3 pl-2"></div>
    <div class="mb-2 text-right">
      <button
        @click="syncPopup('user')"
        type="button"
        class="btn btn-gray"
        data-toggle="modal"
        data-target="#modal-write"
      >
        {{ $t('synchronization') }}
      </button>
    </div>
    <jqgrid
      ref="grid"
      name="vpUserMgmt"
      :colModels="colModelData"
      :colNames="colNameData"
      :dataList="dataList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      :multiselect="false"
      @onCellSelect="detailPopup"
      @getDataList="getIotVpUserList"
    ></jqgrid>
  </div>
</template>

<script>
import { requestApi } from '@/api/ccp/requestApi'
import Jqgrid from '@/components/Jqgrid'
import { getCommonCodeByParentCdId } from '@/api/common/code'

export default {
  name: 'VpUserMgmtSvc',
  components: {
    Jqgrid
  },
  props: {},
  data() {
    return {
      dataList: [],
      serverList: [],
      colNameData: [this.$t('row-num'), this.$t('vpUsrSeq'), this.$t('servMtServNm'), this.$t('vpUserId'), this.$t('vpUserNm'), this.$t('contact-number'), this.$t('iotId'), this.$t('iotNm'), this.$t('usrStatus'), this.$t('regDttm'), this.$t('modDttm')],
      colModelData: [
        { name: 'seq', index: 'seq', align: 'center', hidden: true },
        { name: 'vpUsrSeq', index: 'vpUsrSeq', align: 'center', hidden: true },
        { name: 'serverNm', index: 'serverNm', align: 'left' },
        { name: 'usrLoginId', index: 'usrLoginId', align: 'left' },
        { name: 'usrNm', index: 'usrNm', align: 'left' },
        { name: 'usrPhoneNo', index: 'usrPhoneNo', align: 'center' },
        { name: 'iotUserId', index: 'usrAuth', align: 'left' },
        { name: 'iotUserNm', index: 'usrAuth', align: 'left' },
        { name: 'usrStatusNm', index: 'usrStatusNm', align: 'left' },
        { name: 'regDttm', index: 'regDttm', align: 'center' },
        { name: 'modDttm', index: 'modDttm', align: 'center' }
      ],
      dataObj: { serverCd: '', usrLoginId: '', usrNm: '', iotUserId: '', currentPage: 1, displayRowCount: 15 },
      currentPage: 1,
      displayRowCount: 15,
      totPage: null,
      pageNum: null,
      pageInfo: [],
      xMid: 'P00331'
    }
  },
  created() {
    this.getIotVpServerList()
    this.fnSearchList()
  },
  mounted() {},
  computed: {},
  methods: {
    fnInitSchBoxList() {
      this.currentPage = 1
      this.dataObj = {
        serverCd: '',
        usrLoginId: '',
        usrNm: '',
        iotUserId: '',
        currentPage: 1,
        displayRowCount: 15
      }
      this.devClsCd = ''
      this.devMdlCd = ''
      // this.getIotVpUserList()
    },
    fnSearch() {
      this.currentPage = 1
      this.getIotVpUserList()
    },
    getIotVpServerList() {
      getCommonCodeByParentCdId({ parentCdId: 'GN00000366' }).then(data => {
        this.serverList = data
      })
    },
    getIotVpUserList() {
      this.dataObj.currentPage = this.currentPage
      this.dataObj.displayRowCount = this.displayRowCount
      requestApi({
        url: '/online/vpuser/getIotVpUserList',
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
      function(id, index, contents, event) {
        let object = this.dataList[id]
        let param = {}
        param.object = object
        param.serverList = this.serverList
        this.popup({
          component: () => import('@/views/vp/VpUserDetailSvc'),
          title: this.$t('vpUserDetail'),
          width: '900',
          height: '320',
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
          title: this.$t('vpUserSync'),
          width: '500',
          height: '220',
          data: param,
          callback: data => {}
        })
      },
      1000,
      { trailing: false }
    ),
    fnSearchList() {
      // 검색시에 현재 페이지 설정
      this.currentPage = 1
      this.getIotVpUserList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
