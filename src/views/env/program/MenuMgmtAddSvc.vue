<template>
  <div>
    <div class="modal-body">
      <div class="form-item">
        <span class="form-label w-32">{{ $t('up-menunm') }}</span>
        <input v-model="parentNm" type="text" class="form-control" readonly />
      </div>
      <div class="form-item">
        <span class="form-label w-32">{{ $t('menu-name') }}</span>
        <input
          v-model="menuCdNm"
          type="text"
          class="form-control"
          maxlength="15"
        />
      </div>
      <div class="form-item">
        <span class="form-label w-32">{{ $t('prog-id') }}</span>
        <div class="input-group">
          <input v-model="progId" type="text" class="form-control" readonly />
          <button
            type="button"
            class="btn btn-gray input-group-addon"
            @click="fnSearchProg()"
          >
            {{ $t('search') }}
          </button>
        </div>
      </div>
      <div class="form-item">
        <span class="form-label w-32">{{ $t('prog-name') }}</span>
        <input v-model="progNm" type="text" class="form-control" readonly />
      </div>
      <div class="form-item">
        <span class="form-label w-32">{{ $t('menu-orderNum') }}</span>
        <input
          v-model="menuOrder"
          onKeyup="this.value = this.value.replace(/[^0-9]/g, '')"
          type="number"
          class="form-control"
          min="0"
          maxlength="10"
        />
      </div>
      <div class="form-item">
        <span class="form-label w-32">{{ $t('charSet') }}</span>
        <select v-model="charSet" class="form-control" disabled>
          <option
            v-for="item in charSetList"
            :key="item.cdId"
            :value="item.cdId"
            >{{ item.cdNm }}</option
          >
        </select>
      </div>
      <div class="form-item">
        <span class="form-label w-32">{{ $t('useYn') }}</span>
        <select v-model="useYn" class="form-control">
          <option
            v-for="item in useOptList"
            :key="item.optVal"
            :value="item.optVal"
            >{{ item.optNm }}</option
          >
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button @click="submit()" type="button" class="btn btn-pink">
          {{ $t('registration') }}
        </button>
        <button
          @click="close()"
          type="button"
          class="btn btn-gray"
          data-dismiss="modal"
        >
          {{ $t('cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'MenuMgmtAddSvc',
  components: {},
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
  data() {
    return {
      charSetList: [],
      useOptList: [
        { optNm: this.$t('use'), optVal: 'Y' },
        { optNm: this.$t('use-no'), optVal: 'N' }
      ],
      parentNm: '',
      menuCdId: '',
      menuCdNm: '',
      progNm: '',
      progSeq: '',
      progId: '',
      menuOrder: '',
      charSet: '',
      menuIdDupChk: false,
      menuNmDupChk: true,
      useYn: 'Y'
    }
  },
  created() {
    this.parentNm = this.data.text
    this.charSet = this.data.charSet
    this.fnSearchCommon(
      this.fnSetChar,
      '/online/iotcmcd/retrieveIotByParentCmCdRuntime',
      'GN00000021'
    )
  },
  mounted() {},
  computed: {},
  methods: {
    fnSearchCommon(callback, reqUrl, parentId) {
      var paramObj = {}
      paramObj.parentCdId = parentId

      requestApi({
        url: reqUrl,
        headers: {
          'X-MID': 'P00059'
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
      var defaultObj = { cdId: '', cdNm: this.$t('select') }
      this.charSetList = data
      this.charSetList.unshift(defaultObj)
    },
    fnMenuDuplChk(gubun) {
      var dupparamObj = {}
      dupparamObj.langSet = this.charSet
      var reqUrl = ''
      if (gubun === 'N') {
        dupparamObj.menuCdNm = this.menuCdNm
        reqUrl = '/online/com/menu/menuNmDuplicatChk'
      } else {
        dupparamObj.menuCdId = this.menuCdId
        reqUrl = '/online/com/menu/menuIdDuplicatChk'
      }
      requestApi({
        url: reqUrl,
        headers: {
          'X-MID': 'P00059'
        },
        method: 'post',
        data: dupparamObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(res.data.msg)
            if (gubun === 'N') {
              this.menuNmDupChk = true
            } else {
              this.menuIdDupChk = true
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
    submit() {
      if (!this.menuNmDupChk) {
        this.alert(this.$t('menuNm-duplchk-msg'), 'warning')
      } else {
        this.showConfirmPopup(this.$t('saveYn'))
      }
    },
    showConfirmPopup(msg) {
      if (this.menuCdNm === '' || this.menuCdNm === null) {
        this.alert(this.$t('menu-name') + this.$t('request-input'), 'warning')
        return
      }
      this.confirm(msg, this.fnCallinsertApi)
    },
    fnCallinsertApi() {
      var insertData = {}
      var level = this.data.level
      level *= 1
      insertData.upMenuSeq = this.data.idx
      insertData.menuCdId = this.menuCdId
      insertData.menuCdNm = this.menuCdNm
      insertData.menuLevel = level + 1
      insertData.progSeq = this.progSeq
      insertData.menuOrder = this.menuOrder
      insertData.langSet = this.charSet
      insertData.useYn = this.useYn

      requestApi({
        url: '/online/com/menu/insertIotMenu',
        headers: {
          'X-MID': 'P00059'
        },
        method: 'post',
        data: insertData,
        callback: res => {
          if (res.result.status === '200') {
            this.callback()
            this.close()
            this.alert(this.$t('save-success'), 'success')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
