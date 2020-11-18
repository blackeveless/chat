<template>
  <article class="message is-small is-light" :class="[isSelfMessage ? 'is-success' : 'is-info']">
    <div class="message-body">
      <div class="columns">
        <div class="column">
          <span class="title is-6 is-warning">
            {{ message.sender.username }}
          </span>
        </div>
        <div class="column has-text-right">
          <span>
            {{ new Date(message.created).toLocaleString(currentLocale, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'}) }}
          </span>
        </div>
      </div>
      <p>
        {{ message.text }}
      </p>
    </div>
  </article>
</template>

<script>
import {getLang} from '@/main';

export default {
  name: 'Message',
  props: {
    message: Object
  },
  data() {
    return {
      currentLocale: 'en-US'
    }
  },
  computed: {
    isSelfMessage() {
      return decodeURI(JSON.stringify(this.$store.state.login)) === decodeURI(JSON.stringify(this.message.sender.username));
    }
  },
  created() {
    this.currentLocale = getLang();
  }
}
</script>