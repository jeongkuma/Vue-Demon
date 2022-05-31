<template>
  <div class="dialog-inner" :class="theme">
    <div class="dialog-content">
      <div class="confirm-txts" v-html="messageText"></div>
    </div>
    <div class="dialog-footer">
      <button
        v-for="(button, index) in buttons"
        :key="`button-${index}`"
        class="dialog-button"
        :class="[button.class]"
        @click="handleClick(button)"
      >
        {{ button.title }}
      </button>
    </div>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'

import { getTheme } from '@/utils/theme'
import { getCustId, getUserId } from '@/utils/cookie'

export default {
  name: 'ConfirmPopup',
  props: {
    text: {
      type: String,
      required: true
    },
    buttons: {
      type: Array,
      required: false,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      popupName: 'ConfirmPopup',
      width: '400px',
      height: '200px',
      theme: '',
      messageText: ''
    }
  },
  computed: {},
  watch: {},
  created() {
    this.theme = getTheme(getCustId(), getUserId())
    this.messageText = this.text

    eventBus.$on('setAnomaliesMessage', message => {
      this.messageText = message
    })
  },
  mounted() {},
  methods: {
    handleClick(button) {
      if (button.class) {
        button.handler()
      }

      document.body.classList.remove('not-scroll')
      this.$emit('close')
    }
  }
}
</script>

<style lang="less"></style>
