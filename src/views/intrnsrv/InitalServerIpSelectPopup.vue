<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item">
          <span class="form-label w-16 lb-txt">{{$t('en-ip')}}</span>
          <select v-model="url" class="form-control">
            <option v-for="obj in list" :key="obj.url" :value="obj.url">{{ obj.name }}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center btn-wrap">
        <button @click="initMemory()" type="button" class="btn btn-pink">{{$t('initializing')}}</button>
        <button @click="close()" type="button" class="btn btn-gray" data-dismiss="modal">{{$t('cancel')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'initServer',
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
      list: [],
      url: '',
      xMid: 'P20030'
    }
  },
  created () {
    this.getProperties()
  },
  methods: {
    getProperties() {
      requestApi({
        url: '/online/init/getProperties',
        method: 'post',
        headers: {
          'X-MID': this.xMid
        },
        data: {
          actionDiv: this.data.actionDiv
        },
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.list = res.data.list
            this.url = res.data.list[0].url
          } else {
            this.alert(this.$t('fail'), 'warning')
          }
        }
      })
    },
    initMemory() {
      requestApi({
        url: '/online/init/initMemory',
        method: 'post',
        headers: {
          'X-MID': 'P00119'
        },
        data: {
          url: this.url
        },
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('success'), 'success')
          } else {
            this.alert(this.$t('fail'), 'warning')
          }
        }
      })
    },
    callInitApi() {
      if (this.initServerIp === '') {
        this.alert(this.$t('ip-blank-chk'))
        return false
      }

      requestApi({
        url: this.data.apiUri,
        method: 'post',
        headers: {
          'X-MID': 'P00119'
        },
        data: {
          serverIp: this.initServerIp
        },
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.callback()
            this.close()
            this.alert(this.$t('success'), 'success')
          } else {
            this.alert(this.$t('fail'), 'warning')
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
</style>
