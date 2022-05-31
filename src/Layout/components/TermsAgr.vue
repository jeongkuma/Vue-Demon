<template>
  <div>
      <div class="modal-body">
        <div class="terms">
          <h5>{{$t('terms-first')}}</h5>
          <p>{{$t('terms-second')}}</p>
          <div v-for="reqTerms in reqTermsList" :key="reqTerms.iotTermsNo" :value="reqTerms.iotTermsNo" style="position:relative;margin-top:10px;">
            <h5>{{reqTerms.iotTermsNm}}</h5>
            <textarea v-model="reqTerms.iotTermsCntn" readonly rows="10" text-align="center" style="resize: none;width:100%">
            </textarea>
            <div class="form-check">
              <label class="form-check-label" for="ch1">
                <input v-model="reqTerms.checkYn" class="form-check-input" type="checkbox" id="ch1">{{$t('terms-third')}}
                <span class="form-check-sign"></span>
              </label>
            </div>
          </div>
          <div v-for="optTerms in optTermsList" :key="optTerms.iotTermsNo" :value="optTerms.iotTermsNo" style="position:relative;margin-top:10px;margin-bottom:10px">
            <h5>{{optTerms.iotTermsNm}}</h5>
            <textarea v-model="optTerms.iotTermsCntn" readonly cols="118" rows="10" text-align="center" style="resize: none;margin-bottom:6px;">
            </textarea>
            <div class="form-check">
              <label class="form-check-label" for="ch2">
                <input v-model="optTerms.checkYn" class="form-check-input" type="checkbox" id="ch2">{{$t('terms-forth')}}
                <span class="form-check-sign"></span>
              </label>
            </div>
          </div>
          <ul class="point-txt">
            <li>{{$t('terms-fifth')}}</li>
            <li>{{$t('terms-sixth')}}</li>
          </ul>
          <p class="info">{{nowDate}}<span class="">{{usrNm}}</span></p>
        </div>
      </div>
    <div class="modal-footer">
      <div class="text-center">
        <button type="button" class="btn btn-pink" @click="termsAgreeConfirm()">{{$t('agree')}}</button>
        <button type="button" class="btn btn-gray" @click="closeConfirm()">{{$t('close')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import moment from 'moment'
export default {
  name: 'termsAgreeYnPopup',
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
      reqData: { custLoginId: null, usrLoginId: null, authCdId: 'GN00000058' },
      nowDate: null,
      usrNm: null,
      infoUrl: '/online/iotlogin/retrieveIotUsrPersonalInfo',
      termsUrl: '/online/iotterms/retrieveIotTerms',
      agrUrl: '/online/iotterms/createIotTermsAgr',
      reqTermsList: [],
      optTermsList: [],
      termsNoList: []
    }
  },
  created () {
    this.reqData = this.data
    this.nowDate = moment().format('YYYY[년 ]MM[월 ]DD[일]')
    this.requestApi(this.infoUrl, 1)
    this.requestApi(this.termsUrl, 2)
  },
  mounted() {
  },
  methods: {
    termsAgreeConfirm () {
      var checkAgr = true
      this.reqTermsList.forEach(reqAgr => {
        if (reqAgr.checkYn === false) {
          checkAgr = false
        }
      })
      if (!checkAgr) {
        this.alert(this.$t('lead-check-terms'))
      } else {
        this.confirm(this.$t('lead-termsAgree'), this.createIotTermsAgr)
      }
    },
    createIotTermsAgr() {
      this.requestApi(this.agrUrl, 3)
    },
    // mode ~ 1 : 개인정보 조회, 2 : 약관 조회, 3 : 동의 여부 변경
    requestApi (url, mode) {
      if (mode === 3) {
        this.reqTermsList.forEach(reqTerms => {
          if (reqTerms.checkYn === true) {
            this.termsNoList.push(reqTerms.iotTermsNo)
          }
        })
        this.optTermsList.forEach(optTerms => {
          if (optTerms.checkYn === true) {
            this.termsNoList.push(optTerms.iotTermsNo)
          }
        })
        this.reqData.termsNoList = this.termsNoList
      }
      requestApi({
        url: url,
        headers: {
          'X-MID': 'P00053'
        },
        method: 'post',
        data: this.reqData,
        callback: (res) => {
          if (res.result.status === '200') {
            if (mode === 1) {
              this.usrNm = res.data.usrNm
            } else if (mode === 2) {
              if (res.data.reqTerms !== null) {
                this.reqTermsList = res.data.reqTerms
                this.reqTermsList.forEach(reqTerms => {
                  if (reqTerms.checkYn === 'N') {
                    reqTerms.checkYn = false
                  }
                })
              }
              if (res.data.optTerms !== null) {
                this.optTermsList = res.data.optTerms
                this.optTermsList.forEach(optTerms => {
                  if (optTerms.checkYn === 'N') {
                    optTerms.checkYn = false
                  }
                })
              }
            } else {
              this.termsNoList = []
              if (res.result.status === '200') {
                this.close()
                this.callback(true)
              }
            }
          }
        }
      })
    },
    termsAgree () {
      this.reqData.termsAgreeYn = 'Y'
      requestApi({
        url: '/online/iotlogin/updateIotTermsAgreeYn',
        headers: {
          'X-MID': 'P00053'
        },
        method: 'post',
        data: this.reqData,
        callback: (res) => {
          if (res.result.status === '200') {
            if (res.data.termsAgreeYn === 'Y') {
              this.close()
              this.callback(true)
            }
          }
        }
      })
    },
    fnClose () {
      this.close()
      this.callback(false)
    },
    closeConfirm () {
      this.confirm(this.$t('closeYn'), this.fnClose)
    }
  }
}
</script>

<style scoped>
</style>
