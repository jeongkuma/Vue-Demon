<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-12" v-if="dataObj.devMdlSeq === ''">
          <span class="form-label w-40 lb-txt">{{ $t('service') }}</span>
          <select
            v-model="svcCd"
            ref="svcCd"
            class="form-control"
            title="서비스"
            @change="fnGetDevClsCdListBySvcCd"
          >
            <option value>서비스 선택</option>
            <option
              v-for="(svc, index) in svcCdList"
              :key="`svcCd-${index}`"
              :value="svc.svcCd"
              >{{ svc.svcCdNm }}</option
            >
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6" v-if="dataObj.devMdlSeq === ''">
          <span class="form-label w-40 lb-txt">{{ $t('dev-cls') }}</span>
          <select
            v-model="devClsCd"
            ref="devClsType"
            class="form-control"
            title="장비 유형"
            @change="getModelList"
          >
            <option value="all">{{ $t('dev-cls') }}</option>
            <option
              v-for="devCls in devClsList"
              :key="'devCls' + devCls.devClsCd"
              :value="devCls.devClsCd"
              >{{ devCls.devClsNm }}</option
            >
          </select>
        </div>
        <div class="form-item col-sm-6" v-if="dataObj.devMdlSeq === ''">
          <span class="form-label w-40 lb-txt">{{ $t('mdlmMtDevMdl') }}</span>
          <select
            v-model="devMdlSeq"
            ref="devMdlType"
            class="form-control"
            title="장비 모델"
            @change="fnDevMdlChan"
          >
            <option value="all">{{ $t('dev-mdl') }}</option>
            <option
              v-for="devMdl in devMdlList"
              v-bind:key="devMdl.devMdlSeq"
              :value="devMdl.devMdlSeq"
              >{{ devMdl.devMdlNm }}</option
            >
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6" v-if="dataObj.devMdlSeq === ''">
          <span class="form-label w-40 lb-txt">{{
            $t('mdlMapMtMdlType')
          }}</span>
          <select class="form-control" v-model="mdlType" @change="fnMdlChan">
            <option
              v-for="item in mdlTypeOpt"
              v-bind:Key="item.optVal"
              :value="item.optVal"
              >{{ item.optName }}</option
            >
          </select>
        </div>
        <div class="form-item col-sm-6" v-if="dataObj.devMdlSeq === ''">
          <span class="form-label w-40 lb-txt">{{
            $t('mdlMapMtMdlList')
          }}</span>
          <select
            class="form-control"
            v-model="learPreMdlSeq"
            @change="fnLearPreMdlChan"
          >
            <option
              v-for="item in learPreMdlOpt"
              v-bind:Key="item.optVal"
              :value="item.optVal"
              >{{ item.optName }}</option
            >
          </select>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button @click="submit()" type="button" class="btn btn-pink">
          {{ $t('select') }}
        </button>
        <button
          @click="close('dismiss')"
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
import { requestApi } from '@/api/ccp/requestApi'
import Cookies from 'js-cookie'
import { getDevClsCdListBySvcCd, getSvcList } from '@/api/common/usrSvcDevice'

