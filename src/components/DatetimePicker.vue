<template>
  <div class="form-inline form-group date-half">
    <template v-if="isPair">
      <div ref="startDateWrap" class="input-group startDate ">
        <input ref="startDate" type="text" class="form-control"
          title="검색기간 시작일">
        <span class="input-group-addon cal-bg"><span class="date-icon"></span></span>
      </div>
      <span class="mx-0">~</span>
      <div ref="endDateWrap" class="input-group endDate">
        <input ref="endDate" type="text" class="form-control"
          title="검색기간 종료일">
        <span class="input-group-addon cal-bg"><span class="date-icon"></span></span>
      </div>
    </template>
    <template v-else>
      <div ref="dateWrap" class="input-group startDate ">
        <input ref="date" type="text" class="form-control">
        <span class="input-group-addon cal-bg"><span class="date-icon"></span></span>
      </div>
    </template>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'DatetimePicker',
  props: {
    isPair: { // true 설정 시 검색기간 시작,종료일 모두 표시
      type: Boolean,
      required: true
    },
    month: { // true 설정 시 'YYYY-MM' 형식으로 보여짐
      type: Boolean,
      required: false,
      default: false
    },
    hour: { // true 설정 시 'YYYY-MM-DD HH:00' 형식으로 보여짐
      type: Boolean,
      required: false,
      default: false
    },
    minute: { // true 설정 시 'YYYY-MM-DD HH:mm' 형식으로 보여짐 (hour가 true 되어있어야함)
      type: Boolean,
      required: false,
      default: false
    },
    second: { // true 설정 시 'YYYY-MM-DD HH:mm:ss' 형식으로 보여짐 (hour, minute 가 true 되어있어야함)
      type: Boolean,
      required: false,
      default: false
    },
    setSideBySide: { // 단일 Date 에서만 사용가능하며 sideBySide 형식으로 보여진다.
      type: Boolean,
      required: false,
      default: false
    },
    date: null, // 단일 Date 변수 (양방향 동기화 지원)
    startDate: null, // 시작 Date 변수 (양방향 동기화 지원)
    endDate: null, // 종료 Date 변수 (양방향 동기화 지원)
    minDate: null, // 최소 Date 지정 (해당 Date 이전은 선택 불가)
    maxDate: null, // 최대 Date 지정 (해당 Date 이후는 선택 불가)

    // SampleSvc 파일 참고 {days:7} 또는 {month:1} 같이 설정하면 됨.
    duration: null
    // { // (최소-최대)기간 - 한쪽 Date 를 선택 시 기간을 넘어가면 다른쪽 Date가 기간만큼 딸려온다
    //   days: 7, // 이 값을 설정하면 month 값을 무시하게 된다.
    //   months: 6
    // }
  },
  data () {
    return {
      /**
       * startDate, endDate 두개 동시에 외부에서 초기화 시키는경우 watch 가 둘다 실행되는데
       * startDate, endDate 둘중에 하나가 값이 변경되며 다른쪽을 업데이트 시키며 싱크를 시켜
       * 반대로 외부의 초기값을 변경시켜버리는 이슈가 있다.
       * 이런경우 컴포넌트를 사용하는 외부에서는 둘다 초기화를 시켰는데 한쪽은 값이 원래대로 돌아오는 증상이 발생함
       * 외부에서 임의로 값을 변경하는 경우에는 다른쪽의 값을 변경하지 않도록 상태값을 추가한다.
       */
      isStartDateInnerUpdate: false,
      isEndDateInnerUpdate: false
    }
  },
  computed: {
    getDatetimeFormat () {
      return this.month ? 'YYYY-MM'
        : this.hour && this.minute && this.second ? 'YYYY-MM-DD HH:mm:ss'
          : this.hour && this.minute ? 'YYYY-MM-DD HH:mm'
            : this.hour ? 'YYYY-MM-DD HH:00'
              : 'YYYY-MM-DD'
    },
    getDatetimeViewMode () {
      return this.month ? 'months' : 'days'
    }
  },
  watch: {
    date: function (newValue) {
      if (newValue instanceof Date) {
        $(this.$refs.dateWrap).data('DateTimePicker').date(this.getFormatedDatetime(newValue))
      } else {
        $(this.$refs.dateWrap).data('DateTimePicker').date(null)
      }
    },
    /**
     * setStartDatetimePicker, setEndDatetimePicker 함수에서 마지막에 date함수를 이용해
     * 날짜를 업데이트 하는데 업데이트하는 날짜값(date)이 min, max 사이에 있지 않으면
     * dp.change 이벤트 함수가 호출이 안되는 라이브러리 버그가 있어서
     * 외부 컴포넌트에서 값을 셋팅 시 현재시간(new Date) 값으로 값을 셋팅하면
     * startDate 날짜를 변경 후 값을 초기화 시 이벤트 함수가 호출이 되지 않으므로
     * 값을 포멧에 맞게 값을 수정해 준다.
     *
     * minDate, maxDate 값이 있는 상태에서 date 함수로 기존과 같은 값을 넣을 시
     * dp.change 이벤트 함수가 호출이 안되는 버그가 추가로 발견됨.
     * minDate, maxDate 를 false로 설정 후 date를 셋팅하여 이벤트 함수를 실행하게 된 뒤
     * 원래 셋팅되어 있던 값으로 다시 셋팅해 준다.
     */
    startDate: function (newValue) {
      if (this.isStartDateInnerUpdate) {
        this.isStartDateInnerUpdate = false
      } else {
        let startDatetimePicker = $(this.$refs.startDateWrap).data('DateTimePicker')
        if (newValue instanceof Date) {
          let min = startDatetimePicker.minDate()
          let max = startDatetimePicker.maxDate()
          startDatetimePicker.minDate(false).maxDate(false).date(this.getFormatedDatetime(newValue))
          startDatetimePicker.minDate(min).maxDate(max)
        } else {
          startDatetimePicker.date(null)
        }
      }
    },
    endDate: function (newValue) {
      if (this.isEndDateInnerUpdate) {
        this.isEndDateInnerUpdate = false
      } else {
        let endDatetimePicker = $(this.$refs.endDateWrap).data('DateTimePicker')
        if (newValue instanceof Date) {
          let min = endDatetimePicker.minDate()
          let max = endDatetimePicker.maxDate()
          endDatetimePicker.minDate(false).maxDate(false).date(this.getFormatedDatetime(newValue))
          endDatetimePicker.minDate(min).maxDate(max)
        } else {
          endDatetimePicker.date(null)
        }
      }
    },
    month: function () {
      this.changeFormat()
    },
    hour: function () {
      this.changeFormat()
    },
    minute: function () {
      this.changeFormat()
    },
    second: function () {
      this.changeFormat()
    }
  },
  mounted () {
    const context = this
    if (this.isPair) {
      $(this.$refs.startDateWrap).datetimepicker({
        sideBySide: true,
        format: this.getDatetimeFormat,
        allowInputToggle: true,
        useCurrent: false,
        showClear: true,
        minDate: this.minDate || false,
        maxDate: this.maxDate || false
      })
      $(this.$refs.endDateWrap).datetimepicker({
        sideBySide: true,
        format: this.getDatetimeFormat,
        allowInputToggle: true,
        useCurrent: false,
        showClear: true,
        minDate: this.minDate || false,
        maxDate: this.maxDate || false
      })
      $(this.$refs.startDateWrap).on('dp.change', function (e) {
        context.isStartDateInnerUpdate = true
        if (!e.date) { // 날짜선택 없을때
          context.$emit('update:startDate', null)
        } else {
          e.date = context.getFormatedDatetime(e.date)
          context.$emit('update:startDate', e.date.toDate())
        }
        context.setEndDatetimePicker(e.date)
      })
      $(this.$refs.endDateWrap).on('dp.change', function (e) {
        context.isEndDateInnerUpdate = true
        if (!e.date) { // 날짜선택 없을때
          context.$emit('update:endDate', null)
        } else {
          e.date = context.getFormatedDatetime(e.date)
          context.$emit('update:endDate', e.date.toDate())
        }
        context.setStartDatetimePicker(e.date)
      })
    } else {
      $(this.$refs.dateWrap).datetimepicker({
        sideBySide: this.setSideBySide,
        format: this.getDatetimeFormat,
        allowInputToggle: true,
        useCurrent: false,
        showClear: true,
        minDate: this.minDate || false,
        maxDate: this.maxDate || false
      })
      $(this.$refs.dateWrap).on('dp.change', function (e) {
        if (!e.date) {
          context.$emit('update:date', null)
        } else {
          e.date = moment(e.date.format(context.getDatetimeFormat))
          context.$emit('update:date', new Date(e.date.toDate()))
        }
      })
    }
  },
  methods: {
    /**
     * 현재 선택한 Format에 맞게 시간을 변경해서 반환한다.
     * ex) days 같은경우 new Date() 하게되면 YYYY-MM-DD 00:00:00 으로 반환
     * @param datetime DATE | moment
     * @return moment
     */
    getFormatedDatetime(datetime) {
      if (!datetime) {
        return datetime
      }
      return moment(moment(datetime).format(this.getDatetimeFormat))
    },
    setStartDatetimePicker(endDate) {
      let minDate = this.getFormatedDatetime(this.minDate)
      let maxDate = this.getFormatedDatetime(this.maxDate)
      let startDateTimePicker = $(this.$refs.startDateWrap).data('DateTimePicker')

      // duration 설정된경우 duration 계산에 따른 minDate
      let maxDuration =
        endDate && this.duration && (this.duration.days || this.duration.months) // endDate 가 있으며 duration 값이 있는경우
          ? this.duration.days
            ? moment(endDate).subtract(this.duration.days - 1, 'days') // duration.days 있는경우
            : moment(endDate).subtract(this.duration.months, 'months') // duration.months 있는경우
          : null // endDate 가 없거나 duration 값이 없는경우

      // duration, minDate 둘중에 이전날짜
      let min =
        maxDuration && minDate // maxDuration, minDate 둘다 값이 있는경우
          ? moment(maxDuration).isBefore(minDate)
            ? maxDuration // maxDuration 이 이후날짜인경우
            : minDate // minDate 가 이후날짜인경우
          : minDate || false // minDate 가 있으면 minDate 셋팅, 없으면 false(기본값)

      // endDate 가 있으면 endDate 셋팅, 없으면 maxDate 셋팅, 없으면 false(기본값)
      let max = endDate || maxDate || false

      let date = maxDuration && maxDuration.isAfter(startDateTimePicker.date())
        ? maxDuration
        : startDateTimePicker.date()

      // console.log('[ setStartDatetimePicker ]\ndate: ' + moment(date).toDate() +
      //   '\nmin: ' + new Date(min) +
      //   '\nmax: ' + new Date(max))
      startDateTimePicker.minDate(false).maxDate(false)
      if (moment(date).isValid()) {
        startDateTimePicker.date(date)
      } else {
        startDateTimePicker.date(null)
      }
      startDateTimePicker.minDate(min).maxDate(max)
    },
    setEndDatetimePicker(startDate) {
      let minDate = this.getFormatedDatetime(this.minDate)
      let maxDate = this.getFormatedDatetime(this.maxDate)
      let endDateTimePicker = $(this.$refs.endDateWrap).data('DateTimePicker')

      // duration 설정된경우 duration 계산에 따른 maxDate
      let maxDuration =
        startDate && this.duration && (this.duration.days || this.duration.months) // startDate 가 있으며 duration 값이 있는경우
          ? this.duration.days
            ? moment(startDate).add(this.duration.days - 1, 'days') // duration.days 있는경우
            : moment(startDate).add(this.duration.months, 'months') // duration.months 있는경우
          : null // startDate 가 없거나 duration 값이 없는경우

      // startDate 가 있으면 startDate 셋팅, 없으면 minDate 셋팅, 없으면 false(기본값)
      let min = startDate || minDate || false

      // duration, maxDate 둘중에 이후날짜
      let max =
        maxDuration && maxDate // maxDuration, maxDate 둘다 값이 있는경우
          ? moment(maxDuration).isAfter(this.maxDate)
            ? maxDuration // maxDuration 이 이전날짜인경우
            : maxDate // maxDate 가 이전날짜인경우
          : maxDate || false // maxDate 가 있으면 maxDate 셋팅, 없으면 false(기본값)

      let date = maxDuration && maxDuration.isBefore(endDateTimePicker.date())
        ? maxDuration
        : endDateTimePicker.date()

      // console.log('[ setEndDatetimePicker ]\ndate: ' + moment(date).toDate() +
      //   '\nmin: ' + new Date(min) +
      //   '\nmax: ' + new Date(max))
      endDateTimePicker.minDate(false).maxDate(false)
      if (moment(date).isValid()) {
        endDateTimePicker.date(date)
      } else {
        endDateTimePicker.date(null)
      }
      endDateTimePicker.minDate(min).maxDate(max)
    },
    changeFormat () {
      if (this.isPair) {
        $(this.$refs.startDateWrap)
          .data('DateTimePicker')
          .format(this.getDatetimeFormat)
          .viewMode(this.getDatetimeViewMode)
        $(this.$refs.endDateWrap)
          .data('DateTimePicker')
          .format(this.getDatetimeFormat)
          .viewMode(this.getDatetimeViewMode)
      } else {
        $(this.$refs.dateWrap)
          .data('DateTimePicker')
          .format(this.getDatetimeFormat)
          .viewMode(this.getDatetimeViewMode)
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
