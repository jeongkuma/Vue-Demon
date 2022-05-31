<template>
  <div class="width-100">
    <div class="flex justify-between items-center mb-1">
      <div>
        <h4 class="titH4">대상 장비</h4>
      </div>
      <div>
        <button class="btn btn-pink" @click="fnOpenDevicePopup">장비 선택</button>
        <button class="btn btn-gray" @click="fnRemoveDevice">삭제</button>
      </div>
    </div>
    <div style="min-height: 200px; ">
      <div v-show="!flagAllDevice" class="grid-container grid-scroll">
        <jqgrid
          ref="grid"
          name="detDevice"
          :colModels="colModelData"
          :colNames="colNameList"
          :dataList="deviceList"
          :rowList="[10, 15]"
          :usePage="false"
        >
        </jqgrid>
      </div>
      <div
        class="boxs flex justify-center items-center"
        style="min-height: 200px; max-width: none"
        v-show="flagAllDevice"
      >
        [{{ devMdlNm }}] 총
        <b>{{ deviceCount }}</b>개의 장비가 선택되었습니다.
      </div>
    </div>
  </div>
</template>

<script>
import Jqgrid from '@/components/Jqgrid'

export default {
  name: 'DetectionDeviceListComp',
  components: { Jqgrid },
  data() {
    return {
      deviceList: [],
      colNameList: [
        this.$t('service'),
        this.$t('dev-cls'),
        this.$t('dev-mdl'),
        this.$t('ctn'),
        this.$t('pin-nm'),
        this.$t('inst-addr')
      ],
      colModelData: [
        { name: 'svcCdNm', index: 'svcCd', align: 'center', width: '20' },
        {
          name: 'devClsCdNm',
          index: 'devClsCdNm',
          align: 'center',
          width: '20'
        },
        { name: 'devMdlNm', index: 'devMdlNm', align: 'center', width: '20' },
        { name: 'ctn', index: 'ctn', align: 'center', width: '20' },
        { name: 'devUname', index: 'devUname', align: 'center', width: '20' },
        { name: 'instAddr', index: 'instAddr', align: 'left', width: '100' }
      ],
      flagAllDevice: false,
      svcCd: '',
      devClsCd: '',
      devMdlCd: '',
      devMdlNm: '',
      deviceCount: 0
    }
  },
  computed: {},
  watch: {
    flagAllDevice() {
      this.fnEmitSelecteDevice()
    },
    deviceList() {
      this.fnEmitSelecteDevice()
    }
  },
  created() {},
  mounted() {},
  methods: {
    fnOpenDevicePopup() {
      this.popup({
        component: () => import('@/views/detection/DetectionDevListPopupSvc'),
        title: this.$t('selectTargetDev'),
        width: '900',
        height: '440',
        data: {
          svcCd: this.svcCd,
          devClsCd: this.devClsCd,
          devMdlCd: this.devMdlCd
        },
        callback: data => {
          if (data !== 'dismiss') {
            this.fnSetDeviceList(data)
          }
        }
      })
    },
    fnSetDeviceList(data) {
      if (
        (this.svcCd !== '' && this.svcCd !== data.svcCd) ||
        (this.devClsCd !== '' && this.devClsCd !== data.devClsCd) ||
        (this.devMdlCd !== '' && this.devMdlCd !== data.devMdlCd)
      ) {
        this.alert('이전에 선택한 장비 모델과 다릅니다.')
        return
      }

      // 이전에 전체 설정을 선택했는데 디바이스 추가하는 경우 덮어씀
      if (this.flagAllDevice) {
        this.deviceList = data.list
      } else {
        // 중복되는 항목은 스킵하고 새로운 항목만 넣음
        data.list.forEach(row => {
          let device = this.deviceList.find(d => d.ctn === row.ctn)
          if (!device) {
            this.deviceList.push(row)
          }
        })
      }

      this.flagAllDevice = data.list.length === 0 && data.count > 0
      this.svcCd = data.svcCd
      this.svcCdNm = data.svcCdNm
      this.devClsCd = data.devClsCd
      this.devClsCdNm = data.devClsCdNm
      this.devMdlCd = data.devMdlCd
      this.devMdlNm = data.devMdlNm
      this.deviceCount = data.count
    },
    fnRemoveDevice() {
      let idArr = this.$refs.grid.getSelectionIndexs()
      if (idArr.length === 0) {
        this.alert(this.$t('stat-act-device-null-alert'), 'warning')
        return false
      }

      for (let i = idArr.length - 1; i >= 0; i--) {
        this.deviceList.splice(idArr[i] - 1, 1)
      }
      this.$refs.grid.resetSelection()

      // 전체 삭제 시 서비스, 장비유형, 장비 모델을 초기화 한다.
      if (this.deviceList.length === 0) {
        this.svcCd = ''
        this.devClsCd = ''
        this.devMdlCd = ''
        this.devMdlNm = ''
        this.deviceCount = 0
      }
    },
    fnEmitSelecteDevice() {
      let device = {
        svcCd: this.svcCd,
        svcCdNm: this.svcCdNm,
        devClsCd: this.devClsCd,
        devClsCdNm: this.devClsCdNm,
        devMdlCd: this.devMdlCd,
        devMdlNm: this.devMdlNm
      }
      this.$emit('selected', this.deviceList[0] || device)
    },
    fnGetDeviceData() {
      // 부모에서 저장 시 사용
      let deviceList = []
      this.deviceList.forEach(d => {
        deviceList.push({ entrDevSeq: d.entrDevSeq })
      })
      return {
        deviceList: deviceList,
        svcCd: this.svcCd,
        devClsCd: this.devClsCd,
        devMdlCd: this.devMdlCd,
        flagAllDevice: this.flagAllDevice
      }
    }
  }
}
</script>

<style></style>
