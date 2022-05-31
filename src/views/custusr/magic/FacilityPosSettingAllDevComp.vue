<template>
  <div class="md-width-100 width-60">
    <div class="titH5 py-2">{{ $t('target-device') }}</div>
    <div class="py-1 form-inline">
      <div class="form-group">
        <span class="form-control-static">{{ $t('service') }}</span>
        <select v-model="formData.svcCd" class="form-control" style="width: 120px">
          <option value="">{{$t('select')}}</option>
          <option v-for="(svc, index) in svcCdList" :key="`svcCd-${index}`" :value="svc.svcCd">{{ svc.svcCdNm }}</option>
        </select>
      </div>
      <div class="form-group">
        <span class="form-control-static">{{ $t('dev-cls') }}</span>
        <select v-model="formData.devClsCd" class="form-control" style="width: 100px">
          <option value="">{{$t('select')}}</option>
          <option v-for="devCls in devClsList" :key="'devCls'+devCls.devClsCd" :value="devCls.devClsCd">{{ devCls.devClsNm }}</option>
        </select>
      </div>
      <div class="form-group">
        <span class="form-control-static">{{ $t('dev-mdl-nm') }}</span>
        <select v-model="formData.devMdlCd" class="form-control" style="width: 120px">
          <option value="all">{{$t('전체')}}</option>
          <option v-for="devMdl in devMdlList" :key="devMdl.devMdlCd" :value="devMdl.devMdlCd">{{devMdl.devMdlNm}}</option>
        </select>
      </div>
      <div class="form-group">
        <button type="button" class="btn btn-info" @click="fnSearch">
          {{ $t('search') }}
        </button>
      </div>
    </div>
    <div style="height: 300px; overflow-y: auto;">
      <table class="table table-col pt-2">
        <colgroup>
          <col style="" />
          <col style="" />
          <col style="" />
          <col style="" />
          <col style="" />
          <col style="width: 90px" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">{{ $t('service') }}</th>
            <th scope="col">{{ $t('dev-cls') }}</th>
            <th scope="col">{{ $t('dev-mdl') }}</th>
            <th scope="col">{{ $t('pin-nm') }}</th>
            <th scope="col">{{ $t('pin') }}</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(dev, index) in devList" :key="`dev-${index}`">
            <td>{{ dev.svcCdNm }}</td>
            <td>{{ dev.devClsCdNm }}</td>
            <td>{{ dev.devMdlNm }}</td>
            <td class="text-left">{{ dev.devUname }}</td>
            <td class="text-left">{{ dev.ctn }}</td>
            <td>
              <button
                type="button"
                class="btn btn-gray"
                @click="fnAddDevice(dev)"
              >
                {{ $t('add') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <pagination
      ref="page"
      :currentPage.sync="formData.currentPage"
      :rowCount.sync="formData.displayRowCount"
      :totalPage="pageInfo.totalPage"
      :onPaging="fnGetDeviceList"
      class="inner"
    ></pagination>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { requestApi } from '@/api/ccp/requestApi'
import { getSvcList, getDevClsCdListBySvcCd, getDevMdlListByDevCls } from '@/api/common/usrSvcDevice'

export default {
  name: 'FacilityPosSettingAllDevComp',
  components: { Pagination },
  props: {
    facility: {
      type: Object
    },
    xMid: {
      type: String
    }
  },
  data() {
    return {
      devList: [],
      formData: {
        svcCd: '',
        devClsCd: '',
        devMdlCd: 'all',
        currentPage: 1,
        displayRowCount: 15
      },
      svcCdList: [],
      devClsList: [],
      devMdlList: [],
      pageInfo: {
        totalPage: 10
      }
    }
  },
  computed: {},
  watch: {
    'formData.svcCd'() {
      this.fnGetDevClsList()
    },
    'formData.devClsCd'() {
      this.fnGetDevMdlList()
    }
  },
  created() {},
  async mounted() {
    await this.fnGetSvcCdList()
    await this.fnGetDevClsList()
    this.fnGetDeviceList()
  },
  methods: {
    fnGetSvcCdList() {
      return new Promise((resolve, reject) => {
        getSvcList({ xMid: this.xMid })
          .then(data => {
            this.svcCdList = data
            if (this.svcCdList.length > 0) {
              this.formData.svcCd = this.svcCdList[0].svcCd
            }
            resolve()
          })
          .catch(e => {
            reject(e)
          })
      })
    },
    fnGetDevClsList() {
      return new Promise((resolve, reject) => {
        if (this.formData.svcCd === '') {
          this.formData.devClsCd = ''
          this.devClsList = []
          return false
        }
        getDevClsCdListBySvcCd({ xMid: this.xMid, svcCd: this.formData.svcCd })
          .then(data => {
            this.devClsList = data.devClsList
            this.formData.devClsCd = this.devClsList[0].devClsCd
            resolve()
          })
          .catch(e => {
            reject(e)
          })
      })
    },
    fnGetDevMdlList() {
      this.formData.devMdlCd = 'all'
      this.devMdlList = []
      if (this.formData.devClsCd === '') {
        return false
      }
      getDevMdlListByDevCls({ devClsCd: this.formData.devClsCd }, this.xMid)
        .then(data => {
          this.devMdlList = data
        })
        .catch(e => {
          console.error(e)
        })
    },
    fnGetDeviceList() {
      requestApi({
        url: '/online/iotedev/retrieveIotEDev',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: this.formData,
        callback: res => {
          if (res.data) {
            this.devList = res.data.dataList || []
            this.pageInfo.totalPage = res.data.totPage ? res.data.totPage : 0
          }
        }
      })
    },
    fnSearch() {
      this.formData.currentPage = 1
      this.fnGetDeviceList()
    },
    fnAddDevice(dev) {
      this.$emit('add', dev)
    }
  }
}
</script>

<style></style>
