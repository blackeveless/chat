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
      let validateNickname = JSON.parse(JSON.stringify(decodeURI(this.nickname))).trim();
      if (validateNickname === '') {
        this.$buefy.toast.open({
            duration: 5000,
            message: `Login contains illegal characters.`,
            position: 'is-top',
            type: 'is-danger'
        });
        return;
      }
      this.$store.dispatch('login', validateNickname)
        .then(() => {
          this.$router.push('/main');
          this.nickname = '';
        })
    }
  }
}
</script>