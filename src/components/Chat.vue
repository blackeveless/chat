<template>
  <div class="container is-fullheight">  
    <b-loading v-model="isLoading" :is-full-page="false"/>
    <b-notification v-show="isLoading" :closable="false">
      Loading history
    </b-notification>
    <div v-show="!isLoading" class="box is-flex is-flex-direction-column is-fullheight">
      <div class="container is-flex is-scrollable is-fullwidth has-background-light p-2 m-2">
        <div class="container is-flex is-flex-direction-column is-scrollable" ref="scrolling">
          <Message v-for="message in $store.state.currentHistory" :message="message" :key="message.created"/>
        </div>
      </div>
      <div class="container m-2">
        <b-loading v-if="$store.state.sendingMessageState === 'Sended to server'" :is-full-page="false"/>
        <div class="container textarea-wrapper">
          <textarea class="textarea" v-model="message" 
            @keydown.enter.exact.prevent
            @keyup.enter.exact="sendMessage"
            @keydown.enter.shift.exact="newline"
            placeholder="Input message"/>
          <button class="button is-info textarea-button is-small" @click="sendMessage">
            <b-icon icon="paper-plane"/>
            <span>Send</span>
          </button>
          <div v-if="$store.state.sendingMessageState !== null">{{ $store.state.sendingMessageState }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

import Message from './Message.vue';

export default {
  name: 'Chat',
  components: { Message },
  props: {
    currentRoomName: String
  },
  data() {
    return {
      message: null,
      statusMessage: null
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.currentHistory === null ? true : false;
    }
  },
  methods: {
    scrollDownHistory() {
      if (this.$refs.scrolling !== undefined) {
        this.$refs.scrolling.scrollTo(0, this.$refs.scrolling.scrollHeight);
      }
    },
    sendMessage() {
      if (this.message.length > this.$store.state.serverSettings.max_message_length) {
        this.$buefy.toast.open({
          message: `Message text too big. Max length ${this.$store.state.serverSettings.max_message_length} characters.`,
          type: 'is-danger',
          position: 'is-top',
          duration: 4000
        });
        return;
      }
      const message = {text: this.message, room: this.$store.state.currentRoomName, id: uuidv4()};
      this.$store.dispatch('sendMessage', message)
        .then(() => {
          this.message = null;
        })
        .catch(err => {
          console.log(err);
          this.$router.push('/conerr');
        });
    }
  },
  mounted() {
    this.scrollDownHistory();
  },
  updated() {
    this.scrollDownHistory();
  }
}
</script>

<style scoped>
  div >>> textarea {
    resize: none !important;
  }

  .textarea-wrapper {
    position: relative;
  }

  .textarea-button{
    position: absolute;
    bottom: 5px;
    right: 5px;
  }
</style>