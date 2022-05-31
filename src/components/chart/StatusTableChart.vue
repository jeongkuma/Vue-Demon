<template>
  <div ref="wrap" class="table-wrap" style="overflow-x:auto">
    <table class="table table-col" style="min-width: auto;">
      <colgroup>
        <col style="width: 80px" />
        <col
          v-for="(data, index) in componentData"
          :key="`data-col-${index}`"
          style="width: 90px;"
        />
      </colgroup>
      <thead>
        <tr v-if="initMsgDataTh">
          <th>{{ initMsgDataTh.TITLE }}</th>
          <th v-for="(data, index) in componentData" :key="`data-th-${index}`">
            {{ data[initMsgDataTh.COLUMN_VALUE] }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(td, index) in initMsgDataTd" :key="`data-td-${index}`">
          <td>{{ td.TITLE }}</td>
          <td
            v-for="(data, index) in componentData"
            :key="`data-th-${index}`"
            style="text-align: right;"
          >
            {{ data[td.COLUMN_VALUE] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'StatusTableChart',
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
  components: {},
  data() {
    return {}
  },
  computed: {
    initMsgDataTh() {
      if (!this.initMsgData || this.initMsgData.length === 0) {
        return null
      }
      return this.initMsgData[0]
    },
    initMsgDataTd() {
      if (!this.initMsgData || this.initMsgData.length < 2) {
        return []
      }
      return this.initMsgData.slice(1)
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style></style>
