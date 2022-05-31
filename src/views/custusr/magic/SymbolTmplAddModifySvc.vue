<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-6 col-md-4">
          <span class="form-label w-32 lb-txt">{{ $t('template-name') }}</span>
          <input v-model="tmplData.tmplNm" type="text" class="form-control" />
        </div>
        <div class="form-item col-sm-6 col-md-4">
          <span class="form-label w-32 lb-txt">{{ $t('symbol') }}</span>
          <select
            v-model="tmplData.symSeq"
            class="form-control"
            :disabled="!isNew"
          >
            <option value="">{{ $t('select') }}</option>
            <option
              v-for="(symbol, index) in symbolList"
              :key="`symbol-${index}`"
              :value="symbol.symSeq"
            >
              {{ symbol.symNm }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6 col-md-4">
          <span class="form-label w-32 lb-txt">{{ $t('service') }}</span>
          <select
            v-model="tmplData.svcCd"
            class="form-control"
            :disabled="!isNew"
          >
            <option value="">{{ $t('select') }}</option>
            <option
              v-for="(svc, index) in svcCdList"
              :key="`svcCd-${index}`"
              :value="svc.svcCd"
              >{{ svc.svcCdNm }}</option
            >
          </select>
        </div>
        <div class="form-item col-sm-6 col-md-4">
          <span class="form-label w-32 lb-txt">{{ $t('dev-cls') }}</span>
          <select
            v-model="tmplData.devClsCd"
            class="form-control"
            :disabled="!isNew"
          >
            <option value="">{{ $t('select') }}</option>
            <option
              v-for="devCls in devClsList"
              :key="'devCls' + devCls.devClsCd"
              :value="devCls.devClsCd"
              >{{ devCls.devClsNm }}</option
            >
          </select>
        </div>
        <div class="form-item col-sm-6 col-md-4">
          <span class="form-label w-32 lb-txt">{{ $t('dev-mdl-nm') }}</span>
          <select
            v-model="tmplData.devMdlCd"
            class="form-control"
            :disabled="!isNew"
          >
            <option value="">{{ $t('select') }}</option>
            <option
              v-for="devMdl in devMdlList"
              v-bind:key="devMdl.devMdlCd"
              :value="devMdl.devMdlCd"
              >{{ devMdl.devMdlNm }}</option
            >
          </select>
        </div>
      </div>
      <div class="mt-3 flex justify-between items-center">
        <h4 class="titH4">{{ $t('symbol-tmpl-attb') }}</h4>
        <div>
          <button
            type="button"
            class="btn btn-gray"
            @click="fnAddAttb"
            :disabled="!tmplData.symSeq || tmplData.symSeq === ''"
          >
            {{ $t('add') }}
          </button>
        </div>
      </div>
      <div
        class="mt-1 table-wrap border-1"
        style="height: 350px; overflow-y: auto;"
      >
        <table class="table table-col" style="min-width:1024px">
          <colgroup>
            <col style="width: 40px" />
            <col style="width: 120px" />
            <col />
            <col />
            <col style="width: 100px" />
            <col style="width: 100px" />
            <col style="width: 100px" />
            <col style="width: 120px" />
            <col style="width: 100px" />
            <col style="width: 100px" />
          </colgroup>
          <thead>
            <tr>
              <th rowspan="2"></th>
              <th rowspan="2">{{ $t('attribute') }}</th>
              <th rowspan="2">{{ $t('condition') }}</th>
              <th rowspan="2">{{ $t('value') }} / {{ $t('image') }}</th>
              <th colspan="3">{{ $t('position') }}</th>
              <th colspan="2">{{ $t('font') }}</th>
              <th rowspan="2"></th>
            </tr>
            <tr>
              <th class="border-left">{{ $t('align') }}</th>
              <th>X</th>
              <th>Y</th>
              <th>{{ $t('color') }}</th>
              <th>{{ $t('size') }}</th>
            </tr>
          </thead>
          <draggable v-model="tmplData.attbList" tag="tbody" handle=".handle">
            <tr
              v-for="(attb, index) in tmplData.attbList"
              :key="`attb-${index}`"
            >
              <td scope="row" class="handle">
                <img src="assets/drag_handle.png" />
              </td>
              <td>
                <!-- 항목 -->
                <select v-model="attb.itemNmCd" class="form-control">
                  <option value="">{{ $t('select') }}</option>
                  <option
                    v-for="item in itemList"
                    :key="`attb-${index}-${item.itemSeq}`"
                    :value="item.itemNmCd"
                  >
                    {{ item.itemNmCdNm }}
                  </option>
                </select>
              </td>
              <td>
                <!-- 조건 -->
                <input
                  v-model="attb.itemWhere"
                  type="text"
                  class="form-control"
                  placeholder="Default"
                  :disabled="disabledInputs[attb.itemNmCd] && disabledInputs[attb.itemNmCd]['whereCd']"
                />
              </td>
              <td>
                <!-- 값/이미지 -->
                <template v-if="fnCheckImageItemNmCd(attb.itemNmCd)">
                  <div class="flex width-100 items-center">
                    <input
                      v-model="attb.itemVal"
                      type="text"
                      class="form-control"
                      :readonly="true"
                    />
                    <label :for="`input-file-${index}`" class="btn btn-gray" :disabled="disabledInputs[attb.itemNmCd] && disabledInputs[attb.itemNmCd]['valueCd']">
                      {{ $t('image-upload') }}
                    </label>
                    <input
                      type="file"
                      :id="`input-file-${index}`"
                      :disabled="disabledInputs[attb.itemNmCd] && disabledInputs[attb.itemNmCd]['valueCd']"
                      style="display:none"
                      @change="fnImageUpload($event, index)"
                    />
                  </div>
                </template>
                <template v-else>
                  <input
                    v-model="attb.itemVal"
                    type="text"
                    class="form-control"
                    :disabled="disabledInputs[attb.itemNmCd] && disabledInputs[attb.itemNmCd]['valueCd']"
                  />
                </template>
              </td>
              <td>
                <!-- 정렬 -->
                <select
                  v-model="attb.alignCd"
                  class="form-control"
                  :disabled="disabledInputs[attb.itemNmCd] && disabledInputs[attb.itemNmCd]['alignCd']"
                >
                  <option
                    v-for="cd in alignCdList"
                    :key="`${index}-align-${cd.cdId}`"
                    :value="cd.cdId"
                  >
                    {{ cd.cdNm }}
                  </option>
                </select>
              </td>
              <td>
                <!-- X -->
                <input
                  v-model="attb.posX"
                  type="text"
                  class="form-control"
                  :disabled="disabledInputs[attb.itemNmCd] && disabledInputs[attb.itemNmCd]['posXCd']"
                />
              </td>
              <td>
                <!-- Y -->
                <input
                  v-model="attb.posY"
                  type="text"
                  class="form-control"
                  :disabled="disabledInputs[attb.itemNmCd] && disabledInputs[attb.itemNmCd]['posYCd']"
                />
              </td>
              <td>
                <!-- color -->
                <color-picker
                  :color="attb.fontColor"
                  v-model="attb.fontColor"
                  :disabled="disabledInputs[attb.itemNmCd] && disabledInputs[attb.itemNmCd]['fontColorCd']"
                />
              </td>
              <td>
                <!-- 크기 -->
                <input
                  v-model="attb.fontSize"
                  type="text"
                  class="form-control"
                  :disabled="disabledInputs[attb.itemNmCd] && disabledInputs[attb.itemNmCd]['fontSizeCd']"
                />
              </td>
              <td>
                <button class="btn btn-gray" @click="fnRemoveAttb(index)">
                  {{ $t('delete') }}
                </button>
              </td>
            </tr>
          </draggable>
        </table>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button type="button" class="btn btn-pink" @click="fnShowPreviewPopup">
          {{ $t('msgPreview') }}
        </button>
        <button type="button" class="btn btn-pink" @click="fnSaveConfirm">
          {{ $t('save') }}
        </button>
        <button type="button" class="btn btn-gray" @click="close">
          {{ $t('cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import ColorPicker from '@/components/ColorPicker'
import { getCommonCodeByParentCdId } from '@/api/common/code'
import { requestApi, requestMultipartJsonObject } from '@/api/ccp/requestApi'
import {
  getSvcList,
  getDevClsCdListBySvcCd,
  getDevMdlListByDevCls
} from '@/api/common/usrSvcDevice'

const IMAGE_ITEM_NM_CD = ['GN00000346', 'GN00000347'] // GN00000346: ICON, GN00000347: BACKGROUND

export default {
  name: 'SymbolTmplAddModifySvc',
  components: { draggable, ColorPicker },
  props: {
    data: {
      type: Object,
      required: true
    },
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
      xMid: 'P20052',
      tmplData: {
        tmplNm: '',
        symSeq: '',
        svcCd: '',
        devClsCd: '',
        devMdlCd: '',
        attbList: []
      },
      svcCdList: [],
      devClsList: [],
      devMdlList: [],
      symbolList: [],
      itemList: [],
      alignCdList: [],
      attb: {
        attbSeq: '',
        itemNmCd: '',
        itemSort: '',
        itemWhere: '',
        itemVal: '',
        posX: '',
        posY: '',
        alignCd: 'left',
        fontColor: '',
        fontSize: '',
        imgWidth: '',
        imgHeight: ''
      }
    }
  },
  computed: {
    isNew() {
      return !this.data.tmplSeq
    },
    disabledInputs() {
      let disabled = {}
      this.itemList.forEach(item => {
        let i = {}
        Object.keys(item).forEach(key => {
          if (item[key] === 'N') {
            i[key] = true
          }
        })
        disabled[item.itemNmCd] = i
      })
      return disabled
    }
  },
  watch: {
    'tmplData.symSeq'() {
      this.fnGetSymbolItemList()
    },
    'tmplData.svcCd'() {
      this.fnGetDevClsList()
    },
    'tmplData.devClsCd'() {
      this.fnGetModelList()
    }
  },
  created() {
    if (!this.isNew) {
      this.fnGetTmplData()
    }
    this.fnGetSvcCdList()
    this.fnGetSymbolList()
    this.fnGetCodes()
  },
  mounted() {},
  methods: {
    // -------------------- 검색 옵션 조회
    // 서비스 조회
    fnGetSvcCdList() {
      getSvcList({ xMid: this.xMid }).then(data => {
        this.svcCdList = data
      })
    },
    // 장비 유형 조회
    fnGetDevClsList() {
      // 선택값 초기화
      this.devClsList = []
      if (this.tmplData.svcCd === '') {
        return false
      }
      getDevClsCdListBySvcCd({
        svcCd: this.tmplData.svcCd,
        xMid: this.xMid
      }).then(data => {
        this.devClsList = data.devClsList
        if (!this.devClsList.find(c => c.devClsCd === this.tmplData.devClsCd)) {
          this.tmplData.devClsCd = ''
        }
      })
    },
    // 장비 모델 조회
    fnGetModelList() {
      this.devMdlList = []
      if (this.tmplData.devClsCd === '') {
        return false
      }
      getDevMdlListByDevCls(
        { devClsCd: this.tmplData.devClsCd },
        this.xMid
      ).then(data => {
        this.devMdlList = data
        if (!this.devMdlList.find(c => c.devMdlCd === this.tmplData.devMdlCd)) {
          this.tmplData.devMdlCd = ''
        }
      })
    },
    // 심볼 목록 조회
    fnGetSymbolList() {
      // 별도의 API 만들지 않고 기존 심볼 조회 API 사용
      let reqData = {
        currentPage: 1,
        displayRowCount: 9999
      }
      requestApi({
        url: '/online/iotsym/retrieveSymbolList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.symbolList = res.data.dataList
          }
        }
      })
    },
    // 심볼 아이템 목록 조회
    fnGetSymbolItemList() {
      this.itemList = []
      if (!this.tmplData.symSeq || this.tmplData.symSeq.length === 0) {
        return false
      }

      let reqData = {
        symSeq: this.tmplData.symSeq
      }
      requestApi({
        url: '/online/iotsym/retrieveSymbolItemList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.itemList = res.data
            if (this.isNew) {
              this.fnInitAttb()
            }
          }
        }
      })
    },
    fnGetCodes() {
      getCommonCodeByParentCdId({ parentCdId: 'GN00000358' }).then(data => {
        this.alignCdList = data
        // 심볼 템플릿 속성 추가 시 정렬 기본 세팅
        this.attb.alignCd = this.alignCdList[0].cdId
      })
    },
    // -------------------- 기능
    fnGetTmplData() {
      let reqData = {
        tmplSeq: this.data.tmplSeq
      }
      requestApi({
        url: '/online/iotsym/retrieveSymbolTmplDetail',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.tmplData = res.data
          }
        }
      })
    },
    // 심볼 변경 시 속성 초기화
    fnInitAttb() {
      this.tmplData.attbList = []
      this.itemList.forEach(item => {
        let attb = JSON.parse(JSON.stringify(this.attb))
        attb.itemNmCd = item.itemNmCd
        this.tmplData.attbList.push(attb)
      })
    },
    fnAddAttb() {
      let attb = JSON.parse(JSON.stringify(this.attb))
      this.tmplData.attbList.push(attb)
    },
    fnRemoveAttb(index) {
      this.tmplData.attbList.splice(index, 1)
    },
    fnSaveConfirm() {
      if (!this.fnValidateData()) {
        return false
      }
      this.confirm(this.$t('saveYn'), this.fnSave)
    },
    fnSave() {
      let files = []
      this.tmplData.attbList
        .filter(attb => attb.file)
        .forEach(attb => {
          if (attb.file) {
            files.push(attb.file)
          }
        })
      let reqData = JSON.parse(JSON.stringify(this.tmplData))
      reqData.attbList.forEach((attb, index) => {
        attb.itemSort = index
        attb.posX = parseInt(attb.posX)
        attb.posY = parseInt(attb.posY)
        attb.fontSize = parseInt(attb.fontSize)
        attb.imgWidth = parseInt(attb.imgWidth)
        attb.imgHeight = parseInt(attb.imgHeight)
        delete attb.file
      })

      let url = this.isNew
        ? '/online/iotsym/insertSymbolTmpl'
        : '/online/iotsym/updateSymbolTmpl'
      requestMultipartJsonObject({
        url: url,
        headers: {
          'X-MID': this.xMid
        },
        data: reqData,
        files: files,
        callback: res => {
          if (res.result.status === '200') {
            this.alert(this.$t('save-success'), 'success')
            this.callback()
            this.close()
          }
        }
      })
    },
    fnValidateData() {
      if (!this.tmplData.tmplNm || this.tmplData.tmplNm.trim().length === 0) {
        this.alert(this.$t('lead-not-inputed').replace('$0', this.$t('template-name')))
        return false
      }

      if (!this.tmplData.symSeq || this.tmplData.symSeq.length === 0) {
        this.alert(this.$t('lead-not-choosed').replace('$0', this.$t('symbol')))
        return false
      }

      if (!this.tmplData.svcCd || this.tmplData.svcCd.length === 0) {
        this.alert(this.$t('lead-not-choosed').replace('$0', this.$t('service')))
        return false
      }

      if (!this.tmplData.devClsCd || this.tmplData.devClsCd.length === 0) {
        this.alert(this.$t('lead-not-choosed').replace('$0', this.$t('dev-type')))
        return false
      }

      if (!this.tmplData.devMdlCd || this.tmplData.devMdlCd.length === 0) {
        this.alert(this.$t('lead-not-choosed').replace('$0', this.$t('mdlMtMdlNm')))
        return false
      }

      if (!this.tmplData.attbList || this.tmplData.attbList.length === 0) {
        this.alert(this.$t('lead-add-data').replace('$0', this.$t('attribute')))
        return false
      }

      let filtered = this.tmplData.attbList.filter(
        attb =>
          IMAGE_ITEM_NM_CD.includes(attb.itemNmCd) &&
          !attb.file &&
          (!attb.attbSeq || attb.attbSeq === '')
      )
      if (filtered.length > 0) {
        this.alert(this.$t('image-upload-check'))
        return false
      }

      if (this.tmplData.attbList.find(a => a.itemNmCd === '')) {
        this.alert(this.$t('lead-not-choosed').replace('$0', this.$t('attribute')))
        return false
      }
      return true
    },
    fnShowPreviewPopup() {
      this.popup({
        component: () => import('@/views/custusr/magic/SymbolTmplPreviewSvc'),
        title: this.$t('symbol-tmpl-modify'),
        width: 'wide',
        height: '500',
        data: {
          tmplData: this.tmplData
        },
        callback: data => {
          this.fnGetList()
        }
      })
    },
    // -------------------- 기타 화면 필요 기능
    fnCheckImageItemNmCd(itemNmCd) {
      return IMAGE_ITEM_NM_CD.includes(itemNmCd)
    },
    fnImageUpload(event, index) {
      const attb = this.tmplData.attbList[index]
      if (!event.target.files || event.target.files.length === 0) {
        attb.file = null
        attb.itemVal = ''
        return
      }
      let file = event.target.files[0]
      attb.file = {
        name: file.name,
        file: file
      }
      attb.itemVal = file.name

      let fileReader = new FileReader()
      fileReader.onload = e => {
        let image = new Image()
        image.onload = function() {
          attb.imgWidth = this.width
          attb.imgHeight = this.height
        }
        image.src = e.target.result
      }
      fileReader.readAsDataURL(file)
    }
  }
}
</script>

<style></style>
