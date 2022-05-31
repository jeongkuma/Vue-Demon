<template>
  <div>
    <div class="modal-body">
      <div class="form-item">
        <label class="control-label">
          {{
          $t('stat-act-ctl-type-txt')
          }}
        </label>
        <div class="col-sm-4">
          <!--            <input type="text" value="PSM" id="ctl" class="form-control" placeholder="" title="처리구분" disabled/>-->
          <select v-model="ctrlType" class="form-control" title="처리구분">
            <!--              <option value="">{{$t('all')}}</option>-->
            <option v-for="type in accuTypeList" :key="type.cdId" :value="type.cdId">{{type.cdNm}}</option>
          </select>
        </div>
        <div class="col-sm-4" v-if="ctrlType === 'GN00000114'">
          <datetime-picker
            :isPair="false"
            :hour="true"
            :minute="true"
            :minDate="getCurrentDate"
            id="selectedResDate"
            v-model="selectedResDate"
            :date.sync="selectedResDate"
          ></datetime-picker>
        </div>
      </div>

      <div class="form-item">
        <label class="control-label">
          {{
          $t('dev-mdl')
          }}
        </label>
        <div class="col-sm-4">
          <input type="text" class="form-control" v-model="devMdlCd" disabled>
        </div>
      </div>

      <div class="mt-1 mb-1">{{ $t('stat-act-all-ctl-comm-txt') }}</div>
      <div class="table-wrap">
        <table class="table table-col">
          <colgroup>
            <col style="width:40px;">
            <col style="width:auto;">
            <col style="width:auto;">
            <col style="width:auto;">
          </colgroup>
          <thead>
            <tr>
              <th scope="col">
                <div class="form-check">
                  <label for="checkedAll" class="form-check-label">
                    <input
                      v-model="checkedAll"
                      type="checkbox"
                      id="checkedAll"
                      name="chkAttb"
                      class="form-check-input"
                      @click="fnCheckAll"
                    >
                    <span class="form-check-sign"></span>
                  </label>
                </div>
              </th>
              <th scope="col">{{ $t('stat-act-colum-txt') }}</th>
              <th scope="col">{{ $t('stat-act-cur-val-txt') }}</th>
              <th scope="col">{{ $t('stat-act-chn-val-txt') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in itemList" :key="`item-${index}`">
              <td>
                <div class="form-check">
                  <label :for="`check-${index}`" class="form-check-label">
                    <input
                      v-model="checkedList"
                      type="checkbox"
                      :id="`check-${index}`"
                      name="checkedItem"
                      class="form-check-input"
                      :value="item"
                    >
                    <span class="form-check-sign"></span>
                  </label>
                </div>
              </td>
              <td>{{ item.devAttbCdNm }} ({{ item.pamKey }})</td>
              <td>
                <!-- 선택 장비가 1개일 경우 값 표시 -->
                <template
                  v-if="
                    data.entrDevSeqAr.length === 1 &&
                      item.curDevVal !== null &&
                      item.curDevVal !== ''
                  "
                >{{ item.curDevVal }}</template>
                <template
                  v-if="data.entrDevSeqAr.length > 1"
                >{{ $t('stat-act-all-sel-txt') }} ({{ data.entrDevSeqAr.length}}{{ $t('stat-act-sel-cnt-txt') }})</template>
              </td>
              <td>
                <template v-if="item.inputType === 'SELECT'">
                  <!-- 계측주기제어, 통신주기제어 -->
                  <div class="form-inline">
                    <select
                      v-if="item.devAttbCdId === 'DA00000071' || item.devAttbCdId === 'DA00000072'"
                      v-model="item.unit"
                      class="form-control attbTimeGubun"
                      style="width:70px;"
                    >
                      <option
                        v-if="fnCheckCtrlSetOption(item.ctrlSetList, 'DS00000008')"
                        value="DS00000008"
                      >{{$t('stat-act-time-sec-txt')}}</option>
                      <option
                        v-if="fnCheckCtrlSetOption(item.ctrlSetList, 'DS00000016')"
                        value="DS00000016"
                      >{{$t('stat-act-time-minu-txt')}}</option>
                      <option
                        v-if="fnCheckCtrlSetOption(item.ctrlSetList, 'DS00000023')"
                        value="DS00000023"
                      >{{$t('stat-act-time-hour-txt')}}</option>-->
                    </select>
                    <select class="form-control" v-model="item.devVal">
                      <option value>선택</option>
                      <option
                        v-for="(opt, index) in item.ctrlSetList"
                        :key="`ctrlSet-${index}`"
                        :value="opt.devAttbSetVal"
                      >{{ opt.devAttbSetCdNm }}</option>
                    </select>
                  </div>
                </template>
                <template v-else>
                  <input class="form-control" type="text" v-model="item.devVal">
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="modal-footer">
      <div class="btn-wrap text-center">
        <!--        <button-->
        <!--          @click="fnSyncTime()"-->
        <!--          type="button"-->
        <!--          class="btn btn-pink rounded"-->
        <!--          v-show="visibleSyncTimeButton"-->
        <!--        >-->
        <!--          {{ $t('stat-act-timer-txt') }}-->
        <!--        </button>-->
        <button @click="fnSave()" type="button" class="btn btn-pink">{{ $t('control') }}</button>
        <button @click="fnClose()" type="button" class="btn btn-gray">{{ $t('cancel') }}</button>
        <button
          @click="fnDeleteCtrl()"
          type="button"
          class="btn btn-gray"
        >{{ $t('act-rep-del-btn-txt') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { requestApi } from '@/api/ccp/requestApi'
import moment from 'moment'
import { getCommonCodeByParentCdId } from '@/api/common/code'
import DatetimePicker from '@/components/DatetimePicker'

export default {
  name: 'StatusActuatorAllCtlSvc',
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
  components: {
    DatetimePicker
  },
  data() {
    return {
      xMid: 'P00008',
      ctrlType: null,
      itemList: [],
      timeSyncItemList: [],
      checkedList: [],
      visibleSyncTimeButton: true,
      checkedAll: false,
      accuTypeList: [],
      selectedResDate: null,
      ctlSvrType: null,
      devMdlCd: null,
      apiUri: null
    }
  },
  computed: {
    getCurrentDate() {
      return new Date()
    }
  },
  watch: {
    checkedList() {
      this.checkedAll = this.checkedList.length === this.itemList.length
    },
    ctrlType(val) {
      this.selectedResDate = val === 'GN00000114' ? this.selectedResDate : null
    }
  },
  created() {
    this.devMdlCd = this.data.devMdlCd
    this.ctlSvrType = this.data.ctlSvrType
    this.apiUri = this.data.apiUri
    this.fnGetItemList()
    this.getAccuTypeList()
  },
  mounted() {
    // 선택장비가 1개이고, 'TB_외전 기존' 모델이면 시간동기화 버튼 숨김
    if (this.data.entrDevSeqAr.length === 1) {
      if (window.ctrlinfo.chkOneMdl.indexOf(this.data.devMdlCd) !== -1) {
        this.visibleSyncTimeButton = false
      }
    }
  },
  methods: {
    getAccuTypeList() {
      getCommonCodeByParentCdId({ xMid: this.xMid, parentCdId: 'GN00000016' })
        .then(data => {
          if (!this.ctlSvrType.includes('M2M')) {
            data = data.filter(data => data.cdNm !== 'PSM')
          } else {
            data = data.filter(data => data.cdNm === 'PSM')
          }
          this.accuTypeList = data
          this.ctrlType = data[0].cdId
        })
        .catch(e => {
          console.error(e)
        })
    },
    fnGetItemList() {
      // 첫번째 장비만 조회
      let reqData = {
        entrDevSeq: this.data.entrDevSeqAr[0],
        devMdlCd: this.data.devMdlCd
      }

      requestApi({
        url: '/online/iotctr/retrieveTbIotCtrlRsvList',
        headers: {
          'X-MID': 'P00008'
        },
        method: 'post',
        data: reqData,
        callback: data => {
          // 시간동기화(DA00000073) 항목 목록
          this.timeSyncItemList = data.data.dataList.filter(
            item => item.devAttbCdId === 'DA00000073'
          )
          // 시간동기화(DA00000073) 외 항목 리스트
          this.itemList = data.data.dataList.filter(
            item => item.devAttbCdId !== 'DA00000073'
          )
          if (this.itemList.length === 0) {
            return false
          }

          if (this.data.entrDevSeqAr.length === 1) {
            // this.ctrlType = this.itemList[0].ctlType
          }

          let selectTypeItemList = this.itemList.filter(
            item => item.inputType === 'SELECT'
          )
          selectTypeItemList.forEach(item => {
            this.fnGetCtlSetList(item)
          })
        }
      })
    },
    fnGetCtlSetList(item) {
      requestApi({
        url: '/online/iotctr/retrieveTbIotCtrlAttbList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: { sdevAttbSeq: item.sdevAttbSeq },
        callback: data => {
          item.ctrlSetList = data.data.dataList
          item.devVal = data.data.dataList[0].devAttbSetVal
        }
      })
    },
    fnSyncTime() {
      let ctrList = []
      let toDay = moment().format('YYYYMMDDHHmmss')
      for (var i = 0; i < this.timeSyncItemList.length; i++) {
        this.timeSyncItemList[i].ctlType = this.ctrlType // 처리구분
        this.timeSyncItemList[i].ctlDate = toDay // 제어일자
        this.timeSyncItemList[i].resDate = toDay // 예약일자
        this.timeSyncItemList[i].retryCnt = 0 // 재처리 횟수
        this.timeSyncItemList[i].entityId = this.timeSyncItemList[i].devUuid
        this.timeSyncItemList[i].devAttrCdId = this.timeSyncItemList[i].devAttbCdId
        this.timeSyncItemList[i].devAttrCdNm = this.timeSyncItemList[i].devAttbCdNm
        this.timeSyncItemList[i].devVal = 'current time' // 제어항목 입력값
        ctrList.push(JSON.parse(JSON.stringify(this.timeSyncItemList[i]))) // 객체 깊은 복사
      }
      if (ctrList.length === 0) {
        this.alert(this.$t('stat-act-timer-null-alert'))
        return
      }

      let reqData = {
        entrDevSeqAr: this.data.entrDevSeqAr,
        entrDevList: this.data.entrDevList,
        ctrList: ctrList
      }

      requestApi({
        url: '/online/iotctr/insertIoTCtrlRsv',
        headers: {
          'X-MID': 'P00008'
          // 'X-VNAME': 'IOTCTRL'
        },
        method: 'post',
        data: reqData,
        callback: data => {
          if (data.result.status === '200' || data.result.status === '204') {
            if (
              data.data.msgList !== undefined &&
              data.data.msgList.length > 0
            ) {
              this.alert(this.$t('stat-act-ctrl-del-ins-alert'))
            } else {
              this.alert(this.$t('stat-act-timer-ins-ok-alert'))
            }
          }
        }
      })
    },
    fnSave() {
      let reqData = {
        entrDevSeqAr: this.data.entrDevSeqAr,
        entrDevList: this.data.entrDevList,
        ctrList: []
      }
      let validDevVal = true

      // 예약 제어 유효성 및 값 변경
      if (this.ctrlType === 'GN00000114') {
        if (this.selectedResDate === null || this.selectedResDate === '') {
          this.alert(this.$t('stat-act-date-null-alert'))
          return
        }
      }

      let toDay = moment().format('YYYYMMDDHHmmss')
      for (let i = 0; i < this.checkedList.length; i++) {
        let item = this.checkedList[i]
        item.ctlType = this.ctrlType // 처리구분
        item.ctlDate = toDay // 제어일자
        if (this.ctrlType === 'GN00000114') {
          item.resDate = moment(this.selectedResDate).format('YYYYMMDDHHmmss')
        } else {
          item.resDate = toDay // 예약일자
        }
        item.retryCnt = 0 // 재처리 횟수
        item.entityId = item.devUuid
        item.devAttrCdId = item.devAttbCdId
        item.devAttrCdNm = item.devAttbCdNm
        // item.devVal = item.devVal // 제어항목 입력값

        // 계측 주기, 통신 주기는 시간 선택 값 넣는 부분이 있음
        if (item.devAttrCdId === 'DA00000071') {
          reqData.colUnit = item.colUnit
          reqData.colPeriod = item.devVal
        } else if (item.devAttrCdId === 'DA00000072') {
          reqData.sndUnit = item.colUnit
          reqData.sndPeriod = item.devVal
        }

        if (item.devVal === null || item.devVal === '') {
          validDevVal = false
        }

        item.apiUri = this.apiUri
        reqData.ctrList.push(item)
      }

      // -------------------- STARAT - 기존장비(특정모델) 제어항목 1건씩만 등록
      let checkCount = true // 제어항목 개수체크
      let checkCtn = false // 특정ctn 제어항목 존재체크

      // 특정모델의경우 1건씩 등록가능
      // 2021-07-30 정병수 : 하드코딩된 모델에서, PSM 제어가 가능한 장비모델에 대해서만 유효성 검사 가능하도록 수정
      if (this.ctlSvrType.includes('M2M')) {
        // if (window.ctrlinfo.chkOneMdl.indexOf(this.data.devMdlCd) !== -1) {
        checkCtn = true
        if (reqData.ctrList.length > 1) {
          checkCount = false
        }
      }
      if (checkCount === false) {
        this.alert(this.$t('stat-act-dev-imme-alert'))
        return
      }
      // 특정Ctn확인, 선택장비 1건, 제어항목이 1건일때
      if (
        checkCtn &&
        this.data.entrDevSeqAr.length === 1 &&
        reqData.ctrList.length === 1
      ) {
        let oKDevAttrCdId = ''
        for (let i = 0; i < reqData.ctrList.length; i++) {
          if (
            reqData.ctrList[i].prcCd === '00' ||
            reqData.ctrList[i].prcCd === '10' ||
            reqData.ctrList[i].prcCd === '02'
          ) {
            oKDevAttrCdId = reqData.ctrList[i].devAttrCdId
          }
        }
        if (
          oKDevAttrCdId === reqData.ctrList[0].devAttrCdId ||
          oKDevAttrCdId === ''
        ) {
          // 예약된 항목건, 예약 항목없을때 True
        } else {
          this.alert(this.$t('stat-act-ins-one-alert'))
          return
        }
      }
      // -------------------- END - 기존장비(특정모델) 제어항목 1건씩만 등록

      // 예약시 등록불가, 알림창 노출
      if (this.data.entrDevSeqAr.length === 1) {
        for (var k3 = 0; k3 < reqData.ctrList.length; k3++) {
          if (reqData.ctrList[k3].prcCd === '00') {
            this.alert(
              reqData.ctrList[k3].devAttrCdNm + this.$t('stat-act-del-ok-alert')
            )
            return
          }
        }
      }
      if (reqData.ctrList.length === 0) {
        this.alert(this.$t('stat-act-ctrl-null-alert'))
        return
      }
      if (!validDevVal) {
        this.alert(this.$t('stat-act-chn-null-alert'))
        return
      }

      // 계측주기 범위 확인
      if (reqData.colPeriod) {
        if (
          parseInt(reqData.colPeriod) < 1 ||
          parseInt(reqData.colPeriod) > 1440
        ) {
          this.alert(this.$t('sndCol-min-max-chk'))
          return
        }
        let item72 = this.itemList.find(i => i.devAttbCdId === 'DA00000072')
        if (
          !reqData.sndPeriod &&
          reqData.sndPeriod === '' &&
          this.data.entrDevSeqAr.length === 1 &&
          parseInt(item72.curDevVal) < parseInt(reqData.colPeriod)
        ) {
          this.alert(this.$t('stat-act-size-diff-alert'))
          return
        }
      }

      // 통신주기 범위 확인
      if (reqData.sndPeriod) {
        if (
          parseInt(reqData.sndPeriod) < 1 ||
          parseInt(reqData.sndPeriod) > 1440
        ) {
          this.alert(this.$t('sndCol-min-max-chk'))
          return
        }
        let item71 = this.itemList.find(i => i.devAttbCdId === 'DA00000071')
        if (
          !reqData.colPeriod &&
          reqData.colPeriod === '' &&
          this.data.entrDevSeqAr.length === 1 &&
          parseInt(item71.curDevVal) < parseInt(reqData.sndPeriod)
        ) {
          this.alert(this.$t('stat-act-size-diff-alert'))
          return
        }
      }
      // 계측주기,통신주기 둘다 입력시 값 확인
      if (
        reqData.sndPeriod &&
        reqData.colPeriod &&
        parseInt(reqData.sndPeriod) < reqData.colPeriod
      ) {
        this.alert(this.$t('stat-act-size-diff-alert'))
        return
      }

      requestApi({
        url: '/online/iotctr/insertIoTCtrlRsv',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: data => {
          if (data.result.status === '200' || data.result.status === '204') {
            if (
              data.data.msgList !== undefined &&
              data.data.msgList.length > 0
            ) {
              this.alert(this.$t('stat-act-ctrl-del-ins-alert'))
            } else {
              this.alert(this.$t('stat-act-ins-ok-alert'), 'success')
            }
            this.callback(true)
            this.close()
          }
        }
      })
    },
    fnClose() {
      this.close()
    },
    // 체크 관련
    fnCheckAll(event) {
      if (event.target.checked) {
        this.checkedList = this.itemList
      } else {
        this.checkedList = []
      }
    },
    fnCheckCtrlSetOption(list, value) {
      let index = list.findIndex(item => item.setParentCdId === value)
      return index > -1
    },
    fnDeleteCtrl() {
      // 선택된 속성이 없을 경우
      // 2021-08-04 : 장비의 전체 속성 중 예약인 속성에 대해서만 전체 취소하는 로직으로 수정됨에 따라 유효성 체크 제거
      // if (this.checkedList.length === 0) {
      //   this.alert(this.$t('act-rep-ctl-list-chk-alert'))
      //   return
      // }

      let reservChk = false
      this.itemList.forEach(item => {
        if (item.prcCd === '00') {
          reservChk = true
        }
      })

      if (!reservChk) {
        this.alert(this.$t('act-rep-del-nok-alert'))
        return
      }

      this.confirm(this.$t('stat-act-del-conf-alert'), this.fnDeleteCtrlAPI)

      // let prcCdList = []
      // let validPrcCd = true
      // let ctlTypeList = []
      // let validCtlType = true
      //
      // this.checkedList.forEach(item => {
      //   if (!prcCdList.includes(item.prcCd)) {
      //     prcCdList.push(item.prcCd)
      //     if (item.prcCd !== '00') {
      //       validPrcCd = false
      //     }
      //   }
      //   if (!ctlTypeList.includes(item.ctlType)) {
      //     ctlTypeList.push(item.ctlType)
      //     if (item.ctlType === 'GN00000112') {
      //       validCtlType = false
      //     }
      //   }
      // })
      // if (!validPrcCd || !validCtlType) {
      //   this.alert(this.$t('act-rep-ctl-type-chk-alert'))
      //   return
      // }
      //
      // this.confirm(this.$t('stat-act-del-conf-alert'), this.fnDeleteCtrlAPI)
    },
    fnDeleteCtrlAPI() {
      // let ctrList = []
      // // let checkedIds = $('#actuatorReportTb').jqGrid('getGridParam', 'selarrrow')
      // this.checkedList.forEach(data => {
      //   ctrList.push(data)
      // })

      let reqData = {
        ctrList: this.itemList
      }
      requestApi({
        url: '/online/iotctrlHist/deleteIotCtrlList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: data => {
          this.alert(this.$t('act-rep-del-ok-alert'), 'success', this.fnGetList)
          this.callback(true)
          this.close()
        }
      })
    }
  }
}
</script>

<style></style>
