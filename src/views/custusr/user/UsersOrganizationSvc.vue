<template>
  <div>
    <div class="modal-body">
      <div ref="treeWrap">
        <jstree
          ref="tree"
          :data="orgTreeData"
          :useOriginData="true"
          minHeight="290px"
        ></jstree>
      </div>
    </div>
    <div class="modal-footer">
      <div class="btn-wrap text-center">
        <button @click="fnSelectNode()" type="button" class="btn btn-pink">{{$t('select')}}</button>
        <button @click="close()" type="button" class="btn btn-gray">{{ $t('cancel') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import Jstree from '@/components/Jstree'

export default {
  name: 'UsersOrganizationSvc',
  components: { Jstree },
  props: {
    data: Object,
    callback: {
      type: Function,
      required: true
    },
    close: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      orgTreeData: []
    }
  },
  created () {
    this.callServerAPI()
  },
  mounted () {
  },
  computed: {},
  methods: {
    callServerAPI () {
      var reqData = {
        orgSeq: this.data.orgSeq,
        custSeq: this.data.custSeq,
        useYn: 'Y'
      }
      requestApi({
        url: '/online/iotorg/retrieveIotOrg',
        headers: {
          'X-MID': 'P00043'
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          this.orgTreeData = res.data
        }
      })
    },
    fnSelectNode () {
      if (!this.$refs.tree.getSelected()) {
        this.alert(this.$t('lead-check-role'))
        return
      }
      let node = this.$refs.tree.getSelected()
      this.callback({
        orgSeq: node.id,
        orgNm: node.text
      })
      this.close()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
