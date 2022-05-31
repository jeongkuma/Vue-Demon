<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-8">
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
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-8">
          <span class="form-label w-40 lb-txt">{{ $t('tmpl-gubun') }}</span>
          <select
            class="form-control"
            v-model="tmplGubun"
            @change="fnChgTmplGubun(tmplGubun)"
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
        <div class="form-item col-sm-8">
          <span class="form-label w-40 lb-txt">{{ $t('template-name') }}</span>
          <input
            v-model="dataObj.tmplCdNm"
            type="text"
            class="form-control"
            maxlength="50"
          />
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-8">
          <span class="form-label w-40 lb-txt">{{ $t('tmpl-img') }}</span>
          <div class="input-file">
            <input
              type="file"
              id="tmplRuleImg"
              name="tmplRuleImg"
              class="file-upload"
              ref="tmplRuleImg"
              :placeholder="filePlaceHolder"
              @input="fnFileCheck()"
            />
          </div>
        </div>
      </div>
      <div v-if="visibleInitData" class="form-item">
        <span class="form-label w-40">init-data</span>
        <div class="form-box width-100">
          <textarea
            v-model="dataObj.initData"
            cols="30"
            rows="5"
            maxlength="3000"
          ></textarea>
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
import { requestMultipartJsonObject, requestApi } from '@/api/ccp/requestApi'
import getRequestFileArray from '@/utils/inputFile'

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
        charSet: '',
        colNameData: '',
        initData: ''
      },
      filePlaceHolder: this.$t('noRecords'),
      charSetList: [],
      progNm: '',
      progSeq: '',
      RowNum: 0,
      devClsList: [],
      tmplGubun: '',
      tmplGubunList: [],
      defaultObj: { cdId: '', cdNm: this.$t('select') },
      colModelData: [],
      selectedFiles: null,
      tmplIdDuplChkFlag: false,
      tmplRuleImg: null,
      fileTypeFlag: true
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
  computed: {
    visibleInitData() {
      // GN00000139 : 일반
      return (
        this.tmplGubun &&
        this.tmplGubun !== '' &&
        this.tmplGubun !== 'GN00000139'
      )
    }
  },
  methods: {
    fnFileCheck() {
      if (!/\.(jpg|bmp|ico|png)$/i.test(this.$refs.tmplRuleImg.value)) {
        if (this.$refs.tmplRuleImg.value !== '') {
          this.alert(this.$t('file-type-check'), 'warning')
          this.$refs.tmplRuleImg.value = null
          this.fileTypeFlag = false
        }
      } else {
        this.fileTypeFlag = true
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
      this.dataObj.charSet = ''
      this.dataObj.templateName = ''
      this.dataObj.headerNm = ''
      this.dataObj.initData = ''
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
          'X-MID': 'P00086'
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
          'X-MID': 'P00086'
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
        if (data[ai].cdId !== 'GN00000138') {
          this.tmplGubunList.push(data[ai])
        }
      }
    },
    submit() {
      if (this.progNm === '' || this.tmplGubun === '') {
        this.alert(this.$t('inputReqValue'), 'warning')
      } else if (
        this.tmplGubun === 'GN00000138' &&
        (this.dataObj.charSet === '' || this.dataObj.dev_cls === '')
      ) {
        this.alert(this.$t('inputReqValue'), 'warning')
      } else if (!this.lengthChk() && this.tmplGubun === 'GN00000138') {
        this.alert(this.$t('jqgrid-length-chk'), 'warning')
      } else {
        this.confirm(this.$t('saveYn'), this.callServerInsertTmplAPI)
      }
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
      var sendJqgridDto = []
      reqData.progSeq = this.progSeq
      reqData.colCnt = this.dataObj.colCnt
      reqData.tmplCdNm = this.dataObj.tmplCdNm
      reqData.tmplGubun = this.tmplGubun
      reqData.tmplCdId = this.dataObj.tmplCdId
      if (this.visibleInitData) {
        reqData.initData = this.dataObj.initData
      }
      for (var i = 0; i < this.colModelData.length; i++) {
        var colAddObj = {}
        colAddObj.devClsCdNm = target.options[target.selectedIndex].text
        colAddObj.devClsCd = this.dataObj.dev_cls
        colAddObj.colModelData = JSON.stringify(this.colModelData[i])
        colAddObj.charSet = this.dataObj.charSet
        colAddObj.colNameData = this.dataObj.colNameData
        sendJqgridDto.push(colAddObj)
      }
      reqData.tbIotTmplHdrJqgridList = sendJqgridDto
      requestMultipartJsonObject({
        url: '/online/com/tmpl/insertIotTmpl',
        headers: {
          'X-MID': 'P00086'
        },
        method: 'post',
        data: reqData,
        files: getRequestFileArray([this.$refs.tmplRuleImg]),
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

<style lang="less" scoped></style>
