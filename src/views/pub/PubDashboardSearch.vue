<template>
  <div class="flex">
    <!-- 검색 타입 TYPE -  사용안함: '', 조직: ORG, 식별명: CTN, 월: MONTH, 콤보: COMBO  -->
    <!-- 설정 저장 시 대문자로 저장하기 때문에 key 값이 대문자 -->
    <div
      v-for="(search, index) in initMsgSearchData"
      :key="`search-${index}`"
      class="search-item"
      :class="{'width-100': search.TYPE !== 'MONTH'}"
    >
      <div v-if="search.TYPE === 'ORG'" class="flex items-center">
        <div class="pr-2">조직</div>
        <select v-model="search.VALUE" class="form-control">
          <option
            v-for="list in orgList"
            :key="list.orgSeq"
            :value="list.orgSeq"
            >{{ list.orgPath }}</option
          >
        </select>
      </div>
      <div v-if="search.TYPE === 'CTN'" class="flex">
        <div class="pr-1 flex-none" style="width: 85px">
          <select v-model="search.SEARCHTYPE" class="form-control">
            <option value="devUname">식별명</option>
            <option value="ctn">CTN</option>
          </select>
        </div>
        <div>
          <input v-model="search.VALUE" type="text" class="form-control" />
        </div>
      </div>
      <div v-if="search.TYPE === 'MONTH'" class="">
        <select v-model="search.VALUE" class="form-control" style="width: 70px">
          <option v-for="mon in 12" :key="`month-${mon}`" :value="mon">
            {{ mon }}월
          </option>
        </select>
      </div>
      <div v-if="search.TYPE === 'COMBO'" class="">
        <select v-model="search.VALUE" class="form-control">
          <option v-for="(item, index) in comboList" :key="`combo-${index}`" :value="item[search.OPTION.valueKey]">
            {{ item[search.OPTION.nameKey] }}
          </option>
        </select>
      </div>
    </div>
    <div v-if="isUseSearch" class="flex-none">
      <button type="button" class="btn btn-gray" @click="fnSearch">검색</button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getApiParamData } from '@/api/common/api'

export default {
  name: 'PubDashboardSearch',
  props: {
    initMsgSearchData: {
      type: [Array]
    },
    orgList: {
      type: Array
    },
    usrDashCond: {
      type: Array
    }
  },
  data() {
    return {
      comboList: []
    }
  },
  computed: {
    isUseSearch() {
      return this.initMsgSearchData.length > 0 && Object.keys(this.initMsgSearchData[0]).length > 0
    }
  },
  watch: {},
  created() {
    this.fnInit()
  },
  mounted() {},
  methods: {
    fnInit() {
      // 검색을 사용하지 않는 경우 스킵
      if (!this.isUseSearch) {
        this.fnSearch()
        return
      }
      // COMBO 콤보는 콤보 목록 조회 후 첫번째 옵션으로 설정
      this.initMsgSearchData.forEach((search, index) => {
        // 이전에 검색한 값
        let usrDashCondValue = this.fnGetUsrDashConValue(search.KEY)
        if (search.TYPE === 'ORG') {
          // 조직
          search.VALUE = usrDashCondValue || this.orgList[0].orgSeq
        } else if (search.TYPE === 'MONTH') {
          // 월
          search.VALUE = usrDashCondValue || moment().format('M')
        } else if (search.TYPE === 'CTN') {
          search.SEARCHTYPE = 'devUname'
          search.VALUE = usrDashCondValue || ''
        } else if (search.TYPE === 'COMBO') {
          search.list = []
          this.fnGetComboList(search)
          search.VALUE = usrDashCondValue || ''
        }
      })

      // 콤보를 갖고 있는 경우 콤보 옵션 목록이 조회 된 후 검색 호출
      // 콤보 외에는 바로 호출
      if (!this.initMsgSearchData.find(search => search.TYPE === 'COMBO')) {
        this.$nextTick(() => {
          this.fnSearch()
        })
      }
    },
    fnGetUsrDashConValue(key) {
      let cond = this.usrDashCond.find(con => con.tmplGubun === key)
      return cond ? cond.tmplCondVlu : undefined
    },
    fnGetComboList(search) {
      let url = search.OPTION.apiUri
      if (url === '/bAttb') {
        // 배전반 속성 콤포
        this.comboList = [{ value: '', name: 'PD1.MaxValue' }]
      }
    },
    fnGetApiParamData(search) {
      return new Promise((resolve) => {
        getApiParamData({
          xMid: 'P00001',
          apiSeq: search.OPTION.apiSeq
        }).then((data) => {
          search.apiParamList = data.tbIotParamDTOList
          resolve(search)
        }).catch((e) => {
          console.error(e)
        })
      })
    },
    fnSearch() {
      this.$emit('search')
    },
    fnGetSearchParams() {
      // 검색 시 상위에서 호출한다.
      let searchData = {}
      if (this.isUseSearch) {
        this.initMsgSearchData.forEach((search) => {
          searchData[search.KEY] = search.VALUE
        })
      }

      return searchData
    }
  }
}
</script>

<style lang="less" scoped>
</style>
