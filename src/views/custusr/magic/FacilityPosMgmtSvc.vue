<template>
  <div class="flex flex-wrap" style="padding-top: 15px;">
    <div class="md-width-100 width-30 pr-2 md-p-0 flex flex-col">
      <div class="mb-2 flex-none" style="height: 32px;">
        <h4 class="titH4">{{ $t('facility-list') }}</h4>
      </div>
      <div class="flex-1 border-1" style="min-height: 300px">
        <jstree
          ref="tree"
          :data="facilityList"
          text-field-name="facNm"
          value-field-name="facSeq"
          parent-field-name="parentFacSeq"
          sort-field-name="facOrder"
          @selectNode="fnHandleSelectNode"
        ></jstree>
      </div>
    </div>
    <div class="md-width-100 width-70 pl-2 md-p-0 md-pt-3">
      <div class="mb-2 flex justify-between" style="height: 32px;">
        <h4 class="titH3">{{ facility.facNm }}</h4>
        <div>
          <button
            type="button"
            class="btn btn-pink"
            :disabled="!facility.facNm"
            @click="fnShowSettingPopup"
          >
            {{ $t('setting') }}
          </button>
          <button
            type="button"
            class="btn btn-pink"
            :disabled="!facility.facNm"
            @click="fnSaveConfirm"
          >
            {{ $t('save') }}
          </button>
        </div>
      </div>
      <div ref="mapWrap" style="min-height: 450px">
        <ol-map
          :items="map.devList"
          :background="map.background"
          :useClick="true"
          :useDrag="true"
          @dragEnd="fnHandleDragEnd"
        >
        </ol-map>
      </div>
    </div>
  </div>
</template>

<script>
import Jstree from '@/components/Jstree'
import OlMap from '@/components/olMap'
import { requestApi } from '@/api/ccp/requestApi'
import { getFeature } from '@/components/olMap/serviceUtil'

export default {
  name: 'FacilityPosMgmt',
  components: { Jstree, OlMap },
  data() {
    return {
      xMid: 'P20055',
      facilityList: [],
      facility: {},
      items: [],
      map: {
        background: {},
        devList: []
      }
    }
  },
  computed: {
    disabledButton() {
      return !this.facility || !this.facility.facNm
    }
  },
  watch: {},
  created() {},
  mounted() {
    this.$refs.mapWrap.style.height = 'calc(100vh - ' + (this.$refs.mapWrap.offsetTop + 140) + 'px)'

    this.fnGetFacility()
  },
  methods: {
    // 시설 목록 조회
    fnGetFacility() {
      let reqData = {}
      requestApi({
        url: '/online/iotFacility/retrieveFacility',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          res.data.forEach(item => {
            if (!item.parentFacSeq) {
              item.parentFacSeq = 'ROOT'
            }
          })
          this.facilityList = res.data
        }
      })
    },
    // 시설 선택
    fnHandleSelectNode(event, target) {
      if (target.node.id === 'ROOT') {
        this.facility = {}
        this.map.devList = []
        this.map.background = {}

        return
      }
      this.facility = {
        facSeq: target.node.id,
        facNm: target.node.text
      }
      this.fnGetFacilityDetail()
    },
    // 시설 상세 조회
    fnGetFacilityDetail() {
      this.map.devList = []
      this.map.background = {}

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
            this.fnSetMapBackground()
            this.fnSetMapDevList()
          }
        }
      })
    },
    // 배경 세팅
    fnSetMapBackground() {
      if (!this.facility || !this.facility.imgPath) {
        return
      }
      this.map.background = {
        url: this.facility.imgPath,
        width: this.facility.imgWidth,
        height: this.facility.imgHeight
      }
    },
    // 장비 목록 세팅
    fnSetMapDevList() {
      if (
        !this.facility ||
        !this.facility.devList ||
        !this.facility.attbList
      ) {
        return
      }
      let devList = []
      this.facility.devList.forEach(dev => {
        let tmplAttbList = this.facility.attbList.filter(
          attb => attb.tmplSeq === dev.tmplSeq
        )
        devList.push(
          getFeature(
            tmplAttbList,
            {},
            [parseInt(dev.posX) || 0, parseInt(dev.posY) || 0],
            dev
          )
        )
      })
      this.map.devList = devList
    },
    // 드래그 종료 시 위치 수정
    fnHandleDragEnd(featureInfo, coordinates) {
      let dev = this.facility.devList.find(
        dev => dev.entrDevSeq === featureInfo.entrDevSeq
      )
      dev.posX = coordinates[0]
      dev.posY = coordinates[1]
    },
    // 설정 팝업
    fnShowSettingPopup() {
      if (!this.facility || !this.facility.facNm) {
        this.alert(this.$t('lead-not-choosed').replace('$0', this.$t('facility')))
        return
      }
      this.popup({
        component: () => import('@/views/custusr/magic/FacilityPosSettingSvc'),
        title: this.$t('facility-setting'),
        width: 'wide',
        height: '650',
        data: {
          facility: this.facility
        },
        callback: data => {
          this.fnGetFacilityDetail()
        }
      })
    },
    // 저장
    fnSaveConfirm() {
      this.confirm(this.$t('saveYn'), this.fnSave)
    },
    fnSave() {
      requestApi({
        url: '/online/iotFacility/updateFacilityDev',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: this.facility.devList,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('save-success'), 'success')
          }
        }
      })
    }
  }
}
</script>

<style></style>
