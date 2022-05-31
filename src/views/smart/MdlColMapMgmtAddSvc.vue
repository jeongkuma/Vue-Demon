<template>
  <div>
    <div style='z-index:99; top:0px; width:100%; height:100%; position:absolute; background-color:#000; opacity:0.2;' v-if="disDiv"></div>
      <div class="modal-body">
        <!--  Raw 전문 매핑 설정  -->
        <div v-if="rawMapVisible" class="form-row row mb-3">
          <div class="col-sm-12 col-md-4 col-lg-4 pl-0 pr-0">
            <span class="lb-txt mb-3">{{$t('colRawMsgMap')}}</span>
              <div class="form-inline">
                <div class="form-group" @change="cancelMap">
                  <div class="form-radio" >
                    <label class="form-radio-label" for="rawMapSet" >
                      <input class="form-radio-input" type="radio" id="rawMapSet" name="radio" :value="true" v-model="colRawMsgMap">{{$t('rawMapSet')}}
                      <span class="form-radio-sign"></span>
                    </label>
                  </div>
                  <div class="form-radio">
                    <label class="form-radio-label" for="rawMapSetNot">
                      <input class="form-radio-input" type="radio" id="rawMapSetNot" name="radio" :value="false" v-model="colRawMsgMap" checked="checked">{{$t('rawMapSetNot')}}
                      <span class="form-radio-sign"></span>
                    </label>
                  </div>
                </div>
               <span class="form-check-sign"></span>
              </div>
          </div>
        </div>
        <!--  IOT 모델 속성  -->
        <div class="form-row row">
          <div class="col-sm-12 col-md-4 col-lg-3 pl-1 pr-1">
              <span class="lb-txt mb-2">{{$t('mdlmMtMdlNm')}}</span>
              <input type="text" class="form-control" v-model="learPreMdlNm" readonly>
            <div class="mt-3">
              <span class="lb-txt mb-1">{{$t('mdlmMtSelCont')}}</span>
              <input type="text" class="form-control" v-model="seleMdlColName" readonly>
            </div>
            <div>
              <table class="table table-hover" style="border-bottom:1px solid #ddd;">
                <thead>
                  <tr>
                    <th class="p-0"><span class="lb-txt mt-3 mb-2">{{$t('mdlmMtCol')}}</span></th>
                  </tr>
                </thead>
                <tbody v-if="mdlColList.length > 0">
                  <tr class="py-2" v-for=" (element, idx) in mdlColList" v-bind:key="idx">
                    <td class="" @click="fnMdlColSel(element.seq, element.mdlColNm)">{{element.mdlColNm}}</td>
                  </tr>
                </tbody>
                <tbody v-else >
                  <tr class="">
                    <td class="">{{$t('mdlMapMtColListNull')}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!--  매핑정보  -->
          <div class="col-sm-12 col-md-4 col-lg-6 pl-1 pr-1">
              <div class="form-group text-center">
                <span class="lb-txt">{{$t('mdlmMtColMapList')}}</span>
              </div>
              <div v-if="mapInfoList.length > 0">
                <div class="px-1 py-2" style="border:1px solid #d4dce4;">
                  <draggable v-model="mapInfoList" group="attr-list" @start="drag=true" @end="drag=false" handle=".attr-list-handle">
                    <div class="row ml-0" v-for=" (obj, idx) in mapInfoList" v-bind:key="idx">
                      <div class="col-lg-4 col-sm-12 mb-2">
                        <input readonly class="form-control" v-model="obj.mdlColNm">
                      </div>
                      <div class="col-lg-4 col-sm-12 mb-2">
                        <input readonly class="form-control" v-model="obj.dvcTbColNm">
                      </div>
                      <div class="col-lg-4 col-sm-12 mb-2 pl-1">
                        <div class="input-group pl-2">
                          <button class="btn" type="button" @click="fnMapDel(idx)"><span class="glyphicon glyphicon-minus"></span></button>
                          <a href="javascript:return;" class="btn attr-list-handle" style="border:1px solid transparent; border-radius:4px; background-color:#e6e6e6;"><span class="glyphicon glyphicon-align-justify"></span></a>
                        </div>
                      </div>
                    </div>
                  </draggable>
                </div>
              </div>
              <div v-else class="text-center py-2" style="border:1px solid #d4dce4;"><span>{{$t('mdlMapMtColListNull')}}</span></div>
              <div class="form-group text-center pt-3">
                <button @click="fnMapAdd()" type="button" class="btn btn-pink" :disabled="colRawMsgMap==true">{{$t('mdlmMtColMapAdd')}}</button>
              </div>
          </div>
          <!--  지능화 모델 속성  -->
          <div class="col-sm-12 col-md-3 col-lg-3 pl-1 pr-1">
            <div>
                <span class="lb-txt mb-2">{{$t('mdlmMtDevMdlNm')}}</span>
                <input type="text" class="form-control" v-model="dataObj.devMdlNm" readonly>
            </div>
            <div class="mt-3">
              <span class="lb-txt mb-1">{{$t('mdlmMtSelCont')}}</span>
              <input type="text" class="form-control" v-model="seleDevColName" readonly>
            </div>
            <div>
                <table class="table table-hover" style="border-bottom:1px solid #ddd;">
                  <thead>
                    <tr>
                      <th class="p-0"><span class="lb-txt mt-3 mb-2">{{$t('mdlmMtDevCol')}}</span></th>
                    </tr>
                  </thead>
                  <tbody v-if="dvcColList.length > 0">
                    <tr class="py-2" v-for=" (element, idx) in dvcColList" v-bind:key="idx">
                      <td class="" @click="fnDvcColSel(element.seq, 'DEV', element.dvcColNm)">{{element.dvcColNm}}</td>
                    </tr>
                  </tbody>
                  <tbody v-else >
                    <tr>
                      <td class="py-2">{{$t('mdlMapMtColListNull')}}</td>
                    </tr>
                  </tbody>
                  <thead>
                    <tr>
                      <th class="p-0"><span class="lb-txt mt-3 mb-2">{{$t('mdlmMtOutTbCol')}}</span></th>
                    </tr>
                  </thead>
                  <tbody v-if="outTbColList.length > 0">
                    <tr class="py-2" v-for=" (element, idx) in outTbColList" v-bind:key="idx">
                      <td class="" @click="fnDvcColSel(element.seq, 'EXT', element.tbColNm)">{{element.tbColNm}}</td>
                    </tr>
                  </tbody>
                  <tbody v-else >
                    <tr>
                      <td class="py-2">{{$t('mdlMapMtColListNull')}}</td>
                    </tr>
                  </tbody>
                </table>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <div class="text-center">
          <button @click="submit()" type="button" class="btn btn-pink" v-if="dataObj.seq === ''">{{$t('registration')}}</button>
          <button @click="submit()" type="button" class="btn btn-pink" v-else>{{$t('modify')}}</button>
          <button @click="close()" type="button" class="btn btn-gray" data-dismiss="modal">{{$t('cancel')}}</button>
        </div>
      </div>
  </div>
</template>

<script>
import 'ts-polyfill'
import { requestApi } from '@/api/ccp/requestApi'
import Cookies from 'js-cookie'
import draggable from 'vuedraggable'
import { getDevClsCdListBySvcCd, getSvcList } from '@/api/common/usrSvcDevice'

export default {
  name: 'MdlColMapMgmtAddSvc',
  components: {
    draggable
  },
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
  data () {
    return {
      dataObj: { seq: this.data.obj.seq, devMdlSeq: this.data.obj.devMdlSeq, devMdlNm: this.data.obj.devMdlNm, learPreMdlSeq: this.data.obj.learPreMdlSeq, learPreMdlNm: this.data.obj.learPreMdlNm, mdlTypeNm: this.data.obj.mdlTypeNm, mdlType: this.data.obj.mdlType, rawMap: this.data.obj.rawMap, mlApiTableType: this.data.obj.mlApiTableType, mlDelayTypeCd: this.data.obj.mlDelayTypeCd },
      learPreMdlNm: '',
      seleMdlColName: '',
      seleMdlColSeq: '', // 학습/예측 모델 속성 seq
      seleDevColName: '',
      seleDevColSeq: '', // 장비속성 seq, 테이블 컬럼명
      seleDvcTbType: '', // DEV/EXT
      mdlColList: [
        // { mdlColNm: '지열연도', seq: '' }, { mdlColNm: '단말온도', seq: ''  }, { mdlColNm: '경위도', seq: '' }
      ],
      dvcColList: [
        // { seq: '', dvcColNm: '장비속성-ATTB_VL01(굴착지열시간)' }, { seq: '', dvcColNm: 'ATTB_VL02(굴착여부)' } }
      ],
      outTbColList: [
        // { seq: '', tbColNm: '장비속성-ATTB_VL01(굴착지열시간)' }, { seq: '', tbColNm: 'ATTB_VL02(굴착여부)' } }
      ],
      mapInfoList: [
        // { seq: '', mdlColNm: '지열온도1', dvcTbColNm: '장비속성-ATTB_VL01(굴착지열시간)' }, { seq: '', mdlColNm: '단말온도', dvcTbColNm: 'ATTB_VL02(굴착여부)' }
        // { dataType: '장비/테이블 구분(DEV/EXT)', mdlAttbSeq: '모델속성seq', devAttbSeq: '장비seq/테이블 속성명', mdlColNm: '지열온도1', dvcTbColNm: '장비속성-ATTB_VL01(굴착지열시간)' }
      ],
      tmpMapInfoList: [

      ],
      disDiv: false,
      colRawMsgMap: false,
      rawMap: 'N',
      rawMapVisible: false,
      xMid: 'P00317'
    }
  },
  watch: {
  },
  created () {
    if (this.data.obj.rawMap === 'Y') {
      this.colRawMsgMap = true
    }
    if (this.data.obj.mlApiTableType === 'API' && this.data.obj.mlDelayTypeCd === 'RTM') {
      this.rawMapVisible = true
    } else {
      this.rawMapVisible = false
    }
    // mlApiTableType: this.data.obj.mlApiTableType
    // mlDelayTypeCd: this.data.obj.mlDelayTypeCd
    this.langTxt = this.$t(Cookies.get('LOCALE'))
    this.mdlConfirm()
  },
  mounted () {},
  methods: {
    fnGetSvcList() {
      getSvcList({ xMid: this.xMid })
        .then((data) => {
          this.svcCdList = data
          if (this.svcCdList.length > 0) {
            this.svcCd = this.svcCdList[0].svcCd
            this.fnGetDevClsCdListBySvcCd()
          }
        })
        .catch((e) => {
          console.error(e)
        })
    },
    fnGetDevClsCdListBySvcCd() {
      // 선택값 초기화
      this.devClsCd = 'all'
      this.devClsList = []
      if (this.svcCd === '') {
        return false
      }
      getDevClsCdListBySvcCd({ xMid: 'P00003', svcCd: this.svcCd })
        .then((data) => {
          this.devClsList = data.devClsList
          this.getModelList({ devClsCd: this.devClsCd })
        })
        .catch((e) => {
          console.error(e)
        })
    },
    getModelList () {
      this.devMdlList = []
      this.devMdlCd = 'all'
      this.entrDevEntrAttbs = null
      if (this.devClsCd === '') {
        return false
      }
      let reqData = {
        devClsCd: this.devClsCd
      }
      requestApi({
        url: '/online/iotsdev/retrieveSvcDevMdlList',
        method: 'post',
        headers: {
          'X-MID': this.xMid
        },
        data: reqData,
        callback: (res) => {
          this.devMdlList = res.data
        }
      })
    },
    fnMdlColSel(seq, mdlColName) {
      if (this.colRawMsgMap === true) {
        this.seleMdlColSeq = ''
        this.seleMdlColName = ''
      } else {
        this.seleMdlColSeq = seq
        this.seleMdlColName = mdlColName
      }
    },
    fnDvcColSel(seq, type, dvcColName) {
      if (this.colRawMsgMap === true) {
        this.seleDevColSeq = ''
        this.seleDvcTbType = ''
        this.seleDevColName = ''
      } else {
        this.seleDevColSeq = seq
        this.seleDvcTbType = type
        this.seleDevColName = dvcColName
      }
    },
    fnMapAdd() {
      // var len = this.mapInfoList.length
      var local = this
      if (local.seleMdlColName === '' || local.seleDevColName === '') {
        local.alert(local.$t('mdlMapMtColNulChk'), 'warning')
      } else {
        this.mapInfoList.push({ dataType: this.seleDvcTbType, mdlAttbSeq: this.seleMdlColSeq, devAttbSeq: this.seleDevColSeq, mdlColNm: this.seleMdlColName, dvcTbColNm: this.seleDevColName })
      }
    },
    fnMapDel(idx) {
      this.mapInfoList.splice(idx, 1)
    },
    fnCallApi (reqData, uri) {
      requestApi({
        url: uri,
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.callback()
            this.close()
            this.alert(this.$t('save-success'), 'success')
          }
        }
      })
    },
    fnReqMdlColListApi () {
      var local = this
      var reqData = { mdlSeq: local.dataObj.learPreMdlSeq }

      var uri = '/online/bscpmodelmap/getModelInfoList'

      requestApi({
        url: uri,
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            var obj = {}
            for (var i = 0; i < res.data.dataList.length; i++) {
              obj = res.data.dataList[i]
              local.mdlColList.push({ mdlColNm: obj.mdlColCd + '(' + obj.mdlColNm + ')', seq: obj.seq })
            }
          }
        }
      })
    },
    fnReqDvcColListApi () {
      var local = this
      var reqData = { mdlSeq: local.dataObj.devMdlSeq }
      var uri = ''
      uri = '/online/bscpmodelmap/getDevModelAttbInfoList'

      requestApi({
        url: uri,
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            var obj = {}
            for (var i = 0; i < res.data.dataList.length; i++) {
              obj = res.data.dataList[i]
              local.dvcColList.push({ dvcColNm: obj.dvcColNm + '(' + obj.devMdlAtbNm + ')', seq: obj.seq })
            }
          }
        }
      })
    },
    fnReqTbColListApi () {
      var local = this
      var reqData = {}
      var uri = ''
      uri = '/online/bscpmodelmap/getExtDataInfoList'

      requestApi({
        url: uri,
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            var obj = {}
            for (var i = 0; i < res.data.dataList.length; i++) {
              obj = res.data.dataList[i]
              local.outTbColList.push({ tbColNm: obj.columnName + '(' + obj.comments + ')', seq: obj.columnName })
            }
          }
        }
      })
    },
    fnReqMdlColMapListApi () {
      var local = this
      var reqData = { devMdlSeq: local.dataObj.devMdlSeq, mdlSeq: local.dataObj.learPreMdlSeq }
      var uri = '/online/smart/mdlColMapList'
      uri = '/online/bscpmodelmap/getDevModelAttbMapInfoList'

      requestApi({
        url: uri,
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            var obj = {}
            var sortObj = res.data.dataList
            // 순서정렬
            sortObj.sort(function(a, b) {
              return Number(a.ord) - Number(b.ord)
            })
            for (var i = 0; i < res.data.dataList.length; i++) {
              obj = res.data.dataList[i]
              local.mapInfoList.push({ seq: '', dataType: obj.attbType, mdlAttbSeq: obj.mlModelAttbSeq, devAttbSeq: obj.iotModelAttbSeq, mdlColNm: obj.mlModelAttbKey + '(' + obj.mlModelAttbNm + ')', dvcTbColNm: obj.iotColNmCd + '(' + obj.iotDevAttbNm + ')', ord: obj.ord })
              local.tmpMapInfoList.push({ seq: '', dataType: obj.attbType, mdlAttbSeq: obj.mlModelAttbSeq, devAttbSeq: obj.iotModelAttbSeq, mdlColNm: obj.mlModelAttbKey + '(' + obj.mlModelAttbNm + ')', dvcTbColNm: obj.iotColNmCd + '(' + obj.iotDevAttbNm + ')', ord: obj.ord })
            }
          }
        }
      })
    },
    fnMdlConfirmPopup () {
      var local = this
      var reqObj = local.dataObj
      // -- 학습/예측모델 최초등록일때, (등록건일때)
      this.popup({
        component: () => import('@/views/smart/MdlMapMgmtAddSvc'),
        title: this.$t('mdlMapAddSrv'),
        width: '800',
        height: '290',
        data: {
          obj: reqObj
        },
        callback: (data) => {
          if (data !== 'dismiss') {
            // local.disDiv = false // 입력방지 div 제거
            local.dataObj = data
            local.learPreMdlNm = local.dataObj.learPreMdlNm

            if (local.dataObj.mlApiTableType === 'API' && local.dataObj.mlDelayTypeCd === 'RTM') {
              this.rawMapVisible = true
            } else {
              this.rawMapVisible = false
            }

            local.fnReqMdlColListApi() // 학습/예측모델 속성 조회
            local.fnReqDvcColListApi() // 장비 속성 조회
            local.fnReqTbColListApi() // 아웃테이블 컬럼 조회
          }
          local.disDiv = false // 입력방지 div 제거
          // close 이벤트 호출시, 속성팝업도 닫힘
          if (data === 'dismiss') {
            local.close()
          }
        }
      })
    },
    mdlConfirm () {
      var local = this
      var reqObj = local.dataObj

      // 등록일때
      if (reqObj.seq === '') {
        local.fnMdlConfirmPopup() // 팝업 호출
        local.disDiv = false // 입력방지 div 노출
      } else {
      // 수정일떄
        local.learPreMdlNm = reqObj.learPreMdlNm
        local.fnReqMdlColListApi() // 학습/예측모델 속성 조회
        local.fnReqDvcColListApi() // 장비 속성 조회
        local.fnReqTbColListApi() // 아웃테이블 컬럼 조회
        local.fnReqMdlColMapListApi() // 매핑목록조회
      }
    },
    cancelMap () {
      if (this.colRawMsgMap === true) {
        this.confirm(this.$t('cancel-map-confirm')).then(() => {
          this.colRawMsgMap = true
          this.mapInfoList = []
          this.rawMap = 'Y'
        }).catch(() => {
          this.colRawMsgMap = false
          this.mapInfoList = this.tmpMapInfoList
          this.rawMap = 'N'
        })
      } else {
        this.rawMap = 'N'
        this.mapInfoList = this.tmpMapInfoList
      }
    },
    submit () {
      var local = this
      var uri = '/online/bscpmodelmap/saveDevModelAttbMapInfo'
      var reqData = {}

      reqData.devMdlSeq = local.dataObj.devMdlSeq
      reqData.mdlSeq = local.dataObj.learPreMdlSeq
      reqData.rawMap = this.rawMap

      reqData.mdlAttbMap = []
      // 전문변환
      for (var i = 0; i < local.mapInfoList.length; i++) {
        var obj = local.mapInfoList[i]
        var ord = (i + 1) + '' // 순서 셋팅
        reqData.mdlAttbMap.push({ mdlAttbSeq: obj.mdlAttbSeq, devAttbSeq: obj.devAttbSeq, dataType: obj.dataType, ord: ord })
      }
      var len = reqData.mdlAttbMap.length
      if (this.colRawMsgMap === true) {
        local.fnCallApi(reqData, uri)
      } else {
        if (len === 0) {
          local.alert(local.$t('mdlMapMtColMapNulChk'), 'warning')
        } else {
          local.fnCallApi(reqData, uri)
        }
      }
    }
  }
}
</script>

<style lang="less">

</style>
