<template>
  <div style="padding-top: 15px">
    <div class="mb-2 btn-wrap text-right">
      <button type="button" class="btn btn-pink" @click="fnRetvList()">{{$t('search')}}</button>
      <button type="button" class="btn btn-pink" @click="fnSvcAdd()" :disabled="!addFlag">{{$t('registration')}}</button>
      <button type="button" class="btn btn-pink" @click="fnSvcMapping()" :disabled="treeSelectChk">{{$t('dev-type-mapping')}}</button>
    </div>
    <div class="form-row">
      <div class="md-width-100 width-30 pr-2 md-p-0 mb-1">
        <div class="border-1">
          <div id="jstree" class="treebox"></div>
        </div>
      </div>
      <div class="md-width-100 width-70 pl-2 md-p-0">
        <div class="form-row row">
          <div class="form-item col-md-6">
            <span class="form-label w-44 lb-txt">{{$t('division')}}</span>
            <input v-model="dataObj.division" type="text" class="form-control" readonly v-if="!isNew">
          </div>
          <div class="form-item col-md-6">
            <span class="form-label w-44 lb-txt">{{$t('langSet')}}</span>
            <input v-if="langTxt == ''" type="text" class="form-control" readonly>
            <input v-else v-model="langTxt" type="text" class="form-control" readonly>
          </div>
        </div>
        <div class="form-row row">
          <div class="form-item col-md-6">
            <span class="form-label w-44 lb-txt">{{$t('service-code')}}</span>
            <input v-model="dataObj.cdId" type="text" class="form-control" readonly id="cdId">
          </div>
          <div class="form-item col-md-6">
            <span class="form-label w-44 lb-txt">{{$t('service-name')}}</span>
            <div class="input-group">
              <input v-model="dataObj.cdNm" type="text" class="form-control" @input="fnIdInputChk()" :readonly="isModifyTrue" maxlength="16">
              <button type="button" class="btn btn-gray btn-sm" @click="fnIdDuplChk()" :disabled="isModifyTrue">{{$t('duplication-check')}}</button>
            </div>
          </div>
        </div>
        <div class="form-row row">
          <div class="form-item col-md-6">
            <span class="form-label w-44 lb-txt">{{$t('useYn')}}</span>
            <select class="form-control " v-model="dataObj.useYn" :disabled="isModifyTrue">
              <option v-for="item in useOptList" v-bind:key="item.optVal" :value="item.optVal">{{item.optNm}}</option>
            </select>
          </div>
        </div>
        <div class="form-item">
          <span class="form-label w-44">{{$t('description')}}</span>
          <div class="width-100 form-box">
            <textarea v-model="dataObj.cdDesc" rows="2"  maxlength="85" id="cdDesc" :readonly="isModifyTrue"></textarea>
          </div>
        </div>

        <div v-show="svcType === 'dev'">
          <div class="form-row row">
            <div class="form-item col-md-6">
              <span class="form-label w-44">{{$t('default-icon')}}</span>
              <input v-if="isSaveNew" type="file" id="defaultIcon" name="defaultIcon" class="file-upload" ref="defaultIcon" :placeholder="filePlaceHolder" @input="fnFileCheck(1)">
              <span v-else class="form-file form-inline">
                <input v-if="!isDefIconExist" type="file" id="defaultIcon" name="defaultIcon" class="file-upload" ref="defaultIcon" @input="fnFileCheck(1)" :placeholder="filePlaceHolder">
                <span v-else>
                  <span>{{defIcon.orgFileName}}   [ {{defIcon.fileSizeLabel}} ]  </span>
                  <span class="form-data file-add" @click="fnLogoDownload(defIcon.fileListSeq)"><a href="#">{{$t('attach-file')}}</a></span>
                  <span v-on:click="fnFileDelete(defIcon.fileListSeq, 1)"><a href="#" class="btn ico-delete remove-field"></a></span>
                </span>
              </span>
            </div>
            <div class="form-item col-md-6">
              <span class="form-label w-44">{{$t('stop-icon')}}</span>
              <input v-if="isSaveNew" type="file" id="stopIcon" name="stopIcon" class="file-upload" ref="stopIcon" :placeholder="filePlaceHolder" @input="fnFileCheck(3)">
              <span v-else class="form-file form-inline">
                <input v-if="!isStpIconExist" type="file" id="stopIcon" name="stopIcon" class="file-upload" ref="stopIcon" @input="fnFileCheck(3)">
                <span v-else>
                  <span>{{stpIcon.orgFileName}}   [ {{stpIcon.fileSizeLabel}} ]  </span>
                  <span class="form-data file-add" @click="fnLogoDownload(stpIcon.fileListSeq)"><a href="#">{{$t('attach-file')}}</a></span>
                  <span v-on:click="fnFileDelete(stpIcon.fileListSeq, 3)"><a href="#" class="btn ico-delete remove-field"></a></span>
                </span>
              </span>
            </div>
          </div>
          <div class="form-row row">
            <div class="form-item col-md-6">
              <span class="form-label w-44">{{$t('error-icon')}}</span>
              <input v-if="isSaveNew" type="file" id="errorIcon" name="errorIcon" class="file-upload" ref="errorIcon" :placeholder="filePlaceHolder" @input="fnFileCheck(2)">
              <span v-else class="form-file">
                <input v-if="!isErrIconExist" type="file" id="errorIcon" name="errorIcon" class="file-upload" ref="errorIcon" @input="fnFileCheck(2)">
                <span v-else>
                  <span>{{errIcon.orgFileName}}   [ {{errIcon.fileSizeLabel}} ]  </span>
                  <span class="form-data file-add" @click="fnLogoDownload(errIcon.fileListSeq)"><a href="#">{{$t('attach-file')}}</a></span>
                  <span v-on:click="fnFileDelete(errIcon.fileListSeq, 2)"><a href="#" class="btn ico-delete remove-field"></a></span>
                </span>
              </span>
            </div>
            <div class="form-item col-md-6">
              <span class="form-label w-44">{{$t('multi-def-icon')}}</span>
              <input v-if="isSaveNew" type="file" id="multiIcon" name="multiIcon" class="file-upload" ref="multiIcon" :placeholder="filePlaceHolder" @input="fnFileCheck(7)">
              <span v-else class="form-file" >
                <input v-if="!isMultiIconExist" type="file" id="multiIcon" name="multiIcon" class="file-upload" ref="multiIcon" @input="fnFileCheck(7)">
                <span v-else>
                  <span>{{multiIcon.orgFileName}}   [ {{multiIcon.fileSizeLabel}} ]  </span>
                  <span class="form-data file-add" @click="fnLogoDownload(multiIcon.fileListSeq)"><a href="#">{{$t('attach-file')}}</a></span>
                  <span v-on:click="fnFileDelete(multiIcon.fileListSeq, 7)"><a href="#" class="btn ico-delete remove-field"></a></span>
                </span>
              </span>
            </div>
          </div>
          <div class="form-row row">
            <div class="form-item col-md-6">
              <span class="form-label w-44">{{$t('multi-err-icon')}}</span>
              <input v-if="isSaveNew" type="file" id="multiErrIcon" name="multiErrIcon" class="file-upload" ref="multiErrIcon" :placeholder="filePlaceHolder" @input="fnFileCheck(8)">
              <span v-else class="form-file">
                <input v-if="!isMultiErrIconExist" type="file" id="multiErrIcon" name="multiErrIcon" class="file-upload" ref="multiErrIcon" @input="fnFileCheck(8)">
                <span v-else>
                  <span>{{multiErrIcon.orgFileName}}   [ {{multiErrIcon.fileSizeLabel}} ]  </span>
                  <span class="form-data file-add" @click="fnLogoDownload(multiErrIcon.fileListSeq)"><a href="#">{{$t('attach-file')}}</a></span>
                  <span v-on:click="fnFileDelete(multiErrIcon.fileListSeq, 8)"><a href="#" class="btn ico-delete remove-field"></a></span>
                </span>
              </span>
            </div>
            <div class="form-item col-md-6">
              <span class="form-label w-44">{{$t('grp-default-icon')}}</span>
              <input v-if="isSaveNew" type="file" id="grpDefIcon" name="grpDefIcon" class="file-upload" ref="grpDefIcon" :placeholder="filePlaceHolder" @input="fnFileCheck(4)">
              <span v-else class="form-file">
                <input v-if="!isGrpDefIconExist"  type="file" id="grpDefIcon" name="grpDefIcon" class="file-upload" ref="grpDefIcon" @input="fnFileCheck(4)">
                <span v-else>
                  <span>{{grpDefIcon.orgFileName}}   [ {{grpDefIcon.fileSizeLabel}} ]  </span>
                  <span class="form-data file-add" @click="fnLogoDownload(grpDefIcon.fileListSeq)"><a href="#">{{$t('attach-file')}}</a></span>
                  <span v-on:click="fnFileDelete(grpDefIcon.fileListSeq, 4)"><a href="#" class="btn ico-delete remove-field"></a></span>
                </span>
              </span>
            </div>
          </div>
          <div class="form-row row">
            <div class="form-item col-md-6">
              <span class="form-label w-44">{{$t('grp-stop-icon')}}</span>
              <input v-if="isSaveNew" type="file" id="grpStpIcon" name="grpStpIcon" class="file-upload" ref="grpStpIcon" :placeholder="filePlaceHolder" @input="fnFileCheck(5)">
              <span v-else class="form-file">
                <input v-if="!isGrpStpIconExist" type="file" id="grpStpIcon" name="grpStpIcon" class="file-upload" ref="grpStpIcon" @input="fnFileCheck(5)">
                <span v-else>
                  <span>{{grpStpIcon.orgFileName}}   [ {{grpStpIcon.fileSizeLabel}} ]  </span>
                  <span class="form-data file-add" @click="fnLogoDownload(grpStpIcon.fileListSeq)"><a href="#">{{$t('attach-file')}}</a></span>
                  <span v-on:click="fnFileDelete(grpStpIcon.fileListSeq, 5)"><a href="#" class="btn ico-delete remove-field"></a></span>
                </span>
              </span>
            </div>
            <div class="form-item col-md-6">
              <span class="form-label w-44">{{$t('grp-error-icon')}}</span>
              <input v-if="isSaveNew" type="file" id="grpErrIcon" name="grpErrIcon" class="file-upload" ref="grpErrIcon" :placeholder="filePlaceHolder" @input="fnFileCheck(6)">
              <span v-else class="form-file">
                <input v-if="!isGrpErrIconExist" type="file" id="grpErrIcon" name="grpErrIcon" class="file-upload" ref="grpErrIcon" @input="fnFileCheck(6)">
                <span v-else>
                  <span>{{grpErrIcon.orgFileName}}   [ {{grpErrIcon.fileSizeLabel}} ]  </span>
                  <span class="form-data file-add" @click="fnLogoDownload(grpErrIcon.fileListSeq)"><a href="#">{{$t('attach-file')}}</a></span>
                  <span v-on:click="fnFileDelete(grpErrIcon.fileListSeq, 6)"><a href="#" class="btn ico-delete remove-field"></a></span>
                </span>
              </span>
            </div>
          </div>
        </div>
        <div v-show="svcType === 'dev'"><label>&nbsp;&nbsp; {{$t('file-type-check')}}</label></div>
        <div class="text-right mt-3">
          <button @click="submit()" type="button" class="btn btn-pink" :disabled="isModifyTrue">{{savaBtnText}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { requestMultipartJsonObject, requestApi, requestDownloadApi } from '@/api/ccp/requestApi'
import getRequestFileArray from '@/utils/inputFile'
import Cookies from 'js-cookie'

export default {
  name: 'svc-mgmt',
  components: {
  },
  props: {
  },
  data () {
    return {
      svcTreeData: [],
      dataObj: { division: '', desc: '', useYn: '', cdNm: '', cdId: '', cdDesc: '' },
      useOptList: [
        { optNm: this.$t('use'), optVal: 'Y' },
        { optNm: this.$t('use-no'), optVal: 'N' },
        { optNm: this.$t('test'), optVal: 'T' }
      ],
      typeList: [
        { optNm: this.$t('service'), optVal: 'svc' },
        { optNm: this.$t('terminal-type'), optVal: 'dev' }
      ],
      devCdObject: { firstCdId: 'SD00000000', svcCdid: 'SD00000002', lvl: 1 },
      svcCdObject: { firstCdId: 'SD00000000', svcCdid: 'SD00000001', lvl: 1 },
      cdNmDuplChkFlag: false,
      langSetArr: [],
      langSet: null,
      cdIdDuplChkFlag: false,
      langSetCd: 'GN00000021',
      langSetListAPI: '/online/iotcmcd/retrieveIotByParentCmCd',
      retrieveSvcListAPI: '/online/iotsvc/retrieveIotSvc',
      retrieveIotSvcBySeqAPI: '/online/iotsvc/retrieveIotSvcBySeq',
      retrieveIotCmCdByCdIdAPI: '/online/iotcmcd/retrieveIotCmCdByCdId',
      retrieveIotMaxOrderAPI: '/online/iotcmcd/retrieveIotMaxOrder',
      updateIotCmCdAPI: '/online/iotcmcd/updateIotCmCd',
      createIotCmCdAPI: '/online/iotcmcd/createIotCmCd',
      createIotSvcAPI: '/online/iotsvc/createIotSvc',
      parentSvcSeq: null,
      svcDivision: null,
      isNew: false,
      treeSelectChk: true,
      isModifyTrue: true,
      isParentSelected: false,
      addFlag: false,
      svcType: '',
      filePlaceHolder: this.$t('file-type-check'),
      fileTypeFlag: true,
      isSaveNew: false,
      selfCdId: null,
      treeLength: 0,
      isDefIconExist: false,
      isStpIconExist: false,
      isErrIconExist: false,
      isMultiIconExist: false,
      isMultiErrIconExist: false,
      isGrpDefIconExist: false,
      isGrpStpIconExist: false,
      isGrpErrIconExist: false,
      defIcon: {},
      stpIcon: {},
      errIcon: {},
      multiIcon: {},
      multiErrIcon: {},
      grpDefIcon: {},
      grpStpIcon: {},
      grpErrIcon: {},
      delFileSeqList: [],
      deleteCdList: [],
      savaBtnText: '',
      langTxt: '',
      addItemFlag: false
    }
  },
  created () {
    this.savaBtnText = this.$t('save')
    this.fnCallAPI(this.retrieveSvcListAPI, { 'langSet': Cookies.get('LOCALE') }, 1)
  },
  mounted () {
    var local = this
    $('#jstree').on('select_node.jstree', function(e, data) {
      // local.langSet = Cookies.get('LOCALE')
      local.langTxt = ''
      local.isNew = false
      local.isSaveNew = false
      local.savaBtnText = local.$t('modify')
      local.treeLength = data.node.parents.length
      if (data.node.parents.length !== 1) {
        local.cdNmDuplChkFlag = true
        local.cdIdDuplChkFlag = true
        if (data.node.parents.length !== 3) {
          local.addFlag = true
          local.treeSelectChk = false
          local.svcType = 'srv'
        } else {
          local.svcType = 'dev'
          local.addFlag = false
          local.treeSelectChk = true
        }
        var val = data.node.id
        local.isParentSelected = true
        local.isModifyTrue = false
        local.parentSvcSeq = val
        local.selfCdId = data.node.data.selfSeq
        local.fnSvcInfo(val)
      } else {
        local.svcType = 'srv'
        local.svcDivision = local.$t('service')
        local.addFlag = true
        local.isModifyTrue = true
        local.treeSelectChk = true
        let tmpLang = local.dataObj.langSet
        local.dataObj = {}
        local.dataObj.langSet = tmpLang
      }
    })
  },
  computed: {},
  beforeDestroy () {
    // 트리 캐시 삭제
    $('#jstree').jstree('destroy')
  },
  methods: {
    fnRetvList() {
      requestApi({
        url: this.retrieveSvcListAPI,
        headers: {
          'X-MID': 'P00055'
        },
        method: 'post',
        data: { langSet: this.dataObj.langSet },
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            $('#jstree').data('jstree', false).empty()
            this.svcTreeData = res.data
            this.fnMakeTree()
            this.addFlag = false
            this.fnInitImgBox()
            this.fnInitFileObj()
            let tmpLang = this.dataObj.langSet
            this.dataObj = {}
            this.dataObj.langSet = tmpLang
            this.langTxt = ''
            this.isModifyTrue = true
            this.isSaveNew = false
            this.treeSelectChk = false
          }
        }
      })
    },
    fnChgLang() {
      this.langSetArr.forEach(obj => {
        if (obj.cdId === this.dataObj.langSet) {
          if (this.isSaveNew) {
            if (!this.addItemFlag) {
              this.langTxt = obj.cdNm
            } else {
              this.langTxt = ''
              this.addItemFlag = false
            }
          } else {
            if (this.dataObj.langSet === undefined || this.dataObj.langSet === null || this.dataObj.langSet === '') {
              this.langTxt = ''
            }
          }
        }
      })
    },
    fnFileDuplCheck() {
      var fileChkObj = {}
      fileChkObj.defIconNm = this.defIcon.orgFileName === undefined ? $('#defaultIcon').val() === '' ? '' : $('#defaultIcon').val().split('\\')[$('#defaultIcon').val().split('\\').length - 1] : this.defIcon.orgFileName
      fileChkObj.stpIconNm = this.stpIcon.orgFileName === undefined ? $('#stopIcon').val() === '' ? '' : $('#stopIcon').val().split('\\')[$('#stopIcon').val().split('\\').length - 1] : this.stpIcon.orgFileName
      fileChkObj.errIconNm = this.errIcon.orgFileName === undefined ? $('#errorIcon').val() === '' ? '' : $('#errorIcon').val().split('\\')[$('#errorIcon').val().split('\\').length - 1] : this.errIcon.orgFileName
      fileChkObj.multiIcon = this.multiIcon.orgFileName === undefined ? $('#multiIcon').val() === '' ? '' : $('#multiIcon').val().split('\\')[$('#multiIcon').val().split('\\').length - 1] : this.multiIcon.orgFileName
      fileChkObj.multiErrIcon = this.multiErrIcon.orgFileName === undefined ? $('#multiErrIcon').val() === '' ? '' : $('#multiErrIcon').val().split('\\')[$('#multiErrIcon').val().split('\\').length - 1] : this.multiErrIcon.orgFileName
      fileChkObj.grpDefIconNm = this.grpDefIcon.orgFileName === undefined ? $('#grpDefIcon').val() === '' ? '' : $('#grpDefIcon').val().split('\\')[$('#grpDefIcon').val().split('\\').length - 1] : this.grpDefIcon.orgFileName
      fileChkObj.grpStpIconNm = this.grpStpIcon.orgFileName === undefined ? $('#grpStpIcon').val() === '' ? '' : $('#grpStpIcon').val().split('\\')[$('#grpStpIcon').val().split('\\').length - 1] : this.grpStpIcon.orgFileName
      fileChkObj.grpErrIconNm = this.grpErrIcon.orgFileName === undefined ? $('#grpErrIcon').val() === '' ? '' : $('#grpErrIcon').val().split('\\')[$('#grpErrIcon').val().split('\\').length - 1] : this.grpErrIcon.orgFileName

      var fileLength = 0
      var fileNmList = []
      for (var key in fileChkObj) {
        fileLength++
        fileNmList.push(fileChkObj[key])
      }
      var returnVal = true

      for (var i = 0; i < fileLength; i++) {
        var tmpNm = fileNmList[i]
        if (tmpNm !== '') {
          for (var j = 0; j < fileLength; j++) {
            if (i !== j) {
              var eachFile = fileNmList[j]
              if (tmpNm === eachFile) {
                returnVal = false
                return false
              }
            }
          }
        }
        if (returnVal === false) return
      }
      return returnVal
    },
    fnInitFileObj () {
      $('#stopIcon').val('')
      $('#defaultIcon').val('')
      $('#errorIcon').val('')
      $('#multiIcon').val('')
      $('#multiErrIcon').val('')
      $('#grpStpIcon').val('')
      $('#grpDefIcon').val('')
      $('#grpErrIcon').val('')
    },
    fnLogoDownload(fileSeq) {
      var reqData = {}
      reqData.fileListSeq = fileSeq
      requestDownloadApi({
        url: '/online/iotsvc/downloadImage', // required
        headers: { // required
          'X-MID': 'P00055'
        },
        callback: (data) => { // required
        },
        data: reqData
      })
    },
    // division -> 1: 기본이미지, 2: 에러이미지, 3: 정지이미지, 4: 그룹정상아이콘, 5: 그룹정지아이콘, 6:그룹이상아이콘, 7:멀티아이콘
    fnFileDelete (fileSeq, division) {
      let deleteCd = null
      if (division === 1) {
        this.defIcon = {}
        deleteCd = 'defIcon'
        this.isDefIconExist = false
      } else if (division === 2) {
        this.errIcon = {}
        deleteCd = 'errIcon'
        this.isErrIconExist = false
      } else if (division === 3) {
        this.stpIcon = {}
        deleteCd = 'stpIcon'
        this.isStpIconExist = false
      } else if (division === 4) {
        this.grpDefIcon = {}
        deleteCd = 'grpDefIcon'
        this.isGrpDefIconExist = false
      } else if (division === 5) {
        this.grpStpIcon = {}
        deleteCd = 'grpStpIcon'
        this.isGrpStpIconExist = false
      } else if (division === 6) {
        this.grpErrIcon = {}
        deleteCd = 'grpErrIcon'
        this.isGrpErrIconExist = false
      } else if (division === 7) {
        this.multiIcon = {}
        deleteCd = 'multiIcon'
        this.isMultiIconExist = false
      } else if (division === 8) {
        this.multiErrIcon = {}
        deleteCd = 'multiErrIcon'
        this.isMultiErrIconExist = false
      }

      if (this.delFileSeqList[fileSeq] === undefined) {
        this.delFileSeqList.push(fileSeq)
      }

      if (this.deleteCdList[deleteCd] === undefined) {
        this.deleteCdList.push(deleteCd)
      }
    },
    fnGetNewCode() {
      requestApi({
        url: this.retrieveIotMaxOrderAPI,
        headers: {
          'X-MID': 'P00055'
        },
        method: 'post',
        data: { parentCdId: 'SD00000000', langSet: this.dataObj.langSet },
        callback: (res) => {
          let tmpKey = null
          if (res.data.cdId === '1') {
            tmpKey = this.svcType === 'srv' ? 'SD00000002' : 'SD00000003'
          } else {
            tmpKey = res.data.cdId
          }
          let tmpCd = tmpKey.substring(2, tmpKey.length)
          let bb = String(Number(tmpCd) + Number(1))
          let idx = 0
          let aa = null
          if (bb.length < 8) {
            aa = 'SD'
            for (let index = 0; index < 8 - bb.length; index++) {
              aa = aa + '0'
            }
            aa = aa + bb
          } else {
            for (let index = 0; index < tmpCd.length; index++) {
              let element = tmpCd[index]
              if (element > 0) {
                aa = Number(element) + Number(1)
                idx = index + 2
                break
              }
            }
          }
          this.dataObj.cdId = tmpKey.substring(0, idx) + aa
          $('#cdId').val(tmpKey.substring(0, idx) + aa)
        }
      })
    },
    fnFindTopCdId () {
      if (this.dataObj.langSet !== undefined) {
        this.dataObj.topCdId = 'C000000001'
      }
    },
    // division -> 1: 기본아이콘, 2: 이상아이콘, 3: 정지아이콘
    fnFileCheck (division) {
      if (division === 1) {
        if (!/\.(jpg|bmp|ico|gif|png)$/i.test(this.$refs.defaultIcon.value)) {
          if (this.$refs.defaultIcon.value !== '') {
            this.alert(this.$t('file-type-check'), 'warning')
            this.fileTypeFlag = false
          }
        } else {
          this.fileTypeFlag = true
        }
      } else if (division === 3) {
        if (!/\.(jpg|bmp|ico|gif|png)$/i.test(this.$refs.errorIcon.value)) {
          if (this.$refs.errorIcon.value !== '') {
            this.alert(this.$t('file-type-check'), 'warning')
            this.fileTypeFlag = false
          }
        } else {
          this.fileTypeFlag = true
        }
      } else if (division === 2) {
        if (!/\.(jpg|bmp|ico|gif|png)$/i.test(this.$refs.stopIcon.value)) {
          if (this.$refs.stopIcon.value !== '') {
            this.alert(this.$t('file-type-check'), 'warning')
            this.fileTypeFlag = false
          }
        } else {
          this.fileTypeFlag = true
        }
      } else if (division === 4) {
        if (!/\.(jpg|bmp|ico|gif|png)$/i.test(this.$refs.grpDefIcon.value)) {
          if (this.$refs.grpDefIcon.value !== '') {
            this.alert(this.$t('file-type-check'), 'warning')
            this.fileTypeFlag = false
          }
        } else {
          this.fileTypeFlag = true
        }
      } else if (division === 5) {
        if (!/\.(jpg|bmp|ico|gif|png)$/i.test(this.$refs.grpStpIcon.value)) {
          if (this.$refs.grpStpIcon.value !== '') {
            this.alert(this.$t('file-type-check'), 'warning')
            this.fileTypeFlag = false
          }
        } else {
          this.fileTypeFlag = true
        }
      } else if (division === 6) {
        if (!/\.(jpg|bmp|ico|gif|png)$/i.test(this.$refs.grpErrIcon.value)) {
          if (this.$refs.grpErrIcon.value !== '') {
            this.alert(this.$t('file-type-check'), 'warning')
            this.fileTypeFlag = false
          }
        } else {
          this.fileTypeFlag = true
        }
      } else if (division === 7) {
        if (!/\.(jpg|bmp|ico|gif|png)$/i.test(this.$refs.multiIcon.value)) {
          if (this.$refs.multiIcon.value !== '') {
            this.alert(this.$t('file-type-check'), 'warning')
            this.fileTypeFlag = false
          }
        } else {
          this.fileTypeFlag = true
        }
      } else if (division === 8) {
        if (!/\.(jpg|bmp|ico|gif|png)$/i.test(this.$refs.multiErrIcon.value)) {
          if (this.$refs.multiErrIcon.value !== '') {
            this.alert(this.$t('file-type-check'), 'warning')
            this.fileTypeFlag = false
          }
        } else {
          this.fileTypeFlag = true
        }
      }
    },
    fnCdInputChk() {
      this.cdIdDuplChkFlag = false
    },
    fnBlankCheck (content) {
      var blankPattern = /^\s+|\s+$/g
      if (content === undefined || content === null) {
        return false
      } else {
        if (content.replace(blankPattern, '') === '') {
          return false
        } else {
          return true
        }
      }
    },
    fnSpcChrChk(char) {
      return /^[ㄱ-ㅎ가-힣a-zA-Z0-9_-]*$/.test(char)
    },
    fnCdDuplChk() {
      if (this.dataObj.langSet === 'select' || this.dataObj.langSet === undefined) {
        this.alert(this.$t('langSet-select'), 'warning')
      } else if (!this.fnBlankCheck(this.dataObj.cdId)) {
        this.alert(this.$t('cdId-input-msg'), 'warning')
      } else if (!/^[ㄱ-ㅎ가-힣a-zA-Z0-9_-]*$/.test(this.dataObj.cdId)) {
        this.alert(this.$t('cdId-spc-char-chk'), 'warning')
      } else if (!/[ㄱ-ㅎ가-힣a-zA-Z0-9_-]{1,10}/.test('' + this.dataObj.cdId)) {
        this.alert(this.$t('cdId-leng-chk'), 'warning')
      } else {
        var reqData = {}
        reqData.cdId = this.dataObj.cdId
        reqData.langSet = this.dataObj.langSet
        requestApi({
          url: '/online/iotcmcd/retrieveDuplicatedCdId',
          headers: {
            'X-MID': 'P00055'
          },
          method: 'post',
          data: reqData,
          callback: (res) => {
            // 중복체크 결과에 대한 헤더값 확인
            if (res.result.status === '200' || res.result.status === '204') {
              this.alert(res.data.msg, 'success')
              this.cdIdDuplChkFlag = true
            } else {
              this.cdIdDuplChkFlag = false
            }
          }
        })
      }
    },
    fnGetlangSetList () {
      var paramObj = {}
      paramObj.parentCdId = this.langSetCd
      requestApi({
        url: this.langSetListAPI,
        headers: {
          'X-MID': 'P00055'
        },
        method: 'post',
        data: paramObj,
        callback: (res) => {
          this.langSetArr = res.data
          if (this.dataObj.langSet === undefined || this.dataObj.langSet === null || this.dataObj.langSet === '') {
            this.dataObj.langSet = Cookies.get('LOCALE')
          }
          this.fnChgLang()
        }
      })
    },
    fnIdInputChk() {
      this.cdNmDuplChkFlag = false
    },
    fnIdDuplChk() {
      if (this.dataObj.langSet === 'select' || this.dataObj.langSet === undefined) {
        this.alert(this.$t('langSet-select'), 'warning')
      } else if (!this.fnBlankCheck(this.dataObj.cdNm)) {
        this.alert(this.$t('cmnm-input-msg'), 'warning')
      } else if (!this.fnSpcChrChk(this.dataObj.cdNm)) {
        this.alert(this.$t('cdNm-spc-char-chk'), 'warning')
      } else if (!/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z_-]{1,16}/.test(this.dataObj.cdNm)) {
        this.alert(this.$t('cdNm-leng-chk'), 'warning')
      } else {
        var reqData = {}
        reqData.cdNm = this.dataObj.cdNm
        reqData.langSet = this.dataObj.langSet
        reqData.parentCdId = this.svcType === 'srv' ? 'SD00000001' : 'SD00000002'
        requestApi({
          url: '/online/iotcmcd/retrieveDuplicatedCdNm',
          headers: {
            'X-MID': 'P00055'
          },
          method: 'post',
          data: reqData,
          callback: (res) => {
            // 중복체크 결과에 대한 헤더값 확인
            if (res.result.status === '200' || res.result.status === '204') {
              this.alert(res.data.msg, 'success')
              this.cdNmDuplChkFlag = true
            } else {
              this.cdNmDuplChkFlag = false
            }
          }
        })
      }
    },
    fnSvcAdd () {
      let tmpVal = this.dataObj.langSet
      this.dataObj = {}
      this.dataObj.langSet = tmpVal
      this.isModifyTrue = false
      this.isSaveNew = true
      this.dataObj.useYn = 'Y'
      this.cdNmDuplChkFlag = false
      this.cdIdDuplChkFlag = false
      this.savaBtnText = this.$t('save')
      this.svcType = this.treeLength === 1 ? 'srv' : 'dev'
      this.dataObj.division = this.svcType === 'srv' ? this.$t('service') : this.$t('dev-type')
      this.fnInitImgBox()
      this.fnFindTopCdId()
      this.fnGetNewCode()
      this.fnChgLang()
    },
    fnSvcInfo (svcSeq) {
      this.fnInitImgBox()
      this.fnInitFileObj()
      var local = this
      var paramObj = {}
      paramObj.svcSeq = svcSeq
      paramObj.langSet = this.dataObj.langSet
      requestApi({
        url: this.retrieveIotSvcBySeqAPI,
        headers: {
          'X-MID': 'P00055'
        },
        method: 'post',
        data: paramObj,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            var obj = {}
            if (res.data.data.devClsCd == null) {
              obj.cdId = res.data.data.svcCd
              this.svcDivision = this.$t('service')
            } else {
              obj.cdId = res.data.data.devClsCd
              this.svcDivision = this.$t('dev-type')
            }
            // 이미지 짝맞추기...ㅡㅡ
            if (res.data.imgs !== undefined || res.data.imgs !== null) {
              $.each(res.data.imgs, function(idx, obj) {
                if (res.data.file !== undefined || res.data.file !== null) {
                  $.each(res.data.file, function(index, object) {
                    if (obj.iconCd === 'GN00000121') {
                      if (obj.orgFile === object.orgFileName) {
                        local.defIcon = object
                      }
                      local.isDefIconExist = true
                    } else if (obj.iconCd === 'GN00000123') {
                      if (obj.orgFile === object.orgFileName) {
                        local.stpIcon = object
                      }
                      local.isStpIconExist = true
                    } else if (obj.iconCd === 'GN00000122') {
                      if (obj.orgFile === object.orgFileName) {
                        local.errIcon = object
                      }
                      local.isErrIconExist = true
                    }
                    if (obj.iconCd === 'GN00000124') {
                      if (obj.orgFile === object.orgFileName) {
                        local.grpDefIcon = object
                      }
                      local.isGrpDefIconExist = true
                    } else if (obj.iconCd === 'GN00000125') {
                      if (obj.orgFile === object.orgFileName) {
                        local.grpErrIcon = object
                      }
                      local.isGrpErrIconExist = true
                    } else if (obj.iconCd === 'GN00000126') {
                      if (obj.orgFile === object.orgFileName) {
                        local.grpStpIcon = object
                      }
                      local.isGrpStpIconExist = true
                    } else if (obj.iconCd === 'GN00000127') {
                      if (obj.orgFile === object.orgFileName) {
                        local.multiIcon = object
                      }
                      local.isMultiIconExist = true
                    } else if (obj.iconCd === 'GN00000128') {
                      if (obj.orgFile === object.orgFileName) {
                        local.multiErrIcon = object
                      }
                      local.isMultiErrIconExist = true
                    }
                  })
                }
              })
            }
            obj.langSet = this.dataObj.langSet
            this.fnCallAPI(this.retrieveIotCmCdByCdIdAPI, obj, 2)
          } else {
          }
        }
      })
    },
    fnMakeTree() {
      $('#jstree').jstree(
        { core:
          {
            data: this.svcTreeData
          }
        })
    },
    fnSvcMapping () {
      this.popup({
        component: () => import('@/views/env/svcMgmt/DevClsListSvc'),
        title: this.$t('dev-type-mapping'),
        width: '500',
        height: '450',
        data: {
          idx: { svcSeq: this.parentSvcSeq, langSet: this.dataObj.langSet }
        },
        callback: (data) => {
          if (data !== 'dismiss') {
            this.fnTreeReload()
          }
        }
      })
    },
    confirmCallback() {
      var local = this
      var paramObj = null
      if (this.isSaveNew) {
        delete this.dataObj.division
        paramObj = this.fnSetSendParam()
        paramObj.cdDesc = this.dataObj.cdDesc
        paramObj.cdId = this.dataObj.cdId
        paramObj.cdNm = this.dataObj.cdNm
        paramObj.langSet = this.dataObj.langSet
        paramObj.topCdId = this.dataObj.topCdId
        paramObj.useYn = this.dataObj.useYn

        // 공통코드 등록 셋팅 내용
        if (this.svcType !== 'dev') {
          paramObj.parentCdId = this.svcCdObject.svcCdid
          paramObj.firstCdId = this.svcCdObject.svcCdid
          paramObj.lvl = 3
        } else {
          paramObj.parentCdId = this.devCdObject.svcCdid
          paramObj.firstCdId = this.devCdObject.svcCdid
          paramObj.lvl = 3
        }

        // 서비스 등록 셋팅 내용
        if (this.svcType !== 'dev') {
          paramObj.svcCd = this.dataObj.cdId
          // paramObj.devClsCd = null
          paramObj.svcLevel = 1
          paramObj.upSvcSeq = 0
        } else {
          paramObj.devClsCd = this.dataObj.cdId
          $.each(this.svcTreeData, function (idx, obj) {
            if (obj.id === local.parentSvcSeq) {
              paramObj.svcCd = obj.data.selfSeq
            }
          })
          paramObj.svcLevel = 2
          paramObj.upSvcSeq = this.parentSvcSeq
          paramObj = this.fnSetFiles(paramObj)
        }
        this.addItemFlag = true
        this.fnCallApiFile(paramObj, this.createIotSvcAPI, 1)
      } else {
        this.addItemFlag = false
        delete this.dataObj.division
        delete this.dataObj.useYnVal
        delete this.dataObj.modUsrId
        paramObj = this.fnSetSendParam()
        paramObj.cdSeq = this.dataObj.cdSeq
        if (this.svcType !== 'dev') {
          paramObj.svcCd = this.dataObj.cdId
          // paramObj.devClsCd = null
          paramObj.svcLevel = 1
          paramObj.upSvcSeq = 0
        } else {
          paramObj.devClsCd = this.dataObj.cdId
          $.each(this.svcTreeData, function (idx, obj) {
            if (obj.id === local.parentSvcSeq) {
              paramObj.svcCd = obj.data.selfSeq
            }
          })
          paramObj.svcLevel = 2
          paramObj.upSvcSeq = this.parentSvcSeq
          paramObj.svcSeq = this.parentSvcSeq
          paramObj = this.fnSetFiles(paramObj)
          paramObj.deleteArr = local.delFileSeqList
          paramObj.deleteCdList = local.deleteCdList
        }

        this.fnCallApiFile(paramObj, '/online/iotsvc/updateIotSvc', 2)
      }
    },
    fnSetFiles(paramObj) {
      var defaultIcon = null
      var stopIcon = null
      var errorIcon = null
      var multiIcon = null
      var multiErrIcon = null
      var grpDefIcon = null
      var grpErrIcon = null
      var grpStpIcon = null

      if (this.isDefIconExist) {
        defaultIcon = this.defIcon.orgFileName
      } else {
        if (this.$refs.defaultIcon.files.length > 0) {
          defaultIcon = this.$refs.defaultIcon.files[0].name
        }
      }
      if (this.isStpIconExist) {
        stopIcon = this.stpIcon.orgFileName
      } else {
        if (this.$refs.stopIcon.files.length > 0) {
          stopIcon = this.$refs.stopIcon.files[0].name
        }
      }
      if (this.isErrIconExist) {
        errorIcon = this.errIcon.orgFileName
      } else {
        if (this.$refs.errorIcon.files.length > 0) {
          errorIcon = this.$refs.errorIcon.files[0].name
        }
      }
      if (this.isGrpDefIconExist) {
        grpDefIcon = this.grpDefIcon.orgFileName
      } else {
        if (this.$refs.grpDefIcon.files.length > 0) {
          grpDefIcon = this.$refs.grpDefIcon.files[0].name
        }
      }
      if (this.isGrpStpIconExist) {
        grpStpIcon = this.grpStpIcon.orgFileName
      } else {
        if (this.$refs.grpStpIcon.files.length > 0) {
          grpStpIcon = this.$refs.grpStpIcon.files[0].name
        }
      }
      if (this.isGrpErrIconExist) {
        grpErrIcon = this.grpErrIcon.orgFileName
      } else {
        if (this.$refs.grpErrIcon.files.length > 0) {
          grpErrIcon = this.$refs.grpErrIcon.files[0].name
        }
      }
      if (this.isMultiIconExist) {
        multiIcon = this.multiIcon.orgFileName
      } else {
        if (this.$refs.multiIcon.files.length > 0) {
          multiIcon = this.$refs.multiIcon.files[0].name
        }
      }
      if (this.isMultiErrIconExist) {
        multiErrIcon = this.multiErrIcon.orgFileName
      } else {
        if (this.$refs.multiErrIcon.files.length > 0) {
          multiErrIcon = this.$refs.multiErrIcon.files[0].name
        }
      }
      paramObj.grpDefIcon = grpDefIcon
      paramObj.grpErrIcon = grpErrIcon
      paramObj.grpStpIcon = grpStpIcon
      paramObj.defaultIcon = defaultIcon
      paramObj.stopIcon = stopIcon
      paramObj.errorIcon = errorIcon
      paramObj.multiIcon = multiIcon
      paramObj.multiErrIcon = multiErrIcon
      return paramObj
    },
    fnSetSendParam() {
      var paramObj = {}
      if (this.dataObj.cdDesc) {
        paramObj.cdDesc = this.dataObj.cdDesc
      }
      paramObj.cdId = this.dataObj.cdId
      paramObj.cdNm = this.dataObj.cdNm
      paramObj.langSet = this.dataObj.langSet
      paramObj.topCdId = this.dataObj.topCdId
      paramObj.useYn = this.dataObj.useYn
      return paramObj
    },
    submit () {
      if (!this.fnBlankCheck(this.dataObj.cdNm)) {
        // 코드명 입력여부 체크
        this.alert(this.$t('cmnm-input-msg'), 'warning')
      } else if (!this.fnBlankCheck(this.dataObj.cdNm)) {
        this.alert(this.$t('cmNm-input-msg'), 'warning')
      } else if (!this.fnSpcChrChk(this.dataObj.cdNm)) {
        this.alert(this.$t('cdNm-spc-char-chk'), 'warning')
      } else if (!/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z0-9_-]{1,16}/.test(this.dataObj.cdNm)) {
        this.alert(this.$t('cdNm-leng-chk'), 'warning')
      } else if (!this.cdNmDuplChkFlag) {
        // 중복확인여부 체크
        this.alert(this.$t('cmcd-duplchk-msg'), 'warning')
      } else if (!this.fileTypeFlag) {
        this.alert(this.$t('file-type-check'), 'warning')
      } else if (!this.fnFileDuplCheck()) {
        this.alert(this.$t('imgFile-dupl'), 'warning')
      } else if (!this.fnSpcChrChk(this.dataObj.paramKey)) {
        this.alert(this.$t('paramKey-spc-char-chk'), 'warning')
      } else if (!this.fnSpcChrChk(this.dataObj.paramVal)) {
        this.alert(this.$t('paramVal-spc-char-chk'), 'warning')
      } else {
        // 저장여부 확인
        this.confirm(this.$t('saveYn'), this.confirmCallback)
      }
    },
    fnTreeReload() {
      // $('#jstree').jstree('destroy')
      $('#jstree').data('jstree', false).empty()
      // this.langTxt = ''
      this.fnCallAPI(this.retrieveSvcListAPI, { 'langSet': this.dataObj.langSet }, 1)
    },
    // division 1: 트리 데이터 조회, 2: 공통코드 조회
    fnCallAPI (url, data, division) {
      requestApi({
        url: url,
        headers: {
          'X-MID': 'P00055'
        },
        method: 'post',
        data: data,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            if (division === 1) {
              this.svcTreeData = res.data
              this.fnMakeTree()
              this.fnGetlangSetList()
            } else if (division === 2) {
              this.dataObj = res.data
              this.dataObj.division = this.svcDivision
              this.langSetArr.forEach(element => {
                if (res.data.langSet === element.cdId) {
                  this.langTxt = element.cdNm
                }
              })
            }
          } else {

          }
        }
      })
    },
    fnInitImgBox () {
      this.isDefIconExist = false
      this.isStpIconExist = false
      this.isErrIconExist = false
      this.isMultiIconExist = false
      this.isMultiErrIconExist = false
      this.isGrpDefIconExist = false
      this.isGrpStpIconExist = false
      this.isGrpErrIconExist = false
      this.defIcon = {}
      this.stpIcon = {}
      this.errIcon = {}
      this.multiIcon = {}
      this.multiErrIcon = {}
      this.grpDefIcon = {}
      this.grpStpIcon = {}
      this.grpErrIcon = {}
    },
    fnCallApiFile (reqData, uri, division) {
      var tmpList = []
      if (this.$refs.defaultIcon !== undefined && this.$refs.defaultIcon.files.length > 0) {
        tmpList.push(this.$refs.defaultIcon)
      }
      if (this.$refs.stopIcon !== undefined && this.$refs.stopIcon.files.length > 0) {
        tmpList.push(this.$refs.stopIcon)
      }
      if (this.$refs.errorIcon !== undefined && this.$refs.errorIcon.files.length > 0) {
        tmpList.push(this.$refs.errorIcon)
      }
      if (this.$refs.multiIcon !== undefined && this.$refs.multiIcon.files.length > 0) {
        tmpList.push(this.$refs.multiIcon)
      }
      if (this.$refs.multiErrIcon !== undefined && this.$refs.multiErrIcon.files.length > 0) {
        tmpList.push(this.$refs.multiErrIcon)
      }
      if (this.$refs.grpDefIcon !== undefined && this.$refs.grpDefIcon.files.length > 0) {
        tmpList.push(this.$refs.grpDefIcon)
      }
      if (this.$refs.grpErrIcon !== undefined && this.$refs.grpErrIcon.files.length > 0) {
        tmpList.push(this.$refs.grpErrIcon)
      }
      if (this.$refs.grpStpIcon !== undefined && this.$refs.grpStpIcon.files.length > 0) {
        tmpList.push(this.$refs.grpStpIcon)
      }
      requestMultipartJsonObject({
        url: uri,
        headers: {
          'X-MID': 'P00055'
        },
        method: 'post',
        data: reqData,
        files: getRequestFileArray(tmpList),
        callback: (res) => {
          this.delFileSeqList = []
          this.deleteCdList = []
          if (res.result.status === '200' || res.result.status === '204') {
            let tmpVal = this.dataObj.langSet
            this.dataObj = {}
            this.dataObj.langSet = tmpVal
            this.fnInitFileObj()
            if (division === 1) {
              this.fnTreeReload()
            } else {
              this.fnTreeReload()
              this.fnSvcInfo(this.parentSvcSeq)
            }
            this.alert(this.$t('save-success'), 'success')
          } else {}
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
