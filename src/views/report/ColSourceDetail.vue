<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-12 col-lg-12">
          <span class="form-label w-28 lb-txt">{{$t('headerInfo')}}</span>
          <textarea class="form-control" v-model="headerInfo" readonly cols="30" rows="8">
          </textarea>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-12 col-lg-12">
          <span class="form-label w-28 lb-txt">{{$t('bodyInfo')}}</span>
          <textarea class="form-control" v-model="bodyInfo" readonly cols="30" rows="20">
          </textarea>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button @click="close()" type="button" class="btn btn-pink">{{$t('confirm')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'ColsourceDetail',
  components: {
  },
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
      searchValue: '',
      devMdlList: [],
      devMdlCd: null,
      devMdlNm: null,
      con: null,
      colSeq: null,
      parsedData: null,
      colSourceDetail: null,
      headerInfo: null,
      bodyInfo: null,
      ackProcDesc: null
    }
  },
  created () {
    this.colSeq = this.data.colSeq
  },
  mounted () {
    this.getModels()
  },
  computed: {},
  methods: {
    pretty(ex) {
      var ugly = ex
      var obj = JSON.parse(ugly)
      var pretty = JSON.stringify(obj, undefined, 5)
      return pretty
    },
    getModels() {
      let reqData = {}
      reqData.colSeq = this.colSeq
      requestApi({
        url: '/online/iotcolsource/retrieveIotColSourceDetail',
        method: 'post',
        headers: {
          'X-MID': 'P00004'
        },
        data: reqData,
        callback: (result) => {
          this.headerInfo = result.data.colSourceDetail.headerInfo
          if (result.data.colSourceDetail.bodyInfo != null) {
            this.bodyInfo = this.pretty(result.data.colSourceDetail.bodyInfo)
          }
          this.ackProcDesc = result.data.colSourceDetail.ackProcDesc
        }
      })
    }
  }
}
</script>

<style lang="less">

</style>
