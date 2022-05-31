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
        <div class="table-wrap y-scroll">
          <table class="table table-col">
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
                  <input
                    type="hidden"
                    class="form-control"
                    v-model="ipRow.certKey"
                    readonly
                  />
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
        <button @click="insertSolSvrChk()" type="button" class="btn btn-pink">
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
  name: 'SolSvrAddSvc',
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
      colNameData: [
        this.$t('en-ip'),
        this.$t('en-port'),
        this.$t('cert-key'),
        this.$t('use-yn')
      ],
      colModelData: [
        { name: 'ip', index: 'ip', align: 'left', width: '80' },
        { name: 'port', index: 'port', align: 'left', width: '40' },
        { name: 'certKey', index: 'certKey', align: 'left' },
        { name: 'useYn', index: 'useYn', align: 'center', width: '40' }
      ],
      solSvrList: [
        {
          insolCd: '',
          proxy: '',
          protocol: '',
          ip: '',
          port: '',
          certKey: ''
        }
      ],
      dataObj: {
        insolCd: '',
        useYn: 'Y',
        videoYn: 'N',
        serverNm: null,
        certKey: null,
        ipList: [
          {
            ip: '',
            port: '',
            certKey: '',
            activeKey: false,
            useYn: 'Y'
          }
        ]
      },
      inOutSvrList: [],
      useYnList: [{ key: 'Y', value: '사용' }, { key: 'N', value: '미사용' }],
      videoYnList: [
        { key: 'Y', value: '사용' },
        { key: 'N', value: '사용안함' }
      ],
      svcCdList: [],
      serverNmDuplChkFlag: false,
      custDuplChkFlag: false,
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
      xMid: 'P30051'
    }
  },
  created() {
    // 내부/외부 서비스 공통코드 조회
    this.fnSearchCommon(
      this.fnSetService,
      '/online/iotcmcd/retrieveIotByParentCmCdOnly',
      'GN00000229'
    )
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
    retrieveSolSvrCertKey(idx) {
      requestApi({
        url: '/online/iotSolSvr/retrieveSolSvrCertKey',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: this.dataObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.dataObj.ipList[idx].activeKey = true
            this.dataObj.ipList[idx].certKey = res.data.certKey
          }
        }
      })
    },
    fnSearchCommon(callback, reqUrl, parentId) {
      let paramObj = {}
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
        let reqData = {}
        reqData.custSeq = this.dataObj.custSeq
        reqData.serverNm = this.dataObj.serverNm
        requestApi({
          url: '/online/iotSolSvr/retrieveSolSvrNmDupl',
          headers: {
            'X-MID': this.xMid
          },
          method: 'post',
          data: reqData,
          callback: res => {
            // 중복체크 결과에 대한 헤더값 확인
            if (res.result.status === '200' || res.result.status === '204') {
              this.alert(this.$t('success'), 'success')
              this.serverNmDuplChkFlag = true
            } else {
              this.serverNmDuplChkFlag = false
            }
          }
        })
      }
    },
    insertSolSvrChk() {
      if (this.dataObj.serverNm === null) {
        this.alert(this.$t('server-name-write'), 'warning')
        return
      }
      if (this.serverNmDuplChkFlag === false) {
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
      this.confirm(this.$t('register-solsvrm'), this.insertSolSvr)
    },
    insertSolSvr() {
      requestApi({
        url: '/online/iotSolSvr/insertSolSvr',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: this.dataObj,
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

<style lang="less"></style>
