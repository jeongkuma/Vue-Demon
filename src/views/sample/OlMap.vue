<template>
  <div>
    <div style="width: 100%; height: 500px;">
      <ol-map :items="items" :useClick="true" @onClick="handleClick"> </ol-map>
    </div>
    <div class="mt-1">
      <button class="btn btn-gray" @click="addItem">아이템 추가</button>
    </div>
  </div>
</template>

<script>
import OlMap from '@/components/olMap'

export default {
  name: 'OlMapSample',
  components: { OlMap },
  data() {
    return {
      background: {
        url: 'https://dummyimage.com/600x400/fff700/000000'
      },
      items: []
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.makeItemData()
  },
  methods: {
    makeItemData() {
      let images = []
      let texts = []

      images.push({
        url: '/assets/TB_A.png',
        w: 56,
        h: 56,
        x: 0,
        y: 0,
        align: 'left'
      })

      texts.push({
        value: 'test',
        x: 0,
        y: 60,
        color: '#ffffff',
        size: 32,
        align: 'left'
      })
      this.items.push({
        coordinates: [0, 0],
        images: images,
        texts: texts,
        info: { index: this.items.length }
      })
    },
    addItem() {
      let images = []
      let texts = []

      images.push({
        url: '/assets/TB_S.png',
        w: 56,
        h: 56,
        x: 0,
        y: 0,
        align: 'left'
      })

      texts.push({
        value: 'test',
        x: 0,
        y: 60,
        color: '#ffffff',
        size: 32,
        align: 'left'
      })
      this.items.push({
        coordinates: [-100, -100],
        images: images,
        texts: texts,
        info: { index: this.items.length }
      })
    },
    handleClick(info) {
      console.log(info)
    }
  }
}
</script>

<style>
.ol-overlaycontainer-stopevent {
  display: none;
}
</style>
