<template>
  <div style="padding-top: 15px;">
    <div class="flex flex-wrap justify-between items-center">
      <div class="titH4">{{ facilityName }}</div>
      <button class="btn btn-info" @click="fnShowFacilityPopup">
        {{ $t('facility-setting') }}
      </button>
    </div>
    <div ref="mapWrap" class="mt-3" style="min-height: 450px">
      <ol-map
        :items="map.devList"
        :background="map.background"
        :useClick="true"
        @onClick="fnHandleClick"
      >
      </ol-map>
    </div>
  </div>
</template>

<script>
import OlMap from '@/components/olMap'
import localStore from '@/utils/localStore'
import { requestApi } from '@/api/ccp/requestApi'
import { getFeature } from '@/components/olMap/serviceUtil'

const STORED_FAC_SEQ_KEY = 'LOCATION_FACILITY_FACSEQ'
const INTERVAL_DELAY = 10 * 1000 // 10s

export default {
  name: 'FacilityLocationSvc',
  components: { OlMap },
  data() {
    return {
      facility: {
        facSeq: '',
        facNm: ''
      },
      map: {
        background: {},
        devList: []
      },
      interval: null
    }
  },
  computed: {
    facilityName() {
      return !this.facility.facNm || this.facility.facNm === '' ? this.$t('facility-check') : this.facility.facNm
    }
  },
  watch: {},
  created() {
  },
  mounted() {
    this.$refs.mapWrap.style.height = 'calc(100vh - ' + (this.$refs.mapWrap.offsetTop + 140) + 'px)'

    // 저장된 시설 seq 가 있는 경우
    let storedFacSeq = localStore.get(STORED_FAC_SEQ_KEY)
    if (storedFacSeq && storedFacSeq.length > 0) {
      this.facility.facSeq = storedFacSeq
      this.fnGetFacilityDetail()
      this.fnSetInterval()
    }
  },
  beforeDestroy() {
    this.fnClearInterval()
  },
  methods: {
    // 시설 정보 조회(심볼 템플릿, 장비, 시설정보, 수집정보)
    fnGetFacilityDetail() {
      let reqData = {
        facSeq: this.facility.facSeq
      }
      requestApi({
        url: '/online/iotFacility/retrieveFacilityLocation',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.data) {
            this.facility = res.data.facilityInfo
            this.colData = res.data.colData
            this.fnSetMapBackground()
            this.fnSetMapDevList()
          }
        }
      }, {
        useLoading: false
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
        let colData = this.colData.find(
          c => String(c.entrDevSeq) === String(dev.entrDevSeq)
        )
        devList.push(
          getFeature(
            tmplAttbList,
            colData,
            [parseInt(dev.posX) || 0, parseInt(dev.posY) || 0],
            dev
          )
        )
      })
      this.map.devList = devList
    },
    // 시설 설정 팝업
    fnShowFacilityPopup() {
      this.popup({
        component: () => import('@/views/custusr/magic/FacilityPopupSvc'),
        title: this.$t('facility-setting'),
        width: '500',
        height: '570',
        data: {},
        callback: data => {
          this.facility = data
          localStore.set(STORED_FAC_SEQ_KEY, this.facility.facSeq)
          this.fnGetFacilityDetail()
          this.fnSetInterval()
        }
      })
    },
    // 장비 심볼 클릭 시
    fnHandleClick(dev) {},
    // -------------------- interval
    fnSetInterval() {
      this.fnClearInterval()
      this.interval = setInterval(() => {
        this.fnGetFacilityDetail()
      }, INTERVAL_DELAY)
    },
    fnClearInterval() {
      clearInterval(this.interval)
    }
  }
}
</script>

<style></style>
