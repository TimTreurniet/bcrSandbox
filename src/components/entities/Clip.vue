<template>
  <div class="">
    <h3>Clips on Database</h3>
    <p>count: {{clips.length}}</p>
    <p v-if="clips.length === 0">No Clips found</p>
    <div class="entity" v-for="(entity, index) in orderedClips" :key="index">
      <p>{{entity}}</p>
    </div> 
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import _ from 'lodash'

export default {
  name: "Clip",
  data() {
    return {
      messages: [],
      bridgeSelected: 'test'
    };
  },
  computed: mapState({
    clips: state => state.clip.clips,
    orderedClips: function () {
      return _.orderBy(this.clips, 'updated_at', 'desc')
    }
  }),
  methods: {
    ...mapActions('clip', [
      'addClip', 'deleteClip'
    ]),
    addToMessages(message) {
      this.messages.push(message)
      this.clips.push(message['clip'])
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
