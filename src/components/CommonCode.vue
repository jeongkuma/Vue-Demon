<template>
  <div>
    <div class="modal-body">
      <div class="form-inline">
        <div class="inline">
          <!-- <select v-model="depth1" class="form-control" disabled>
            <option v-for="(depth1, index) in depth1List" :key="index" :value="depth1.cdId">{{depth1.cdNm}}</option>
          </select>
          <span class="form-label mx-1">&gt;</span> -->
          <select v-model="depth2" class="form-control" @change="changeCommonCode(2)" :disabled="data.depth2">
            <option value="">{{$t('all')}}</option>
            <option v-for="(depth2, index) in depth2List" :key="index" :value="depth2.cdId">{{depth2.cdNm}}</option>
          </select>
          <span class="form-label mx-1">&gt;</span>
          <select ref="commonSelectbox3" v-model="depth3" class="form-control" @change="changeCommonCode(3)" :disabled="data.depth3 || (depth2 ? false : true)">
            <option value="">{{$t('all')}}</option>
            <option v-for="(depth3, index) in depth3List" :key="index" :value="depth3.cdId">{{depth3.cdNm}}</option>
          </select>
          <span class="form-label mx-1">&gt;</span>
          <select v-model="depth4" class="form-control" @change="changeCommonCode(4)" :disabled="depth3 ? false : true">
            <option value="">{{$t('all')}}</option>
            <option v-for="(depth4, index) in depth4List" :key="index" :value="depth4.cdId">{{depth4.cdNm}}</option>
          </select>
        </div>
      </div>
      <div class="grid-container wide grid-scroll full-size">
        <div class="table-fixed-header-wrap">
          <div class="table-wrap cmcd-table-height">
            <div class="fixed-header-bg"></div>
            <table class="table table-col">
              <colgroup>
                <col style="width:60px">
                <col style="width:auto">
                <col style="width:auto">
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">
                    <div class="fixed-th form-check" style="width:60px">
                      <div class="form-check">
                        <label class="form-check-label">
                          <input ref="allCheckEle" class="form-check-input" type="checkbox" @change="allCheck($event)">
                          <span class="form-check-sign"></span>
                        </label>
                      </div>
                    </div>
                  </th>
                  <th scope="col"><div class="fixed-th">{{$t('cdNm')}}</div></th>
                  <th scope="col"><div class="fixed-th">{{$t('code')}}</div></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="commonCode in commonCodeList" :key="commonCode.cdSeq">
                  <td>
                    <div class="form-check">
                      <label class="form-check-label">
                        <input class="form-check-input eleCheck" type="checkbox" @change="changeCheckbox($event.target.checked, commonCode)">
                        <span class="form-check-sign"></span>
                      </label>
                    </div>
                  </td>
                  <td class="text-left">{{commonCode.cdNm}}</td>
                  <td class="text-left">{{commonCode.cdId}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer custom-footer">
      <div class="btn-wrap text-center">
        <button @click="submitDevice()" type="button" class="btn btn-pink">{{$t('confirm')}}</button>
        <button @click="close()" type="button" class="btn btn-gray" data-dismiss="modal">{{$t('close')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'CommonCode',
  components: {},
  props: {
    // data: {
    //   depth2: null, // 고정으로 들어 올 공통코드 CD_ID
    //   depth3: null, // 고정으로 들어 올 공통코드 CD_ID
    //   isMultiSelect: true, // 공통코드 여러개 선택 - default false
    //   isParentSelect: true // 자식이 있는 부모코드 선택가능여부 - default false
    // },
    data: Object, // 넘겨받을 데이터,
    callback: { // 호출할 콜백함수
      type: Function,
      required: true
    },
    close: { // 팝업 닫는함수
      type: Function,
      required: true
    }
  },
  data () {
    return {
      depth1: 'C000000001',
      depth2: '',
      depth3: '',
      depth4: '',
      depth1List: [{ cdId: 'C000000001', cdNm: this.$t('code-type') }],
      depth2List: [],
      depth3List: [],
      depth4List: [],
      commonCodeList: [],
      selectedCommonCode: []
    }
  },
  created () {},
  mounted () {
    let context = this
    let isDefaultValue = this.data && this.data.depth2
    this.requestCommonCode('C000000001', 2, isDefaultValue)

    if (isDefaultValue) { // 2번째 리스트 디폴트 선택 기능
      this.depth2 = this.data.depth2
      Promise.all([
        this.requestCommonCode(this.depth2, 4),
        this.changeCommonCode(2)
      ]).then(() => {
        if (context.data.depth3) {
          context.depth3 = context.data.depth3
          context.requestCommonCode(context.depth3, 4)
          context.changeCommonCode(3)
        }
      })
    }
  },
  computed: {},
  methods: {
    allCheck (event) {
      let isChecked = event.target.checked
      if (isChecked) {
        this.selectedCommonCode = this.commonCodeList
        $('.eleCheck').each((index, item) => {
          item.checked = true
        })
      } else {
        this.selectedCommonCode = []
        $('.eleCheck').each((index, item) => {
          item.checked = false
        })
      }
    },
    changeCommonCode (depth) {
      this.$refs.allCheckEle.checked = false
      let returnPromise = {}
      switch (depth) {
        case 2:
          if (this.depth2) {
            returnPromise = this.requestCommonCode(this.depth2, 3)
          } else {
            returnPromise = this.requestCommonCode(this.depth1, 3)
          }
          this.depth3 = ''
          this.depth4 = ''
          break
        case 3:
          if (this.depth3) {
            returnPromise = this.requestCommonCode(this.depth3, 4)
          } else {
            returnPromise = this.requestCommonCode(this.depth2, 4)
          }
          this.depth4 = ''
          break
        case 4:
          if (this.depth4) {
            returnPromise = this.requestCommonCode(this.depth4, 5)
          } else {
            returnPromise = this.requestCommonCode(this.depth3, 5)
          }
          break
      }
      return returnPromise
    },
    requestCommonCode (parentCdId, depth, init) {
      depth = parseInt(depth)
      let context = this
      return new Promise((resolve, reject) => {
        requestApi({
          url: '/online/iotcmcd/retrieveIotByParentCmCd',
          headers: {
            'X-MID': 'P00092'
          },
          method: 'post',
          data: {
            parentCdId: parentCdId
          },
          callback: (data) => {
            context.selectedCommonCode = []
            switch (depth) {
              case 1:
                context.depth1List = data.data
                break
              case 2:
                context.depth2List = data.data
                if (!init) {
                  context.commonCodeList = data.data
                }
                break
              case 3:
                context.depth3List = data.data
                if (!init) {
                  context.commonCodeList = data.data
                }
                break
              case 4:
                context.depth4List = data.data
                if (!init) {
                  context.commonCodeList = data.data
                }
                break
              case 5:
                if (!init) {
                  context.commonCodeList = data.data
                }
                break
            }
            resolve()
          }
        })
      })
    },
    changeCheckbox (checked, commonCode) {
      if (checked) {
        this.selectedCommonCode.push(commonCode)
      } else {
        this.selectedCommonCode =
          this.selectedCommonCode
            .filter(selectedCommonCode => selectedCommonCode.cdSeq !== commonCode.cdSeq)
      }
    },
    submitDevice () {
      // 멀티선택 허용하지 않은경우 검사
      if (this.data && !this.data.isMultiSelect && this.selectedCommonCode.length > 1) {
        this.alert(this.$t('alert-select-cmcd-one'))
        return
      }
      // 부모코드 선택 허용하지 않은경우 검사
      if (this.data && !this.data.isParentSelect) {
        let selectedParent = null
        this.selectedCommonCode.forEach(commonCode => {
          if (parseInt(commonCode.childrenCnt)) {
            selectedParent = commonCode.cdNm + '(' + commonCode.cdId + ')'
          }
        })
        if (selectedParent) {
          this.alert(this.$t('alert-dont-select-parent-cmcd').replace('$0', selectedParent))
          return
        }
      }
      this.callback(this.selectedCommonCode)
      this.close()
    }
  }
}
</script>

<style lang="less" scoped>
  .cmcd-table-height {
    height: 200px
  }
</style>
