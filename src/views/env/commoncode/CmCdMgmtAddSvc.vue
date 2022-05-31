<template>
  <div>
    <div class="modal-body">
      <div class="form-item">
        <span class="form-label w-32 lb-txt">{{ $t('langSet') }}</span>
        <input v-model="langTxt" type="text" class="form-control" readonly />
      </div>
      <div class="form-item">
        <span class="form-label w-32 lb-txt">{{ $t('parentCdId') }}</span>
        <div class="input-horizontal">
          <div>
            <select
              v-model="secondCmCdVal"
              class="form-control"
              @change="fnSearchCmCdList(1)"
            >
              <option
                v-for="item in secondCmCdList"
                v-bind:key="item.cdId"
                :value="item.cdId"
                >{{ item.cdNm }}</option
              >
            </select>
          </div>
          <div class="mt-1">
            <select
              v-model="thirdCmCdVal"
              class="form-control"
              @change="fnSearchCmCdList(2)"
              :disabled="thirdDisabled"
            >
              <option
                v-for="item in thirdCmCdList"
                v-bind:key="item.cdId"
                :value="item.cdId"
                >{{ item.cdNm }}</option
              >
            </select>
          </div>
          <div class="mt-1">
            <select
              v-model="fourthCmCdVal"
              class="form-control"
              @change="fnSearchCmCdList(3)"
              :disabled="fourthDisabled"
            >
              <option
                v-for="item in fourthCmCdList"
                v-bind:key="item.cdId"
                :value="item.cdId"
                >{{ item.cdNm }}</option
              >
            </select>
          </div>
        </div>
      </div>
      <div class="form-item">
        <span class="form-label w-32 lb-txt">{{ $t('parentCdId') }}</span>
        <input v-model="parentInfo" type="text" class="form-control" readonly />
      </div>
      <div class="form-item">
        <span class="form-label w-32 lb-txt">{{ $t('cdVal') }}</span>
        <input
          v-model="newCmcd.cdId"
          type="text"
          class="form-control"
          readonly
          id="cdId"
        />
      </div>
      <div class="form-item">
        <span class="form-label w-32 lb-txt">{{ $t('cdNm') }}</span>
        <div class="input-group">
          <input
            v-model="newCmcd.cdNm"
            type="text"
            class="form-control"
            @input="fnIdInputChk()"
            maxlength="16"
          />
          <button type="button" class="btn btn-gray" @click="fnIdDuplChk()">
            {{ $t('duplication-check') }}
          </button>
        </div>
      </div>
      <div class="form-item">
        <span class="form-label w-32">{{ $t('description') }}</span>
        <div class="form-box width-100">
          <textarea
            v-model="newCmcd.cdDesc"
            cols="34"
            rows="5"
            maxlength="85"
          ></textarea>
        </div>
      </div>
      <div class="form-item">
        <span class="form-label w-32">{{ $t('useYn') }}</span>
        <select class="form-control" v-model="newCmcd.useYn">
          <option
            v-for="item in useOptList"
            v-bind:key="item.optVal"
            :value="item.optVal"
            >{{ item.optKrVal }}</option
          >
        </select>
      </div>
      <div class="form-item">
        <span class="form-label w-32">{{
          $t('commuication-format') + $t('key')
        }}</span>
        <input
          v-model="newCmcd.paramKey"
          type="text"
          class="form-control"
          maxlength="85"
        />
      </div>
      <div class="form-item">
        <span class="form-label w-32">{{
          $t('commuication-format') + $t('value')
        }}</span>
        <input
          v-model="newCmcd.paramVal"
          type="text"
          class="form-control"
          maxlength="85"
        />
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
import Cookies from 'js-cookie'

