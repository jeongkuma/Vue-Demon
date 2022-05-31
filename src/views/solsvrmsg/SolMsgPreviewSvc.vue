<template>
  <div>
    <div class="modal-body">
      <div class="flex flex-wrap">
        <div class="md-width-100 width-50 pr-2 md-p-0">
          <div
            class="flex justify-between items-center mb-1"
            style="height: 32px"
          >
            <span class="lb-txt">{{ this.$t('sampleData') }}</span>
            <button @click="parsing()" type="button" class="btn btn-pink">
              {{ this.$t('parsing') }}
            </button>
          </div>
          <textarea
            v-model="input"
            rows="20"
            class="form-control"
            style="resize: none"
          ></textarea>
        </div>
        <div class="md-width-100 width-50 pl-2 md-p-0">
          <div class="flex items-center mb-1" style="height: 32px">
            <span class="lb-txt">{{ this.$t('result') }}</span>
          </div>
          <textarea
            v-model="result"
            rows="20"
            class="form-control"
            style="resize: none"
          ></textarea>
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
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'SolMsgModSvc',
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
      msgMeta: '',
      msgMetaList: [],
      input: '',
      result: '',
      msgInfoList: [],
      xMid: 'P30063'
    }
  },
  created() {
    this.msgMeta = this.data.msgMeta
    this.msgMetaList = this.data.msgMetaList
    this.msgInfoList = this.data.msgInfoList
  },
  mounted() {},
  computed: {},
  methods: {
    parsing() {
      let json
      try {
        json = JSON.parse(this.input)
      } catch (error) {
        this.alert(this.$t('jsonValid'), 'warning')
        return
      }

      let sendBody
      let receiveBody

      this.msgInfoList.forEach(msgInfo => {
        if (msgInfo.tranCd === 'GN00000236') {
          sendBody = msgInfo.body
        } else if (
          msgInfo.tranCd === 'GN00000237' ||
          msgInfo.tranCd === 'GN00000337'
        ) {
          receiveBody = msgInfo.body
        }
      })

      if (!sendBody || !receiveBody) {
        this.alert(this.$t('tranBodyChk'), 'warning')
        return
      }

      let reqData = {}
      reqData.sendBody = sendBody
      reqData.receiveBody = receiveBody
      reqData.msgMeta = this.msgMeta
      reqData.input = json

      requestApi({
        url: '/online/solsvrmsg/jsonParsing',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.result = res.data.result
          }
        }
      })
    }
  }
}
</script>

<style lang="less"></style>
