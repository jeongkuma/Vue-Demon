<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-12 col-lg-6">
          <span class="form-label w-28 lb-txt">{{ $t('service') }}</span>
          <select name="" class="form-control" v-model="dataObj.svcCd">
            <option
              v-for="(svc, index) in svcCdList"
              :key="`svcCd-${index}`"
              :value="svc.svcCd"
              >{{ svc.svcCdNm }}</option
            >
          </select>
        </div>
        <div class="form-item col-sm-12 col-lg-6">
          <span class="form-label w-28 lb-txt">{{ $t('customer') }}</span>
          <select name="custNm" class="form-control" v-model="dataObj.custSeq">
            <option value="">{{ $t('select') }}</option>
            <option
              v-for="item in customerList"
              v-bind:key="item.custSeq"
              :value="item.custSeq"
              >{{ item.custNm }}</option
            >
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-12 col-lg-6">
          <span class="form-label w-28 lb-txt">{{ $t('server-nm') }}</span>
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="dataObj.serverNm"
            />
            <button
              type="button"
              class="btn btn-gray input-group-button"
              @click="fnServerNmDuplication()"
            >
              {{ $t('duplication-check') }}
            </button>
          </div>
        </div>
        <div class="form-item col-sm-12 col-lg-6">
          <span class="form-label w-28 lb-txt">{{ $t('inExSplit') }}</span>
          <select name class="form-control" v-model="dataObj.inoutCd">
            <option
              v-for="item in inexList"
              v-bind:key="item.value"
              :value="item.value"
              >{{ item.key }}</option
            >
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-12 col-lg-6">
          <span class="form-label w-28 lb-txt">{{ $t('server-token') }}</span>
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="dataObj.certKey"
              readonly
            />
            <button
              type="button"
              class="btn btn-gray"
              @click="makeSvrToken()"
              :disabled="isIssued"
            >
              {{ $t('issue') }}
            </button>
          </div>
        </div>
        <div class="form-item col-sm-12 col-lg-6">
          <span class="form-label w-28 lb-txt">{{ $t('useYn') }}</span>
          <select name class="form-control" v-model="dataObj.useYn">
            <option
              v-for="item in useYnList"
              v-bind:key="item.key"
              :value="item.value"
              >{{ item.key }}</option
            >
          </select>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center btn-wrap">
        <button @click="fnCustDuplication()" type="button" class="btn btn-pink">
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
import { getSvcList } from '@/api/common/usrSvcDevice'

export default {
  name: 'externalSvr-create',
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
      colNameList: [
        this.$t('division'),
        this.$t('en-proxy'),
        this.$t('en-protocol'),
        this.$t('en-ip'),
        this.$t('en-port'),
        this.$t('cert-key')
      ],
      colModelList: [
        { name: 'inoutCd', index: 'inoutCd', align: 'left', width: '15' },
        { name: 'proxy', index: 'proxy', align: 'left', width: '50' },
        { name: 'protocol', index: 'protocol', align: 'left', width: '50' },
        { name: 'ip', index: 'ip', align: 'left', width: '80' },
        { name: 'port', index: 'port', align: 'left', width: '40' },
        { name: 'certKey', index: 'certKey', align: 'left' }
      ],
      outSvrList: [
        {
          inoutCd: '',
          proxy: '',
          protocol: '',
          ip: '',
          port: '',
          certKey: ''
        }
      ],
      dataObj: {
        inoutCd: 'GN00000230',
        useYn: 'Y',
        serverNm: null,
        certKey: null,
        custSeq: '',
        svcCd: ''
      },
      inexList: [
        { value: 'GN00000230', key: '내부서비스' },
        { value: 'GN00000231', key: '외부서비스' }
      ],
      useYnList: [{ value: 'Y', key: '사용' }, { value: 'N', key: '사용안함' }],
      reportOptList: [],
      failureOptList: [],
      customerList: [],
      isSave: false,
      serverNmDuplChkFlag: false,
      custDuplChkFlag: false,
      isIssued: false,
      svcCdList: [],
      xMid: 'P20041'
    }
  },
  created() {
    this.getCustNmList()
    this.fnGetSvcCdList()
  },
  mounted() {},
  computed: {},
  methods: {
    fnGetSvcCdList() {
      getSvcList({ xMid: this.xMid })
        .then(data => {
          this.svcCdList = data
          if (this.svcCdList.length > 0) {
            this.dataObj.svcCd = this.svcCdList[0].svcCd
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    getCustNmList() {
      const paramObj = {}
      paramObj.svcCd = this.svcCd

      requestApi({
        url: '/online/iotoutsvrreport/cmnctSttsCustNmList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          // console.log(res)
          if (res.result.status === '200' || res.result.status === '204') {
            this.customerList = res.data.cmnctSttsCustNmList
          }
        }
      })
    },
    fnAddOutSvr() {
      const reqData = {}
      reqData.custSeq = this.dataObj.custSeq
      reqData.svcCd = this.dataObj.svcCd
      reqData.serverNm = this.dataObj.serverNm
      reqData.inoutCd = this.dataObj.inoutCd
      reqData.certKey = this.dataObj.certKey
      reqData.useYn = this.dataObj.useYn
      reqData.svcCd = this.dataObj.svcCd

      requestApi({
        url: '/online/iotmanage/createoutsvrm',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.isSave = true
            this.alert(this.$t('save-success'), 'success')
            this.callback()
            this.close()
          }
        }
      })
    },
    fnServerNmDuplication() {
      if (this.dataObj.serverNm == null || this.dataObj.serverNm === '') {
        this.alert(this.$t('server-name-write'), 'warning')
      } else {
        var reqData = {}
        reqData.custSeq = this.dataObj.custSeq
        reqData.serverNm = this.dataObj.serverNm
        requestApi({
          url: '/online/iotmanage/retrieveDuplicatedSvrNm',
          headers: {
            'X-MID': this.xMid
          },
          method: 'post',
          data: reqData,
          callback: res => {
            if (res.result.status === '200' || res.result.status === '204') {
              this.alert(res.data.msg, 'success')
              this.serverNmDuplChkFlag = true
            } else {
              this.serverNmDuplChkFlag = false
            }
          }
        })
      }
    },
    fnCustDuplication() {
      if (this.dataObj.custSeq === '') {
        this.alert(this.$t('select-cust-nm'), 'warning')
        return
      }
      if (this.dataObj.serverNm === null) {
        this.alert(this.$t('server-name-write'), 'warning')
        return
      }
      if (this.serverNmDuplChkFlag === false) {
        this.alert(this.$t('svrnm-duplchk-msg'), 'warning')
        return
      } else if (this.isIssued === false) {
        this.alert(this.$t('certkey-issue-msg'), 'warning')
        return
      }
      this.confirm(this.$t('saveYn'), this.fnAddOutSvr)
    },
    makeSvrToken() {
      var reqData = {}
      this.isIssued = true
      requestApi({
        url: '/online/iotmanage/makeissue',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          // 중복체크 결과에 대한 헤더값 확인
          if (res.result.status === '200' || res.result.status === '204') {
            this.dataObj.certKey = res.data.certKey
          }
        }
      })
    }
  }
}
</script>

<style lang="less"></style>
