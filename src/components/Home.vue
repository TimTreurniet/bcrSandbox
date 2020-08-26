<template>
  <div class="hello">
    <b-alert v-if="!$store.state.auth.isAuthenticated" show variant="warning">You are currently not logged in and thus cannot browse the API.</b-alert>
    <br/>
    <img src='@/assets/logo-diip.png'>
    <h3>How To</h3>
    <p>
      For guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://gitlab.studiodiip.com/internal-projects/django-api-starter/-/blob/master/README.md" target="_blank" rel="noopener">readme</a>.
    </p>
    <p>
      <router-link to="bridge-overview">Bridge</router-link>
    </p>
    <h3>Frontend</h3>
    <h5>Installed CLI Plugins</h5>
    <ul>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">babel</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener">eslint</a></li>
    </ul>
    <h5>Ecosystem</h5>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a></li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
      <li><a href="https://bootstrap-vue.js.org/" target="_blank" rel="noopener">bootstrap-vue</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
  props: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

img {
  width: 250px;
}
</style>
