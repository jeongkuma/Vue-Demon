<template>
  <div class="table-wrap y-scroll">
    <table class="table table-col" style="min-width: auto;">
      <colgroup>
        <col
          v-for="(item, idx) in initMsgData"
          v-bind:key="idx"
          :style="{ width: item.WIDTH + 'px' }"
        />
      </colgroup>
      <thead>
        <tr>
          <th scope="col" v-for="(item, idx) in initMsgData" v-bind:key="idx">
            {{ item.TITLE }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in componentData" :key="idx">
          <td
            class="text-center"
            v-for="(object, index) in initMsgData"
            :key="index"
          >
            <div
              @click="openPopup(item, object.COLUMN_VALUE)"
              style="word-break:break-all;word-wrap:break-word;cursor: pointer"
            >
              {{ item[object.COLUMN_VALUE] }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// initMsg
// [{"TITLE":"장비유형","COLUMN_VALUE":"devClsCdNm","WIDTH":"25%"},
// {"TITLE":"사용","COLUMN_VALUE":"act","WIDTH":"25%"},
// {"TITLE":"정지","COLUMN_VALUE":"sus","WIDTH":"25%"},
// {"TITLE":"정지","COLUMN_VALUE":"can","WIDTH":"25%"}]
export default {
  name: 'ClickTableChart',
  props: {
    locNo: {
      type: String
    },
    initMsgData: {
      type: Array
    },
    optionData: {
      type: Object
    },
    componentData: {
      type: Array
    },
    searchOrg: {
      type: String
    }
  },
  data() {
    return {
      initArray: []
    }
  },
  mounted() {},
  methods: {
    openPopup: _.throttle(function(item, columnValue) {
      if (this.optionData.POPUP === 'DetectionReportPopupSvc') {
        // 이상현황
        if (columnValue === 'devAttbCdNm' || columnValue === 'devClsCdNm') {
          return
        }
        this.detectionReportPopup(item, columnValue)
      } else if (this.optionData.POPUP === 'AiDetectionPopupSvc') {
        // AI비전검사 불량리스트
        this.aiDetectionPopup(item, columnValue)
      } else if (this.optionData.POPUP === 'VideoDetectionPopupSvc') {
        // 영상플랫폼 이상징후
      }
    }),
    detectionReportPopup(clickItem, columnValue) {
      this.popup({
        component: () => import('@/views/detection/DetectionReportPopupSvc'),
        title: this.$t('detectionReport'),
        width: 'wide',
        height: 'full',
        data: {
          devClsCd: clickItem['devClsCd'],
          symptomGrade: columnValue.toUpperCase(),
          searchOrg: this.searchOrg
        },
        callback: data => {}
      })
    },
    aiDetectionPopup(clickItem, columnValue) {
      this.popup({
        component: () => import('@/views/detection/AiDetectionPopupSvc'),
        title: this.$t('detectionReport'),
        width: '700',
        height: '700',
        data: {
          item: clickItem
        },
        callback: data => {}
      })
    },
    videoDetectionPpoup(clickItem, columnValue) {
      this.popup({
        component: () => import('@/views/detection/VpIntelligentDetectionPopupSvc'),
        title: this.$t('detectionReport'),
        width: '700',
        height: '700',
        data: {
          item: clickItem
        },
        callback: data => {}
      })
    }
  }
}
</script>

<style scoped>
</style>
