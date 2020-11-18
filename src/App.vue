<template>
  <div id="app" class="is-flex is-flex-direction-column is-fullheight">
    <nav class="navbar is-primary sticky-navbar">
      <div class="navbar-brand">
          <router-link class="navbar-item" to="/">Home</router-link>
      </div>
      <div class="navbar-menu is-active">
          <div class="navbar-end">
            <div class="navbar-item has-text-centered" v-if="isLoggedIn">
              <b-icon icon="user" size="is-medium" type="is-success"/>
              <span class="title is-5">{{ $store.state.login }}</span>
            </div>
            <router-link v-if="isLoggedIn" class="navbar-item" to="/logout">Logout</router-link>
          </div>
      </div>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed : {
    isLoggedIn() { 
      return this.$store.getters.isLoggedIn;
    }
  }
}
</script>

<style scope>
  .is-fullwindow {
    height: 100vh;
  }
</style>
