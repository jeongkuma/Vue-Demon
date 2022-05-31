<template>
  <div>
    <div id="contentsWrap">
      <div class="dashboard view front">
        <div class="right">
          <grid-layout
            ref="gridLayout"
            :layout.sync="layout"
            :col-num="cols"
            :max-rows="rows"
            :row-height="rowHeight"
            :is-draggable="false"
            :is-resizable="false"
            :vertical-compact="true"
            :margin="[5, 5]"
            :use-css-transforms="true"
            :responsive="true"
            :autoSize="true"
            :breakpoints="breakPoints"
            :cols="breakPointsCols"
          >
            <grid-item
              v-for="item in layout"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :i="item.i"
              :key="item.i"
              ref="gridItem"
            >
              <pub-dashboard-component :item="item"></pub-dashboard-component>
            </grid-item>
          </grid-layout>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import VueGridLayout from 'vue-grid-layout'
import PubDashboardComponent from './PubDashboardComponent'

import DataB from './data/dataB'
import DataA from './data/dataA'
import DataP from './data/dataP'

const LAYOUT_DEFAULT_SIZE = {
  COL: 4,
  ROW: 4
}

export default {
  name: 'PubMecDashboard',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    PubDashboardComponent
  },
  data() {
    return {
      cols: LAYOUT_DEFAULT_SIZE.COL,
      rows: LAYOUT_DEFAULT_SIZE.COL * LAYOUT_DEFAULT_SIZE.ROW,
      rowHeight: 300,
      breakPoints: {
        lg: 1080,
        md: 810,
        sm: 540,
        xs: 270,
        xxs: 0
      },
      breakPointsCols: {
        lg: 4,
        md: 3,
        sm: 2,
        xs: 1,
        xxs: 1
      },
      layout: []
    }
  },
  computed: {},
  watch: {},
  created() {
    let type = this.$route.params.type
    if (type.toLowerCase() === 'b') {
      this.layout = DataB
    } else if (type.toLowerCase() === 'a') {
      this.layout = DataA
    } else if (type.toLowerCase() === 'p') {
      this.layout = DataP
    }
  },
  mounted() {
    eventBus.$emit('usePageInfo', false)
  },
  beforeDestroy() {
    eventBus.$emit('usePageInfo', true)
  },
  methods: {}
}
</script>

<style></style>
