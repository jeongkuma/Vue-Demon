<template>
  <div ref="colorpicker" class="_color-picker" :class="{ disabled: disabled }">
    <span
      class="current-color"
      :style="'background-color: ' + colorValue"
      @click="togglePicker()"
    >
    </span>
    <span class="current-color-text">{{ colorValue }}</span>
    <chrome-picker
      :value="colors"
      @input="updateFromPicker"
      v-if="displayPicker"
    />
  </div>
</template>

<script>
import { Chrome } from 'vue-color'

export default {
  name: 'ColorPicker',
  components: {
    'chrome-picker': Chrome
  },
  props: {
    color: {
      type: String,
      default: '#000000'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      colors: {
        hex: '#000000'
      },
      colorValue: '',
      displayPicker: false
    }
  },
  mounted() {
    this.setColor(this.color || '#000000')
  },
  methods: {
    setColor(color) {
      this.updateColors(color)
      this.colorValue = color
    },
    updateColors(color) {
      if (color.slice(0, 1) === '#') {
        this.colors = {
          hex: color
        }
      } else if (color.slice(0, 4) === 'rgba') {
        let rgba = color.replace(/^rgba?\(|\s+|\)$/g, '').split(',')
        let hex =
          '#' +
          (
            (1 << 24) +
            (parseInt(rgba[0]) << 16) +
            (parseInt(rgba[1]) << 8) +
            parseInt(rgba[2])
          )
            .toString(16)
            .slice(1)
        this.colors = {
          hex: hex,
          a: rgba[3]
        }
      }
    },
    showPicker() {
      document.addEventListener('click', this.documentClick)
      this.displayPicker = true
    },
    hidePicker() {
      document.removeEventListener('click', this.documentClick)
      this.displayPicker = false
    },
    togglePicker() {
      if (this.disabled) {
        return
      }
      this.displayPicker ? this.hidePicker() : this.showPicker()
    },
    updateFromInput() {
      this.updateColors(this.colorValue)
    },
    updateFromPicker(color) {
      this.colors = color
      if (color.rgba.a === 1) {
        this.colorValue = color.hex
      } else {
        this.colorValue =
          'rgba(' +
          color.rgba.r +
          ', ' +
          color.rgba.g +
          ', ' +
          color.rgba.b +
          ', ' +
          color.rgba.a +
          ')'
      }
    },
    documentClick(e) {
      let el = this.$refs.colorpicker
      let target = e.target
      // colorPicker 가 닫히지 않은 상태에서 팝업이 닫히면 hide 할 필요가 없음
      if (!el || !target) {
        return
      }

      if (el !== target && !el.contains(target)) {
        this.hidePicker()
      }
    }
  },
  watch: {
    color(val) {
      this.setColor(val)
    },
    colorValue(val) {
      if (val) {
        this.updateColors(val)
        this.$emit('input', val)
        // document.body.style.background = val;
      }
    }
  }
}
</script>

<style scoped>
.vc-chrome {
  position: absolute;
  top: 35px;
  left: 50%;
  z-index: 10;
  transform: translateX(-50%);
}
._color-picker {
  position: relative;
  display: flex;
  align-items: center;
}
._color-picker.disabled {
  background-color: #eee;
  border-radius: 4px;
}
._color-picker .current-color {
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 1px solid #d4dce4;
  cursor: pointer;
  border-radius: 5px;
}
._color-picker.disabled .current-color {
  background: '#ffffff';
  cursor: not-allowed;
}
._color-picker .current-color-text {
  padding-left: 5px;
}
._color-picker.disabled .current-color-text {
  color: '#fafafa';
}
.disabled {
  cursor: not-allowed;
  color: transparent;
}
</style>
