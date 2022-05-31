<template>
  <div class="pagination-wrap">
    <ul class="pagination">
      <li class="pg-ico first" :class="isFirstPage" @click="!isFirstPage && setPage(1)"><a>처음</a></li>
      <li class="pg-ico prev" :class="isFirstPage" @click="!isFirstPage && setPage(currentPage-1)"><a>이전</a></li>
      <li v-for="page in visiblePageArray" :key="page"
        :class="isCurrentPage(page)" @click="setPage(page)"><a>{{page}}</a></li>
      <li class="pg-ico next" :class="isLastPage" @click="!isLastPage && setPage(currentPage+1)"><a>다음</a></li>
      <li class="pg-ico end" :class="isLastPage" @click="!isLastPage && setPage(totalPage)"><a>마지막</a></li>
    </ul>
    <select v-model="selectedRowCount" @change="setRowCount" class="ui-pg-selbox" role="listbox" title="Records per Page">
      <option v-for="(value, key, index) in rowCountArray"
        :key="index" :value="value" role="option">{{value}}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPage: {
      type: Number,
      required: true
    },
    rowCount: {
      type: Number,
      required: true
    },
    rowCountArray: {
      type: Array,
      required: false,
      default: function () {
        return [15, 30, 45, 100]
      }
    },
    onPaging: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      visiblePageArray: null,
      selectedPage: null,
      selectedRowCount: null
    }
  },
  computed: {
    isFirstPage () {
      return this.selectedPage === 1 ? 'disabled' : ''
    },
    isLastPage () {
      return this.selectedPage === this.totalPage || this.totalPage <= 1 ? 'disabled' : ''
    },
    getVisiblePageArray () {
      let visiblePageArray = []
      // 현재 페이지가 3페이지 이하인경우
      // ①2345 1②345 12③45 인 경우
      if (this.selectedPage <= 3) {
        for (let a = 1; a <= this.totalPage && a <= 5; a++) {
          visiblePageArray.push(a)
        }
      // 마지막 페이지 부분인경우
      // 678⑨10 6789⑩ 인 경우
      } else if (this.totalPage >= 4 && this.totalPage - 2 < this.selectedPage) {
        for (let a = this.totalPage - (this.totalPage === 4 ? 3 : 4); a <= this.totalPage; a++) {
          visiblePageArray.push(a)
        }
      // 그외 다른 모든 페이징
      } else {
        for (let a = this.selectedPage - 2; a <= this.selectedPage + 2; a++) {
          visiblePageArray.push(a)
        }
      }
      return visiblePageArray
    }
  },
  watch: {
    totalPage (val) { // totalPage 값이 변경되면 pageList 재 셋팅 해줘야 함
      this.setVisiblePage()
    },
    currentPage (val) {
      this.setPage(val)
    }
  },
  mounted () {
    this.selectedPage = this.currentPage
    this.selectedRowCount = this.rowCount
    this.setVisiblePage()
  },
  methods: {
    setVisiblePage () {
      this.visiblePageArray = this.getVisiblePageArray
    },
    isCurrentPage (page) {
      return page === this.selectedPage ? 'active' : null
    },
    triggerEvent () {
      this.$emit('update:currentPage', this.selectedPage)
      this.$emit('update:rowCount', this.selectedRowCount)
      this.onPaging()
    },
    setRowCount() {
      this.selectedPage = 1
      this.triggerEvent()
    },
    setPage (page) {
      this.selectedPage = page
      this.setVisiblePage()
      this.triggerEvent()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
