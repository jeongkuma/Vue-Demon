<template>
  <div class="col-md-6">
    <div class="tit-wrap btn-in">
      <h4 class="titH4">{{$t('collect-attr-set')}} {{selectedDeviceAttr ? `(${selectedDeviceAttr.devClsCdNm} - ${selectedDeviceAttr.devAttbCdNm})` : ''}}</h4>
      <div class="pull-right">
        <button @click="fnUploadExcelPopup" :disabled="!selectedDeviceAttr" type="button" class="btn btn-pink rounded">{{$t('addAll')}}</button>
        <button @click="fnAddDeviceAttrSet" :disabled="!selectedDeviceAttr" class="btn btn-info" type="button">{{$t('add')}}</button>
      </div>
    </div>
    <div class="table-wrap y-scroll set-table-height">
      <table class="table table-col">
        <caption>{{$t('collect-attr-set')}} {{$t('registration')}}</caption>
        <colgroup>
          <col style="width:50px">
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
                <input ref="allCheckDeviceAttrSet" @change="fnCheckAll($event)" role="checkbox" class="cbox" type="checkbox"><i></i>
              </label>
            </th>
            <th scope="col">{{$t('attb-code')}}</th>
            <th scope="col">{{$t('attribute-name')}}</th>
            <th scope="col">{{$t('attb-set-code')}}</th>
            <th scope="col">{{$t('attb-set-name')}}</th>
            <th scope="col"><span class="lb-txt">{{$t('value')}}</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(deviceAttrSet, index) in deviceAttrSets" :key="index">
            <td>
              <label class="checkbox"><input v-model="deviceAttrSet.selected" role="checkbox" class="cbox" type="checkbox"><i></i></label>
            </td>
            <td>{{selectedDeviceAttr.devAttbCdId}}</td>
            <td>{{selectedDeviceAttr.devAttbCdNm}}</td>
            <td><input v-model="deviceAttrSet.devAttbSetCdId" type="text" disabled></td>
            <td><input v-model="deviceAttrSet.devAttbSetCdNm" type="text" disabled></td>
            <td><input v-model="deviceAttrSet.devAttbSetVal" @input="fnSetObjUpdateMode(deviceAttrSet)" type="text" maxlength="10"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="btn-wrap">
      <button @click="fnSaveDeviceAttrSet()" :disabled="!selectedDeviceAttr" type="button" class="btn btn-pink">{{$t('save')}}</button>
      <button @click="fnDeleteDeviceAttrSet()" :disabled="!selectedDeviceAttr" type="button" class="btn btn-gray ">{{$t('delete')}}</button>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import TbIotDevAttrSetDTO from '@/api/ccp/dto/TbIotDevAttrSetDTO'
