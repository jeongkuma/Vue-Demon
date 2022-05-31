<template>
  <div>
    <div class="modal-body">
      <div class="form-item">
        <span class="form-label w-28">{{ $t('service-name') }}</span>
        <input
          type="text"
          :value="svcInfo.svcCdNm"
          :disabled="true"
          class="form-control"
        />
      </div>
      <div class="grid-container wide grid-scroll full-size mt-3">
        <div class="table-wrap y-scroll">
          <table class="table table-col">
            <colgroup>
              <col style="width:auto" />
              <col style="width:80px" />
            </colgroup>
            <thead>
              <tr>
                <th>{{ $t('terminal-type') }}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="devCls in devClsList"
                :key="devCls.devClsCd"
                :value="devCls.devClsCd"
              >
                <td class="text-left">{{ devCls.devClsNm }}</td>
                <td>
                  <label class="checkbox">
                    <input
                      v-model="devCls.checked"
                      class="cbox"
                      type="checkbox"
                    /><i></i>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="btn-wrap text-center">
        <button
          @click="fnAddDevCls()"
          type="button"
          class="btn btn-pink"
          data-toggle="modal"
          data-target="#modal-write"
        >
          {{ $t('save') }}
        </button>
        <button
          @click="close()"
          type="button"
          class="btn btn-gray"
          data-dismiss="modal"
        >
          {{ $t('close') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
export default {
  name: 'DevClsList',
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
      retrieveUri: '/online/iotsvc/retrieveIotDevClsList',
      createUri: '/online/iotsvc/createIotSvcDevMap',
      svcInfo: { svcCd: null, svcCdNm: null },
      devClsList: [],
      // devClsList: [ { devClsCd: 'C000010', devClsNm: '배관망', checked: true }, { devClsCd: 'C000011', devClsNm: '가스검침', checked: true }, { devClsCd: 'C000012', devClsNm: '헬멧', checked: false }, { devClsCd: 'C000013', devClsNm: '모터', checked: false } ],
      checkedList: []
    }
  },
  created() {
    this.callServerAPI(true, this.retrieveUri)
  },
  mounted() {},
  computed: {},
  methods: {
    callServerAPI(isSearch, uri) {
      var reqData = {}
      if (isSearch) {
        reqData.svcSeq = this.data.idx.svcSeq
        reqData.langSet = this.data.idx.langSet
        // reqData.svcSeq = '1'
        reqData.parentCd = 'SD00000002'
      } else {
        reqData.devClsList = this.checkedList
        reqData.svcCd = this.svcInfo.svcCd
      }
      requestApi({
        url: uri,
        headers: {
          'X-MID': 'P00057'
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (isSearch) {
            this.devClsList = res.data.devClsList
            this.svcInfo = res.data.svcDto
          } else {
            this.close()
            this.callback()
            this.alert(this.$t('save-success'), 'success')
          }
        }
      })
    },
    fnAddDevCls() {
      for (var i = 0; i < this.devClsList.length; i++) {
        if (this.devClsList[i].checked === true) {
          this.checkedList.push(this.devClsList[i])
        }
      }
      this.confirm(this.$t('saveYn'), this.confirmCallback)
    },
    confirmCallback() {
      this.callServerAPI(false, this.createUri)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
