<template>
  <div class="input-file">
    <div ref="inputArea"></div>
    <button class="file-label" type="button">파일 추가</button>
  </div>
</template>

<script>

export default {
  name: 'MultiFileSelect',
  components: {},
  props: {
    fileList: null,
    maxSize: { // MegaByte
      type: Number,
      required: false,
      default: 0 // unlimited
    },
    defaultListCount: {
      type: Number,
      required: false,
      default: 1
    }
  },
  data() {
    return {
      newFormFile:
        '<div class="form-file">' +
          '<span><input type="file" class="form-control" placeholder=""></span>' +
          '<span><a href="#" class="btn ico-delete remove-field">삭제</a></span>' +
        '</div>',
      maxSizeMb: this.maxSize * 1024 * 1024
    }
  },
  watch: {
    fileList: function (newValue) {
      if (!newValue) {
        this.$refs.inputArea.innerHTML = ''
      }
    }
  },
  created () {},
  mounted () {
    let context = this
    let maxFields = 10
    let wrapper = $('.input-file')
    let addButton = $('.file-label')
    let x = 0
    $(addButton).click(function(e) {
      e.preventDefault()
      if (x < maxFields) {
        x++
        $(context.$refs.inputArea).append(context.newFormFile)
      } else {
        this.alert(context.$t('max-file'))
      }
    })

    $(wrapper)
      .on('click', '.remove-field', function() {
        $(this).parents('.form-file').remove()
        x--
      })
      .on('change', '.form-control', function(e) {
        // 지정한 사이즈보다 큰경우 파일선택을 취소하고 사용자에게 알려준다.
        if (context.maxSizeMb && this.files.length && context.maxSizeMb < this.files[0].size) {
          $(this).parents('.form-file').remove()
          $(context.$refs.inputArea).append(context.newFormFile)

          this.alert(context.$t('max-size').replace('$0', context.maxSizeMb / (1024 * 1024)), 'warning')
        }
        context.$emit('update:fileList',
          $(context.$refs.inputArea)
            .children('div')
            .children('span')
            .children('input')
            .toArray()
            .filter((fileObj) => {
              return fileObj.files.length > 0
            }))
      })

    // 파일선택 요소 defaultListCount 갯수만큼 미리 생성
    for (let i = 0; i < this.defaultListCount; i++) {
      $(addButton).click()
    }
  },
  computed: {},
  methods: {
  }
}
</script>

<style lang="less" scoped>
</style>
