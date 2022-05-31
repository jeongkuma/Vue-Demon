<template>
  <div :style="`min-height: ${minHeight}; overflow: ${overflow}`">
    <div id="tree" ref="tree"></div>
  </div>
</template>

<script>
import { getTreeData } from '@/utils/treeUtil'

export default {
  name: 'Jstree',
  props: {
    data: {
      type: Array,
      required: true
    },
    textFieldName: {
      type: String,
      required: false,
      default: 'text'
    },
    valueFieldName: {
      type: [String],
      required: false,
      default: 'id'
    },
    parentFieldName: {
      type: String,
      required: false,
      default: 'parent'
    },
    sortFieldName: {
      type: String,
      required: false,
      default: undefined
    },
    collapse: {
      type: Boolean,
      required: false,
      default: false
    },
    showCheckbox: {
      type: Boolean,
      required: false,
      default: false
    },
    draggable: {
      type: Boolean,
      required: false,
      default: false
    },
    dragOrderBy: {
      type: Boolean,
      required: false,
      default: false
    },
    minHeight: {
      type: String,
      required: false,
      default: '500px'
    },
    overflow: {
      type: String,
      required: false,
      default: 'auto'
    },
    useOriginData: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      treeData: []
    }
  },
  computed: {},
  watch: {
    data: {
      deep: true,
      handler() {
        this.setTreeData()
      }
    }
  },
  created() {},
  mounted() {
    this.createTree()
    this.setTreeData()
  },
  methods: {
    // 트리 생성
    createTree() {
      const dragOrderBy = this.dragOrderBy
      const plugins = []

      if (this.showCheckbox) {
        plugins.push('checkbox')
      }

      if (this.draggable) {
        plugins.push('dnd')
      }

      $(this.$refs.tree).jstree({
        core: {
          data: this.treeData,
          check_callback: function(
            operation,
            node,
            nodeParent,
            // eslint-disable-next-line
            node_position,
            // eslint-disable-next-line
            more
          ) {
            if (operation === 'move_node') {
              // 같은 레벨만 드래그앤 드롭
              if (dragOrderBy) {
                if (node.parent !== nodeParent.id) {
                  return false
                }
              }
            }
            return true
          }
        },
        plugins: plugins
      })

      $(this.$refs.tree).bind('ready.jstree', (...arg) => {
        this.$emit('ready', ...arg)
      })

      $(this.$refs.tree).bind('loading.jstree', (...arg) => {
        this.$emit('loading', ...arg)
      })

      // loaded
      $(this.$refs.tree).bind('loaded.jstree', (...arg) => {
        this.$emit('loaded', ...arg)
        if (!this.collapse) {
          this.openAll()
        }
      })

      // load_node
      $(this.$refs.tree).bind('load_node.jstree', (...arg) => {
        this.$emit('loadNode', ...arg)
      })

      // load_all
      $(this.$refs.tree).bind('load_all.jstree', (...arg) => {
        this.$emit('loadAll', ...arg)
      })

      // refresh
      $(this.$refs.tree).bind('refresh.jstree', (...arg) => {
        this.$emit('refresh', ...arg)

        if (!this.collapse) {
          this.openAll()
        }
      })

      // redraw
      $(this.$refs.tree).bind('redraw.jstree', (...arg) => {
        this.$emit('redraw', ...arg)
      })

      // before_open
      $(this.$refs.tree).bind('before_open.jstree', (...arg) => {
        this.$emit('beforeOpen', ...arg)
      })

      // open_node
      $(this.$refs.tree).bind('open_node.jstree', (...arg) => {
        this.$emit('openNode', ...arg)
      })

      // after_open
      $(this.$refs.tree).bind('after_open.jstree', (...arg) => {
        this.$emit('afterOpen', ...arg)
      })

      // close_node
      $(this.$refs.tree).bind('close_node.jstree', (...arg) => {
        this.$emit('closeNode', ...arg)
      })

      // after_close
      $(this.$refs.tree).bind('after_close.jstree', (...arg) => {
        this.$emit('afterClose', ...arg)
      })

      // open_all
      $(this.$refs.tree).bind('open_all.jstree', (...arg) => {
        this.$emit('openAll', ...arg)
      })

      // close_all
      $(this.$refs.tree).bind('close_all.jstree', (...arg) => {
        this.$emit('closeAll', ...arg)
      })

      // enable_node
      $(this.$refs.tree).bind('enable_node.jstree', (...arg) => {
        this.$emit('enableNode', ...arg)
      })

      // disable_node
      $(this.$refs.tree).bind('disable_node.jstree', (...arg) => {
        this.$emit('disableNode', ...arg)
      })

      // hide_node
      $(this.$refs.tree).bind('hide_node.jstree', (...arg) => {
        this.$emit('hideNode', ...arg)
      })

      // show_node
      $(this.$refs.tree).bind('show_node.jstree', (...arg) => {
        this.$emit('showNode', ...arg)
      })

      // hide_all
      $(this.$refs.tree).bind('hide_all.jstree', (...arg) => {
        this.$emit('hideAll', ...arg)
      })

      // show_all
      $(this.$refs.tree).bind('show_all.jstree', (...arg) => {
        this.$emit('showAll', ...arg)
      })

      // select_node
      $(this.$refs.tree).bind('select_node.jstree', (...arg) => {
        this.$emit('selectNode', ...arg)
      })

      // changed
      $(this.$refs.tree).bind('changed.jstree', (...arg) => {
        this.$emit('changed', ...arg)
      })

      // select_all
      $(this.$refs.tree).bind('select_all.jstree', (...arg) => {
        this.$emit('selectAll', ...arg)
      })

      // deselect_all
      $(this.$refs.tree).bind('deselect_all.jstree', (...arg) => {
        this.$emit('deselectAll', ...arg)
      })

      // create_node
      $(this.$refs.tree).bind('create_node.jstree', (...arg) => {
        this.$emit('createNode', ...arg)
      })

      // rename_node
      $(this.$refs.tree).bind('rename_node.jstree', (...arg) => {
        this.$emit('renameNode', ...arg)
      })

      // delete_node
      $(this.$refs.tree).bind('delete_node.jstree', (...arg) => {
        this.$emit('deleteNode', ...arg)
      })

      // move_node
      $(this.$refs.tree).bind('move_node.jstree', (...arg) => {
        this.$emit('moveNode', ...arg)
      })

      // destroy
      $(this.$refs.tree).bind('destroy.jstree', (...arg) => {
        this.$emit('destroy', ...arg)
      })

      // select_all
      $(this.$refs.tree).bind('select_all.jstree', (...arg) => {
        this.$emit('selectAll', ...arg)
      })
    },
    openAll() {
      $(this.$refs.tree).jstree('open_all')
    },
    closeAll() {
      $(this.$refs.tree).jstree('close_all')
    },
    showAll() {
      $(this.$refs.tree).jstree('show_all')
    },
    hideAll() {
      $(this.$refs.tree).jstree('hide_all')
    },
    openNode(...arg) {
      $(this.$refs.tree).jstree('open_node', ...arg)
    },
    closeNode(...arg) {
      $(this.$refs.tree).jstree('close_node', ...arg)
    },
    deselectAll(...arg) {
      $(this.$refs.tree).jstree('deselect_all', ...arg)
    },
    getSelectedId() {
      const selectedIds = $(this.$refs.tree).jstree('get_selected')
      return selectedIds.length > 0 ? selectedIds[0] : null
    },
    getJson() {
      return $(this.$refs.tree).jstree('get_json')
    },
    getJsonFlat() {
      return $(this.$refs.tree)
        .jstree(true)
        .get_json('', { flat: true })
    },
    getSelectedIds() {
      return $(this.$refs.tree).jstree('get_selected')
    },
    getSelected() {
      const selectedId = $(this.$refs.tree).jstree('get_selected')
      return this.getNodeById(selectedId)
    },
    getNodeById(id) {
      return $(this.$refs.tree)
        .jstree(true)
        .get_node(id)
    },
    createNode(par, node, position = 'last', callback, isLoaded) {
      const id = $(this.$refs.tree).jstree(
        'create_node',
        par,
        node,
        position,
        callback,
        isLoaded
      )
      return this.getNodeById(id)
    },
    deleteNode(obj) {
      $(this.$refs.tree).jstree('delete_node', obj)
    },
    selectAll() {
      $(this.$refs.tree).jstree('select_all')
    },
    // 트리 데이터 세팅
    async setTreeData() {
      if (this.useOriginData) {
        this.treeData = this.data
      } else {
        this.treeData = await this.makeTreeData()
      }
      if ($(this.$refs.tree).jstree && $(this.$refs.tree).jstree().settings) {
        $(this.$refs.tree).jstree().settings.core.data = this.treeData
        $(this.$refs.tree)
          .jstree()
          .refresh()
      }
    },
    // 트리 테이터 형식으로 변환
    makeTreeData() {
      const newData = []
      for (let i = 0; i < this.data.length; i++) {
        const item = this.data[i]
        newData.push({
          id: item[this.valueFieldName],
          text: item[this.textFieldName],
          parent: item[this.parentFieldName],
          sort: item[this.sortFieldName],
          data: item
        })
      }
      const context = {
        rootId: 'ROOT',
        idKey: 'id',
        parentKey: 'parent',
        orderKey: 'sort'
      }
      return [
        {
          id: 'ROOT',
          text: 'ROOT',
          children: getTreeData(context, newData)
        }
      ]
    }
  }
}
</script>

<style></style>
