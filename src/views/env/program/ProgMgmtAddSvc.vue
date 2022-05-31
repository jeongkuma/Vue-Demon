<template>
  <div>
    <div class="modal-body">
      <div class="form-item">
        <span class="form-label w-40 lb-txt">{{ $t('prog-id') }}</span>
        <input
          v-model="dataObj.progId"
          type="text"
          class="form-control"
          readonly
          maxlength="50"
        />
      </div>
      <div class="form-item">
        <span class="form-label w-40 lb-txt">{{ $t('prog-name') }}</span>
        <input
          v-model="dataObj.progNm"
          type="text"
          class="form-control"
          maxlength="16"
        />
      </div>
      <div class="form-item">
        <span class="form-label w-40 lb-txt">{{ $t('router-path') }}</span>
        <div class="input-group">
          <input
            v-model="dataObj.uiPath"
            type="text"
            class="form-control"
            @input="fnDuplChk('U')"
            maxlength="150"
            style="width:400px;"
          />
          <button
            type="button"
            class="btn btn-gray input-group-addon"
            @click="duplicationChk('U')"
          >
            {{ $t('duplication-check') }}
          </button>
        </div>
      </div>
      <div class="form-item">
        <span class="form-label w-40 lb-txt">{{ $t('prog-path') }}</span>
        <div class="input-group">
          <input
            v-model="dataObj.progUri"
            type="text"
            class="form-control"
            @input="fnDuplChk('P')"
            maxlength="256"
            style="width:400px;"
          />
          <button
            type="button"
            class="btn btn-gray input-group-addon"
            @click="duplicationChk('P')"
          >
            {{ $t('duplication-check') }}
          </button>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-5">
          <span class="form-label w-40 lb-txt">{{ $t('useYn') }}</span>
          <select class="form-control" v-model="dataObj.useYn">
            <option
              v-for="item in useOptList"
              v-bind:key="item.optVal"
              :value="item.optVal"
              >{{ item.optKrVal }}</option
            >
          </select>
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
  name: 'ProgMgmtAddSvc',
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
      dataObj: { progId: '', progNm: '', uiPath: '', progUri: '', useYn: 'Y' },
      useOptList: [
        { optKrVal: this.$t('use'), optEnVal: 'Y', optVal: 'Y' },
        { optKrVal: this.$t('use-no'), optEnVal: 'N', optVal: 'N' }
      ],
      progIdDuplChkFlag: true,
      uiPathDuplChkFlag: false,
      progUriDuplChkFlag: false
    }
  },
  created() {},
  mounted() {
    this.autoIotProgId()
  },
  computed: {},
  methods: {
    autoIotProgId() {
      // 입력값 체크
      requestApi({
        url: '/online/com/prog/autoIotProgId',
        headers: {
          'X-MID': 'P00083'
        },
        method: 'post',
        data: {},
        callback: res => {
          this.dataObj.progId = res.data.progId
        }
      })
    },
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
        // 숫자,영문,특수문자(_/) 허용
        this.dataObj.progId = event.target.value = event.target.value.replace(
          /[^a-zA-Z0-9]/g,
          ''
        )
      }
    },
    duplicationChk(gubun) {
      // 입력값 체크
      var valTitle = ''
      var reqData = {}
      var requestApiUri = ''
      if (gubun === 'U') {
        if (!this.dataObj.uiPath.startsWith('/')) {
          this.dataObj.uiPath = '/' + this.dataObj.uiPath
        }
        reqData.uiPath = this.dataObj.uiPath
        requestApiUri = '/online/com/prog/duplicationCheckIotProgUiPath'
      } else if (gubun === 'P') {
        if (!this.dataObj.progUri.startsWith('/')) {
          this.dataObj.progUri = '/' + this.dataObj.progUri
        }

        reqData.progUri = this.dataObj.progUri
        requestApiUri = '/online/com/prog/duplicationCheckIotProgPath'
      } else {
        reqData.progId = this.dataObj.progId
        requestApiUri = '/online/com/prog/duplicationCheckIotProgId'

        if (this.dataObj.progId.trim() === '') {
          valTitle = this.$t('prog-id-alert')
          this.alert(valTitle + this.$t('prog-inputReqValue'), 'warning')
          return
        }
      }
      requestApi({
        url: requestApiUri,
        headers: {
          'X-MID': 'P00083'
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
    },
    submit() {
      if (
        this.dataObj.progId.trim() === '' ||
        this.dataObj.progNm.trim() === '' ||
        this.dataObj.uiPath.trim() === '' ||
        this.dataObj.progUri.trim() === ''
      ) {
        var valTitle = ''
        if (this.dataObj.progId.trim() === '') {
          valTitle = this.$t('prog-id-alert')
        } else if (this.dataObj.progNm.trim() === '') {
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
        this.confirm(this.$t('saveYn'), this.fnCallInsertApi)
      }
    },
    fnCallInsertApi() {
      var reqData = {}
      reqData.progGubun = 'P'
      reqData.progId = this.dataObj.progId
      reqData.progNm = this.dataObj.progNm
      reqData.progUri = this.dataObj.progUri
      reqData.uiPath = this.dataObj.uiPath
      reqData.useYn = this.dataObj.useYn
      requestApi({
        url: '/online/com/prog/insertIotProg',
        headers: {
          'X-MID': 'P00083'
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>
