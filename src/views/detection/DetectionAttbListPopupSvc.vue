<template>
  <div>
    <div class="modal-body">
      <div class="search-box form-inline">
        <div class="form-group">
          <span class="form-control-static">서비스</span>
          <input
            type="text"
            v-model="data.device.svcCdNm"
            disabled="disabled"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <span class="form-control-static">{{ $t('dev-cls') }}</span>
          <input
            type="text"
            v-model="data.device.devClsCdNm"
            disabled="disabled"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <span class="form-control-static">{{ $t('dev-mdl-nm') }}</span>
          <input
            type="text"
            v-model="data.device.devMdlNm"
            disabled="disabled"
            class="form-control"
          />
        </div>
      </div>
      <div class="form-horizontal table-wrap  grid-container">
        <table class="table table-col">
          <caption>
            {{
              $t('device-attr')
            }}
          </caption>
          <colgroup>
            <col style="width: 35px" />
            <col style="width: 150px" />
            <col style="width: 150px" />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">
                <div class="form-check">
                  <label class="checkbox">
                    <input
                      ref="allCheckDeviceAttr"
                      :checked="checkAll"
                      @change="fnCheckAll"
                      role="checkbox"
                      class="cbox"
                      type="checkbox"
                    /><i></i>
                  </label>
                </div>
              </th>
              <th scope="col">{{ $t('attribute-name') }}</th>
              <th scope="col">{{ $t('symptom-grade') }}</th>
              <th scope="col">{{ $t('symptom-condition') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(attb, index) in deviceAttbList"
              :key="`deviceAttb-${index}`"
            >
              <td class="form-check">
                <label class="checkbox">
                  <input
                    v-model="selectedAttb"
                    type="checkbox"
                    class="cbox"
                    :value="attb"
                  /><i></i>
                </label>
              </td>
              <td>{{ attb.devAttbCdNm }}</td>
              <td>{{ attb.devDetSetCdNm }}</td>
              <td class="text-left">{{ attb.detSetCond }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="modal-footer">
      <div class="btn-wrap text-center">
        <button @click="fnSelectAttb()" type="button" class="btn btn-pink">
          {{ $t('select') }}
        </button>
        <button @click="fnClose()" type="button" class="btn btn-gray">
          {{ $t('cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'DetectionAttbListPopupSvc',
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
      deviceAttbList: [],
      selectedAttb: []
    }
  },
  computed: {
    checkAll() {
      return this.deviceAttbList.length !== 0 && this.selectedAttb.length === this.deviceAttbList.length
    }
  },
  watch: {},
  created() {},
  mounted() {
    this.fnGetDeviceAttbList()
  },
  methods: {
    fnGetDeviceAttbList() {
      requestApi({
        url: '/online/iotedevdetsms/retrieveSdevDetList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {
          svcCd: this.data.device.svcCd,
          devClsCd: this.data.device.devClsCd,
          devMdlCd: this.data.device.devMdlCd
        },
        callback: res => {
          if (res.result.status === '200') {
            this.deviceAttbList = res.data.dataList
          }
        }
      })
    },
    fnCheckAll(event) {
      if (event.target.checked) {
        this.selectedAttb = this.deviceAttbList
      } else {
        this.selectedAttb = []
      }
    },
    fnSelectAttb() {
      if (this.selectedAttb.length === 0) {
        this.alert('이상징후 조건을 선택하세요.')
        return
      }
      this.callback(this.selectedAttb)
      this.close()
    },
    fnClose() {
      this.close()
    }
  }
}
</script>

<style></style>
