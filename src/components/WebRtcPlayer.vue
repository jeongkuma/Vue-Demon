<template>
  <div class="_dashboard-video-body">
    <video
      ref="player"
      :id="playerId"
      class="video-js"
      playsinline
      style="width: 100%; height: 100%"
    ></video>
    <div v-if="useControl" class="_dashboard-video-control">
      <button
        class="_dashboard-video-control-button lt"
        @click="fnControl(directions[0])"
      >
        left top
      </button>
      <button class="_dashboard-video-control-button t" @click="fnControl(directions[1])">
        top
      </button>
      <button
        class="_dashboard-video-control-button rt"
        @click="fnControl(directions[2])"
      >
        right top
      </button>
      <button class="_dashboard-video-control-button l" @click="fnControl(directions[3])">
        left
      </button>
      <button class="_dashboard-video-control-button r" @click="fnControl(directions[4])">
        right
      </button>
      <button
        class="_dashboard-video-control-button lb"
        @click="fnControl(directions[5])"
      >
        left bottom
      </button>
      <button class="_dashboard-video-control-button b" @click="fnControl(directions[6])">
        bottom
      </button>
      <button
        class="_dashboard-video-control-button rb"
        @click="fnControl(directions[7])"
      >
        right bottom
      </button>
    </div>
  </div>
</template>

<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

var kurentoUtils = require('kurento-utils')
var kurentoClient = require('kurento-client')

export default {
  name: 'WebRtcPlayer',
  props: {
    wsUri: {
      type: String
    },
    rtspUri: {
      type: String
    },
    useControl: {
      type: Boolean,
      default: true
    },
    directions: {
      type: Array,
      default() {
        return ['lt', 't', 'rt', 'l', 'r', 'lb', 'b', 'rb']
      }
    }
  },
  data() {
    return {
      playerId: '',
      webRtcPeer: null,
      pipeline: null
    }
  },
  computed: {},
  watch: {
    rtspUri() {
      this.fnStart()
    }
  },
  created() {
    this.playerId = 'player_' + new Date().getTime()
  },
  mounted() {
    this.fnInitVideo()
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
    }
  },
  methods: {
    fnInitVideo() {
      this.player = videojs(
        this.$refs.player,
        this.options,
        this.fnHandlePlayerReady
      )
    },
    fnHandlePlayerReady() {
      console.log('onPlayerReady')
    },
    fnSetPlayerSrc() {
      this.player.autoplay(false)
      this.player.src(this.src)
    },
    fnControl(direction) {
      this.$emit('control', direction)
    },
    // -------------------- webrtc
    fnStart() {
      this.fnStop()
      if (!this.wsUri || !this.rtspUri) {
        return
      }
      console.log('[WebRtcPlayer] start')
      this.fnCreateWebRtcPeerRecvOnly()
    },
    fnStop() {
      if (this.webRtcPeer) {
        console.log('[WebRtcPlayer] stop dispose webRtcPeer')
        this.webRtcPeer.dispose()
        this.webRtcPeer = null
      }

      if (this.pipeline) {
        console.log('[WebRtcPlayer] stop release pipeline')
        this.pipeline.release()
        this.pipeline = null
      }
    },
    // 수신 피어
    fnCreateWebRtcPeerRecvOnly() {
      const options = {
        remoteVideo: document.getElementById(this.playerId)
      }
      this.webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(
        options,
        error => {
          if (error) {
            return this.fnOnError(error)
          }

          // offer 생성
          this.webRtcPeer.generateOffer(this.fnOnOffer)
          // peerConnection에 iceconnectionstatechange 이벤트
          this.webRtcPeer.peerConnection.addEventListener(
            'iceconnectionstatechange',
            event => {
              console.log('iceconnectionstatechange', event)
              if (this.webRtcPeer && this.webRtcPeer.peerConnection) {
                console.log(
                  'oniceconnectionstatechange -> ' +
                    this.webRtcPeer.peerConnection.iceConnectionState
                )
                console.log(
                  'icegatheringstate -> ' +
                    this.webRtcPeer.peerConnection.iceGatheringState
                )
              }
            }
          )
        }
      )
    },
    fnOnOffer(error, sdpOffer) {
      if (error) {
        return this.fnOnError(error)
      }

      // kurentoClient 생성
      kurentoClient(this.ws_uri, (error, client) => {
        if (error) {
          return this.fnOnError(error)
        }

        // pipeline 생성
        /* eslint-disable handle-callback-err */
        client.create('MediaPipeline', (error, pipeline) => {
          this.pipeline = pipeline

          // PlayerEndpoint 생성
          this.pipeline.create(
            'PlayerEndpoint',
            { uri: this.rtspUri },
            (error, player) => {
              if (error) {
                return this.fnOnError(error)
              }

              // WebRtcEndpoint 생성
              this.pipeline.create(
                'WebRtcEndpoint',
                (error, webRtcEndpoint) => {
                  if (error) {
                    return this.fnOnError(error)
                  }

                  // candidate 등록
                  this.fnSetIceCandidateCallbacks(webRtcEndpoint)

                  // offer 처리
                  webRtcEndpoint.processOffer(sdpOffer, (error, sdpAnswer) => {
                    if (error) {
                      return this.fnOnError(error)
                    }

                    // candidate 수집
                    webRtcEndpoint.gatherCandidates(this.fnOnError)

                    // answer 처리
                    this.webRtcPeer.processAnswer(sdpAnswer)
                  })

                  // player에 endpoint 연동
                  player.connect(webRtcEndpoint, error => {
                    if (error) {
                      return this.fnOnError(error)
                    }

                    console.log(
                      'PlayerEndpoint-->WebRtcEndpoint connection established'
                    )

                    // play
                    player.play(function(error) {
                      if (error) {
                        return this.fnOnError(error)
                      }
                    })
                  })
                }
              )
            }
          )
        })
      })
    },
    // candidate 등록
    fnSetIceCandidateCallbacks(webRtcEndpoint) {
      this.webRtcPeer.on('icecandidate', candidate => {
        candidate = kurentoClient.register.complexTypes.IceCandidate(candidate)
        webRtcEndpoint.addIceCandidate(candidate, this.fnOnError)
      })
      webRtcEndpoint.on('OnIceCandidate', event => {
        var candidate = event.candidate
        this.webRtcPeer.addIceCandidate(candidate, this.fnOnError)
      })
    },
    fnOnError(error) {
      if (error !== null && error !== undefined) {
        console.error(error)
      }
    }
  }
}
</script>

<style></style>
