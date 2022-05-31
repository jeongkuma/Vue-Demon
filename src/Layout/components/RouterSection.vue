<template>
  <div>
<!--    <keep-alive v-if="!isLocal" :include="cachedViews">-->
<!--      <router-view :key="key"/>-->
<!--    </keep-alive>-->
<!--    <router-view v-else :key="key"/>-->
    <router-view :key="key"/>
  </div>
</template>

<script>
export default {
  name: 'RouterSection',
  computed: {
    cachedViews () {
      return this.$store.state.tagsView.cachedViews // FIXME 추후 캐싱 되도록 수정 예정
    },
    key () {
      return this.$route.fullPath
    },
    isLocal () {
      return process.env.NODE_ENV === 'development'
    }
  }
}
</script>

<style lang="less" scoped>

</style>
