<template>
  <div class="">
    <h3>Cameras on Database</h3>
    <p>count: {{cameras.length}}</p>
    <p v-if="cameras.length === 0">No Cameras found</p>
    <div class="entity" v-for="(entity, index) in orderedCameras" :key="index">
      <p>{{entity}}</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import _ from 'lodash'
import ws from '@/services/wsService'

export default {
  name: "Camera",
  data() {
    return {
      wsConnection: null,
      messages: [],
      bridgeSelected: 'test'
    };
  },
  computed: mapState({
    cameras: state => state.camera.cameras,
    orderedCameras: function () {
      return _.orderBy(this.cameras, 'updated_at', 'desc')
    }
  }),
  methods: {
    ...mapActions('camera', [
      'addCamera', 'deleteCamera'
    ]),
    addToMessages(message) {
      this.messages.push(message)
      this.cameras.push(message['camera'])
    }
  },
  created() {
    this.$store.dispatch('camera/getCameras')
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
