<template>
  <div>
    <div class="modal-body">
      <div class="table-wrap border-none">
        <table class="table table-row">
          <caption>{{$t('cse-regi')}}</caption>
          <colgroup>
            <col style="width:10%">
            <col style="width:40%">
          </colgroup>
          <tbody>
            <tr>
              <th scope="row">
                <span class="lb-txt">전문구분</span>
              </th>
              <td>
                <div class="left form-inline">
                  <div class="form-group">
                    <select
                      class="form-control"
                      v-model="dataObj.msgType"
                      @change="setDefaultValue()"
                    >
                      <option
                        v-for="item in msgTypeList"
                        :key="item.key"
                        :value="item.value"
                      >{{item.key}}</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <select
                      v-if="dataObj.msgType === 'Kafka'"
                      class="form-control"
                      v-model="setValue"
                      @change="setTopic()"
                    >
                      <option
                        v-for="item in topicList"
                        :key="item.key"
                        :value="item.value"
                      >{{item.key}}</option>
                    </select>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row" class="right">
                <span class="lb-txt">주소</span>
              </th>
              <td class="form-inline">
                <div class="input-group">
                  <input
                    v-model="dataObj.address"
                    type="text"
                    class="form-control"
                    style="width:540px"
                  >
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="lb-txt">토픽/URL</span>
              </th>
              <td>
                <div class="left form-inline">
                  <div class="form-group">
                    <input
                      v-model="dataObj.topic"
                      type="text"
                      class="form-control"
                      style="width:540px"
                    >
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="lb-txt">Body</span>
              </th>
              <td>
                <div class="left form-inline">
                  <div class="form-group">
                    <textarea class="form-control" cols="80" rows="20" v-model="dataObj.payload"/>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th></th>
              <td>
                <div class="left form-inline">
                  <div class="form-group">
                    <button type="button" class="btn btn-gray" @click="processMsgTest()">전송</button>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row" class="right">
              </th>
            </tr>
            <tr class="border-t-1">
              <th scope="row" class="right">
                <span class="bold" style="font-size: large">전문변환</span>
              </th>
            </tr>
            <tr>
              <th scope="row" class="right">
                <span class="lb-txt">Hex</span>
              </th>
              <td class="form-inline">
                <div class="input-group">
                  <textarea class="form-control" cols="80" rows="7" v-model="hexStr"/>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row" class="right">
              </th>
              <td>
                <button type="button" class="btn btn-gray" @click="HexToBase64()">HexToBase64</button>
                <button type="button" class="btn btn-gray" style="margin-left: 350px" @click="Base64ToHex()">Base64ToHex</button>
              </td>
            </tr>
            <tr>
              <th scope="row" class="right">
                <span class="lb-txt">Base64</span>
              </th>
              <td class="form-inline">
                <div class="input-group">
                  <textarea class="form-control" cols="80" rows="7" v-model="baseStr"/>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'MsgTestSvc',
  components: {},
  props: {},
  data() {
    return {
      msgTypeList: [
        { key: 'Kafka', value: 'Kafka' },
        { key: 'HTTP', value: 'HTTP' },
        { key: 'MQTT', value: 'MQTT' }
      ],
      topicList: [
        { key: 'tict-send-diag-tran', value: 'tict-send-diag-tran' },
        { key: 'tict-send-osb-tran', value: 'tict-send-osb-tran' },
        { key: 'tict-send-solu-tran', value: 'tict-send-solu-tran' },
        { key: 'tict-send-symp-uisvc', value: 'tict-send-symp-uisvc' },
        { key: 'tict-send-tran-accu', value: 'tict-send-tran-accu' },
        { key: 'tict-send-tran-coll', value: 'tict-send-tran-coll' },
        { key: 'tict-send-tran-diag', value: 'tict-send-tran-diag' },
        { key: 'tict-send-tran-outif', value: 'tict-send-tran-outif' },
        { key: 'tict-send-tran-symp', value: 'tict-send-tran-symp' }
      ],
      dataObj: {
        address: '',
        topic: '',
        payload: '',
        msgType: 'Kafka'
      },
      setValue: '',
      hexStr: '',
      baseStr: ''
    }
  },
  created() {
    this.setDefaultValue()
  },
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    HexToBase64() {
      let str = this.hexStr
      this.baseStr = btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, '').replace(/([\da-fA-F]{2}) ?/g, '0x$1 ').replace(/ +$/, '').split(' ')))
    },
    Base64ToHex() {
      let str = this.baseStr
      for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, '')), hex = []; i < bin.length; ++i) {
        let tmp = bin.charCodeAt(i).toString(16)
        if (tmp.length === 1) tmp = '0' + tmp
        hex[hex.length] = tmp
      }
      this.hexStr = hex.join('')
    },
    processMsgTest() {
      requestApi({
        url: '/online/msgTest/processMsgTest',
        headers: {
          'X-MID': 'P99999'
        },
        method: 'post',
        data: this.dataObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '201') {
            this.alert(this.$t('success'), 'success')
          }
        }
      })
    },
    setDefaultValue() {
      if (this.dataObj.msgType === 'Kafka') {
        this.dataObj.address = '192.168.50.253:9092'
        this.dataObj.topic = 'tict-send-diag-tran'
        this.setValue = 'tict-send-diag-tran'
      } else if (this.dataObj.msgType === 'HTTP') {
        this.dataObj.address = 'http://192.168.50.253:7001'
        this.dataObj.topic = '/scp'
      } else {
        this.dataObj.address = 'tcp://192.168.50.253:1883'
        this.dataObj.topic = 'iot-data'
      }
    },
    setTopic() {
      this.dataObj.topic = this.setValue
    }
  }
}
</script>

<style lang="less" scoped>
</style>
