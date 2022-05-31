<template>
  <div>
    <div id="contentsWrap">
      <div class="dashboard view front">
        <div class="right">
          <grid-layout
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
            ref="gridLayout"
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
              <dashboard-chart
                :id="chartImage['chartItem' + item.i].id"
                :locNo="item.i"
                :title="chartImage['chartItem' + item.i].title"
                :view="chartImage['chartItem' + item.i].view"
                :value="item.i"
                :tmplGubun="chartImage['chartItem' + item.i].gubun"
                :items="chartImage['chartItem' + item.i].data"
                :orgList="orgList"
                :loginCustSeq="loginCustSeq"
                :devClsList="devClsList"
                :reloadList="reloadList"
                :savedSearchValue="fnGetSavedSearchValueOfItem(chartImage['chartItem' + item.i].data)"
                ref="dashboardChart"
              >
              </dashboard-chart>
            </grid-item>
          </grid-layout>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import requestApi from '@/api/ccp/requestApi'
import VueGridLayout from 'vue-grid-layout'
import DashboardChart from '@/components/dashboard/DashboardChart'
import localStore from '@/utils/localStore'

const LAYOUT_DEFAULT_SIZE = {
  COL: 4,
  ROW: 4
}
const SEARCHDATA_STORAGE_KEY = 'TICT_DASH_SEARCH'

export default {
  name: 'dashboard',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    DashboardChart
  },
  props: {},
  data() {
    return {
      over: false,
      cols: 4,
      rows: 16,
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
      layout: [],
      chartImage: {},
      orgList: [],
      devClsList: [],
      reloadList: [],
      loginOrgSeq: 0,
      loginCustSeq: '0',
      savedSearchValueList: []
    }
  },
  created() {
    this.initLayout()
  },
  mounted() {
    eventBus.$emit('usePageInfo', false)
    this.initData()
  },
  beforeDestroy() {
    eventBus.$emit('usePageInfo', true)
  },
  computed: {},
  methods: {
    initLayout() {
      let layout = []
      let chartImage = {}
      for (let col = 0; col < LAYOUT_DEFAULT_SIZE.COL; col++) {
        for (let row = 0; row < LAYOUT_DEFAULT_SIZE.ROW; row++) {
          layout.push({
            x: row,
            y: col,
            w: 1,
            h: 1,
            i: String(col * LAYOUT_DEFAULT_SIZE.ROW + row + 1)
          })
          chartImage['chartItem' + String(col * LAYOUT_DEFAULT_SIZE.ROW + row + 1)] = { view: false, id: '', title: '', tmplRuleImg: '' }
        }
      }
      this.layout = JSON.parse(JSON.stringify(layout))
      this.chartImage = chartImage

      this.cols = LAYOUT_DEFAULT_SIZE.COL
      this.rows = LAYOUT_DEFAULT_SIZE.COL * LAYOUT_DEFAULT_SIZE.ROW // max row로 모바일인 경우 1줄에 하나

      this.breakPointsCols.lg = LAYOUT_DEFAULT_SIZE.COL
    },
    async initData() {
      // 조직 목록 조회
      this.fnGetOrgList()
      // 새로고침 시간 조회
      this.fnGetCommonCodeList()
      // 장비유형 조회
      this.fnGetDevClsList()

      // 검색 조건 조회
      await this.fnGetSavedSearchValue()
      this.fnGetOrgDashboardTemplateList()
    },
    fnGetDevClsList() {
      requestApi({
        url: '/online/iotsdev/retrieveSvcDevClsList',
        method: 'post',
        headers: {
          'X-MID': 'P00001'
        },
        data: {},
        callback: res => {
          if (res.data && res.data.length > 0) {
            this.devClsList = res.data
          }
        }
      })
    },
    // 조직 목록 조회
    fnGetOrgList() {
      requestApi({
        url: '/online/iotorg/retrieveIotCustOrg',
        headers: {
          'X-VNAME': 'ONLINE',
          'X-MID': 'P00001'
        },
        data: {},
        method: 'post',
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.orgList = res.data.orgList
            this.loginCustSeq = res.data.custOrgSeq
            this.orgSeq = this.orgList[0].orgSeq
          }
        }
      })
    },
    // 공통코드 목록
    fnGetCommonCodeList() {
      requestApi({
        url: '/online/iotcmcd/retrieveIotByParentCmCdRuntime',
        headers: {
          'X-VNAME': 'ONLINE',
          'X-MID': 'P00001'
        },
        method: 'post',
        data: { parentCdId: 'GN00000017' },
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.reloadList = res.data
          }
        }
      })
    },
    fnGetSavedSearchValue() {
      let jsonString = localStore.get(SEARCHDATA_STORAGE_KEY)
      if (jsonString) {
        this.savedSearchValueList = JSON.parse(jsonString)
      }
      return Promise.resolve()
    },
    fnGetSavedSearchValueOfItem(item) {
      if (!item || !this.savedSearchValueList) {
        return {}
      }
      return this.savedSearchValueList[item.usrDashTmplSeq] || {}
    },
    // 조직별 대시보드 템플릿 조회
    fnGetOrgDashboardTemplateList() {
      let paramObj = {}
      paramObj.orgSeq = ''

      requestApi({
        url: '/online/com/usrDash/getIotUsrDashTmpl',
        headers: {
          'X-VNAME': 'ONLINE',
          'X-MID': 'P00001'
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            res.data.forEach((item, index) => {
              // 템플릿 선택 목록에서 삭제
              if (item.usrDashTmplSeq) {
                // 차트 이미지정보 세팅
                this.chartImage['chartItem' + item.dashLocNo].id = item.tmplCdId
                this.chartImage['chartItem' + item.dashLocNo].title =
                  item.dashTmplTitle
                this.chartImage['chartItem' + item.dashLocNo].view = true
                this.chartImage['chartItem' + item.dashLocNo].gubun =
                  item.tmplGubun
                this.chartImage['chartItem' + item.dashLocNo].data = item

                // 차트 좌표 값 설정
                let breakPoint = this.$refs.gridLayout.lastBreakpoint

                let obj = this.layout.find(
                  layout => layout.i === item.dashLocNo.toString()
                )
                if (breakPoint === 'lg') {
                  obj.x = item.coordXNo
                  obj.y = item.coordYNo
                  obj.w = item.width
                }
                obj.h = item.height
              }
            })

            this.fnUpdateLayout().then(() => {
              $('.grid-container .y-scroll').each(function(i, v) {
                let parentHeight =
                  $(this)
                    .parent()
                    .parent()
                    .parent()
                    .parent()
                    .parent()
                    .height() - 110
                $(this).css('max-height', parentHeight + 'px')
              })

              // 4*4 를 벗어난 컴포넌트는 삭제
              // 템플릿 등록 안된 컴포넌트 삭제
              for (let i = this.layout.length - 1; i >= 0; i--) {
                if (
                  this.chartImage['chartItem' + this.layout[i].i].view === false
                ) {
                  this.layout.splice(i, 1)
                }
              }
            })
          }
        }
      })
    },
    fnUpdateLayout() {
      let context = this
      return new Promise(function(resolve, reject) {
        context.$refs.gridLayout.layoutUpdate()
        resolve()
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
