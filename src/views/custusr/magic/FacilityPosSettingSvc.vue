<template>
  <div>
    <div class="modal-body">
      <div class="form-item col-sm-12">
        <span class="form-label w-32 lb-txt">{{ $t('background-image') }}</span>
        <div class="flex width-100 items-center">
          <input
            :value="facility.imgPath"
            type="text"
            class="form-control"
            :readonly="true"
          />
          <label :for="`input-file`" class="btn btn-gray">
            {{ $t('image-upload') }}
          </label>
          <input
            type="file"
            :id="`input-file`"
            style="display:none"
            @change="fnImageUpload($event)"
          />
        </div>
      </div>
      <div class="pt-1 flex flex-wrap width-100 table-wrap">
        <!-- 전체 장비  -->
        <all-dev-comp :xMid="xMid" :facility="facility" @add="fnAddDevice"></all-dev-comp>
        <!-- 선택 장비 -->
        <div class="md-width-100 width-40 pl-3">
          <div class="titH5 py-2">{{ $t('selected-device') }}</div>
          <div style="height: 340px; overflow-y: auto;">
            <table class="table table-col">
              <colgroup>
                <col style="" />
                <col style="" />
                <col style="" />
                <col style="" />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">{{ $t('pin-nm') }}</th>
                  <th scope="col">{{ $t('pin') }}</th>
                  <th scope="col">{{ $t('symbol-tmpl') }}</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(dev, index) in facility.devList"
                  :key="`dev-${index}`"
                >
                  <td>{{ dev.devUname }}</td>
                  <td>{{ dev.ctn }}</td>
                  <td>
                    <select v-model="dev.tmplSeq" class="form-control">
                      <option value="">{{ $t('select') }}</option>
                      <option
                        v-for="(tmpl, index) in fnGetSymbolTmplOptions(dev)"
                        :key="`tmpl-${index}`"
                        :value="tmpl.tmplSeq"
                      >
                        {{ tmpl.tmplNm }}
                      </option>
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="btn btn-gray"
                      @click="fnRemoveDevice(index)"
                    >
                      {{ $t('delete') }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
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
import FacilityPosSettingAllDevComp from './FacilityPosSettingAllDevComp'
import { requestApi, requestMultipartJsonObject } from '@/api/ccp/requestApi'

export default {
  name: 'FacilityPosSettingSvc',
  components: {
    AllDevComp: FacilityPosSettingAllDevComp
  },
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
      xMid: 'P999999',
      facility: {
        facInfoSeq: '',
        facInfoNm: '',
        facSeq: '',
        imgPath: '',
        imgWidth: 0,
        imgHeight: 0,
        devList: []
      },
      backgroundFile: null,
      symbolTmplList: []
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    Object.assign(this.facility, this.data.facility)
    this.fnGetFacilityDetail()
    this.fnGetSymbolTmplList()
  },
  methods: {
    fnGetSymbolTmplList() {
      let reqData = {
        currentPage: 1,
        displayRowCount: 9999
      }
      requestApi({
        url: '/online/iotsym/retrieveSymbolTmplList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.data) {
            this.symbolTmplList = res.data.dataList
          }
        }
      })
    },
    fnGetFacilityDetail() {
      let reqData = {
        facSeq: this.facility.facSeq
      }
      requestApi({
        url: '/online/iotFacility/retrieveFacilityInfo',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.data) {
            this.facility = res.data
          }
        }
      })
    },
    fnImageUpload(event) {
      let file = event.target.files[0]
      if (!file) {
        this.backgroundFile = null
        return
      }
      this.facility.imgPath = file.name
      this.backgroundFile = {
        name: file.name,
        file: file
      }

      let fileReader = new FileReader()
      let _this = this
      fileReader.onload = e => {
        let image = new Image()
        image.onload = function() {
          _this.facility.imgWidth = this.width
          _this.facility.imgHeight = this.height
        }
        image.src = e.target.result
      }
      fileReader.readAsDataURL(file)
    },
    fnAddDevice(entrDev) {
      if (
        this.facility.devList.find(d => d.entrDevSeq === entrDev.entrDevSeq)
      ) {
        this.alert('이미 추가된 장비입니다.')
        return
      }
      let dev = {
        svcCd: entrDev.svcCd,
        svcCdNm: entrDev.svcCdNm,
        devClsCd: entrDev.devClsCd,
        devClsCdNm: entrDev.devClsCdNm,
        devMdlCd: entrDev.devMdlCd,
        devMdlNm: entrDev.devMdlNm,
        devUname: entrDev.devUname,
        ctn: entrDev.ctn,
        entrDevSeq: entrDev.entrDevSeq,
        tmplSeq: ''
      }
      this.facility.devList.push(dev)
    },
    fnRemoveDevice(index) {
      this.facility.devList.splice(index, 1)
    },
    fnGetSymbolTmplOptions(dev) {
      return this.symbolTmplList.filter(
        tmpl =>
          tmpl.svcCd === dev.svcCd &&
          tmpl.devClsCd === dev.devClsCd &&
          tmpl.devMdlCd === dev.devMdlCd
      )
    },
    // -------------------- 저장 관련
    fnSaveConfirm() {
      if (!this.fnValidateData()) {
        return false
      }
      let files = []
      if (this.backgroundFile && this.backgroundFile.name) {
        files.push(this.backgroundFile)
      }

      requestMultipartJsonObject({
        url: '/online/iotFacility/updateFacilityInfo',
        headers: {
          'X-MID': this.xMid
        },
        data: this.facility,
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
      if (!this.facility.imgPath || this.facility.imgPath.length === 0) {
        this.alert(this.$t('background-upload-check'))
        return false
      }

      if (this.facility.devList.find(dev => dev.tmplSeq === '')) {
        this.alert(
          this.$t('lead-not-choosed').replace('$0', this.$t('symbol-tmpl'))
        )
        return false
      }
      return true
    }
  }
}
</script>

<style></style>
