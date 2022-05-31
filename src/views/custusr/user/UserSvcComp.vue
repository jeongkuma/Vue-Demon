<template>
  <div class="table-wrap border-none grid-container">
    <div class="tit-wrap">
      <h4 class="titH4">서비스</h4>
    </div>
    <div class="form-row mt-2">
      <!-- 전체 서비스 -->
      <div class="flex-1 boxs grid-container">
        <div class="table-wrap y-scroll table-height" style="height: 250px">
          <table class="table table-col" style="min-width: 100%;">
            <caption>
              전체 서비스
            </caption>
            <colgroup>
              <col style="width:50px" />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">
                  <label class="checkbox">
                    <input
                      ref="checkAllAllSvc"
                      role="checkbox"
                      class="cbox"
                      type="checkbox"
                      @change="fnCheckAllAllSvc"
                    /><i></i>
                  </label>
                </th>
                <th scope="col">서비스코드</th>
                <th scope="col">서비스명</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(svc, index) in allSvc.list" :key="`allSvc-${index}`">
                <td>
                  <label class="checkbox"
                    ><input
                      v-model="allSvc.selected"
                      role="checkbox"
                      class="cbox"
                      type="checkbox"
                      :value="svc"/><i></i
                  ></label>
                </td>
                <td>{{ svc.svcCd }}</td>
                <td>{{ svc.svcCdNm }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 버튼 -->
      <div
        class="flex-none flex flex-col justify-center items-center px-2 py-2"
      >
        <button
          class="btn btn-gray input-group-addon ml-0 mr-0"
          type="button"
          @click="fnAddSvc"
        >
          추가
        </button>
        <button
          class="btn btn-gray input-group-addon mt-1 ml-0 mr-0"
          type="button"
          @click="fnRemoveSvc"
        >
          삭제
        </button>
      </div>
      <!-- 선택된 서비스 -->
      <div class="flex-1 boxs grid-container">
        <div class="table-wrap y-scroll table-height" style="height: 250px">
          <table class="table table-col" style="min-width: 100%;">
            <caption>
              매핑된 서비스
            </caption>
            <colgroup>
              <col style="width:50px" />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">
                  <label class="checkbox">
                    <input
                      ref="checkAllUsrSvc"
                      role="checkbox"
                      class="cbox"
                      type="checkbox"
                      @change="fnCheckAllUsrSvc"
                    /><i></i>
                  </label>
                </th>
                <th scope="col">서비스코드</th>
                <th scope="col">서비스명</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(svc, index) in usrSvc.list" :key="`allSvc-${index}`">
                <td>
                  <label class="checkbox"
                    ><input
                      v-model="usrSvc.selected"
                      role="checkbox"
                      class="cbox"
                      type="checkbox"
                      :value="svc"/><i></i
                  ></label>
                </td>
                <td>{{ svc.svcCd }}</td>
                <td>{{ svc.svcCdNm }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'UserSvcComp',
  components: {},
  props: {
    mid: {
      type: String,
      require: true
    },
    usrSeq: {
      type: String,
      require: false,
      default: undefined
    }
  },
  data() {
    return {
      allSvc: {
        list: [
          { svcCd: 'SD00000019', svcCdNm: '삼천리1' },
          { svcCd: 'SD00000020', svcCdNm: '삼천리2' },
          { svcCd: 'SD00000021', svcCdNm: '삼천리3' }
        ],
        selected: []
      },
      usrSvc: {
        list: [],
        selected: [],
        isVideo: false
      },
      api: {
        retrieveAllSvc: '/online/iotsvc/retrieveIotSvcList',
        retrieveUsrSvc: '/online/iotusr/retrieveIotUsrSvcList'
      },
      orgSvc: {} // 조직의 고객사에 매핑된 서비스
    }
  },
  computed: {
    isModify() {
      return this.usrSeq !== undefined
    },
    isVideo() {
      return this.usrSvc.list.find(s => s.svcCd === 'SD00000400')
    }
  },
  watch: {
    'allSvc.selected'() {
      this.$refs.checkAllAllSvc.checked =
        this.allSvc.selected.length > 0 &&
        this.allSvc.selected.length === this.allSvc.list.length
    },
    'usrSvc.selected'() {
      this.$refs.checkAllUsrSvc.checked =
        this.usrSvc.selected.length > 0 &&
        this.usrSvc.selected.length === this.usrSvc.list.length
    },
    'usrSvc.list': {
      deep: true,
      handler() {
        this.$emit('changeUsrSvcList', this.usrSvc.list)
      }
    }
  },
  created() {
    this.fnGetAllSvcList()
    if (this.isModify) {
      this.fnGetUsrSvcList()
    }
  },
  mounted() {},
  methods: {
    // 전체 서비스 조회
    fnGetAllSvcList() {
      this.fnCallAPI(
        { langSet: 'ko' },
        this.api.retrieveAllSvc,
        this.fnSetAllSvcList
      )
    },
    fnSetAllSvcList(data) {
      this.allSvc.list = data
    },
    // 사용자 서비스 조회
    fnGetUsrSvcList() {
      this.fnCallAPI(
        { langSet: 'ko', usrSeq: this.usrSeq },
        this.api.retrieveUsrSvc,
        this.fnSetUsrSvcList
      )
    },
    fnSetUsrSvcList(data) {
      this.usrSvc.list = data
      this.$emit('changeUsrSvcList', data)
    },
    fnCallAPI(paramObj, url, callback) {
      requestApi({
        url: url,
        headers: {
          'X-MID': this.mid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          callback(res.data)
        }
      })
    },
    // 추가
    fnAddSvc() {
      if (this.allSvc.selected.length === 0) {
        this.alert(this.$t('svcSelect'), 'warning')
        return false
      }
      this.allSvc.selected.forEach(svc => {
        // TODO: 동일한게 들어있으면 무시
        let index = this.usrSvc.list.findIndex(s => s.svcCd === svc.svcCd)
        if (index === -1) {
          this.usrSvc.list.push(svc)
        }
      })
      this.allSvc.selected = []
    },
    // 조직의 서비스 추가
    fnAddSvcOrgSeq(svc) {
      this.orgSvc = svc

      if (!this.usrSvc.list.find(s => s.svcCd === svc.svcCd)) {
        this.usrSvc.list.push(svc)
      }
    },
    // 삭제
    fnRemoveSvc() {
      if (this.usrSvc.selected.length === 0) {
        this.alert(this.$t('svcDelete'), 'warning')
        return false
      }
      this.usrSvc.selected.forEach(svc => {
        // 조직의 서비스는 삭제 불가능하다
        if (svc.svcCd === this.orgSvc.svcCd) {
          this.alert('기본 서비스는 삭제할 수 없습니다.')
        } else {
          let index = this.usrSvc.list.findIndex(s => s.svcCd === svc.svcCd)
          if (index > -1) {
            this.usrSvc.list.splice(index, 1)
          }
        }
      })
      this.usrSvc.selected = []
    },
    // 전체 서비스 전체 선택/해제
    fnCheckAllAllSvc(event) {
      if (event.target.checked) {
        this.allSvc.selected = this.allSvc.list
      } else {
        this.allSvc.selected = []
      }
    },
    // 사용자 서비스 전체 선택/해제
    fnCheckAllUsrSvc(event) {
      if (event.target.checked) {
        this.usrSvc.selected = this.usrSvc.list
      } else {
        this.usrSvc.selected = []
      }
    },
    // 최종 사용자 서비스 목록
    fnGetUserSvcList() {
      let list = []
      this.usrSvc.list.forEach(svc => {
        list.push(svc.svcCd)
      })
      return list
    }
  }
}
</script>

<style scoped>
</style>
