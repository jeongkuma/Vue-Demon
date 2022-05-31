<template>
  <div class="_olmap-wrap" style="width:100%; height: 100%;">
    <div
      ref="map"
      id="map"
      class="_olmap-map"
      style="width:100%; height: 100%;"
      :style="`background: ${backgroundColor}`"
    >
      <div id="popup"></div>
    </div>
    <div class="map-control">
      <ul>
        <li class="levelp">
          <button type="button" @click="zoomIn()" title="확대">
            <span></span>
          </button>
        </li>
        <li class="level_2" :class="{ on: zoomLevel === 2 }">
          <button type="button" @click="setZoomLevel(2)" title="1레벨">
            <span>2{{ $t('level') }}</span>
          </button>
        </li>
        <li class="level_1" :class="{ on: zoomLevel === 1 }">
          <button type="button" @click="setZoomLevel(1)" title="2레벨">
            <span>1{{ $t('level') }}</span>
          </button>
        </li>
        <li class="level_0" :class="{ on: zoomLevel === 0 }">
          <button type="button" @click="setZoomLevel(0)" title="3레벨">
            <span>0{{ $t('level') }}</span>
          </button>
        </li>
        <li class="levelm">
          <button type="button" @click="zoomOut()" title="축소">
            <span></span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Map from 'ol/Map'
import OlView from 'ol/View'
import * as proj from 'ol/proj'
import OlFeature from 'ol/Feature'
import OlGeomPoint from 'ol/geom/Point'
import {
  defaults as defaultInteractions
} from 'ol/interaction'
import { Vector as OlLayerVector, Image as OlImageLayer } from 'ol/layer'
import {
  ImageStatic as OlImageStatic,
  Vector as OlSourceVector,
  Cluster as OlSourceCluster
} from 'ol/source'

import {
  getStyle,
  Drag
} from './olMapUtil.js'

