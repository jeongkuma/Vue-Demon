<template>
  <div>
    <div class="modal-body">
      <div class="form-group flex width-full">
        <div class="width-30">
          <span class="lb-txt">API</span>
        </div>
        <div class="width-70 flex">
          <input v-model="formData.apiUri" type="text" class="form-control" disabled />
          <button class="btn btn-gray flex-none" @click="fnShowApiList">검색</button>
        </div>
      </div>
      <div class="form-group flex width-full">
        <div class="width-30">
          <span class="lb-txt">콤보 Name Key</span>
        </div>
        <div class="width-70">
          <input v-model="formData.nameKey" type="text" class="form-control" />
        </div>
      </div>
      <div class="form-group flex width-full">
        <div class="width-30">
          <span class="lb-txt">콤보 Value Key</span>
        </div>
        <div class="width-70">
          <input v-model="formData.valueKey" type="text" class="form-control" />
        </div>
      </div>
      <div class="form-group flex width-full">
        <div class="width-30">
          <b>Response Key</b>
        </div>
        <div class="width-70">
          <input v-model="formData.responseKey" type="text" class="form-control" />
        </div>
      </div>
      <div v-for="(param, index) in apiParamList" :key="`param-${index}`" class="form-group flex width-full">
        <div class="width-30">
          <b :class="{'lb-txt': param.requiredYn === 'Y'}">{{ param.paramKey }}</b>
        </div>
        <div class="width-70">
          <input v-model="formData[param.paramKey]" type="text" class="form-control" />
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="btn-wrap text-center">
        <button @click="submit" type="button" class="btn btn-pink">
          적용
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
import { getApiParamData } from '@/api/common/api'

export default {
  name: 'SearchOptionApiSvc',
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
      formData: {
        apiSeq: '',
        apiUrl: '',
        nameKey: '',
        valueKey: ''
      },
      apiParamList: []
    }
  },
  computed: {},
  watch: {},
  created() {
    if (this.data.searchOption.apiSeq && this.data.searchOption.apiSeq !== '') {
      this.setApiData()
      this.getApiParamList()
    }
  },
  mounted() {},
  methods: {
    setApiData() {
      this.formData = this.data.searchOption
    },
    getApiParamList() {
      getApiParamData({ xMid: this.data.xMid, apiSeq: this.formData.apiSeq })
        .then((data) => { this.apiParamList = data.tbIotParamDTOList })
        .catch((e) => console.error(e))
    },
    fnShowApiList() {
      this.popup({
        component: () => import('@/views/env/program/apiMgmtSearch'),
        title: this.$t('api-list'), // required
        width: '900', // required - 300, 500, 600, 700, 900, wide(full)
        height: '470',
        data: {
          apiNm: '',
          url: '/online/com/api/getIotDashApi',
          xMid: this.data.xMid
        },
        callback: data => {
          // option
          if (data !== 'dismiss') {
            this.formData.apiSeq = data.apiSeq
            this.formData.apiUri = data.apiUri
            this.apiParamList = data.tbIotParamDTOList
          }
        }
      })
    },
    submit() {
      if (!this.fnValidFormData()) {
        return false
      }
      this.callback(this.formData)
      this.close()
    },
    fnValidFormData() {
      if (!this.formData.apiSeq || this.formData.apiSeq === '') {
        this.alert('API를 선택하세요.', 'warning')
        return false
      }

      if (!this.formData.nameKey || this.formData.nameKey === '') {
        this.alert('콤보 Name Key를 입력하세요.', 'warning')
        return false
      }

      if (!this.formData.valueKey || this.formData.valueKey === '') {
        this.alert('콤보 Value Key를 입력하세요.', 'warning')
        return false
      }

      let notValid = this.apiParamList.find(param =>
        param.requiredYn === 'Y' &&
        (!this.formData[param.paramKey] || this.formData[param.paramKey].length === '')
      )

      if (notValid) {
        this.alert(notValid.paramKey + '를 입력하세요.', 'warning')
        return false
      }

      return true
    }
  }
}
</script>

<style></style>
