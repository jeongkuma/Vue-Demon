<template>
  <div>
    <div class="modal-body">
      <div class="mb-1">
        <span class="bold">기본 정보</span>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6 col-md-6 col-lg-6">
          <span class="form-label w-32 lb-txt">{{ $t('msg-nm') }}</span>
          <input v-model="dataObj.msgNm" type="text" class="form-control" />
        </div>
        <div class="form-item col-sm-6 col-md-6 col-lg-6">
          <span class="form-label w-32 lb-txt">{{ $t('useYn') }}</span>
          <select v-model="dataObj.useYn" class="form-control">
            <option v-for="yn in useYnList" :key="yn.key" :value="yn.key">{{
              yn.value
            }}</option>
          </select>
        </div>
      </div>
      <div class="form-row mt-3">
        <div class="md-width-100 width-70 pl-2 pr-1">
          <div class="mb-3">
            <span class="bold">전문 API 정보</span>
          </div>
          <jqgrid
            ref="grid"
            name="solMsgAddList"
            :colModels="colModelList"
            :colNames="colNameList"
            :dataList="dataObj.msgInfoList"
            :width="300"
            :multiselect="false"
          >
          </jqgrid>
        </div>
        <div class="md-width-100 width-30 pl-1 pr-1">
          <div class="mb-3">
            <span class="bold">속성 관리</span>
          </div>
          <div>
            <div class="table-wrap auto">
              <table class="table table-col">
                <caption></caption>
                <colgroup>
                  <col style="width:80%" />
                  <col style="width:20%" />
                </colgroup>
                <thead>
                  <tr>
                    <th>속성명</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input
                        class="form-control"
                        type="text"
                        title="Input Attb"
                        v-model="inputAttb"
                      />
                    </td>
                    <td>
                      <button
                        class="btn"
                        type="button"
                        @click="insertMsgMetaList()"
                      >
                        <span class="glyphicon glyphicon-plus"></span>
                      </button>
                    </td>
                  </tr>
                  <tr
                    v-for="(attb, idx) in dataObj.msgMetaList"
                    :key="'attb' + idx"
                  >
                    <td>
                      <input type="text" title="Attb" hidden />
                      <span title="Attb">{{ attb }}</span>
                    </td>
                    <td>
                      <button
                        class="btn"
                        type="button"
                        @click="deleteRowMsgMetaList(idx)"
                      >
                        <span class="glyphicon glyphicon-minus"></span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center btn-wrap">
        <button @click="chkValid()" type="button" class="btn btn-pink">
          {{ $t('create') }}
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
import Jqgrid from '@/components/Jqgrid'

export default {
  name: 'SolMsgModSvc',
  components: {
    Jqgrid
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
  data() {
    return {
      colNameList: [
        this.$t('gubun'),
        this.$t('targetServer'),
        this.$t('protocol'),
        this.$t('method'),
        this.$t('uri')
      ],
      colModelList: [
        { name: 'tranCdNm', index: 'tranCdNm', align: 'left' },
        { name: 'targetSolSvrNm', index: 'targetSolSvrNm', align: 'left' },
        { name: 'protocolNm', index: 'protocolNm', align: 'left' },
        { name: 'methodNm', index: 'methodNm', align: 'left' },
        { name: 'uri', index: 'uri', align: 'left' }
      ],
      dataObj: {
        useYn: 'Y',
        msgNm: '',
        msgInfoList: [],
        msgMeta: '',
        msgMetaList: []
      },
      useYnList: [
        { key: '', value: '선택' },
        { key: 'Y', value: '사용' },
        { key: 'N', value: '사용안함' }
      ],
      inputAttb: '',
      xMid: 'P30061'
    }
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    insertMsgMetaList() {
      if (!this.inputAttb) {
        this.alert(this.$t('attbNmValid'), 'warning')
        return
      }
      this.dataObj.msgMetaList.push(this.inputAttb)
      this.inputAttb = ''
    },
    deleteRowMsgMetaList(idx) {
      this.dataObj.msgMetaList.splice(idx, 1)
    },
    chkValid() {
      if (!this.dataObj.msgNm) {
        this.alert(this.$t('msgNmValid'), 'warning')
        return
      }
      if (!this.dataObj.useYn) {
        this.alert(this.$t('useYnValid'), 'warning')
        return
      }

      this.dataObj.msgMeta = this.dataObj.msgMetaList.join(',')

      this.confirm(this.$t('createSolMsg'), this.insertSolMsg)
    },
    insertSolMsg() {
      requestApi({
        url: '/online/solsvrmsg/insertSolMsg',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: this.dataObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('save-success'), 'success')
            this.callback()
            this.close()
          }
        }
      })
    }
  }
}
</script>

<style lang="less"></style>
