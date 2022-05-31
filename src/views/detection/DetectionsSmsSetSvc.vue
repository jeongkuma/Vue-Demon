<template>
  <div>
    <div class="search-box form-inline">
      <div class="form-group">
        <span class="form-label mx-1">{{ $t('service') }}</span>
        <select v-model="svcCd" ref="svcCd" class="form-control" title="서비스" @change="fnGetDevClsList">
          <option value>{{ $t('all') }}</option>
          <option
            v-for="(svc, index) in svcCdList"
            :key="`svcCd-${index}`"
            :value="svc.svcCd"
          >{{ svc.svcCdNm }}</option>
        </select>
      </div>
      <div class="form-group">
        <span class="form-label mx-1">{{ $t('dev-cls') }}</span>
        <select v-model="devClsCd" class="form-control" @change="fnGetDevMdlList" title="장비유형">
          <option value>{{ $t('all') }}</option>
          <option
            v-for="(devCls, index) in devClsList"
            :key="`devCls-${index}`"
            :value="devCls.devClsCd"
          >{{ devCls.devClsNm }}</option>
        </select>
      </div>
      <div class="form-group">
        <span class="form-label mx-1">{{ $t('dev-mdl-nm') }}</span>
        <select v-model="devMdlCd" class="form-control" title="장비모델">
          <option value>{{ $t('all') }}</option>
          <option
            v-for="(devMdl, index) in devMdlList"
            :key="`devMdlCd-${index}`"
            :value="devMdl.devMdlCd"
          >{{ devMdl.devMdlNm }}</option>
        </select>
      </div>
      <div class="form-group">
        <select v-model="searchType" class="form-control">
          <option v-for="(item , index) in searchTypeList" :key="'item' + index" :value="item.value">{{ item.name }}</option>
        </select>
      </div>
      <div class="form-group">
        <input v-model="searchText" type="text" class="form-control">
      </div>
      <div class="form-group">
        <span class="form-label mx-1">{{ $t('symptom-grade') }}</span>
        <select v-model="devDetSetCdId" class="form-control">
          <option value>{{ $t('all') }}</option>
          <option
            v-for="(cd, index) in devDetSetCdList"
            :key="`devDetSetCd-${index}`"
            :value="cd.cdId"
          >{{ cd.cdNm }}</option>
        </select>
      </div>
      <div class="form-group">
        <button class="btn btn-info" type="button" @click="search()">{{ $t('search') }}</button>
        <button
          class="btn btn-info"
          type="button"
          @click="fnInitializeSeach()"
        >{{ $t('initializing') }}</button>
      </div>
    </div>
    <div class="mb-2 text-right">
      <button type="button" class="btn btn-pink" @click="fnOpenAddPopup">{{ $t('registration') }}</button>
      <button type="button" class="btn btn-gray" @click="fnDelete">{{ $t('delete') }}</button>
    </div>
    <jqgrid
      ref="grid"
      name="detectionSms"
      :colModels="colModelData"
      :colNames="colNameList"
      :dataList="detectionSmsList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      @onCellSelect="fnOpenModifyPopup"
      @getDataList="fnGetList"
    >
    </jqgrid>
  </div>
</template>

<script>
import Jqgrid from '@/components/Jqgrid'

import { requestApi } from '@/api/ccp/requestApi'
import { getCommonCodeByParentCdId } from '@/api/common/code'
import { getSvcList, getDevClsCdListBySvcCd } from '@/api/common/usrSvcDevice'

