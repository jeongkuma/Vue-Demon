<template>
  <div style="padding-top: 15px;">
    <div>
      <div>
        <div class="mb-2 btn-wrap text-right">
          <div class="form-group">
            <button type="button" class="btn btn-pink" @click="addPopup()" :disabled="treeSelectChk">{{$t('registration')}}</button>
          </div>
        </div>
        <div class="form-row">
          <div class="md-width-100 width-50 pr-2 md-p-0 mb-1">
            <div ref="treeWrap" class="border-1" style="min-height: 395px">
              <div id="jstree" class="treebox"></div>
            </div>
          </div>
          <div class="md-width-100 width-50 pl-2 md-p-0">
            <ul class="form-inbox">
              <li>
                <span class="tit">{{$t('up-org')}}</span>
                <div class="form-group form-inline">
                  <input type="text" class="form-control" v-model="dataObj.upOrgNm" readonly>
                </div>
              </li>
              <li>
                <span class="tit">{{$t('orgnm')}}</span>
                <div class="form-inline">
                  <div class="form-group">
                    <input type="text" class="form-control" v-model="dataObj.orgNm" :readonly="isModifyTrue" @input="orgNmDuplChk = false" maxlength="33">
                  </div>
                  <span>
                    <button type="button" class="btn btn-gray" @click="fnOrgDuplChk()" :disabled="isModifyTrue">{{$t('duplication-check')}}</button>
                  </span>
                  <span>
                    <div class="input-group">&nbsp; ※ {{$t('orgNm-regx')}}</div>
                  </span>
                </div>
              </li>
              <li>
                <span class="tit">{{$t('org-lvl')}}</span>
                <div class="form-group form-inline">
                  <input type="text" class="form-control" v-model="dataObj.orgOrder" :readonly="isModifyTrue" maxlength="2">
                </div>
              </li>
              <li>
                <span class="tit">{{$t('useYn')}}</span>
                <div class="form-group form-inline">
                <select class="form-control" v-model="dataObj.useYn" :disabled="isModifyTrue">
                  <option v-for="item in useOptList" v-bind:key="item.optVal" :value="item.optVal">{{item.optNm}}</option>
                </select>
                </div>
              </li>
            </ul>
            <div class="mt-3 text-right">
              <button @click="submit()" type="button" class="btn btn-pink" :disabled="isModifyTrue">{{$t('modify')}}</button>
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
  name: 'organizationSvc',
  components: {
  },
  props: {
  },
  data () {
    return {
      orgTreeData: [],
      dataObj: { upOrgNm: null, orgNm: null, orgSeq: null },
      retrieveOrgListAPI: '/online/iotorg/retrieveIotOrg',
      retrieveOrgBySeqAPI: '/online/iotorg/retrieveIotOrgBySeq',
      retrieveIotOrgNmChk: '/online/iotorg/retrieveIotOrgNmChk',
      updateIotOrg: '/online/iotorg/updateIotOrg',
      useOptList: [
        { optNm: this.$t('use'), optVal: 'Y' },
        { optNm: this.$t('use-no'), optVal: 'N' }
      ],
      parentOrgSeq: null,
      isParentSelected: false,
      orgNmDuplChk: false,
      treeSelectChk: true,
      isModifyTrue: true,
      originNm: null,
      originOrder: null,
      isFirstGrp: false
    }
  },
  created () {},
  mounted () {
    var local = this
    this.fnCallAPI(this.retrieveOrgListAPI, {}, 1)
    $('#jstree').on('select_node.jstree', function(e, data) {
      if (data.node.parents.length !== 0) {
        if (data.node.parents.length !== 4) {
          local.treeSelectChk = false
        } else {
          local.treeSelectChk = true
        }
        var val = data.node.id
        local.isParentSelected = true
        if (data.node.parent === '#') {
          local.isModifyTrue = true
        } else {
          local.isModifyTrue = false
        }
        local.parentOrgSeq = val
        local.fnOrgInfo(val)
      } else {
        local.isModifyTrue = true
        local.treeSelectChk = true
      }
    })
  },
  computed: {},
  beforeDestroy () {
    // 트리 캐시 삭제
    $('#jstree').jstree('destroy')
  },
  methods: {
    fnBlankCheck (content) {
      var blankPattern = /^\s+|\s+$/g
      if (content === undefined || content === null) {
        return false
      } else {
        if (content.replace(blankPattern, '') === '') {
          return false
        } else {
          return true
        }
      }
    },
    fnOrgDuplChk () {
      if (!this.fnBlankCheck(this.dataObj.orgNm)) {
        this.alert(this.$t('orgNm-input'), 'warning')
      } else if (this.dataObj.orgNm.length < 2 || this.dataObj.orgNm.length > 33) {
        this.alert(this.$t('orgNm-leng-chk'), 'warning')
      } else {
        var paramObj = {}
        paramObj.orgNm = this.dataObj.orgNm
        this.orgNmDuplChk = true
        this.fnCallAPI(this.retrieveIotOrgNmChk, paramObj, 4)
      }
    },
    fnOrgInfo (orgSeq) {
      var paramObj = {}
      paramObj.orgSeq = orgSeq
      this.fnCallAPI(this.retrieveOrgBySeqAPI, paramObj, 2)
    },
    fnMakeTree() {
      $('#jstree').jstree(
        { core:
          {
            data: this.orgTreeData
          }
        })
      $('#jstree').jstree(true).refresh()
    },
    addPopup: _.throttle(
      function () {
        if (!this.isParentSelected) {
          this.alert(this.$t('select-up-org'), 'warning')
        } else {
          this.popup({
            component: () => import('@/views/custusr/cust/OrganizationAddSvc'),
            title: this.$t('org-add'),
            width: '500',
            height: '370',
            data: {
              idx: this.parentOrgSeq
            },
            callback: (data) => {
              if (data !== 'dismiss') {
                this.fnCallAPI(this.retrieveOrgListAPI, {}, 3)
              }
            }
          })
        }
      }, 1000, { 'trailing': false }
    ),
    confirmCallback () {
      this.fnCallAPI(this.updateIotOrg, this.dataObj, 5)
    },
    submit () {
      if (!this.fnBlankCheck(this.dataObj.orgNm)) {
        this.alert(this.$t('orgNm-input'), 'warning')
      } else if (this.dataObj.orgNm.length < 2 || this.dataObj.orgNm.length > 33) {
        this.alert(this.$t('orgNm-leng-chk'), 'warning')
      } else if (!this.orgNmDuplChk) {
        // 중복체크 안하고 조직명이 변경됐을 때
        if (this.originNm !== this.dataObj.orgNm) {
          this.alert(this.$t('orgNm-dupl-chk'), 'warning')
        // 중복체크 안하고 조직명이 같은 때
        } else {
          if (this.originOrder !== this.dataObj.orgOrder) {
            this.dataObj.originOrder = this.originOrder
          }
          this.confirm(this.$t('saveYn'), this.confirmCallback)
        }
      } else {
        if (this.originOrder !== this.dataObj.orgOrder) {
          this.dataObj.originOrder = this.originOrder
        }
        this.confirm(this.$t('saveYn'), this.confirmCallback)
      }
    },
    fnTreeReload() {
      $('#jstree').data('jstree', false).empty()
      this.fnCallAPI(this.retrieveOrgListAPI, {}, 1)
    },
    // division 1: 트리 데이터 조회, 2: 조직정보 조회, 3:트리 데이터 재조회, 4: 조직명 중복조회, 5: 업데이트
    fnCallAPI (url, data, division) {
      requestApi({
        url: url,
        headers: {
          'X-MID': 'P00039'
        },
        method: 'post',
        data: data,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            if (division === 1) {
              this.orgTreeData = res.data
              this.fnMakeTree()
            } else if (division === 2) {
              if (res.data === null) {
                res.data.upOrgNm = ''
              }
              this.originNm = res.data.orgNm
              this.originOrder = res.data.orgOrder
              this.dataObj = res.data
            } else if (division === 3) {
              this.orgTreeData = res.data
              this.fnTreeReload()
            } else if (division === 4) {
              this.alert(res.data.message, 'success')
              this.orgNmDuplChk = true
            } else if (division === 5) {
              this.fnTreeReload()
              this.dataObj = { upOrgNm: null, orgNm: null, orgSeq: null }
              this.fnCallAPI(this.retrieveOrgListAPI, {}, 1)
              this.isModifyTrue = true
              this.treeSelectChk = true
              this.alert(this.$t('save-success'), 'success')
            }
          } else {
            if (division === 4) {
              if (this.originNm !== this.dataObj.orgNm) {
                this.orgNmDuplChk = false
              }
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
