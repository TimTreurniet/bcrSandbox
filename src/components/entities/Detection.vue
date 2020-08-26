<template>
  <div class="">
    <h3>Detections on Database</h3>
    <p>count: {{detections.length}}</p>
    <p v-if="detections.length === 0">No Detections found</p>
    <div class="entity" v-for="(entity, index) in orderedDetections" :key="index">
      <p>{{entity}}</p>
    </div> 
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import _ from 'lodash'

export default {
  name: "Detection",
  data() {
    return {
      messages: [],
      bridgeSelected: 'test'
    };
  },
  computed: mapState({
    detections: state => state.detection.detections,
    orderedDetections: function () {
      return _.orderBy(this.detections, 'updated_at', 'desc')
    }
  }),
  methods: {
    ...mapActions('detection', [
      'addDetection', 'deleteDetection'
    ]),
    addToMessages(message) {
      this.messages.push(message)
      for (let i=0; i<message['detections'].length; i++) {
        this.detections.push(message['detections'][i])
      }
    }
  },
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
