<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('prog-name') }}</span>
          <div class="input-group">
            <input v-model="progNm" type="text" class="form-control" readonly />
            <button
              type="button"
              class="btn btn-gray"
              @click="addSearchPopup()"
            >
              {{ $t('search2') }}
            </button>
          </div>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('tmpl-gubun') }}</span>
          <select
            class="form-control"
            v-model="tmplGubun"
            @change="fnChgTmplGubun()"
          >
            <option
              v-for="item in tmplGubunList"
              v-bind:key="item.cdId"
              :value="item.cdId"
              >{{ item.cdNm }}</option
            >
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('template-name') }}</span>
          <input
            v-model="dataObj.tmplCdNm"
            type="text"
            class="form-control"
            maxlength="16"
          />
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('dev-cls') }}</span>
          <select
            class="form-control"
            v-model="dataObj.dev_cls"
            id="dev_cls_selectBox"
          >
            <option
              v-for="item in devClsList"
              v-bind:key="item.DEV_CLS_CD"
              :value="item.DEV_CLS_CD"
              >{{ item.DEV_CLS_NM }}</option
            >
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('charSet') }}</span>
          <select class="form-control" v-model="dataObj.langSet">
            <option
              v-for="item in charSetList"
              v-bind:key="item.cdId"
              :value="item.cdId"
              >{{ item.cdNm }}</option
            >
          </select>
        </div>
      </div>
      <div class="grid-container grid-scroll mt-3">
        <div class="table-wrap y-scroll" style="min-height: 390px">
          <table class="table table-col" style="min-width: 840px">
            <caption>
              {{
                $t('cmCdSearchSrv')
              }}
            </caption>
            <colgroup>
              <col style="width:150px" />
              <col style="width:150px" />
              <col style="width:80px" />
              <col style="width:100px" />
              <col style="width:80px" />
              <col style="width:80px" />
            </colgroup>
            <thead>
              <tr>
                <th v-for="text in tbColNameData" v-bind:key="text" scope="col">
                  {{ text }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in titleNameList" v-bind:key="item.name">
                <td class="text-left">
                  <input
                    v-model="titleNameList[idx]"
                    type="text"
                    class="form-control"
                  />
                </td>
                <td class="text-left">
                  <input
                    v-model="filedNameList[idx]"
                    type="text"
                    class="form-control"
                  />
                </td>
                <td class="text-left">
                  <input
                    v-model="widthList[idx]"
                    class="form-control"
                    type="number"
                    min="0"
                  />
                </td>
                <td class="text-left">
                  <select
                    class="form-control"
                    v-model="alignList[idx]"
                    id="dev_cls_selectBox"
                  >
                    <option
                      v-for="item in selectAlignList"
                      v-bind:key="item.value"
                      :value="item.value"
                      >{{ item.name }}</option
                    >
                  </select>
                </td>
                <td class="text-left">
                  <input
                    v-model="sortOrderList[idx]"
                    class="form-control"
                    type="number"
                    min="1"
                    @input="fnMaxOrdrChk(sortOrderList[idx], idx)"
                  />
                </td>
                <td>
                  <button
                    v-if="titleNameList.length == idx + 1"
                    class="btn"
                    type="button"
                    @click="addHeaderData(idx)"
                  >
                    <span class="glyphicon glyphicon-plus"></span>
                  </button>
                  <button
                    v-else
                    class="btn"
                    type="button"
                    @click="delHeaderData(idx)"
                  >
                    <span class="glyphicon glyphicon-minus"></span>
                  </button>
                  <button
                    v-if="
                      titleNameList.length > 1 &&
                        titleNameList.length == idx + 1
                    "
                    class="btn"
                    type="button"
                    @click="delHeaderData(idx)"
                  >
                    <span class="glyphicon glyphicon-minus"></span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button @click="submit()" type="button" class="btn btn-pink">
          {{ $t('registration') }}
        </button>
        <button
          @click="close()"
          type="button"
          class="btn btn-gray"
          data-dismiss="modal"
        >
          {{ $t('cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'TemplateMgmtAddSvc',
  components: {},
  props: {
    callback: {
      type: Function,
      required: true
    },
    close: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      dataObj: {
        progId: '',
        tmplCdId: '',
        tmplCdNm: '',
        colCnt: 0,
        dev_cls: '',
        langSet: '',
        colNameData: ''
      },
      tbColNameData: [
        this.$t('title-name'),
        this.$t('field-name'),
        this.$t('width'),
        this.$t('align'),
        this.$t('num'),
        ''
      ],
      dataList: [],
      charSetList: [],
      progNm: '',
      progSeq: '',
      RowNum: 0,
      devClsList: [],
      tmplGubun: 'GN00000138',
      titleNameList: [''],
      filedNameList: [''],
      alignList: ['center'],
      widthList: [''],
      sortOrderList: [1],
      tmplGubunList: [],
      defaultObj: { cdId: '', cdNm: this.$t('select') },
      colModelData: [],
      selectedFiles: null,
      tmplIdDuplChkFlag: false,
      selectAlignList: [
        { name: this.$t('select'), value: '' },
        { name: 'left', value: 'left' },
        { name: 'center', value: 'center' },
        { name: 'right', value: 'right' }
      ]
    }
  },
  created() {
    this.fnSearchCommon(
      this.fnAddTmplGubunList,
      '/online/iotcmcd/retrieveIotByParentCmCdOnly',
      'GN00000019'
    )
  },
  mounted() {},
  computed: {},
  methods: {
    fnMaxOrdrChk(data, index) {
      if (this.sortOrderList.length < data) {
        this.alert(
          this.sortOrderList.length + this.$t('maxValue-chk'),
          'warning'
        )
        this.sortOrderList[index] = 1
      }

      if (data !== '' && data < 1) {
        this.alert(0 + this.$t('minValue-chk'), 'warning')
        this.sortOrderList[index] = '1'
      }
    },
    addHeaderData() {
      this.titleNameList.push('')
      this.filedNameList.push('')
      this.alignList.push('center')
      this.widthList.push('')
      var pushNum = this.sortOrderList.length + 1
      this.sortOrderList.push(pushNum)
    },
    delHeaderData(index) {
      this.titleNameList.splice(index, 1)
      this.filedNameList.splice(index, 1)
      this.alignList.splice(index, 1)
      this.widthList.splice(index, 1)
      this.sortOrderList.splice(index, 1)

      for (var di = 0; di < this.sortOrderList.length; di++) {
        if (this.sortOrderList[di] > index) {
          this.sortOrderList[di] = this.sortOrderList[di] - 1
        }
      }
    },
    fnSetRowNum() {
      this.RowNum = Number(this.dataObj.colCnt)
      this.colModelData = []
      for (var i = 0; i < this.RowNum; i++) {
        var addObj = { name: '', index: '', align: '', width: '' }
        this.colModelData.push(addObj)
      }
    },
    fnChgTmplGubun() {
      this.dataObj.colCnt = 0
      this.RowNum = 0
      this.dataObj.langSet = ''
      this.dataObj.templateName = ''
      this.dataObj.headerNm = ''
      this.tmplRulImg = ''
    },
    fnDuplChk() {
      this.tmplIdDuplChkFlag = false
    },
    duplicationChk() {
      var reqData = {}
      reqData.tmplCdId = this.dataObj.tmplCdId
      requestApi({
        url: '/online/com/tmpl/duplicationCheckIotTmplId',
        headers: {
          'X-MID': 'P00072'
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(res.data.msg, 'success')
            this.tmplIdDuplChkFlag = true
          }
        }
      })
    },
    fnSearchCommon(callback, requesturl, parentCd) {
      var paramObj = {}
      paramObj.parentCdId = parentCd

      requestApi({
        url: requesturl,
        headers: {
          'X-MID': 'P00072'
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            callback(res.data)
          }
        }
      })
    },
    fnAddTmplGubunList(data) {
      this.tmplGubunList.push(this.defaultObj)
      for (var ai = 0; ai < data.length; ai++) {
        if (data[ai].cdId === 'GN00000138') {
          this.tmplGubunList.push(data[ai])
        }
      }
      this.fnSearchCommon(
        this.fnAddCharSetList,
        '/online/iotcmcd/retrieveIotByParentCmCdRuntime',
        'GN00000021'
      )
      //      this.fnSearchCommon(this.fnAddDevClsList, '/online/iotcmcd/retrieveIotByParentCmCdOnly', 'SD00000002')
    },
    fnAddDevClsList() {
      var paramObj = {}
      requestApi({
        url: '/online/iotsvc/retrieveIotCmCdForDevDlsCd',
        headers: {
          'X-MID': 'P00072'
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.devClsList = res.data
            // var allObj = { DEV_CLS_CD: 'all', DEV_CLS_NM: this.$t('all') }
            var defaultClsObj = {
              DEV_CLS_CD: '',
              DEV_CLS_NM: this.$t('select')
            }
            // this.devClsList.unshift(allObj)
            this.devClsList.unshift(defaultClsObj)
          }
        }
      })
    },
    fnAddCharSetList(data) {
      this.charSetList = data
      this.charSetList.unshift(this.defaultObj)
      this.fnAddDevClsList()
    },
    submit() {
      if (this.progNm === '' || this.tmplGubun === '') {
        this.alert(this.$t('inputReqValue'), 'warning')
      } else if (
        this.tmplGubun === 'GN00000138' &&
        (this.dataObj.langSet === '' || this.dataObj.dev_cls === '')
      ) {
        this.alert(this.$t('inputReqValue'), 'warning')
      } else if (!this.fnTitleChk()) {
        this.alert(this.$t('jqgrid-titleName-chk'), 'warning')
      } else if (!this.fnFiledChk()) {
        this.alert(this.$t('jqgrid-filedName-chk'), 'warning')
      } else if (!this.fnWidthChk()) {
        this.alert(this.$t('jqgrid-width-chk'), 'warning')
      } else if (!this.fnAlignChk()) {
        this.alert(this.$t('jqgrid-algin-chk'), 'warning')
      } else if (!this.fnOrderChk()) {
        this.alert(this.$t('jqgrid-order-chk'), 'warning')
      } else {
        this.confirm(this.$t('saveYn'), this.callServerInsertTmplAPI)
      }
      // } else if (!this.tmplIdDuplChkFlag) {
      //   this.alert(this.$t('tmplId-duplchk-msg'), 'warning')
    },
    fnTitleChk() {
      var titleChkFlag = true
      for (var it = 0; it < this.titleNameList.length; it++) {
        if (this.titleNameList[it] === '') {
          titleChkFlag = false
          break
        }
      }
      return titleChkFlag
    },
    fnFiledChk() {
      var filedChkFlag = true
      for (var it = 0; it < this.filedNameList.length; it++) {
        if (this.filedNameList[it] === '') {
          filedChkFlag = false
          break
        }
      }
      return filedChkFlag
    },
    fnWidthChk() {
      var widthChkFlag = true
      for (var iw = 0; iw < this.widthList.length; iw++) {
        if (this.widthList[iw] === '') {
          widthChkFlag = false
          break
        }
      }
      return widthChkFlag
    },
    fnAlignChk() {
      var alginChkFlag = true
      for (var ia = 0; ia < this.alignList.length; ia++) {
        if (this.alignList[ia] === '') {
          alginChkFlag = false
          break
        }
      }
      return alginChkFlag
    },
    fnOrderChk() {
      var orderChkFlag = true
      var io = 0
      for (io = 0; io < this.sortOrderList.length; io++) {
        if (this.sortOrderList[io] === '') {
          orderChkFlag = false
          break
        }
      }
      if (orderChkFlag) {
        for (io = 0; io < this.sortOrderList.length; io++) {
          var orderCnt = 0
          for (var i = 0; i < this.sortOrderList.length; i++) {
            if (io + 1 === (this.sortOrderList[i] *= 1)) {
              orderCnt++
            }
          }
          if (orderCnt > 1) {
            orderChkFlag = false
          }
        }
      }
      return orderChkFlag
    },
    lengthChk() {
      var chkLength = this.dataObj.colNameData.split(',')
      var lengthChkFlag = true
      if (chkLength.length !== this.colModelData.length) {
        lengthChkFlag = false
      }
      return lengthChkFlag
    },
    callServerInsertTmplAPI() {
      var target = document.getElementById('dev_cls_selectBox')
      var reqData = {}
      var modelData = []
      var sendJqgridDto = []
      var titleName = ''
      var orderList = []
      reqData.progSeq = this.progSeq
      reqData.colCnt = this.titleNameList.length
      reqData.tmplCdNm = this.dataObj.tmplCdNm
      reqData.tmplGubun = this.tmplGubun
      reqData.tmplCdId = this.dataObj.tmplCdId
      for (var j = 0; j < this.sortOrderList.length; j++) {
        for (var jj = 0; jj < this.sortOrderList.length; jj++) {
          if (j + 1 === this.sortOrderList[jj]) {
            var model = { name: '', index: '', align: '', width: '' }
            model.name = this.filedNameList[jj]
            model.index = this.filedNameList[jj]
            model.align = this.alignList[jj]
            model.width = this.widthList[jj]
            modelData.push(model)
            if (j === 0) {
              titleName = this.titleNameList[jj]
              orderList.push(this.sortOrderList[jj])
            } else {
              titleName = titleName + ', ' + this.titleNameList[jj]
              orderList.push(this.sortOrderList[jj])
            }
          }
        }
      }
      for (var i = 0; i < this.titleNameList.length; i++) {
        var colAddObj = {}
        colAddObj.devClsCdNm = target.options[target.selectedIndex].text
        colAddObj.devClsCd = this.dataObj.dev_cls
        colAddObj.colModelData = JSON.stringify(modelData[i])
        colAddObj.langSet = this.dataObj.langSet
        colAddObj.colNameData = titleName
        colAddObj.colOrder = orderList[i]
        sendJqgridDto.push(colAddObj)
      }
      reqData.tbIotTmplHdrJqgridList = sendJqgridDto
      requestApi({
        url: '/online/com/tmpl/insertIotJqGridTmpl',
        headers: {
          'X-MID': 'P00072'
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.callback()
            this.close()
            this.alert(this.$t('save-success'), 'success')
          }
        }
      })
    },
    addSearchPopup() {
      this.popup({
        component: () => import('@/views/env/program/SearchProg'),
        title: this.$t('prog-search'),
        width: '500',
        height: '500',
        data: {},
        callback: data => {
          this.progSeq = data.progSeq
          this.progNm = data.progNm
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
