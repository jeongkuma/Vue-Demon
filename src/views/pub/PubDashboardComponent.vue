<template>
  <div class="fr-dashboard form-in">
    <div class="dash-comp-header" style="min-height: 37px">
      <div><b>{{ item.title }}</b></div>
      <div class="flex flex-wrap items-center justify-end">
        <div class="text-right px-1">{{ lastUpdateDate }}</div>
        <div>
          <select
            name=""
            title=""
            class="form-control"
          >
            <option
              v-for="list in reloadList"
              :value="list.cdId * 1000"
              :key="list.cdId"
              >{{ list.cdNm }}</option>
          </select>
        </div>
      </div>
    </div>
    <pub-dashboard-search
      ref="search"
      class="dash-comp-search"
      :init-msg-search-data="item.search"
      :orgList="orgList"
      :usrDashCond="[]"
    >
    </pub-dashboard-search>
    <div class="dash-comp-content">
      <component
        ref="comp"
        :is="item.componentType"
        :initMsgData="item.form"
        :optionData="item.option"
        :componentData="item.data"
        :locNo="String(item.i)"
      />
    </div>
  </div>
</template>

<script>
import PubDashboardSearch from './PubDashboardSearch'

import GaugeChart from '@/components/chart/GaugeChart'
import PieDatasetChart from '@/components/chart/PieDatasetChart'
import MixZoomBarChart from '@/components/chart/MixZoomBarChart'
import DynamicLineChart from '@/components/chart/DynamicLineChart'
import TableChart from '@/components/chart/TableChart'
import ClickTableChart from '@/components/chart/ClickTableChart'
import RowTableChart from '@/components/chart/RowTableChart'
import AiRealTimeStatus from '@/components/chart/custom/AiRealTimeStatus'
import PumpDetStatus from '@/components/chart/custom/PumpDetStatus'

export default {
  name: 'PubDashboardComponent',
  components: { PubDashboardSearch, GaugeChart, PieDatasetChart, MixZoomBarChart, DynamicLineChart, TableChart, ClickTableChart, RowTableChart, AiRealTimeStatus, PumpDetStatus },
  props: {
    item: {
      type: Object
    }
  },
  data() {
    return {
      reloadList: [{ cdId: '300', cdNm: '5분' }],
      lastUpdateDate: '11:06:10',
      orgList: [{ orgSeq: '', orgPath: '/통합관제' }],
      componentData: null
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // 차트인 경우 생성 후 리사이징이 필요
    setTimeout(() => {
      if (this.$refs.comp.fnHandleWindowResize) {
        this.$refs.comp.fnHandleWindowResize()
      }
    }, 500)
  },
  methods: {}
}
</script>

<style></style>
