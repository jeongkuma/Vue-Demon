<template>
  <div>
    <div class="modal-body">
      <div class="width-100">
        <div class="mb-1">
          <h4 class="titH4">대상 장비</h4>
        </div>
        <div class="table-wrap">
          <table class="table table-col">
            <colgroup>
              <col style="" />
              <col style="" />
              <col style="" />
              <col style="" />
              <col style="" />
              <col style="" />
            </colgroup>
            <thead>
              <tr>
                <th>{{ $t('service') }}</th>
                <th>{{ $t('dev-cls') }}</th>
                <th>{{ $t('dev-mdl') }}</th>
                <th>{{ $t('ctn') }}</th>
                <th>{{ $t('pin-nm') }}</th>
                <th>{{ $t('inst-addr') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ detData.svcCdNm }}</td>
                <td>{{ detData.devClsCdNm }}</td>
                <td>{{ detData.devMdlNm }}</td>
                <td>{{ detData.ctn }}</td>
                <td>{{ detData.devUname }}</td>
                <td>{{ detData.instAddr }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="form-row mt-3">
        <div class="md-width-100 width-50 pr-2 md-p-0">
          <div class="mb-1">
            <h4 class="titH4">이상징후 조건</h4>
          </div>
          <div class="table-wrap">
            <table class="table table-col">
              <colgroup>
                <col style="" />
                <col style="" />
                <col style="" />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">{{ $t('attribute-name') }}</th>
                  <th scope="col">{{ $t('symptom-grade') }}</th>
                  <th scope="col">{{ $t('symptom-condition') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ detData.devAttbCdNm }}</td>
                  <td>{{ detData.devDetSetCdNm }}</td>
                  <td>
                    <input
                      v-model="detData.detSetCond"
                      type="text"
                      class="form-control"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <detection-alarm-info-comp
          ref="alarmInfo"
          class="md-width-100 width-50 pl-2 md-p-0 md-pt-3"
        ></detection-alarm-info-comp>
      </div>
    </div>
    <div class="modal-footer">
      <div class="btn-wrap text-center">
        <button @click="fnSave()" type="button" class="btn btn-pink">
          {{ $t('save') }}
        </button>
        <button @click="fnClose()" type="button" class="btn btn-gray">
          {{ $t('cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import DetectionAlarmInfoComp from './DetectionAlarmInfoComp.vue'
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'DetectionAlarmModifyPopupSvc',
  components: { DetectionAlarmInfoComp },
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
      xMid: 'P00011',
      detData: {}
    }
  },
  computed: {},
  watch: {},
  created() {
    this.fnGetDetail()
  },
  mounted() {},
  methods: {
    fnGetDetail() {
      requestApi({
        url: '/online/iotedevdetsms/retrieveEdevDet',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: { eDevDetSetSeq: this.data.eDevDetSetSeq },
        callback: res => {
          if (res.result.status === '200') {
            this.detData = res.data
            this.$refs.alarmInfo.fnSetAlarmData(this.detData)
          }
        }
      })
    },
    fnSave() {
      if (this.detData.detSetCond.length === 0) {
        this.alert(this.$t('sms-det-attb-input-chk-msg'))
        return
      }
      this.confirm(this.$t('saveYn'), this.fnSaveApi)
    },
    fnSaveApi() {
      let alarmData = JSON.parse(
        JSON.stringify(this.$refs.alarmInfo.fnGetAlarmData())
      )

      Object.assign(this.detData, alarmData)

      requestApi({
        url: '/online/iotedevdetsms/updateEdevDetSet',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: this.detData,
        callback: res => {
          if (res.result.status === '200') {
            this.alert(this.$t('save-success'), 'success')
            this.callback()
            this.close()
          }
        }
      })
    },
    fnClose() {
      this.close()
    }
  }
}
</script>

<style></style>
