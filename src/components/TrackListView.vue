<template>
  <div class="pane">
    <h5 class="text-left">Objecten op brug: ({{getTracksHidden().length}}/{{tracks.length}})</h5>
    <b-button size="sm" v-on:click="resolveAll()">Alle oplossen</b-button>&nbsp;
    <b-button size="sm" v-on:click="removeResolved()">Schonen lijst</b-button>

    <div ref="scroll_container" class="scroll-container justify-content-center">
      <b-row
        id="missing_objects"
        v-for="(track, index) in getTracksHidden()"
        :key="'track-'+index"
        align-h="center"
        :ref="'track-'+track.id"
      >
        <b-collapse :visible="!track.resolved">
          <b-card
            no-body
            :class="{active: activeTrack && activeTrack.id === track.id }"
            :ref="`miss-track-img-${index}`"
          >
            <b-row no-gutters>
              <b-col md="6">
                <b-card-img :src="!track.isLoading && track.data && 'data:image/jpeg;base64,'+track.data" alt="Image"></b-card-img>
              </b-col>
              <b-col md="6">
                <b-card-body :title="'Object '+track.id" title-tag="h5">
                  <b-card-text class="small_text"  v-if="!activeTrack || activeTrack.id === track.id">
                    Laatst Gezien:
                    <br />
                    {{frontEndTimeFormat(track.lastseen_timestamp)}}
                    Camera: {{track.camera}}
                  </b-card-text>
                </b-card-body>
              </b-col>
            </b-row>
            <b-row class="m-2">
              <b-button v-if="track.status === 'HIDDEN'" size="sm" variant="primary" v-b-toggle="'card' + track.id" v-on:click="resolve(track, true)">
                Oplossen
              </b-button>
              <b-col>
                <b-button
                  size="sm"
                  v-if="activeTrack && activeTrack.id === track.id"
                  v-on:click="setActiveTrack(null)"
                >Sluiten</b-button>
                <b-button size="sm" v-else v-on:click="setActiveTrack(track)">Bekijken</b-button>
              </b-col>
            </b-row>
          </b-card>
        </b-collapse>
        <b-collapse :visible="track.resolved" class="mt-2">
          <b-col align-self="center">
            <b-button size="sm" v-on:click="() => resolve(track, false)">
              Ongedaan maken
            </b-button>
          </b-col>
        </b-collapse>
      </b-row>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import moment from "moment";

export default {
  name: "TrackListView",
  data() {
    return {
      bridgeSelected: "test",
      timeOutTracks: [],
      cameraSelected: "test",
      testFileName: "https://placekitten.com/g/500/350",
      allowUndo: new Map()
    };
  },
  components: {},
  methods: {
    ...mapActions("track", ["updateTrack", "setActiveTrack", "deleteTrack"]),
    startStream(track) {
      this.$store.dispatch("stream/startStream", {
        track_id: track.id,
        clip_id: null,
        skip: 0,
        draw_bbox: true
      });
    },
    resolve(track, status) {
      track.resolved = status;
      this.updateTrack(track);
      // wait 3 seconds, then if status track is still resolved, remove in frontend and backend
      if (track.resolved) {
         setTimeout(() => {
             const trackLatestState = this.tracks.filter(trackToCheck => trackToCheck.id === track.id)[0]
             if (trackLatestState.resolved) {
               this.deleteTrack(track.id);
             }
         }, 3000);
      }
    },
    frontEndTimeFormat(date) {
      return moment(date).format("hh:mm:ss");
    },
    getTracksHidden() {
      return this.tracks.filter(track => track.status === "HIDDEN");
    },
    getTracksOnBridge() {
      return this.tracks.filter(
        track => track.status === "HIDDEN" || track.status === "IN"
      );
    },
    getUnresolvedTracksOnBridge() {
      return this.tracks.filter((track) => (!track.resolved && track.status === "HIDDEN") || track.status === "IN");
    },
    // some custom functions for testing:
    resolveAll() {
      this.tracks.forEach(track => {
        track.resolved = true;
        this.updateTrack(track);
      });
    },
    removeResolved() {
      this.tracks.filter((track) => (track.resolved || track.status === 'OK')).forEach((track) => {
        this.deleteTrack(track.id);
      });
    },
    scrollToObject(track) {
      var targetObject = this.$refs["track-" + track.id];
      var container = this.$refs["scroll_container"];
      var scrollPos = targetObject[0].offsetTop - container.offsetTop;
      container.scrollTop = scrollPos;
    }
  },
  watch: {
    activeTrack(newTrack) {
      // eslint-disable-next-line
      console.log(
        "activeTrack changed in SchematicView, refresh schematic view",
        newTrack.id
      );
      this.scrollToObject(newTrack);
    },
    tracks() {
    }
  },
  computed: mapState({
    activeTrack: state => state.track.active,
    tracks: state => state.track.tracks
  }),
  mounted() {},
  created() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.scroll-container {
  height: 56vh;
  overflow-y: scroll;
  margin-top: 1rem;
}

.active {
  border: yellow solid 2px;
}

#missing_objects {
  width: 95%;
  margin: 0 auto 1rem;
}

</style>
