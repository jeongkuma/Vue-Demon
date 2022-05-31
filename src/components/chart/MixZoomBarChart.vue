<template>
  <div :id="mixZoomBarChart + locNo" :style="{ width: width, height: height }">

  </div>
</template>
<script>
// initMsg
// [{"TITLE":"HEADER","COLUMN_VALUE":"devClsCdNm"},{"TITLE":"CATEGORY","COLUMN_VALUE":"devAttbCdNm"},
// {"TITLE":"정상","COLUMN_VALUE":"ds00000007"},{"TITLE":"경미","COLUMN_VALUE":"ds00000006"},
// {"TITLE":"주의","COLUMN_VALUE":"ds00000005"}]
import echarts from 'echarts'

export default {
  name: 'MixZoomBarChart',
  props: {
    locNo: {
      type: String
    },
    initMsgData: {
      type: Array
    },
    componentData: {
      type: Array
    }
  },
  data() {
    return {
      myChart: {},
      mixZoomBarChart: 'mixZoomBarChart',
      options: {
        title: {
          text: ''
        },
        legend: {
          x: 'right',
          data: []
        },
        calculable: true,
        grid: {
          top: '14%',
          left: '10%',
          right: '10%',
          bottom: '12%'
        },
        xAxis: [
          {
            type: 'category',
            data: ['category']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          // 두개의 막대 레전드가 4개의 카테고리 구성 예제
          // {
          //   name: '2010',  레전드
          //   type: 'bar',
          //   data: [12, 14, 15, 17] 4개의 카테고리
          // },
          // {
          //   name: '2011',   레전드
          //   type: 'bar',
          //   data: [12, 14, 15, 17] 4개의 카테고리
          // },
        ]
      },
      headerColumn: '',
      categoryColumn: ''
    }
  },
  watch: {
    componentData: function(newItems) {
      // newItem Sample
      // {
      // "devClsCdNm":"PMV",
      //   "devMdlNm":null,
      //   "devAttbCdNm":"단말상태",
      //   "ds00000007":0,
      //   "ds00000006":0,
      //   "ds00000004":1,
      //   "ds00000005":0
      // }

      if (!newItems || newItems.length === 0) {
        return
      }

      // 데이터 초기화하고 다시 그리기
      this.options.series = []

      // header와 category가 아닌 경우만 series 에 객체로 만든다.
      this.initMsgData.forEach((data, index) => {
        if (data['COLUMN_VALUE'] !== this.headerColumn && data['COLUMN_VALUE'] !== this.categoryColumn) {
          const legendData = []
          newItems.forEach((newItem, idx) => {
            legendData.push(newItem[data['COLUMN_VALUE']])
          })

          const obj = {
            name: data['TITLE'],
            type: 'bar',
            data: legendData
          }

          if (data['TITLE'] === '정상') {
            obj.itemStyle = { color: 'green' }
          } else if (data['TITLE'] === '경미') {
            obj.itemStyle = { color: 'blue' }
          } else if (data['TITLE'] === '주의') {
            obj.itemStyle = { color: 'orange' }
          } else if (data['TITLE'] === '위험') {
            obj.itemStyle = { color: 'red' }
          }

          this.options.series.push(obj)
        }
      })

      // category 만들기
      const legend = []
      newItems.forEach(newItem => {
        legend.push(newItem[this.categoryColumn])
      })
      this.options.xAxis = [{
        type: 'category',
        data: legend
      }]

      this.myChart.setOption(this.options, true)
    }
  },
  created () {
  },
  mounted () {
    this.init()

    this.myChart = echarts.init(document.getElementById(this.mixZoomBarChart + this.locNo))
    this.myChart.setOption(this.options)
    window.addEventListener('resize', this.fnHandleWindowResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.fnHandleWindowResize)
  },
  methods: {
    fnHandleWindowResize() {
      this.myChart.resize()
    },
    init() {
      // layout initialize
      let chartDiv = $('#' + this.mixZoomBarChart + this.locNo)
      $(chartDiv).css('height', ($(chartDiv).parent().parent().parent().parent().height() - 110) + 'px')

      // initial data
      const legendData = []

      for (let index = 0; index < this.initMsgData.length; ++index) {
        if (this.initMsgData[index]['TITLE'] === 'HEADER') {
          this.headerColumn = this.initMsgData[index]['COLUMN_VALUE']
        } else if (this.initMsgData[index]['TITLE'] === 'CATEGORY') {
          this.categoryColumn = this.initMsgData[index]['COLUMN_VALUE']
        } else {
          legendData.push(this.initMsgData[index]['TITLE'])
          const obj = {
            name: this.initMsgData[index]['TITLE'],
            type: 'bar',
            data: [1]
          }
          this.options.series.push(obj)
        }
      }
      this.options.legend = {
        x: 'right',
        data: legendData
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
