<template>
  <div class="pane">
    <div ref="scroll_container" class="scroll-container justify-content-center">
      <b-row
        id="missing_objects"
        v-for="(suggestion, index) in suggestions"
        :key="'suggestion-'+index"
        align-h="center"
        :ref="'suggestion-'+suggestion.id"
      >
        <b-collapse :visible="!suggestion.resolved">
          <b-card
            no-body
            :class="{active: activeSuggestion.id === suggestion.id }"
            :ref="`miss-track-img-${index}`"
          >
            <b-row no-gutters>
              <b-col md="6">
                <b-card-img :src="!suggestion.isLoading && suggestion.data && 'data:image/jpeg;base64,'+suggestion.data" alt="Image"></b-card-img>
              </b-col>
              <b-col md="6">
                <b-card-body :title="'Object '+suggestion.id" title-tag="h5">
                  <b-card-text class="small_text">
                    Laatst Gezien:
                    <br />
                    {{frontEndTimeFormat(suggestion.lastseen_timestamp)}}
                    Camera: {{suggestion.camera}}
                  </b-card-text>

                </b-card-body>
              </b-col>
            </b-row>
            <b-row class="m-2">
              <b-col>
                <b-button 
                  size="md" 
                  variant="primary" 
                  v-b-toggle="'card' + suggestion.id" 
                  v-on:click="resolve(suggestion, true)">
                  Ja
                </b-button>
                 <!-- <b-button 
                  v-else
                  size="sm" 
                  variant="primary" 
                  v-b-toggle="'card' + suggestion.id" 
                  v-on:click="setActiveSuggestion(suggestion)">
                  Bekijken
                </b-button> -->
              </b-col>
              <b-col>
                <!-- <b-button
                  size="sm"
                  v-if="activeSuggestion.id === suggestion.id"
                  v-on:click="setActiveSuggestion(emptySuggestion)"
                >Sluiten</b-button> -->
                <b-button size="md" v-on:click="removeSuggestion(suggestion)">Nee</b-button>
              </b-col>
            </b-row>
          </b-card>
        </b-collapse>
      </b-row>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import moment from "moment";

export default {
  name: "SuggestionView",
  data() {
    return {
      bridgeSelected: "test",
      cameraSelected: "test",
      testFileName: "https://placekitten.com/g/500/350",
      emptySuggestion: {id:-1},
      activeSuggestion: {id:-1},
      currentTrack: null,
    };
  },
  components: {},
  methods: {
    ...mapActions("track", ["updateTrack", "getSuggestions", "deleteTrack"]),
    startStream(track) {
      this.$store.dispatch("stream/startStream", {
        track_id: track.id,
        clip_id: null,
        skip: 0,
        draw_bbox: true
      });
    },
    setActiveSuggestion(suggestion) {
      this.activeSuggestion = suggestion;
      if(this.activeSuggestion != null) {
        this.startStream(suggestion);
      }
    },
    removeSuggestion(suggestion) {
      this.suggestions.forEach(function(item, index, object) {
        if(item.id === suggestion.id) {object.splice(index, 1);}
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
  },
  watch: {
    activeTrack(newTrack) {
      // eslint-disable-next-line
      console.log(
        "activeTrack changed, refresh suggestion view",
        newTrack.id
      );  
      this.currentTrack = newTrack;
    },
    tracks() {
    }
  },
  mounted() {},
  created() {
    this.getSuggestions(this.activeTrack);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.scroll-container {
  height: 66vh;
  /* overflow-y: scroll; */
  margin-top: 1rem;
}

.active {
  border: yellow solid 2px;
}

</style>
