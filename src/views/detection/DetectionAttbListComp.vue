<template>
  <div class="form-horizontal grid-container">
    <div class="flex justify-between items-center mb-1">
      <h4 class="titH4">이상징후 조건</h4>
      <div>
        <button class="btn btn-pink" @click="fnOpenAttbPopup">선택</button>
        <button class="btn btn-gray" @click="fnRemoveAttb">삭제</button>
      </div>
    </div>
    <div class="table-wrap">
      <table class="table table-col">
        <colgroup>
          <col style="width: 35px">
          <col style="width: 120px">
          <col style="width: 120px">
          <col style>
        </colgroup>
        <thead>
          <tr>
            <th scope="col">
              <div class="form-check">
                <label class="checkbox">
                  <input
                    ref="checkAllDeviceAttr"
                    :checked="checkAll"
                    @change="fnCheckAll"
                    role="checkbox"
                    class="cbox"
                    type="checkbox"
                  >
                  <i></i>
                </label>
              </div>
            </th>
            <th scope="col">{{ $t('attribute-name') }}</th>
            <th scope="col">{{ $t('symptom-grade') }}</th>
            <th scope="col">{{ $t('symptom-condition') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(attb, index) in attbList" :key="`attb-${index}`">
            <td class="text-center">
              <label class="checkbox">
                <input
                  v-model="selectedAttb"
                  role="checkbox"
                  class="cbox"
                  type="checkbox"
                  :value="attb"
                >
                <i></i>
              </label>
            </td>
            <td>{{ attb.devAttbCdNm }}</td>
            <td>{{ attb.devDetSetCdNm }}</td>
            <td>
              <input v-model="attb.detSetCond" type="text" class="form-control">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetectionAttbListComp',
  components: {},
  props: {
    device: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      attbList: [],
      selectedAttb: []
    }
  },
  computed: {
    checkAll() {
      return (
        this.attbList.length !== 0 &&
        this.selectedAttb.length === this.attbList.length
      )
    }
  },
  watch: {
    device() {
      if (this.device.svcCd === '') {
        this.fnClearAttbList()
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    fnOpenAttbPopup() {
      this.popup({
        component: () => import('@/views/detection/DetectionAttbListPopupSvc'),
        title: this.$t('selectDetCondition'),
        width: '900',
        height: '460',
        data: {
          device: this.device
        },
        callback: data => {
          if (data !== 'dismiss') {
            this.fnSetAttbList(data)
          }
        }
      })
    },
    fnSetAttbList(data) {
      data.forEach(attb => {
        if (
          !this.attbList.find(
            a =>
              a.devAttbCdId === attb.devAttbCdId &&
              a.devDetSetCdId === attb.devDetSetCdId
          )
        ) {
          attb.selected = false
          this.attbList.push(attb)
        }
      })
    },
    fnRemoveAttb() {
      if (this.selectedAttb.length === 0) {
        this.alert('삭제할 이상징후 조건을 선택하세요.')
        return
      }
      this.selectedAttb.forEach(attb => {
        let index = this.attbList.findIndex(
          a =>
            a.devAttbCdId === attb.devAttbCdId &&
            a.devDetSetCdId === attb.devDetSetCdId
        )
        this.attbList.splice(index, 1)
      })
    },
    fnCheckAll(event) {
      if (event.target.checked) {
        this.selectedAttb = this.attbList
      } else {
        this.selectedAttb = []
      }
    },
    fnClearAttbList() {
      this.attbList = []
    },
    fnGetAttbList() {
      // 부모에서 저장 시 사용
      return this.attbList
    }
  }
}
</script>

<style></style>
