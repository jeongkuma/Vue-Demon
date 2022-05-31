<template>
  <div>
    <div class="flex flex-wrap" style="padding-top: 20px;">
      <div
        ref="treeWrap"
        class="md-width-100 width-30 pr-2 md-p-0 flex flex-col"
        style="min-height: 415px;"
      >
        <div class="mb-2 flex-none" style="height: 32px;">
          <h4 class="titH4">{{ $t('facilityMgmt') }}</h4>
        </div>
        <div class="flex-1 border-1">
          <jstree
            ref="tree"
            :data="facilityList"
            text-field-name="facNm"
            value-field-name="facSeq"
            parent-field-name="parentFacSeq"
            sort-field-name="facOrder"
            @selectNode="fnGetFacilityInfo"
          >
          </jstree>
        </div>
      </div>
      <div class="md-width-100 width-70 pl-2 md-p-0 md-pt-3">
        <div class="text-right">
          <button type="button" class="btn btn-pink" @click="fnShowAddPopup">
            {{ $t('registration') }}
          </button>
        </div>
        <ul class="form-inbox mt-2">
          <li>
            <span class="tit">{{ $t('up-facility') }}</span>
            <div class="form-group form-inline">
              <input
                v-model="facility.parentFacNm"
                type="text"
                class="form-control"
                :disabled="true"
              />
            </div>
          </li>
          <li>
            <span class="tit">{{ $t('facility-name') }}</span>
            <div class="form-group form-inline">
              <input
                v-model="facility.facNm"
                type="text"
                class="form-control"
                @change="fnHandleChangeFacNm"
              />
              <button class="btn btn-gray" @click="fnDuplicate">{{ $t('duplication-check') }}</button>
            </div>
          </li>
          <li>
            <span class="tit">{{ $t('facility-lvl') }}</span>
            <div class="form-group form-inline">
              <input
                v-model="facility.facOrder"
                type="text"
                class="form-control"
              />
            </div>
          </li>
          <li>
            <span class="tit">{{ $t('useYn') }}</span>
            <div class="form-group form-inline">
              <select v-model="facility.useYn" class="form-control">
                <option value="">{{ $t('select') }}</option>
                <option value="Y">{{ $t('use') }}</option>
                <option value="N">{{ $t('use-no') }}</option>
              </select>
            </div>
          </li>
        </ul>
        <div class="text-right mt-2">
          <button type="text" class="btn btn-pink" :disabled="disabledButton" @click="fnSaveConfirm">{{ $t('modify') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Jstree from '@/components/Jstree'
import { requestApi, requestMultipartJsonObject } from '@/api/ccp/requestApi'

export default {
  name: 'FacilityMgmtSvc',
  components: { Jstree },
  data() {
    return {
      facilityList: [],
      facility: {
        parentFacSeq: '',
        facNm: '',
        facOrder: '',
        useYn: ''
      },
      isCheckDuplicate: false,
      xMid: 'P20053'
    }
  },
  computed: {
    disabledButton() {
      return !this.facility || !this.facility.facNm
    }
  },
  watch: {},
  created() {},
  mounted() {
    this.$refs.treeWrap.style.height = 'calc(100vh - ' + (this.$refs.treeWrap.offsetTop + 140) + 'px)'
    this.fnGetFacility()
  },
  methods: {
    fnGetFacility() {
      let reqData = {}
      requestApi({
        url: '/online/iotFacility/retrieveFacility',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          res.data.forEach(item => {
            if (!item.parentFacSeq) {
              item.parentFacSeq = 'ROOT'
              item.parentFacNm = 'ROOT'
            }
          })
          this.facilityList = res.data
        }
      })
    },
    fnGetFacilityInfo(event, target) {
      this.facility = target.node.id === 'ROOT' ? {} : target.node.data
      this.facility.parentFacSeq = this.facility.parentFacSeq === 'ROOT' ? null : this.facility.parentFacSeq
      this.isCheckDuplicate = true
    },
    fnShowAddPopup() {
      this.popup({
        component: () => import('@/views/custusr/magic/FacilityMgmtAddSvc'),
        title: this.$t('faility-registration'),
        width: '500',
        height: '330',
        data: {
          parentFacSeq: this.facility.facSeq,
          parentFacNm: this.facility.facNm || 'ROOT'
        },
        callback: data => {
          this.fnGetFacility()
          this.facility = {}
        }
      })
    },
    fnHandleChangeFacNm() {
      this.isCheckDuplicate = false
    },
    fnDuplicate() {
      if (!this.facility.facNm || this.facility.facNm.length === 0) {
        this.alert(this.$t('lead-not-inputed').replace('$0', this.$t('facility-name')))
        return false
      }
      requestApi({
        url: '/online/iotFacility/retrieveDuplicateFacNm',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: this.facility,
        callback: res => {
          if (res.data && res.data.count === 0) {
            this.isCheckDuplicate = true
            this.alert(this.$t('no-duplicate-data'), 'success')
          } else {
            this.isCheckDuplicate = false
            this.alert(this.$t('duplicate-data').replace('$0', this.$t('facility-name')))
          }
        }
      })
    },
    fnSaveConfirm() {
      if (!this.fnValidateData()) {
        return
      }
      this.confirm(this.$t('modifyYn'), this.fnSave)
    },
    fnSave() {
      requestMultipartJsonObject({
        url: '/online/iotFacility/updateFacilityInfo',
        headers: {
          'X-MID': this.xMid
        },
        data: this.facility,
        files: null,
        callback: res => {
          if (res.result.status === '200') {
            this.alert(this.$t('save-success'), 'success')
            this.fnGetFacility()
          }
        }
      })
    },
    fnValidateData() {
      if (!this.facility.facNm || this.facility.facNm.length === 0) {
        this.alert(this.$t('lead-not-inputed').replace('$0', this.$t('facility-name')))
        return false
      }

      if (!this.isCheckDuplicate) {
        this.alert(this.$t('lead-duplicate-data').replace('$0', this.$t('facility-name')))
        return false
      }

      if (!this.facility.facOrder || this.facility.facOrder.length === 0) {
        this.alert(this.$t('lead-not-inputed').replace('$0', this.$t('facility-lvl')))
        return false
      }

      if (isNaN(this.facility.facOrder)) {
        this.alert(this.$t('alert-input-number').replace('$0', this.$t('facility-lvl')))
        return false
      }

      if (!this.facility.useYn || this.facility.useYn === '') {
        this.alert(this.$t('lead-not-choosed').replace('$0', this.$t('useYn')))
        return false
      }

      return true
    }
  }
}
</script>

<style></style>
