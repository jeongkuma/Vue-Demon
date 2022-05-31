<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{ $t('servMtServNm') }}</span>
          <select class="form-control" v-model="dataObj.serverCd" disabled>
            <option
              v-for="item in serverList"
              v-bind:Key="item.cdId"
              :value="item.cdId"
              >{{ item.cdNm }}</option
            >
          </select>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{ $t('vpUserId') }}</span>
          <input
            v-model="dataObj.usrLoginId"
            type="text"
            class="form-control"
            readonly
          />
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{ $t('vpUserNm') }}</span>
          <input
            v-model="dataObj.usrNm"
            type="text"
            class="form-control"
            readonly
          />
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{ $t('useYn') }}</span>
          <input
            v-model="dataObj.usrStatusNm"
            type="text"
            class="form-control"
            readonly
          />
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{ $t('contact-number') }}</span>
          <input
            v-model="dataObj.usrPhoneNo"
            type="text"
            class="form-control"
            readonly
          />
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{ $t('iotId') }}</span>
          <input
            v-model="dataObj.iotUserId"
            type="text"
            class="form-control"
            readonly
          />
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{ $t('email') }}</span>
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="emailAddr"
              readonly
            />
            <span class="mx-2">@</span>
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                v-model="emailCorps"
                readonly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center btn-wrap">
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
import { requestApi } from '@/api/ccp/requestApi'

export default {
  name: 'VpUserDetailSvc',
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
      vpUsrSeq: null,
      serverList: [],
      dataObj: {},
      emailCorps: '',
      emailAddr: '',
      xMid: 'P00332'
    }
  },
  created() {
    this.vpUsrSeq = this.data.object.vpUsrSeq
    this.serverList = this.data.serverList
    this.getIotVpUserDetail()
  },
  mounted() {},
  computed: {
    emailAddress: function() {
      var emailAdd = this.emailAddr + '@' + this.emailCorps
      return emailAdd === '@' ? '' : emailAdd
    }
  },
  methods: {
    getIotVpUserDetail() {
      requestApi({
        url: '/online/vpuser/getIotVpUserDetail',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: { vpUsrSeq: this.vpUsrSeq },
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.dataObj = res.data
            if (res.data.usrEmail !== null) {
              let emailStr = res.data.usrEmail.split('@')
              this.emailAddr = emailStr[0]
              this.emailCorps = emailStr[1]
            }
          }
        }
      })
    },
    fnMakeUsrInfo() {
      this.dataObj.usrEmail = this.emailAddress
      // this.dataObj.roleCdId = this.dataObj.roleCdId
      // $.each(this.roleList, function(idx, obj) {
      //   if (obj.cdId === local.dataObj.roleCdId) {
      //     local.dataObj.roleCdNm = obj.cdNm
      //   }
      // })
    }
  }
}
</script>

<style lang="less"></style>
