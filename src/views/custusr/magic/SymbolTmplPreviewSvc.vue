<template>
  <div>
    <div class="modal-body flex flex-wrap" style="height: 370px">
      <div class="md-width-100 width-30 form-box">
        <textarea v-model="sampleData" style="height: 100%"></textarea>
      </div>
      <div class="md-width-100 width-70 pl-2 md-p-0 md-p-2">
        <ol-map :items="items"></ol-map>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button type="button" class="btn btn-gray" @click="close">
          {{ $t('cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import OlMap from '@/components/olMap'
import { getFeature } from '@/components/olMap/serviceUtil'

export default {
  name: 'SymbolTmplPreviewSvc',
  components: { OlMap },
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
      attbList: [],
      sampleData: '{}',
      items: []
    }
  },
  computed: {
    sampleDataJson() {
      let json = {}
      try {
        json = JSON.parse(this.sampleData)
      } catch (e) {}
      return json
    },
    fileCount() {
      return this.attbList.filter(a => a.file && a.file.file).length
    }
  },
  watch: {
    sampleDataJson() {
      this.fnGetPreviewData()
    }
  },
  created() {},
  mounted() {
    this.attbList = JSON.parse(JSON.stringify(this.data.tmplData.attbList))
    this.fnInit()
  },
  methods: {
    async fnInit() {
      await this.fnReplaceFile()
      this.fnGetPreviewData()
    },
    // 업로드한 파일을 미리보기 하기위해서 file을 읽어서 dataURL로 변환한다.
    fnReplaceFile() {
      return new Promise(resolve => {
        if (this.attbList.filter(attb => attb.file).length === 0) {
          resolve()
        }

        let readFileCount = 0
        for (let i = 0; i < this.attbList.length; i++) {
          let attb = this.attbList[i]
          if (
            this.data.tmplData.attbList[i].file &&
            this.data.tmplData.attbList[i].file.file
          ) {
            let fileReader = new FileReader()
            fileReader.onload = e => {
              attb.itemVal = e.target.result

              // 신규 파일 개수 만큼 다 읽으면 다음을 실행하기 한다
              readFileCount++
              if (readFileCount === this.fileCount) {
                resolve()
              }
            }
            fileReader.readAsDataURL(this.data.tmplData.attbList[i].file.file)
          }
        }
      })
    },
    fnGetPreviewData() {
      let items = []
      items.push(getFeature(this.attbList, this.sampleDataJson))
      this.items = items
    }
  }
}
</script>

<style></style>
