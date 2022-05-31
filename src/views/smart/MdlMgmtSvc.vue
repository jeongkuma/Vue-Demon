<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <select
            id="selectedValue"
            class="form-control"
            v-model="selectedValue"
            @change="fnSearchValChk()"
          >
            <option
              v-for="item in searchOpt"
              :key="item.optVal"
              :value="item.optVal"
              >{{ item.optName }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <input
            type="text"
            class="form-control"
            v-model="retrieveValue"
            @keyup.enter="fnSearchList()"
            :readonly="selectedValue == 'all'"
          />
        </div>
        <div class="form-group">
          <button
            class="btn btn-info input-group-addon"
            type="button"
            @click="fnSearchList()"
          >
            {{ $t('search') }}
          </button>
          <button
            class="btn btn-info"
            type="button"
            @click="fnInitSchBoxList()"
          >
            {{ $t('initializing') }}
          </button>
        </div>
      </div>
    </div>
    <div class="text-left float-left pt-3 pl-2"></div>
    <div class="mb-2 text-right">
      <button
        type="button"
        class="btn btn-pink"
        data-toggle="modal"
        data-target="#modal-write"
        @click="addPopup()"
      >
        {{ $t('registration') }}
      </button>
      <button
        type="button"
        class="btn btn-gray"
        data-toggle="modal"
        data-target="#modal-write"
        @click="delPopup()"
      >
        {{ $t('delete') }}
      </button>
      <!-- <button type="button" class="btn btn-gray ">{{$t('delete')}}</button> -->
    </div>
    <jqgrid
      ref="grid"
      name="mdlMgmtSvc"
      :colModels="colModelList"
      :colNames="colNameList"
      :dataList="dataList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      :multiselect="true"
      @onCellSelect="modifyPopup"
      @getDataList="fnGetList"
    ></jqgrid>
  </div>
</template>

<script>
import { requestApi } from '@/api/ccp/requestApi'
import Cookies from 'js-cookie'
import Jqgrid from '@/components/Jqgrid'

export default {
  name: 'MdlMgmtSvc',
  components: {
    Jqgrid
  },
  props: {},
  data() {
    return {
      dataList: [],
      colNameList: [
        this.$t('row-num'),
        '서버키값(숨김)',
        this.$t('mdlMtMdlNm'),
        this.$t('mdlMtServNm'),
        this.$t('mdlMtMdlId'),
        this.$t('mdlMtMdlType'),
        this.$t('mdlMtConType'),
        this.$t('mdlMtConObj'),
        this.$t('mdlMtCycType'),
        this.$t('mdlMtCycVal'),
        this.$t('mdlMtCycUnit')
      ],
      colModelList: [
        { name: 'seq', index: 'seq', hidden: true },
        { name: 'servSeq', index: 'servSeq', hidden: true },
        { name: 'mdlNm', index: 'mdlNm', align: 'left', width: '120px' },
        { name: 'serverNm', index: 'serverNm', align: 'left', width: '60px' },
        {
          name: 'mdlId',
          index: 'mdlId',
          align: 'left',
          cellattr: function(rowId, tv, rawObject, cm, rdata) {
            return 'style="width: 120px; word-break: break-word; -ms-word-wrap: break-word;"' /* 문자 여러줄로 */
          }
        },
        {
          name: 'mdlTypeNm',
          index: 'mdlTypeNm',
          align: 'center',
          width: '50px'
        },
        {
          name: 'conTypeNm',
          index: 'conTypeNm',
          align: 'center',
          width: '50px'
        },
        {
          name: 'conObj',
          index: 'conObj',
          align: 'left',
          cellattr: function(rowId, tv, rawObject, cm, rdata) {
            return 'style="width: 220px; word-break: break-word; -ms-word-wrap: break-word;"' /* 문자 여러줄로 */
          }
        },
        {
          name: 'cycTypeNm',
          index: 'cycTypeNm',
          align: 'center',
          width: '50px'
        },
        { name: 'cycVal', index: 'cycVal', align: 'center', width: '50px' },
        // { name: 'cycUnit', index: 'cycUnit', align: 'left' }
        {
          name: 'cycUnitNm',
          index: 'cycUnitNm',
          align: 'center',
          width: '50px'
        }
      ],
      retrieveValue: '',
      selectedValue: '',
      searchOpt: window.smartCodeInfo[Cookies.get('LOCALE')].mdlMgmtSearchOpt,
      modifyFlag: false,
      currentPage: 1,
      displayRowCount: 15,
      totPage: null,
      pageNum: null,
      langSetArr: [],
      langSet: '',
      pageInfo: [],
      xMid: 'P00303'
    }
  },
  created() {
    this.selectedValue = ''
    this.retrieveValue = ''
    this.langSet = Cookies.get('LOCALE')
    this.fnSearchList()
  },
  mounted() {},
  computed: {},
  methods: {
    fnSearchValChk() {
      if (this.selectedValue === '') {
        this.retrieveValue = ''
      }
    },
    fnInitSchBoxList() {
      this.selectedValue = ''
      this.retrieveValue = ''
      // this.fnGetList()
    },
    fnOnlyOneChk(rowid) {
      if ($('#ch' + rowid).prop('checked') === true) {
        $('#ch' + rowid).prop('checked', false)
      } else {
        // 체크활성시 모든체크 해제
        $('input[name="ch"]').prop('checked', false)
        $('#ch' + rowid).prop('checked', true)
      }
    },
    fnChkYN() {
      var res = 'N'
      var rowid = $('input[name="ch"]:checked').val()
      if (rowid !== undefined) {
        res = 'Y'
      }
      return res
    },
    fnSearchList() {
      // 검색시에 현재 페이지 설정
      this.currentPage = 1
      this.fnGetList()
    },
    fnCdChnCdNm(dataList) {
      var mdlMgmtMdlTypeOpt =
        window.smartCodeInfo[Cookies.get('LOCALE')].mdlMgmtMdlTypeOpt
      var mdlMgmtConTypeOpt =
        window.smartCodeInfo[Cookies.get('LOCALE')].mdlMgmtConTypeOpt
      var mdlMgmtCycTypeOpt =
        window.smartCodeInfo[Cookies.get('LOCALE')].mdlMgmtCycTypeOpt
      var mdlMgmtCycUnitOpt =
        window.smartCodeInfo[Cookies.get('LOCALE')].mdlMgmtCycUnitOpt

      dataList.forEach(rowData => {
        // rowData.mdlType = '1'
        mdlMgmtMdlTypeOpt.forEach(obj => {
          if (obj.optVal === rowData.mdlType) {
            rowData.mdlTypeNm = obj.optName
          }
        })
        mdlMgmtConTypeOpt.forEach(obj => {
          if (obj.optVal === rowData.conType) {
            rowData.conTypeNm = obj.optName
          }
        })
        mdlMgmtCycTypeOpt.forEach(obj => {
          if (obj.optVal === rowData.cycType) {
            rowData.cycTypeNm = obj.optName
          }
        })
        mdlMgmtCycUnitOpt.forEach(obj => {
          if (obj.optVal === rowData.cycUnit) {
            rowData.cycUnitNm = obj.optName
          }
        })
      })
      return dataList
    },
    fnGetList() {
      var reqData = {}
      // var local = this
      // 조회시에
      reqData.currentPage = this.currentPage
      reqData.displayRowCount = this.displayRowCount
      reqData.searchCon = this.selectedValue
      reqData.searchVal = this.retrieveValue
      reqData.langSet = this.langSet

      requestApi({
        // url: '/online/iotcmcd/retrieveIotCmCd',
        url: '/online/bscpmodel/getModelInfoList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.pageNum = res.data.page.page
          this.totPage = res.data.page.totPage
          this.pageInfo = res.data.page
          res.data.dataList = this.fnCdChnCdNm(res.data.dataList)
          // this.fnCdChnCdNm() // 코드->코드명으로 변경
          this.dataList = res.data.dataList
        }
      })
    },
    addPopup: _.throttle(
      function() {
        this.popup({
          component: () => import('@/views/smart/MdlMgmtAddSvc'),
          title: this.$t('mdlMgmt'),
          width: 'wide',
          height: '490',
          data: {
            obj: {
              seq: '',
              mdlNm: '',
              mdlId: '',
              servSeq: '',
              mdlType: '',
              conType: '',
              conObj: '',
              cycType: '',
              cycUnit: '',
              cycVal: '',
              reqColType: '',
              rsltColType: '',
              colleAplyYN: '',
              absyAplyYN: ''
            }
          },
          callback: data => {
            if (data !== 'dismiss') {
              this.fnGetList()
              // this.fnInitSchBoxList()
            }
          }
        })
      },
      1000,
      { trailing: false }
    ),
    modifyPopup: _.throttle(
      function(id, index, contents, event) {
        let object = this.dataList[id]
        this.popup({
          component: () => import('@/views/smart/MdlMgmtAddSvc'),
          title: this.$t('mdlMgmt'),
          width: 'wide',
          height: '700',
          data: {
            obj: {
              seq: object.seq,
              mdlNm: object.mdlNm,
              mdlId: object.mdlId,
              servSeq: object.servSeq,
              mdlType: object.mdlType,
              conType: object.conType,
              conObj: object.conObj,
              cycType: object.cycType,
              cycUnit: object.cycUnit,
              cycVal: object.cycVal,
              reqColType: object.reqColType,
              rsltColType: object.rsltColType,
              colleAplyYN: object.colleAplyYN,
              absyAplyYN: object.absyAplyYN
            }
          },
          callback: data => {
            if (data !== 'dismiss') {
              this.fnGetList()
            }
          }
        })
      },
      1000,
      { trailing: false }
    ),
    delPopup: _.throttle(
      function() {
        let rowIds = this.$refs.grid.getSelectionIndexs()
        if (rowIds.length === 0) {
          this.alert(this.$t('lead-check-role'), 'warning')
          return false
        }
        this.confirm(this.$t('delYn'), this.confirmDeleteAPI)
      },
      1000,
      { trailing: false }
    ),
    confirmDeleteAPI() {
      var reqData = {}
      reqData.seqList = []

      let rowIds = this.$refs.grid.getSelectionIndexs()
      rowIds.forEach(row => {
        reqData.seqList.push(this.dataList[row].seq)
      })

      requestApi({
        url: '/online/bscpmodel/deleteModelInfoList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('del-success'), 'success')
            this.fnGetList()
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
