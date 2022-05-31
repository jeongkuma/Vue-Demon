<template>
  <div>
    <div>
      <div class="search-box">
        <div class="left form-inline">
          <div class="form-group">
            <span class="form-control-static">{{ $t('charSet') }}</span>
          </div>
          <div class="form-group">
            <select
              class="form-control"
              v-model="charSet"
              id="charSelect"
              @change="fnCallAPI()"
            >
              <option
                v-for="item in charSetList"
                v-bind:key="item.cdId"
                :value="item.cdId"
                >{{ item.cdNm }}</option
              >
            </select>
          </div>
        </div>
      </div>
      <div class="tit-wrap btn-in">
        <h4 class="titH4">{{ $t('menuMgmt') + '( ' + searchValue + ' )' }}</h4>
        <div class="pull-right">
          <button
            type="button"
            class="btn btn-pink"
            @click="copyPopup()"
            :disabled="addFlag"
          >
            {{ $t('copy') }}
          </button>
          <button
            type="button"
            class="btn btn-pink"
            @click="addPopup()"
            :disabled="addFlag"
          >
            {{ $t('registration') }}
          </button>
          <button type="button" class="btn btn-gray" @click="fnDeleteConfirm()">
            {{ $t('delete') }}
          </button>
        </div>
      </div>
      <div style="overflow-y: visible">
        <div class="sms-box row">
          <div class="col-md-4">
            <div class="left">
              <div id="jstree" class="treebox"></div>
            </div>
          </div>
          <div class="col-md-8">
            <ul class="form-inbox">
              <li>
                <span class="tit">{{ $t('up-menunm') }}</span>
                <div class="form-group">
                  <div class="row">
                    <div class="col-sm-10">
                      <input
                        type="text"
                        class="form-control"
                        v-model="dataObj.upMenuNm"
                        readonly
                      />
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <span class="tit">{{ $t('menu-id') }}</span>
                <div class="form-group">
                  <div class="row">
                    <div class="col-sm-10">
                      <input
                        type="text"
                        class="form-control"
                        v-model="dataObj.menuCdId"
                        readonly
                      />
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <span class="tit">{{ $t('menu-name') }}</span>
                <div class="form-group">
                  <div class="row">
                    <div class="col-sm-10">
                      <input
                        type="text"
                        class="form-control"
                        v-model="dataObj.menuCdNm"
                        :readonly="treeSelectChk"
                        maxlength="15"
                      />
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <span class="tit">{{
                  $t('prog-id') + ' / ' + $t('prog-name')
                }}</span>
                <div class="form-group">
                  <div class="row">
                    <div class="col-sm-3">
                      <input
                        type="text"
                        class="form-control"
                        v-model="progId"
                        readonly
                      />
                    </div>
                    <div class="col-sm-7">
                      <input
                        type="text"
                        class="form-control"
                        v-model="progNm"
                        readonly
                      />
                    </div>
                    <div class="col-sm-2">
                      <button
                        type="button"
                        class="btn btn-gray"
                        @click="fnSearchProg()"
                        :disabled="treeSelectChk"
                      >
                        {{ $t('search2') }}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <span class="tit">{{ $t('menu-orderNum') }}</span>
                <div class="form-group">
                  <div class="row">
                    <div class="col-sm-10">
                      <input
                        type="number"
                        class="form-control"
                        v-model="dataObj.menuOrder"
                        :readonly="treeSelectChk"
                        min="0"
                        onKeyup="this.value=this.value.replace(/[^0-9]/g,'');"
                        @keypress="fnMaxChk(dataObj.menuOrder)"
                      />
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <span class="tit">{{ $t('useYn') }}</span>
                <div class="form-group">
                  <div class="row">
                    <div class="col-sm-10">
                      <select
                        class="form-control"
                        v-model="dataObj.useYn"
                        :disabled="treeSelectChk"
                      >
                        <option
                          v-for="item in useOptList"
                          v-bind:key="item.optVal"
                          :value="item.optVal"
                          >{{ item.optNm }}</option
                        >
                      </select>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <div class="modal-footer">
              <div class="text-right">
                <button
                  @click="submit()"
                  type="button"
                  class="btn btn-pink"
                  :disabled="treeSelectChk"
                >
                  {{ $t('modify') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'menuMgmtSvc',
  components: {},
  props: {},
  data() {
    return {
      menuTreeData: [],
      dataObj: { langSet: '', useYn: 'Y' },
      useOptList: [
        { optNm: this.$t('use'), optVal: 'Y' },
        { optNm: this.$t('use-no'), optVal: 'N' }
      ],
      parentMenuSeq: '',
      treeSelectChk: true,
      charSetList: [],
      isParentSelected: false,
      addFlag: false,
      charSet: '',
      progSeq: '',
      progNm: '',
      progId: '',
      menuLevel: 0,
      searchValue: '',
      adminFlag: false
    }
  },
  created() {
    // 공통코드 조회
    this.fnSearchCommon(
      this.fnSetChar,
      '/online/iotcmcd/retrieveIotByParentCmCdRuntime',
      'GN00000021'
    )
  },
  mounted() {
    var context = this
    // 트리 세팅
    $('#jstree').on('select_node.jstree', function(e, data) {
      context.addFlag = false
      var val = data.node.id
      context.parentMenuSeq = val
      context.isParentSelected = true
      var level = 0
      if (data.node.parents.length <= 2) {
        level = 1
      } else {
        level = 2
      }
      if (val === '0') {
        context.menuLevel = 0
        context.dataObj.upMenuNm = ''
        context.dataObj.upMenuSeq = ''
        context.dataObj.menuCdId = ''
        context.dataObj.menuCdNm = ''
        context.dataObj.menuOrder = ''
        context.dataObj.langSet = ''
        context.dataObj.useYn = 'N'
        context.parentMenuNm = ''
        context.treeSelectChk = true
      } else {
        context.parentMenuNm = data.node.text
        context.treeSelectChk = false
        context.fnMenuInfo(val, level)
      }
      return false
    })
  },
  computed: {},
  methods: {
    fnMaxChk(menuOrder) {
      menuOrder += ''
      var orderLimit = menuOrder.slice(0, 2)
      this.dataObj.menuOrder = orderLimit
    },
    fnDeleteConfirm() {
      if (!this.isParentSelected) {
        this.alert(this.$t('select-menu'), 'warning')
        return
      }
      this.confirm(this.$t('delYn'), this.fnCalldeleteApi)
    },
    submit() {
      this.confirm(this.$t('saveYn'), this.fnCallupdateApi)
    },
    fnSearchCommon(callback, reqUrl, parentId) {
      var paramObj = {}
      paramObj.parentCdId = parentId

      requestApi({
        url: reqUrl,
        headers: {
          'X-MID': 'P00058'
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            callback(res.data)
          }
        }
      })
    },
    fnSetChar(data) {
      // 언어 설정 옵션 세팅
      var defaultObj = { cdId: '', cdNm: this.$t('select') }
      this.charSetList = data
      this.charSetList.unshift(defaultObj)
      this.charSet = this.charSetList[1].cdId
      // 트리 조회
      this.fnCallAPI()
    },
    fnMakeTree() {
      $('#jstree').jstree({
        core: {
          data: this.menuTreeData
        }
      })
    },
    addPopup() {
      if (!this.isParentSelected) {
        this.alert(this.$t('select-up-menu'), 'warning')
      } else {
        this.popup({
          component: () => import('@/views/env/program/MenuMgmtAddSvc'),
          title: this.$t('menu-regi'),
          width: '500',
          height: '440',
          data: {
            idx: this.parentMenuSeq,
            text: this.parentMenuNm,
            level: this.menuLevel,
            charSet: this.charSet
          },
          callback: () => {
            this.fnCallAPI()
          }
        })
      }
    },
    fnCalldeleteApi() {
      var deleteData = {}
      deleteData.menuCdId = this.dataObj.menuCdId
      deleteData.langSet = this.charSet
      deleteData.menuSeq = this.dataObj.menuSeq
      requestApi({
        url: '/online/com/menu/deleteIotMenu',
        headers: {
          'X-MID': 'P00058'
        },
        method: 'post',
        data: deleteData,
        callback: res => {
          if (res.result.status === '200') {
            this.alert(this.$t('del-success'), 'success')
            this.fnCallAPI()
          }
        }
      })
    },
    fnCallupdateApi() {
      var updateData = {}
      updateData.menuSeq = this.dataObj.menuSeq
      updateData.menuCdId = this.dataObj.menuCdId
      updateData.menuCdNm = this.dataObj.menuCdNm
      updateData.useYn = this.dataObj.useYn
      updateData.langSet = this.charSet
      updateData.menuLevel = this.dataObj.menuLevel
      updateData.menuOrder = this.dataObj.menuOrder
      updateData.progSeq = this.progSeq
      updateData.modUserId = 'ADMIN'
      requestApi({
        url: '/online/com/menu/updateIotMenu',
        headers: {
          'X-MID': 'P00058'
        },
        method: 'post',
        data: updateData,
        callback: res => {
          if (res.result.status === '200') {
            this.alert(this.$t('save-success'), 'success')
            this.fnCallAPI()
          }
        }
      })
    },
    fnTreeReload() {
      $('#jstree')
        .data('jstree', false)
        .empty()
    },
    fnCallAPI() {
      // 트리 데이터 조회
      this.fnTreeReload()
      this.isParentSelected = false
      this.treeSelectChk = true
      this.progSeq = ''
      this.progNm = ''
      this.dataObj = []
      var reqData = {}
      reqData.langSet = this.charSet
      requestApi({
        url: '/online/com/menu/retrieveTreeMenuList',
        headers: {
          'X-MID': 'P00058'
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200') {
            res.data[0].text = this.$t('menuMgmt')
            this.menuTreeData = res.data
            this.fnMakeTree()
            var charSettarget = document.getElementById('charSelect')
            var charText =
              charSettarget.options[charSettarget.selectedIndex].text
            this.searchValue = charText
          }
        }
      })
    },
    fnMenuInfo(searchKey, level) {
      var reqData = {}
      reqData.menuSeq = searchKey
      reqData.menuLevel = level
      reqData.langSet = this.charSet
      requestApi({
        url: '/online/com/menu/getIotMenu',
        headers: {
          'X-MID': 'P00058'
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200') {
            if (res.data.length === 0) {
              this.dataObj.useYn = 'Y'
              this.dataObj.menuCdNm = ''
              this.menuLevel = 0
            } else {
              this.dataObj = res.data[0]
              this.progSeq = res.data[0].progSeq
              this.progNm = res.data[0].progNm
              this.progId = res.data[0].progId
              this.menuLevel = this.dataObj.menuLevel
              if (this.menuLevel === '3') {
                this.addFlag = true
              }
            }
          }
        }
      })
    },
    fnSearchProg() {
      this.popup({
        component: () => import('@/views/env/program/SearchProg'),
        title: this.$t('prog-search'),
        width: '500',
        height: '480',
        data: {},
        callback: data => {
          this.progSeq = data.progSeq
          this.progNm = data.progNm
          this.progId = data.progId
        }
      })
    },
    copyPopup() {
      this.popup({
        component: () => import('@/views/env/program/MenuMgmtCopySvc'),
        title: this.$t('menu-copy'),
        width: '500',
        height: '250',
        data: {
          charSet: this.charSet
        },
        callback: () => {
          this.fnCallAPI()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
