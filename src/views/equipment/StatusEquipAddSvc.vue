<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-36 lb-txt">서비스</span>
          <select v-model="svcCd" class="form-control" ref="svcCd" @change="getDevClsCdListBySvcCd">
            <option
              v-for="(svc, index) in svcList"
              :key="`svcCd-${index}`"
              :value="svc.svcCd"
            >{{ svc.svcCdNm }}</option>
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-36 lb-txt">{{ $t('dev-cls') }}</span>
          <select
            class="form-control"
            ref="devClsCd"
            id="devClsCd"
            @change="setDevCls($event)"
            v-model="devClsCd"
          >
            <option
              v-for="devType in devClsList"
              :key="devType.devClsCd"
              :value="devType.devClsCd"
            >{{ devType.devClsNm }}</option>
          </select>
        </div>
        <div class="form-item col-sm-5">
          <span class="form-label w-36 lb-txt">{{ $t('dev-mdl') }}</span>
          <select class="form-control" ref="devMdlCd" v-model="devMdlCd">
            <option
              v-for="devMdl in devMdlList"
              :key="devMdl.devMdlCd"
              :value="devMdl.devMdlCd"
            >{{ devMdl.devMdlNm }}</option>
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-36 lb-txt">{{ $t('pin') + '(' + $t('ctn') + ')' }}</span>
          <div class="input-group">
            <input
              v-model="ctn"
              type="text"
              id="ctn"
              name="ctn"
              class="form-control"
              title="식별번호(ctn)"
              @change="ctnChkFlag = false"
              maxlength="20"
            >
            <div class="input-group-button">
              <button
                type="button"
                class="btn btn-gray input-group-button"
                @click="fnCtnDuplChk()"
              >{{ $t('duplication-check') }}</button>
            </div>
          </div>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-36 lb-txt">{{ $t('pin-nm') }}</span>
          <div class="input-group">
            <input
              v-model="devUname"
              type="text"
              id="devUname"
              name="devUname"
              class="form-control w-48"
              title="식별명"
              @change="unameChkFlag = false"
              maxlength="20"
            >
            <div class="input-group-button">
              <button
                type="button"
                class="btn btn-gray"
                @click="fnUnameDuplChk()"
              >{{ $t('duplication-check') }}</button>
            </div>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-36">{{ $t('using-no') }}</span>
          <div class="input-group">
            <input
              v-model="usingNo"
              type="text"
              id="usingNo"
              name="usingNo"
              class="form-control"
              title="사용번호"
              @change="usingNoChkFlag = false"
              maxlength="20"
            >
            <div class="input-group-button">
              <button
                type="button"
                class="btn btn-gray"
                @click="fnUsingNoDuplChk()"
              >{{ $t('duplication-check') }}</button>
            </div>
          </div>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-36 lb-txt">{{ $t('entityId') }}</span>
          <div class="input-group">
            <input
              v-model="devUuid"
              type="text"
              class="form-control"
              title="UUID"
              @change="uuidChkFlag = false"
              maxlength="40"
            >
            <div class="input-group-button">
              <button
                type="button"
                class="btn btn-gray"
                @click="fnUuidDuplChk()"
              >{{ $t('duplication-check') }}</button>
            </div>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-36 lb-txt">{{ $t('inst-addr') }}</span>
          <div class="input-group">
            <input
              v-model="instAddr"
              type="text"
              id="instAddr"
              name="instAddr"
              class="form-control"
              title="설치주소"
              maxlength="85"
            >
            <div class="input-group-button">
              <button
                type="button"
                class="btn btn-gray"
                @click="fnSearchAddr()"
              >{{ $t('chg-addr') }}</button>
            </div>
          </div>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-36 lb-txt">{{ $t('inst-addr-detail') }}</span>
          <input
            v-model="instAddrDetail"
            type="text"
            id="instAddrDetail"
            name="instAddrDetail"
            class="form-control"
            title="상세주소"
            maxlength="85"
          >
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-36 lb-txt">{{ $t('addr-coordinate') }}</span>
          <div class="flex form-inline">
            <div class="input-group">
              <span class="w-10">{{ $t('inst-lat') }}</span>
              <input
                v-model="instLat"
                type="text"
                id="instLat"
                name="instLat"
                class="form-control"
                title="위도"
                maxlength="10"
                @input="onlyNumDecimalInput('instLat')"
              >
            </div>
            <div class="input-group pl-2">
              <span class="w-10">{{ $t('inst-lon') }}</span>
              <input
                v-model="instLon"
                type="text"
                id="instLon"
                name="instLon"
                class="form-control"
                title="경도"
                maxlength="11"
                @input="onlyNumDecimalInput('instLon')"
              >
            </div>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-36 lb-txt">{{ $t('inst-no') }}</span>
          <div class="input-group">
            <input
              v-model="instNo"
              type="text"
              id="instNo"
              name="instNo"
              class="form-control"
              title="시설번호"
              @change="instNoChkFlag = false"
              maxlength="20"
            >
            <div class="input-group-button">
              <button
                type="button"
                class="btn btn-gray pull-right"
                @click="fnInstNoDuplChk()"
              >{{ $t('duplication-check') }}</button>
            </div>
          </div>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-36">{{ $t('inst-nm') }}</span>
          <input
            v-model="devBuildingNm"
            type="text"
            id="devBuildingNm "
            name="devBuildingNm"
            class="form-control"
            title="시설명"
            maxlength="33"
          >
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-36">{{ $t('building-type') }}</span>
          <input
            v-model="devBuildingType"
            type="text"
            class="form-control"
            title="시설구분"
            maxlength="20"
          >
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-36">{{ $t('machine-no') }}</span>
          <input
            v-model="machineNo"
            type="text"
            id="machineNo"
            name="machineNo"
            class="form-control"
            title="기물번호"
            maxlength="20"
          >
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item">
          <span class="form-label w-36">{{ $t('dev-img') }}</span>
          <div class="input-file">
            <input
              v-model="devIcoImgNm"
              type="text"
              readonly="readonly"
              class="file-name"
              placeholder="선택 없음"
            >
            <label for="devIcoImgFile" class="file-label pull-right">{{ $t('file-select') }}</label>
            <input
              type="file"
              name="devIcoImg"
              id="devIcoImgFile"
              ref="devIcoImg"
              class="file-upload"
              style="display:none;"
              @change="setDevIcoImgNm"
              @input="fnFileCheck()"
            >
          </div>
          <span class="pl-2">{{ '* ' + $t('imgFiletType') }}</span>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-36">{{ $t('dev-regi-dt') }}</span>
          <datetime-picker
            :isPair="false"
            id="devRegiDt"
            v-model="devRegiDt"
            :date.sync="devRegiDt"
          ></datetime-picker>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-36">{{ $t('dev-inst-dt') }}</span>
          <datetime-picker
            :isPair="false"
            v-model="instDttm"
            :date.sync="instDttm"
            id="instDttm"
            ref="instDttm"
          ></datetime-picker>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-36 lb-txt">{{ $t('mng-org') }}</span>
          <div class="input-group">
            <input v-model="orgNm" type="text" class="form-control" title="관리조직" disabled>
            <div class="input-group-button">
              <button
                type="button"
                class="btn btn-gray pull-right"
                @click="fnSelectOrg()"
              >{{ $t('org-select') }}</button>
            </div>
          </div>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-36 lb-txt">{{ $t('dev-status') }}</span>
          <select v-model="statusCd" class="form-control" title="장비상태">
            <option
              v-for="status in statusList"
              :key="status.cdId"
              :value="status.cdId"
            >{{ status.cdNm }}</option>
          </select>
        </div>
      </div>

      <div v-if="entrDevEntrAttbs != null && entrDevEntrAttbs.length > 0">
        <h4 class="titH4">{{ $t('entr-dev-attr') }}</h4>
        <ul class="form-group">
          <li
            style="width:50%;float:left;"
            v-for="attbs in entrDevEntrAttbs"
            :key="attbs.devAttbCdId"
          >
            <label
              style="width:40%;float:left;padding: 10px 10px; word-break:break-all;"
              :for="'A_' + attbs.devAttbCdId"
            >{{ attbs.devAttbCdNm }}</label>
            <span style="width:60%;float:left;;padding: 5px 10px;">
              <input
                v-if="attbs.inputType == 'INPUT'"
                ref="attbs.devAttbCdId"
                type="text"
                :id="'A_' + attbs.devAttbCdId"
                :name="attbs.devAttbCdId"
                style="width:70%;float:left;"
                class="edev-attb form-control"
              >
              <select
                v-else-if="attbs.inputType == 'SELECT'"
                ref="eDevAttb.devAttbCdId"
                :id="'A_' + attbs.devAttbCdId"
                :name="attbs.devAttbCdId"
                class="form-control"
                style="width:70%;float:left;"
              >
                <option
                  v-for="attbSet in attbs.svcDevAtbSets"
                  :key="attbSet.devAtbSetCdId"
                  :value="attbSet.devAttbSetCdId"
                >{{ attbSet.devAttbSetCdNm }}</option>
              </select>
              <span style="width:30%;float:left;padding-top:10px;font-size:10px;">{{ attbs.unit }}</span>
            </span>
          </li>
        </ul>
      </div>
    </div>

    <div class="modal-footer">
      <div class="text-center">
        <button @click="submit()" type="button" class="btn btn-pink">{{ $t('create') }}</button>
        <button @click="close()" type="button" class="btn btn-gray">{{ $t('cancel') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { requestApi, requestMultipartJsonObject } from '@/api/ccp/requestApi'
import getRequestFileArray from '@/utils/inputFile'
import DatetimePicker from '@/components/DatetimePicker'
import moment from 'moment'
import { getSvcList, getDevClsCdListBySvcCd } from '@/api/common/usrSvcDevice'

export default {
  name: 'StatusEquipAddSvc',
  components: {
    DatetimePicker
  },
  props: {
    data: Object,
    callback: {
      type: Function,
      required: true
    },
    close: {
      type: Function,
      required: true
    },
    resizeModal: {
      type: Function,
      required: false
    }
  },
  data() {
    return {
      svcCd: '',
      svcList: [],
      entrDevSeq: null,
      devClsList: [],
      devMdlList: [],
      sndHPeriodList: [],
      sndMPeriodList: [],
      sndSPeriodList: [],
      colHPeriodList: [],
      colMPeriodList: [],
      colSPeriodList: [],
      colRadioPicked: 'CH',
      sndRadioPicked: 'SH',
      ctnChkFlag: false,
      usingNoChkFlag: false,
      instNoChkFlag: false,
      uuidChkFlag: false,
      unameChkFlag: false,
      devClsFlag: false,
      devMdlFlag: false,
      fileUploadUrl:
        'http://192.168.0.152:8090/ccp/online/IotlibraryBoard/downloadFile',
      regDate: null,
      devClsCd: null,
      devClsCdNm: null,
      devMdlCd: null,
      devBuildingNm: null,
      devMdlNm: null,
      ctn: null,
      devUname: null,
      usingNo: null,
      devUuid: null,
      instAddr: null,
      instAddrDetail: null,
      assistantAddr: null,
      instLat: null,
      instLon: null,
      devBuildingType: null,
      instNo: null,
      machineNo: null,
      devIcoImgNm: null,
      eDevAttbs: null,
      entrDevEntrAttbs: null,
      devRegiDt: null,
      instDttm: null,
      statusCd: 'A',
      periodUnits: {},
      colHPeriod: '',
      colMPeriod: '',
      colSPeriod: '',
      sndHPeriod: '',
      sndMPeriod: '',
      sndSPeriod: '',
      orgSeq: null,
      orgNm: null,
      statusList: [],
      attbLen: 0,
      fileTypeFlag: false,
      iccid: '',
      apiHeaders: {
        'Content-Type': 'application/json;charset=UTF-8',
        apiType: '01',
        apiVersion: '1.0.0',
        carrierType: '01',
        clientIp: '192.168.0.1',
        devInfo: '03',
        nwInfo: '02',
        speed: '25',
        validYn: 'Y',
        osInfo: '',
        devModel: '',
        telNo: '',
        xCoord: '',
        yCoord: '',
        gpsTime: ''
      },
      xMid: 'P00004'
    }
  },
  created() {
    this.getStatusCdList()
    this.getSvcList()
  },
  mounted() {
    this.setDate()
  },
  methods: {
    getSvcList() {
      getSvcList({ xMid: this.xMid })
        .then(data => {
          this.svcList = data
          if (this.svcList.length > 0) {
            this.svcCd = this.svcList[0].svcCd
            this.getDevClsCdListBySvcCd()
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    getDevClsCdListBySvcCd() {
      // 선택값 초기화
      this.devClsCd = 'all'
      this.devClsList = []
      if (this.svcCd === '') {
        return false
      }
      getDevClsCdListBySvcCd({ xMid: this.xMid, svcCd: this.svcCd })
        .then(data => {
          this.devClsList = data.devClsList
          this.devClsCd = this.devClsList[0].devClsCd

          this.getModels()
        })
        .catch(e => {
          console.error(e)
        })
    },
    onlyNumDecimalInput(nm) {
      var event = window.event
      if (nm === 'instLat') {
        this.instLat = event.target.value = event.target.value.replace(
          /[^.0-9_/]/g,
          ''
        )
      } else if (nm === 'instLon') {
        this.instLon = event.target.value = event.target.value.replace(
          /[^.0-9_/]/g,
          ''
        )
      }
    },
    getSndColList() {
      var sndreqData = {}
      sndreqData.devClsCd = this.devClsCd
      sndreqData.devMdlCd = this.devMdlCd

      requestApi({
        url: '/online/iotsdev/retrieveSDevSndColPeriodList',
        method: 'post',
        headers: {
          'X-MID': this.xMid
        },
        data: sndreqData,
        callback: result => {
          this.colHPeriodList = result.data.colHPeriodList
          this.colMPeriodList = result.data.colMPeriodList
          this.colSPeriodList = result.data.colSPeriodList
          this.sndHPeriodList = result.data.sndHPeriodList
          this.sndMPeriodList = result.data.sndMPeriodList
          this.sndSPeriodList = result.data.sndSPeriodList
        }
      })
    },
    fnFileCheck() {
      if (!/\.(jpg|bmp|ico|png)$/i.test(this.$refs.devIcoImg.value)) {
        if (this.$refs.devIcoImg.value !== '') {
          this.alert(this.$t('file-type-check'), 'warning')
          this.$refs.devIcoImg.value = null
          this.devIcoImgNm = null
          this.fileTypeFlag = false
        }
      } else {
        this.fileTypeFlag = true
      }
    },
    setDate() {
      this.devRegiDt = new Date()
      this.instDttm = new Date()
    },
    setDevCls() {
      this.getModels()
    },
    getModels() {
      this.devMdlList = []
      this.devMdlCd = ''

      if (this.devClsCd === '') {
        return false
      }
      requestApi({
        url: '/online/iotsdev/retrieveSvcDevMdlList',
        method: 'post',
        headers: {
          'X-MID': this.xMid
        },
        data: {
          devClsCd: this.devClsCd
        },
        callback: result => {
          var devModels = result.data
          if (devModels && devModels.length > 0) {
            this.devMdlList = devModels
            this.devMdlCd = devModels[0].devMdlCd
          }
        }
      })
    },
    fnCtnDuplChk() {
      if (!this.checkCtn() || !this.ctn) {
        this.alert(this.$t('edev-ctn-chk-msg'), 'error')
      } else {
        var reqData = {}
        reqData.devClsCd = this.devClsCd
        reqData.devMdlCd = this.devMdlCd
        reqData.ctn = this.ctn

        requestApi({
          url: '/online/iotedevregi/retrieveCtnDup',
          headers: {
            'X-MID': this.xMid
          },
          method: 'post',
          data: reqData,
          callback: res => {
            if (res.result.status === '200' || res.result.status === '204') {
              this.alert(res.data.msg, 'success')
              this.ctnChkFlag = true
              this.statusCd = 'A'
              this.entrDevSeq = res.data.entrDevSeq
              this.iccid = res.data.iccid
              if (this.iccid !== '' && this.iccid !== null) {
                this.createUuid()
                this.devClsCd = res.data.devClsCd
                this.devClsCd = res.data.devClsCd
                this.devClsCdNm = res.data.devClsCdNm

                this.devMdlCd = res.data.devMdlCd
                this.devMdlNm = res.data.devMdlCd

                this.devClsFlag = true
                this.devMdlFlag = true
              } else {
                this.entrDevSeq = null
                this.ctnChkFlag = true
                this.uuidChkFlag = false
                this.iccid = ''
                this.devClsFlag = false
                this.devMdlFlag = false
                reqData.devClsCd = this.devClsCd

                $('#devClsCd').focus()

                // 식별번호 체크 후 모델 조회 필요없을듯하여 주석처리
                // this.getModels(reqData)
              }
            } else {
              this.entrDevSeq = null
              this.ctnChkFlag = false
              this.uuidChkFlag = false
              this.iccid = ''
              this.devClsFlag = false
              this.devMdlFlag = false
            }
          }
        })
      }
    },
    createUuid() {
      var createData = {}
      createData.devMdlCd = this.devMdlCd
      createData.ctn = this.ctn
      createData.iccid = this.iccid

      requestApi({
        url: '/online/iotedev/createEntityId',
        method: 'post',
        headers: {
          'X-MID': this.xMid
        },
        data: createData,
        callback: result => {
          this.devUuid = result.data.entityId
          this.uuidChkFlag = true
        }
      })
    },
    fnUsingNoDuplChk() {
      if (this.usingNo === null || this.usingNo === '') {
        this.alert(this.$t('edev-usingno-chk-msg'), 'error')
      } else {
        var reqData = {}
        reqData.usingNo = this.usingNo
        requestApi({
          url: '/online/iotedevregi/retrieveUsingNoDup',
          headers: {
            'X-MID': this.xMid
          },
          method: 'post',
          data: reqData,
          callback: res => {
            if (res.result.status === '200' || res.result.status === '204') {
              this.alert(res.data.msg, 'success')
              this.usingNoChkFlag = true
            } else {
              this.usingNoChkFlag = false
            }
          }
        })
      }
    },
    fnUuidDuplChk() {
      if (this.devUuid === null || this.devUuid === '') {
        this.alert(this.$t('edev-entityId-chk-msg'), 'error')
      } else {
        var reqData = {}
        reqData.devUuid = this.devUuid
        requestApi({
          url: '/online/iotedevregi/retrieveUuidDup',
          headers: {
            'X-MID': this.xMid
          },
          method: 'post',
          data: reqData,
          callback: res => {
            if (res.result.status === '200' || res.result.status === '204') {
              this.alert(res.data.msg, 'success')
              this.uuidChkFlag = true
            } else {
              this.usingNoChkFlag = false
            }
          }
        })
      }
    },
    fnUnameDuplChk() {
      if (this.devUname === null || this.devUname === '') {
        this.alert(this.$t('edev-uname-chk-msg'), 'error')
      } else {
        var reqData = {}
        reqData.devUname = this.devUname
        requestApi({
          url: '/online/iotedevregi/retrieveUnameDup',
          headers: {
            'X-MID': this.xMid
          },
          method: 'post',
          data: reqData,
          callback: res => {
            if (res.result.status === '200' || res.result.status === '204') {
              this.alert(res.data.msg, 'success')
              this.unameChkFlag = true
            } else {
              this.unameChkFlag = false
            }
          }
        })
      }
    },
    fnInstNoDuplChk() {
      if (this.instNo !== null || this.instNo !== '') {
        var reqData = {}
        reqData.instNo = this.instNo
        requestApi({
          url: '/online/iotedevregi/retrieveInstNoDup',
          headers: {
            'X-MID': this.xMid
          },
          method: 'post',
          data: reqData,
          callback: res => {
            if (res.result.status === '200' || res.result.status === '204') {
              this.alert(res.data.msg, 'success')
              this.instNoChkFlag = true
            } else {
              this.instNoChkFlag = false
            }
          }
        })
      } else {
        this.alert(this.$t('edev-instno-chk-msg'))
      }
    },
    submit() {
      if (this.checkValid()) {
        // 장비유형명 넣어줌
        let devCls = this.devClsList.find(d => d.devClsCd === this.devClsCd)
        this.devClsCdNm = devCls.devClsNm
        this.confirm(this.$t('dev-create-confirm'), this.confirmCallback)
      }
    },
    confirmCallback() {
      if (this.entrDevSeq !== null && this.entrDevSeq !== '') {
        this.updateEntrDev()
      } else {
        this.createEntrDev()
      }
    },
    createEntrDev() {
      var reqData = {}
      reqData.svcCd = this.svcCd
      reqData.devClsCd = this.devClsCd
      reqData.devClsCdNm = this.devClsCdNm
      reqData.devMdlCd = this.devMdlCd
      reqData.devMdlNm = this.devMdlNm
      reqData.ctn = this.ctn
      reqData.devUname = this.devUname
      reqData.usingNo = this.usingNo
      reqData.devUuid = this.devUuid
      reqData.instAddr = this.instAddr
      reqData.instAddrDetail = this.instAddrDetail
      // 위도, 경도는 10000000을 곱해서 저장한다. 소수점은 버림
      reqData.instLat = Math.floor(this.instLat * 10000000)
      reqData.instLon = Math.floor(this.instLon * 10000000)
      reqData.instNo = this.instNo
      reqData.devBuildingNm = this.devBuildingNm
      reqData.devBuildingType = this.devBuildingType
      reqData.orgSeq = this.orgSeq
      reqData.devImgPath = this.devImgPath
      reqData.devImgFileNm = this.devImgFileNm
      reqData.machineNo = this.machineNo
      reqData.devRegiDt = moment(this.devRegiDt)
        .format('YYYYMMDD')
        .toString()
      reqData.instDttm = moment(this.instDttm)
        .format('YYYYMMDD')
        .toString()
      reqData.statusCd = this.statusCd
      reqData.iagStatusCd = '-'
      var entrDevAttbs = []

      if (this.entrDevEntrAttbs && this.entrDevEntrAttbs.length > 0) {
        this.entrDevEntrAttbs
          .filter(attr => {
            return true
          })
          .forEach((attr, index) => {
            var attbCurVal = {}
            attbCurVal.devClsCd = this.devClsCd
            attbCurVal.devClsCdNm = this.devClsCdNm
            attbCurVal.devMdlCd = this.devMdlCd
            attbCurVal.devMdlNm = this.devMdlNm
            attbCurVal.devAttbCdId = attr.devAttbCdId
            attbCurVal.devAttbCdNm = attr.devAttbCdNm
            attbCurVal.inputType = attr.inputType
            if (attr.inputType === 'SELECT') {
              attbCurVal.inputValue = $(
                'select[name=' + attr.devAttbCdId + ']'
              ).val()
            } else {
              attbCurVal.inputValue = $(
                'input[name=' + attr.devAttbCdId + ']'
              ).val()
            }
            entrDevAttbs.push(attbCurVal)
          })
        reqData.entrDevCurValues = entrDevAttbs
      }
      this.callRegistApi(reqData)
    },
    updateEntrDev() {
      var updateReqData = {}
      updateReqData.entrDevSeq = this.entrDevSeq
      updateReqData.devClsCd = this.devClsCd
      updateReqData.devClsCdNm = this.devClsCdNm
      updateReqData.devMdlCd = this.devMdlCd
      updateReqData.devMdlNm = this.devMdlNm
      updateReqData.ctn = this.ctn
      updateReqData.devUname = this.devUname
      updateReqData.usingNo = this.usingNo
      updateReqData.devUuid = this.devUuid
      updateReqData.instAddr = this.instAddr
      updateReqData.instAddrDetail = this.instAddrDetail
      updateReqData.devBuildingNm = this.devBuildingNm
      updateReqData.devBuildingType = this.devBuildingType
      // 위도, 경도는 1000000을 곱해서 저장한다. 소수점은 버림
      updateReqData.instLat = Math.floor(this.instLat * 10000000)
      updateReqData.instLon = Math.floor(this.instLon * 10000000)
      updateReqData.instNo = this.instNo
      updateReqData.orgSeq = this.orgSeq
      updateReqData.devImgPath = this.devImgPath
      updateReqData.devImgFileNm = this.devImgFileNm
      updateReqData.machineNo = this.machineNo
      updateReqData.devRegiDt = moment(this.devRegiDt)
        .format('YYYYMMDD')
        .toString()
      updateReqData.instDttm = moment(this.instDttm)
        .format('YYYYMMDD')
        .toString()
      updateReqData.statusCd = this.statusCd
      updateReqData.iagStatusCd = 'A'
      updateReqData.colPeriod = 60
      updateReqData.colUnit = 'DS00000016'
      updateReqData.sndPeriod = 60
      updateReqData.sndUnit = 'DS00000016'

      var entrDevAttbs = []
      if (this.attbList && this.attbList.length > 0) {
        this.attbList
          .filter(attr => {
            return true
          })
          .forEach((attr, index) => {
            var attbCurVal = {}
            attbCurVal.devClsCd = this.devClsCd
            attbCurVal.devClsCdNm = this.devClsCdNm
            attbCurVal.devMdlCd = this.devMdlCd
            attbCurVal.devMdlNm = this.devMdlNm
            attbCurVal.devAttbCdId = attr.devAttbCdId
            attbCurVal.devAttbCdNm = attr.devAttbCdNm
            attbCurVal.inputType = attr.inputType
            if (attr.inputType === 'SELECT') {
              attbCurVal.inputValue = $(
                'select[name=' + attr.devAttbCdId + ']'
              ).val()
            } else {
              attbCurVal.inputValue = $(
                'input[name=' + attr.devAttbCdId + ']'
              ).val()
            }
            entrDevAttbs.push(attbCurVal)
          })
        updateReqData.entrDevCurValues = entrDevAttbs
      }
      this.updateCallRegistApi(updateReqData)
    },
    updateCallRegistApi(reqData) {
      requestMultipartJsonObject({
        url: '/online/iotedevregi/updateEntrDev',
        headers: {
          'X-MID': this.xMid
        },
        // callback 함수 정의 시 화살표 함수를 사용해야 this 객체 사용가능함.
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.callback()
            this.close()
            this.alert(this.$t('save-success'), 'success')
          }
        },
        data: reqData,
        files: getRequestFileArray([this.$refs.devIcoImg])
      })
    },
    checkValid() {
      if (this.ctn === null || this.ctn === '') {
        this.alert(this.$t('edev-ctn-chk-msg'))
        return false
      }
      if (!this.ctnChkFlag) {
        this.alert(this.$t('edev-ctn-duplchk-msg'))
        return false
      }
      if (this.devUname === null || this.devUname === '') {
        this.alert(this.$t('edev-uname-chk-msg'))
        return false
      }
      if (!this.unameChkFlag) {
        this.alert(this.$t('edev-uname-duplchk-msg'))
        return false
      }
      if (this.usingNo === null || this.usingNo === '') {
        this.alert(this.$t('edev-usingno-chk-msg'))
        return false
      }
      if (
        this.usingNo !== null &&
        this.usingNo !== '' &&
        !this.usingNoChkFlag
      ) {
        this.alert(this.$t('edev-usingno-duplchk-msg'))
        return false
      }
      if (this.instNo !== null && this.instNo !== '' && !this.instNoChkFlag) {
        this.alert(this.$t('edev-instno-duplchk-msg'))
        return false
      }
      if (this.instAddr === null || this.instAddr === '') {
        this.alert(this.$t('edev-instaddr-chk-msg'))
        return false
      }
      if (this.instAddrDetail === null || this.instAddrDetail === '') {
        this.alert(this.$t('edev-instaddrdetail-chk-msg'))
        return false
      }
      if (
        this.instLat === null ||
        this.instLat === '' ||
        this.instLon === null ||
        this.instLon === ''
      ) {
        this.alert(this.$t('edev-location-chk-msg'))
        return false
      }
      if (this.instLat >= 1000) {
        this.alert(this.$t('instLat-limit'))
        return false
      }
      if (this.instLon >= 1000) {
        this.alert(this.$t('instLon-limit'))
        return false
      }
      // if (this.statusCd === 'S') {
      //   this.alert(this.$t('stopstatus-not-save'))
      //   return false
      // }
      if (
        this.orgNm === '' ||
        this.orgNm === null ||
        this.orgSeq === '' ||
        this.orgSeq === null
      ) {
        this.alert(this.$t('request-org-select'))
        return false
      }
      if (!this.isNumberKey()) {
        this.alert(this.$t('edev-reg-instLat-check'))
        return false
      }
      return true
    },
    callRegistApi(reqData) {
      requestMultipartJsonObject({
        url: '/online/iotedevregi/createEntrDev',
        headers: {
          'X-MID': this.xMid
        },
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.callback()
            this.close()
            this.alert(this.$t('save-success'), 'success')
          }
        },
        data: reqData,
        files: getRequestFileArray([this.$refs.devIcoImg])
      })
    },
    setDevIcoImgNm(event) {
      var maxFileSize = '1048576‬'
      if (parseInt(event.target.files[0].size) > parseInt(maxFileSize)) {
        this.alert(
          this.$t('max-size').replace(
            '$0',
            parseInt(maxFileSize) / (1024 * 1024)
          ),
          'warning'
        )
        this.$refs.devIcoImg.value = null
        this.devIcoImgNm = null
        this.fileTypeFlag = false
      } else {
        this.devIcoImgNm = event.target.files[0].name
      }
    },
    checkCtn() {
      // let regPhone = /^\d{3}\d{3,4}\d{4}$/
      // return regPhone.test(this.ctn)
      return true
    },
    fnSelectOrg() {
      this.popup({
        component: () => import('@/views/custusr/user/UsersOrganizationSvc'),
        title: this.$t('user-org'),
        width: '500',
        height: '450',
        data: {},
        callback: data => {
          this.orgSeq = data.orgSeq
          this.orgNm = data.orgNm
        }
      })
    },
    getStatusCdList() {
      // var reqData = {}
      // reqData.parentCdId = 'GN00000022'
      // reqData.charSet = 'ko'
      // requestApi({
      //   url: '/online/iotcmcd/retrieveIotByParentCmCdRuntime',
      //   headers: {
      //     'X-MID': this.xMid
      //   },
      //   method: 'post',
      //   data: reqData,
      //   callback: (res) => {
      //     if (res.result.status === '200' || res.result.status === '204') {
      //       this.statusList = res.data
      //     }
      //   }
      // })
      this.statusList = [{ cdId: 'A', cdNm: '사용중' }]
    },
    // 주소검색
    fnSearchAddr() {
      let reqData = {}
      let headers = this.apiHeaders
      let body = {
        cutflag: '0',
        coordtype: '1',
        startposition: '0',
        reqcount: '1',
        depth: '1',
        mode: '3',
        query: this.instAddr,
        spopt: '0',
        radius: '',
        admcode: '',
        x1: '',
        y1: '',
        x2: '',
        y2: '',
        sortopt: '4',
        neighboropt: '1'
      }
      reqData.api = 'searchSQE'
      reqData.headers = headers
      reqData.body = body

      requestApi({
        url: '/online/iotmapinfra/getPoi',
        headers: {
          'X-MID': this.xMid,
          'X-VNAME': 'ONLINE',
          'X-CHANNEL': 'UI'
        },
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            if (res.data.result) {
              let admcount = parseInt(res.data.admcount, 10)
              let poicount = parseInt(res.data.poicount, 10)
              let adm = res.data.adm
              let poi = res.data.poi

              if (admcount > 0) {
                this.instAddr = adm[0].roadname + ' ' + adm[0].roadjibun
                if (adm[0].roadname === '') {
                  this.instAddr = adm[0].address + ' ' + adm[0].jibun
                }
                this.instLat = adm[0].posy
                this.instLon = adm[0].posx
              } else if (poicount > 0) {
                this.instAddr = poi[0].roadname + ' ' + poi[0].roadjibun
                if (poi[0].roadname === '') {
                  this.instAddr = poi[0].address + ' ' + poi[0].jibun
                }
                this.instLat = poi[0].dpy
                this.instLon = poi[0].dpx
              } else {
                this.alert(this.$t('no-address-found'), 'warning')
              }
            } else {
              this.alert(this.$t('no-address-found'), 'warning')
            }
          }
        },
        method: 'post',
        data: reqData
      })
    },
    fnCheckModal(mSeq) {
      if ($('modal').length >= mSeq) {
        return false
      } else {
        return true
      }
    },
    isNumberKey() {
      var _pattern2 = /^-?(\d{1,2}([.]\d{0,7})?)?$/
      if (_pattern2.test(this.instLat) && this.instLat <= 90) {
        // 정수 2자리, 소수점 뒤 일곱자리
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="less" scoped>
// border-bottom1{border-bottom: 1px solid #d4dce4;}
</style>
