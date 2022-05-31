<template>
  <div class="table-wrap y-scroll">
    <table class="table table-col">
      <!-- <colgroup>
        <col v-for="(item, idx) in initArray" v-bind:key="idx" :style="{width: item.WIDTH}">
      </colgroup>
      <thead>
      <tr>
        <th scope="col" v-for="(item, idx) in initArray" v-bind:key="idx" >{{item.TITLE}}</th>
      </tr>
      </thead> -->
      <tbody>
      <tr v-for="(item, idx) in initArray" :key="idx">
        <td class="text-center" style="background-color: #E9EEF3;font-weight: bold;">{{item.TITLE}}</td>
        <td class="text-center" >{{items[0][item.TAG_VALUE]}}</td>
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
  name: 'StatusChart',
  props: {
    locNo: {
      type: String
    },
    initMsg: {
      type: String
    },
    items: {
      type: Array
    }
  },
  data() {
    return {
      initArray: []
    }
  },
  mounted () {
    // initialize
    this.init()

    setTimeout(() => console.log(this.items), 5000)
  },
  methods: {
    init() {
      this.initArray = JSON.parse(this.initMsg)
      console.log(this.initArray)
    }
  }
}
</script>

<style scoped>

</style>
