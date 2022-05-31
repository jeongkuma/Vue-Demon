<template>
  <div>
    <div class="modal-body">
      <div class="table-wrap border-none">
          <table class="table table-row">
          <caption>{{$t('menu-copy')}}</caption>
          <colgroup>
            <col style="width:20%">
            <col style="width:auto">
          </colgroup>
          <tbody>
            <tr>
              <th scope="row">{{$t('copy-type')}}</th>
              <td>
                <div class="form-inline" v-on:change="chgFlag">
                  <div class="form-group">
                    <div class="form-radio" >
                      <label class="form-radio-label" for="charSetRadio" >
                        <input class="form-radio-input" type="radio" id="charSetRadio" name="radio" value="C" v-model="radioPicked" >{{$t('charSet')}}
                        <span class="form-radio-sign"></span>
                      </label>
                    </div>
                    <div class="form-radio">
                      <label class="form-radio-label" for="devClsRadio">
                        <input class="form-radio-input" type="radio" id="devClsRadio" name="radio" value="S"  checked="checked" v-model="radioPicked">{{$t('dev-cls')}}
                        <span class="form-radio-sign"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">{{$t('charSet')}}</th>
              <td>
                <div class="left form-inline">
                  <div class="form-group">
                    <select class="form-control" v-model="charSet" :disabled="charSetFlag">
                      <option v-for="item in charSetList" v-bind:key="item.cdId" :value="item.cdId">{{item.cdNm}}</option>
                    </select>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">{{$t('dev-cls')}}</th>
              <td>
                <div class="left form-inline">
                  <div class="form-group">
                    <select class="form-control" v-model="devCls" :disabled="devClsFlag" id="dev_cls_copy_selectBox">
                      <option v-for="item in devClsList" v-bind:key="item.DEV_CLS_CD" :value="item.DEV_CLS_CD">{{item.DEV_CLS_NM}}</option>
                    </select>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button @click="submit()" type="button" class="btn btn-pink">{{$t('copy')}}</button>
        <button @click="close()" type="button" class="btn btn-gray" data-dismiss="modal">{{$t('cancel')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'MenuMgmtCopySvc',
  components: {
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
      charSetList: [],
      devClsList: [],
      radioPicked: '',
      charSet: '',
      devCls: '',
      charSetFlag: true,
      devClsFlag: true
    }
  },
  created () {
    this.fnSearchCommon(this.fnSetChar, '/online/iotcmcd/retrieveIotByParentCmCdRuntime', 'GN00000021')
  },
  mounted () {
  },
  computed: {},
  methods: {
    chgFlag() {
      if (this.radioPicked === 'C') {
        this.charSetFlag = false
        this.devClsFlag = true
      } else {
        this.charSetFlag = true
        this.devClsFlag = false
      }
    },
    fnSearchCommon(callback, reqUrl, parentId) {
      var paramObj = {}
      paramObj.parentCdId = parentId

      requestApi({
        url: reqUrl,
        headers: {
          'X-MID': 'P00074'
        },
        method: 'post',
        data: paramObj,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            callback(res.data)
          }
        }
      })
    },
    fnSetChar(data) {
      var defaultObj = { 'cdId': '', 'cdNm': this.$t('select') }
      this.charSetList = data
      this.charSetList.unshift(defaultObj)
      this.fnAddDevClsList()
      // this.fnSearchCommon(this.fnSetdevCls, '/online/iotcmcd/retrieveIotByParentCmCdOnly', 'SD00000002')
    },
    fnAddDevClsList() {
      var paramObj = {}
      requestApi({
        url: '/online/iotsvc/retrieveIotCmCdForDevDlsCd',
        headers: {
          'X-MID': 'P00074'
        },
        method: 'post',
        data: paramObj,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.devClsList = res.data
            var defaultClsObj = { DEV_CLS_CD: '', DEV_CLS_NM: this.$t('select') }
            this.devClsList.unshift(defaultClsObj)
          }
        }
      })
    },
    // fnSetdevCls(data) {
    //   var defaultObjdevCls = { 'cdId': '', 'cdNm': this.$t('select') }
    //   this.devClsList = data
    //   this.devClsList.unshift(defaultObjdevCls)
    // },
    fnMenuDuplChk(gubun) {
      var dupparamObj = {}
      dupparamObj.langSet = this.charSet
      var reqUrl = ''
      if (gubun === 'N') {
        dupparamObj.menuCdNm = this.menuCdNm
        reqUrl = '/online/com/menu/menuNmDuplicatChk'
      } else {
        dupparamObj.menuCdId = this.menuCdId
        reqUrl = '/online/com/menu/menuIdDuplicatChk'
      }
      requestApi({
        url: reqUrl,
        headers: {
          'X-MID': 'P00074'
        },
        method: 'post',
        data: dupparamObj,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(res.data.msg)
            if (gubun === 'N') {
              this.menuNmDupChk = true
            } else {
              this.menuIdDupChk = true
            }
          }
        }
      })
    },
    submit () {
      if (this.radioPicked === '') {
        this.alert(this.$t('select-menuCopyType'), 'warning')
      } else {
        this.confirm(this.$t('copyYn'), this.fnCallCopyApi)
      }
    },
    fnCallCopyApi() {
      var copyData = {}
      var copyUrl = ''
      var target = document.getElementById('dev_cls_copy_selectBox')
      copyData.tmplSeq = this.data.tmplSeq
      copyData.orgLangSet = this.data.charSet
      copyData.orgDevClsCd = this.data.devCls
      copyData.copyType = this.radioPicked
      copyData.langSet = this.charSet
      copyData.devClsCd = this.devCls
      copyData.devClsCdNm = target.options[target.selectedIndex].text
      if (this.radioPicked === 'C') {
        copyUrl = '/online/com/tmpl/copyCharSetJqGrid'
      } else {
        copyUrl = '/online/com/tmpl/copydevClsJqGrid'
      }
      requestApi({
        url: copyUrl,
        headers: {
          'X-MID': 'P00074'
        },
        method: 'post',
        data: copyData,
        callback: (res) => {
          if (res.result.status === '200') {
            this.callback()
            this.alert(this.$t('copy-success'), 'success').then(() => { this.close() })
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