import { isIncludeKorean } from '@/utils/check'
export default {
  name: 'DeviceAttrSetComp',
  components: {},
  props: {
    xMid: {
      type: String,
      required: true
    },
    selectedDeviceAttr: {
      type: Object,
      default: null
    },
    svcCd: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      deviceAttrSets: [],
      bundleExcelDeviceAttrSet: { // 장비속성SET 일괄등록 관련정보
        download: {
          url: '/online/iotdev/createIotPasteDevAttrSetTemp',
          data: {},
          headers: {}
        },
        upload: {
          url: '/online/iotdev/createIotDevAttrSetAll',
          data: {},
          headers: {}
        }
      }
    }
  },
  computed: {},
  watch: {
    selectedDeviceAttr() {
      if (this.selectedDeviceAttr && this.selectedDeviceAttr.sdevAttbSeq) {
        this.fnGetDeviceAttrSet()
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    fnGetDeviceAttrSet() {
      requestApi({
        url: '/online/iotdev/retrieveIotDevAttrSet',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {
          sdevAttbSeq: this.selectedDeviceAttr.sdevAttbSeq
        },
        callback: (data) => {
          this.deviceAttrSets = data.data.map((deviceAttr) => {
            return new TbIotDevAttrSetDTO(deviceAttr)
          })
        }
      })
    },
    fnSaveDeviceAttrSet() {
      this.confirm(this.$t('confirm-reload'), this.fnSaveDeviceAttrAPI)
    },
    fnSaveDeviceAttrAPI() {
      let selectedDeviceAttrSetList = this.deviceAttrSets.filter(deviceAttrSet => deviceAttrSet.selected && deviceAttrSet.mode)
      if (selectedDeviceAttrSetList.length === 0) {
        this.alert(this.$t('no-selected-attbset-or-modifyed-item'), 'warning')
        return
      }

      // 필수 값 체크
      let validation = true
      selectedDeviceAttrSetList.forEach(deviceAttrSet => {
        if (!deviceAttrSet.devAttbSetVal ||
          isIncludeKorean(deviceAttrSet.devAttbSetVal)) { // 값에 한글이 들어있는경우
          validation = false
        }
        deviceAttrSet.svcCd = this.svcCd
      })

      if (!validation) {
        this.alert(this.$t('alert-no-inputed-attbset'), 'warning')
        return
      }

      requestApi({
        url: '/online/iotdev/taskIotDevAttrSetParam',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {
          tbIotDevAttrSetDTOList: selectedDeviceAttrSetList
        },
        callback: (data) => {
          if (data.result.status === '200') {
            this.fnGetDeviceAttrSet()
            this.$refs.allCheckDeviceAttrSet.checked = false // 전체선택 체크 해제
            this.alert(this.$t('save-success'), 'success')
          }
        }
      })
    },
    fnDeleteDeviceAttrSet() {
      // 체크박스 선택된 항목
      let selectedDeviceAttrSetList = this.deviceAttrSets.filter(deviceAttrSet => deviceAttrSet.selected)
      if (selectedDeviceAttrSetList.length === 0) {
        this.alert(this.$t('alert-not-selected-attbset'), 'warning')
        return
      }
      // 삭제 요청을 보낼 속성은 seq값이 있는 DB에 있는 데이터만 보냄
      selectedDeviceAttrSetList = selectedDeviceAttrSetList.filter(deviceAttrSet => deviceAttrSet.sdevAttbSetSeq)

      selectedDeviceAttrSetList.forEach(deviceAttrSet => { // mode를 D로 셋팅
        deviceAttrSet.mode = 'D'
      })

      // 실제 삭제할 항목이 없는경우 서버요청 보내지 않음.
      if (!selectedDeviceAttrSetList.length) {
        afterProcess()
        return
      }

      requestApi({
        url: '/online/iotdev/taskIotDevAttrSetParam',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {
          tbIotDevAttrSetDTOList: selectedDeviceAttrSetList
        },
        callback: (data) => {
          if (data.result.status === '200') {
            afterProcess()
            this.alert(this.$t('del-success'), 'success')
          }
        }
      })
      let context = this
      function afterProcess() {
        context.deviceAttrSets = context.deviceAttrSets.filter(deviceAttrSet => !deviceAttrSet.selected) // 선택한 항목 리스트에서 삭제
        context.$refs.allCheckDeviceAttrSet.checked = false // 전체선택 체크 해제
      }
    },
    fnAddDeviceAttrSet() {
      let context = this
      this.popup({
        component: () => import('@/components/CommonCode'),
        title: this.$t('commoncode'),
        width: '500',
        height: '500',
        data: {
          depth2: 'DS00000000', // 공통코드 장비속성SET CD_ID
          depth3: 'DS00000002', // 공통코드 장비속성SET CD_ID
          isMultiSelect: true, // 공통코드 여러개 선택 가능여부
          isParentSelect: false // (자식코드가 있는)부모코드 선택 가능여부
        },
        callback: (data) => {
          if (data && data !== 'dismiss') {
            let devAttbSetCdId = context.deviceAttrSets.map(deviceAttrSet => deviceAttrSet.devAttbSetCdId)
            data.forEach(commonCode => {
              if (devAttbSetCdId.includes(commonCode.cdId) === false) { // 같은 속성SET 중복등록 방지
                this.deviceAttrSets.push(new TbIotDevAttrSetDTO({
                  selected: true,
                  mode: 'I',
                  devAttbSeq: context.selectedDeviceAttr.devAttbSeq,
                  sdevAttbSeq: context.selectedDeviceAttr.sdevAttbSeq,
                  devAttbSetCdId: commonCode.cdId,
                  devAttbSetCdNm: commonCode.cdNm,
                  setParentCdId: commonCode.parentCdId
                }))
              }
            })
          }
        }
      })
    },
    fnCheckAll(event) {
      this.deviceAttrSets.forEach((element) => {
        element.selected = event.target.checked
      })
    },
    fnSetObjUpdateMode(object) {
      if (object) {
        object.selected = true
        if (object && !object.mode) {
          object.mode = 'U'
        }
      }
    },
    fnUploadExcelPopup() {
      let data = _.merge(this.bundleExcelDeviceAttrSet, { upload: { data: { sdevAttbSeq: this.selectedDeviceAttr.sdevAttbSeq, svcCd: this.selectedDeviceAttr.svcCd } } })
      this.popup({
        component: () => import('@/components/BundleExcel'),
        title: this.$t('addAll'),
        width: '500',
        height: '250',
        data: data,
        callback: (res) => {
          if (res === true) { // 엑셀파일 업로드 성공 시 해당 리스트 다시로딩
            this.fnGetDeviceAttrSet()
          }
        }
      })
    },
    fnClearDeviceAttrSets() {
      this.deviceAttrSets = []
    }
  }
}
</script>

<style></style>
