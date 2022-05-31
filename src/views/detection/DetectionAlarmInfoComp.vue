<template>
  <div>
    <div class="mb-1 pt-1 pb-1">
      <h4 class="titH4">알람 정보</h4>
    </div>
    <div class="form-horizontal">
      <div class="flex mt-3">
        <div class="width-20">
          <b>알람형태</b>
        </div>
        <div class="width-80 form-check">
          <label for="sms" class="form-check-label mr-1" style="user-select: none">
            <input
              v-model="alarmData.smsSendYn"
              type="checkbox"
              id="sms"
              class="form-check-input"
              true-value="Y"
              false-value="N"
            >
            <span class="form-check-sign"></span> SMS
          </label>
          <label for="popup" class="form-check-label ml-3" style="user-select: none">
            <input
              v-model="alarmData.alrmPopYn"
              type="checkbox"
              id="popup"
              class="form-check-input"
              true-value="Y"
              false-value="N"
            >
            <span class="form-check-sign"></span> 알람 팝업
          </label>
        </div>
      </div>
      <div class="flex mt-3">
        <div class="width-20">
          <b>수신번호</b>
        </div>
        <div class="width-80 form-inline">
          <input
            v-model="alarmData.recvTelNo"
            type="text"
            class="form-control"
            placeholder="수신번호를 입력하세요"
          >
        </div>
      </div>
      <div class="mt-2">
        <div class="flex justify-between items-align">
          <div>
            <b>수신자</b>
          </div>
          <div>
            <button class="btn btn-gray" @click="fnOpenRcvPopup">추가</button>
          </div>
        </div>
        <div class="boxs left mt-1">
          <ul class="alert-list">
            <li
              v-for="(rcv, index) in alarmData.rcvList"
              :key="`rcv-${index}`"
              class="alert alert-dismissible"
            >
              <a href="javascript:void(0)" class="btn ico-delete" @click="fnRemoveRcv(index)">
                <span class="haze">{{ $t('delete') }}</span>
              </a>
              <span class="ml-1">{{ rcv.usrNm }} ( {{ rcv.orgNm }} )</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-2">
        <div class="flex justify-between items-align">
          <div>
            <b>알람메시지</b>
          </div>
          <div>
            <button class="btn btn-gray" @click="fnOpenMsgPopup">선택</button>
          </div>
        </div>
        <div class="mt-1">
          <textarea
            v-model="alarmData.sendMsg"
            class="form-control"
            id="smsText"
            rows="2"
            maxlength="80"
            :placeholder="$t('please-register-content')"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetectionAlarmInfoComp',
  components: {},
  data() {
    return {
      alarmData: {
        smsSendYn: 'N',
        alrmPopYn: 'N',
        recvTelNo: '',
        rcvList: [],
        sendMsg: '',
        sendMsgTmpl: ''
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    fnOpenRcvPopup() {
      this.popup({
        component: () => import('@/views/detection/DetectionsAddUserSvc'),
        title: this.$t('selectReceiver'),
        width: '500',
        height: '425',
        data: {},
        callback: data => {
          if (data !== 'dismiss') {
            if (this.alarmData.rcvList.length + data.length > 100) {
              this.alert(this.$t('sms-receiver-list-chk-msg'))
              return
            }
            data.forEach(usr => {
              if (!this.alarmData.rcvList.find(r => r.usrSeq === usr.usrSeq)) {
                this.alarmData.rcvList.push({
                  usrSeq: usr.usrSeq,
                  usrLoginId: usr.usrLoginId,
                  usrNm: usr.usrNm,
                  orgNm: usr.orgNm
                })
              }
            })
          }
        }
      })
    },
    fnRemoveRcv(index) {
      this.alarmData.rcvList.splice(index, 1)
    },
    fnOpenMsgPopup() {
      this.popup({
        component: () => import('@/views/detection/DetectionAlarmMsgPopupSvc'),
        title: this.$t('selectAlarmMsg'),
        width: '500',
        height: '378',
        data: {},
        callback: data => {
          if (data !== 'dismiss') {
            this.alarmData.sendMsgTmpl = data.sendMsgTmpl
            this.alarmData.sendMsg = data.sendMsg
          }
        }
      })
    },
    fnGetAlarmData() {
      // 부모에서 저장 시 사용
      return this.alarmData
    },
    fnSetAlarmData(data) {
      this.alarmData = data
    }
  }
}
</script>

<style></style>
