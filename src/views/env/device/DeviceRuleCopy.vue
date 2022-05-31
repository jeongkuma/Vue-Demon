<template>
  <div>
    <div class="modal-body">
      <div class="form-item">
        <span class="form-label w-28">Source</span>
        <div class="form-text">{{ data.typeNm }}</div>
      </div>
      <div class="form-item">
        <span class="form-label w-28">Target</span>
        <select
          class="form-control"
          v-model="copyType"
          id="targetType"
          bane="targetType"
        >
          <option
            v-for="(type, idx) in copyTypeList"
            :key="'type_' + idx"
            :value="type.cdId"
            >{{ type.cdNm }}</option
          >
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button @click="submit()" type="button" class="btn btn-pink">
          {{ $t('copy') }}
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
      copyTypeList: [],
      copyType: ''
    }
  },
  created() {
    this.copyTypeList = this.data.typeList
    this.copyType = this.copyTypeList[0].cdId
  },
  mounted() {},
  computed: {},
  methods: {
    submit() {
      var message =
        this.data.typeNm +
        ' -> ' +
        $('#targetType option:checked').text() +
        '\r\n' +
        this.$t('copyYn')
      this.confirm(message, this.fnCallCopyApi)
    },
    fnCallCopyApi() {
      var copyData = {}
      copyData.ruleMsgTypeCopy = this.copyType
      copyData.ruleDevType = this.data.devClsCd
      copyData.ruleMsgType = this.data.orgMsgType
      copyData.apiSeq = this.data.apiSeq
      requestApi({
        url: '/online/rule/deviceRuleInfoCopy',
        headers: {
          'X-MID': 'P00060'
        },
        method: 'post',
        data: copyData,
        callback: res => {
          if (res.result.status === '200') {
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
