<template>
  <div>
    <div class="map-wrap" style="width:100%; height:100%;min-height:800px;">
      <!-- left menu -->
      <div class="side-menu-wrap">
        <a href="#" class="side-open"><span class="glyphicon glyphicon-menu-right"></span><span class="haze">{{$t('menu')}} {{$t('open-close')}}</span></a>
        <div class="side-menu">
          <div class="side-menu-body">
            <div class="nav-tabs-navigation">
              <div class="nav-tabs-wrapper">
                <ul id="tabs" class="nav nav-tabs" role="tablist">
                  <li class="nav-item active"><a class="nav-link active show" data-toggle="tab" href="#tab1" role="tab" aria-expanded="true" aria-selected="true">{{$t('equipment-search')}}</a></li>
                  <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#tab2" role="tab" aria-expanded="false" aria-selected="false">{{$t('name-search')}}</a></li>
                  <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#tab3" role="tab" aria-expanded="false" aria-selected="false">{{$t('address-search')}}</a></li>
                </ul>
              </div>
            </div>
            <div class="tab-content" >
              <div class="tab-pane active show" id="tab1" role="tabpanel" aria-expanded="true">
                <div class="form-inline date-half">
                  <select v-model="searchEquipment" class="form-control" style="margin-right:5px;">
                    <option value="Uname">{{$t('pin-nm')}}</option>
                    <option value="ctn">{{$t('pin')}}</option>
