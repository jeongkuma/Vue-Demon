<template>
  <div>
    <jqgrid
      ref="grid"
      name="sample"
      :colModels="colModels"
      :colNames="colNames"
      :dataList="dataList"
      :totalPage.sync="totalPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      @onCellSelect="onCellSelect"
      @getDataList="getDataList"
    >
    </jqgrid>

    <div class="mt-3">
      <button class="btn btn-pink" @click="getCheckRows">체크 항목 가져오기</button>
    </div>
  </div>
</template>

<script>
import Jqgrid from '@/components/Jqgrid'
import { requestApi } from '@/api/ccp/requestApi'

export default {
  name: 'SampleJqgrid',
  components: { Jqgrid },
  data() {
    return {
      colModels: [
        { name: 'svcCdNm', index: 'svcCdNm', align: 'center' },
        { name: 'ctn', index: 'ctn', align: 'center' },
        { name: 'devUname',
          index: 'devUname',
          cellattr: function(rowId, tv, rowObject, cm, rdata) {
            return 'style="word-break:break-all; text-align:center"'
          } },
        { name: 'statusNm', index: 'statusNm', align: 'center' },
        { name: 'usingNo', index: 'usingNo', align: 'center' },
        { name: 'instAddr', index: 'instAddr', align: 'left', cellattr: ' colspan=2' },
        { name: 'devClsCdNm', index: 'devClsCdNm', align: 'left' },
        { name: 'devMdlNm', index: 'devMdlNm', align: 'left' },
        { name: 'devUuid', index: 'devUuid', align: 'center' },
        { name: 'devBuildingType', index: 'devBuildingType', align: 'center' },
        { name: 'instNo', index: 'instNo', align: 'center' },
        { name: 'machineNo', index: 'machineNo', align: 'center' },
        { name: 'devRegiDt', index: 'devRegiDt', align: 'center' },
        { name: 'instDttm', index: 'instDttm', align: 'center' }
      ],
      colNames: [
        '서비스',
        this.$t('pin') + '(' + this.$t('ctn') + ')',
        this.$t('pin-nm'),
        this.$t('dev-status'),
        this.$t('using-no'),
        this.$t('inst-addr'),
        this.$t('dev-cls'),
        this.$t('dev-mdl'),
        this.$t('entityId'),
        this.$t('building-type'),
        this.$t('inst-no'),
        this.$t('machine-no'),
        this.$t('dev-regi-dt'),
        this.$t('dev-inst-dt')
      ],
      dataList: [],
      totalPage: 3,
      currentPage: 1,
      displayRowCount: 15
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      let searchData = {
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount,
        svcCd: 'SD00000600',
        devClsCd: 'all',
        devMdlCd: 'all'
      }

      requestApi({
        url: '/online/iotedev/retrieveIotEDev',
        headers: { 'X-MID': 'P00003' },
        method: 'post',
        data: searchData,
        callback: (res) => {
          this.dataList = res.data.dataList
          this.currentPage = res.data.page
          this.totalPage = res.data.totPage
        }
      })
    },
    // 체크된 row index 조회
    // index는 기존과 다르게 0부터 시작 되도록 적용
    getCheckRows() {
      let rowsIndex = this.$refs.grid.getSelectionIndexs()
      console.log(rowsIndex)
    },
    // cell click 시 호출됨
    onCellSelect(id, index, contents, event) {
      // id: rowIndex, index: colIndex, contents: cell contents, event
      console.log(id, index, contents, event)
    },
    // 선택 해제
    resetSelection() {
      this.$refs.grid.resetSelection()
    },
    // id 조회
    getDataIds() {
      let ids = this.$refs.grid.getDataIds()
      console.log(ids)
    },
    // 체크박스 특정 row만 제거
    removeChcekbox() {
      let rowId = 0
      this.$refs.grid.removeChcekbox(rowId)
    },
    // 전체선택 비활성화
    hideSelectAll() {
      this.$refs.grid.hideSelectAll()
    },
    // 그리드 데이터 조회
    getRowData() {
      let rowIdx = 0
      let rowData = this.$refs.grid.getRowData(rowIdx)
      console.log(rowData)
    },
    // 그리드 row 개수 조회
    getGridReccount() {
      let count = this.$refs.grid.getGridReccount()
      console.log(count)
    }

  }
}
</script>

<style></style>
