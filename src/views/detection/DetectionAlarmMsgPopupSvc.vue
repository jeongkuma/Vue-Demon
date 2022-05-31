<template>
  <div>
    <div class="modal-body">
      <div class="table-wrap">
        <table class="table table-col">
          <caption>{{ $t('message') }} {{ $t('select') }}</caption>
          <colgroup>
            <col style="" />
            <col style="width: 70px" />
          </colgroup>
          <thead>
            <tr>
              <th>알람 메시지</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(msg, index) in msgList" :key="`msg-${index}`">
              <td class="text-left">
                {{ msg.paramVal }}
              </td>
              <td>
                <button type="button" class="btn btn-pink" @click="fnSetMsg(msg)">선택</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="modal-footer">
      <div class="btn-wrap text-center">
        <button @click="fnClose()" type="button" class="btn btn-gray">
          {{ $t('cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'DetectionAlarmMsgPopupSvc',
  components: {},
  props: {
    data: {
      type: Object,
      required: true
    },
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
      xMid: 'P00011',
      msgList: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.fnGetMsgList()
  },
  mounted() {},
  methods: {
    fnGetMsgList() {
      requestApi({
        url: '/online/iotedevdetsms/retrieveEDevDetMessageList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: { parentCdId: 'GN00000196' },
        callback: res => {
          if (res.result.status === '200') {
            this.msgList = res.data.boardList
          }
        }
      })
    },
    fnSetMsg(msg) {
      this.callback({
        sendMsgTmpl: msg.paramKey,
        sendMsg: msg.paramVal
      })
      this.close()
    },
    fnClose() {
      this.close()
    }
  }
}
</script>

<style></style>
