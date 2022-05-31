<template>
  <!-- AI 비전검사 - 실시간 현황 -->
  <div>
    <div class="flex flex-wrap py-1 border-b-1 border-t-1">
      <div class="px-1 py-1"><b>양산라인</b> {{ item.ATTB_VL05 }}</div>
      <div class="px-1 py-1"><b>제품모델</b> {{ item.ATTB_VL07 }}</div>
      <div class="px-1 py-1"><b>검사항목</b> {{ item.ATTB_VL10 }}</div>
    </div>
    <div class="flex flex-wrap py-1 border-b-1 ">
      <div class="px-1 py-1">
        <b>부품 일련번호</b> {{ item.ATTB_VL09 }}
      </div>
      <div class="px-1 py-1"><b>검사시간</b> {{ item.ATTB_VL02 }}</div>
    </div>
    <div class="py-1">
      <div class="flex">
        <div class="flex-1">
          <div class="text-center py-1">
            {{ item.ATTB_VL10 }} 전면
            <b>{{ item.ATTB_VL11 }}</b>
          </div>
          <div class="text-center py-1">
            <img :src="item.ATTB_VL14" />
          </div>
        </div>
        <div class="flex-1">
          <div class="text-center py-1">
            {{ item.ATTB_VL10 }} 후면
            <b>{{ item.ATTB_VL11 }}</b>
          </div>
          <div class="text-center py-1">
            <img :src="item.ATTB_VL16" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AiRealTimeStatus',
  components: {},
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
      type: [Object]
    },
    searchOrg: {
      type: String
    }
  },
  data() {
    return {
      xMid: 'P00010',
      frontImage: null
    }
  },
  computed: {
    item() {
      return this.componentData || {}
    }
  },
  watch: {},
  created() {},
  mounted() {
    this.$el.parentElement.style.overflow = 'auto'
  },
  methods: {}
}
</script>

<style></style>
