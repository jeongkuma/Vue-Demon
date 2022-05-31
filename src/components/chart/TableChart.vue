<template>
  <div ref="wrap" class="table-wrap">
    <table class="table table-col" style="min-width: auto;">
      <colgroup>
        <col v-for="(item, idx) in initMsgData" :key="idx" :style="{width: item.WIDTH + 'px'}">
      </colgroup>
      <thead>
        <tr>
          <th scope="col" v-for="(item, idx) in initMsgData" :key="idx" >{{item.TITLE}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in componentData" :key="idx">
          <td class="text-center" v-for="(object, index) in initMsgData" :key="index">{{row[object.COLUMN_VALUE]}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// initMsg
// [{"TITLE":"장비유형","COLUMN_VALUE":"devClsCdNm","WIDTH":"25%"},
// {"TITLE":"사용","COLUMN_VALUE":"act","WIDTH":"25%"},
// {"TITLE":"정지","COLUMN_VALUE":"sus","WIDTH":"25%"},
// {"TITLE":"정지","COLUMN_VALUE":"can","WIDTH":"25%"}]
export default {
  name: 'TableChart',
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
    return {}
  },
  mounted () {
    // 높이 지정
    this.$refs.wrap.parentElement.style.overflow = 'auto'
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
