<template>
  <div class="is-flex is-flex-grow-1 is-flex-shrink-1 is-scrollable">
    <b-loading v-model="isLoading"></b-loading>
    <div v-if="!isLoading" class="columns is-flex-grow-1 is-flex-shrink-1 is-fullheight is-fullwidth">
      <div class="column is-3 is-fullheight">  
        <Rooms/>
      </div>
      <div class="column is-fullheight">
        <Chart/>
      </div>
    </div>
  </div>
</template>

<script>
import Rooms from './Rooms.vue';
import Chart from './Chart.vue';

export default {
  name: 'Main',
  components: { Rooms, Chart },
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
    this.$store.dispatch('createWs')
      .then(() => {})
      .catch(err => {
        console.log(err);
        this.$router.push('/500');
      });
  }
}
</script>