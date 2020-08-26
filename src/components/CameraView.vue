<template>
  <b-row class="pane" id="cameraviews">
    <h5>Camera beeld</h5>
    <p class="float_right" v-if="showCameras && activeTrack">Object #{{activeTrack.id}} geselecteerd</p>
    <div v-if="showCameras && activeTrack" style="width:50%; overflow:hidden; float:right">
      <b-form-checkbox
        v-model="detectionsChecked"
        switch
        class="float_right"
        @change="toggleBbox($event)"
      >
        <p class="small_text">Teken detecties</p>
      </b-form-checkbox>
      <b-form-checkbox
        style="overflow:hidden;"
        v-if="detectionsChecked"
        switch
        v-model="relevantDetectionsChecked"
        @change="toggleFilterBbox($event)"
      >
        <p class="small_text" v-if="relevantDetectionsChecked">Alleen dit object</p>
        <p class="small_text" v-else>Alle detecties</p>
      </b-form-checkbox>
    </div>

    <b-col md="12">
      <b-row
        v-if="loadingStream"
        class="spinner-border text-secondary row justify-content-center align-self-center"
        role="status"
      >
        <span class="sr-only">Loading...</span>
      </b-row>
      <b-row v-show="showCameras && activeTrack && !loadingStream">
        <b-col md="2">
          <b-row
            v-for="(camera,index) in this.alertVariant"
            :key="index"
            v-on:click="setActiveCamera(index)"
            :class="{active: index === activeCam }"
            class="thumbnail_container"
          >
            <b-img thumbnail :src="testFileName" />
            <div class="overlay_left">
              <b-button size="sm" :variant="alertVariant[index]">
                <b-icon icon="camera-video-fill"></b-icon>
                {{ index+1 }}
              </b-button>
            </div>
          </b-row>
        </b-col>
        <b-col md="10">
          <img id="video_feed" src="http://127.0.0.1:8005/stream.mjpg" />
          <b-row align-h="start">
            <b-col md="4" class="justify-content-md-center">
                <b-button v-on:click="startPrevStream()">&lsaquo;</b-button>&nbsp;
            </b-col>
            <b-col md="4" class="justify-content-md-center">
            
                <b-button v-b-modal.fullscreen>
                  <b-icon-arrows-fullscreen variant="white"></b-icon-arrows-fullscreen>
                </b-button>
            </b-col>
                <b-col md="4" class="justify-content-md-center">
                  <b-button v-on:click="startNextStream()">&rsaquo;</b-button>
                </b-col>
          </b-row>
          <b-modal size="xl" id="fullscreen" hide-footer>
            <img id="video_feed_fullscreen" src="http://127.0.0.1:8005/stream.mjpg" />
          </b-modal>
        </b-col>
      </b-row>
      <b-row
        class="row justify-content-center align-self-center"
        v-if="!showCameras && !loadingStream"
      >Bekijk een object om het op te lossen met behulp van camerabeeld</b-row>
    </b-col>
  </b-row>
</template>

<script>
import { mapState, mapActions } from "vuex";
import moment from "moment";

export default {
  name: "CameraView",
  data() {
    return {
      timestamp: "",
      bridgeSelected: "test",
      cameraSelected: "test",
      testFileName: "https://placekitten.com/g/500/350",
      loadingStream: false,
      showCameras: false,
      topdownFile: "topdown.png",
      activeCam: 0,
      prevCam: -1,
      activeClipPath: "",
      detectionsChecked: true,
      relevantDetectionsChecked: true,
      alertVariant: [
        "primary-outline",
        "primary-outline",
        "primary-outline",
        "primary-outline"
      ]
    };
  },
  components: {},
  methods: {
    ...mapActions("track", ["updateTrack"]),
    ...mapActions("camera", ["setActiveCamera"]),
    ...mapActions("stream", [
      "startStream",
      "stopStream",
      "startNextStream",
      "startPrevStream",
      "setBoundingBox"
    ]),
    getNow() {
      this.timestamp = moment(new Date()).format("hh:mm:ss");
    },
    loadStream(track) {
      // eslint-disable-next-line
      console.log("starting stream for track with id=%s", track.id);
      const streamObj = {
        track_id: track.id,
        camera_id: "test_"+(this.activeCam), 
        clip_id: null,
        skip: 0,
        filter_bbox: this.relevantDetectionsChecked
      };
      this.loadingStream = true;
      this.startStream(streamObj);

      this.loadingStream = false;
      this.showCameras = true;
    },
    closeStream() {
      this.showCameras = false;
      this.activeCam = 0;
      for (var key in this.alertVariant) {
        this.alertVariant[key] = "primary-outline";
      }
      this.stopStream();
    },
    toggleBbox(e) {
      // eslint-disable-next-line
      console.log("Toggling bbox drawing  %s", e);
      const bboxObj = {
        draw_bbox: e
      };
      this.setBoundingBox(bboxObj);
    },
    toggleFilterBbox(e) {
      // eslint-disable-next-line
      console.log("Toggling bbox filtering  %s", e);
      this.relevantDetectionsChecked = e;
      this.loadStream(this.activeTrack, false);
    },
    updateCamera(cam, force) {
      // Change style of previously selected camera and currently selected camera
      if ((this.activeCam != cam && this.showCameras) || force) {
        this.alertVariant[cam] = "primary";
        this.prevCam = this.activeCam;
        this.activeCam = cam;
        this.alertVariant[this.prevCam] = "primary-outline";
        this.setActiveCamera(cam);
        this.$forceUpdate();
        this.loadStream(this.activeTrack, false);
      }
    },
    frontEndTimeFormat(date) {
      return moment(date).format("hh:mm:ss");
    },
    getCameras() {
      return this.cameras;
    }
  },
  watch: {
    activeTrack(newTrack) {
      // eslint-disable-next-line
      console.log("activeTrack changed in SchematicView, changing stream");
      if (newTrack) {
        this.loadStream(newTrack, true);
      } else {
        this.closeStream();
      }
    },
    activeCamera(newCamera) {
      this.updateCamera(newCamera, true);
    }
  },
  computed: mapState({
    activeCamera: state => state.camera.active,
    activeTrack: state => state.track.active,
    clips: state => state.clip.clips,
    cameras: state => state.camera.cameras
  }),
  mounted() {},
  created() {
    // TODO add logic for getting correct data for this specific bridge
    this.$store.dispatch("camera/getCameras");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#cameraviews {
  height: 40vh;
}

.thumbnail_container {
  position: relative;
}

.overlay_left {
  position: absolute;
  background: rgba(255, 255, 255, 0.5);
  padding: 0.5rem;
  bottom: 5px;
  left: 5px;
}

.active {
  border: yellow solid 2px;
}

.vert_center {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.float_right {
  float: right !important;
  width: auto;
  margin: 0 1rem;
}

#video_feed {
  -webkit-user-select: none;
  margin: 0 auto 1rem;
  max-width: 100%;
}

#video_feed_fullscreen {
  -webkit-user-select: none;
  margin: 0 auto 1rem;
  max-width: 100%;
}
</style>
