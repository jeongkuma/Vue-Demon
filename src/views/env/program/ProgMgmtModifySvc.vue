<template>
  <div>
    <div class="modal-body">
      <div class="form-item">
        <span class="form-label w-40 lb-txt">{{$t('prog-id')}}</span>
        <input
          v-model="dataObj.progId"
          type="text"
          class="form-control"
          readonly
        >
      </div>
      <div class="form-item">
        <span class="form-label w-40 lb-txt">{{$t('prog-name')}}</span>
        <input
          v-model="dataObj.progNm"
          type="text"
          class="form-control"
          maxlength="16"
        >
      </div>
      <div class="form-item">
        <span class="form-label w-40 lb-txt">{{$t('router-path')}}</span>
        <div class="input-group">
          <input
            v-model="dataObj.uiPath"
            type="text"
            class="form-control"
            @input="fnDuplChk('U')"
            maxlength="150"
            style="width:400px;"
          >
          <button
            type="button"
            class="btn btn-gray input-group-addon"
            @click="duplicationChk('U')"
          >{{$t('duplication-check')}}</button>
        </div>
      </div>
      <div class="form-item">
        <span class="form-label w-40 lb-txt">{{$t('prog-path')}}</span>
        <div class="input-group">
          <input
            v-model="dataObj.progUri"
            type="text"
            class="form-control"
            @input="fnDuplChk('P')"
            maxlength="256"
            style="width:400px;"
          >
          <button
            type="button"
            class="btn btn-gray input-group-addon"
            @click="duplicationChk('P')"
          >{{$t('duplication-check')}}</button>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-5">
          <span class="form-label w-40 lb-txt">{{$t('useYn')}}</span>
          <select class="form-control" v-model="dataObj.useYn">
            <option
              v-for="item in useOptList"
              v-bind:key="item.optVal"
              :value="item.optVal"
            >{{item.optKrVal}}</option>
          </select>
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
  name: 'ProgMgmtModifySvc',
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
      dataObj: { progId: '', progNm: '', uiPath: '', progUri: '', useYn: '' },
      useOptList: [
        { optKrVal: this.$t('use'), optEnVal: 'Y', optVal: 'Y' },
        { optKrVal: this.$t('use-no'), optEnVal: 'N', optVal: 'N' }
      ],
      progUriDuplChkFlag: true,
      uiPathDuplChkFlag: true,
      progIdDuplChkFlag: true,
      orgUiPath: '',
      orgProgUri: ''
    }
  },
  created() {
    this.fnSearchModifyData()
  },
  mounted() {},
  computed: {},
  methods: {
    fnDuplChk(gubun) {
      var event = window.event

      // U / P / I
      if (gubun === 'P') {
        this.progUriDuplChkFlag = false
        // 숫자,영문,특수문자(_/) 허용
        this.dataObj.progUri = event.target.value = event.target.value.replace(
          /[^a-zA-Z0-9_/]/g,
          ''
        )
      } else if (gubun === 'U') {
        this.uiPathDuplChkFlag = false
        // 숫자,영문,특수문자(_/) 허용
        this.dataObj.uiPath = event.target.value = event.target.value.replace(
          /[^a-zA-Z0-9_/]/g,
          ''
        )
      } else {
        this.progIdDuplChkFlag = false
      }
    },
    duplicationChk(gubun) {
      if (gubun === 'P' && !this.dataObj.progUri.startsWith('/')) {
        this.dataObj.progUri = '/' + this.dataObj.progUri
      }
      if (gubun === 'U' && !this.dataObj.uiPath.startsWith('/')) {
        this.dataObj.uiPath = '/' + this.dataObj.uiPath
      }
      if (gubun === 'P' && this.orgProgUri === this.dataObj.progUri) {
        this.alert(this.$t('useAble'))
        this.uiPathDuplChkFlag = true
      } else if (gubun === 'U' && this.orgUiPath === this.dataObj.uiPath) {
        this.alert(this.$t('useAble'))
        this.progIdDuplChkFlag = true
      } else {
        var reqData = {}
        var requestApiUri = ''
        if (gubun === 'U') {
          reqData.uiPath = this.dataObj.uiPath
          requestApiUri = '/online/com/prog/duplicationCheckIotProgUiPath'
        } else if (gubun === 'P') {
          reqData.progUri = this.dataObj.progUri
          requestApiUri = '/online/com/prog/duplicationCheckIotProgPath'
        } else {
          reqData.progId = this.dataObj.progId
          requestApiUri = '/online/com/prog/duplicationCheckIotProgId'
        }
        requestApi({
          url: requestApiUri,
          headers: {
            'X-MID': 'P00084'
          },
          method: 'post',
          data: reqData,
          callback: res => {
            if (res.result.status === '200' || res.result.status === '204') {
              this.alert(res.data.msg, 'success')
              if (gubun === 'P') {
                this.progUriDuplChkFlag = true
              } else if (gubun === 'U') {
                this.uiPathDuplChkFlag = true
              } else {
                this.progIdDuplChkFlag = true
              }
            }
          }
        })
      }
    },
    fnSearchModifyData() {
      var paramObj = {}
      paramObj.progSeq = this.data.idx

      requestApi({
        url: '/online/com/prog/getIotProgDetail',
        headers: {
          'X-MID': 'P00084'
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.dataObj = res.data
            this.orgUiPath = this.dataObj.uiPath
            this.orgProgUri = this.dataObj.progUri
          }
        }
      })
    },
    submit() {
      if (
        this.dataObj.progNm.trim() === '' ||
        this.dataObj.uiPath.trim() === '' ||
        this.dataObj.progUri.trim() === ''
      ) {
        var valTitle = ''
        if (this.dataObj.progNm.trim() === '') {
          valTitle = this.$t('prog-name-alert')
        } else if (this.dataObj.uiPath.trim() === '') {
          valTitle = this.$t('router-path-alert')
        } else if (this.dataObj.progUri.trim() === '') {
          valTitle = this.$t('prog-path-alert')
        }
        this.alert(valTitle + this.$t('prog-inputReqValue'), 'warning')
      } else if (this.dataObj.uiPath.startsWith('//')) {
        this.alert(this.$t('router-incorrect-msg'), 'warning')
      } else if (this.dataObj.progUri.startsWith('//')) {
        this.alert(this.$t('prog-path-incorrect-msg'), 'warning')
      } else if (!this.progIdDuplChkFlag) {
        this.alert(this.$t('progId-duplchk-msg'), 'warning')
      } else if (!this.uiPathDuplChkFlag) {
        this.alert(this.$t('router-duplchk-msg'), 'warning')
      } else if (!this.progUriDuplChkFlag) {
        this.alert(this.$t('prog-path-duplchk-msg'), 'warning')
      } else {
        this.confirm(this.$t('saveYn'), this.fnCallModifyApi)
      }
    },
    fnCallModifyApi() {
      var reqData = {}
      reqData.progSeq = this.data.idx
      reqData.progNm = this.dataObj.progNm
      reqData.useYn = this.dataObj.useYn
      reqData.progUri = this.dataObj.progUri
      reqData.uiPath = this.dataObj.uiPath
      requestApi({
        url: '/online/com/prog/updateIotProg',
        headers: {
          'X-MID': 'P00084'
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('save-success'), 'success')
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
