<template>
  <div>
    <div class="modal-body">
      <div class="border-1 px-2 py-2">
        <div class="form-row row">
          <div class="form-item col-sm-3">
            <span class="form-label w-32 lb-txt">{{ $t('service') }}</span>
            <select
              v-model="deviceModelData.svcCd"
              ref="svcCd"
              class="form-control"
              title="서비스"
              :disabled="!isNew"
            >
              <option
                v-for="(svc, index) in svcCdList"
                :key="`svcCd-${index}`"
                :value="svc.svcCd"
                >{{ svc.svcCdNm }}</option
              >
            </select>
          </div>
          <div class="form-item col-sm-3">
            <span class="form-label w-32 lb-txt">{{ $t('dev-cls') }}</span>
            <select
              v-model="deviceModelData.devClsCd"
              class="form-control"
              :disabled="!isNew"
            >
              <option value="">{{ $t('need-select') }}</option>
              <option
                v-for="(devCls, index) in devClsList"
                :key="`devCls-${index}`"
                :value="devCls.devClsCd"
                >{{ devCls.devClsNm }}</option
              >
            </select>
          </div>
          <div class="form-item col-sm-3">
            <span class="form-label w-32 lb-txt">{{ $t('model-code') }}</span>
            <div class="input-group">
              <input
                ref="devMdlCd"
                v-model="deviceModelData.devMdlCd"
                type="text"
                class="form-control"
                maxlength="20"
                :title="`$t('model-code') $t('input')`"
                @change="flagDuplDevMdlCd = false"
              />
              <button
                class="btn btn-gray input-group-addon"
                type="button"
                @click="checkDuplDevMdlCd"
              >
                {{ $t('duplication-check') }}
              </button>
            </div>
          </div>
          <div class="form-item col-sm-3">
            <span class="form-label w-32 lb-txt">{{ $t('dev-mdl-nm') }}</span>
            <div class="input-group">
              <input
                ref="devMdlNm"
                v-model="deviceModelData.devMdlNm"
                type="text"
                class="form-control"
                maxlength="16"
                :title="`$t('dev-mdl-nm') $t('input')`"
                @change="flagDuplDevMdlNm = false"
              />
              <button
                class="btn btn-gray input-group-addon"
                type="button"
                @click="checkDuplDevMdlNm"
              >
                {{ $t('duplication-check') }}
              </button>
            </div>
          </div>
        </div>
        <div class="form-row row">
          <div class="form-item col-sm-3">
            <span class="form-label w-32 lb-txt">{{ $t('manufacturer') }}</span>
            <input
              v-model="deviceModelData.vendorNm"
              type="text"
              class="form-control"
              maxlength="16"
              :title="`$t('manufacturer') $t('input')`"
            />
          </div>
          <div class="form-item col-sm-3">
            <span class="form-label w-32 lb-txt">{{ $t('device-value') }}</span>
            <input
              ref="devMdlVal"
              v-model="deviceModelData.devMdlVal"
              maxlength="20"
              type="text"
              class="form-control"
              placeholder="Number"
              :title="$t('model-value')"
            />
          </div>
          <div class="form-item col-sm-3">
            <span class="form-label w-32 lb-txt">{{ $t('parentYn') }}</span>
            <select class="form-control" v-model="deviceModelData.parentDevSeq">
              <option :value="1" selected>{{ $t('use') }}</option>
              <option :value="0">{{ $t('use-no') }}</option>
            </select>
          </div>
          <div class="form-item col-sm-3">
            <span class="form-label w-32 lb-txt">{{ $t('eq-code') }}</span>
            <input
              v-model="deviceModelData.eqCode"
              type="text"
              class="form-control"
              maxlength="16"
              :title="$t('eq-code')"
            />
          </div>
        </div>
        <div class="text-right mt-3">
          <button @click="fnSaveModel" type="button" class="btn btn-pink">
            {{ $t('save') }}
          </button>
        </div>
      </div>
      <div class="grid-container grid-scroll mt-3">
        <div class="row">
          <!-- 장비 속성 -->
          <device-attr-comp
            ref="deviceAttr"
            :xMid="xMid"
            :sdevSeq="sdevSeq"
            :device-model-data="deviceModelData"
            :svcCd="deviceModelData.svcCd"
            @clearSets="fnClearSets"
            @selected="fnSelectedDeviceAttr"
          ></device-attr-comp>
        </div>
        <div class="row half full-size">
          <device-attr-set-comp
            ref="deviceAttrSet"
            :xMid="xMid"
            :selected-device-attr="selectedDeviceAttr"
            :svcCd="deviceModelData.svcCd"
          ></device-attr-set-comp>
          <device-det-set-comp
            ref="deviceDetSet"
            :xMid="xMid"
            :selected-device-attr="selectedDeviceAttr"
            :svcCd="deviceModelData.svcCd"
          ></device-det-set-comp>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import DeviceAttrComp from './DeviceAttrComp'
