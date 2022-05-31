<template>
  <div>
    <div style="border: 1px solid #ededed; padding: 10px">
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-32 lb-txt">구분</span>
          <select class="form-control">
            <option value="all">{{ $t('all') }}</option>
            <option value="subject">{{ $t('title') }}</option>
            <option value="content">{{ $t('content') }}</option>
          </select>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-32">아이디</span>
          <input type="text" class="form-control" />
        </div>
      </div>

      <div class="form-row row">
        <div class="form-item col-sm-4">
          <span class="form-label w-32">비밀번호</span>
          <div class="input-group">
            <input type="text" class="form-control" />
            <button class="btn btn-gray input-group-button" type="button">
              비밀번호
            </button>
          </div>
        </div>
        <div class="form-item col-sm-4">
          <span class="form-label w-32">이메일</span>
          <div class="input-group">
            <input type="text" class="form-control" />
            <span class="input-group-text">@</span>
            <input type="text" class="form-control" />
          </div>
        </div>
        <div class="form-item col-sm-4">
          <span class="form-label w-32">캘린더</span>
          <div class="input-group">
            <datetime-picker
              :isPair="false"
              :date.sync="inputDate"
            ></datetime-picker>
          </div>
        </div>
      </div>

      <div class="form-row row">
        <div class="form-item">
          <span class="form-label w-32">초기 비밀번호</span>
          <div class="form-text">
            초기비밀번호: ID + 연락처뒷자리 4자리 + !!
          </div>
        </div>
      </div>

      <div class="form-row row">
        <div class="form-item col-sm-4">
          <span class="form-label w-40 lb-txt">전국담당자 ID</span>
          <input type="text" class="form-control" maxlength="20" />
        </div>
        <div class="form-item col-sm-6">※ {{ $t('user-id-regx') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import DatetimePicker from '@/components/DatetimePicker'
export default {
  name: 'Form',
  components: {
    DatetimePicker
  },
  data() {
    return {
      inputDate: null
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style></style>
