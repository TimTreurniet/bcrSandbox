<template>
  <b-row class="pane" id="overview">
    <b-popover target="hover" :show.sync="showHover" triggers="hover" placement="right">
          <template v-slot:title>Klik om object {{hoverTrack.id}} te bekijken</template>
          <b-img v-if="showHover" :src="hoverTrack.data && 'data:image/jpeg;base64,'+hoverTrack.data" alt="Image"></b-img>
    </b-popover>
    <h5 style="width:100%; text-align:left;">Schematisch beeld ({{timestamp}})</h5>
    <b-col>
      <b-row>
        <b-col md="4">
          <b-button
            size="lg"
            class="mb-2"
            :variant="alertVariant[0]"
            v-on:click="setActiveCamera(0)"
          >
            <b-icon icon="camera-video-fill" rotate="45"></b-icon>1
          </b-button>
        </b-col>
        <b-col md="4" offset-md="4">
          <b-button
            size="lg"
            class="mb-2"
            :variant="alertVariant[1]"
            v-on:click="setActiveCamera(1)"
          >
            <b-icon icon="camera-video-fill" rotate="125"></b-icon>2
          </b-button>
        </b-col>
      </b-row>
      <b-row ref="canvas_container" id="canvas-container">
        <b-img :src=this.getImgUrl(this.topdownFile) fluid alt="Responsive image" ref="topdown_img"></b-img>
        <heatmapjs-vue id="hover" class="heatmapjs-container" ref="heatmap" :max="heatmap_max" :min="0" :data="heatmap_data"></heatmapjs-vue>
        <canvas id="topdown-canvas" ref="topdown_canvas" ></canvas>
      </b-row>
      <b-row>
        <b-col md="4">
          <b-button
            size="lg"
            class="mb-2"
            :variant="alertVariant[2]"
            v-on:click="setActiveCamera(2)"
          >
            <b-icon icon="camera-video-fill" rotate="315"></b-icon>3
          </b-button>
        </b-col>
        <b-col md="4" offset-md="4">
          <b-button
            size="lg"
            class="mb-2"
            :variant="alertVariant[3]"
            v-on:click="setActiveCamera(3)"
          >
            <b-icon icon="camera-video-fill" rotate="225"></b-icon>4
          </b-button>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import { mapState, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";

export default {
  name: "SchematicView",
  data() {
    return {
      timestamp: "",
      bridgeSelected: "test",
      bridgeBbox: undefined,
      bridgeDangerBbox: undefined,
      testFileName: "https://placekitten.com/g/500/350",
      showCameras: true,
      topdownFile: "topdown.png",
      activeCam: -1,
      prevCam: -1,
      canvas: null,
      heat_canvas: null,
      container: null,
      canvas2d: null,
      activeClipPath: "",
      refreshed: false,
      hoverTrack: null,
      showHover: false,
      heatmap_data: [],
      heatmap_max: 0,
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
    ...mapActions("track", ["setActiveTrack"]),
    ...mapActions("camera", ["setActiveCamera"]),
    getNow() {
      this.timestamp = moment(new Date()).format("hh:mm:ss");
      var max_x = 30;
      var max_y = max_x * this.canvas.height / this.canvas.width;
      this.$store.dispatch('bridge/getHeatmap', {params:{'min_x':0, 'max_x':max_x, 'min_y':0, 'max_y':max_y, 'ncols':32, 'nrows':16}})
    },
    drawRect(track) {
      if (!(track.status === "HIDDEN" && track.resolved)) {
        var image_width = this.canvas.width;
        var image_height = this.canvas.height;
        var meter_to_pix_factor = this.canvas.width / 30;
        var x_pixel = track.lastseen_locx * meter_to_pix_factor
        var y_pixel = track.lastseen_locy * meter_to_pix_factor
        // Draw rectangle border
        this.canvas2d.lineWidth = 4;
        this.canvas2d.beginPath();
        this.canvas2d.rect(
          x_pixel,
          y_pixel,
          0.04 * image_width,
          0.15 * image_height
        );
        this.canvas2d.strokeStyle =
          track.status === "OK"
            ? "#00FF00" // light-green
            : track.status === "HIDDEN" && !track.resolved
            ? "#f00" // red
            : track.status === "HIDDEN" && track.resolved
            ? "#00FF00" // light-green
            : "#fff"; // white
        this.canvas2d.stroke();

        // Draw infill for selected object
        if (track.id) {
          if (this.activeTrack && this.activeTrack.id === track.id) {
            this.canvas2d.fillStyle = "#f00";
            this.canvas2d.fillRect(
              x_pixel,
              y_pixel,
              0.04 * image_width,
              0.15 * image_height
            );
          }
        }

        // Draw id
        this.canvas2d.fillStyle = "white";
        this.canvas2d.font = "bold 12px Arial";
        this.canvas2d.fillText(
          track.id,
          x_pixel + image_width / 300,
          y_pixel + image_height / 20
        );

        // Draw icon
        const img = new Image();
        img.src = this.getImgUrl(track.category + ".png"); // TODO fix this
        img.onload = () => {
          if (img.complete) {
            // Draw picture
            this.canvas2d.drawImage(
              img,
              x_pixel + image_width / 100,
              y_pixel,
              img.width/2.5,
              img.height/2.5
            );
          }
        };
      }
    },
    drawBridgeArea() {
      if (this.bridgeDangerBbox) {
        var meter_to_pix_factor = this.canvas.width / 30;
        var x_pixel = this.bridgeDangerBbox.minx * meter_to_pix_factor 
        var y_pixel = this.bridgeDangerBbox.miny * meter_to_pix_factor 
        var x2_pixel = this.bridgeDangerBbox.maxx * meter_to_pix_factor 
        var y2_pixel = this.bridgeDangerBbox.maxy * meter_to_pix_factor 
        this.canvas2d.lineWidth = 5;

        this.canvas2d.beginPath();
        this.canvas2d.rect(
          x_pixel,
          y_pixel,
          x2_pixel-x_pixel,
          y2_pixel-y_pixel
        );
        this.canvas2d.strokeStyle = "#f00";
        this.canvas2d.stroke();
      }
    },
    refreshDraw() {
      this.canvas.height = this.$refs["topdown_img"].height;
      this.canvas2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawBridgeArea();
      this.getTracksHidden().forEach((track) => {
        this.drawRect(track);
      });
    },
    canvasClick(x, y, w, h) {
      const that = this;
      for (var i = 0; i < that.tracks.length++; i++) {
        var track = that.tracks[i];

        try {
          if (
            x > track.lastseen_locx &&
            x < track.lastseen_locx + w &&
            y > track.lastseen_locy &&
            y < track.lastseen_locy + h &&
            track.status === "HIDDEN"
          ) {
            return track;
          }
        } catch (err) {
          return null;
        }
      }
      return null;
    },

    updateCamera(cam, force) {
      // Change style of previously selected camera and currently selected camera
      if ((this.activeCam != cam && this.showCameras) || force) {
        this.alertVariant[cam] = "primary";
        this.prevCam = this.activeCam;
        this.activeCam = cam;
        this.alertVariant[this.prevCam] = "primary-outline";
        this.$forceUpdate();
      }
    },
    frontEndTimeFormat(date) {
      return moment(date).format("hh:mm:ss");
    },
    getImgUrl(pic) {
      return require("../assets/" + pic);
    },
    getTracks() {
      return _.orderBy(this.tracks, "lastseen_timestamp", "desc");
    },
    getTracksHidden() {
      return _.orderBy(
        this.tracks.filter(track => track.status === "HIDDEN"),
        "lastseen_timestamp",
        "desc"
      );
    },
    getTracksRelevant() {
      return _.orderBy(
        this.tracks.filter(
          track =>
            (track.status === "HIDDEN" && !track.resolved) ||
            track.status === "IN" ||
            track.status === "OUT"
        ),
        "lastseen_timestamp",
        "desc"
      );
    },
    fitParent(canvas) {
      // Make it visually fill the positioned parent
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      // ...then set the internal size to match
      canvas.width = canvas.offsetWidth;
      canvas.height = this.$refs["topdown_img"].height;
    }
  },
  watch: {
    tracks() {
      this.refreshDraw();
    },
    activeTrack() {
      // eslint-disable-next-line
      console.log(
        "activeTrack changed in SchematicView, refresh schematic view"
      );
      this.refreshDraw();
    },
    activeCamera(newCamera) {
      this.updateCamera(newCamera, true);
    },
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
      for(var col = 0; col < map.cells.length; col++) {
        var col_array = map.cells[col];
        for(var row = 0; row < col_array.length; row++) {
          if(col_array[row]>0) {
            var x_pixel = parseInt((col+0.5) * this.canvas.width / cols);
            var y_pixel = parseInt((row+0.5) * this.canvas.height / rows);
            this.heatmap_data.push({x: x_pixel, y:y_pixel, value: col_array[row]});
          }
        }
      }
    }
  },
  computed: mapState({
    activeCamera: state => state.camera.active,
    activeTrack: state => state.track.active,
    bridges: state => state.bridge.bridges,
    cameras: state => state.camera.cameras,
    clips: state => state.clip.clips,
    tracks: state => state.track.tracks,
  }),
  mounted() {
    this.canvas = document.getElementById("topdown-canvas");
    this.container = document.getElementById("canvas-container");
    this.heat_canvas = document.getElementsByClassName("heatmap-canvas");
    this.canvas2d = this.canvas.getContext("2d");
    this.refreshDraw();
    this.fitParent(this.canvas);

    const that = this;
    // Add event listeners
    this.container.addEventListener(
      "click",
      e => {
        var meter_to_pix_factor = this.canvas.width / 30;
        var track = that.canvasClick(
          e.offsetX / meter_to_pix_factor,
          e.offsetY / meter_to_pix_factor,
          this.bridgeBbox.maxx/25,
          this.bridgeBbox.maxy/6
        );
        if (track != null) {
          // eslint-disable-next-line
          console.log("collision: " + track.id);
          this.setActiveTrack(track);
        } else {
          // eslint-disable-next-line
          console.log("no collision ", track);
        }
      },
      false
    );

    this.container.addEventListener(
      "mousemove",
      e => {
        var meter_to_pix_factor = this.canvas.width / 30;
        var track = that.canvasClick(
          e.offsetX / meter_to_pix_factor,
          e.offsetY / meter_to_pix_factor,
          this.bridgeBbox.maxx/25,
          this.bridgeBbox.maxy/6
        );
        if (track != null) {
          this.refreshDraw();
          this.canvas.style.cursor = "pointer";
          this.hoverTrack = track;
          this.showHover = true;
          this.refreshed = false;
        } else {
          if (!this.refreshed){this.refreshDraw(); this.refreshed = true;}
          this.canvas.style.cursor = "default";
          this.showHover = false;
        }
      },
      false
    );
  },
  created() {
    this.intervalId = setInterval(() => {
      this.getNow()
    }, 500)
  },
  beforeDestroy() {
      clearInterval(this.intervalId)
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#topdown-canvas {
  position: absolute;
}

#overview {
  height: 40vh;
}
#canvas-container {
  position: relative;
}

.active {
  border: yellow solid 2px;
}

.vert_center {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.heatmapjs-container {
    position:absolute !important;
    top: 0px;
    left:0px;
    width:100%;
    height:100%;
  }
</style>
