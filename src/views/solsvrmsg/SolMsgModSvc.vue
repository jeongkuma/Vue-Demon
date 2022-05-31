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
        <div class="md-width-100 width-70 pl-1 pr-1 md-p-0">
          <div class="mb-3">
            <span class="bold">전문 API 정보</span>
            <button
              type="button"
              class="btn btn-pink pull-right"
              @click="msgInfoAddPopup()"
            >
              {{ $t('apiAdd') }}
            </button>
          </div>
          <jqgrid
            ref="grid"
            name="solMsgAddList"
            :colModels="colModelList"
            :colNames="colNameList"
            :dataList="dataObj.msgInfoList"
            :width="300"
            :multiselect="true"
            @onCellSelect="msgInfoModPopup"
            @getDataList="retrieveSolMsgDetail"
          >
          </jqgrid>
        </div>
        <div class="md-width-100 width-30 pl-2 pr-1 md-p-0">
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
        <button type="button" @click="msgPreviewPop" class="btn btn-pink">
          {{ $t('msgPreview') }}
        </button>
        <button @click="chkValid()" type="button" class="btn btn-pink">
          {{ $t('modify') }}
        </button>
        <button
          @click="deleteConfirm()"
          type="button"
          class="btn btn-gray"
          data-dismiss="modal"
        >
          {{ $t('delete') }}
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
        useYn: '',
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
      msgInfoList: [],
      xMid: 'P30062',
      checkedList: [],
      checkedAll: false
    }
  },
  created() {
    this.retrieveSolMsgDetail()
  },
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
    retrieveSolMsgDetail() {
      let paramObj = {}
      paramObj.solMsgMSeq = this.data.solMsgMSeq
      requestApi({
        url: '/online/solsvrmsg/retrieveSolMsgDetail',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            if (res.data.dataObj.msgMeta) {
              res.data.dataObj.msgMetaList = res.data.dataObj.msgMeta.split(',')
            } else {
              res.data.dataObj.msgMetaList = []
            }
            if (res.data.dataObj.msgInfoList) {
              this.msgInfoList = res.data.dataObj.msgInfoList
            }
            this.dataObj = res.data.dataObj
          }
        }
      })
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

      this.confirm(this.$t('modifySolMsg'), this.updateSolMsg)
    },
    updateSolMsg() {
      requestApi({
        url: '/online/solsvrmsg/updateSolMsg',
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
    },
    msgInfoAddPopup: _.throttle(
      function() {
        this.popup({
          component: () => import('@/views/solsvrmsg/SolMsgInfoAddSvc'),
          title: this.$t('msgApiInfo'),
          width: '1000',
          height: '860',
          data: {
            msgMetaList: this.dataObj.msgMetaList,
            msgNm: this.dataObj.msgNm,
            solMsgMSeq: this.dataObj.solMsgMSeq
          },
          callback: data => {
            if (data !== 'dismiss') {
              this.retrieveSolMsgDetail()
            }
          }
        })
      },
      1000,
      { trailing: false }
    ),
    msgInfoModPopup: _.throttle(
      function(id) {
        let param = {}
        param = this.dataObj.msgInfoList[id]
        this.popup({
          component: () => import('@/views/solsvrmsg/SolMsgInfoModSvc'),
          title: this.$t('msgApiInfo'),
          width: '1000',
          height: '860',
          data: {
            solMsgInfoSeq: param.solMsgInfoSeq,
            msgNm: this.dataObj.msgNm,
            msgMetaList: this.dataObj.msgMetaList
          },
          callback: data => {
            if (data !== 'dismiss') {
              this.retrieveSolMsgDetail()
            }
          }
        })
      },
      1000,
      { trailing: false }
    ),
    msgPreviewPop: _.throttle(
      function(param) {
        this.popup({
          component: () => import('@/views/solsvrmsg/SolMsgPreviewSvc'),
          title: this.$t('msgPreview'),
          width: '900',
          height: '650',
          data: {
            msgMetaList: this.dataObj.msgMetaList,
            msgMeta: this.dataObj.msgMeta,
            msgInfoList: this.msgInfoList
          },
          callback: data => {
            if (data !== 'dismiss') {
            }
          }
        })
      },
      1000,
      { trailing: false }
    ),
    // 체크 관련
    fnCheckAll(event) {
      if (event.target.checked) {
        this.checkedList = this.dataObj.msgInfoList
      } else {
        this.checkedList = []
      }
    },
    deleteConfirm() {
      let rowIds = this.$refs.grid.getSelectionIndexs()
      if (rowIds.length === 0) {
        this.alert(this.$t('lead-check-role'), 'warning')
        return false
      }

      this.confirm(this.$t('delYn'), this.deleteApi)
    },
    deleteApi() {
      let reqData = {}
      reqData.deleteList = []
      let rowIds = this.$refs.grid.getSelectionIndexs()

      rowIds.forEach(row => {
        reqData.deleteList.push(this.dataObj.msgInfoList[row].solMsgInfoSeq)
      })
      requestApi({
        url: '/online/solsvrmsg/deleteSolMsgInfo',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.checkedList = []
            this.alert(this.$t('del-success'), 'success')
            this.retrieveSolMsgDetail()
          }
        }
      })
    }
  }
}
</script>

<style lang="less"></style>
