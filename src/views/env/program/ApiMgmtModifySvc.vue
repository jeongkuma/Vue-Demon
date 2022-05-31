<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('api-name') }}</span>
          <div class="input-group">
            <input
              v-model="dataObj.apiNm"
              type="text"
              class="form-control"
              @input="fnDuplChk('N')"
              maxlength="16"
            />
            <button
              class="btn btn-gray input-group-addon"
              type="button"
              @click="duplicationChk('N')"
            >
              {{ $t('duplication-check') }}
            </button>
          </div>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('uri') }}</span>
          <div class="input-group">
            <input
              v-model="dataObj.apiUri"
              type="text"
              class="form-control"
              @input="fnDuplChk('U')"
              maxlength="256"
            />
            <button
              class="btn btn-gray input-group-addon"
              type="button"
              @click="duplicationChk('U')"
            >
              {{ $t('duplication-check') }}
            </button>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('server-gubun') }}</span>
          <select class="form-control" v-model="dataObj.serverGubun">
            <option
              v-for="item in serverList"
              :key="item.cdId"
              :value="item.cdId"
              >{{ item.cdNm }}</option
            >
          </select>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('tmpl-gubun') }}</span>
          <select class="form-control" v-model="dataObj.tmplGubun">
            <option
              v-for="item in tmplList"
              :key="item.cdId"
              :value="item.cdId"
              >{{ item.cdNm }}</option
            >
          </select>
        </div>
      </div>
      <div class="form-item">
        <span class="form-label w-40 lb-txt">{{ $t('description') }}</span>
        <input
          v-model="dataObj.apiDesc"
          type="text"
          class="form-control"
          maxlength="33"
        />
      </div>
      <div class="form-item">
        <span class="form-label w-40 lb-txt">{{ $t('header') }}</span>
        <div class="input-horizontal">
          <div class="flex flex-wrap">
            <div
              v-for="(headerList, idx) in requiredHeaderList"
              :key="headerList.headerValue"
              class="pt-1 pr-1"
            >
              <input
                v-model="requiredHeaderList[idx].headerName"
                type="text"
                readonly
                class="form-control"
              />
            </div>
          </div>
          <div
            v-for="(selectheaderList, idx) in selectHeaderList"
            :key="'selectHeader_' + idx"
            class="mt-1"
          >
            <div class="form-inline">
              <select
                v-model="selectHeaderList[idx].value"
                class="form-control"
                style="width: 180px"
              >
                <option
                  v-for="item in headerList"
                  :key="item.cdId"
                  :value="item.cdNm"
                  selected
                  >{{ item.cdNm }}</option
                >
              </select>
              <button
                v-if="selectHeaderList.length === idx + 1"
                class="btn"
                type="button"
                @click="addSelectheaderList(idx)"
              >
                <span class="glyphicon glyphicon-plus"></span>
              </button>
              <button
                v-if="selectHeaderList.length > 1"
                class="btn"
                type="button"
                @click="delSelectheaderList(idx)"
              >
                <span class="glyphicon glyphicon-minus"></span>
              </button>
            </div>
          </div>
          <div
            v-for="(textheaderList, idx) in textHeaderList"
            :key="'textHeader_' + idx"
            class="mt-1"
          >
            <div class="form-inline">
              <input
                v-model="textHeaderList[idx].value"
                type="text"
                class="form-control"
                maxlength="33"
              />
              <button
                v-if="textHeaderList.length == idx + 1"
                class="btn"
                type="button"
                @click="addTextheaderList(idx)"
              >
                <span class="glyphicon glyphicon-plus"></span>
              </button>
              <button
                v-if="textHeaderList.length > 1"
                class="btn"
                type="button"
                @click="delTextheaderList(idx)"
              >
                <span class="glyphicon glyphicon-minus"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item">
          <span class="form-label w-40 lb-txt">{{ $t('body') }}</span>
          <div class="input-horizontal">
            <div
              v-for="(body, idx) in bodyList"
              :key="'body_' + idx"
              class="form-inline mt-1"
            >
              <input
                v-model="bodyList[idx].value"
                type="text"
                class="form-control"
                maxlength="33"
              />
              <button
                v-if="bodyList.length == idx + 1"
                class="btn"
                type="button"
                @click="addBodyList(idx)"
              >
                <span class="glyphicon glyphicon-plus"></span>
              </button>
              <button
                v-if="bodyList.length > 1"
                class="btn"
                type="button"
                @click="delBodyList(idx)"
              >
                <span class="glyphicon glyphicon-minus"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button @click="submit()" type="button" class="btn btn-pink">
          {{ $t('modify') }}
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
  name: 'ApiMgmtModifySvc',
  components: {},
  props: {
    data: Object,
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
        apiNm: '',
        apiUri: '',
        serverGubun: '',
        tmplGubun: '',
        apiDesc: '',
        body: '',
        regUserId: '',
        modUserId: '',
        tbIotParamDTOList: []
      },
      requiredHeaderList: [
        { headerName: 'Content-Type', headerValue: 'Content-Type' },
        { headerName: 'X-APIVERSION', headerValue: 'X-APIVERSION' },
        { headerName: 'X-LOGKEY', headerValue: 'X-LOGKEY' },
        { headerName: 'X-CHANNEL', headerValue: 'X-CHANNEL' },
        { headerName: 'X-AUTH', headerValue: 'X-AUTH' },
        { headerName: 'X-VNAME', headerValue: 'X-VNAME' }
      ],
      headerList: [],
      serverList: [],
      tmplList: [],
      selectHeaderList: [],
      textHeaderList: [],
      bodyList: [],
      addHtml: '',
      apiNmDuplChkFlag: true,
      apiUriDuplChkFlag: true,
      orgApiNm: '',
      orgApiUri: ''
    }
  },
  created() {
    this.fnSearchCommon(this.fnAddServerList, 'GN00000008')
  },
  mounted() {},
  computed: {},
  methods: {
    fnDuplChk(gubun) {
      if (gubun === 'U') {
        this.apiUriDuplChkFlag = false
        var event = window.event
        // 숫자,영문,특수문자(_/) 허용
        this.dataObj.apiUri = event.target.value = event.target.value.replace(
          /[^a-zA-Z0-9_/]/g,
          ''
        )
      } else {
        this.apiNmDuplChkFlag = false
      }
    },
    duplicationChk(gubun) {
      if (gubun === 'U' && !this.dataObj.apiUri.startsWith('/')) {
        this.dataObj.apiUri = '/' + this.dataObj.apiUri
      }
      if (gubun === 'U' && this.orgApiUri === this.dataObj.apiUri) {
        this.alert(this.$t('useAble'), 'success')
        this.apiUriDuplChkFlag = true
      } else if (gubun === 'N' && this.orgApiNm === this.dataObj.apiNm) {
        this.alert(this.$t('useAble'), 'success')
        this.apiNmDuplChkFlag = true
      } else {
        // 입력값 체크
        var valTitle = ''
        var reqData = {}
        var requestApiUri = ''
        reqData = this.dataObj
        if (gubun === 'U') {
          requestApiUri = '/online/com/api/duplicationCheckIotApiUri'
          if (this.dataObj.apiUri.trim() === '') {
            valTitle = this.$t('uri-alert')
            this.alert(valTitle + this.$t('api-inputReqValue'), 'warning')
            return
          }
        } else {
          requestApiUri = '/online/com/api/duplicationCheckIotApiNm'
          if (this.dataObj.apiNm.trim() === '') {
            valTitle = this.$t('api-name-alert')
            this.alert(valTitle + this.$t('api-inputReqValue'), 'warning')
            return
          }
        }
        requestApi({
          url: requestApiUri,
          headers: {
            'X-MID': 'P00081'
          },
          method: 'post',
          data: reqData,
          callback: res => {
            var status = false
            if (res.result.status === '200' || res.result.status === '204') {
              status = true
            }
            if (gubun === 'U') {
              this.apiUriDuplChkFlag = false
            } else {
              this.apiNmDuplChkFlag = false
            }
            if (status) {
              this.alert(res.data.msg, 'success')
              if (gubun === 'U') {
                this.apiUriDuplChkFlag = true
              } else {
                this.apiNmDuplChkFlag = true
              }
            }
          }
        })
      }
    },
    addSelectheaderList() {
      this.selectHeaderList.push({ value: this.$t('select'), useYn: 'Y' })
    },
    addTextheaderList() {
      this.textHeaderList.push({ value: '', useYn: 'Y' })
    },
    addBodyList() {
      this.bodyList.push({ value: '', useYn: 'Y' })
    },
    delSelectheaderList(index) {
      this.selectHeaderList.splice(index, 1)
    },
    delTextheaderList(index) {
      this.textHeaderList.splice(index, 1)
    },
    delBodyList(index) {
      this.bodyList.splice(index, 1)
    },
    fnSearchCommon(callback, parentCd) {
      var paramObj = {}
      paramObj.parentCdId = parentCd

      requestApi({
        url: '/online/iotcmcd/retrieveIotByParentCmCdOnly',
        headers: {
          'X-MID': 'P00081'
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            callback(res)
          }
        }
      })
    },
    fnAddHeaderList(res) {
      var defaultObj = { cdId: '', cdNm: this.$t('select') }
      this.headerList = res.data
      this.headerList.unshift(defaultObj)
      // 템플릿구분 리스트 조회
      this.fnSearchCommon(this.fnAddTmplList, 'GN00000019')
    },
    fnAddServerList(res) {
      var defaultObj = { cdId: '', cdNm: this.$t('select') }
      this.serverList = res.data
      this.serverList.unshift(defaultObj)
      // HEADER리스트 조회
      this.fnSearchCommon(this.fnAddHeaderList, 'GN00000007')
    },
    fnAddTmplList(res) {
      var defaultObj = { cdId: '', cdNm: this.$t('select') }
      this.tmplList = res.data
      this.tmplList.unshift(defaultObj)
      this.fnSearchModifyData()
    },
    fnSearchModifyData() {
      var paramObj = {}
      paramObj.apiSeq = this.data.idx

      requestApi({
        url: '/online/com/api/getIotApiParam',
        headers: {
          'X-MID': 'P00081'
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.dataObj = res.data
            this.orgApiNm = this.dataObj.apiNm
            this.orgApiUri = this.dataObj.apiUri
            var di = 0
            for (di = 0; di < this.dataObj.tbIotParamDTOList.length; di++) {
              if (this.dataObj.tbIotParamDTOList[di].paramGubun === 'B') {
                var bodyAddObj = {
                  value: this.dataObj.tbIotParamDTOList[di].paramKey,
                  useYn: 'Y'
                }
                this.bodyList.push(bodyAddObj)
              }
              if (this.dataObj.tbIotParamDTOList[di].paramGubun === 'HS') {
                var HeaderSearchAddObj = {
                  value: this.dataObj.tbIotParamDTOList[di].paramKey,
                  useYn: 'Y'
                }
                this.selectHeaderList.push(HeaderSearchAddObj)
              }
              if (this.dataObj.tbIotParamDTOList[di].paramGubun === 'HT') {
                var hearderTextAddObj = {
                  value: this.dataObj.tbIotParamDTOList[di].paramKey,
                  useYn: 'Y'
                }
                this.textHeaderList.push(hearderTextAddObj)
              }
            }

            if (this.bodyList.length === 0) {
              var bodydefaultObj = { value: '', useYn: 'Y' }
              this.bodyList.push(bodydefaultObj)
            }
            if (this.selectHeaderList.length === 0) {
              var selectHeaderdefaultObj = { value: '', useYn: 'Y' }
              this.selectHeaderList.push(selectHeaderdefaultObj)
            }
            if (this.textHeaderList.length === 0) {
              var textHeaderdefaultObj = { value: '', useYn: 'Y' }
              this.textHeaderList.push(textHeaderdefaultObj)
            }
          }
        }
      })
    },
    submit() {
      if (
        this.dataObj.apiNm.trim() === '' ||
        this.dataObj.apiUri.trim() === '' ||
        this.dataObj.serverGubun.trim() === '' ||
        this.dataObj.tmplGubun.trim() === ''
      ) {
        var valTitle = ''
        if (this.dataObj.apiNm.trim() === '') {
          valTitle = this.$t('api-name-alert')
        } else if (this.dataObj.apiUri.trim() === '') {
          valTitle = this.$t('uri-alert')
        } else if (this.dataObj.serverGubun.trim() === '') {
          valTitle = this.$t('server-gubun-alert')
        } else if (this.dataObj.tmplGubun.trim() === '') {
          valTitle = this.$t('tmpl-gubun-alert')
        }
        this.alert(valTitle + this.$t('api-inputReqValue'), 'warning')
      } else if (!this.apiNmDuplChkFlag) {
        this.alert(this.$t('apiNm-duplchk-msg'), 'warning')
      } else if (!this.apiUriDuplChkFlag) {
        this.alert(this.$t('apiUri-duplchk-msg'), 'warning')
      } else if (this.fnHeaderListChk('D')) {
        this.alert(this.$t('apiHeader-dupl-msg'), 'warning')
      } else if (this.fnBodyListChk('D')) {
        this.alert(this.$t('apiBody-dupl-msg'), 'warning')
        // }
      } else {
        this.confirm(this.$t('modifyYn'), this.fnCallModifyApi)
      }
    },
    fnHeaderListChk(gubun) {
      var duplicationChkFlagHeader = false
      var hi = 0
      var hj = 0
      // gubun === 'B' => 공백체크 / else('D') => 중복 체크
      if (gubun === 'D') {
        // selectHeader 중복 체크
        for (hi = 0; hi < this.selectHeaderList.length; hi++) {
          // selectHeader와 selectHeader 중복 체크
          if (this.selectHeaderList[hi].value !== '') {
            for (hj = hi + 1; hj < this.selectHeaderList.length; hj++) {
              if (
                this.selectHeaderList[hi].value ===
                this.selectHeaderList[hj].value
              ) {
                duplicationChkFlagHeader = true
                break
              }
            }
            if (duplicationChkFlagHeader) {
              break
            }
            // selectHeader와 requiredHeaderList 중복 체크
            for (hj = 0; hj < this.requiredHeaderList.length; hj++) {
              if (
                this.selectHeaderList[hi].value ===
                this.requiredHeaderList[hj].headerValue
              ) {
                duplicationChkFlagHeader = true
                break
              }
            }
            if (duplicationChkFlagHeader) {
              break
            }
          }
        }
        // textHeader 중복 체크
        for (hi = 0; hi < this.textHeaderList.length; hi++) {
          if (this.textHeaderList[hi].value !== '') {
            // textHeader와 textHeader 중복 체크
            for (hj = hi + 1; hj < this.textHeaderList.length; hj++) {
              if (
                this.textHeaderList[hi].value === this.textHeaderList[hj].value
              ) {
                duplicationChkFlagHeader = true
                break
              }
            }
            if (duplicationChkFlagHeader) {
              break
            }
            // textHeader와 selectHeaderList 중복 체크
            for (hj = 0; hj < this.selectHeaderList.length; hj++) {
              if (
                this.textHeaderList[hi].value ===
                this.selectHeaderList[hj].value
              ) {
                duplicationChkFlagHeader = true
                break
              }
            }
            if (duplicationChkFlagHeader) {
              break
            }
            // textHeader와 requiredHeaderList 중복 체크
            for (hj = 0; hj < this.requiredHeaderList.length; hj++) {
              if (
                this.textHeaderList[hi].value ===
                this.requiredHeaderList[hj].headerValue
              ) {
                duplicationChkFlagHeader = true
                break
              }
            }
            if (duplicationChkFlagHeader) {
              break
            }
          }
        }
      }
      return duplicationChkFlagHeader
    },
    fnBodyListChk(gubun) {
      var duplicationChkFlagBody = false
      var bi = 0
      var bj = 0
      if (gubun === 'B') {
        for (bi = 0; bi < this.bodyList.length; bi++) {
          if (this.bodyList[bi].value === '') {
            duplicationChkFlagBody = true
          }
        }
      } else {
        for (bi = 0; bi < this.bodyList.length; bi++) {
          for (bj = bi + 1; bj < this.bodyList.length; bj++) {
            if (this.bodyList[bi].value === this.bodyList[bj].value) {
              duplicationChkFlagBody = true
              break
            }
          }
          if (duplicationChkFlagBody) {
            break
          }
        }
      }
      return duplicationChkFlagBody
    },
    fnCallModifyApi() {
      var n = 0
      var i = 0
      var j = 0
      var k = 0
      var reqData = {}
      var sendObj = []
      var addObj = {}
      reqData.apiSeq = this.data.idx
      reqData.apiNm = this.dataObj.apiNm
      reqData.apiUri = this.dataObj.apiUri
      reqData.apiDesc = this.dataObj.apiDesc
      reqData.serverGubun = this.dataObj.serverGubun
      reqData.tmplGubun = this.dataObj.tmplGubun
      for (n = 0; n < this.selectHeaderList.length; n++) {
        if (this.selectHeaderList[n].value !== '') {
          addObj = {}
          addObj.apiSeq = this.data.idx
          addObj.paramGubun = 'HS'
          addObj.paramKey = this.selectHeaderList[n].value
          addObj.paramDesc = 'C'
          addObj.requiredYn = 'N'
          sendObj.push(addObj)
        }
      }
      for (i = 0; i < this.textHeaderList.length; i++) {
        if (this.textHeaderList[i].value !== '') {
          addObj = {}
          addObj.apiSeq = this.data.idx
          addObj.paramGubun = 'HT'
          addObj.requiredYn = 'N'
          addObj.paramDesc = ''
          addObj.paramKey = this.textHeaderList[i].value
          sendObj.push(addObj)
        }
      }
      for (j = 0; j < this.bodyList.length; j++) {
        addObj = {}
        addObj.apiSeq = this.data.idx
        addObj.paramGubun = 'B'
        addObj.requiredYn = 'N'
        addObj.paramDesc = ''
        addObj.paramKey = this.bodyList[j].value
        sendObj.push(addObj)
      }
      for (k = 0; k < this.requiredHeaderList.length; k++) {
        addObj = {}
        addObj.apiSeq = this.data.idx
        addObj.paramGubun = 'H'
        addObj.requiredYn = 'Y'
        addObj.paramDesc = ''
        addObj.paramKey = this.requiredHeaderList[k].headerValue
        sendObj.push(addObj)
      }
      reqData.tbIotParamDTOList = sendObj
      requestApi({
        url: '/online/com/api/updateIotApi',
        headers: {
          'X-MID': 'P00081'
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('modify-success'), 'success')
            this.callback()
            this.close()
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
