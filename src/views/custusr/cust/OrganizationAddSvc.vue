<template>
  <div>
    <div class="modal-body">
      <div class="form-item">
        <span class="form-label w-32 b-txt">{{$t('up-orgnm')}}</span>
        <input v-model="dataObj.upOrgNm" type="text" class="form-control" readonly>
      </div>

      <div class="form-item">
        <span class="form-label w-32 lb-txt">{{$t('orgnm')}}</span>
        <div class="input-group">
          <input v-model="dataObj.orgNm" type="text" class="form-control" @change="orgNmChkFlag = false" maxlength="33">
          <button type="button" class="btn btn-gray input-gruop-addon" @click="fnOrgDuplChk()">{{$t('duplication-check')}}</button>
        </div>
      </div>

      <div class="form-item">
        <span class="form-label w-32"></span>
        <div>※ {{$t('orgNm-regx')}}</div>
      </div>

      <div class="form-item">
        <span class="form-label w-32 lb-txt">{{$t('useYn')}}</span>
        <select v-model="dataObj.useYn" class="form-control">
          <option v-for="item in useOptList" v-bind:key="item.optVal" :value="item.optVal">{{item.optNm}}</option>
        </select>
      </div>

    </div>
    <div class="modal-footer">
      <div class="text-center btn-wrap">
        <button @click="submit()" type="button" class="btn btn-pink">{{$t('registration')}}</button>
        <button @click="close()" type="button" class="btn btn-gray" data-dismiss="modal">{{$t('cancel')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'org-add',
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
      dataObj: { upOrgNm: null, orgNm: null, useYn: null },
      parentOrg: { orgNm: null, orgSeq: null },
      useOptList: [
        { optNm: this.$t('use'), optVal: 'Y' },
        { optNm: this.$t('use-no'), optVal: 'N' }
      ],
      retrieveOrgBySeqAPI: '/online/iotorg/retrieveIotOrgBySeq',
      createIotOrgAPI: '/online/iotorg/createIotOrg',
      retrieveIotOrgNmChk: '/online/iotorg/retrieveIotOrgNmChk',
      orgNmChkFlag: false
    }
  },
  created () {
    this.parentOrgSeq = this.data.idx
    this.dataObj.useYn = 'Y'
    var paramObj = {}
    paramObj.orgSeq = this.parentOrgSeq
    this.fnCallAPI(this.retrieveOrgBySeqAPI, paramObj, true)
  },
  mounted () {},
  computed: {},
  methods: {
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
    fnOrgDuplChk () {
      if (!this.fnBlankCheck(this.dataObj.orgNm)) {
        this.alert(this.$t('orgNm-input'), 'warning')
      } else if (this.dataObj.orgNm.length < 2 || this.dataObj.orgNm.length > 33) {
        this.alert(this.$t('orgNm-leng-chk'), 'warning')
      } else {
        var paramObj = {}
        paramObj.orgNm = this.dataObj.orgNm
        this.orgNmDuplChk = true
        requestApi({
          url: this.retrieveIotOrgNmChk,
          headers: {
            'X-MID': 'P00040'
          },
          method: 'post',
          data: paramObj,
          callback: (res) => {
            if (res.result.status === '200' || res.result.status === '204') {
              this.alert(res.data.message, 'success')
              this.orgNmChkFlag = true
            } else {
              this.orgNmChkFlag = false
            }
          }
        })
      }
    },
    fnCallAPI (url, data, isFisrt) {
      requestApi({
        url: url,
        headers: {
          'X-MID': 'P00040'
        },
        method: 'post',
        data: data,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            if (isFisrt) {
              this.parentOrg = res.data
              this.dataObj.upOrgNm = this.parentOrg.orgNm
            } else {
              this.callback()
              this.close()
              this.alert(this.$t('save-success'), 'success')
            }
          }
        }
      })
    },
    // 컨펌 모달
    showConfirmPopup (msg) {
      this.confirm(msg, this.confirmCallback)
    },
    confirmCallback() {
      this.dataObj.orgPath = this.parentOrg.orgPath + '/' + this.dataObj.orgNm
      this.dataObj.orgLvl = parseInt(this.parentOrg.orgLvl) + 1
      this.dataObj.upOrgSeq = this.parentOrg.orgSeq
      this.fnCallAPI(this.createIotOrgAPI, this.dataObj, false)
    },
    submit () {
      if (!this.fnBlankCheck(this.dataObj.orgNm)) {
        this.alert(this.$t('orgNm-input'), 'warning')
      } else if (this.dataObj.orgNm.length < 2 || this.dataObj.orgNm.length > 33) {
        this.alert(this.$t('orgNm-leng-chk'), 'warning')
      } else if (!this.orgNmChkFlag) {
        this.alert(this.$t('orgNm-dupl-chk'), 'warning')
      } else {
        this.showConfirmPopup(this.$t('saveYn'))
      }
    }
  }
}
</script>

<style lang="less">

</style>
