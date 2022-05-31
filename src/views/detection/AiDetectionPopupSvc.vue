<template>
  <div class="modal-body">
    <div class="flex flex-wrap py-1 border-b-1 border-t-1">
      <div class="px-1 py-1"><b>양산라인</b> {{ data.item.ATTB_VL05 }}</div>
      <div class="px-1 py-1"><b>제품모델</b> {{ data.item.ATTB_VL07 }}</div>
      <div class="px-1 py-1"><b>검사항목</b> {{ data.item.ATTB_VL10 }}</div>
    </div>
    <div class="flex flex-wrap py-1 border-b-1 ">
      <div class="px-1 py-1">
        <b>부품 일련번호</b> {{ data.item.ATTB_VL09 }}
      </div>
      <div class="px-1 py-1"><b>검사시간</b> {{ data.item.ATTB_VL02 }}</div>
    </div>
    <div class="py-1">
      <div class="flex">
        <div class="flex-1">
          <div class="text-center py-1">
            {{ data.item.ATTB_VL10 }} 전면 <b>{{ data.item.ATTB_VL11 }}</b>
          </div>
          <div class="py-1">
            <img :src="data.item.ATTB_VL14" />
          </div>
        </div>
        <div class="flex-1">
          <div class="text-center py-1">
            {{ data.item.ATTB_VL10 }} 후면 <b>{{ data.item.ATTB_VL11 }}</b>
          </div>
          <div class="py-1">
            <img :src="data.item.ATTB_VL16" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { requestApi } from '@/api/ccp/requestApi'

export default {
  name: 'AiDetectionPopupSvc',
  components: {},
  props: {
    data: {
      type: Object,
      required: true
    },
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
      xMid: 'P00010',
      frontImage: null
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.setImages()
  },
  methods: {
    setImages() {
      this.getImage('D:/file/bg05.png').then(url => {
        this.frontImage = url
      })
    },
    getImage(filePath) {
      return new Promise((resolve, reject) => {
        requestApi({
          url: '/online/file/download/image',
          headers: {
            'X-MID': this.xMid
          },
          method: 'post',
          data: { file: filePath },
          callback: data => {
            let blob = new Blob([data], { type: 'image/png' })
            let fileReader = new FileReader()
            fileReader.onload = function(e) {
              const img = new Image()
              img.onload = function() {
                console.log(this.width, this.height)
              }
              img.onerror = function(e) {
                console.error(e)
              }
              img.src = this.result
            }
            fileReader.readAsDataURL(blob)
          }
        })
      })
    }
  }
}
</script>

<style></style>
