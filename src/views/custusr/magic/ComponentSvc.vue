<template>
  <div>
    <div class="dashboard setting">
      <!-- 템플릿 선택 -->
      <component-tmpl-list-comp
        ref="templateListComp"
        class="left"
        :xMid="xMid"
        @select="fnSelectTemplate"
      ></component-tmpl-list-comp>
      <div class="right">
        <!-- 컴포넌트 목록 -->
        <component-list-comp
          ref="componentListComp"
          class="setting-top"
          :xMid="xMid"
          @select="fnGetComponentData"
        ></component-list-comp>
        <!-- 컴포넌트 설정 -->
        <div class="setting-btm">
          <h4 class="titH4">{{ $t('component-setting') }}</h4>
          <div class="templete-setting">
            <div class="unit flex justify-center items-center flex-col">
              <div class="image-box flex justify-center items-center">
                <img
                  :src="componentData.tmplRuleImg"
                  alt="템플릿 이미지"
                  id="theimage"
                  style="height: 170px;"
                />
              </div>
              <div class="pt-1">{{ componentData.tmplCdNm }}</div>
            </div>
            <div class="unit px-0">
              <div class="form-item">
                <span class="form-label w-32">{{ $t('service') }}</span>
                <select
                  v-model="componentData.svcCd"
                  ref="svcCd"
                  class="form-control"
                  title="서비스"
                  @change="fnGetDevClsList"
                >
                  <option value>{{ $t('select') }}</option>
                  <option
                    v-for="(svc, index) in svcCdList"
                    :key="`svcCd-${index}`"
                    :value="svc.svcCd"
                    >{{ svc.svcCdNm }}</option
                  >
                </select>
              </div>
              <div class="form-item">
                <span class="form-label w-32">{{ $t('dev-cls-nm') }}</span>
                <select
                  v-model="componentData.devClsCd"
                  class="form-control"
                  title="장비유형"
                >
                  <option value>{{ $t('select') }}</option>
                  <option
                    v-for="(devCls, index) in devClsList"
                    :key="`devCls-${index}`"
                    :value="devCls.devClsCd"
                    >{{ devCls.devClsNm }}</option
                  >
                </select>
              </div>
              <div class="form-item">
                <span class="form-label w-32">{{ $t('tmpl-gubun') }}</span>
                <select
                  v-model="componentData.tmplGubun"
                  :title="$t('tmpl-gubun')"
                  class="form-control"
                >
                  <option value>{{ $t('select') }}</option>
                  <option value="T">{{ $t('topic') }}</option>
                  <option value="A">{{ $t('api') }}</option>
                  <option value="Q">{{ $t('query') }}</option>
                </select>
              </div>
              <div v-if="componentData.tmplGubun === 'T'" class="form-item">
                <span class="form-label w-32">{{ $t('topic') }}</span>
                <select
                  v-model="componentData.topicId"
                  :title="$t('topic')"
                  class="form-control"
                >
                  <option value>{{ $t('select') }}</option>
                  <option
                    v-for="topic in topicList"
                    :key="topic.topicId"
                    :value="topic.topicId"
                    >{{ topic.topicNm }}</option
                  >
                </select>
              </div>
              <div v-if="componentData.tmplGubun === 'A'" class="form-item">
                <span class="form-label w-32">{{ $t('api') }}</span>
                <div class="input-group">
                  <input
                    type="text"
                    v-model="componentData.apiUrl"
                    class="form-control"
                    placeholder
                    title="API"
                    readonly="readonly"
                  />
                  <button
                    class="btn btn-gray input-group-addon"
                    type="button"
                    @click="fnShowApiList()"
                  >
                    {{ $t('search') }}
                  </button>
                </div>
              </div>
              <div class="form-item">
                <span class="form-label w-32">{{ $t('title') }}</span>
                <input
                  type="text"
                  v-model="componentData.dashTmplTitle"
                  class="form-control"
                  placeholder
                  :title="$t('title')"
                />
              </div>
              <div class="form-item">
                <span class="form-label w-32">{{ $t('description') }}</span>
                <input
                  type="text"
                  v-model="componentData.dashTmplDesc"
                  class="form-control"
                  placeholder
                  :title="$t('description')"
                />
              </div>
              <!-- 갱신 주기 -->
              <div class="form-item">
                <span class="form-label w-32">{{
                  $t('refresh-interval')
                }}</span>
                <div class="input-group">
                  <select
                    v-model="componentData.refreshData.useYn"
                    class="form-control flex-1"
                  >
                    <option value="Y">{{ $t('use') }}</option>
                    <option value="N">{{ $t('use-no') }}</option>
                  </select>
                  <div class="pl-1 flex-1">
                    <select
                      v-model="componentData.refreshData.dispYn"
                      class="form-control"
                    >
                      <option value="Y">{{ $t('display') }}</option>
                      <option value="N">{{ $t('display-no') }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <!-- 옵션 -->
              <template v-if="initOptionObj">
                <div
                  v-for="(value, key) in initOptionObj"
                  :key="`option-${key}`"
                  class="width-100 flex py-1"
                >
                  <div class="width-30 items-center flex">
                    <b>{{ value }}</b>
                  </div>
                  <div class="width-70">
                    <select
                      v-if="key === 'POPUP'"
                      class="form-control"
                      v-model="componentData.optionData[key]"
                    >
                      <option value>{{ $t('select') }}</option>
                      <option
                        v-for="popup in clickTablePopups"
                        :key="`popup-${popup.value}`"
                        :value="popup.value"
                        >{{ popup.name }}</option
                      >
                    </select>
                    <input
                      v-else
                      type="text"
                      v-model="componentData.optionData[key]"
                      class="form-control"
                    />
                  </div>
                </div>
              </template>
            </div>
            <!-- 검색 영역 설정 -->
            <div
              v-if="Object.keys(initSearchObj).length > 0"
              class="unit width-100"
            >
              <div class="flex justify-between items-center">
                <h5 class="titH5">{{ $t('search-item') }}</h5>
                <div>
                  <button
                    type="button"
                    class="btn btn-gray"
                    @click="fnAddSearchData"
                  >
                    {{ $t('add') }}
                  </button>
                </div>
              </div>
              <div class="pt-1 width-100 table-wrap">
                <table class="table table-col">
                  <colgroup>
                    <col />
                    <col />
                    <col />
                    <col width="100px" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th class="py-1">{{ $t('type') }}</th>
                      <th class="py-1">{{ $t('column-name') }}</th>
                      <th class="py-1">{{ $t('option') }}</th>
                      <th class="py-1"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(search, index) in componentData.searchData"
                      :key="`search-data-${index}`"
                    >
                      <td>
                        <select
                          v-model="search.TYPE"
                          class="form-control"
                          @change="fnChangeSearchDataType(search)"
                        >
                          <option value>{{ $t('use-no') }}</option>
                          <option value="ORG">{{ $t('department') }}</option>
                          <option value="CTN"
                            >{{ $t('pin-nm') }}/{{ $t('ctn') }}</option
                          >
                          <option value="MONTH">{{ $t('month') }}</option>
                          <option value="COMBO">{{ $t('combo') }}</option>
                        </select>
                      </td>
                      <td>
                        <input
                          v-model="search.KEY"
                          class="form-control"
                          type="text"
                        />
                      </td>
                      <td>
                        <select
                          v-if="search.TYPE === 'CTN'"
                          v-model="search.OPTION"
                          class="form-control"
                        >
                          <option value="EQ">Equal</option>
                          <option value="LIKE">Like</option>
                        </select>
                        <div v-if="search.TYPE === 'COMBO'" class="flex">
                          <input
                            type="text"
                            v-model="search.OPTION.apiUri"
                            class="form-control"
                            disabled
                          />
                          <button
                            class="btn btn-gray ml-1"
                            sytle="flex:none"
                            type="button"
                            @click="fnSetSearchOptionAPI(search)"
                          >
                            {{ $t('api-setting') }}
                          </button>
                        </div>
                      </td>
                      <td>
                        <button
                          v-if="index > 0"
                          type="button"
                          class="btn btn-gray"
                          @click="fnRemoveSearchData(index)"
                        >
                          {{ $t('delete') }}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <!-- 컴포넌트 항목 -->
            <div
              v-if="Object.keys(initDataObj).length > 0"
              class="unit width-100"
            >
              <div class="flex justify-between items-center">
                <h5 class="titH5">{{ $t('component-item') }}</h5>
                <div>
                  <button
                    type="button"
                    class="btn btn-gray"
                    @click="fnAddRspMsgData"
                  >
                    {{ $t('add') }}
                  </button>
                </div>
              </div>
              <div class="pt-1 width-100 table-wrap">
                <table class="table table-col">
                  <colgroup>
                    <col
                      v-for="(value, key) in initDataObj"
                      :key="`col-${key}`"
                    />
                    <col width="100px" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th
                        v-for="(value, key) in initDataObj"
                        :key="`header-${key}`"
                        class="py-1"
                      >
                        {{ initDataObj[key] }}
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(data, index) in componentData.rspMsgData"
                      :key="`data-${index}`"
                    >
                      <td
                        v-for="(value, key) in initDataObj"
                        :key="`data-${index}-${key}`"
                      >
                        <!-- TAG_VALUE: 속성-->
                        <template v-if="key === 'TAG_VALUE'">
                          <select
                            v-model="data[key]"
                            :title="$t('device-attr')"
                            class="form-control"
                          >
                            <option value>{{ $t('select') }}</option>
                            <option
                              v-for="(attr, attrIndex) in deviceAttrList"
                              :key="`attr-${attrIndex}`"
                              :value="attr.colNmCd"
                              >{{ attr.devAttbCdNm }}</option
                            >
                          </select>
                        </template>
                        <!-- NO: 순번 -->
                        <template v-else-if="key === 'NO'">{{
                          data[key]
                        }}</template>
                        <!-- DEV_CLS: 장비유형 -->
                        <template v-else-if="key === 'DEV_CLS'">
                          <select
                            v-model="data[key]"
                            class="form-control"
                            title="장비유형"
                            @change="fnClearDevRowData(data, 'DEV_CLS')"
                          >
                            <option value>{{ $t('select') }}</option>
                            <option
                              v-for="(devCls, devClsIndex) in devClsList"
                              :key="`devCls-${devClsIndex}`"
                              :value="devCls.devClsCd"
                              >{{ devCls.devClsNm }}</option
                            >
                          </select>
                        </template>
                        <!-- DEV_MDL: 장비모델 -->
                        <template v-else-if="key === 'DEV_MDL'">
                          <select
                            v-model="data[key]"
                            class="form-control"
                            @change="fnClearDevRowData(data, 'DEV_MDL')"
                          >
                            <option value>{{ $t('select') }}</option>
                            <option
                              v-for="(mdl,
                              mdlIndex) in fnGetDevMdlListByDevClsCd(
                                data.DEV_CLS
                              )"
                              :key="`${index}-mdl-${mdlIndex}`"
                              :value="mdl.devMdlCd"
                              >{{ mdl.devMdlNm }}</option
                            >
                          </select>
                        </template>
                        <!-- ENTR_DEV: 장비 -->
                        <template v-else-if="key === 'ENTR_DEV'">
                          <select v-model="data[key]" class="form-control">
                            <option value>{{ $t('select') }}</option>
                            <option
                              v-for="(dev, devIndex) in fnGetEdevListByDevMdlCd(
                                data.DEV_MDL
                              )"
                              :key="`${index}-dev-${devIndex}`"
                              :value="dev.entrDevSeq"
                              >{{ dev.devUname }}</option
                            >
                          </select>
                        </template>
                        <!-- TAG_VALUE_BY_CLS: 같은 row의 장비 유형의 속성 -->
                        <template v-else-if="key === 'TAG_VALUE_BY_CLS'">
                          <select v-model="data[key]" class="form-control">
                            <option value>{{ $t('select') }}</option>
                            <option
                              v-for="(attb,
                              attbIndex) in fnGetDeviceAttrListByDevMdlCd(
                                data.DEV_MDL
                              )"
                              :key="`${index}-attb-${attbIndex}`"
                              :value="attb.colNmCd"
                              >{{ attb.devAttbCdNm }}</option
                            >
                          </select>
                        </template>
                        <template v-else>
                          <input
                            type="text"
                            v-model="data[key]"
                            class="form-control"
                            placeholder
                            style="width:100%"
                          />
                        </template>
                      </td>
                      <td>
                        <button
                          type="button"
                          class="btn btn-gray"
                          @click="fnRemoveRspMsgData(index)"
                        >
                          {{ $t('delete') }}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <!-- API 파라미터 -->
            <div
              v-if="componentData.apiParamList.length > 0"
              class="unit width-100 py-0 md-pt-3"
            >
              <h5 class="titH5">{{ $t('api-parameter') }}</h5>
            </div>
            <div
              v-if="componentData.apiParamList.length > 0"
              class="unit width-100 flex flex-wrap md-p-0 md-pt-2"
            >
              <!-- api Param 가져가다 보여주는거 해야함 -->
              <div
                v-for="(param, index) in componentData.apiParamList"
                :key="`apiParam-${index}`"
                class="form-item width-50"
              >
                <span
                  class="form-label w-40"
                  :class="{ 'lb-txt': param.requiredYn === 'Y' }"
                  >{{ param.paramKey }}</span
                >
                <input
                  type="text"
                  v-model="param.paramValue"
                  class="form-control"
                  placeholder
                  style="width:100%"
                />
              </div>
            </div>
            <!-- 쿼리 -->
            <div
              v-if="componentData.tmplGubun === 'Q'"
              class="unit width-100 py-0"
            >
              <h5 class="titH5">{{ $t('query') }}</h5>
            </div>
            <div
              v-if="componentData.tmplGubun === 'Q'"
              class="unit width-100 flex flex-wrap"
            >
              <textarea
                v-model="componentData.query"
                class="form-control"
                rows="3"
              ></textarea>
            </div>
            <!-- 버튼-->
            <div class="unit width-100 pt-0">
              <div class="text-center pt-3">
                <button
                  type="button"
                  class="btn btn-pink"
                  @click="fnShowSaveConfirmPopup()"
                >
                  {{ $t('save') }}
                </button>
                <button
                  type="button"
                  class="btn btn-gray"
                  @click="fnShowDeleteConfirmPopup()"
                >
                  {{ $t('delete') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import ComponentTmplListComp from './ComponentTmplListComp'
import ComponentListComp from './ComponentListComp'
import {
  getSvcList,
  getDevClsCdListBySvcCd,
  getDevMdlListByDevCls
} from '@/api/common/usrSvcDevice'

const DATA_MAX_COUNT = 15
const CLICK_TABLE_POPUPS = [
  { value: 'DetectionReportPopupSvc', name: '이상현황' },
  { value: 'AiDetectionPopupSvc', name: 'AI비전검사 불량리스트' },
  { value: 'VideoDetectionPopupSvc', name: '영상플랫폼 이상징후' }
]

export default {
  name: 'ComponentSvc',
  components: { ComponentTmplListComp, ComponentListComp },
  data() {
    return {
      xMid: 'P00046',
      componentData: {
        tmplCdId: '',
        tmplCdNm: '',
        tmplSeq: '',
        tmplRuleImg: '',
        tmplType: '',
        svcCd: '',
        devClsCd: '',
        tmplGubun: '',
        topicId: '',
        apiSeq: null,
        apiUrl: null,
        dashTmplTitle: '',
        dashTmplDesc: '',
        initMsg: '',
        initMsgData: [],
        searchData: [], // 검색 타입
        rspMsg: '',
        rspMsgData: [],
        apiParamList: [],
        reqMsg: '',
        reqMsgData: [],
        optionData: {},
        refreshData: {
          useYn: 'Y',
          dispYn: 'Y'
        }
      },
      svcCdList: [],
      devClsList: [],
      devMdlListAll: [],
      edevListAll: [],
      deviceAttrList: [], // 장비유형의 속성 목록 조회
      deviceAttrListAll: [], // 서비스의 전체 속성 목록 조회
      clickTablePopups: CLICK_TABLE_POPUPS
    }
  },
  computed: {
    initDataObj() {
      if (
        !this.componentData.initMsg ||
        this.componentData.initMsg.length === 0
      ) {
        return {}
      }

      let initMsgObj = JSON.parse(this.componentData.initMsg)
      return Array.isArray(initMsgObj.DATA) ? initMsgObj.DATA[0] : {}
    },
    initSearchObj() {
      if (
        !this.componentData.initMsg ||
        this.componentData.initMsg.length === 0
      ) {
        return {}
      }

      let initMsgObj = JSON.parse(this.componentData.initMsg)
      return !Array.isArray(initMsgObj.SEARCH) ||
        initMsgObj.SEARCH.length === 0 ||
        Object.keys(initMsgObj.SEARCH[0]).length === 0
        ? { TYPE: '검색구분', OPTION: '검색옵션' }
        : initMsgObj.SEARCH[0]
    },
    initOptionObj() {
      if (
        !this.componentData.initMsg ||
        this.componentData.initMsg.length === 0
      ) {
        return {}
      }

      let initMsgObj = JSON.parse(this.componentData.initMsg)
      return initMsgObj.OPTION && Object.keys(initMsgObj.OPTION).length > 0
        ? initMsgObj.OPTION
        : null
    },
    dataMaxCount() {
      if (
        !this.componentData.initMsg ||
        this.componentData.initMsg.length === 0
      ) {
        return DATA_MAX_COUNT
      }
      let initMsgObj = JSON.parse(this.componentData.initMsg)
      return initMsgObj.DATA_MAX_COUNT
        ? initMsgObj.DATA_MAX_COUNT
        : DATA_MAX_COUNT
    },
    visibleSearchData() {
      return this.componentData.searchData.length > 0
    }
  },
  watch: {
    'componentData.svcCd'() {
      this.fnGetDevClsList()

      // 컴포넌트 항목 중 장비유형, 장비모델, 장비가 있는 경우
      // 서비스의 장비 모델, 장비 목록 전체를 조회하여
      // 장비유형, 장비 모델이 변경될 때마다 필터링하여 사용
      if (Object.keys(this.initDataObj).includes('DEV_MDL')) {
        this.fnGetDevMdlList()
        this.fnGetEdevList()
        this.fnGetDeviceAttrListBySvcCd()
      } else {
        this.devMdlListAll = []
        this.edevListAll = []
        this.deviceAttrListAll = []
      }
    },
    'componentData.devClsCd'() {
      this.fnGetDeviceAttrList()
    }
  },
  created() {
    this.fnGetTopicList()
    this.fnGetSvcCdList()
  },
  mounted() {},
  methods: {
    // -------------------- 공통
    fnGetTopicList() {
      let paramObj = {}
      requestApi({
        url: '/online/iotTopic/getTopicList',
        headers: {
          'X-MID': 'P00046'
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.topicList = res.data
          }
        }
      })
    },
    fnGetSvcCdList() {
      getSvcList({ xMid: this.xMid })
        .then(data => {
          this.svcCdList = data
        })
        .catch(e => {
          console.error(e)
        })
    },
    fnGetDevClsList() {
      this.devClsList = []
      if (this.componentData.svcCd === '') {
        return false
      }
      getDevClsCdListBySvcCd({
        xMid: this.xMid,
        svcCd: this.componentData.svcCd
      })
        .then(data => {
          this.devClsList = data.devClsList
        })
        .catch(e => {
          console.error(e)
        })
    },
    // 장비 속성 목록 조회 - 장비 유형
    fnGetDeviceAttrList() {
      if (!this.componentData.devClsCd || this.componentData.devClsCd === '') {
        return
      }
      requestApi({
        url: '/online/iotsdev/retrieveSDevColAttb',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: { devClsCd: this.componentData.devClsCd },
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.deviceAttrList = res.data
          }
        }
      })
    },
    // 서비스의 장비 모델별 장비 속성 조회
    fnGetDeviceAttrListBySvcCd() {
      if (!this.componentData.svcCd || this.componentData.svcCd === '') {
        return
      }
      requestApi({
        url: '/online/iotsdev/retrieveDevColAttbListBySvcCd',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: { svcCd: this.componentData.svcCd },
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.deviceAttrListAll = res.data
          }
        }
      })
    },
    // 장비 유형의 장비 속성 조회
    fnGetDeviceAttrListByDevMdlCd(devMdlCd) {
      return this.deviceAttrListAll.filter(item => item.devMdlCd === devMdlCd)
    },
    // 장비 모델 조회
    fnGetDevMdlList() {
      getDevMdlListByDevCls({ svcCd: this.componentData.svcCd }, this.xMid)
        .then(data => {
          this.devMdlListAll = data
        })
        .catch(e => {
          console.error(e)
        })
    },
    // 장비 유형의 장비 모델 조회
    fnGetDevMdlListByDevClsCd(devClsCd) {
      return this.devMdlListAll.filter(item => item.devClsCd === devClsCd)
    },
    // 장비 조회 목록 조회
    fnGetEdevList() {
      // 장비관리 > 장비 목록 조회 API 재활용
      let searchData = {
        svcCd: this.componentData.svcCd,
        statusCd: 'A',
        displayRowCount: '99999',
        currentPage: '1'
      }
      requestApi({
        url: '/online/iotedev/retrieveIotEDev',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: searchData,
        callback: res => {
          if (res.data && res.data.dataList) {
            this.edevListAll = res.data.dataList
          }
        }
      })
    },
    // 장비 모델의 장비 목록 조회
    fnGetEdevListByDevMdlCd(devMdlCd) {
      return this.edevListAll.filter(item => item.devMdlCd === devMdlCd)
    },
    fnClearDevRowData(data, key) {
      if (key === 'DEV_CLS') {
        data.DEV_MDL = ''
        data.ENTR_DEV = ''
        data.TAG_VALUE_BY_CLS = ''
      } else if (key === 'DEV_MDL') {
        data.ENTR_DEV = ''
      }
    },
    // 템플릿 선택
    fnSelectTemplate(template) {
      this.fnInitComponentData()

      this.componentData.tmplCdId = template.tmplCdId
      this.componentData.tmplSeq = template.tmplSeq
      this.componentData.tmplCdNm = template.tmplCdNm
      this.componentData.tmplRuleImg = template.tmplRuleImg
      this.componentData.svcCd = this.svcCdList[0].svcCd
      // 컴포넌트의 tmplGubun(API/TOPIC)과 상이하여 tmplType(막대,원형등)올 key 변경
      this.componentData.tmplType = template.tmplGubun
      this.componentData.initMsg = template.initData

      if (template.initData && template.initData.length > 0) {
        this.fnAddRspMsgData()
        this.fnAddSearchData()
        this.fnSetOptionData()
      }
    },
    // 컴포넌트 상세 조회
    fnGetComponentData(usrDashTmplSeq) {
      this.fnInitComponentData()

      let params = {
        currentPage: 1,
        displayRowCount: 1,
        usrDashTmplSeq: usrDashTmplSeq
      }

      requestApi({
        url: '/online/com/usrDash/getIotDashTmplList',
        headers: {
          'X-MID': 'P00046'
        },
        method: 'post',
        data: params,
        callback: res => {
          let componentData = res.data.dataList[0]

          // rsp && init 관련
          if (componentData.initMsg && componentData.initMsg.length > 0) {
            let initData = JSON.parse(componentData.initMsg)
            componentData.initMsgData = initData.DATA
            componentData.searchData = initData.SEARCH || []
          }

          componentData.rspMsgData = []
          if (componentData.rspMsg && componentData.rspMsg.length > 0) {
            let rspMsg = JSON.parse(componentData.rspMsg)
            componentData.rspMsgData = rspMsg.DATA
            if (rspMsg.SEARCH) {
              componentData.searchData = rspMsg.SEARCH
            }
            componentData.refreshData = rspMsg.REFRESH
              ? rspMsg.REFRESH
              : { useYn: 'Y', dispYn: 'Y' }
          }

          // req && apiParam 관련
          if (componentData.reqMsg && componentData.reqMsg.length > 0) {
            componentData.reqMsgData = JSON.parse(componentData.reqMsg)
          }

          if (componentData.tmplGubun === 'A') {
            // A: API, T: TOPIC, Q: QUERY
            componentData.apiParamList = componentData.tbIotParamDTOList.sort(
              (a, b) => {
                return a.paramGubun > b.paramGubun
                  ? -1
                  : a.paramGubun < b.paramGubun
                    ? 1
                    : 0
              }
            )
            componentData.apiParamList.forEach(param => {
              if (param.paramGubun === 'B') {
                // B: BODY, H: HEADER
                param.paramValue =
                  componentData.reqMsgData.body[param.paramKey] || ''
              } else {
                param.paramValue =
                  componentData.reqMsgData.header[param.paramKey] || ''
              }
            })
          } else {
            componentData.apiParamList = []
          }

          // extraMsg - 쿼리 & 옵션
          if (componentData.extraMsg && componentData.extraMsg.length > 0) {
            let extraMsgObj = JSON.parse(componentData.extraMsg)
            if (componentData.tmplGubun === 'Q') {
              componentData.query = extraMsgObj.query
              delete extraMsgObj.query
            }
            componentData.optionData = extraMsgObj
          }

          this.componentData = componentData
        }
      })
    },
    // -------------------- 컴포넌트 상세
    fnInitComponentData() {
      this.componentData = {
        tmplCdId: '',
        tmplCdNm: '',
        tmplSeq: '',
        tmplRuleImg: '',
        tmplType: '',
        svcCd: '',
        devClsCd: '',
        tmplGubun: '',
        topicId: '',
        apiSeq: null,
        apiUrl: null,
        dashTmplTitle: '',
        dashTmplDesc: '',
        initMsg: '',
        initMsgData: [],
        rspMsg: '',
        rspMsgData: [],
        apiParamList: [],
        reqMsg: '',
        reqMsgData: [],
        searchData: [],
        optionData: {},
        refreshData: {
          useYn: 'Y',
          dispYn: 'Y'
        }
      }
    },
    fnShowApiList() {
      this.popup({
        component: () => import('@/views/env/program/apiMgmtSearch'),
        title: this.$t('api-list'),
        width: '900',
        height: '510',
        data: {
          apiNm: '',
          url: '/online/com/api/getIotDashApi',
          xMid: this.xMid
        },
        callback: data => {
          if (data !== 'dismiss') {
            this.componentData.apiSeq = data.apiSeq
            this.componentData.apiUrl = data.apiUri
            this.componentData.apiParamList = data.tbIotParamDTOList.sort(
              (a, b) => {
                return a.paramGubun > b.paramGubun
                  ? -1
                  : a.paramGubun < b.paramGubun
                    ? 1
                    : 0
              }
            )
          }
        }
      })
    },
    // -------------------- 옵션 항목
    fnSetOptionData() {
      // 설정할 옵션이 없는 경우
      if (!this.initOptionObj) {
        return
      }
      let optionObj = JSON.parse(JSON.stringify(this.initOptionObj))
      Object.keys(optionObj).forEach(key => {
        optionObj[key] = ''
      })
      this.componentData.optionData = optionObj
    },
    // -------------------- 검색 항목
    fnAddSearchData() {
      if (this.componentData.searchData.length >= 2) {
        this.alert('검색영역은 2개까지 설정할 수 있습니다.', 'warning')
        return
      }
      let searchObj = JSON.parse(JSON.stringify(this.initSearchObj))
      Object.keys(searchObj).forEach(key => {
        searchObj[key] = ''
      })
      this.componentData.searchData.push(searchObj)
    },
    fnRemoveSearchData(index) {
      this.componentData.searchData.splice(index, 1)
    },
    fnChangeSearchDataType(search) {
      if (search.TYPE === 'CTN') {
        search.OPTION = 'EQ'
      } else if (search.TYPE === '') {
        search.OPTION = {
          apiSeq: '',
          apiUri: '',
          nameKey: '',
          valueKey: ''
        }
      } else {
        search.OPTION = ''
      }
    },
    fnSetSearchOptionAPI(search) {
      this.popup({
        component: () => import('@/views/custusr/magic/SearchOptionApiSvc'),
        title: this.$t('api-setting'),
        width: '500',
        height: '330',
        data: {
          searchOption: search.OPTION,
          xMid: this.xMid
        },
        callback: data => {
          if (data !== 'dismiss') {
            search.OPTION = data
          }
        }
      })
    },
    // -------------------- 컴포넌트 항목
    fnAddRspMsgData() {
      if (this.componentData.rspMsgData.length >= this.dataMaxCount) {
        this.alert(
          '항목은 ' + this.dataMaxCount + '개까지 설정할 수 있습니다.',
          'warning'
        )
        return
      }
      let rspMsgObj = JSON.parse(JSON.stringify(this.initDataObj))
      Object.keys(rspMsgObj).forEach(key => {
        // 순번인 경우 index를 기본값으로 추가
        rspMsgObj[key] =
          key === 'NO' ? this.componentData.rspMsgData.length + 1 : ''
      })
      this.componentData.rspMsgData.push(rspMsgObj)
    },
    fnRemoveRspMsgData(index) {
      this.componentData.rspMsgData.splice(index, 1)
    },
    fnShowSaveConfirmPopup() {
      if (!this.fnValidSaveComponent()) {
        return false
      }
      let msg =
        !this.componentData.usrDashTmplSeq ||
        this.componentData.usrDashTmplSeq === ''
          ? this.$t('saveYn')
          : this.$t('modifyYn')
      this.confirm(msg, this.fnSaveComponent)
    },
    fnSaveComponent() {
      let devCls = this.devClsList.find(
        devCls => devCls.devClsCd === this.componentData.devClsCd
      )

      let reqData = {
        tmplSeq: this.componentData.tmplSeq,
        tmplGubun: this.componentData.tmplGubun,
        dashTmplTitle: this.componentData.dashTmplTitle,
        dashTmplDesc: this.componentData.dashTmplDesc,
        devClsCd: this.componentData.devClsCd,
        devClsCdNm: devCls.devClsNm,
        svcCd: this.componentData.svcCd,
        colNmCd: this.componentData.colNmCd
      }

      // reqMsg
      let reqMsg = {
        header: {},
        body: {}
      }

      if (this.componentData.tmplGubun === 'A') {
        reqData.apiSeq = this.componentData.apiSeq
        reqData.apiUrl = this.componentData.apiUrl
        reqData.topicId = ''

        this.componentData.apiParamList.forEach(param => {
          if (param.paramGubun === 'B') {
            reqMsg.body[param.paramKey] = param.paramValue
          } else {
            reqMsg.header[param.paramKey] = param.paramValue
          }
        })
      } else {
        reqData.apiSeq = null
        reqData.apiUrl = ''
        reqData.topicId = this.componentData.topicId
      }
      reqData.reqMsg = encodeURIComponent(JSON.stringify(reqMsg))

      // rspMsg
      let rspMsg = {
        DATA: this.componentData.rspMsgData,
        SEARCH: this.componentData.searchData,
        REFRESH: this.componentData.refreshData
      }
      reqData.rspMsg = encodeURIComponent(JSON.stringify(rspMsg))

      // extraMsg
      let extraMsg = {}
      if (this.componentData.tmplGubun === 'Q') {
        extraMsg.query = this.componentData.query
      }
      if (this.initOptionObj) {
        // 옵션 설정 필요 시
        Object.keys(this.componentData.optionData).forEach(key => {
          extraMsg[key] = this.componentData.optionData[key]
        })
      }
      reqData.extraMsg = encodeURIComponent(JSON.stringify(extraMsg))

      if (
        !this.componentData.usrDashTmplSeq ||
        this.componentData.usrDashTmplSeq === ''
      ) {
        this.fnAddComponent(reqData)
      } else {
        reqData.usrDashTmplSeq = this.componentData.usrDashTmplSeq
        this.fnModifyComponent(reqData)
      }
    },
    fnAddComponent(paramObj) {
      requestApi({
        url: '/online/com/usrDash/insertIotDashTmpl',
        headers: {
          'X-MID': 'P00046'
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('save-success'), 'success')
            // 컴포넌트 목록 다시 조회
            this.$refs.componentListComp.fnGetComponentList()
            // 템플릿 설정 등록 초기화
            this.fnInitComponentData()
          } else {
            this.alert(this.$t('save-fail'))
          }
        }
      })
    },
    fnModifyComponent(paramObj) {
      requestApi({
        url: '/online/com/usrDash/updateIotDashTmpl',
        headers: {
          'X-MID': 'P00046'
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('modify-success'), 'success')
            // 컴포넌트 목록 갱신
            this.$refs.componentListComp.fnGetComponentList()
          } else {
            this.alert(this.$t('save-fail'))
          }
        }
      })
    },
    fnValidSaveComponent() {
      if (this.componentData.tmplSeq === '') {
        this.alert(this.$t('request-template-select'), 'warning')
        return false
      }

      if (this.componentData.svcCd === '') {
        this.alert('서비스를 선택해주세요.', 'warning')
        return false
      }

      if (this.componentData.devClsCd === '') {
        this.alert(this.$t('request-device-select'), 'warning')
        return false
      }

      if (this.componentData.tmplGubun === '') {
        this.alert(this.$t('request-tmpl-gubun-select'), 'warning')
        return false
      }

      if (
        this.componentData.tmplGubun === 'A' &&
        this.componentData.apiUrl === ''
      ) {
        this.alert(this.$t('request-api-search'), 'warning')
        return false
      }

      if (
        this.componentData.tmplGubun === 'T' &&
        this.componentData.topicId === ''
      ) {
        this.alert(this.$t('request-topic-select'), 'warning')
        return false
      }

      if (this.componentData.dashTmplTitle === '') {
        this.alert(this.$t('request-title-input'), 'warning')
        return false
      }

      if (this.componentData.dashTmplDesc === '') {
        this.alert(this.$t('request-description-input'), 'warning')
        return false
      }

      if (this.componentData.tmplGubun === 'A') {
        let notValidParam = this.componentData.apiParamList.find(
          param =>
            param.requiredYn === 'Y' &&
            (!param.paramValue || param.paramValue.length === 0)
        )

        if (notValidParam) {
          this.alert(
            notValidParam.paramKey + this.$t('request-input'),
            'warning'
          )
          return false
        }
      }

      return true
    },
    fnShowDeleteConfirmPopup() {
      if (
        !this.componentData.usrDashTmplSeq ||
        this.componentData.usrDashTmplSeq === ''
      ) {
        this.alert(this.$t('no-selected-row'))
        return
      }
      this.confirm(this.$t('delYn'), this.fnDeleteComponent)
    },
    fnDeleteComponent() {
      requestApi({
        url: '/online/com/usrDash/deleteIotUsrDashTmpl',
        headers: {
          'X-MID': 'P00046'
        },
        method: 'post',
        data: { usrDashTmplSeq: this.componentData.usrDashTmplSeq },
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('del-success'), 'success')
            this.fnInitComponentData()
            this.$refs.componentListComp.fnGetComponentList()
          } else {
            this.alert(this.$t('del-fail'), 'error')
          }
        }
      })
    }
  }
}
</script>

<style></style>
