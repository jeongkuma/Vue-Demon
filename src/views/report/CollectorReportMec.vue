<template>
  <div>
    <div class="search-box">
      <div class="form-inline">
        <div class="form-group">
          <span class="form-control-static">{{ $t('pin-nm') }}</span>
          <input type="text" v-model="reqData.devUname" class="form-control" />
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="fnGetCurDataList">
            {{ $t('search') }}
          </button>
          <button
            class="btn btn-info"
            type="button"
            @click="fnInitializeSeach"
          >
            {{ $t('initializing') }}
          </button>
        </div>
      </div>
    </div>
    <!-- 배전반 수집 현황 -->
    <div class="flex flex-wrap table-wrap">
      <div
        v-for="(dev, index) in devList"
        :key="`dev-${index}`"
        class="switch-mec-unit"
      >
        <div class="boxs">
          <table class="table table-col">
            <colgroup>
              <col width="" />
              <col width="" />
              <col width="" />
            </colgroup>
            <thead>
              <tr>
                <th class="py-1">배전면</th>
                <th class="py-1">속성</th>
                <th class="py-1">값</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(data, dataIndex) in fnGetCurDataListByDev(dev.ctn)"
                :key="`${index}-${dataIndex}`"
              >
                <td
                  v-if="dataIndex === 0"
                  :rowspan="fnGetCurDataListByDev(dev.ctn).length"
                  class="border-right"
                >
                  {{ dev.devUname }}
                </td>
                <td>{{ fnGetDisplayName(data.devAttbCdNm) }}</td>
                <td>
                  <template v-if="data.devAttbCdNm.endsWith('알람')">
                    {{ fnGetPdAlarmStatus(data.devVal) }}
                  </template>
                  <template
                    v-else-if="
                      data.devAttbCdNm.startsWith('Thermal') &&
                        data.devAttbCdNm.includes('_Alarm')
                    "
                  >
                    {{ fnGetThermalAlarm(data.devVal) }}
                  </template>
                  <template v-else>
                    {{ data.devVal }}
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { requestApi } from '@/api/ccp/requestApi'

const PD_ALARM_STATUS = [
  { flag: 0, description: '노이즈' },
  { flag: 1, description: '부유전극결함' },
  { flag: 2, description: '절연물공극결함' },
  { flag: 3, description: '도체돌기결함' },
  { flag: 4, description: '절연물표면결함' },
  { flag: 5, description: '절연물 부유' }
]

const THERMAL_ALARM = [
  { flag: 0, description: '정상' },
  { flag: 1, description: '상간 온도차 발생(점검필요)' },
  { flag: 2, description: '상간 온도차 발생(점검필요)' },
  { flag: 3, description: '상간 온도차 발생(점검필요)' },
  { flag: 4, description: '국부과열' }
]

export default {
  name: 'CollectorReportMec',
  components: {},
  data() {
    return {
      xMid: 'P00012',
      curDataList: [],
      reqData: {
        svcCd: 'SD00000300',
        devClsCd: 'SD00000301',
        devUname: ''
      }
    }
  },
  computed: {
    devList() {
      return this.curDataList.filter(
        (item, index, self) => index === self.findIndex(t => t.ctn === item.ctn)
      )
    }
  },
  watch: {},
  created() {},
  mounted() {
    this.fnGetCurDataList()
  },
  methods: {
    fnGetCurDataList() {
      requestApi({
        url: '/online/iotentrdevcol/retrieveEDevCurList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: this.reqData,
        callback: res => {
          let list = res.data.list
          list.forEach(item => {
            if (item.colNmCd === '') {
            }
          })
          this.curDataList = list
        }
      })
    },
    fnGetCurDataListByDev(ctn) {
      let list = this.curDataList.filter(
        item =>
          item.ctn === ctn &&
          item.devVal !== '' &&
          !item.devAttbCdNm.endsWith('명') &&
          !item.devAttbCdNm.endsWith('_name')
      )
      return list
    },
    // PD Alarm Status 텍스트 값
    fnGetPdAlarmStatus(value) {
      let status = PD_ALARM_STATUS.find(i => i.flag === parseInt(value))
      return status ? status.description : ''
    },
    // Thermal 텍스트 값
    fnGetThermalAlarm(value) {
      let thermal = THERMAL_ALARM.find(i => i.flag === parseInt(value))
      return thermal ? thermal.description : ''
    },
    // 속성 표시명
    fnGetDisplayName(devAttbCdNm) {
      let disp = this.curDataList.find(
        item => item.devAttbCdNm === devAttbCdNm + '_name'
      )
      return disp ? disp.devVal : devAttbCdNm
    },
    fnInitializeSeach() {
      this.reqData.devUname = ''
    }
  }
}
</script>

<style>
.switch-mec-unit {
  width: 33%;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 15px;
}
.switch-mec-unit .boxs {
  max-width: none;
  border: 1px solid #e5e9ee;
  height: 100%;
}
@media screen and (min-width: 0) and (max-width: 1024px) {
  .switch-mec-unit {
    width: 100%;
  }
}
</style>
