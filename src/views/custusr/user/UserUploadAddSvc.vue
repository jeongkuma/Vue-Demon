<template>
  <div>
    <div class="modal-body">
      <div class="form-item">
        <span class="form-label w-32 lb-txt">{{$t('file-attach')}}</span>
        <div class="input-file">
          <input v-model="fileName" type="text" :disabled="true" :placeholder="$t('noRecords')" class="file-name">
          <label for="inputSelectedFile" class="file-label">{{$t('file-select')}}</label>
          <input
            ref="file"
            type="file"
            id="inputSelectedFile"
            style="display:none;"
            class="file-upload"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            @change="fnChangeFile">
        </div>
      </div>
      <div class="form-item">
        ※ {{$t('user-add-all-dsc')}} <button type="button" class="btn btn-gray ml-1" @click="fnExcellDown()">{{$t('template')}}</button>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button @click="fnSaveConfirm" type="button" class="btn btn-pink" >{{$t('create')}}</button>
        <button @click="close()" type="button" class="btn btn-gray" >{{$t('cancle')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { requestMultipartJsonObject, requestDownloadApi } from '@/api/ccp/requestApi'
import getRequestFileArray from '@/utils/inputFile'
export default {
  name: 'UserUploadAddSvc',
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
      xMid: 'P00045',
      fileName: ''
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    fnChangeFile(event) {
      if (event.target.files.length) {
        this.fileName = event.target.files[0].name
      } else {
        this.fileName = ''
      }
    },
    fnExcellDown() {
      requestDownloadApi({
        url: '/online/iotusr/excelExampleDown',
        headers: { 'X-MID': this.xMid },
        method: 'post',
        data: {},
        callback: (res) => {}
      })
    },
    fnSaveConfirm() {
      if (!this.fnValidateData()) {
        return false
      }
      this.confirm(this.$t('saveYn'), this.fnSave)
    },
    fnSave() {
      requestMultipartJsonObject({
        url: '/online/iotusr/createIotUsrAll',
        headers: { 'X-MID': this.xMid },
        data: {},
        files: getRequestFileArray([this.$refs.file]),
        callback: (res) => { // required
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('save-success'), 'success')
            this.callback()
          }
        }
      })
    },
    fnValidateData() {
      return true
    }
  }
}
</script>

<style></style>