export default {
  name: 'OlMap',
  props: {
    backgroundColor: {
      type: String,
      default: '#3f3a4f'
    },
    background: {
      type: Object
    },
    items: {
      type: Array,
      default() {
        return []
      }
    },
    useClick: {
      type: Boolean,
      default: false
    },
    useDrag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      map: null,
      features: null,
      vectorLayers: [],
      backgroundLayer: null,
      canvas: {
        width: 0,
        height: 0
      },
      zoomLevel: 1
    }
  },
  watch: {
    items: {
      handler() {
        this.drawFeatures()
      }
    },
    background: {
      handler(newVal, oldVal) {
        if (newVal.url === oldVal.url) {
          return
        }
        this.drawBackground()
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await this.initMap()
      this.drawFeatures()
      // events
      this.map
        .getView()
        .on('change:resolution', this.handleChangeResolution, this)
      if (this.useClick) {
        this.map.on('click', this.handleClick)
        this.map.on('pointermove', this.handlePointerMove)
      }
    },
    initMap() {
      this.canvas.width = this.$refs.map.offsetWidth
      this.canvas.height = this.$refs.map.offsetHeight

      this.projection = new proj.Projection({
        code: 'xkcd-image',
        units: 'pixels',
        extent: [0, 0, this.canvas.width, this.canvas.height]
      })

      let layers = []
      if (this.background && this.background.url) {
        layers.push(this.getBackgroundLayer())
      }
      let interactions = null
      if (this.useDrag) {
        let drag = new Drag()
        drag.setHandleUpCallback(this.handleUpCallback)
        interactions = defaultInteractions().extend([drag])
      }
      this.map = new Map({
        id: 'baseMap',
        target: document.getElementById('map'),
        layers: layers,
        interactions: interactions,
        view: new OlView({
          projection: this.projection,
          center: [this.canvas.width / 2, this.canvas.height / 2],
          zoom: 1,
          minResolution: 0.5,
          maxResolution: 2.0
        })
      })
    },
    // 배경이미지 설정
    getBackgroundLayer() {
      let width = this.canvas.width
      let height = this.canvas.height

      if (
        this.background &&
        this.background.width &&
        this.background.width > 0
      ) {
        width = this.background.width
      }

      if (
        this.background &&
        this.background.height &&
        this.background.height > 0
      ) {
        height = this.background.height
      }

      let backgroudLayer = new OlImageLayer({
        id: 'background',
        source: new OlImageStatic({
          url: this.background.url,
          projection: this.projection,
          imageSize: [width, height],
          imageExtent: [
            (width / 2) * -1,
            (height / 2) * -1,
            width / 2,
            height / 2
          ]
        }),
        zIndex: 1
      })
      return backgroudLayer
    },
    drawBackground() {
      if (this.backgroundLayer) {
        this.map.removeLayer(this.backgroundLayer)
        this.backgroundLayer = null
      }

      if (this.background.url) {
        this.backgroundLayer = this.getBackgroundLayer()
        this.map.addLayer(this.backgroundLayer)
        this.map.updateSize()
        this.map.getView().setCenter([0, 0])
      }
    },
    // feature layers
    drawFeatures() {
      this.clearAllVectorLayer()

      if (this.items.length === 0) {
        return
      }

      let features = this.makeFeatures()
      let vectorSource = new OlSourceVector({
        features: features
      })
      let sourceCluster = new OlSourceCluster({
        source: vectorSource
      })

      // add vectorlayer
      let vectorLayer = new OlLayerVector({
        id: 'vectorLayer',
        zIndex: 2
      })

      vectorLayer.setSource(sourceCluster)
      vectorLayer.setStyle(this.getSourceClusterStyle)

      this.map.addLayer(vectorLayer)
      this.vectorLayers.push(vectorLayer)
      this.features = features

      this.map.getView().setCenter([0, 0])
    },
    makeFeatures() {
      let features = []
      this.items.forEach(item => {
        let feature = new OlFeature({
          geometry: new OlGeomPoint(item.coordinates),
          id: features.length + 1,
          image: item.images,
          text: item.texts,
          info: item.info
        })
        features.push(feature)
      })
      return features
    },
    getSourceClusterStyle(features) {
      return getStyle(features, this.map.getView().getZoom())
    },
    clearAllVectorLayer() {
      this.vectorLayers.forEach(vectorLayer => {
        this.map.removeLayer(vectorLayer)
      })
    },
    // -------------------- 확대 / 축소
    zoomIn() {
      if (
        this.map.getView().getResolution() !==
        this.map.getView().getMinResolution()
      ) {
        this.setZoomLevel(this.map.getView().getZoom() + 1)
      }
    },
    zoomOut() {
      if (
        this.map.getView().getResolution() !==
        this.map.getView().getMaxResolution()
      ) {
        this.setZoomLevel(this.map.getView().getZoom() - 1)
      }
    },
    setZoomLevel(lv) {
      this.map.getView().setZoom(lv)
      this.handleChangeResolution()
    },
    // -------------------- 이벤트
    handleUpCallback({ feature, feature_ }) {
      let id = feature.get('features')[0].get('id')
      let featureItem = this.features.find(f => f.values_.id === id)
      let coordinates = feature_.getGeometry().getCoordinates()
      if (featureItem.getGeometry()) {
        featureItem.getGeometry().setCoordinates(coordinates)
        this.$emit('dragEnd', feature.get('features')[0].get('info'), coordinates)
      }
    },
    handleClick(event) {
      let feature = this.map.forEachFeatureAtPixel(event.pixel, function(f) {
        return f
      })
      if (!feature) {
        return
      }

      let featureInfo = feature.get('features')[0].get('info')
      this.$emit('onClick', featureInfo)
    },
    handlePointerMove(event) {
      let feature = this.map.forEachFeatureAtPixel(event.pixel, function(f) {
        return f
      })
      this.map.getTargetElement().style.cursor = feature ? 'pointer' : ''
    },
    handleChangeResolution() {
      let lv = Math.floor(this.map.getView().getZoom())
      if (lv < 0) {
        lv = 0
      } else if (lv > 2) {
        lv = 2
      }
      this.zoomLevel = lv
    }
  }
}
</script>

<style>
._olmap-wrap {
  position: relative;
}
.ol-overlaycontainer-stopevent {
  display: none !important;
}
</style>