export default {
  name: 'CmCdMgmtAddSvc',
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
      newCmcd: {
        parentCdId: '',
        cdId: '',
        cdNm: '',
        useYn: 'Y',
        langSet: '',
        paramKey: null,
        paramVal: null,
        firstCdId: '',
        topCdId: 'C000000001',
        cdDesc: null
      },
      cdNmDuplChkFlag: false,
      cdIdDuplChkFlag: false,
      useOptList: [
        { optKrVal: this.$t('use'), optEnVal: 'Y', optVal: 'Y' },
        { optKrVal: this.$t('use-no'), optEnVal: 'N', optVal: 'N' },
        { optKrVal: this.$t('test'), optEnVal: 'T', optVal: 'T' }
      ],
      lvl: 0,
      parentCd: '',
      parentInfo: '',
      langSetCd: 'GN00000021',
      langSetArr: [],
      langSetVal: '',
      langSet: '',
      cdIdDuplChkAPI: '/online/iotcmcd/retrieveDuplicatedCdId',
      secondCmCdList: [{ cdId: '000000', cdNm: this.$t('select') }],
      secondCmCdVal: null,
      thirdCmCdList: [{ cdId: '000000', cdNm: this.$t('select') }],
      thirdCmCdVal: null,
      thirdDisabled: true,
      fourthCmCdList: [{ cdId: '000000', cdNm: this.$t('select') }],
      fourthCmCdVal: null,
      fourthDisabled: true,
      fifthCmCdList: [{ cdId: '000000', cdNm: this.$t('select') }],
      fifthCmCdVal: null,
      fifthDisabled: true,
      langTxt: ''
    }
  },
  created() {
    this.langTxt = this.$t(Cookies.get('LOCALE'))
    // this.langTxt = this.$t(Cookies.get('LOCALE')) === 'ko' ? '한국어' : '영어'
    this.newCmcd.langSet = Cookies.get('LOCALE')
    this.fnSearchCmCdList(0)
    // this.fnGetlangSetList()
    this.secondCmCdVal = '000000'
    this.thirdCmCdVal = '000000'
    this.fourthCmCdVal = '000000'
    this.fifthCmCdVal = '000000'
  },
  mounted() {},
  methods: {
    fnSearchCmCdList(division) {
      let paramObj = {}
      var local = this
      paramObj.langSet = this.newCmcd.langSet
      if (division === 0) {
        this.secondCmCdList = [{ cdId: '000000', cdNm: this.$t('select') }]
        this.secondCmCdVal = '000000'
        this.parentInfo =
          this.secondCmCdVal === '000000' ? '' : this.secondCmCdVal
        paramObj.parentCdId = 'C000000001'
        this.thirdCmCdList = [{ cdId: '000000', cdNm: this.$t('select') }]
        this.fourthCmCdList = [{ cdId: '000000', cdNm: this.$t('select') }]
        this.thirdCmCdVal = '000000'
        this.fourthCmCdVal = '000000'
        this.thirdDisabled = true
        this.fourthDisabled = true
        this.newCmcd.lvl = 1
      } else if (division === 1) {
        paramObj.parentCdId = this.secondCmCdVal
        this.parentInfo =
          this.secondCmCdVal === '000000' ? '' : this.secondCmCdVal
        this.thirdCmCdList = [{ cdId: '000000', cdNm: this.$t('select') }]
        this.fourthCmCdList = [{ cdId: '000000', cdNm: this.$t('select') }]
        this.thirdCmCdVal = '000000'
        this.fourthCmCdVal = '000000'
        this.thirdDisabled = true
        this.fourthDisabled = true
        this.newCmcd.lvl = 2
      } else if (division === 2) {
        paramObj.parentCdId = this.thirdCmCdVal
        this.parentInfo =
          this.thirdCmCdVal === '000000'
            ? this.secondCmCdVal
            : this.thirdCmCdVal
        this.fourthCmCdList = [{ cdId: '000000', cdNm: this.$t('select') }]
        this.fourthCmCdVal = '000000'
        this.newCmcd.lvl = 3
      } else if (division === 3) {
        paramObj.parentCdId = this.fourthCmCdVal
        this.parentInfo =
          this.fourthCmCdVal === '000000'
            ? this.thirdCmCdVal
            : this.fourthCmCdVal
        this.newCmcd.lvl = 4
      }
      paramObj.lvl = 4
      if (paramObj.parentCdId !== '000000') {
        requestApi({
          url: '/online/iotcmcd/retrieveIotParentCmCd',
          headers: {
            'X-MID': 'P00076'
          },
          method: 'post',
          data: paramObj,
          callback: res => {
            this.newCmcd.parentCdId = this.parentInfo
            if (this.newCmcd.lvl !== 1) {
              this.newCmcd.firstCdId = this.parentInfo
            }
            if (res.data.length > 0) {
              this.newCmcd.cdId = ''
              if (division === 0) {
                $.each(res.data, function(idx, obj) {
                  // 서비스, 장비유형 등록 방지
                  // if (obj.cdId !== 'SD00000000') {
                  local.secondCmCdList.push(obj)
                  // }
                })
                this.newCmcd.firstCdId = 'C000000001'
              } else if (division === 1) {
                $.each(res.data, function(idx, obj) {
                  local.thirdCmCdList.push(obj)
                })
                paramObj.parentCdId = this.secondCmCdVal
                this.newCmcd.firstCdId = 'C000000001'
                this.thirdDisabled = false
              } else if (division === 2) {
                $.each(res.data, function(idx, obj) {
                  local.fourthCmCdList.push(obj)
                })
                paramObj.parentCdId = this.thirdCmCdVal
                this.newCmcd.firstCdId = 'C000000001'
                this.fourthDisabled = false
              } else if (division === 3) {
                paramObj.parentCdId = this.fourthCmCdVal
              }
            }
            if (division !== 0) {
              this.fnMakeCdId(paramObj)
            }
          }
        })
      }
    },
    fnMakeCdId(paramObj) {
      requestApi({
        url: '/online/iotcmcd/retrieveIotMaxOrder',
        headers: {
          'X-MID': 'P00077'
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          let tmpKey = res.data.cdId
          if (res.data.cdId === '1') {
            tmpKey = paramObj.parentCdId
          } else {
            tmpKey = res.data.cdId
          }
          let tmpCd = tmpKey.substring(2, tmpKey.length)
          let bb = String(Number(tmpCd) + Number(1))
          let idx = 0
          let aa = null
          if (bb.length < 8) {
            aa = res.data.cdId.substring(0, 2)
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
          this.newCmcd.cdId = tmpKey.substring(0, idx) + aa
        }
      })
    },
    // 언어셋 리스트 조회하는 API 호출
    fnGetlangSetList() {
      var paramObj = {}
      paramObj.parentCdId = this.langSetCd
      requestApi({
        url: '/online/iotcmcd/retrieveIotByParentCmCd',
        headers: {
          'X-MID': 'P00076'
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          this.langSetArr = res.data
          this.newCmcd.langSet = Cookies.get('LOCALE')
          this.fnSearchCmCdList(0)
        }
      })
    },
    fnCdInputChk() {
      this.cdIdDuplChkFlag = false
    },
    fnSpcChrChk(char) {
      return /^[ㄱ-ㅎ가-힣a-zA-Z0-9_-]*$/.test(char)
    },
    fnCdDuplChk() {
      if (
        this.newCmcd.langSet === 'ALL' ||
        this.newCmcd.langSet === undefined
      ) {
        this.alert(this.$t('langSet-select'), 'warning')
      } else if (!this.fnBlankCheck(this.newCmcd.cdId)) {
        this.alert(this.$t('cdId-input-msg'), 'warning')
      } else if (!/^[a-zA-Z0-9_-]*$/.test(this.newCmcd.cdId)) {
        this.alert(this.$t('cdId-spc-char-chk'), 'warning')
      } else if (!/[a-zA-Z|0-9_-]{1,16}/.test(this.newCmcd.cdId)) {
        this.alert(this.$t('cdId-leng-chk'), 'warning')
      } else {
        var reqData = {}
        reqData.cdId = this.newCmcd.cdId
        reqData.langSet = this.newCmcd.langSet
        requestApi({
          url: '/online/iotcmcd/retrieveDuplicatedCdId',
          headers: {
            'X-MID': 'P00076'
          },
          method: 'post',
          data: reqData,
          callback: res => {
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
    fnIdInputChk() {
      this.cdNmDuplChkFlag = false
    },
    fnIdDuplChk() {
      if (
        this.newCmcd.langSet === 'ALL' ||
        this.newCmcd.langSet === undefined
      ) {
        this.alert(this.$t('langSet-select'), 'warning')
      } else if (!this.fnBlankCheck(this.newCmcd.cdNm)) {
        this.alert(this.$t('cmnm-input-msg'), 'warning')
      } else if (!this.fnSpcChrChk(this.newCmcd.cdNm)) {
        this.alert(this.$t('cdNm-spc-char-chk'), 'warning')
      } else if (
        !/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z|0-9_-]{1,16}/.test(this.newCmcd.cdNm)
      ) {
        this.alert(this.$t('cdNm-leng-chk'), 'warning')
      } else {
        var reqData = {}
        reqData.cdNm = this.newCmcd.cdNm
        reqData.langSet = this.newCmcd.langSet
        reqData.parentCdId = this.newCmcd.parentCdId
        requestApi({
          url: '/online/iotcmcd/retrieveDuplicatedCdNm',
          headers: {
            'X-MID': 'P00076'
          },
          method: 'post',
          data: reqData,
          callback: res => {
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
    fnCallApi(reqData, uri) {
      requestApi({
        url: uri,
        headers: {
          'X-MID': 'P00076'
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
    confirmCallback() {
      var uri = '/online/iotcmcd/createIotCmCd'
      if (this.newCmcd.paramKey === '' || this.newCmcd.paramKey === null) {
        delete this.newCmcd.paramKey
      }
      if (this.newCmcd.paramVal === '' || this.newCmcd.paramVal === null) {
        delete this.newCmcd.paramVal
      }
      if (this.newCmcd.cdDesc === '' || this.newCmcd.cdDesc === null) {
        delete this.newCmcd.cdDesc
      }
      this.fnCallApi(this.newCmcd, uri)
    },
    fnBlankCheck(content) {
      var blankPattern = /^\s+|\s+$/g
      if (content === undefined) {
        return false
      } else {
        if (content.replace(blankPattern, '') === '') {
          return false
        } else {
          return true
        }
      }
    },
    fnLangChk(char) {
      return /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z_-]{2,33}/.test(char)
    },
    fnSpecialCharChk(char) {
      return /^[ㄱ-ㅎ가-힣a-zA-Z0-9_-]*$/.test(char)
    },
    submit() {
      if (!this.fnBlankCheck(this.newCmcd.parentCdId)) {
        this.alert(this.$t('parent-cd-select'), 'warning')
      } else if (!this.fnBlankCheck(this.newCmcd.cdNm)) {
        // 코드명 입력여부 체크
        this.alert(this.$t('cmnm-input-msg'), 'warning')
      } else if (!this.cdNmDuplChkFlag) {
        // 중복확인여부 체크
        this.alert(this.$t('cmcd-duplchk-msg'), 'warning')
      } else if (this.newCmcd.cdDesc && this.newCmcd.cdDesc.length > 85) {
        this.alert(this.$t('cdDesc-leng-chk'), 'warning')
      } else if (!this.fnSpecialCharChk(this.newCmcd.paramKey)) {
        this.alert(this.$t('paramKey-spc-char-chk'), 'warning')
      } else {
        // 저장여부 확인
        this.confirm(this.$t('saveYn'), this.confirmCallback)
      }
    }
  }
}
</script>

<style lang="less">
</style>
