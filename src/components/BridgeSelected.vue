<template>
  <div class="page">
    <b-container fluid>
      <b-popover target="suggest" :show.sync="showCam" placement="left">
          <template v-slot:title>Is dit het vermiste object?</template>
          <SuggestionView/>
      </b-popover>
      <b-row class="justify-content-center">
        <b-col sm="2">
        </b-col>
        
        <b-col sm="2" id="suggest">
          <b-card id="status-card" class="pane" :class="bridge_safe ? 'safe' : 'unsafe'">
            <b-card-text>
              <h5>Status: <b-img :src="getImgUrl(bridge_safe ? safe_filename : unsafe_filename )" width="30px" height="30px"/></h5>
              {{bridge_safe ? 'Veilig' : 'Niet veilig'}}
              <br/>
              {{getTracksOnBridge()}} objecten op brug
            </b-card-text>
          </b-card>
          <TrackListView id="track-list"/>
          <b-row class="pane justify-content-center">
            <b-button variant="primary" :to="'/bridge-overview'" v-b-tooltip title="Terug naar overzicht"> Stop bediening </b-button>
          </b-row>
        </b-col>
        <b-col sm="5">
          <CameraView id="camera-view"/>
          <SchematicView id="schematic-view"/>
        </b-col>
        <b-col sm="2" style="float:right;">
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import moment from "moment";

import TrackListView from "./TrackListView.vue";
import CameraView from "./CameraView.vue";
import SchematicView from "./SchematicView.vue";
import SuggestionView from "./SuggestionView.vue";


export default {
  name: "BridgeSelected",
  data() {
    return {
      bridgeSelected: 'test',
      unsafe_filename: "notsafe.png",
      safe_filename: "safe.png",
      bridge_safe: true,
      bridgeDangerBbox: undefined,
      bridgeBbox: undefined,
      showCam: false,
      show: true,
      tracks: []
    };
  },
  components: { TrackListView, CameraView, SchematicView, SuggestionView },
  methods: {
    ...mapMutations("track", ["putTrack"]),
    getImgUrl(pic) {
      return require("../assets/" + pic);
    },
    getTracksOnBridge() {
      return this.tracks.filter(track => ['IN', 'HIDDEN'].includes(track.status)).length
    },
    frontEndTimeFormat: function(date) {
      return moment(date).format("hh:mm:ss");
    },
    receiveWebSocketData(data) {
      if (
        data["camera"] &&
        !this.cameras.map((c) => c.id).includes(data["camera"].id)
      ) {
        this.$store.state.camera.cameras.push(data["camera"]);
      }
      if (
        data["clip"] &&
        !this.clips.map((c) => c.id).includes(data["clip"].id)
      ) {
        this.$store.state.clip.clips.push(data["clip"]);
      }
      if (data["tracks"]) {
        data["tracks"].forEach((track) => {
          this.putTrack(track);
        });
      }
    },
  },
  watch: {
    bridges(newBridges) {
      const selectedBridge = newBridges.filter(
        bridge => bridge.name === this.bridgeSelected
      )[0];
      // eslint-disable-next-line
      console.log(
        "bridges updated in SchematicView: this.bridgeSelected: %s ; matching bridge: %s",
        this.bridgeSelected,
        JSON.stringify(selectedBridge)
      );
      if (selectedBridge) {
        this.bridgeBbox = {
          minx: selectedBridge.minx,
          maxx: selectedBridge.maxx,
          miny: selectedBridge.miny,
          maxy: selectedBridge.maxy
        };
        this.bridgeDangerBbox = {
          minx: selectedBridge.danger_minx,
          maxx: selectedBridge.danger_maxx,
          miny: selectedBridge.danger_miny,
          maxy: selectedBridge.danger_maxy
        };
      }
    },
    heatmap(map) {
      this.heatmap_data = [];
      var cols = map.num_cols;
      var rows = map.num_rows;
      this.heatmap_max = map.max_value * 3;
      var unsafe = false;
      for(var col = 0; col < map.cells.length; col++) {
        var col_array = map.cells[col];
        for(var row = 0; row < col_array.length; row++) {
          var val = col_array[row];
          if(val>0) {
            var x_val = parseInt((col+0.5) * this.bridgeBbox.maxx / cols);
            var y_val = parseInt((row+0.5) * this.bridgeBbox.maxy / rows);
            if(x_val > this.bridgeDangerBbox.minx && x_val < this.bridgeDangerBbox.maxx && y_val > this.bridgeDangerBbox.miny && y_val < this.bridgeDangerBbox.maxy) {unsafe = true;}
          }
        }
      }
      this.bridge_safe = !unsafe;
    },
    activeTrack(newTrack) {
      // eslint-disable-next-line
      console.log("activeTrack changed in SchematicView, showing options");
      if (newTrack) {
        this.showCam = true;
      } else {
        this.showCam = false;
      }
    },
  },
  mounted() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page {
  width: auto;
  margin: auto;
  overflow: hidden;
  position:relative;
  background-color: #f0f0f0;
  height: 100vh;
}
#status-card {
  padding: 0rem;
  margin-bottom: 1rem;
}

#track-list {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.vert_center {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.active {
  border: yellow solid 2px;
}

.safe {
  border: #5cd65a solid 4px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.unsafe {
  border: #ee1c1c solid 4px;
  box-shadow: 0 4px 8px 0 rgba(100, 0, 0, 0.2),
    0 6px 20px 0 rgba(100, 0, 0, 0.19);
}
</style>
