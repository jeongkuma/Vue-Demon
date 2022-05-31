<template>
  <!-- 펌프 - 이상현황 -->
  <div class="flex" style="height: 100%">
    <div class="flex-1" style="position: relative">
      <div style="width: 100%; height: 100%; position: absolute">
        <img
          src="assets/dashboard/sample/pump_img.png"
          style="width: 100%; height: 100%;"
        />
      </div>
      <div
        v-for="(value, index) in values"
        :key="`val-${index}`"
        class="stat-icon-pos"
        :style="positions[index]"
      >
        <span class="stat-icon" :class="{suc: value, det: !value}"></span>
      </div>
    </div>
    <div class="flex-none flex justify-center flex-col pl-1">
      <div class="py-1 flex items-center">
        <span class="stat-icon det"></span> 이상
      </div>
      <div class="py-1 flex items-center">
        <span class="stat-icon suc"></span> 정상
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PumpDetStatus',
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
      type: [Object, Array]
    }
  },
  data() {
    return {
      sortedMsgData: [],
      values: [],
      positions: [
        'top: 35%; left: 65%;',
        'top: 35%; left: 53%;',
        'top: 23%; left: 27%;',
        'top: 40%; left: 18%;',
        'top: 23%; left: 7%;'
      ]
    }
  },
  computed: {},
  watch: {
    componentData: {
      deep: true,
      handler(componentData) {
        if (!componentData) {
          return
        }
        this.getValues()
      }
    }
  },
  created() {
    this.sortedMsgData = this.initMsgData.sort((a, b) => a.NO - b.NO)
  },
  mounted() {
    this.$el.parentElement.style.overflow = 'auto'
    if (!this.componentData) {
      return
    }
    this.getValues()
  },
  methods: {
    getValues() {
      this.values = []
      this.sortedMsgData.forEach(d => {
        let data = this.componentData.find(c => String(c.entrDevSeq) === String(d.ENTR_DEV))
        if (data) {
          let dataObj = JSON.parse(data.dataObj)
          this.values.push(!dataObj[d.TAG_VALUE_BY_CLS])
        } else {
          this.values.push(true)
        }
      })
    }
  }
}
</script>

<style scoped>
.stat-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  margin-right: 5px;
  border-radius: 50%;
  background: #333;
  color: #000;
  font-weight: bold;
}
.stat-icon.det {
  background: #ffe500;
}
.stat-icon.suc {
  background: #009641;
}
.stat-icon.det::after {
  content: '?';
}
.stat-icon-pos {
  position: absolute;
  z-index: 1;
}
</style>
