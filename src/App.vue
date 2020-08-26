<template>
  <div id="app">
    <!-- NavBar -->
    <b-navbar id="navbar" sticky type="dark" variant="dark" class="ml-auto">
      <b-navbar-brand>Bridge Calamity Detector</b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item v-if="debug" :to="{ name: 'home' }">Home</b-nav-item>
        <b-nav-item
          v-if="$store.state.auth.isAuthenticated"
          :to="{ name: 'bridge-overview' }"
        >Bridge Overview</b-nav-item>
        <b-nav-item
          v-if="$store.state.auth.isAuthenticated"
          :to="{ name: 'bridge-selected', params: {name: 'test'} }"
        >Bridge Selected (test)</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item v-if="debug" href="http://localhost:8000/api/">API docs</b-nav-item>
        <b-nav-item>
          <Login v-if="!$store.state.auth.isAuthenticated">Login</Login>
          <b-link
            v-if="$store.state.auth.isAuthenticated"
            v-on:click="onClickLogout"
          >Logout {{ this.$store.state.auth.user["username"]}}</b-link>
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <!-- View -->
    <router-view id="router-view" class="page" />
  </div>
</template>

<script>
import { mapActions } from "vuex";

import Login from "@/components/Login";

export default {
  name: "Base",
  components: {
    Login
  },
  data() {
    return {
		debug: false,
    }
  },
  methods: {
    returnHome() {
      this.$router.push({ name: "home" });
    },
    ...mapActions("auth", ["authenticate", "logout"]),
    onClickLogout() {
      this.logout();
      this.returnHome();
    }
  },
  created() {
    this.authenticate();
  }
};
</script>

<style>
body {
  overflow: hidden;
  height: 100%;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #f0f0f0;
  height: 100%;
}

.pane {
  background-color: #ffffff;
  margin: 1vh !important;
  padding: 1rem;
}
.pane h3 {
  text-align: left;
}

h3 {
  margin: 0px 0 0;
}
h5 {
  clear: both;
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
  color: #ffffff;
}
p {
  font-size: 1rem;
}
.small_text {
  font-size: 0.8rem;
}
:focus {
  outline: 0 !important;
}

/* Header & navbar */
.nav-item.nav-item.nav-item a {
  color: whitesmoke;
}
.nav-item.nav-item.nav-item ul {
  background-color: #3d4348;
}
.nav-item.nav-item.nav-item a {
  color: whitesmoke;
}
.nav-item.nav-item.nav-item ul {
  background-color: #3d4348;
}
.header {
  background-color: #ffffff;
  padding-left: 20rem;
}
</style>
