<template>
  <div>
    <div class="modal-body">
      <div class="form-inline">
        <div class="inline">
          <select id="selectedVal" class="form-control mr-1" v-model="selectedVal" >
            <option v-for="item in searchOpt" v-bind:Key="item.optVal" :value="item.optVal">{{item.otpName}}</option>
          </select>
          <input type="text" class="form-control mr-1" v-model="retrieveVal" @keyup.enter="fnSearchList()">
          <button class="btn btn-info" type="button" @click="fnSearchList()">{{$t('search')}}</button>
        </div>
      </div>
      <div class="grid-container wide grid-scroll full-size">
        <div class="table-wrap y-scroll table-height">
            <table class="table table-col" style="min-width: 100%;">
              <caption></caption>
              <colgroup>
                <col style="width:5px">
                <col style="width:30px">
                <col style="width:30px">
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">
                    <label class="checkbox">
                      <input ref="allCheckUser" @change="allCheckUser('userAttrs', $event)" role="checkbox" class="cbox" type="checkbox"><i></i>
                    </label>
                  </th>
                  <th scope="col">{{$t('sms-user-name')}}</th>
                  <th scope="col">{{$t('department')}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(userAttr, index) in userAttrs" :key="index" >
                  <td>
                    <label class="checkbox"><input v-model="userAttr.selected" role="checkbox" class="cbox" type="checkbox"><i></i></label>
                  </td>
                 <td>{{userAttr.usrNm}}</td>
                 <td>{{userAttr.orgNm}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
    </div>
    <div class="modal-footer">
        <div class="text-center">
          <button type="button" @click="submitDevice()" class="btn btn-pink">등록</button>
        </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
export default {
  name: 'DetectionsAddUserSvc',
  components: {
  },
  props: {
    data: Object, // 넘겨받을 데이터,
    callback: { // 호출할 콜백함수
      type: Function,
      required: true
    },
    close: { // 팝업 닫는함수
      type: Function,
      required: true
    }
  },
  data () {
    return {
      searchOpt: [
        { otpName: this.$t('user-name'), optVal: 'usrNm' },
        { otpName: this.$t('contact-number'), optVal: 'smsRcvNo' }
      ],
      colNameData1: [ this.$t('sms-user-name'), this.$t('department'), '', '' ],
      colModelData1: [
        { name: 'usrNm', index: 'usrNm', align: 'center', width: '220' },
        { name: 'orgNm', index: 'orgNm', align: 'center', width: '220' },
        { name: 'usrSeq', index: 'usrSeq', align: 'center', hidden: true },
        { name: 'usrLoginId', index: 'usrLoginId', align: 'center', hidden: true }
      ],
      gridList: [],
      selectedVal: '',
      retrieveVal: '',
      orgTreeData: [],
      dataObj: { upOrgNm: null, orgNm: null, orgSeq: null },
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
      userAttrs: [],
      originOrder: null
    }
  },
  created () {
    this.selectedVal = 'usrNm'
  },
  mounted () {
    this.fnSearchList()
  },
  computed: {},
  methods: {
    allCheckUser (type, event) {
      let isChecked = event.target.checked
      this.userAttrs = this.userAttrs.map(attr => {
        attr.selected = isChecked
        return attr
      })
    },
    fnSearchList() {
      this.callServerAPI(true, false, '')
    },
    callServerAPI (isSearch, isTree, treeVal) {
      var reqData = {}
      // 조회시에
      if (isSearch) {
        if (isTree) {
          reqData.searchCon = 'orgSeq'
          reqData.retrieveVal = treeVal
        } else {
          reqData.searchCon = this.selectedVal
          reqData.retrieveVal = this.retrieveVal
        }
      } else {

      }
      requestApi({
        url: '/online/iotedevdetsms/retrieveEDevDetUserList',
        headers: {
          'X-MID': 'P00011', // required (menu_id)
          'X-APIVERSION': '1'
        },
        callback: (data) => {
          this.userAttrs.splice(0, this.userAttrs.length)
          data.data.userList.forEach(rowData => {
            this.userAttrs.push(rowData)
          })
        },
        method: 'post',
        data: reqData
      })
    },
    submitDevice () {
      let selectedMessageList = this.userAttrs.filter(userAttrs => userAttrs.selected)
      var attbListLength = selectedMessageList.length - 1
      for (var j = 0; j <= attbListLength; j++) {
        var attb = selectedMessageList[j]
        this.gridList.push(attb)
      }

      if (this.gridList.length > 100) {
        this.alert(this.$t('sms-receiver-list-chk-msg')).then(() => {
          this.close()
        })
      } else {
        this.callback(this.gridList)
        this.close()
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
