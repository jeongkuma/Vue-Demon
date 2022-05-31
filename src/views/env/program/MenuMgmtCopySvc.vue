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
                <div class="form-inline">
                  <div class="form-group">
                    <div class="form-radio">
                      <label class="form-radio-label" for="charSetRadio">
                        <input
                          class="form-radio-input"
                          type="radio"
                          id="charSetRadio"
                          name="radio"
                          value="C"
                          v-model="radioPicked"
                        >
                        {{$t('charSet')+'('+$t('copy-charSet')+')'}}
                        <span
                          class="form-radio-sign"
                        ></span>
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
                    <select class="form-control" v-model="charSet">
                      <option
                        v-for="item in charSetList"
                        v-bind:key="item.cdId"
                        :value="item.cdId"
                      >{{item.cdNm}}</option>
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
        <button
          @click="close()"
          type="button"
          class="btn btn-gray"
          data-dismiss="modal"
        >{{$t('cancel')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'MenuMgmtCopySvc',
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
      charSetList: [],
      radioPicked: 'C',
      charSet: ''
    }
  },
  created() {
    // 언어 설정 공통 코드 조회
    this.fnSearchCommon(
      this.fnSetChar,
      '/online/iotcmcd/retrieveIotByParentCmCdRuntime',
      'GN00000021'
    )
  },
  mounted() {},
  computed: {},
  methods: {
    fnSearchCommon(callback, reqUrl, parentId) {
      var paramObj = {}
      paramObj.parentCdId = parentId

      requestApi({
        url: reqUrl,
        headers: {
          'X-MID': 'P00060'
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            callback(res.data)
          }
        }
      })
    },
    fnSetChar(data) {
      var defaultObj = { cdId: '', cdNm: this.$t('select') }
      this.charSetList = data
      this.charSetList.unshift(defaultObj)
    },
    submit() {
      if (this.radioPicked === '') {
        this.alert(this.$t('select-menuCopyType'), 'warning')
      } else {
        this.confirm(this.$t('copyYn'), this.fnCallCopyApi)
      }
    },
    fnCallCopyApi() {
      var copyData = {
        orgLangSet: this.data.charSet,
        copyType: this.radioPicked,
        langSet: this.charSet
      }

      requestApi({
        url: '/online/com/menu/copyCharSetIotMenu',
        headers: {
          'X-MID': 'P00060'
        },
        method: 'post',
        data: copyData,
        callback: res => {
          if (res.result.status === '200') {
            // 팝업 콜백 호출 및 닫기
            this.callback()
            this.close()
            this.alert(this.$t('copy-success'), 'success')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
