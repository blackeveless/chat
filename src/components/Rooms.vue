<template>
  <div class="container is-fullheight">
    <b-loading v-model="isLoading" :is-full-page="false"></b-loading>
    <b-notification v-if="isLoading" :closable="false">
      Loading rooms
    </b-notification>
    <div v-else class="box is-flex is-flex-direction-column is-fullheight">
      <b-field label="Rooms">
        <b-input v-model="newRoom" ref="inputRooms" type="text" placeholder="input new room to add"
          @keyup.enter.native="createNewRoom"
          icon-right="users" icon-right-clickable
          @icon-right-click="createNewRoom"/>
      </b-field>
      <b-table class="is-flex is-flex-direction-column is-scrollable is-fullwidth has-background-light p-2"
        :data="$store.state.roomList"  
        :selected.sync="currentRoom" :show-header="false"
        @select="updateHistory">
        <b-table-column field="name" v-slot="props">
            {{ props.row.name }}
        </b-table-column>
      </b-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Rooms',
  data() {
    return {
      isLoading: true,
      currentRoom: {},
      newRoom: null
    }
  },
  methods: {
    updateHistory(newRoom, oldRoom) {
      this.currentRoom = newRoom;
      this.$store.dispatch('loadHistory', this.currentRoom.name)
        .then(() => this.isLoading = false)
        .catch(err => {
          console.log(err);
          this.$router.push('/500');
        });
    },
    createNewRoom() {
      if (this.newRoom.length > 50) {
        this.$buefy.toast.open({
          message: `Room name too big. Max length 50 characters.`,
          type: 'is-danger',
          position: 'is-top',
          duration: '4000'
        });
        return;
      }
      let newRoom = {name: this.newRoom, last_message: {}};
      this.$store.dispatch('createNewRoom', newRoom)
        .then(() => {
          this.$refs.inputRooms.getElement().blur();
          this.currentRoom = this.$store.state.roomList.filter(room => room.name === this.newRoom)[0];
          this.newRoom = null;
          this.updateHistory(this.currentRoom);
        })
        .catch(err => console.log(err));
    }
  },
  created() {
    this.$store.dispatch('loadRooms')
      .then(() => {
        this.currentRoom = this.$store.state.roomList[0];
        this.isLoading = false;
        this.$store.dispatch('loadHistory', this.currentRoom.name)
          .then(() => this.isLoading = false)
          .catch(err => console.log(err));
      })
      .catch(err => {
        console.log(err);
        this.$router.push('/500');
      });
  }
}
</script>