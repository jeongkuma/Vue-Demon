<template>
  <div>
    <div class="modal-body">
      <div class="form-row row py-1 border-1">
        <div class="form-item col-sm-6">
          <span class="form-label lb-txt">{{ $t('role') }}</span>
          <select v-model="roleCdId" class="form-control" @change="fnGetMenuRoleList">
            <option v-for="role in roleList" :key="role.roleCdId" :value="role.roleCdId">{{role.roleCdNm}}</option>
          </select>
        </div>
      </div>
      <div class="table-wrap mt-3">
        <div id="jstree" class="treebox">
        </div>
        <div class="btn-wrap text-center">
          <button @click="fnAllCheck()" type="button" class="btn btn-pink">{{$t('all-check')}}</button>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="btn-wrap text-center">
        <button @click="addMenuRoleConfirm()" type="button" class="btn btn-pink">{{$t('save')}}</button>
        <button @click="close()" type="button" class="btn btn-gray" >{{$t('cancle')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
export default {
  name: 'ManageMenuSvc',
  props: {
    data: Object, // 넘겨받을 데이터,
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
      retrieveMenuList: '/online/iotrolemap/retrieveIotMenuList',
      createUri: '/online/iotrolemap/createIotMenuRoleAuth',
      menuList: [],
      roleCdId: null,
      roleList: null,
      selectedMenus: [],
      allChecked: true
    }
  },
  created () {
    this.roleList = this.data.roleList
    this.roleCdId = this.roleList[0].roleCdId
    this.fnMakeTree()
    this.fnGetMenuRoleList()
  },
  mounted () {
    $('#jstree').on('select_node.jstree', function(event, nodes) {
      if (nodes.node.children) {
        nodes.node.children.forEach(cNode => {
          $('#jstree').jstree(true).select_node(cNode)
          var gNode = $('#jstree').jstree(true).get_node(cNode)
          if (gNode.children) {
            gNode.children.forEach(gNodes => {
              $('#jstree').jstree(true).select_node(gNodes)
            })
          }
        })
      }
    })
    $('#jstree').on('deselect_node.jstree', function(event, nodes) {
      if (nodes.node.children) {
        nodes.node.children.forEach(cNode => {
          $('#jstree').jstree(true).deselect_node(cNode)
        })
      }
    })
  },
  methods: {
    fnTreeReload() {
      $('#jstree').jstree('destroy')
    },
    fnMakeTree () {
      $('#jstree').jstree({
        'checkbox': {
          'keep_selected_style': false,
          'three_state': false
        },
        'plugins': ['checkbox'],
        'core': {
          data: this.menuList
        } })
    },
    // 메뉴 및 권한 메뉴 조회
    fnGetMenuRoleList() {
      // 메뉴 선택 리스트 제거
      this.selectedMenus = []
      let reqData = {
        roleCdId: this.roleCdId
      }
      this.fnCallAPI(this.retrieveMenuList, reqData, this.fnSetMenuRoleList)
    },
    fnSetMenuRoleList(data) {
      this.menuList = data
      $('#jstree').data('jstree', false).empty()
      this.fnMakeTree()
    },
    // 저장
    fnSaveMenuRole() {
      let reqData = {
        roleCdId: this.roleCdId,
        insertDto: this.selectedMenus
      }
      this.fnCallAPI(this.createUri, reqData, this.fnSaved)
    },
    fnSaved() {
      this.alert(this.$t('save-success'), 'success')
      this.callback(true)
      this.close()
    },
    fnCallAPI(url, reqData, callback) {
      requestApi({
        url: url,
        headers: {
          'X-MID': 'P00063'
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          callback(res.data)
        }
      })
    },
    fnAllCheck () {
      if (this.allChecked) {
        $('#jstree').jstree('check_all', false)
      } else {
        $('#jstree').jstree('uncheck_all', true)
      }
      this.allChecked = !this.allChecked
    },
    fnGetSelectedMenus () {
      this.selectedMenus = []
      // 선택된 메뉴 조회
      var selectedElms = $('#jstree').jstree('get_checked', true)
      selectedElms.forEach((node) => {
        if (node.id !== '0') {
          this.fnPushSelectedMenu(node)

          node.parents.forEach((parent) => {
            if (parent !== '0' && parent !== '#') {
              this.fnPushSelectedMenu($('#jstree').jstree('get_node', parent))
            }
          })
        }
      })
    },
    fnPushSelectedMenu(node) {
      let attr = {
        menuProgSeq: node.id,
        menuProgNm: node.text
      }

      let index = this.selectedMenus.findIndex(el => el.menuProgSeq === attr.menuProgSeq)
      if (index === -1) {
        this.selectedMenus.push(attr)
      }
    },
    addMenuRoleConfirm () {
      this.fnGetSelectedMenus()
      if (this.selectedMenus.length < 1) {
        this.alert(this.$t('lead-check-role'), 'warning')
      } else {
        this.confirm(this.$t('confirm-menu-role'), this.fnSaveMenuRole)
      }
    }
  }
}
</script>

<style lang='less'>

</style>
