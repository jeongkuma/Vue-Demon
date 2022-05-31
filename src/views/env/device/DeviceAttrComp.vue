<template>
  <div class="col-md-12">
    <div class="tit-wrap btn-in">
      <h4 class="titH4">{{$t('device-attr')}}</h4>
      <div class="pull-right">
        <button @click="fnUploadExcelPopup('devAttr')" :disabled="isNew" type="button" class="btn btn-pink rounded">{{$t('addAll')}}</button>
        <button @click="fnAddDeviceAttr" :disabled="isNew" class="btn btn-info" type="button">{{$t('add')}}</button>
      </div>
    </div>
    <div class="table-wrap y-scroll table-height">
      <table class="table table-col">
        <caption>{{$t('device-attr')}} {{$t('registration')}}</caption>
        <colgroup>
          <col style="width:50px">
          <col style="width:auto">
          <col style="width:auto">
          <col style="width:auto">
          <col style="width:auto">
          <col style="width:auto">
          <col style="width:auto">
          <col style="width:auto">
          <col style="width:auto">
          <col style="width:auto">
          <col style="width:auto">
        </colgroup>
        <thead>
          <tr>
            <th scope="col">
              <label class="checkbox">
                <input ref="allCheckDeviceAttr" v-model="checkAll" @change="fnCheckAll" role="checkbox" class="cbox" type="checkbox"><i></i>
              </label>
            </th>
            <th scope="col">{{$t('dev-type')}}</th>
            <th scope="col">{{$t('attb-code')}}</th>
            <th scope="col">{{$t('attribute-name')}}</th>
            <th scope="col">{{$t('unit')}}</th>
            <th scope="col"><span class="lb-txt">{{$t('order')}}</span></th>
            <th scope="col"><span class="lb-txt">{{$t('input-type')}}</span></th>
            <th scope="col">{{$t('collect-target')}} {{$t('column-name')}}</th>
            <th scope="col">{{$t('control-target')}} {{$t('column-name')}}</th>
            <th scope="col">{{$t('stat-avg-target')}}</th>
            <th scope="col">{{$t('symptom-target')}} {{$t('column-name')}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(deviceAttr, index) in deviceAttrs" :key="index" @dblclick="fnGetAttrSets(deviceAttr)" :class="selectedDeviceAttr === deviceAttr ? 'selected-attr' : ''">
            <td>
              <label class="checkbox"><input v-model="deviceAttr.selected" role="checkbox" class="cbox" type="checkbox" :value="deviceAttr"><i></i></label>
            </td>
            <td>{{deviceAttr.devClsCdNm}}</td>
            <td>{{deviceAttr.devAttbCdId}}</td>
            <td>{{deviceAttr.devAttbCdNm}}</td>
            <td>
              <select v-model="deviceAttr.unit" @change="fnSetObjUpdateMode(deviceAttr)" class="form-control">
                <option :value="null">{{$t('un-selected')}}</option>
                <option v-for="(value, index) in unitTypes" :key="index" :value="value">{{value}}</option>
              </select>
            </td>
            <td><input v-model="deviceAttr.orderNo" @input="fnSetObjUpdateMode(deviceAttr)" type="text" maxlength="3" class="form-control" style="width:100% !important"></td>
            <td>
              <select v-model="deviceAttr.inputType" @change="fnSetObjUpdateMode(deviceAttr)" class="form-control">
                <option :value="null">{{$t('un-selected')}}</option>
                <option value="INPUT">INPUT</option>
                <option value="SELECT">SELECT</option>
                <option value="CHECKBOX">CHECKBOX</option>
              </select>
            </td>
            <td>
              <select v-model="deviceAttr.colNmCd" @change="fnSetObjUpdateMode(deviceAttr)" class="form-control">
                <option :value="null">{{$t('un-selected')}}</option>
                <option v-for="(value, index) in collectTypes" :key="index" :value="value">{{value}}</option>
              </select>
            </td>
            <td>
              <input v-model="deviceAttr.conNmCd" @input="fnSetObjUpdateMode(deviceAttr)" type="text" maxlength="16" class="form-control" style="width:100% !important">
            </td>
            <td>
              <select v-model="deviceAttr.staAvgNmCd" @change="fnSetObjUpdateMode(deviceAttr)" class="form-control">
                <option :value="null">{{$t('un-selected')}}</option>
                <option v-for="(value, index) in statAvgTypes" :key="index" :value="value">{{value}}</option>
              </select>
            </td>
            <td>
              <select v-model="deviceAttr.detNmCd" @change="fnSetObjUpdateMode(deviceAttr)" class="form-control">
                <option :value="null">{{$t('un-selected')}}</option>
                <option v-for="(value, index) in symptomTypes" :key="index" :value="value">{{value}}</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="btn-wrap">
      <button @click="fnSaveDeviceAttr" :disabled="isNew" type="button" class="btn btn-pink">{{$t('save')}}</button>
      <button @click="fnDeleteDeivceAttr" :disabled="isNew" type="button" class="btn btn-gray ">{{$t('delete')}}</button>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import TbIotDevAttrDTO from '@/api/ccp/dto/TbIotDevAttrDTO'
import { getCommonCode, getCommonCodeSubString } from '@/api/common/code'
import { isNumber } from '@/utils/check'

export default {
  name: 'DeviceAttrComp',
  components: {},
  props: {
    sdevSeq: {
      type: String,
      required: true
    },
    xMid: {
      type: String,
      required: true
    },
    deviceModelData: {
      type: Object
    },
    svcCd: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      deviceAttrs: [],
      selectedDeviceAttr: {},
      checkAll: false,
      deviceAttrCodes: [
        { key: 'collectTypes', value: 'DY00000001' }, // 수집대상
        { key: 'controlTypes', value: 'DY00000002' }, // 제어대상
        { key: 'statAvgTypes', value: 'DY00000003' }, // 통계 AVG대상
        { key: 'statSumTypes', value: 'DY00000004' }, // 통계 SUM대상
        { key: 'symptomTypes', value: 'DY00000005' } // 이상징후
      ],
      unitTypes: null, // 단위 배열 (SelectBox)
      collectTypes: null, // 수집대상 컬럼명 배열 (SelectBox)
      controlTypes: null, // 제어대상 컬럼명 배열 (SelectBox)
      statAvgTypes: null, // 통계 AVG대상 컬럼명 배열 (SelectBox)
      statSumTypes: null, // 통계 SUM대상 컬럼명 배열
      symptomTypes: null, // 이상징후 컬럼명 배열 (SelectBox)
      bundleExcelDeviceAttr: { // 장비속성 일괄등록 관련정보
        download: {
          url: '/online/iotdev/createIotPasteDevAttrTemp',
          data: {},
          headers: {}
        },
        upload: {
          url: '/online/iotdev/createIotDevAttrAll',
          data: {},
          headers: {}
        }
      }
    }
  },
  computed: {
    isNew() {
      return !this.sdevSeq || this.sdevSeq === ''
    }
  },
  watch: {
    sdevSeq() {
      if (!this.isNew) {
        this.fnGetDeviceAttr()
      }
    }
  },
  created() {
    if (!this.isNew) {
      this.fnGetDeviceAttr()
    }
    this.fnGetCommonCodes()
  },
  mounted() {},
  methods: {
    fnGetCommonCodes() {
      // 장비 속성코드 조회
      this.deviceAttrCodes.forEach((deviceAttrType) => {
        getCommonCodeSubString({ xMid: this.xMid, parentCdId: deviceAttrType.value })
          .then((data) => {
            this[deviceAttrType.key] = data
          }).catch((e) => {
            console.error(e)
          })
      })

      // 장비 속성 단위
      getCommonCode({ xMid: this.xMid, parentCdId: 'GN00000012' })
        .then((data) => {
          this.unitTypes = data.map((unit) => {
            return unit.cdNm
          })
        }).catch((e) => {
          console.error(e)
        })
    },
    fnGetDeviceAttr() {
      requestApi({
        url: '/online/iotdev/retrieveIotDevAttr',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {
          svcDevSeq: this.sdevSeq
        },
        callback: (data) => {
          this.deviceAttrs = data.data.map((deviceAttr) => {
            return new TbIotDevAttrDTO(deviceAttr)
          })
        }
      })
    },
    fnSaveDeviceAttr() {
      this.confirm(this.$t('confirm-reload'), this.fnSaveDeviceAttrAPI)
    },
    fnSaveDeviceAttrAPI() {
      let selectedDeviceAttrList = this.deviceAttrs.filter(deviceAttr => deviceAttr.selected && deviceAttr.mode)
      if (selectedDeviceAttrList.length === 0) {
        this.alert(this.$t('no-selected-attb-or-modifyed-item'), 'warning')
        return
      }
      // 필수 값 체크
      let validation = true
      let validOrderNo = true
      selectedDeviceAttrList.forEach(deviceAttr => {
        if (!deviceAttr.orderNo || !deviceAttr.inputType) {
          validation = false
        }
        if (!isNumber(deviceAttr.orderNo)) {
          validOrderNo = false
        }
      })
      if (!validOrderNo) {
        this.alert(this.$t('alert-input-number').replace('$0', this.$t('order')), 'warning')
        return
      }

      // 장비속성타입 (일반장비:DEV, 가입장비:ENTR)
      selectedDeviceAttrList.forEach(deviceAttr => {
        deviceAttr.devAttbType = 'DEV'
        deviceAttr.svcCd = this.svcCd
      })

      // 여러 속성(row)중에 중복된 값이 있는지 체크
      let colNmCdList = []
      let conNmCdList = []
      let staAvgNmCdList = []
      let staSumNmCdList = []
      let detNmCdList = []
      let duplColumn = null
      this.deviceAttrs.forEach(deviceAttr => {
        if (deviceAttr.colNmCd) {
          if (colNmCdList.includes(deviceAttr.colNmCd)) {
            duplColumn = this.$t('collect-target') + ' ' + this.$t('column-name')
          } else {
            colNmCdList.push(deviceAttr.colNmCd)
          }
        }
        if (deviceAttr.conNmCd) {
          if (conNmCdList.includes(deviceAttr.conNmCd)) {
            duplColumn = this.$t('control-target') + ' ' + this.$t('column-name')
          } else {
            conNmCdList.push(deviceAttr.conNmCd)
          }
        }
        if (deviceAttr.staAvgNmCd) {
          if (staAvgNmCdList.includes(deviceAttr.staAvgNmCd)) {
            duplColumn = this.$t('stat-avg-target') + ' ' + this.$t('attribute-name')
          } else {
            staAvgNmCdList.push(deviceAttr.staAvgNmCd)
          }
        }
        if (deviceAttr.staSumNmCd) {
          if (staSumNmCdList.includes(deviceAttr.staSumNmCd)) {
            duplColumn = this.$t('stat-sum-target') + ' ' + this.$t('attribute-name')
          } else {
            staSumNmCdList.push(deviceAttr.staSumNmCd)
          }
        }
        if (deviceAttr.detNmCd) {
          if (detNmCdList.includes(deviceAttr.detNmCd)) {
            duplColumn = this.$t('symptom-target') + ' ' + this.$t('column-name')
          } else {
            detNmCdList.push(deviceAttr.detNmCd)
          }
        }
      })

      if (!validation || duplColumn) {
        let msg = validation === false ? this.$t('alert-no-inputed-attb-requered-order-type') : this.$t('duplicate-data').replace('$0', duplColumn)
        this.alert(msg, 'warning')
        return
      }

      requestApi({
        url: '/online/iotdev/taskIotDevAttrParam',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {
          tbIotDevAttrDTOList: selectedDeviceAttrList
        },
        callback: (data) => {
          if (data.result.status === '200') {
            this.fnGetDeviceAttr()
            this.alert(this.$t('save-success'), 'success')
            this.fnClearDeviceAttr()
          }
        }
      })
    },
    fnClearDeviceAttr() {
      this.selectedDeviceAttr = null // 선택한 장비속성 선택해제
      this.$refs.allCheckDeviceAttr.checked = false // 전체선택 체크 해제
      this.$emit('selected', this.selectedDeviceAttr)
      this.$emit('clearSets')
    },
    fnDeleteDeivceAttr() {
      // 체크박스 선택된 항목
      let selectedDeviceAttrList = this.deviceAttrs.filter(deviceAttr => deviceAttr.selected)
      if (selectedDeviceAttrList.length === 0) {
        this.alert(this.$t('alert-not-selected-attb'), 'warning')
        return
      }
      // 삭제 요청을 보낼 속성은 seq값이 있는 DB에 있는 데이터만 보냄
      selectedDeviceAttrList = selectedDeviceAttrList.filter(deviceAttr => deviceAttr.sdevAttbSeq)

      selectedDeviceAttrList.forEach(deviceAttr => { // mode를 D로 셋팅
        deviceAttr.mode = 'D'
      })

      // 실제 삭제할 항목이 없는경우 서버요청 보내지 않음.
      if (!selectedDeviceAttrList.length) {
        afterProcess()
        return
      }

      requestApi({
        url: '/online/iotdev/taskIotDevAttrParam',
        headers: {
          'X-MID': 'P00067'
        },
        method: 'post',
        data: {
          tbIotDevAttrDTOList: selectedDeviceAttrList
        },
        callback: (data) => {
          if (data.result.status === '200') {
            this.selectedDeviceAttr = null // 선택한 장비속성 선택해제
            this.deviceAttrSets = [] // 조회한 장비속성SET 초기화
            this.deviceDetSets = [] // 조회한 장비이상징후SET 초기화
            afterProcess()
            this.alert(this.$t('del-success'), 'success')
          }
        }
      })
      let context = this
      function afterProcess() {
        context.deviceAttrs = context.deviceAttrs.filter(deviceAttr => !deviceAttr.selected) // 선택한 항목 리스트에서 삭제
        context.$refs.allCheckDeviceAttr.checked = false // 전체선택 체크 해제
      }
    },
    fnAddDeviceAttr() {
      this.popup({
        component: () => import('@/components/CommonCode'),
        title: this.$t('commoncode'),
        width: '600',
        height: '450',
        data: {
          depth2: 'DA00000000', // 공통코드 장비속성 CD_ID
          isMultiSelect: true, // 공통코드 여러개 선택 가능여부
          isParentSelect: false // (자식코드가 있는)부모코드 선택 가능여부
        },
        callback: (data) => {
          if (!data || data === 'dismiss') {
            return
          }
          // 현재 등록되어있는 장비속성의 순서항목 Max값 추출 (마지막 순서값 이후의 값으로 자동으로 값을 넣어준다)
          let orderMaxValue = 0
          this.deviceAttrs.forEach(deviceAttr => {
            orderMaxValue = (orderMaxValue > parseInt(deviceAttr.orderNo)) ? orderMaxValue : parseInt(deviceAttr.orderNo)
          })
          let devAttbCdIds = this.deviceAttrs.map(deviceAttr => deviceAttr.devAttbCdId)
          data.forEach(commonCode => {
            if (devAttbCdIds.includes(commonCode.cdId) === false) { // 같은 속성 중복등록 방지
              this.deviceAttrs.push(new TbIotDevAttrDTO({
                selected: true,
                mode: 'I',
                sdevSeq: this.deviceModelData.sdevSeq,
                devClsCd: this.deviceModelData.devClsCd,
                devClsCdNm: this.deviceModelData.devClsCdNm,
                devMdlCd: this.deviceModelData.devMdlCd,
                devMdlNm: this.deviceModelData.devMdlNm,
                devAttbCdId: commonCode.cdId,
                devAttbCdNm: commonCode.cdNm,
                orderNo: orderMaxValue + 1,
                inputType: 'INPUT',
                colNmCd: this.collectTypes[orderMaxValue]
              }))
              orderMaxValue++
            }
          })
        }
      })
    },
    fnGetAttrSets(deviceAttr) {
      if (!deviceAttr.sdevAttbSeq) {
        this.alert(this.$t('unregistered-device-attb'), 'warning')
        return
      }
      this.selectedDeviceAttr = deviceAttr
      this.$emit('selected', this.selectedDeviceAttr)
    },
    fnCheckAll(event) {
      this.deviceAttrs.forEach((element) => {
        element.selected = event.target.checked
      })
    },
    fnSetObjUpdateMode(object) { // 값 수정 시 체크박스 체크 및 해당 객체 mode 수정기능
      if (object) {
        object.selected = true
        if (object && !object.mode) {
          object.mode = 'U'
        }
      }
    },
    fnUploadExcelPopup() {
      let data = _.merge(this.bundleExcelDeviceAttr, { upload: { data: { sDevSeq: this.sDevSeq, svcCd: this.svcCd } } })
      this.popup({
        component: () => import('@/components/BundleExcel'),
        title: this.$t('addAll'),
        width: '500',
        height: '250',
        data: data,
        callback: (res) => {
          if (res === true) { // 엑셀파일 업로드 성공 시 해당 리스트 다시로딩
            this.fnGetDeviceAttr()
          }
        }
      })
    }
  }
}
</script>

<style></style>
