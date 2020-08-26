<template>
  <div class="">
    <h3>Bridges on Database</h3>
    <p>count: {{bridges.length}}</p>
    <p v-if="bridges.length === 0">No Bridges found</p>

		<b-container>
      <b-row class="entity" v-for="(entity, index) in orderedBridges" :key="index">
          <p>{{entity}}</p>
          <p>{{heatmap}}</p>
      </b-row>
		</b-container >    
    <!-- <div class="entity pre-scrollable" v-for="(entity, index) in orderedBridges" :key="index">
        <p>{{entity}}</p>
    </div> -->
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import _ from 'lodash'

export default {
  name: "Bridge",
  data() {
    return {
      messages: [],
      bridgeSelected: 'test'
    };
  },
  computed: mapState({
    bridges: state => state.bridge.bridges,
    heatmap: state => state.bridge.heatmap,
    orderedBridges: function () {
      return _.orderBy(this.bridges, 'updated_at', 'desc')
    }
  }),
  methods: {
    ...mapActions('bridge', [
      'addBridge', 'deleteBridge'
    ]),
  },
  created() {
    this.$store.dispatch('bridge/getBridges')
    this.$store.dispatch('bridge/getHeatmap')
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
