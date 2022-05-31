<template>
  <div class="popup-wrap">
    <div class="popup-header">
      <h4 class="popup-header--title">{{ title }}</h4>
      <button class="popup-header--close" type="button" @click="dismiss('dismiss')">
        ×
      </button>
    </div>
    <div class="popup-contents">
      <component :is="component" class="" v-bind="{data, callback}" :close="dismiss"></component>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentPopup',
  components: {},
  props: {
    title: {
      type: String
    },
    component: {
      type: Function,
      required: true
    },
    data: {
      type: Object,
      required: false
    },
    callback: {
      type: Function,
      required: false
    },
    dismissCallback: {
      type: Function,
      required: false
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {},
  methods: {
    dismiss(res) {
      this.$emit('close')
      if (res === 'dismiss' && this.dismissCallback) {
        this.dismissCallback()
      }
    },
    cancel() {
      this.$modal.hide(this.popupName)
    }
  }
}
</script>

<style></style>