export default {
  name: 'MdlMapMgmtAddSvc',
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
        seq: this.data.obj.seq,
        devMdlSeq: this.data.obj.devMdlSeq,
        devMdlNm: this.data.obj.devMdlNm,
        learPreMdlSeq: this.data.obj.learPreMdlSeq,
        learPreMdlNm: this.data.obj.learPreMdlNm,
        mdlTypeNm: this.data.obj.mdlTypeNm,
        mdlType: this.data.obj.mdlType,
        mlApiTableType: this.data.obj.mlApiTableType,
        mlDelayTypeCd: this.data.obj.mlDelayTypeCd
      },
      learPreMdlSeq: '',
      learPreMdlNm: '',
      learPreMdlOpt:
        window.smartCodeInfo[Cookies.get('LOCALE')].mdlMapMgmtDevMdlTypeOpt,
      devMdlSeq: '',
      devMdlNm: '',
      devMdlOpt: _.cloneDeep(
        window.smartCodeInfo[Cookies.get('LOCALE')].mdlMapMgmtDevMdlOpt
      ),
      mdlType:
        window.smartCodeInfo[Cookies.get('LOCALE')].mdlMapMgmtMdlTypeOpt[0]
          .optVal, // 디폴트는 '학습'
      mdlTypeNm:
        window.smartCodeInfo[Cookies.get('LOCALE')].mdlMapMgmtMdlTypeOpt[0]
          .optName,
      mdlTypeOpt:
        window.smartCodeInfo[Cookies.get('LOCALE')].mdlMapMgmtMdlTypeOpt,
      mlApiTableType: '',
      mlDelayTypeCd: '',
      svcCd: '',
      svcCdList: [],
      devClsCd: 'all',
      devClsList: {},
      devMdlCd: 'all',
      devMdlList: {},
      xMid: 'P00314'
    }
  },
  watch: {},
  created() {
    this.langTxt = this.$t(Cookies.get('LOCALE'))
    // this.fnReqDevMdlListApi()
    this.fnGetSvcList()
  },
  mounted() {},
  methods: {
    fnDevMdlChan(event) {
      this.devMdlNm = event.target.options[event.target.selectedIndex].label
      this.devMdlSeq = event.target.value
      this.fnInitMdlList()
    },
    fnMdlChan(event) {
      this.mdlTypeNm = event.target.options[event.target.selectedIndex].label
      this.mdlType = event.target.value
      this.fnInitMdlList()
    },
    fnLearPreMdlChan(event) {
      this.learPreMdlNm = event.target.options[event.target.selectedIndex].label
      this.learPreMdlSeq = event.target.value
    },
    fnInitMdlList() {
      // this.learPreMdlOpt = []
      this.learPreMdlOpt = _.cloneDeep(
        window.smartCodeInfo[Cookies.get('LOCALE')].mdlMapMgmtDevMdlTypeOpt
      )
      this.learPreMdlSeq = ''
      if (this.devMdlSeq !== '') {
        this.fnReqMdlListApi()
      }
    },
    fnReqMdlListApi() {
      var reqData = {}

      var uri = '/online/bscpmodelmap/selectDevModelInfoList'
      if (this.mdlType === 'learn') {
        // 학습모델 조회
        reqData.mdlSeq = 'LRN'
      }
      if (this.mdlType === 'pred') {
        // 예측모델 조회
        reqData.mdlSeq = 'PRD'
      }
      requestApi({
        url: uri,
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            var obj = {}
            for (var i = 0; i < res.data.dataList.length; i++) {
              obj = res.data.dataList[i]
              this.mlApiTableType = res.data.dataList[i]['mlApiTableType']
              this.mlDelayTypeCd = res.data.dataList[i]['mlDelayTypeCd']
              this.learPreMdlOpt.push({ optName: obj.mdlNm, optVal: obj.seq })
            }
          }
        }
      })
    },
    fnGetSvcList() {
      getSvcList({ xMid: 'P00003' })
        .then(data => {
          this.svcCdList = data
          if (this.svcCdList.length > 0) {
            this.svcCd = this.svcCdList[0].svcCd
            this.fnGetDevClsCdListBySvcCd()
          }
        })
        .catch(e => {
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
        .then(data => {
          this.devClsList = data.devClsList
          this.getModelList({ devClsCd: this.devClsCd })
        })
        .catch(e => {
          console.error(e)
        })
    },
    getModelList() {
      this.devMdlList = []
      this.devMdlCd = 'all'
      this.devMdlSeq = 'all'
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
        callback: res => {
          this.devMdlList = res.data
          var obj = {}
          // this.devMdlOpt.push({ optName: '장비모델 선택', optVal: '' })
          for (var i = 0; i < res.data.length; i++) {
            obj = res.data[i]
            // cloneDeep 처리로 참조제거
            this.devMdlOpt.push({
              optName: obj.devMdlNm,
              optVal: obj.devMdlSeq
            })
          }
        }
      })
    },
    fnReqDevMdlListApi() {
      var reqData = {}
      var uri = ''
      uri = '/online/smart/devMdlList' // 장비 모델 조회
      uri = '/online/bscpmodelmap/getDevModelInfoList'

      requestApi({
        url: uri,
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            var obj = {}
            for (var i = 0; i < res.data.dataList.length; i++) {
              obj = res.data.dataList[i]
              this.devMdlOpt.push({
                optName: obj.devMdlNm,
                optVal: obj.devMdlSeq
              })
            }
          }
        }
      })
    },
    submit() {
      // 장비 모델 없을떄
      if (this.devMdlSeq === '') {
        // 선택확인 체크
        this.alert(this.$t('mdlMapMtDevMdlNul'), 'warning')
        return
      } else if (this.learPreMdlSeq === '') {
        // 선택확인 체크
        this.alert(this.$t('mdlMapMtMdlNul'), 'warning')
        return
      }

      // 팝업종료
      this.dataObj.mdlType = this.mdlType
      this.dataObj.mdlTypeNm = this.mdlTypeNm
      this.dataObj.learPreMdlNm = this.learPreMdlNm
      this.dataObj.learPreMdlSeq = this.learPreMdlSeq
      this.dataObj.devMdlSeq = this.devMdlSeq
      this.dataObj.devMdlNm = this.devMdlNm
      this.dataObj.mlApiTableType = this.mlApiTableType
      this.dataObj.mlDelayTypeCd = this.mlDelayTypeCd

      this.callback(this.dataObj)
      this.close()
    }
  }
}
</script>

<style lang="less">
</style>