import DeviceAttrSetComp from './DeviceAttrSetComp'
import DeviceDetSetComp from './DeviceDetSetComp'
import { isAlphaHyphenUnderscore } from '@/utils/check'
import { getSvcList, getDevClsCdListBySvcCd } from '@/api/common/usrSvcDevice'

export default {
  name: 'DeviceCreateModifySvc',
  components: { DeviceAttrComp, DeviceAttrSetComp, DeviceDetSetComp },
  props: {
    data: null
  },
  data() {
    return {
      xMid: 'P00067',
      sdevSeq: '',
      deviceModelData: {
        svcCd: '',
        devClsCd: '',
        devMdlCd: '',
        devMdlNm: '',
        useYn: 'Y',
        vendorNm: '',
        devMdlVal: '',
        parentDevSeq: 0,
        eqCode: ''
      },
      svcCdList: [],
      devClsList: [],
      flagDuplDevMdlCd: false,
      flagDuplDevMdlNm: false,
      selectedDeviceAttr: null
    }
  },
  computed: {
    isNew() {
      return !this.sdevSeq || this.sdevSeq === ''
    }
  },
  watch: {
    'deviceModelData.svcCd'() {
      this.fnGetDevClsList()
    }
  },
  created() {
    if (this.data.sdevSeq) {
      this.sdevSeq = this.data.sdevSeq
      this.fnGetDeviceModel()
    }
    this.fnGetSvcCdList()
  },
  mounted() {},
  methods: {
    // ------------------- 모델 영역
    fnGetSvcCdList() {
      getSvcList({ xMid: this.xMid })
        .then(data => {
          this.svcCdList = data
          if (this.svcCdList.length > 0) {
            if (this.isNew) {
              this.deviceModelData.svcCd = this.svcCdList[0].svcCd
            }
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    fnGetDevClsList() {
      if (this.isNew) {
        this.deviceModelData.devClsCd = ''
      }
      this.devClsList = []
      if (this.deviceModelData.svcCd === '') {
        return false
      }
      getDevClsCdListBySvcCd({
        xMid: this.xMid,
        svcCd: this.deviceModelData.svcCd
      })
        .then(data => {
          this.devClsList = data.devClsList
        })
        .catch(e => {
          console.error(e)
        })
    },
    checkDuplDevMdlCd() {
      if (
        !this.deviceModelData.devMdlCd ||
        this.deviceModelData.devMdlCd.trim().length === 0
      ) {
        this.$refs.devMdlCd.focus()
        return
      }

      if (this.deviceModelData.devMdlCd.startsWith('LGE_')) {
        this.alert(this.$t('model-id-can-not-start-lge'), 'warning')
        return
      }

      if (!isAlphaHyphenUnderscore(this.deviceModelData.devMdlCd)) {
        this.alert(
          this.$t('alert-input-alpha-hyphen-underscore').replace(
            '$0',
            this.$t('model-code')
          ),
          'warning'
        )
        return
      }

      requestApi({
        url: '/online/iotdev/retrieveIotDup',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {
          devMdlCd: this.deviceModelData.devMdlCd
        },
        callback: data => {
          if (data.result.status === '200') {
            this.flagDuplDevMdlCd = data.data === 0
            let content = !this.flagDuplDevMdlCd
              ? this.$t('duplicate-data').replace('$0', this.$t('model-code'))
              : this.$t('no-duplicate-data')
            let level = !this.flagDuplDevMdlCd ? 'warning' : 'success'
            this.alert(content, level)
          }
        }
      })
    },
    checkDuplDevMdlNm() {
      if (
        !this.deviceModelData.devMdlNm ||
        this.deviceModelData.devMdlNm.trim().length === 0
      ) {
        this.$refs.devMdlNm.focus()
        return
      }

      requestApi({
        url: '/online/iotdev/retrieveIotMdlDup',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {
          devMdlNm: this.deviceModelData.devMdlNm
        },
        callback: data => {
          if (data.result.status === '200') {
            this.flagDuplDevMdlNm = data.data === 0
            let content = !this.flagDuplDevMdlNm
              ? this.$t('duplicate-data').replace('$0', this.$t('dev-mdl-nm'))
              : this.$t('no-duplicate-data')
            let level = !this.flagDuplDevMdlNm ? 'warning' : 'success'
            this.alert(content, level)
          }
        }
      })
    },
    fnGetDeviceModel() {
      if (this.sdevSeq === '') {
        return false
      }

      let reqData = {
        svcDevSeq: this.sdevSeq,
        currentPage: 1,
        displayRowCount: 15
      }

      requestApi({
        url: '/online/iotdev/retrieveIotDev',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: data => {
          if (data.data.boardList.length === 1) {
            this.deviceModelData = data.data.boardList[0]
            this.flagDuplDevMdlCd = true
            this.flagDuplDevMdlNm = true
            if (this.deviceModelData.parentDevSeq === null) {
              this.deviceModelData.parentDevSeq = '0'
            }
            this.svcCd = data.data.boardList[0].svcCd
          }
        }
      })
    },
    fnSaveModel() {
      if (!this.fnValidSaveModel()) {
        return false
      }
      this.deviceModelData.devMdlVal = !this.deviceModelData.devMdlVal
        ? null
        : this.deviceModelData.devMdlVal
      if (this.isNew) {
        this.fnAddModel()
      } else {
        this.fnUpdateModel()
      }
    },
    fnUpdateModel() {
      requestApi({
        url: '/online/iotdev/updateIotDev',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: this.deviceModelData,
        callback: data => {
          if (data.result.status === '200') {
            this.alert(this.$t('save-success'), 'success')
            this.fnGetDeviceModel()
            this.$refs.deviceAttr.fnGetDeviceAttr()
            this.callback()
          }
        }
      })
    },
    fnAddModel() {
      requestApi({
        url: '/online/iotdev/insertIotDev',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: this.deviceModelData,
        callback: data => {
          if (data.result.status === '200') {
            this.alert(this.$t('save-success'), 'success')
            this.callback()
          }
        }
      })
    },
    fnValidSaveModel() {
      let msg = !this.deviceModelData.svcCd
        ? '서비스'
        : !this.deviceModelData.devClsCd || this.deviceModelData.devClsCd === ''
          ? this.$t('dev-type')
          : !this.deviceModelData.devMdlCd || this.deviceModelData.devMdlCd === ''
            ? this.$t('model-code')
            : !this.deviceModelData.devMdlNm || this.deviceModelData.devMdlNm === ''
              ? this.$t('dev-mdl-nm')
              : null
      if (msg) {
        this.alert(this.$t('not-inputed').replace('$0', msg), 'warning')
        return false
      }
      if (!this.flagDuplDevMdlCd) {
        this.alert(
          this.$t('model-code') + this.$t('alert-check-duplicate'),
          'warning'
        )
        return false
      }
      if (!this.flagDuplDevMdlNm) {
        this.alert(
          this.$t('dev-mdl-nm') + this.$t('alert-check-duplicate'),
          'warning'
        )
        return false
      }
      return true
    },
    fnClearSets() {
      this.$refs.deviceAttrSet.fnClearDeviceAttrSets() // 조회한 장비속성SET 초기화
      // this.deviceDetSets = [] // 조회한 장비이상징후SET 초기화
    },
    fnSelectedDeviceAttr(selectedDeviceAttr) {
      this.selectedDeviceAttr = selectedDeviceAttr
    }
  }
}
</script>

<style lang="less" scoped>
.table-height {
  height: 215px;
}
.set-table-height {
  height: 150px;
}
.selected-attr {
  background-color: #ccc;
}
</style>
