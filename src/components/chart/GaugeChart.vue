<template>
  <div :id="gaugeChart + locNo" :style="{ width: width, height: height }">

  </div>
</template>
<script>
// initMsg Example
// [{\"TITLE\":\"속도\",\"MIN\":\"0\",\"MAX\":\"255\",\"SPLITNUMBER\":\"5\",\"TAG_VALUE\":\"ATTB_VL10\"},
//   {\"TITLE\":\"배터리잔량\",\"MIN\":\"0\",\"MAX\":\"500\",\"SPLITNUMBER\":\"5\",\"TAG_VALUE\":\"ATTB_VL06\"}]
import echarts from 'echarts'

export default {
  name: 'GaugeChart',
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
      gaugeChart: 'gaugeChart',
      devData: {
        name: '',
        type: 'gauge',
        center: ['27%', '50%'],
        radius: '100%',
        z: 3,
        min: 0,
        max: 300,
        splitNumber: 5,
        axisLine: {
          lineStyle: {
            width: 8
          }
        },
        axisTick: {
          length: 10,
          lineStyle: {
            color: 'auto'
          }
        },
        splitLine: {
          length: 20,
          lineStyle: {
            color: 'auto'
          }
        },
        title: {
          textStyle: {
            fontWeight: 'bolder',
            fontSize: 16,
            fontStyle: 'italic'
          },
          offsetCenter: [0, '-30%']
        },
        detail: {
          textStyle: {
            fontWeight: 'bolder'
          }
        },
        data: [{ value: 0, name: '온도' }]
      },
      options: {
        tooltip: {
          formatter: '{a} <br/>{c} {b}'
        },
        toolbox: {
          show: false,
          feature: {
            mark: { show: true },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
        ]
      },
      chartData: [],
      now: null,
      oneDay: null,
      value: null,
      chartInterval: null,
      height: '100%',
      width: '100%',
      myChart: null
    }
  },
  watch: {
    componentData: function(newItems) {
      const devData = newItems[0]

      for (let index = 0; index < this.initMsgData.length; ++index) {
        const tagValue = this.initMsgData[index].TAG_VALUE
        this.options.series[index].data[0].value = parseFloat(devData[tagValue]).toFixed(3)
      }

      this.myChart.setOption(this.options, true)
    }
  },
  created () {
  },
  mounted () {
    // initialize
    this.init()

    this.myChart = echarts.init(document.getElementById(this.gaugeChart + this.locNo))
    this.myChart.setOption(this.options, true)
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
      let chartDiv = $('#' + this.gaugeChart + this.locNo)
      let height = ($(chartDiv).parent().parent().parent().parent().height() - 110)
      let width = $(chartDiv).width()
      $(chartDiv).css('height', height + 'px')

      // initial data

      for (let index = 0; index < this.initMsgData.length; ++index) {
        this.options.series.push({ ...this.devData })
      }

      for (let index = 0; index < this.initMsgData.length; ++index) {
        this.options.series[index].data = [{ value: 0, name: this.initMsgData[index].TITLE }]
        this.options.series[index].min = parseFloat(this.initMsgData[index].MIN).toFixed(3)
        this.options.series[index].max = parseFloat(this.initMsgData[index].MAX).toFixed(3)

        // 배치
        if (width >= height) {
          // 위치계산
          const x = 100 * (1 + index * 2) / (this.initMsgData.length * 2)
          this.options.series[index].center = [x + '%', '50%']
          // 반지름 계산
          this.options.series[index].radius = Math.min(width / height * 50, 100) + '%'
        } else {
          // 위치계산
          const y = 100 * (1 + index * 2) / (this.initMsgData.length * 2)
          this.options.series[index].center = ['50%', y + '%']
          // 반지름 계산
          this.options.series[index].radius = Math.min(height / width * 50, 100) + '%'
        }
      }

      console.log(this.options.series)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