export default {
  name: 'DetectionsSmsSetSvc',
  components: { Jqgrid },
  data() {
    return {
      xMid: 'P00010',
      svcCd: '',
      devClsCd: '',
      devMdlCd: '',
      searchType: 'all',
      searchText: '',
      searchTypeList: [
        { value: 'all', name: this.$t('search-type') },
        { value: 'entityId', name: this.$t('entity-id') },
        { value: 'ctn', name: this.$t('pin') + '(' + this.$t('ctn') + ')' },
        { value: 'usingNo', name: this.$t('using-no') },
        { value: 'devUname', name: this.$t('pin-nm') }
      ],
      devDetSetCdId: '', // 이상등급
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      svcCdList: [],
      devClsList: [],
      devMdlList: [],
      devDetSetCdList: [],
      detectionSmsList: [],
      colNameList: [
        this.$t('service'),
        this.$t('dev-cls'),
        this.$t('dev-mdl'),
        this.$t('ctn'),
        this.$t('pin-nm'),
        this.$t('attribute-name'),
        this.$t('symptom-grade'),
        this.$t('symptom-condition'),
        this.$t('alarm-message'),
        this.$t('regDttm')
      ],
      colModelData: [
        { name: 'svcCdNm', index: 'svcCd', align: 'center', width: '100' },
        {
          name: 'devClsCdNm',
          index: 'devClsCdNm',
          align: 'center',
          width: '100'
        },
        { name: 'devMdlNm', index: 'devMdlNm', align: 'center', width: '100' },
        { name: 'ctn', index: 'ctn', align: 'center', width: '100' },
        { name: 'devUname', index: 'devUname', align: 'center', width: '100' },
        {
          name: 'devAttbCdNm',
          index: 'devAttbCdNm',
          align: 'center',
          width: '100'
        },
        {
          name: 'devDetSetCdNm',
          index: 'devDetSetCdNm',
          align: 'center',
          width: '100'
        },
        {
          name: 'detSetCond',
          index: 'detSetCond',
          align: 'center',
          width: '100'
        },
        { name: 'sendMsg', index: 'sendMsg', align: 'center', width: '100' },
        { name: 'regDttm', index: 'regDttm', align: 'center', width: '100' }
      ]
    }
  },
  computed: {},
  watch: {},
  async created() {
    this.fnDevDetSetCdList()
    await this.fnGetSvcCdList()
    await this.fnGetDevClsList()
    this.fnGetList()
  },
  mounted() {},
  methods: {
    // ----------------- 옵션 항목 조회
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
            reject(e)
          })
      })
    },
    fnGetDevClsList() {
      return new Promise((resolve, reject) => {
        if (this.svcCd === '') {
          this.devClsCd = ''
          this.devClsList = []
          return false
        }
        getDevClsCdListBySvcCd({ xMid: this.xMid, svcCd: this.svcCd })
          .then(data => {
            this.devClsList = data.devClsList
            if (this.devClsList.length > 0) {
              this.devClsCd = this.devClsList[0].devClsCd
              this.fnGetDevMdlList({ devClsCd: this.devClsCd })
            }
            resolve()
          })
          .catch(e => {
            reject(e)
          })
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
          this.devMdlList = data.data
        }
      })
    },
    fnDevDetSetCdList() {
      this.devDetSetCdList = []
      this.devDetSetCdId = ''
      getCommonCodeByParentCdId({ xMid: this.xMid, parentCdId: 'DS00000001' })
        .then(data => {
          this.devDetSetCdList = data
        })
        .catch(e => {
          console.error(e)
        })
    },
    // ----------------- 목록 조회
    fnGetList() {
      let reqData = {
        svcCd: this.svcCd,
        devClsCd: this.devClsCd,
        devMdlCd: this.devMdlCd,
        devDetSetCdId: this.devDetSetCdId,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount
      }

      if (this.searchType === 'entityId') {
        reqData.entityId = this.searchText.trim()
      } else if (this.searchType === 'ctn') {
        reqData.ctn = this.searchText.trim()
      } else if (this.searchType === 'usingNo') {
        reqData.usingNo = this.searchText.trim()
      } else if (this.searchType === 'devUname') {
        reqData.devUname = this.searchText.trim()
      }

      requestApi({
        url: '/online/iotedevdetsms/retrieveEdevDetList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.detectionSmsList = res.data.dataList
          this.totPage = res.data.page.totPage
          this.currentPage = res.data.page.page
        }
      })
    },
    search() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitializeSeach() {
      this.svcCd = this.svcCdList[0].svcCd
      this.devClsCd = this.devClsList[0].devClsCd
      this.devMdlCd = ''
      this.devMdlList = []
      this.searchType = 'all'
      this.searchText = ''
      this.devDetSetCdId = ''
      this.fnGetDevClsList()
    },
    fnOpenAddPopup: _.throttle(
      function() {
        this.popup({
          component: () =>
            import('@/views/detection/DetectionAlarmAddPopupSvc'),
          title: this.$t('alarmAdd'),
          width: 'wide',
          height: '701',
          data: {},
          callback: () => {
            this.fnGetList()
          }
        })
      },
      1000,
      { trailing: false }
    ),
    fnOpenModifyPopup: _.throttle(
      function(id, index, contents, event) {
        let data = this.detectionSmsList[id]
        this.popup({
          component: () =>
            import('@/views/detection/DetectionAlarmModifyPopupSvc'),
          title: this.$t('alarmMod'),
          width: 'wide',
          height: '740',
          data: {
            eDevDetSetSeq: data.edevDetSetSeq
          },
          callback: data => {
            this.fnGetList()
          }
        })
      },
      1000,
      { trailing: false }
    ),
    fnDelete() {
      let idArr = this.$refs.grid.getSelectionIndexs()
      if (idArr.length === 0) {
        this.alert(this.$t('sms-det-null-alert'))
        return false
      }
      this.confirm(this.$t('delYn'), this.fnDeleteApi)
    },
    fnDeleteApi() {
      let idArr = this.$refs.grid.getSelectionIndexs()
      let detectionList = []
      for (let i = 0; i < idArr.length; i++) {
        let row = this.detectionSmsList[idArr[i]]
        detectionList.push({ eDevDetSetSeq: row.edevDetSetSeq })
      }

      requestApi({
        url: '/online/iotedevdetsms/deleteEdevDetSet',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: { detectionList: detectionList },
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('del-success'), 'success')
            this.search()
          }
        }
      })
    }
  }
}
</script>

<style></style>
