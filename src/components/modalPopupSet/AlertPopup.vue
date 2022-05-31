<template>
  <div class="dialog-inner" :class="type + '-inner'">
    <div v-if="type !== ''" class="dialog-header" :class="type + '-header'">
      <div class="dialog-header-content">
        {{ modalTitle }}
        <button type="button" class="close" @click="handleClick(buttons[0])">
          ×
        </button>
      </div>
    </div>
    <div class="dialog-content msg-txts" :class="'msg-' + type">
      <div class="msg-txts" :class="'msg-' + type" v-html="text"></div>
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
export default {
  name: 'AlertPopup',
  props: {
    text: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: false,
      default: ''
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
      popupName: 'AlertPopup',
      width: '400px',
      height: '200px'
    }
  },
  computed: {
    modalTitle() {
      return this.type === 'error'
        ? 'Error Message'
        : this.type === 'warning'
          ? 'Warning Message'
          : this.type === 'success'
            ? 'Success Message'
            : this.type === 'info'
              ? 'Info Message'
              : ''
    }
  },
  watch: {},
  created() {},
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
