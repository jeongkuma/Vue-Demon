<template>
  <div class="flex flex-col" style="height:100%">
    <div class="form-check flex-none">
      <label class="form-check-label"
        ><input class="form-check-input" type="checkbox" :value="value"/>{{
          title
        }}<span class="form-check-sign"></span
      ></label>
    </div>
    <div class="drop-area flex-1" v-if="view === true">
      <ul class="chart-list drag-element" style="height:100%">
        <li class="draggable" style="height:100%">
          <input type="radio" :name="id" :value="id" checked="checked" />
          <label :for="id" :class="id" style="height:100%">
            <div class="flex justify-center items-center" style="height:100%">
              <img
                :src="chartImagePath"
                alt=""
                width="80%"
                style="height: 125px"
              />
            </div>
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardChartImage',
  components: {},
  props: {
    id: {
      type: String
    },
    title: {
      type: String
    },
    view: {
      type: Boolean,
      required: true
    },
    value: {
      type: String
    },
    chartImagePath: {
      type: String
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
</style>
