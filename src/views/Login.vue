<template>
  <div class="is-fullheight is-flex is-flex-direction-column 
              is-justify-content-center is-align-content-center 
              is-align-items-center">
    <b-loading v-model="isLoading"></b-loading>
    <div v-if="!isLoading">
      <div class="content has-text-centered">
        <p class="title is-3">
          Welcome to Gypsy chat
        </p>
      </div>
      <b-field position="is-centered" grouped>
        <b-field label="Input nickname">
          <b-input v-model="nickname" icon="user" 
            @keyup.enter.native.exact="login"
            ref="loginInput"/>
          <button class="button is-info" @click="login">Sign in</button>
        </b-field>
      </b-field>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      nickname: '',
      isLoading: true
    }
  },
  methods: {
    login() {
      let trimedNick = this.nickname.trim();
      if (trimedNick.length === 0) {
        this.$buefy.toast.open({
          message: `Empty login`,
          type: 'is-warning',
          position: 'is-top',
          duration: 4000
        });
        return;
      }
      if (trimedNick.length > this.$store.state.serverSettings.max_username_length) {
        this.$buefy.toast.open({
          message: `Login too big. Max length ${this.$store.state.serverSettings.max_username_length} characters.`,
          type: 'is-danger',
          position: 'is-top',
          duration: 4000
        });
        return;
      }
      this.$store.dispatch('login', trimedNick)
        .then(() => {
          this.$router.push('/main');
          this.nickname = '';
        })
    }
  },
  created() {
    this.$store.dispatch('loadServerSettings')
      .then(() => {
        this.isLoading = false;
        this.$nextTick(() => {
          this.$refs.loginInput.getElement().focus();
        });
      })
      .catch(() => {
        this.$router.push('/conerr');
      });
  }
}
</script>