<template>
  <div>
    <div class="modal-body">
      <jstree
        ref="tree"
        :data="facilityList"
        text-field-name="facNm"
        value-field-name="facSeq"
        parent-field-name="parentFacSeq"
        sort-field-name="facOrder"
        minHeight="400px"
        class="border-1"
        @selectNode="fnSelectFacility">
      </jstree>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button type="button" class="btn btn-gray" @click="close">
          {{ $t('cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Jstree from '@/components/Jstree'
import { requestApi } from '@/api/ccp/requestApi'

export default {
  name: 'FacilityPopupSvc',
  components: { Jstree },
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
      facilityList: []
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.fnGetFacility()
  },
  methods: {
    fnGetFacility() {
      let reqData = {
        useYn: 'Y'
      }
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
    fnSelectFacility(event, target) {
      if (target.node.id === 'ROOT') {
        return
      }
      this.callback(target.node.data)
      this.close()
    }
  }
}
</script>

<style></style>
