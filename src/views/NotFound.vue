<template>
  <div class="lg:w-2/3 xl:w-2/3 m-auto my-10 md:my-20 lg:my-20 xl:my-20 px-2">
   <p id="header" class="text-center my-10 text-base md:text-xl word-keep">서비스 이용에 불편을 드려 죄송합니다.<br>요청하신 페이지를 찾을 수 없습니다.</p>
   <br>
   <p class="text-center my-10 text-base md:text-xl word-keep">
     요청하신 페이지의 주소가 잘못 입력되었거나,<br><br>
     페이지 주소의 변경 혹은 삭제로 인해 현재 사용하실 수 없습니다.<br><br>
     입력하신 페이지의 주소가 정확한지 다시 한번 확인 해주시기 바랍니다.
   </p>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  components: {
  },
  props: {
  },
  data () {
    return {
    }
  },
  created () {
  },
  mounted () {
  },
  computed: {},
  methods: {
  }
}
</script>

<style lang="less" scoped>
.word-keep {
  word-break: keep-all;
}
#header {
  font-weight: bold;
  font-size: 26px;
}
</style>