<!--                    <option value="svcCdNm">{{$t('svc_nm')}}</option>-->
                  </select>
                  <div class="input-group">
                    <input type="text" v-model="searchString" class="form-control" placeholder="" :title="$t('search-input')" style="width:65%;max-width:157px;" @keyup.enter="searchEquList(true)">
                    <button class="btn btn-info input-group-addon" type="button" @click="searchEquList(true)">{{$t('search')}}</button>
                  </div>
                </div>
                <div class="grid-container wide grid-scroll full-size table-fixed-header-wrap">
                    <div class="fixed-header-bg"></div>
                    <div class="table-wrap">
                      <table class="table table-col">
                      <caption>{{$t('equipment')}} {{$t('search')}} {{$t('search2')}}</caption>
                      <colgroup>
                        <col style="width:25%">
                        <col style="width:25%">
                        <col style="width:25%">
                        <col style="width:auto">
                      </colgroup>
                      <thead>
                        <tr>
                          <th scope="col"><div class="fixed-th" style="width:25%">{{$t('equipment-name')}}</div></th>
                          <th scope="col"><div class="fixed-th" style="width:25%">{{$t('dev-mdl-nm')}}</div></th>
                          <th scope="col"><div class="fixed-th" style="width:25%">{{$t('pin-nm')}}</div></th>
                          <th scope="col"><div class="fixed-th" style="width:25%">{{$t('pin')}}</div></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="list in equipmentList" :key="list.entrDevSeq" @click="fnSetCenter(list.instLat / 10000000, list.instLon / 10000000)" style="cursor:pointer;">
                          <td>{{list.devClsCdNm}}</td>
                          <td>{{list.devMdlNm}}</td>
                          <td>{{list.devUname}}</td>
                          <td>{{list.ctn}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="tab-pane" id="tab2" role="tabpanel" aria-expanded="false">
                <div class="form-inline wide mb-1">
                  <div class="input-group">
                    <input type="text" v-model="searchName" class="form-control" :placeholder="$t('location-name-search')" :title="$t('search-input')" @keyup.enter="fnGetNameList()">
                    <button class="btn btn-info input-group-addon" type="button" @click="fnGetNameList()">{{$t('search')}}</button>
                  </div>
                </div>
                <div class="grid-container wide grid-scroll full-size table-fixed-header-wrap pt-0">
                  <div class="table-wrap">
                    <table class="table table-col text-left">
                      <caption>{{$t('name2')}} {{$t('search')}} {{$t('search2')}}</caption>
                      <tbody>
                        <tr v-for="list in nameList.poi" :key="list.poiid">
                          <td><a href="javascript://" @click="fnSetCenter(list.dpy, list.dpx)">{{list.name1}}</a></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="tab-pane" id="tab3" role="tabpanel" aria-expanded="false">
                <div class="form-inline date-half">
                  <span class="mx-0 pr-1">{{$t('area-select')}}</span>
                  <select v-model="selectSido" class="form-control" title="시/도" @change="fnGetSiGunGuList()" style="width:34%">
                    <option value="">{{$t('address-sido')}}</option>
                    <option v-for="list in sidoList.adm" :key="list.admcode" :value="list.admcode">{{list.admname}}</option>
                  </select>
                  <select v-model="selectSiGunGu" id="sigungu" class="form-control" @change="fnGetDongList()" style="width:33%">
                    <option value="">{{$t('address-sigungu')}}</option>
                    <option v-for="list in siGunGuList.adm" :key="list.admcode" :value="list.admcode">{{list.admname}}</option>
                  </select>
                  <select v-model="selectDong" id="dong" class="form-control" style="width:30%">
                    <option value="">{{$t('address-dong')}}</option>
                    <option v-for="list in dongList.adm" :key="list.admcode" :value="list.admcode">{{list.admname}}</option>
                  </select>
                </div>
                <div class="form-inline overflow mb-1">
                  <select v-model="addressKind" id="addressKind" class="form-control" style="width:25%;float: left;" @change="fnSetSearchBunjiWidth()">
                    <option value="new">{{$t('address-new')}}</option>
                    <option value="old">{{$t('address-old')}}</option>
                  </select>
                  <div class="input-group" style="width: 73%;float: right;">
                    <input id="searchAddr" v-if="addressKind === 'new'" type="text" v-model="searchAddr" class="form-control" :placeholder="$t('input-roadname')" title="도로명 입력" @keyup.enter="fnGetAddressList()" style="width:42%;margin-right:3px;">
                    <input id="searchBunji" type="text" v-model="searchBunji" class="form-control" :placeholder="$t('input-bunji')" title="번지 입력" @keyup.enter="fnGetAddressList()" style="width:25%;border-radius: 4px;">
                    <button class="btn btn-info input-group-addon" type="button" @click="fnGetAddressList()">{{$t('search')}}</button>
                  </div>
                </div>
                <div class="grid-container wide grid-scroll full-size table-fixed-header-wrap pt-0">
                  <div class="table-wrap">
                    <table class="table table-col text-left">
                      <caption>{{$t('name2')}} {{$t('search')}} {{$t('search2')}}</caption>
                      <tbody>
                        <tr v-for="list in addressList.adm" :key="list.admcode + list.jibun">
                          <td>
                            <a href="javascript://" @click="fnSetCenter(list.posy, list.posx)">
                              {{list.address}} {{list.jibun}}
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- left menu -->
      <div class="map-area">
        <div id="inaviMap" class ="map" style="z-index:0;min-height:800px;">
        </div>
        <div id="map" class="map" style="z-index:1;min-height:800px;">
          <div id="popup"></div>
        </div>
        <!--  map-util -->
        <div class="option-wrap">
          <a href="#" class="option-open"><span class="glyphicon glyphicon-menu-left"></span><span class="haze">메뉴 열고 닫기</span></a>
          <ul class="map-util">
            <li class="time">Now : <span class="nowdate">{{ nowDate }}</span></li>
            <li class="time">Updated : <span class="lastmdate">{{ lastUpdateDate }}</span></li>
            <li class="reload on form-check">
              <label class="form-check-label" for="mreload">
                <input class="form-check-input" type="checkbox" id="mreload" @click="timeChange()">
                <span class="form-check-sign"></span>
              </label>
              <select id="treload" title="자동갱신시간" class="number" @change="timeChange();" v-model="reloadTime">
                <option value="60">1{{$t('minute')}}</option>
                <option value="180">3{{$t('minute')}}</option>
                <option value="300">5{{$t('minute')}}</option>
                <option value="600">10{{$t('minute')}}</option>
                <option value="1200">20{{$t('minute')}}</option>
                <option value="1800">30{{$t('minute')}}</option>
              </select>
              <span class="btns"><a href="javascript:;" id="satelite_map" class="satelite_map active" @click="sateliteMap()"><span>{{$t('map-normal')}}</span></a></span>
              <span class="btns"><a href="javascript:;" id="satelite_sat" class="satelite_sat" @click="sateliteSat()"><span>{{$t('satelite')}}</span></a></span>
              <span class="btns"><a href="javascript:;" id="reload" class="icon" @click="fnReloadMap()"><span>{{$t('reload')}}</span></a></span>
            </li>
          </ul>
        </div>
        <!--  // map-util -->

        <!--  map-control -->
        <div class="map-control">
          <!-- 활성화 class [ on ] -->
          <ul>
            <li class="levelp"><button type="button" @click="zoomIn()" title="확대"><span></span></button></li>
            <li class="level_18"><button type="button" @click="setZoomLevel(18)" title="18레벨"><span>18{{$t('level')}}</span></button><span class="cmdtip lvl1">{{$t('distance')}}</span></li>
            <li class="level_17"><button type="button" @click="setZoomLevel(17)" title="17레벨"><span>17{{$t('level')}}</span></button></li>
            <li class="level_16"><button type="button" @click="setZoomLevel(16)" title="16레벨"><span>16{{$t('level')}}</span></button><span class="cmdtip lvl2">{{$t('address-dong')}}</span></li>
            <li class="level_15"><button type="button" @click="setZoomLevel(15)" title="15레벨"><span>15{{$t('level')}}</span></button></li>
            <li class="level_14"><button type="button" @click="setZoomLevel(14)" title="14레벨"><span>14{{$t('level')}}</span></button></li>
            <li class="level_13"><button type="button" @click="setZoomLevel(13)" title="13레벨"><span>13{{$t('level')}}</span></button></li>
            <li class="level_12"><button type="button" @click="setZoomLevel(12)" title="12레벨"><span>12{{$t('level')}}</span></button><span class="cmdtip lvl3">{{$t('address-sigungu')}}</span></li>
            <li class="level_11"><button type="button" @click="setZoomLevel(11)" title="11레벨"><span>11{{$t('level')}}</span></button></li>
            <li class="level_10"><button type="button" @click="setZoomLevel(10)" title="10레벨"><span>10{{$t('level')}}</span></button><span class="cmdtip lvl4">{{$t('address-sido')}}</span></li>
            <li class="level_9"><button type="button" @click="setZoomLevel(9)" title="9레벨"><span>9{{$t('level')}}</span></button></li>
            <li class="level_8 on"><button type="button" @click="setZoomLevel(8)" title="8레벨"><span>8{{$t('level')}}</span></button></li>
            <!-- <li class="level_7"><button type="button" @click="setZoomLevel(7)" title="7레벨"><span>7{{$t('level')}}</span></button><span class="cmdtip lvl5">{{$t('all-country')}}</span></li> -->
            <li class="levelm"><button type="button" @click="zoomOut()" title="축소"><span></span></button></li>
          </ul>
        </div>
        <!--  map-control -->

        <!-- right menu -->
        <div class="right-wrap">
          <a href="#" class="right-open"><span class="glyphicon glyphicon-menu-left"></span><span class="haze">{{$t('menu')}} {{$t('open-close')}}</span></a>
          <div class="right-menu">
            <span class="tit">{{$t('attribute')}}</span>
            <ul class="rigth-menu-inner">
              <li v-for="list in equipmentProperty" :key="list.devClsCd">
                <div class="form-check" :title="list.devClsCdNm + '(' + list.cntTotal + ')'" :alt="list.devClsCdNm + '(' + list.cntTotal + ')'">
                  <label class="form-check-label" :for="list.devClsCd + '_all'">
                    <input class="form-check-input 1depth" type="checkbox" :id="list.devClsCd + '_all'" checked="checked" @click="fnOneDepthClick">{{list.devClsCdNm}}({{list.cntTotal}})
                    <span class="form-check-sign"></span>
                  </label>
                </div>
                <ul>
                  <li>
                    <div class="form-check">
                      <label class="form-check-label" :for="list.devClsCd + '_true'">
                        <input class="form-check-input 2depth" type="checkbox" :id="list.devClsCd + '_true'" checked="checked" @click="fnTwoDepthClick">{{$t('normal')}}({{list.cntTrue}})
                        <span class="form-check-sign"></span>
                      </label>
                    </div>
                  </li>
                  <li>
                    <div class="form-check">
                      <label class="form-check-label" :for="list.devClsCd + '_false'">
                        <input class="form-check-input 2depth" type="checkbox" :id="list.devClsCd + '_false'" checked="checked" @click="fnTwoDepthClick">{{$t('abnormal')}}({{list.cntFalse}})
                        <span class="form-check-sign"></span>
                      </label>
                    </div>
                  </li>
                  <li>
                    <div class="form-check">
                      <label class="form-check-label" :for="list.devClsCd + '_stop'">
                        <input class="form-check-input 2depth" type="checkbox" :id="list.devClsCd + '_stop'" checked="checked" @click="fnTwoDepthClick">{{$t('stop')}}({{list.cntStop ? list.cntStop : '0'}})
                        <span class="form-check-sign"></span>
                      </label>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <!-- right menu -->
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import OlMap from 'ol/Map'
import OlView from 'ol/View'
import OlOverlay from 'ol/Overlay'
import { Vector as OlLayerVector } from 'ol/layer'
import { Vector as OlSourceVector, Cluster as OlSourceCluster } from 'ol/source'
import { Style as OlStyleStyle, Fill as OlStyleFill, Icon as OlStyleIcon, Text as OlStyleText, Stroke as OlStyleStroke } from 'ol/style'
import OlGeomPoint from 'ol/geom/Point'
import OlFeature from 'ol/Feature'
import * as proj from 'ol/proj'
import * as interaction from 'ol/interaction'
import moment from 'moment'
import MapInfraMap from 'mapInfraMap'
import MapInfraPoint from 'mapInfraPoint'
import requestApi from '@/api/ccp/requestApi'
import envs from '@/envs'

export default {
  name: 'LocationSvc',
  components: {
  },
  props: {
  },
  data () {
    return {
      map: {},
      mapView: {},
      inaviMap: {},
      nowDate: '00:00:00',
      lastUpdateDate: '00:00:00',
      intervalDate: null,
      intervalTimeId: null,
      reloadTime: 60,
      searchEquipment: 'Uname',
      searchString: '',
      searchAddr: '',
      searchBunji: '',
      searchName: '',
      selectSido: '',
      selectSiGunGu: '',
      selectDong: '',
      sidoList: [],
      siGunGuList: [],
      dongList: [],
      addressKind: 'new',
      equipmentList: [],
      equipmentListTemp: [],
      equipmentProperty: [],
      nameList: [],
      addressList: [],
      clusters: {},
      features: [],
      freaturesOri: [],
      styleCache: {},
      source: null,
      apiHeaders: {
        'Content-Type': 'application/json;charset=UTF-8',
        'apiType': '01',
        'apiVersion': '1.0.0',
        'carrierType': '01',
        'clientIp': '192.168.0.1',
        'devInfo': '03',
        'nwInfo': '02',
        'speed': '25',
        'validYn': 'Y',
        'osInfo': '',
        'devModel': '',
        'telNo': '',
        'xCoord': '',
        'yCoord': '',
        'gpsTime': ''
      },
      WGS84: 'EPSG:4326',
      MERCATOR: 'EPSG:3857',
      popupOverlay: null,
      featureListHTML: '',
      featureDetailHTML: ''
    }
  },
  created () {},
  mounted () {
    eventBus.$emit('usePageInfo', false)

    this.updateNowDate(1000)
    this.lastUpdateDate = moment().format('HH:mm:ss').toString()

    this.clusters = new OlLayerVector({ id: 'clusters' })

    // 아이나비 지도 생성
    this.inaviMap = new MapInfraMap('inaviMap', {
      center: new MapInfraPoint(envs.gLat, envs.gLon),
      zoom: envs.gZoomLevel - 5,
      mapTypeId: 0,
      minLevel: 2,
      maxLevel: 13
    })
    this.inaviMap.setMinLevel(2)

    this.mapView = new OlView({
      center: proj.transform([envs.gLon, envs.gLat], this.WGS84, this.MERCATOR),
      maxZoom: 18,
      minZoom: 8,
      zoom: envs.gZoomLevel
    })

    this.map = new OlMap({
      target: document.getElementById('map'),
      layers: [],
      view: this.mapView,
      interactions: interaction.defaults({
        dragPan: false,
        mouseWheelZoom: false
      }).extend([
        new interaction.DragPan({ kinetic: false }),
        new interaction.MouseWheelZoom({ duration: 0 })
      ])
    })

    // 지도 가운데 변경 이벤트 핸들러
    this.map.getView().on('change:center', this.centerChangeHandler, this)
    // 지도 축척 변경 이벤트 핸들러
    this.map.getView().on('change:resolution', this.levelChangeHandler, this)

    $('.side-open').bind('click', function () {
      $('.side-menu-wrap').toggleClass('active')
    })
    $('.right-open').bind('click', function () {
      $('.right-wrap').toggleClass('active')
    })
    $('.option-open').bind('click', function () {
      $('.option-wrap').toggleClass('active')
    })

    // 불필요 버튼 삭제
    $('.ol-zoom.ol-unselectable.ol-control').remove()

    // 시도목록 조회
    this.fnGetSidoList()

    // 장비목록 검색
    this.searchEquList(false)

    this.popupOverlay = new OlOverlay({
      element: document.getElementById('popup'),
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -30]
    })
    this.map.addOverlay(this.popupOverlay)

    // 지도 아이콘 클릭 이벤트
    this.map.on('click', this.clickEventHandler)

    // change mouse cursor when over marker
    this.map.on('pointermove', this.pointerMoveEventHandler)
  },
  beforeDestroy () {
    eventBus.$emit('usePageInfo', true)
    clearInterval(this.intervalDate)
    clearInterval(this.intervalTimeId)
    this.inaviMap.detach('zoomend')
  },
  computed: {
    featureCtnDetail(data) {
      return {
        template: '',
        data() {

        }
      }
    }
  },
  methods: {
    fnOneDepthClick(e) {
      let obj = $(e.target).parent().parent().parent()
      if ($(e.target).is(':checked')) {
        $(obj).find('input.2depth').prop('checked', true)
      } else {
        $(obj).find('input.2depth').prop('checked', false)
      }
      this.fnCheckOverlay(false)
    },
    fnTwoDepthClick(e) {
      let obj = $(e.target).parent().parent().parent().parent().parent()
      if ($(obj).find('input.2depth:checked').length === $(obj).find('input.2depth').length) {
        $(obj).find('input.1depth').prop('checked', true)
      } else {
        $(obj).find('input.1depth').prop('checked', false)
      }
      this.fnCheckOverlay(false)
    },
    fnCheckOverlay(firstFlag) {
      let element = document.getElementById('popup')
      $(element).popover('destroy')

      this.features = this.featuresOri

      $('input.2depth:not(:checked)').each((index, item) => {
        let id = $(item).attr('id')

        this.features = $.grep(this.features, (feature) => {
          return feature.get('featureCd') !== id
        })
      })

      if (firstFlag) {
        this.fnDrawFeatures(false)
        setTimeout(() => {
          $('input.2depth:not(:checked)').each((index, item) => {
            let id = $(item).attr('id')
            this.features = $.grep(this.features, (feature) => {
              return feature.get('featureCd') !== id
            })
          })
          this.fnDrawFeatures(true)
        }, 100)
      } else {
        this.fnDrawFeatures(true)
      }
    },
    clickEventHandler(evt) {
      let element = document.getElementById('popup')
      let feature = this.map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        return feature
      })

      // 장비속성 정보 조회
      // 마커 정보가 있고 지도 확대가 16이상 경우(장비 마커가 보이는 지도 Zoom Level)
      if (feature) {
        let size = feature.get('features').length
        let coordinates = feature.getGeometry().getCoordinates()
        this.popupOverlay.setPosition(coordinates)

        if (size > 1 && this.getZoomLevel() >= 16) {
          this.fnGetMultiDevieList(feature, element)
        } else if (size === 1) {
          let id = feature.get('features')[0].get('id')
          let name = feature.get('features')[0].get('name')
          this.fnGetDeviceAttribute(id, name, element, false)
        } else {
          $(element).popover('destroy')
        }
      }
    },
    // 중복 장비 목록 조회
    fnGetMultiDevieList(feature, element) {
      let context = this
      let contents = ' <div class="table-wrap" style="float:left;width:150px;margin-top:30px;overflow-y:auto;max-height:300px;">' +
        '    <table class="table table-col">' +
        '    <colgroup>' +
        '      <col style="width:100px">' +
        '    </colgroup>' +
        '    <thead>' +
        '    <tr>' +
        '      <th scope="col">' + this.$t('pin-nm') + '</th>' +
        '    </tr>' +
        '    </thead>' +
        '    <tbody>'

      feature.get('features').forEach((data) => {
        contents += '    <tr style="cursor:pointer;">' +
          '      <td id="' + data.get('id') + '" name="' + data.get('name') + '">' + data.get('name') + '</td>' +
          '    </tr>'
      })

      contents += '    </tbody>' +
        '    </table>' +
        '  </div>'

      this.featureListHTML = contents

      $(element).popover('destroy')
      $(element).popover({
        'placement': 'top',
        'animation': false,
        'html': true,
        'content': this.featureListHTML
      })
      $(element).popover('show')
      this.touchScroll()

      // click 이벤트 적용
      $('.table-wrap table td[id]').on('click', function() {
        let id = $(this).attr('id')
        let name = $(this).attr('name')
        $(this).css('')
        context.fnGetDeviceAttribute(id, name, element, true)
      })
    },
    // 장비속성 조회
    fnGetDeviceAttribute(id, name, element, bln) {
      $(element).popover('destroy')

      let context = this
      let paramObj = {}
      let entryDevSeq = id
      paramObj.entrDevSeq = entryDevSeq

      requestApi({
        url: '/online/iotseldevice/getDeviceAttb',
        headers: {
          'X-VNAME': 'ONLINE',
          'X-MID': 'P00002'
        },
        method: 'post',
        data: paramObj,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            let contents = '<div class="map-popover" style="float:right;width:360px;">' +
              '  <button type="button" class="close" data-dismiss="popover">×</button>' +
              '  <p class="tit">' + name + '</p>' +
              '  <div class="table-wrap" style="overflow-y:auto;max-height:300px;">' +
              '    <table class="table table-col">' +
              '    <caption>' + this.$t('equipment-attribute-search') + '</caption>' +
              '    <colgroup>' +
              '      <col style="width:50px">' +
              '      <col style="width:150px">' +
              '    </colgroup>' +
              '    <thead>' +
              '    <tr>' +
              '      <th scope="col">' + this.$t('equipment-attribute') + '</th>' +
              '      <th scope="col">' + this.$t('equipment-content') + '</th>' +
              '    </tr>' +
              '    </thead>' +
              '    <tbody>'
            // CTN/상태/장비유형/식별명/설치장소 는 기본 장비 목록 정보에서 가져와서 처리한다.
            let defaultContent = this.equipmentListTemp.filter(list => list.entrDevSeq === entryDevSeq)

            contents += '    <tr>' +
                '      <td>' + this.$t('pin') + '(' + this.$t('ctn') + ') </td>' +
                '      <td>' + defaultContent[0].ctn + '</td>' +
                '    </tr>' +
                '    <tr>' +
                '      <td>' + this.$t('equipment-status') + '</td>' +
                '      <td>' + this.fnGetStatusDesc(defaultContent[0].attbStatusCd) + '</td>' +
                '    </tr>' +
                '    <tr>' +
                '      <td>' + this.$t('equipment-name') + '</td>' +
                '      <td>' + defaultContent[0].devClsCdNm + '</td>' +
                '    </tr>' +
                '    <tr>' +
                '      <td>' + this.$t('pin-nm') + '</td>' +
                '      <td>' + defaultContent[0].devUname + '</td>' +
                '    </tr>' +
                '    <tr>' +
                '      <td>' + this.$t('inst-address') + '</td>' +
                '      <td>' + defaultContent[0].instAddr + '</td>' +
                '    </tr>'

            // if (res.data) {
            //   res.data = getDataObjOfList(res.data, 'dataObj')
            // }
            res.data.forEach((data) => {
              contents += '    <tr>' +
                '      <td>' + data.devAttbCdNm + '</td>'
              if (data.devVal === null || data.devVal === 'null') {
                contents += '      <td> </td>'
              } else {
                contents += '      <td>' + data.devVal + '</td>'
              }
              contents += '    </tr>'
            })

            contents += '    </tbody>' +
              '    </table>' +
              '  </div>' +
              '</div>'
            this.featureDetailHTML = contents

            $(element).popover({
              'placement': 'top',
              'animation': false,
              'html': true,
              'content': (bln) ? this.featureListHTML + this.featureDetailHTML : this.featureDetailHTML
            })
            $(element).popover('show')
            this.touchScroll()
            if (bln) {
              $('.popover').css('max-width', '580px')
              $('.popover-content').css('width', '550px')
              $(element).popover('show')
              this.touchScroll()
            } else {
              $('.popover').css('max-width', '400px')
              $('.popover-content').css('width', '380px')
              $(element).popover('show')
              this.touchScroll()
            }
            $('.table-wrap table td[id]').on('click', function() {
              let id = $(this).attr('id')
              let name = $(this).attr('name')
              context.fnGetDeviceAttribute(id, name, element, true)
            })
            $('div.map-popover button.close').on('click', function() {
              $(element).popover('destroy')
            })
          }
        }
      })
    },
    touchScroll(element) {
      if (this.isTouchDevice()) {
        // var el = document.getElementById(element)
        var scrollStartPos = 0

        document.getElementById(element).addEventListener('touchstart', function(event) {
          scrollStartPos = this.scrollTop + event.touches[0].pageY
          event.preventDefault()
        }, false)

        document.getElementById(element).addEventListener('touchmove', function(event) {
          this.scrollTop = scrollStartPos - event.touches[0].pageY
          event.preventDefault()
        }, false)
      }
    },
    isTouchDevice() {
      try {
        document.createEvent('TouchEvent')
        return true
      } catch (e) {
        return false
      }
    },
    fnGetStatusDesc(statusCd) {
      let tmp = ''

      if (statusCd === 'A') {
        tmp = this.$t('status-active')
      } else if (statusCd === 'W') {
        tmp = this.$t('status-warning')
      } else if (statusCd === 'S') {
        tmp = this.$t('status-stop')
      }

      return tmp
    },
    pointerMoveEventHandler(e) {
      if (e.dragging) {
        // let element = document.getElementById('popup')
        // $(element).popover('destroy')
        return
      }
      let pixel = this.map.getEventPixel(e.originalEvent)
      let hit = this.map.hasFeatureAtPixel(pixel)

      let feature = this.map.forEachFeatureAtPixel(e.pixel, function(feature) {
        return feature
      })
      let size = 0
      if (feature) {
        size = feature.get('features').length
      }

      this.map.getTarget().style.cursor = (hit && (this.getZoomLevel() >= 16 || size === 1)) ? 'pointer' : ''
    },
    updateNowDate (interval) {
      this.intervalDate = setInterval(() => {
        this.nowDate = moment().format('HH:mm:ss').toString()
      }, interval)
    },
    // 지도 확대
    zoomIn() {
      if (!this.isMaxLevel()) {
        this.setZoomLevel(this.getZoomLevel() + 1)
      }
      return this.getZoomLevel()
    },
    // 지도 축소
    zoomOut() {
      if (!this.isMinLevel()) {
        this.setZoomLevel(this.getZoomLevel() - 1)
      }
      return this.getZoomLevel()
    },
    // 현재 지도 레벨 확인
    getZoomLevel() {
      return this.map.getView().getZoom()
    },
    // 지도 레벨 변경
    setZoomLevel(lv) {
      this.map.getView().setZoom(lv)
      this.inaviMap.setZoom(parseInt(lv, 10) - 5)
    },
    isMaxLevel () {
      return this.map.getView().getResolution() === this.map.getView().getMinResolution()
    },
    isMinLevel () {
      return this.map.getView().getResolution() === this.map.getView().getMaxResolution()
    },
    // 일반맵으로 전환
    changeTileSateliteMap () {
      this.inaviMap.setMapTypeId(0)
    },
    // 위성맵으로 전환
    changeTileSateliteSat () {
      this.inaviMap.setMapTypeId(2)
    },
    // 새로고침
    fnReloadMap () {
      // 장비목록 검색
      this.searchEquList(false)
    },
    // 지도 버튼 클릭 이벤트 핸들러
    sateliteMap() {
      if (!$('#satelite_map').hasClass('active')) {
        $('#satelite_map').addClass('active')
        $('#satelite_sat').removeClass('active')

        this.changeTileSateliteMap()
        // 수치지도일시 배경 지우기
        $('#inaviMap').css('background-color', '')
      }
    },
    // 위성 버튼 클릭 이벤트 핸들러
    sateliteSat() {
      if (!$('#satelite_sat').hasClass('active')) {
        $('#satelite_map').removeClass('active')
        $('#satelite_sat').addClass('active')

        // 위성으로만 전환
        this.changeTileSateliteSat()
        // 위성지도일시 배경 바다색
        $('#inaviMap').css('background-color', 'rgba(16,49,97,1)')
      }
    },
    // 지도 축척 바뀌는 것 감지 하는 핸들러
    levelChangeHandler (evt) {
      this.inaviMap.setZoom(this.getZoomLevel() - 5)
      // 오른쪽 슬라이드 바 변경 부분
      $('.map-control ul li[class^=level_]').removeClass('on')
      var currentLevel = this.getZoomLevel()
      currentLevel = Math.floor(currentLevel)
      $('.map-control ul li[class=level_' + currentLevel + ']').addClass('on')
    },
    // 지도 가운데 처리 감지 핸들러
    centerChangeHandler (evt) {
      let center = proj.transform(this.mapView.getCenter(), this.MERCATOR, this.WGS84)
      this.inaviMap.setCenter(new MapInfraPoint(center[1], center[0]))
    },
    timeChange () {
      clearInterval(this.intervalTimeId)
      if ($('#mreload').is(':checked')) {
        let time = this.reloadTime * 1000
        this.intervalTimeId = setInterval(() => {
          this.fnUpdateDeviceList()
        }, time)
      }
    },
    // 장비목록 갱신
    fnUpdateDeviceList () {
      this.lastUpdateDate = moment().format('HH:mm:ss').toString()
      this.searchEquList(false)
    },
    // 장비목록 검색
    searchEquList (bln) {
      let reqData = {
        devClsCdNm: '',
        devMdlNm: '',
        devUname: '',
        ctn: ''
      }

      if (bln) {
        if (this.searchEquipment === 'clsNm') {
          reqData.devClsCdNm = this.searchString
        } else if (this.searchEquipment === 'mdlNm') {
          reqData.devMdlNm = this.searchString
        } else if (this.searchEquipment === 'Uname') {
          reqData.devUname = this.searchString
        } else if (this.searchEquipment === 'ctn') {
          reqData.ctn = this.searchString
        } else if (this.searchEquipment === 'svcCdNm') {
          reqData.svcCdNm = this.searchString
        }
      }

      requestApi({
        url: '/online/iotseldevice/retrieveIotSelDevice',
        headers: {
          'X-VNAME': 'ONLINE',
          'X-MID': 'P00002'
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.features = []
            this.featuresOri = []
            this.equipmentProperty = res.data.view
            this.equipmentListTemp = res.data.list
            if (bln) {
              this.equipmentList = res.data.list
            }

            res.data.list.forEach((data, index) => {
              let coordinates = proj.transform([data.instLon / 10000000, data.instLat / 10000000], this.WGS84, this.MERCATOR)
              let statusCd = (data.attbStatusCd === 'A') ? 'true' : (data.attbStatusCd === 'W') ? 'false' : 'stop'
              let deviceView = res.data.view.find(view => view.devClsCd === data.devClsCd)

              // 장비목록에는 있지만 장비속성탭에는 없는 모델인 경우 기본 값으로 장비속성 데이터에 추가
              if (!deviceView) {
                let obj = res.data.list.filter(list => list.devClsCd === data.devClsCd)
                let objA = res.data.list.filter(list => list.devClsCd === data.devClsCd && data.attbStatusCd === 'A')
                let objW = res.data.list.filter(list => list.devClsCd === data.devClsCd && data.attbStatusCd === 'W')
                let objS = res.data.list.filter(list => list.devClsCd === data.devClsCd && data.attbStatusCd === 'S')

                deviceView = {
                  cntTrue: (objA) ? objA.length : 0,
                  cntFalse: (objW) ? objW.length : 0,
                  cntStop: (objS) ? objS.length : 0,
                  cntTotal: (obj) ? obj.length : 0,
                  devClsCd: data.devClsCd,
                  devClsCdNm: data.devClsCdNm,
                  norGroup: '/sui/assets/G_TB_A.png',
                  warGroup: '/sui/assets/G_TB_W.png',
                  stopGroup: '/sui/assets/G_TB_S.png'
                }
                this.equipmentProperty.push(deviceView)
              }

              // 장비그룹 이미지가 없는 경우 기본 이미지 정보 세팅
              if (data.attbStatusCd === 'A') {
                if (!deviceView.norGroup) {
                  deviceView.norGroup = '/sui/assets/G_TB_A.png'
                }
              } else if (data.attbStatusCd === 'W') {
                if (!deviceView.warGroup) {
                  deviceView.warGroup = '/sui/assets/G_TB_W.png'
                }
              } else {
                if (!deviceView.stopGroup) {
                  deviceView.stopGroup = '/sui/assets/G_TB_S.png'
                }
              }

              this.featuresOri.push(
                new OlFeature({
                  geometry: new OlGeomPoint(coordinates),
                  id: data.entrDevSeq,
                  name: data.devUname,
                  ctn: data.ctn,
                  icon: (data.imgFile) ? data.imgFile : '/sui/assets/TB_' + data.attbStatusCd + '.png',
                  groupIcon: (data.attbStatusCd === 'A') ? deviceView.norGroup : (data.attbStatusCd === 'W') ? deviceView.warGroup : deviceView.stopGroup,
                  featureCd: data.devClsCd + '_' + statusCd,
                  attbStatusCd: data.attbStatusCd
                })
              )

              if (index === (res.data.list.length - 1)) {
                // 지도 marker 처리를 위한 clusters 선언
                this.fnCheckOverlay()
              }
            })
          }
        }
      })
    },
    // marker 처리
    fnDrawFeatures(flag) {
      // 기존 layer 는 삭제처리
      this.map.removeLayer(this.clusters)

      let source = new OlSourceVector({
        features: this.features
      })

      let clusterSource = new OlSourceCluster({
        distance: 100,
        source: source
      })

      this.clusters.setSource(clusterSource)
      this.clusters.setStyle(this.clusterLayerStyle)
      this.clusters.setVisible(flag)
      this.map.addLayer(this.clusters)
    },
    clusterLayerStyle (feature) {
      let size = feature.get('features').length
      let clusterImg
      let clusterFont
      let style

      // 장비가 1개이거나 Zoom Level 이 16이상인 경우
      if (size === 1 || this.getZoomLevel() >= 16) {
        // 장비가 1개이면
        if (size === 1) {
          clusterImg = new OlStyleIcon({ src: feature.get('features')[0].get('icon') })
        } else if (size > 1) {
        // 장비가 2개 이상인 경우
          clusterImg = new OlStyleIcon({ src: '/sui/external/map/images/multi_gas.png' })

          let stopCnt = 0
          let warningCnt = 0
          feature.get('features').forEach((item, idx) => {
            let attbStatusCd = item.get('attbStatusCd')
            if (attbStatusCd === 'S') {
              stopCnt++
            } else if (attbStatusCd === 'W') {
              warningCnt++
            }
          })
          if ((stopCnt + warningCnt) > 0) {
            clusterImg = new OlStyleIcon({ src: '/sui/external/map/images/multi_gas_critial.png' })
          }
        }
      } else {
        // clusterImg = new OlStyleIcon({ src: feature.get('features')[0].get('groupIcon') })
        // 장비상태와 상관없이 동일한 그룹 아이콘 표시
        let flagCnt = 0
        feature.get('features').forEach((item, idx) => {
          let attbStatusCd = item.get('attbStatusCd')
          if (attbStatusCd === 'S') {
            flagCnt++
          } else if (attbStatusCd === 'W') {
            flagCnt++
          }
        })
        if (flagCnt > 0) {
          clusterImg = new OlStyleIcon({ src: '/sui/assets/G_TB_W.png' })
        } else {
          clusterImg = new OlStyleIcon({ src: '/sui/assets/G_TB_A.png' })
        }
      }

      if (size === 1 || this.getZoomLevel() >= 16) {
        clusterFont = 'bold 14px Malgun Gothic'
      } else if (size < 10) {
        clusterFont = 'bold 35px Malgun Gothic'
      } else if (size >= 10 && size < 100) {
        clusterFont = 'bold 30px Malgun Gothic'
      } else if (size >= 100 && size < 1000) {
        clusterFont = 'bold 25px Malgun Gothic'
      } else {
        clusterFont = 'bold 20px Malgun Gothic'
      }

      if (size === 1 || this.getZoomLevel() >= 16) {
        style = new OlStyleStyle({
          image: clusterImg,
          text: new OlStyleText({
            text: (size === 1) ? feature.get('features')[0].get('name') : '',
            fill: new OlStyleFill({ color: '#ffffff' }),
            textAlign: 'center',
            offsetY: 34,
            font: clusterFont,
            stroke: new OlStyleStroke({
              color: '#000000',
              lineCap: 'square',
              width: 4
            })
          })
        })
      } else {
        style = new OlStyleStyle({
          image: clusterImg,
          text: new OlStyleText({
            text: size.toString(),
            fill: new OlStyleFill({ color: '#000000' }),
            textAlign: 'center',
            offsetY: 0,
            font: clusterFont,
            stroke: new OlStyleStroke({
              color: '#FFFFFF',
              lineCap: 'square',
              width: 4
            })
          })
        })
      }
      return style
    },
    // 명칭 검색
    fnGetNameList () {
      let reqData = {}
      let headers = this.apiHeaders
      let body = {
        'cutflag': '0',
        'coordtype': '1',
        'startposition': '0',
        'reqcount': '0',
        'depth': '0',
        'query': this.searchName,
        'option': '8',
        'nameopt': '7',
        'admopt': '0',
        'adm': '',
        'catecode': '',
        'spopt': '0',
        'radius': '',
        'mid': '',
        'x1': '',
        'y1': '',
        'x2': '',
        'y2': '',
        'sortopt': '1'
      }
      reqData.api = 'searchPoiNumber'
      reqData.headers = headers
      reqData.body = body

      requestApi({
        url: '/online/iotmapinfra/getPoi',
        headers: {
          'X-VNAME': 'ONLINE',
          'X-MID': 'P00002'
        },
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.nameList = res.data
          }
        },
        method: 'post',
        data: reqData
      })
    },
    // 주소 검색
    fnGetAddressList () {
      if (this.selectSido === '') {
        this.alert(this.$t('request-select-sido'))
        return
      } else if (this.selectSiGunGu === '') {
        this.alert(this.$t('request-select-sigungu'))
        return
      } else if (this.selectDong === '') {
        this.alert(this.$t('request-select-dong'))
        return
      }

      if (this.searchAddr === '' && this.addressKind === 'new') {
        this.alert(this.$t('request-input-address-new-roadname'))
        return
      }

      if (this.searchBunji === '' && this.addressKind === 'old') {
        this.alert(this.$t('request-input-address-old-jibun'))
        return
      }

      let reqData = {}
      let headers = this.apiHeaders
      let body = {
        'cutflag': '0',
        'coordtype': '1',
        'startposition': '0',
        'reqcount': '0',
        'option': (this.addressKind === 'new') ? '1' : '0',
        'addr': (this.addressKind === 'new') ? this.searchAddr : '',
        'admcode': this.selectDong,
        'jibun': this.searchBunji,
        'mode': '1'
      }
      reqData.api = (this.addressKind === 'new') ? 'searchNewAddr' : 'searchOldAddr'
      reqData.headers = headers
      reqData.body = body

      requestApi({
        url: '/online/iotmapinfra/getPoi',
        headers: {
          'X-VNAME': 'ONLINE',
          'X-MID': 'P00002'
        },
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.addressList = res.data

            if (this.addressKind === 'new' && parseInt(this.addressList.count, 10) > 0) {
              this.addressList.adm.forEach((item) => {
                item.address = item.roadname
                item.jibun = item.roadjibun
              })
            }
          }
        },
        method: 'post',
        data: reqData
      })
    },
    // 시도/시군구/동 목록
    fnGetSidoSigunguDongList (gubun) {
      let reqData = {}
      let headers = this.apiHeaders
      let body = {
        'cutflag': '0',
        'coordtype': '1',
        'startposition': '2',
        'reqcount': '0',
        'option': '1',
        'addr': '',
        'admcode': (gubun === 'sido') ? ''
          : (gubun === 'sigungu') ? this.selectSido
            : (gubun === 'dong') ? this.selectSiGunGu : ''
      }
      reqData.api = 'searchSubAddr'
      reqData.headers = headers
      reqData.body = body

      requestApi({
        url: '/online/iotmapinfra/getPoi',
        headers: {
          'X-VNAME': 'ONLINE',
          'X-MID': 'P00002'
        },
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            if (gubun === 'sido') {
              this.sidoList = res.data
            } else if (gubun === 'sigungu') {
              this.siGunGuList = res.data
            } else if (gubun === 'dong') {
              this.dongList = res.data
            }
          }
        },
        method: 'post',
        data: reqData
      })
    },
    // 시/도 목록조회
    fnGetSidoList () {
      this.fnGetSidoSigunguDongList('sido')
    },
    // 시군구 목록
    fnGetSiGunGuList () {
      // 시군구 초기화
      this.selectSiGunGu = ''
      this.siGunGuList = {}
      // 읍면동 리스트 초기화
      this.selectDong = ''
      this.dongList = {}

      if (this.selectSido === '') {
        return
      }
      this.fnGetSidoSigunguDongList('sigungu')
    },
    fnGetDongList () {
      this.selectDong = ''
      this.dongList = {}
      if (this.selectSiGunGu === '') {
        return
      }
      this.fnGetSidoSigunguDongList('dong')
    },
    fnSetSearchBunjiWidth() {
      if (this.addressKind === 'new') {
        $('#searchBunji').css('width', '25%')
      } else {
        $('#searchBunji').css('width', '')
      }
    },
    // 지도 center 위치 이동
    fnSetCenter (instLat, instLon) {
      // 위도
      instLat = instLat * 10000000
      // 경도
      instLon = instLon * 10000000

      let lat = Math.floor(instLat / 10000000)
      let lon = Math.floor(instLon / 10000000)

      // 우리나라 경도 : 124°∼132°, 위도 : 33°~43° 범위에 해당하지 않으면 오류 출력
      if (lat < 33 || lat > 43) {
        this.alert(this.$t('error-range-lat'))
        return
      }

      if (lon < 124 || lon > 132) {
        this.alert(this.$t('error-range-lon'))
        return
      }

      this.setZoomLevel(18)
      this.mapView.setCenter(proj.transform([instLon / 10000000, instLat / 10000000], this.WGS84, this.MERCATOR))
    }
  }
}
</script>

<style lang="less" scoped>

</style>
