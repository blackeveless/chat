<template>
  <div>
    <div class="content has-text-centered">
      <p class="title is-3">
        Welcome to Gypsy chat
      </p>
    </div>
    <b-field position="is-centered" grouped>
      <b-field label="Input nickname">
        <b-input v-model="nickname" icon="user" 
          @keyup.enter.native.exact="login"
          :autofocus="true"/>
        <button class="button is-info" @click="login">Sign in</button>
      </b-field>
    </b-field>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      nickname: ''
    }
  },
  methods: {
    login() {
      if (this.nickname === '') return;
      if (this.nickname.length > 50) {
        this.$buefy.toast.open({
          message: `Login too big. Max length 50 characters.`,
          type: 'is-danger',
          position: 'is-top',
          duration: '4000'
        });
        return;
      }
      this.$store.dispatch('login', this.nickname)
        .then(() => {
          this.$router.push('/main');
          this.nickname = '';
        })
    }
  }
}
</script>