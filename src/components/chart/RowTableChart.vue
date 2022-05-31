<template>
  <div ref="wrap" class="table-wrap">
    <div>
      <table class="table table-col rowTableChart">
        <tbody>
          <tr v-for="(row, index) in initMsgData" :key="`row-${index}`">
            <td v-for="(value, key) in row" :key="`row-${index}-col-${key}`">
              <template v-if="key === 'TITLE'">{{ value }}</template>
              <template v-else>{{ componentData ? componentData[value] : '' }}</template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RowTableChart',
  props: {
    locNo: {
      type: String
    },
    initMsgData: {
      type: Array
    },
    componentData: {
      type: [Object, Array]
    }
  },
  data() {
    return {}
  },
  computed: {
    isArrayData() {
      return Array.isArray(this.componentData)
    }
  },
  mounted() {
    // 높이 지정
    this.$refs.wrap.parentElement.style.overflow = 'auto'
  },
  methods: {}
}
</script>

<style scoped>
.rowTableChart tr td:first-child {
  background-color: #e9eef3;
  font-weight: bold;
}
</style>
