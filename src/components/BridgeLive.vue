<template>
  <div class="page">
    <div class="camera" style="float:left;">
      <video-player :options="videoOptions"></video-player>
    </div>
    <div class="camera" style="float:right;">
      <video-player :options="videoOptions"></video-player>
    </div>
    <div class="camera" style="float:left;">
      <video-player :options="videoOptions"></video-player>
    </div>
    <div class="camera" style="float:right;">
      <video-player :options="videoOptions"></video-player>
    </div>
  </div>
</template>

<script>
// videojs
import videojs from "video.js";
window.videojs = videojs;

export default {
  name: "Bridge",
  data() {
    return {
      videoOptions: {
        autoplay: true,
        controls: true,
        width: 960,
        height: 590,
        controlBar: {
          timeDivider: false,
          durationDisplay: false
        },
        source: {
          type: "application/x-mpegURL",
          src: "http://localhost:8080/hls/stream2.m3u8",
          withCredentials: false
        },
        live: true
      }
    };
  },
  components: {},
  props: {},
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.camera {
  width: 50vw;
  height: 50vh;
  margin: auto;
}
</style>
