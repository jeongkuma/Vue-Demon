<template>
  <div>
    <div id="contentsWrap">
      <div class="grid-container">
        <div class="faq-wrap">
          <div class="tit-wrap">
            <h4 class="titH4">{{$t('interest-question')}}</h4>
          </div>
          <div class="table-wrap">
            <table class="table table-col table-striped">
              <tbody>
                <tr v-for="interestFaq in faqInterestList" :key="interestFaq.faqSeq">
                  <td class="text-left">
                    <a
                      data-toggle="modal"
                      data-target="#modal-view"
                      @click="fnShowDetailPopup(interestFaq.faqSeq)"
                    >[{{interestFaq.categoryCdNm}}] {{interestFaq.question}}</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="search-box">
            <div class="form-inline">
              <div class="form-group">
                <span class="form-control-static">{{$t('category')}}</span>
                <select v-model="categoryCdId" class="form-control">
                  <option value="">{{$t('all')}}</option>
                  <option
                    v-for="category in categoryList"
                    :key="category.categoryCdId"
                    :value="category.categoryCdId"
                  >{{category.categoryCdNm}}</option>
                </select>
              </div>
              <div class="form-group">
                <input v-model="inputValue" type="text" class="form-control">
                <button
                  class="btn btn-info"
                  type="button"
                  @click="fnGetList()"
                >{{$t('search')}}</button>
                <button
                  class="btn btn-info"
                  type="button"
                  @click="fnInitialize()"
                >{{$t('initializing')}}</button>
              </div>
            </div>
          </div>
          <div class="table-wrap">
            <table class="table table-col table-striped">
              <tbody>
                <tr v-for="userFaq in faqUserList" :key="userFaq.faqSeq">
                  <td class="text-left">
                    <a
                      href="#"
                      data-toggle="modal"
                      data-target="#modal-view"
                      @click="fnShowDetailPopup(userFaq.faqSeq)"
                    >[{{userFaq.categoryCdNm}}] {{userFaq.question}}</a>
                  </td>
                </tr>
              </tbody>
            </table>
            <pagination
              :currentPage.sync="pageInfo.currentPage"
              :rowCount.sync="pageInfo.rowCount"
              :totalPage="pageInfo.totalPage"
              :onPaging="fnGetList"
              :rowCountArray="pageInfo.rowCountArray"
              ref="page"
            ></pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import Pagination from '@/components/Pagination'
export default {
  name: 'FaqSvc',
  components: {
    Pagination
  },
  data() {
    return {
      faqUserList: null,
      faqInterestList: null,
      categoryList: [],
      categoryCdId: '',
      inputValue: '',
      pageInfo: {
        currentPage: 1,
        totalPage: 10,
        rowCount: 15,
        rowCountArray: [15, 30, 45, 100]
      },
      pageEventTriggerCount: 0,
      xMid: 'P00022'
    }
  },
  created() {
    this.fnGetList()
  },
  mounted() {},
  methods: {
    fnInitialize() {
      this.fnInitCondition()
      this.pageInfo.currentPage = 1
    },
    fnInitCondition() {
      this.inputValue = null
      this.categoryCdId = this.categoryList[0].categoryCdId
    },
    fnGetList() {
      var reqData = {
        parentCdId: 'GN00000009',
        currentPage: this.pageInfo.currentPage,
        displayRowCount: this.pageInfo.rowCount
      }

      if (this.categoryCdId !== 'category') {
        reqData.categoryCdId = this.categoryCdId
      }
      if (this.inputValue !== null && this.inputValue !== '') {
        reqData.question = this.inputValue
      }
      requestApi({
        url: '/online/iotfaqboard/retrieveIotFaqBoardUser',
        headers: {
          'X-MID': this.xMid
        },
        data: reqData,
        callback: res => {
          this.categoryList = res.data.categoryList
          this.faqUserList = res.data.faqUserList
          this.faqInterestList = res.data.faqInterestList
          this.pageInfo.totalPage = res.data.page.totPage
        }
      })
    },
    fnShowDetailPopup(faqSeq) {
      this.popup({
        component: () => import('@/views/board/faq/FaqDetailSvc'),
        title: this.$t('faq-detail'),
        width: '700',
        height: '422',
        data: {
          faqSeq: faqSeq
        },
        callback: data => {
          if (data !== 'dismiss') {
            this.fnGetList()
            this.fnInitCondition()
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
</style>
