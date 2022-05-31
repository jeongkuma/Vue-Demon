<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-28 lb-txt">{{ $t('server-nm') }}</span>
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="dataObj.serverNm"
              @change="serverNmDuplChkFlag = false"
            />
            <button
              type="button"
              class="btn btn-gray pull-right"
              @click="retrieveSolSvrNmDupl()"
            >
              {{ $t('duplication-check') }}
            </button>
          </div>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-44 lb-txt">{{ $t('inExSplit') }}</span>
          <select name class="form-control" v-model="dataObj.insolCd">
            <option
              v-for="item in inOutSvrList"
              v-bind:key="item.cdId"
              :value="item.cdId"
            >{{ item.cdNm }}</option
            >
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-28 lb-txt">{{ $t('useYn') }}</span>
          <select name class="form-control" v-model="dataObj.useYn">
            <option
              v-for="item in useYnList"
              :key="item.key"
              :value="item.key"
              >{{ item.value }}</option
            >
          </select>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-44 lb-txt">{{ $t('videoYn') }}</span>
          <select name class="form-control" v-model="dataObj.videoYn">
            <option
              v-for="item in videoYnList"
              v-bind:key="item.key"
              :value="item.key"
            >{{ item.value }}</option
            >
          </select>
        </div>
      </div>
      <div class="btn-wrap text-right">
        <button @click="insertRowIpList()" type="button" class="btn btn-pink">
          {{ $t('ip-add') }}
        </button>
      </div>
      <div class="grid-container wide grid-scroll full-size mt-1">
        <div class="table-wrap y-scroll auto">
          <table class="table table-col">
            <caption></caption>
            <colgroup>
              <col style="width:100px" />
              <col style="width:50px" />
              <col style="width:200px" />
              <col style="width:100px" />
              <col style="width:100px" />
            </colgroup>
            <thead>
              <tr>
                <th>IP</th>
                <th>PORT</th>
                <th>Cert Key</th>
                <th>사용여부</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(ipRow, idx) in dataObj.ipList" :key="'ip_' + idx">
                <td>
                  <input
                    class="form-control"
                    type="text"
                    title="IP"
                    v-model="ipRow.ip"
                  />
                </td>
                <td>
                  <input
                    class="form-control"
                    type="text"
                    title="PORT"
                    v-model="ipRow.port"
                  />
                </td>
                <td>
                  <button
                    class="btn btn-gray"
                    v-if="!ipRow.activeKey"
                    @click="retrieveSolSvrCertKey(idx)"
                  >
                    Key 생성
                  </button>
                  <input type="hidden" v-model="ipRow.certKey" readonly />
                  <span class="form-control-static" v-if="ipRow.activeKey">{{
                    ipRow.certKey
                  }}</span>
                </td>
                <td>
                  <select
                    class="form-control"
                    title="사용여부"
                    v-model="ipRow.useYn"
                  >
                    <option
                      v-for="item in useYnList"
                      :key="item.key"
                      :value="item.key"
                      >{{ item.value }}</option
                    >
                  </select>
                </td>
                <td>
                  <button
                    class="btn btn-gray"
                    type="button"
                    @click="deleteRowIpList(idx)"
                  >
                    {{ $t('delete') }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center btn-wrap">
        <button @click="updateSolSvrChk()" type="button" class="btn btn-pink">
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
  name: 'SolSvrModSvc',
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
      paramObj: {},
      dataObj: {
        solSvrSeq: '',
        insolCd: '',
        custSeq: '',
        svcNm: '',
        useYn: 'Y',
        videoYn: 'N',
        serverNm: null,
        certKey: null,
        ipList: []
      },
      inOutSvrList: [],
      useYnList: [{ key: 'Y', value: '사용' }, { key: 'N', value: '사용안함' }],
      videoYnList: [
        { key: 'Y', value: '사용' },
        { key: 'N', value: '사용안함' }
      ],
      solIpList: [],
      solsvrmOriginalObj: {},
      serverNmDuplChkFlag: false,
      isIssued: false,
      ipDefaultData: [
        {
          ip: '',
          port: '',
          certKey: '',
          activeKey: false,
          useYn: 'Y'
        }
      ],
      xMid: 'P30052'
    }
  },
  created() {
    // 내부/외부 서비스 공통코드 조회
    this.fnSearchCommon(
      this.fnSetService,
      '/online/iotcmcd/retrieveIotByParentCmCdOnly',
      'GN00000229'
    )
    this.retrieveSolSvrDetail()
  },
  mounted() {},
  computed: {},
  methods: {
    insertRowIpList() {
      this.dataObj.ipList = _.cloneDeep(
        this.dataObj.ipList.concat(this.ipDefaultData)
      )
    },
    deleteRowIpList(idx) {
      this.dataObj.ipList.splice(idx, 1)
    },
    retrieveSolSvrDetail() {
      let paramObj = {}
      paramObj.solSvrSeq = this.data.solSvrSeq
      requestApi({
        url: '/online/iotSolSvr/retrieveSolSvrDetail',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          // console.log(res)
          if (res.result.status === '200' || res.result.status === '204') {
            res.data.dataObj.ipList.forEach(data => {
              if (data.activeKey === '0') {
                data.activeKey = false
              }
            })
            this.dataObj = res.data.dataObj
            this.solsvrmOriginalObj = { ...this.dataObj }
          }
        }
      })
    },
    retrieveSolSvrCertKey(idx) {
      requestApi({
        url: '/online/iotSolSvr/retrieveSolSvrCertKey',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: this.dataObj,
        callback: res => {
          // console.log(res)
          // 중복체크 결과에 대한 헤더값 확인
          if (res.result.status === '200' || res.result.status === '204') {
            this.dataObj.ipList[idx].activeKey = true
            this.dataObj.ipList[idx].certKey = res.data.certKey
          }
        }
      })
    },
    fnSearchCommon(callback, reqUrl, parentId) {
      var paramObj = {}
      paramObj.parentCdId = parentId

      requestApi({
        url: reqUrl,
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.inOutSvrList = res.data
            this.dataObj.insolCd = this.inOutSvrList[0].cdId
          }
        }
      })
    },
    retrieveSolSvrNmDupl() {
      if (this.dataObj.serverNm == null || this.dataObj.serverNm === '') {
        this.alert(this.$t('server-name-write'), 'warning')
      } else {
        requestApi({
          url: '/online/iotSolSvr/retrieveSolSvrNmDupl',
          headers: {
            'X-MID': this.xMid
          },
          method: 'post',
          data: this.dataObj,
          callback: res => {
            if (res.result.status === '200' || res.result.status === '204') {
              this.alert(this.$t('save-success'), 'success')
              this.serverNmDuplChkFlag = true
            } else {
              this.serverNmDuplChkFlag = false
            }
          }
        })
      }
    },
    updateSolSvrChk() {
      if (this.dataObj.serverNm === null) {
        this.alert(this.$t('server-name-write'), 'warning')
        return
      }
      if (
        this.serverNmDuplChkFlag === false &&
        this.solsvrmOriginalObj.serverNm !== this.dataObj.serverNm
      ) {
        this.alert(this.$t('svrnm-duplchk-msg'), 'warning')
        return
      }

      let count = 0
      this.dataObj.ipList.forEach(ipRow => {
        if (ipRow.useYn === 'Y') {
          count++
        }
      })

      if (count > 1) {
        this.alert(this.$t('limitIpCount'), 'warning')
        return
      }

      this.confirm(this.$t('modify-solsvrm'), this.updateSolSvr)
    },
    updateSolSvr() {
      requestApi({
        url: '/online/iotSolSvr/updateSolSvr',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: this.dataObj,
        callback: res => {
          // console.log(res)
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

<style lang="less"></style>
