<template>
  <div class="flex" :class="{'p-0': !isUseSearch}">
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
        <div class="flex-1">
          <input v-model="search.VALUE" type="text" class="form-control" @keyup.enter="fnSearch" />
        </div>
      </div>
      <div v-if="search.TYPE === 'MONTH'" class="">
        <select v-model="search.VALUE" class="form-control" style="width: 95px">
          <option v-for="month in monthOptions" :key="`month-${month}`" :value="month">
            {{ month }}
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
import { getApiParamData, excuteApi } from '@/api/common/api'

export default {
  name: 'DashboardChartSearch',
  props: {
    initMsgSearchData: {
      type: [Array]
    },
    orgList: {
      type: Array
    },
    savedSearchValue: {
      type: Object
    },
    items: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      comboList: [],
      monthOptions: []
    }
  },
  computed: {
    isUseSearch() {
      return this.initMsgSearchData.length > 0 &&
        Object.keys(this.initMsgSearchData[0]).length > 0 && !this.initMsgSearchData.find(i => i.TYPE === '')
    }
  },
  watch: {},
  created() {
    this.fnInit()
    this.fnSetMonthOption()
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
        let savedSearchValue = this.savedSearchValue[search.KEY]
        if (search.TYPE === 'ORG') { // 조직
          search.VALUE = savedSearchValue || this.orgList[0].orgSeq
        } else if (search.TYPE === 'MONTH') { // 월
          search.VALUE = savedSearchValue || moment().format('YYYY-MM')
        } else if (search.TYPE === 'CTN') { // CTN
          let key = Object.keys(this.savedSearchValue).find(key => key === 'devUname' || key === 'ctn')
          search.SEARCHTYPE = key || 'devUname'
          search.VALUE = this.savedSearchValue[key] || ''
        } else if (search.TYPE === 'COMBO') { // COMBO
          search.list = []
          this.fnGetComboList(search)
          search.VALUE = savedSearchValue || ''
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
    fnSetMonthOption() {
      // 월 검색 옵션
      // 현재부터 12개월 이전까지 생성
      let monthOpitons = []
      for (let i = 0; i < 12; i++) {
        monthOpitons.push(moment().subtract(i, 'months').format('YYYY-MM'))
      }
      this.monthOptions = monthOpitons
    },
    fnGetSavedSearchValue(search) {
      let cond = this.savedSearchValue.find(con => {
        if (search.TYPE === 'CTN') {
          return con.tmplGubun === 'ctn' || con.tmplGubun === 'devUname'
        }
        return con.tmplGubun === search.KEY
      })
      return cond
    },
    async fnGetComboList(search) {
      // 콤보 api 호출하기 전에 api 파라미터를 먼저 조회한다.
      search = await this.fnGetApiParamData(search)

      let data = {
        headers: {},
        body: {},
        url: search.OPTION.apiUri
      }

      // api 설정 시 입력한 파라미터 추가
      if (search.apiParamList && search.apiParamList.length > 0) {
        search.apiParamList.forEach((param) => {
          if (param.paramGubun === 'B') {
            data.body[param.paramKey] = search.OPTION[param.paramKey]
          } else {
            data.headers[param.paramKey] = search.OPTION[param.paramKey]
          }
        })
      }

      // 해당 컴포넌트의 기본정보도 파라미터 추가
      if (this.items.svcCd) {
        data.body.svcCd = this.items.svcCd
      }

      if (this.items.devClsCd) {
        data.body.devClsCd = this.items.devClsCd
      }

      excuteApi(data).then((data) => {
        if (search.OPTION.responseKey && search.OPTION.responseKey.length > 0) {
          this.comboList = _.get(data, search.OPTION.responseKey)
        } else {
          this.comboList = data
        }
        if (!search.VALUE || search.VALUE.length === 0) {
          search.VALUE = this.comboList[0][search.OPTION.valueKey]
        }
        // 콤보가 있는 경우 콤보 목록 조회 및 기본값 세팅 후 검색 호출
        this.fnSearch()
      })
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
          let key = search.KEY
          // CTN인 경우 선택된 구분값(식별명/CTN)으로 키를 설정한다.
          if (search.TYPE === 'CTN') {
            key = search.SEARCHTYPE

            // CTN인 경우 검색 옵션을 추가로 설정한다.
            searchData.searchEqLike = search.OPTION
          }
          searchData[key] = search.VALUE
        })
      }

      return searchData
    }
  }
}
</script>

<style lang="less" scoped>
</style>
