<template>
  <div>
    <div class="modal-body">
      <div class="form-item">
        <span class="form-label w-32 lb-txt">{{ $t('up-facility') }}</span>
        <input v-model="facility.parentFacNm" type="text" class="form-control" :disabled="true" />
      </div>
      <div class="form-item">
        <span class="form-label w-32 lb-txt">{{ $t('facility-name') }}</span>
        <div class="input-group">
          <input v-model="facility.facNm" type="text" class="form-control" />
          <button class="btn btn-gray input-group-button" type="button" @click="fnDuplicate">
            {{ $t('duplication-check') }}
          </button>
        </div>
      </div>
      <div class="form-item">
        <span class="form-label w-32 lb-txt">{{ $t('facility-lvl') }}</span>
        <input v-model="facility.facOrder" type="text" class="form-control" />
      </div>
      <div class="form-item">
        <span class="form-label w-32 lb-txt">{{ $t('useYn') }}</span>
        <select v-model="facility.useYn" class="form-control">
          <option value="">{{ $t('select') }}</option>
          <option value="Y">{{ $t('use') }}</option>
          <option value="N">{{ $t('use-no') }}</option>
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button type="button" class="btn btn-pink" @click="fnSaveConfirm">
          {{ $t('save') }}
        </button>
        <button type="button" class="btn btn-gray" @click="close">
          {{ $t('cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { requestApi, requestMultipartJsonObject } from '@/api/ccp/requestApi'

export default {
  name: 'FacilityMgmtAddSvc',
  components: {},
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
  data() {
    return {
      facility: {
        parentFacSeq: '',
        parentFacNm: '',
        facSeq: '',
        facNm: '',
        facOrder: '',
        useYn: ''
      },
      isCheckDuplicate: false,
      xMid: 'P20054'
    }
  },
  computed: {},
  watch: {
    'facility.facNm'() {
      this.isCheckDuplicate = false
    }
  },
  created() {},
  mounted() {
    this.facility.parentFacSeq = this.data.parentFacSeq
    this.facility.parentFacNm = this.data.parentFacNm
  },
  methods: {
    fnDuplicate() {
      if (!this.facility.facNm || this.facility.facNm.length === 0) {
        this.alert(this.$t('lead-not-inputed').replace('$0', this.$t('facility-name')))
        return
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
      this.confirm(this.$t('saveYn'), this.fnSave)
    },
    fnSave() {
      requestMultipartJsonObject({
        url: '/online/iotFacility/insertFacilityInfo',
        headers: {
          'X-MID': this.xMid
        },
        data: this.facility,
        files: null,
        callback: res => {
          if (res.result.status === '200') {
            this.alert(this.$t('save-success'), 'success')
            this.callback()
            this.close()
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
