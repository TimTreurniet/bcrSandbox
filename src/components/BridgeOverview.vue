<template>
  <div class="page">
    <b-container>
      <h3>Bruggen Overzicht</h3>
        <div id="bridges-list" class="scroll-container">
          <b-row v-for="bridges in groupedBridges" v-bind:key="bridges.id">
            <b-col v-for="bridge in bridges" v-bind:key="bridge.id">
                <b-card 
                  class="bridge-card" 
                  :title="bridge.name" :img-src="getImgUrl(bridge.filename)"
                  img-width="80px" img-height="50%" img-top>
                  <b-card-text>Status: online</b-card-text>
                  <b-card-text class="small text-muted">Laatste update: {{frontEndTimeFormat(bridge.updated_at)}}</b-card-text>
                  <b-button variant="primary" :to="{ name: 'bridge-selected', params: { name: bridgeSelected }}">Start bediening "{{bridge.name}}"</b-button>
                </b-card>
            </b-col>
          </b-row>
        </div>
    </b-container>
  </div>
</template>

<script>
import moment from 'moment'
import _ from "lodash";

export default {
  name: "BridgeOverview",
  data() {
    return {
		bridgeSelected: 'test',
    bridges: [
      {name: 'Brienenoord',
      updated_at: new Date(),
      filename: "overview.png"},
      {name: 'Brienenoord 2',
      updated_at: new Date(),
      filename: "overview.png"},
      {name: 'Brienenoord 3',
      updated_at: new Date(),
      filename: "overview.png"},

      {name: 'Brienenoord',
      updated_at: new Date(),
      filename: "overview.png"},
      {name: 'Brienenoord 2',
      updated_at: new Date(),
      filename: "overview.png"},
      {name: 'Brienenoord 3',
      updated_at: new Date(),
      filename: "overview.png"},

      {name: 'Brienenoord',
      updated_at: new Date(),
      filename: "overview.png"},
      {name: 'Brienenoord 2',
      updated_at: new Date(),
      filename: "overview.png"},
      {name: 'Brienenoord 3',
      updated_at: new Date(),
      filename: "overview.png"},
    ],
    }
  },
  methods: {
    getImgUrl(pic) {
      return require("../assets/" + pic);
    },
    frontEndTimeFormat(date) {
      return moment(date).format('hh:mm:ss');
    },
  },
  computed:{
    groupedBridges() {
    return _.chunk(this.bridges, 3)
  }}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.detail-text {
  color:black;
}

.scroll-container {
  max-height: 80vh;
  max-width: 100vh;
  overflow: auto;
}

.bridge-card {
  margin-bottom: 1rem;
}
</style>
