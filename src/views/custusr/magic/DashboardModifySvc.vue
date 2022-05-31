<template>
  <div class="pt-3">
    <div ref="dashboardWrap" class="drawer-box">
      <div class="drawer-left-wrap">
        <div class="drawer-header"><h4 class="titH4">컴포넌트 선택</h4></div>
        <div class="drawer-content">
          <div
            v-for="(comp, index) in componentList"
            :key="`comp-${index}`"
            class="dashbaord-drawer-item draggable-chart"
            :data-usr-dash-tmpl-seq="comp.usrDashTmplSeq"
          >
            <div class="dashbaord-drawer-item-box">
              <div class="text-center">
                <img :src="comp.tmplRuleImg" style="height: 125px" />
              </div>
              <div class="mt-2 width-100 text-center">
                {{ comp.dashTmplTitle }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="drawer-right-wrap pl-2">
        <div class="drawer-header py-1 form-inline">
          <div class="form-group">
            <span class="form-control-static">{{ $t('department') }}</span>
            <select
              v-model="orgSeq"
              class="form-control"
              @change="fnGetDashboardItemListByOrg"
            >
              <option
                v-for="list in orgList"
                :key="list.orgSeq"
                :value="list.orgSeq"
                >{{ list.orgPath }}</option
              >
            </select>
          </div>
          <div class="form-group">
            <button type="button" class="btn btn-pink" @click="fnSaveConfirm">
              {{ $t('save') }}
            </button>
            <button type="button" class="btn btn-gray" @click="fnRemoveItem">
              {{ $t('delete') }}
            </button>
          </div>
        </div>
        <div class="drawer-content p-0">
          <grid-layout
            ref="gridLayout"
            :layout.sync="layout"
            :col-num="grid.cols"
            :max-rows="grid.rows"
            :row-height="250"
            :is-draggable="true"
            :is-resizable="true"
            :vertical-compact="true"
            :margin="[10, 10]"
            :use-css-transforms="false"
            :responsive="true"
            :breakpoints="grid.breakPoints"
            :cols="grid.breakPointsCols"
            @layout-updated="fnHandleLayoutUpdated"
          >
            <grid-item
              v-for="item in layout"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :i="item.i"
              :key="item.i"
              :id="`item${item.i}`"
            >
              <dashboard-chart-image
                :id="dashboardItems[`item${item.i}`].id"
                :title="dashboardItems[`item${item.i}`].title"
                :view="dashboardItems[`item${item.i}`].view"
                :chartImagePath="dashboardItems[`item${item.i}`].tmplRuleImg"
                :value="item.i"
                :item="item"
              ></dashboard-chart-image>
            </grid-item>
          </grid-layout>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import DashboardChartImage from '@/components/dashboard/DashboardChartImage'
import requestApi from '@/api/ccp/requestApi'

const LAYOUT_DEFAULT_SIZE = {
  COL: 4,
  ROW: 4
}

export default {
  name: 'DashboardModifySvc',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    DashboardChartImage
  },
  data() {
    return {
      componentList: [],
      orgList: [],
      orgSeq: '',
      layout: [],
      dashboardItems: {},
      grid: {
        cols: 4,
        rows: 16,
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
        }
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.fnGetComponentList()
    this.fnGetOrgList()
    this.fnInitLayout()
  },
  methods: {
    // 템플릿 목록 조회
    fnGetComponentList() {
      // 별도의 API 없고 페이징을 많이 잡음
      let params = {
        currentPage: 1,
        displayRowCount: 9999
      }
      requestApi({
        url: '/online/com/usrDash/getIotDashTmplList',
        headers: {
          'X-MID': 'P00048'
        },
        method: 'post',
        data: params,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.componentList = res.data.dataList
            this.$nextTick(() => {
              this.fnSetDragDrop()
            })
          }
        }
      })
    },
    // 조직 목록 조회
    fnGetOrgList() {
      requestApi({
        url: '/online/iotorg/retrieveIotCustOrg',
        headers: {
          'X-MID': 'P00048'
        },
        data: {},
        method: 'post',
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.orgList = res.data.orgList
            this.orgSeq = this.orgList[0].orgSeq
            // 첫번째 조직 대시보드 템플릿 조회
            this.fnGetDashboardItemListByOrg()
          }
        }
      })
    },
    // 조직별 대시보드 템플릿 조회
    fnGetDashboardItemListByOrg() {
      if (this.orgSeq === '') {
        this.alert(this.$t('request-org-select'))
        return
      }

      // 초기화
      this.fnRefreshLayout()
      this.fnRefreshDashboardImage()

      let reqData = {
        orgSeq: this.orgSeq
      }
      requestApi({
        url: '/online/com/usrDash/getIotUsrDashTmpl',
        headers: {
          'X-MID': 'P00048'
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            res.data.forEach((item, index) => {
              // 차트 좌표 값 설정
              let breakPoint = this.$refs.gridLayout.lastBreakpoint
              let idx = this.layout.findIndex(
                layout => layout.i === item.dashLocNo.toString()
              )
              if (
                breakPoint === 'lg' ||
                breakPoint === 'md' ||
                breakPoint === 'sm'
              ) {
                this.layout[idx].x = item.coordXNo
                this.layout[idx].y = item.coordYNo
                this.layout[idx].w = item.width
              }
              this.layout[idx].h = item.height

              // 템플릿 선택 목록에서 삭제
              if (item.usrDashTmplSeq) {
                // 차트 이미지정보 세팅
                this.dashboardItems['item' + item.dashLocNo].view = true
                this.dashboardItems['item' + item.dashLocNo].id = item.tmplCdId
                this.dashboardItems['item' + item.dashLocNo].title =
                  item.dashTmplTitle
                this.dashboardItems['item' + item.dashLocNo].tmplRuleImg =
                  item.tmplRuleImg
                this.dashboardItems['item' + item.dashLocNo].data = item
              } else {
                this.dashboardItems['item' + item.dashLocNo].view = false
                this.dashboardItems['item' + item.dashLocNo].id = ''
                this.dashboardItems['item' + item.dashLocNo].title = ''
                this.dashboardItems['item' + item.dashLocNo].tmplRuleImg = ''
                this.dashboardItems['item' + item.dashLocNo].usrDashTmplSeq = ''
                this.dashboardItems['item' + item.dashLocNo].data = {}
              }
            })
            this.fnSetDragDrop()
            this.$refs.gridLayout.layoutUpdate()
          }
        }
      })
    },
    // 그리드 레이아웃 초기화
    fnInitLayout() {
      let layout = []
      let layoutMobile = []
      let dashboardItems = {}
      for (let col = 0; col < LAYOUT_DEFAULT_SIZE.COL; col++) {
        for (let row = 0; row < LAYOUT_DEFAULT_SIZE.ROW; row++) {
          layout.push({
            x: row,
            y: col,
            w: 1,
            h: 1,
            i: String(col * LAYOUT_DEFAULT_SIZE.ROW + row + 1)
          })
          layoutMobile.push({
            x: 0, y: col * LAYOUT_DEFAULT_SIZE.ROW + row, w: 1, h: 1, i: String(col * LAYOUT_DEFAULT_SIZE.ROW + row + 1)
          })
          let key = 'item' + String(col * LAYOUT_DEFAULT_SIZE.ROW + row + 1)
          dashboardItems[key] = {
            view: false,
            id: '',
            title: '',
            tmplRuleImg: '',
            data: {}
          }
        }
      }
      this.layout = JSON.parse(JSON.stringify(layout))
      this.layoutInit = JSON.parse(JSON.stringify(layout))
      this.layoutInitMobile = layoutMobile
      this.dashboardItems = dashboardItems

      this.cols = LAYOUT_DEFAULT_SIZE.COL
      this.rows = LAYOUT_DEFAULT_SIZE.COL * LAYOUT_DEFAULT_SIZE.ROW // max row로 모바일인 경우 1줄에 하나

      this.grid.breakPointsCols.lg = LAYOUT_DEFAULT_SIZE.COL
      this.$refs.gridLayout.layoutUpdate()
    },
    fnRefreshLayout() {
      let breakPoint = this.$refs.gridLayout.lastBreakpoint
      if (breakPoint === 'xs' || breakPoint === 'xxs') {
        this.layoutInitMobile.forEach((item, index) => {
          this.layout[index].x = item.x
          this.layout[index].y = item.y
          this.layout[index].w = item.w
          this.layout[index].h = item.h
        })
      } else {
        this.layoutInit.forEach((item, index) => {
          this.layout[index].x = item.x
          this.layout[index].y = item.y
          this.layout[index].w = item.w
          this.layout[index].h = item.h
        })
      }
    },
    fnRefreshDashboardImage() {
      this.layoutInit.forEach((item, index) => {
        this.dashboardItems['item' + item.i].view = false
        this.dashboardItems['item' + item.i].id = ''
        this.dashboardItems['item' + item.i].title = ''
        this.dashboardItems['item' + item.i].tmplRuleImg = ''
        this.dashboardItems['item' + item.i].usrDashTmplSeq = ''
        this.dashboardItems['item' + item.i].data = {}
      })
    },
    fnSetDragDrop() {
      $('.draggable-chart').draggable({
        helper: function() {
          let html = $(this).html()
          return $('<div>')
            .html(html)
            .css('z-index', 999)
        },
        connectToSortable: '.vue-grid-item'
      })
      $('.vue-grid-item').droppable({
        drop: (e, ui) => {
          let component = this.componentList.find(
            c => c.usrDashTmplSeq === ui.draggable[0].dataset.usrDashTmplSeq
          )
          let id = e.target.id
          this.dashboardItems[id] = {
            id: component.tmplCdId,
            title: component.dashTmplTitle,
            tmplRuleImg: component.tmplRuleImg,
            view: true,
            data: component
          }
        }
      })
    },
    // 저장 확인
    fnSaveConfirm() {
      if (this.orgSeq === '') {
        this.alert(this.$t('request-org-select'))
        return
      }
      this.confirm(this.$t('saveYn'), this.fnSave)
    },
    // 저장
    fnSave() {
      let paramObj = {}
      paramObj.orgSeq = this.orgSeq
      paramObj.tbItoUsrDashTmplDtoList = []

      this.layout.forEach(item => {
        var obj = {}
        obj.coordXNo = item.x
        obj.coordYNo = item.y
        obj.width = item.w
        obj.height = item.h
        obj.dashLocNo = item.i
        obj.orgSeq = this.orgSeq

        if (this.dashboardItems['item' + item.i].view === true) {
          let key = 'item' + item.i
          obj.usrDashTmplSeq = this.dashboardItems[key].data.usrDashTmplSeq
        } else {
          obj.usrDashTmplSeq = null
        }
        paramObj.tbItoUsrDashTmplDtoList.push(obj)
      })

      requestApi({
        url: '/online/com/usrDash/saveIotUsrDashTmpl',
        headers: {
          'X-MID': 'P00048'
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('save-success'), 'success')
          } else {
            this.alert(this.$t('save-fail'))
          }
        }
      })
    },
    fnRemoveItem() {
      const context = this
      $('.form-check-input:checked').each(function(i, v) {
        let val = $(this).val()

        // 차트가 있을 경우 원복 처리
        if (context.dashboardItems['item' + val].view === true) {
          context.dashboardItems['item' + val].id = ''
          context.dashboardItems['item' + val].title = ''
          context.dashboardItems['item' + val].view = false
          context.dashboardItems['item' + val].data = {}
        }
        $(this).prop('checked', false)
      })
    },
    fnHandleLayoutUpdated() {}
  }
}
</script>

<style lang="less">
.drawer-box {
  display: flex;
  width: 100%;
  height: calc(100vh - 220px);
  min-height: 500px;
  .drawer-header {
    flex: none;
    padding: 15px 10px;
  }
  .drawer-content {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
  }
  .drawer-left-wrap {
    width: 220px;
    flex: none;
    display: flex;
    flex-direction: column;
    .drawer-content {
    }
  }
  .drawer-right-wrap {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    .drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .dashbaord-drawer-item-box {
    border: 1px solid #d4dce4;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 10px;
    width: 100%;
    cursor: move;
    user-select: none;
  }
}
@media screen and (min-width: 0) and (max-width: 767px) {
  .drawer-box {
    display: flex;
    width: 100%;
    min-height: 500px;
    height: auto;
    flex-direction: column;

    .drawer-left-wrap {
      width: 100%;
      flex: none;
      overflow-x: auto;
      .drawer-content {
        display: table;
        table-layout: fixed;
        width: 100%;
        .dashbaord-drawer-item {
          display: table-cell;
          width: 170px;
          padding: 0 5px;
        }
      }
    }
    .drawer-right-wrap {
      flex: 1;
      padding-top: 15px;
      .drawer-header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
    }
  }
}
</style>
