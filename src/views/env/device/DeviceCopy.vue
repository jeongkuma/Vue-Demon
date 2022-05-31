<template>
  <div>
    <div class="modal-body">
      <div class="table-wrap border-none">
        <table class="table table-row">
          <caption>{{$t('deviceCopy')}}</caption>
          <colgroup>
            <col style="width:25%">
            <col style="width:auto">
          </colgroup>
          <tbody>
            <tr>
              <th scope="row"><span class="lb-txt">{{$t('model-code')}}</span></th>
              <td class="form-inline">
                <div class="input-group">
                  <input ref="devMdlCd" v-model="device.devMdlCd" @change="checkedDuplModelId = false"
                    type="text" class="form-control" placeholder="">
                  <button class="btn btn-gray input-group-addon" type="button"
                    @click="checkDuplModelId()">{{$t('duplication-check')}}</button>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row"><span class="lb-txt">{{$t('dev-mdl-nm')}}</span></th>
              <td>
                <input v-model="device.devMdlNm" type="text" class="form-control" placeholder="" style="width:100%">
              </td>
            </tr>
            <tr>
              <th scope="row"><span class="lb-txt">{{$t('manufacturer')}}</span></th>
              <td>
                <input v-model="device.vendorNm" type="text" class="form-control" placeholder="" style="width:100%">
              </td>
            </tr>
            <tr>
              <th scope="row"><span class="lb-txt">{{$t('useYn')}}</span></th>
              <td>
                <select v-model="device.useYn" class="form-control" style="width:100%">
                  <option value="Y">{{$t('use')}}</option>
                  <option value="N">{{$t('use-no')}}</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="modal-footer">
      <div class="btn-wrap text-center">
        <button @click="copyDevice()" type="button" class="btn btn-pink">{{$t('complete')}}</button>
        <button type="button" class="btn btn-gray" data-dismiss="modal">{{$t('cancel')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import TbIotDevDTO from '@/api/ccp/dto/TbIotDevDTO'

export default {
  name: 'DeviceCopy',
  components: {},
  props: {
    data: Object, // 넘겨받을 데이터,
    callback: { // 호출할 콜백함수
      type: Function,
      required: true
    },
    close: { // 팝업 닫는함수
      type: Function,
      required: true
    }
  },
  data () {
    return {
      checkedDuplModelId: false, // 모델ID 중복확인여부,
      device: null
    }
  },
  created () {
    this.device = new TbIotDevDTO({
      sdevSeq: this.data.sdevSeq,
      svcCd: this.data.svcCd,
      useYn: 'Y'
    })
  },
  mounted () {},
  computed: {},
  methods: {
    checkDuplModelId () { // 장비 모델ID 중복확인
      if (!this.device.devMdlCd) {
        this.alert(this.$t('not-inputed').replace('$0', this.$t('model-code')), 'warning')
        return
      }
      requestApi({
        url: '/online/iotdev/retrieveIotDup',
        headers: {
          'X-MID': 'P00069'
        },
        method: 'post',
        data: {
          devMdlCd: this.device.devMdlCd
        },
        callback: (data) => {
          this.checkedDuplModelId = data.data === 0
          if (this.checkedDuplModelId) {
            this.alert(this.$t('no-duplicate-data'), 'success')
          } else {
            this.alert(this.$t('duplicate-data').replace('$0', this.$t('model-code')), 'warning')
          }
        }
      })
    },
    copyDevice () {
      if (this.checkedDuplModelId) {
        let suffixMsg = this.$t('not-inputed')
        let msg =
          this.device.devMdlCd === null ? this.$t('model-code')
            : this.device.devMdlNm === null ? this.$t('dev-mdl-nm')
              : this.device.vendorNm === null ? this.$t('manufacturer') : null

        if (msg) {
          this.alert(msg + suffixMsg, 'warning')
          return
        }
        requestApi({
          url: '/online/iotdev/insertIotDevCopy',
          headers: {
            'X-MID': 'P00069'
          },
          method: 'post',
          data: this.device,
          callback: (res) => {
            if (res.result.status === '200') {
              this.callback(true)
              this.close()
              this.alert(this.$t('copy-success'), 'success')
            }
          }
        })
      } else {
        this.alert(this.$t('alert-check-duplicate-model-id'), 'warning')
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
