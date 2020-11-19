<template>
  <div class="is-flex is-flex-grow-1 is-flex-shrink-1 is-scrollable">
    <b-loading v-model="isLoading"></b-loading>
    <div v-if="!isLoading" class="columns is-flex-grow-1 is-flex-shrink-1 is-fullheight is-fullwidth">
      <div class="column is-3 is-fullheight">  
        <Rooms/>
      </div>
      <div class="column is-fullheight">
        <Chat/>
      </div>
    </div>
  </div>
</template>

<script>
import VueRouter from 'vue-router'
const { isNavigationFailure, NavigationFailureType } = VueRouter

import Rooms from '@/components/Rooms.vue';
import Chat from '@/components/Chat.vue';

export default {
  name: 'Main',
  components: { Rooms, Chat },
  data() {
    return {
    }
  },
  computed: {
    isLoading() {
      return !this.$store.state.isWsOpened;
    }
  },
  methods: {
  },
  created() {
    let ws = new WebSocket(`wss://nane.tada.team/ws?username=${encodeURIComponent(this.$store.state.login)}`);
    ws.onopen = event => {
      this.$store.commit('isWsOpened', true);
    };
    ws.onmessage = event => {
      let message = JSON.parse(event.data);
      if (this.$store.state.sendedMessage !== null && message.id === this.$store.state.sendedMessage.id) {
        this.$store.state.sendingMessageState = null;
        this.$store.state.sendedMessage = null;
      }
      if (message.room === this.$store.state.currentRoomName) {
        this.$store.commit('updateCurrentHistory', message);
      }
      if (this.$store.state.roomList !== null) {
        let room = this.$store.state.roomList.filter(room => room.name === message.room)[0];
        if (room === undefined) {
          let newRoom = {name: message.room, last_message: message}
          this.$store.commit('addNewRoom', newRoom);
        } else {
          this.$store.commit('updateRoom', message);
        }
      }
    };
    ws.onerror = event => {
      console.log('Error ws: ', event);
      this.$buefy.toast.open({
        message: `Some problem with websocket connection.`,
        type: 'is-danger',
        position: 'is-top',
        duration: 4000
      });
    };
    ws.onclose = event => {
      this.$store.commit('isWsOpened', false);
      if (!event.wasClean) {
        this.$store.dispatch('logout')
          .then(res => {
            this.$router.push('/conerr')
              .catch(err => {
                if (!isNavigationFailure(err, NavigationFailureType.redirected)) {
                  Promise.reject(err);
                }
              });
          });
      }
    };
    this.$store.dispatch('createWs', ws)
      .then(() => {})
      .catch(err => {
        console.log(err);
        this.$router.push('/conerr');
      });
  }
}
</script>