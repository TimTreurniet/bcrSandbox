<template>
  <div class="">
    <h3>Tracks on Database</h3>
    <p>count: {{tracks.length}}</p>
    <p v-if="tracks.length === 0">No Tracks found</p>
    <div class="entity" v-for="(entity, index) in orderedTracks" :key="index">
      <p>{{entity}}</p>
    </div> 
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import _ from 'lodash'
import ws from '@/services/wsService'

export default {
  name: "Track",
  data() {
    return {
      wsConnection: null,
      messages: [],
      bridgeSelected: 'test'
    };
  },
  methods: {
    ...mapActions('track', [
      'addTrack', 'deleteTrack'
    ]),
    addToMessages(message) {
      this.messages.push(message)
      if (this.messages["tracks"]) {
        this.messages["tracks"].forEach((track) => {
          this.tracks.push(track)
        });
      }
    }
  },
  computed: mapState({
    tracks: state => state.track.tracks,
    orderedTracks: function () {
      return _.orderBy(this.tracks, 'updated_at', 'desc')
    }
  }),
  created() {
    this.$store.dispatch('track/getTracksNoData')
    this.wsConnection = ws.getConnection(this.bridgeSelected, this.addToMessages)
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
hr {
  max-width: 65%;
}

.entity {
  margin: 0 auto;
  max-width: 90%;
  text-align: left;
  border-bottom: 1px solid #ccc;
  padding: 1rem;
}

.entity-index {
  color: #ccc;
  font-size: 0.8rem;
  /* margin-bottom: 0; */
}

img {
  width: 250px;
  padding-top: 50px;
  padding-bottom: 50px;
}

</style>
