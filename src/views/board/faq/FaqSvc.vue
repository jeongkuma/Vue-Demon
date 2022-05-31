 <template>
  <div>
    <div class="search-box">
      <div class="form-inline">
        <div class="form-group">
          <select v-model="searchType" class="form-control">
            <option value="all">{{ $t('all') }}</option>
            <option value="subject">{{ $t('title') }}</option>
            <option value="question">{{ $t('question') }}</option>
          </select>
        </div>
        <div class="form-group">
          <input
            v-model="inputValue"
            @keyup.enter="fnGetList"
            type="text"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('category') }}</span>
          <select v-model="categoryCdId" class="form-control">
            <option value="">{{ $t('all') }}</option>
            <option
              v-for="category in categoryList"
              :key="category.categoryCdId"
              :value="category.categoryCdId"
              >{{ category.categoryCdNm }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('duration-search') }}</span>
          <datetime-picker
            :isPair="true"
            :startDate.sync="startDate"
            :endDate.sync="endDate"
          ></datetime-picker>
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="fnSearch">
            {{ $t('search') }}
          </button>
          <button class="btn btn-info" type="button" @click="fnInitialize">
            {{ $t('initializing') }}
          </button>
        </div>
      </div>
    </div>
    <div class="mb-2 btn-wrap text-right">
      <button type="button" class="btn btn-pink" @click="fnShowAddPopup">
        {{ $t('create') }}
      </button>
      <button type="button" class="btn btn-gray" @click="fnDeleteConfirm">
        {{ $t('delete') }}
      </button>
    </div>

    <jqgrid
      ref="grid"
      name="faq"
      :colModels="colModelData"
      :colNames="colNameData"
      :dataList="faqList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      @onCellSelect="fnShowModifyPopup"
      @getDataList="fnGetList"
    ></jqgrid>
  </div>
</template>

<script>
import moment from 'moment'
import Jqgrid from '@/components/Jqgrid'
import DatetimePicker from '@/components/DatetimePicker'
import { requestApi } from '@/api/ccp/requestApi'

export default {
  name: 'FaqSvc',
  components: {
    Jqgrid,
    DatetimePicker
  },
  data() {
    return {
      xMid: 'P00033',
      searchType: 'all',
      inputValue: '',
      categoryCdId: '',
      startDate: null,
      endDate: null,
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      faqList: [],
      categoryList: [],
      colNameData: [
        this.$t('category'),
        this.$t('question'),
        this.$t('interest-question'),
        this.$t('regModDttm')
      ],
      colModelData: [
        {
          name: 'categoryCdNm',
          index: 'categoryCdNm',
          align: 'center',
          width: '50'
        },
        { name: 'question', index: 'question', align: 'left' },
        {
          name: 'interestYn',
          index: 'interestYn',
          align: 'center',
          width: '50'
        },
        { name: 'regDttm', index: 'regDttm', align: 'center' }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.fnInitDate()
    this.fnGetList()
  },
  methods: {
    fnInitDate() {
      this.startDate = moment()
        .subtract(3, 'months')
        .toDate()
      this.endDate = null
    },
    fnGetList() {
      let reqData = {
        parentCdId: 'GN00000009',
        displayRowCount: this.displayRowCount,
        currentPage: this.currentPage,
        categoryCdId: this.categoryCdId,
        searchStartDttm: this.startDate,
        searchEndDttm: this.endDate
      }

      if (this.inputValue) {
        if (this.searchType === 'all') {
          reqData.allSearch = this.inputValue
        } else if (this.searchType === 'subject') {
          reqData.subject = this.inputValue
        } else if (this.searchType === 'question') {
          reqData.question = this.inputValue
        }
      }

      if (!this.endDate) {
        reqData.searchEndDttm = '99991231'
      }

      requestApi({
        url: '/online/iotfaqboard/retrieveIotFaqBoardList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.faqList = res.data.boardList
          this.categoryList = res.data.categoryList
          this.totPage = res.data.page.totPage
          this.currentPage = res.data.page.page
        }
      })
    },
    fnSearch() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitialize() {
      this.searchType = 'all'
      this.inputValue = ''
      this.categoryCdId = ''
      this.fnInitDate()
    },
    fnShowAddPopup() {
      this.popup({
        component: () => import('@/views/board/faq/FaqAddSvc'),
        title: this.$t('faq-create'),
        width: '700',
        height: '639',
        data: {
          categoryList: this.categoryList
        },
        callback: data => {
          this.fnGetList()
        }
      })
    },
    fnDeleteConfirm() {
      let selectedIds = this.$refs.grid.getSelectionIndexs()
      if (selectedIds.length === 0) {
        this.alert(this.$t('board-delete-no-check'), 'warning')
        return
      }
      this.confirm(this.$t('board-delete-confirm'), this.fnDelete)
    },
    fnDelete() {
      let selectedIds = this.$refs.grid.getSelectionIndexs()
      let faqSeqList = []
      selectedIds.forEach(id => {
        let data = this.faqList[id]
        faqSeqList.push(data.faqSeq)
      })
      var reqData = {
        faqSeqList: faqSeqList
      }
      requestApi({
        url: '/online/iotfaqboard/deleteIotMultiFaqBoard',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.alert(this.$t('del-success'), 'success')
          this.fnGetList()
        }
      })
    },
    fnShowModifyPopup(id) {
      let faq = this.faqList[id]
      this.popup({
        component: () => import('@/views/board/faq/FaqModifySvc'),
        title: this.$t('faq-modify'),
        width: '700',
        height: '639',
        data: {
          faq: faq
        },
        callback: data => {
          this.fnGetList()
        }
      })
    }
  }
}
</script>

<style></style>
